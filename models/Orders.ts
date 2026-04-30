// ============================================================================
// ORDERS MODULE
// ============================================================================
// Core Purpose: Capture client intent with validation gates to prevent errors
// Interconnections:
//   - Pulls from Price List (pricing, stock validation)
//   - Feeds into Documents (when CONFIRMED → ISSUED)
//   - Triggers Packaging workflow (status: PACKING → PACKED)
//   - Links to Clients (relationship view, order history)
//   - Staff actions auto-log to Time Management
//   - Messages thread links to Messaging module
// ============================================================================

import mongoose, { Schema, Document, Types, Model } from 'mongoose';
import { IProduct } from './Products'; // Import from previous model

// ----------------------------------------------------------------------------
// TYPE DEFINITIONS
// ----------------------------------------------------------------------------

/**
 * Order status workflow
 * DRAFT → CONFIRMED → PACKING → PACKED → DELIVERED → COMPLETED
 *                    ↓
 *              CANCELLED (terminal)
 */
export type OrderStatus = 
  | 'DRAFT'       // Initial creation, editable
  | 'CONFIRMED'   // Locked, stock reserved, ready for packaging
  | 'PACKING'     // In packaging workflow
  | 'PACKED'      // All items verified, ready for delivery
  | 'DELIVERED'   // Handed to client/delivery service
  | 'COMPLETED'   // Payment settled, order closed
  | 'CANCELLED';  // Terminal state, stock released

/**
 * Packaging verification checkpoint
 * Each item must be physically scanned and photographed
 * This is the "wrong items" prevention mechanism
 */
export interface IItemVerification {
  scanned: boolean;           // Barcode/QR scan confirmed
  scannedAt?: Date;          // When verification occurred
  scannedBy?: Types.ObjectId; // Staff member who verified
  photoUrl?: string;         // Photo of packed item (evidence)
  notes?: string;            // Any discrepancies noted
}

/**
 * Order line item with immutable snapshots
 * Prevents price changes and product edits after order creation
 */
export interface IOrderItem {
  product: Types.ObjectId;    // Reference to Product (for analytics)
  sku: string;               // Snapshot - never changes even if SKU updated
  name: string;              // Snapshot of product name at order time
  description?: string;      // Snapshot of description
  category: string;          // Snapshot for reporting
  
  quantity: number;
  unitPrice: number;         // Snapshot from Price List tier
  total: number;             // quantity * unitPrice (stored for speed)
  
  // Packaging verification (per-item checkpoint)
  verified: IItemVerification;
  
  // Stock tracking
  reservedQuantity: number;  // How much stock is held for this item
}

/**
 * Delivery destination snapshot
 * Prevents "wrong destination" errors by capturing exact details
 */
export interface IDestination {
  deliveryPointId: Types.ObjectId;  // Reference to DeliveryPoint collection
  name: string;                     // Snapshot: "Main Office", "Warehouse B"
  address: string;                  // Full address at time of order
  contactName?: string;             // Who receives
  contactPhone?: string;            // Delivery contact
  instructions?: string;            // "Ring bell twice", "Loading dock"
  coordinates?: {                   // For map integration
    lat: number;
    lng: number;
  };
}

/**
 * Order message/communication thread
 * Embedded to keep all order context in one document
 */
export interface IOrderMessage {
  _id: Types.ObjectId;
  from: Types.ObjectId;        // Staff member or System
  fromModel: 'Staff' | 'System' | 'Client'; // Who sent it
  text: string;
  timestamp: Date;
  isInternal: boolean;         // true = staff only, false = client-visible
  attachments?: string[];      // File URLs
  messageType: 'text' | 'status_update' | 'delivery_note' | 'system';
}

/**
 * Payment tracking
 */
export interface IPaymentInfo {
  method: 'cash' | 'mpesa' | 'bank_transfer' | 'cheque' | 'credit';
  reference?: string;          // Transaction ID
  amount: number;
  paidAt?: Date;
  paidBy?: string;             // Name of payer if different from client
  verifiedBy?: Types.ObjectId; // Staff who confirmed payment
}

/**
 * Order document interface
 * The central transaction record that drives downstream workflows
 */
export interface IOrder extends Document {
  recalculateTotals(): void;
  // --- Identity ---
  orderNumber: string;          // Human-readable: ORD-2024-000001
  client: Types.ObjectId;       // Links to Clients module
  
  // --- Destination (Critical: prevents wrong delivery) ---
  destination: IDestination;   // Snapshot of delivery details
  
  // --- Items (Critical: prevents wrong items) ---
  items: IOrderItem[];          // Line items with immutable snapshots
  
  // --- Financial Summary ---
  subtotal: number;            // Sum of item totals
  taxRate: number;             // Percentage (e.g., 16 for 16%)
  tax: number;                 // Calculated tax amount
  total: number;               // subtotal + tax
  deposit: number;             // Amount paid upfront
  balance: number;               // total - deposit (remaining)
  payments: IPaymentInfo[];      // Payment history
  
  // --- Workflow State ---
  status: OrderStatus;
  statusHistory: {               // Audit trail of status changes
    status: OrderStatus;
    changedAt: Date;
    changedBy: Types.ObjectId;
    reason?: string;
  }[];
  
  // --- Assignment & Accountability ---
  createdBy: Types.ObjectId;    // Sales rep who created order
  assignedTo?: Types.ObjectId;  // Delivery responsible
  approvedBy?: Types.ObjectId;    // Manager approval for high-value
  
  // --- Timing ---
  orderDate: Date;               // When order was placed
  requestedDeliveryDate: Date;  // Client's preferred date
  promisedDeliveryDate?: Date;  // Our commitment (may differ from request)
  actualDeliveryDate?: Date;    // When actually delivered
  
  // --- Communication ---
  messages: IOrderMessage[];    // Thread of all communications
  
  // --- Document Links ---
  generatedDocuments: {         // Links to created invoices/delivery notes
    type: 'invoice' | 'delivery_note' | 'receipt';
    documentId: Types.ObjectId;
    number: string;
    createdAt: Date;
  }[];
  
  // --- Audit & Versioning ---
  version: number;              // Incremented on every modification
  isLocked: boolean;            // True when CONFIRMED or beyond
  cancellationReason?: string;  // If status is CANCELLED
  createdAt: Date;
  updatedAt: Date;
}

// ----------------------------------------------------------------------------
// SCHEMA DEFINITIONS
// ----------------------------------------------------------------------------

const ItemVerificationSchema = new Schema<IItemVerification>({
  scanned: {
    type: Boolean,
    default: false
  },
  scannedAt: Date,
  scannedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  },
  photoUrl: {
    type: String,
    validate: {
      validator: (v: string) => !v || /^https?:\/\/.+/.test(v),
      message: 'Photo must be a valid URL'
    }
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, { _id: false });

const OrderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  sku: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  category: {
    type: String,
    required: true,
    index: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number'
    }
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  verified: {
    type: ItemVerificationSchema,
    default: () => ({ scanned: false })
  },
  reservedQuantity: {
    type: Number,
    default: 0,
    min: 0
  }
}, { _id: true }); // Each line item gets an ID for reference

const DestinationSchema = new Schema<IDestination>({
  deliveryPointId: {
    type: Schema.Types.ObjectId,
    ref: 'DeliveryPoint',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  contactName: String,
  contactPhone: String,
  instructions: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
}, { _id: false });

const OrderMessageSchema = new Schema<IOrderMessage>({
  from: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'messages.fromModel'
  },
  fromModel: {
    type: String,
    required: true,
    enum: ['Staff', 'System', 'Client']
  },
  text: {
    type: String,
    required: true,
    maxlength: 2000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isInternal: {
    type: Boolean,
    default: false
  },
  attachments: [String],
  messageType: {
    type: String,
    enum: ['text', 'status_update', 'delivery_note', 'system'],
    default: 'text'
  }
}, { _id: true });

const PaymentInfoSchema = new Schema<IPaymentInfo>({
  method: {
    type: String,
    enum: ['cash', 'mpesa', 'bank_transfer', 'cheque', 'credit'],
    required: true
  },
  reference: String,
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paidAt: Date,
  paidBy: String,
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  }
}, { _id: true });

// ----------------------------------------------------------------------------
// MAIN ORDER SCHEMA
// ----------------------------------------------------------------------------

const OrderSchema = new Schema<IOrder>({
  // --- Identity ---
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true
  },

  // --- Destination (Critical validation point) ---
  destination: {
    type: DestinationSchema,
    required: [true, 'Destination is mandatory - prevents wrong delivery']
  },

  // --- Items (Immutable snapshots) ---
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: {
      validator: (items: IOrderItem[]) => items.length > 0,
      message: 'Order must contain at least one item'
    }
  },

  // --- Financials ---
  subtotal: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  taxRate: {
    type: Number,
    default: 16, // 16% VAT default
    min: 0,
    max: 100
  },
  tax: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  deposit: {
    type: Number,
    default: 0,
    min: 0
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  payments: [PaymentInfoSchema],

  // --- Workflow ---
  status: {
    type: String,
    enum: ['DRAFT', 'CONFIRMED', 'PACKING', 'PACKED', 'DELIVERED', 'COMPLETED', 'CANCELLED'],
    default: 'DRAFT',
    index: true
  },
  
  statusHistory: [{
    status: {
      type: String,
      enum: ['DRAFT', 'CONFIRMED', 'PACKING', 'PACKED', 'DELIVERED', 'COMPLETED', 'CANCELLED']
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
      required: true
    },
    reason: String
  }],

  // --- Assignment ---
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    index: true
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  },

  // --- Timing ---
  orderDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  requestedDeliveryDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(this: IOrder, v: Date) {
        return v >= this.orderDate;
      },
      message: 'Requested delivery date cannot be before order date'
    }
  },
  promisedDeliveryDate: Date,
  actualDeliveryDate: Date,

  // --- Communication ---
  messages: [OrderMessageSchema],

  // --- Document Links ---
  generatedDocuments: [{
    type: {
      type: String,
      enum: ['invoice', 'delivery_note', 'receipt'],
      required: true
    },
    documentId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    number: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // --- Audit ---
  version: {
    type: Number,
    default: 1
  },
  isLocked: {
    type: Boolean,
    default: false,
    index: true
  },
  cancellationReason: String

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ----------------------------------------------------------------------------
// INDEXES FOR PERFORMANCE & VALIDATION
// ----------------------------------------------------------------------------

// Client order history lookup
OrderSchema.index({ client: 1, orderDate: -1 });

// Delivery scheduling
OrderSchema.index({ promisedDeliveryDate: 1, status: 1 });

// Active orders by assignee
OrderSchema.index({ assignedTo: 1, status: 1 });

// Packaging queue (orders ready to pack)
OrderSchema.index({ status: 1, requestedDeliveryDate: 1 });

// High-value order approval tracking
OrderSchema.index({ total: -1, approvedBy: 1 });

// ----------------------------------------------------------------------------
// VIRTUALS
// ----------------------------------------------------------------------------

/**
 * Check if all items are verified (ready for delivery)
 */
OrderSchema.virtual('allItemsVerified').get(function(this: IOrder) {
  if (this.items.length === 0) return false;
  return this.items.every(item => item.verified.scanned);
});

/**
 * Count of verified vs total items
 */
OrderSchema.virtual('verificationProgress').get(function(this: IOrder) {
  const verified = this.items.filter(i => i.verified.scanned).length;
  return {
    verified,
    total: this.items.length,
    percentage: Math.round((verified / this.items.length) * 100)
  };
});

/**
 * Is this a high-value order requiring approval?
 */
OrderSchema.virtual('requiresApproval').get(function(this: IOrder) {
  const HIGH_VALUE_THRESHOLD = 100000; // Configurable
  return this.total >= HIGH_VALUE_THRESHOLD && !this.approvedBy;
});

/**
 * Days until promised delivery
 */
OrderSchema.virtual('daysUntilDelivery').get(function(this: IOrder) {
  if (!this.promisedDeliveryDate) return null;
  const diff = this.promisedDeliveryDate.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// ----------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------

/**
 * Calculate financial totals from items
 * Called automatically before save
 */
OrderSchema.methods.recalculateTotals = function(): void {
  this.subtotal = this.items.reduce((sum: any, item: { total: any; }) => sum + item.total, 0);
  this.tax = Math.round(this.subtotal * (this.taxRate / 100) * 100) / 100;
  this.total = this.subtotal + this.tax;
  this.balance = this.total - this.deposit - this.payments.reduce((sum: any, p: { amount: any; }) => sum + p.amount, 0);
};

/**
 * Add item to order (only allowed in DRAFT status)
 * Automatically snapshots product details from Price List
 */
OrderSchema.methods.addItem = async function(
  product: IProduct,
  quantity: number,
  priceTier: 'retail' | 'wholesale' | 'special'
): Promise<void> {
  if (this.status !== 'DRAFT') {
    throw new Error('Cannot modify items after order is confirmed');
  }
  
  const unitPrice = product.getPriceForTier(priceTier);
  const total = Math.round(unitPrice * quantity * 100) / 100;
  
  this.items.push({
    product: product._id,
    sku: product.sku,
    name: product.name,
    description: product.description,
    category: product.category,
    quantity,
    unitPrice,
    total,
    verified: { scanned: false },
    reservedQuantity: 0
  } as IOrderItem);
  
  this.recalculateTotals();
  this.version += 1;
};

/**
 * Confirm order - locks it and reserves stock
 * Critical transition point: DRAFT → CONFIRMED
 */
OrderSchema.methods.confirm = async function(
  confirmedBy: Types.ObjectId
): Promise<void> {
  if (this.status !== 'DRAFT') {
    throw new Error(`Cannot confirm order in ${this.status} status`);
  }
  
  if (!this.destination || !this.destination.address) {
    throw new Error('Destination address is mandatory');
  }
  
  // Reserve stock for each item
  const Product = mongoose.model<IProduct>('Product');
  
  for (const item of this.items) {
    const product = await Product.findById(item.product);
    if (!product) throw new Error(`Product not found: ${item.sku}`);
    
    const reserved = await product.reserveStock(item.quantity);
    if (!reserved) {
      throw new Error(`Insufficient stock for ${item.sku}. Available: ${product.stockQuantity}`);
    }
    
    item.reservedQuantity = item.quantity;
  }
  
  // Lock the order
  this.status = 'CONFIRMED';
  this.isLocked = true;
  this.version += 1;
  
  this.statusHistory.push({
    status: 'CONFIRMED',
    changedBy: confirmedBy,
    reason: 'Order confirmed by sales rep'
  });
  
  // Auto-log to Time Management (staff action)
  this.addSystemMessage(`Order confirmed by staff ${confirmedBy}`);
};

/**
 * Start packaging workflow
 * CONFIRMED → PACKING
 */
OrderSchema.methods.startPacking = async function(
  startedBy: Types.ObjectId
): Promise<void> {
  if (this.status !== 'CONFIRMED') {
    throw new Error('Order must be confirmed before packing');
  }
  
  this.status = 'PACKING';
  this.statusHistory.push({
    status: 'PACKING',
    changedBy: startedBy
  });
  
  this.addSystemMessage('Packaging workflow started');
};

/**
 * Verify item during packaging
 * Scans SKU, takes photo, marks as verified
 */
OrderSchema.methods.verifyItem = async function(
  itemIndex: number,
  scannedBy: Types.ObjectId,
  photoUrl?: string,
  notes?: string
): Promise<void> {
  if (this.status !== 'PACKING') {
    throw new Error('Can only verify items during PACKING status');
  }
  
  const item = this.items[itemIndex];
  if (!item) throw new Error('Item not found');
  
  // Validate SKU matches (prevent wrong items)
  // In real implementation, compare scanned SKU with item.sku
  
  item.verified = {
    scanned: true,
    scannedAt: new Date(),
    scannedBy,
    photoUrl,
    notes
  };
  
  // Check if all items verified → auto-advance to PACKED
  if (this.allItemsVerified) {
    this.status = 'PACKED';
    this.statusHistory.push({
      status: 'PACKED',
      changedBy: scannedBy,
      reason: 'All items verified'
    });
  }
  
  this.version += 1;
};

/**
 * Cancel order - releases reserved stock
 */
OrderSchema.methods.cancel = async function(
  cancelledBy: Types.ObjectId,
  reason: string
): Promise<void> {
  if (['DELIVERED', 'COMPLETED'].includes(this.status)) {
    throw new Error('Cannot cancel delivered or completed orders');
  }
  
  // Release stock reservations
  const Product = mongoose.model<IProduct>('Product');
  
  for (const item of this.items) {
    if (item.reservedQuantity > 0) {
      const product = await Product.findById(item.product);
      if (product) {
        await product.releaseStock(item.reservedQuantity);
      }
      item.reservedQuantity = 0;
    }
  }
  
  this.status = 'CANCELLED';
  this.cancellationReason = reason;
  this.isLocked = true;
  
  this.statusHistory.push({
    status: 'CANCELLED',
    changedBy: cancelledBy,
    reason
  });
  
  this.addSystemMessage(`Order cancelled: ${reason}`);
};

/**
 * Add message to thread
 */
OrderSchema.methods.addMessage = function(
  from: Types.ObjectId,
  fromModel: 'Staff' | 'System' | 'Client',
  text: string,
  isInternal: boolean = false,
  attachments?: string[]
): void {
  this.messages.push({
    from,
    fromModel,
    text,
    isInternal,
    attachments: attachments || [],
    messageType: fromModel === 'System' ? 'system' : 'text',
    timestamp: new Date()
  } as IOrderMessage);
};

/**
 * Add system-generated message
 */
OrderSchema.methods.addSystemMessage = function(text: string): void {
  this.addMessage(
    new Types.ObjectId('000000000000000000000000'), // System ID
    'System',
    text,
    false // Client-visible
  );
};

// ----------------------------------------------------------------------------
// STATICS
// ----------------------------------------------------------------------------

/**
 * Generate next order number
 * Format: ORD-YYYY-XXXXXX (sequential per year)
 */
OrderSchema.statics.generateOrderNumber = async function(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `ORD-${year}-`;
  
  const lastOrder = await this.findOne(
    { orderNumber: { $regex: `^${prefix}` } },
    { orderNumber: 1 },
    { sort: { orderNumber: -1 } }
  );
  
  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }
  
  return `${prefix}${sequence.toString().padStart(6, '0')}`;
}

/**
 * Get packaging queue (orders ready to pack)
 */
OrderSchema.statics.getPackagingQueue = function() {
  return this.find({ status: 'CONFIRMED' })
    .sort({ requestedDeliveryDate: 1 })
    .populate('client', 'name phone')
    .populate('items.product', 'sku name photos');
};

/**
 * Get orders requiring approval
 */
OrderSchema.statics.getPendingApprovals = function(threshold: number = 100000) {
  return this.find({
    total: { $gte: threshold },
    approvedBy: { $exists: false },
    status: { $nin: ['CANCELLED', 'COMPLETED'] }
  }).sort({ total: -1 });
};

// ----------------------------------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------------------------------

/**
 * Pre-save: Auto-calculate totals, validate status transitions
 */
/*OrderSchema.pre('save', async function(next) {
  // Recalculate financials if items modified
  if (this.isModified('items')) {
    this.recalculateTotals();
  }
  
  // Validate locked orders aren't being modified
  if (!this.isNew && this.isModified() && this.isLocked) {
    const allowedFields = ['status', 'messages', 'payments', 'actualDeliveryDate', 'generatedDocuments'];
    const modifiedPaths = this.modifiedPaths();
    const hasIllegalChanges = modifiedPaths.some(p => !allowedFields.includes(p.split('.')[0]));
    
    if (hasIllegalChanges) {
      throw new Error('Order is locked - only status, payments, and delivery updates allowed');
    }
  }
  
  // Increment version on every save
  if (!this.isNew) {
    this.version += 1;
  }
  
  //next();
});*/

/**
 * Pre-save: Auto-calculate totals, validate status transitions
 */
OrderSchema.pre<IOrder>('save', async function(next) {
  // Recalculate financials if items modified
  if (this.isModified('items')) {
    // Use 'this' as IOrder
    (this as IOrder).recalculateTotals();
  }
  
  // Validate locked orders aren't being modified
  if (!this.isNew && this.isModified() && this.isLocked) {
    const allowedFields = ['status', 'messages', 'payments', 'actualDeliveryDate', 'generatedDocuments'];
    const modifiedPaths = this.modifiedPaths();
    const hasIllegalChanges = modifiedPaths.some(p => !allowedFields.includes(p.split('.')[0]));
    
    if (hasIllegalChanges) {
      throw new Error('Order is locked - only status, payments, and delivery updates allowed');
    }
  }
  
  // Increment version on every save
  if (!this.isNew) {
    (this as IOrder).version += 1;
  }
  
  //next();
});

/**
 * Post-save: Trigger side effects
 */
OrderSchema.post('save', async function(doc) {
  // Log to Time Management if status changed
  if (doc.modifiedPaths().includes('status')) {
    // Integration point: Time Management module
    console.log(`[TimeLog] Order ${doc.orderNumber} status: ${doc.status}`);
  }
});

// ----------------------------------------------------------------------------
// MODEL EXPORT
// ----------------------------------------------------------------------------

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;

// ============================================================================
// INTEGRATION EXAMPLES
// ============================================================================

/**
 * PRICE LIST INTEGRATION:
 * 
 * // Create order from client request
 * const order = new Order({
 *   client: clientId,
 *   destination: { ... },
 *   requestedDeliveryDate: new Date('2024-02-15')
 * });
 * 
 * // Add items with price lookup
 * const product = await Product.findOne({ sku: 'PAPER-A4' });
 * await order.addItem(product, 10, client.category); // 'wholesale'
 * 
 * // Confirm with stock validation
 * await order.confirm(currentStaffId);
 */

/**
 * PACKAGING INTEGRATION:
 * 
 * // Start packaging
 * await order.startPacking(staffId);
 * 
 * // Scan items
 * await order.verifyItem(0, staffId, photoUrl);
 * 
 * // Check progress
 * console.log(order.verificationProgress); // { verified: 2, total: 5, percentage: 40 }
 */

/**
 * DOCUMENTS INTEGRATION:
 * 
 * // When order PACKED, generate invoice
 * order.generatedDocuments.push({
 *   type: 'invoice',
 *   documentId: newInvoice._id,
 *   number: 'INV-2024-001234'
 * });
 * await order.save();
 */

/**
 * DASHBOARD AGGREGATION:
 * 
 * // Today's orders
 * const todayOrders = await Order.find({
 *   orderDate: { $gte: todayStart, $lte: todayEnd }
 * }).populate('client', 'name');
 * 
 * // Revenue by status
 * const revenueByStatus = await Order.aggregate([
 *   { $match: { status: { $nin: ['CANCELLED'] } } },
 *   { $group: { _id: '$status', total: { $sum: '$total' }, count: { $sum: 1 } } }
 * ]);
 */
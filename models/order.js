// models/order.model.js
import mongoose from 'mongoose';

// Order Status enum
const OrderStatus = {
    DRAFT: 'DRAFT',
    CONFIRMED: 'CONFIRMED',
    PACKING: 'PACKING',
    PACKED: 'PACKED',
    DELIVERED: 'DELIVERED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

// Payment Methods enum
const PaymentMethod = {
    CASH: 'cash',
    MPESA: 'mpesa',
    BANK_TRANSFER: 'bank_transfer',
    CHEQUE: 'cheque',
    CREDIT: 'credit'
};

// Message Sender Types enum
const MessageFromModel = {
    STAFF: 'Staff',
    SYSTEM: 'System',
    CLIENT: 'Client'
};

// Message Types enum
const MessageType = {
    TEXT: 'text',
    STATUS_UPDATE: 'status_update',
    DELIVERY_NOTE: 'delivery_note',
    SYSTEM: 'system'
};

// Coordinates schema
const coordinatesSchema = new mongoose.Schema({
    lat: { type: Number },
    lng: { type: Number }
}, { _id: false });

// Item Verification schema
const itemVerificationSchema = new mongoose.Schema({
    scanned: { type: Boolean, default: false },
    scannedAt: { type: Date, default: null },
    scannedBy: { type: String, default: null },
    photoUrl: { type: String, default: '' },
    notes: { type: String, default: '' }
}, { _id: false });

// Order Item schema
const orderItemSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    product: { type: String, default: null },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    verified: { type: itemVerificationSchema, default: () => ({}) },
    reservedQuantity: { type: Number, default: 0 }
}, { _id: false });

// Destination schema
const destinationSchema = new mongoose.Schema({
    deliveryPointId: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactName: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    instructions: { type: String, default: '' },
    coordinates: { type: coordinatesSchema, default: null }
}, { _id: false });

// Payment Info schema
const paymentInfoSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    method: { 
        type: String, 
        enum: Object.values(PaymentMethod),
        required: true 
    },
    reference: { type: String, default: '' },
    amount: { type: Number, required: true, min: 0 },
    paidAt: { type: Date, default: null },
    paidBy: { type: String, default: '' },
    verifiedBy: { type: String, default: null }
}, { _id: false });

// Status History Entry schema
const statusHistoryEntrySchema = new mongoose.Schema({
    status: { 
        type: String, 
        enum: Object.values(OrderStatus),
        required: true 
    },
    changedAt: { type: Date, required: true },
    changedBy: { type: String, required: true },
    reason: { type: String, default: '' }
}, { _id: false });

// Order Message schema
const orderMessageSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    from: { type: String, required: true },
    fromModel: { 
        type: String, 
        enum: Object.values(MessageFromModel),
        required: true 
    },
    text: { type: String, required: true },
    timestamp: { type: Date, required: true },
    isInternal: { type: Boolean, default: false },
    attachments: { type: [String], default: [] },
    messageType: { 
        type: String, 
        enum: Object.values(MessageType),
        default: MessageType.TEXT 
    }
}, { _id: false });

// Generated Document schema
const generatedDocumentSchema = new mongoose.Schema({
    type: { type: String, required: true },
    documentId: { type: String, required: true },
    number: { type: String, required: true },
    createdAt: { type: Date, required: true }
}, { _id: false });

// MAIN ORDER SCHEMA
const orderSchema = new mongoose.Schema({
    // --- Identity ---
    _id: { type: String, required: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    client: { type: String, required: true, index: true },
    
    // --- Destination ---
    destination: { type: destinationSchema, required: true },
    
    // --- Items ---
    items: { type: [orderItemSchema], required: true, default: [] },
    
    // --- Financial Summary ---
    subtotal: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, required: true, default: 16 },
    tax: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    deposit: { type: Number, required: true, min: 0, default: 0 },
    balance: { type: Number, required: true, min: 0 },
    payments: { type: [paymentInfoSchema], default: [] },
    
    // --- Workflow State ---
    status: { 
        type: String, 
        enum: Object.values(OrderStatus),
        required: true,
        index: true 
    },
    statusHistory: { type: [statusHistoryEntrySchema], default: [] },
    
    // --- Assignment & Accountability ---
    createdBy: { type: String, required: true },
    assignedTo: { type: String, default: null, index: true },
    approvedBy: { type: String, default: null },
    
    // --- Timing ---
    orderDate: { type: Date, required: true, index: true },
    requestedDeliveryDate: { type: Date, default: null },
    promisedDeliveryDate: { type: Date, default: null, index: true },
    actualDeliveryDate: { type: Date, default: null },
    
    // --- Communication ---
    messages: { type: [orderMessageSchema], default: [] },
    
    // --- Document Links ---
    generatedDocuments: { type: [generatedDocumentSchema], default: [] },
    
    // --- Audit & Versioning ---
    version: { type: Number, required: true, default: 1 },
    isLocked: { type: Boolean, required: true, default: false },
    cancellationReason: { type: String, default: '' },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
}, { 
    collection: 'orders',
    _id: false,
    timestamps: true 
});

// Indexes for common queries
orderSchema.index({ status: 1, promisedDeliveryDate: 1 });
orderSchema.index({ assignedTo: 1, status: 1 });
orderSchema.index({ 'items.verified.scanned': 1 });

// Pre-save middleware to update timestamps
orderSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Order Statistics Schema (for aggregated stats)
const orderStatsSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    totalOrders: { type: Number, default: 0 },
    byStatus: {
        [OrderStatus.DRAFT]: { type: Number, default: 0 },
        [OrderStatus.CONFIRMED]: { type: Number, default: 0 },
        [OrderStatus.PACKING]: { type: Number, default: 0 },
        [OrderStatus.PACKED]: { type: Number, default: 0 },
        [OrderStatus.DELIVERED]: { type: Number, default: 0 },
        [OrderStatus.COMPLETED]: { type: Number, default: 0 },
        [OrderStatus.CANCELLED]: { type: Number, default: 0 }
    },
    revenue: {
        total: { type: Number, default: 0 },
        collected: { type: Number, default: 0 },
        outstanding: { type: Number, default: 0 }
    },
    itemsToPack: { type: Number, default: 0 },
    overdueOrders: { type: Number, default: 0 },
    pendingApproval: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 }
}, { 
    collection: 'order_stats',
    timestamps: true 
});

// Packaging Queue View (can be a separate collection or a materialized view)
const packagingQueueSchema = new mongoose.Schema({
    orderId: { type: String, required: true, ref: 'Order' },
    orderNumber: { type: String, required: true },
    clientName: { type: String, required: true },
    items: { type: Number, required: true },
    requestedDate: { type: Date, required: true },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    assignedTo: { type: String, default: null },
    stage: { type: String, default: 'queued' }
}, { 
    collection: 'packaging_queue',
    timestamps: true 
});

// Create and export models
export const Order = mongoose.model('Order', orderSchema);
export const OrderStats = mongoose.model('OrderStats', orderStatsSchema);
export const PackagingQueue = mongoose.model('PackagingQueue', packagingQueueSchema);

// Export enums for use in other files
export {
    OrderStatus,
    PaymentMethod,
    MessageFromModel,
    MessageType
};
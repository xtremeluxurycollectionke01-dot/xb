// ============================================================================
// DOCUMENTS MODULE
// ============================================================================
// Core Purpose: Legal/financial records - immutable once issued
// Types: INVOICE (payment request), QUOTATION (price estimate), CASH_SALE (immediate)
// Interconnections:
//   - Generated from Orders (order → invoice/delivery note)
//   - Can be standalone (direct cash sale without order)
//   - Triggers Packaging workflow (when linked to order)
//   - Payments update Dashboard analytics
//   - Void chain maintains audit trail
// ============================================================================

import mongoose, { Schema, Document, Types } from 'mongoose';

// ----------------------------------------------------------------------------
// TYPE DEFINITIONS
// ----------------------------------------------------------------------------

/**
 * Document types for different business moments
 * - INVOICE: Payment request, has due date
 * - QUOTATION: Price estimate, has expiry date
 * - CASH_SALE: Immediate payment, no credit
 */
export type DocumentType = 'INVOICE' | 'QUOTATION' | 'CASH_SALE';

/**
 * Document lifecycle states
 * DRAFT → ISSUED → [PAID | OVERDUE] → [CLOSED | CANCELLED]
 */
export type DocumentStatus = 
  | 'DRAFT'      // Being prepared, editable
  | 'ISSUED'     // Locked, legally binding
  | 'PAID'       // Fully paid (INVOICE/CASH_SALE)
  | 'PARTIAL'    // Partial payment (INVOICE only)
  | 'OVERDUE'    // Past due date (INVOICE only)
  | 'EXPIRED'    // Past expiry (QUOTATION only)
  | 'ACCEPTED'   // Client accepted (QUOTATION → can convert to order)
  | 'REJECTED'   // Client declined (QUOTATION)
  | 'CANCELLED'  // Voided/terminated
  | 'WRITTEN_OFF'; // Uncollectible debt (INVOICE)

/**
 * Payment methods for African business context
 */
export type PaymentMethod = 
  | 'CASH' 
  | 'BANK_TRANSFER' 
  | 'MPESA' 
  | 'CHEQUE' 
  | 'CARD'
  | 'CREDIT_NOTE'; // Offset against other invoice

/**
 * Line item snapshot - completely denormalized from Price List
 * Legal requirement: document must show exactly what was agreed
 */
export interface IDocumentItem {
  lineNumber: number;        // 1, 2, 3... for reference
  sku: string;               // Product code at time of issue
  name: string;              // Product name (snapshot)
  description?: string;      // Full description
  category?: string;         // For reporting
  quantity: number;
  unit: string;              // 'pcs', 'boxes', 'kg', etc.
  unitPrice: number;         // Agreed price (snapshot)
  discountPercent?: number;  // Line item discount
  discountAmount?: number;   // Calculated discount
  total: number;             // (quantity * unitPrice) - discount
}

/**
 * Payment record - supports partial payments and mixed methods
 * Common scenario: 50% cash, 50% bank transfer
 */
export interface IDocumentPayment {
  _id: Types.ObjectId;
  amount: number;
  method: PaymentMethod;
  reference?: string;        // MPESA code, Cheque number, etc.
  receivedBy: Types.ObjectId; // Staff member
  receivedAt: Date;
  notes?: string;
  isReconciled: boolean;     // Accounting verification
  reconciledAt?: Date;
  reconciledBy?: Types.ObjectId;
}

/**
 * Void/Correction chain entry
 * Documents are never deleted, only voided with replacement link
 */
export interface IVoidInfo {
  isVoided: boolean;
  voidedAt?: Date;
  voidedBy?: Types.ObjectId;
  reason?: string;
  replacementDocument?: Types.ObjectId; // Link to new corrected version
  originalDocument?: Types.ObjectId;    // Back-link (for replacement)
}

/**
 * Issuer details - snapshot of business info at time of issue
 * Legal requirement: document must show issuing entity details
 */
export interface IIssuerInfo {
  businessName: string;
  tradingName?: string;
  address: string;
  postalCode?: string;
  city: string;
  country: string;
  taxId: string;             // KRA PIN, VAT number, etc.
  taxRate: number;           // Applicable tax rate at issue
  phone: string;
  email: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchCode?: string;
    swiftCode?: string;
  };
  mpesaPaybill?: {
    businessNumber: string;
    accountNumber: string;   // Usually invoice number
  };
  logoUrl?: string;          // Company logo at time of issue
}

/**
 * Client details - snapshot for legal accuracy
 * If client moves/changes name, historical documents stay valid
 */
export interface IClientSnapshot {
  clientId: Types.ObjectId;  // Reference for analytics
  name: string;              // Legal name at time of document
  contactPerson?: string;
  address: string;
  postalCode?: string;
  city: string;
  phone: string;
  email?: string;
  taxId?: string;            // Client's VAT/PIN if applicable
  category: 'retail' | 'wholesale' | 'special'; // Pricing tier used
}

/**
 * Delivery information for the document
 */
export interface IDeliveryInfo {
  address: string;
  contactName: string;
  contactPhone: string;
  instructions?: string;
  estimatedDate?: Date;
  actualDate?: Date;
  deliveredBy?: Types.ObjectId;
  deliveryNotes?: string;
  proofOfDelivery?: string;  // Photo/scan URL
}

/**
 * Document document interface (avoiding confusion with TS Document)
 * The legal record of a transaction
 */
export interface IFinancialDocument extends Document {
  // --- Identity ---
  documentType: DocumentType;
  documentNumber: string;      // INV-2024-001234, QOT-2024-000567, etc.
  order?: Types.ObjectId;      // Source order (null for direct documents)
  
  // --- Legal Parties (Denormalized Snapshots) ---
  issuer: IIssuerInfo;         // Our business details at issue
  client: IClientSnapshot;     // Client details at issue
  
  // --- Content (Immutable) ---
  items: IDocumentItem[];
  
  // --- Financial Summary ---
  currency: string;            // 'KES', 'USD', etc.
  subtotal: number;            // Sum of line totals
  taxRate: number;             // Percentage (e.g., 16)
  taxAmount: number;           // Calculated tax
  shippingAmount?: number;     // Delivery charges
  total: number;               // Final amount due
  
  // Payment tracking
  amountPaid: number;          // Sum of all payments
  balanceDue: number;          // total - amountPaid
  payments: IDocumentPayment[];
  lastPaymentDate?: Date;
  
  // --- Lifecycle ---
  status: DocumentStatus;
  statusHistory: {
    status: DocumentStatus;
    changedAt: Date;
    changedBy: Types.ObjectId;
    notes?: string;
  }[];
  
  // --- Critical Dates ---
  issueDate?: Date;            // When legally issued
  dueDate?: Date;              // Payment deadline (INVOICE)
  expiryDate?: Date;           // Quote validity (QUOTATION)
  
  // --- Immutability Enforcement ---
  isLocked: boolean;           // True once ISSUED
  lockedAt?: Date;
  lockedBy?: Types.ObjectId;
  
  // --- Void/Correction Chain ---
  voidInfo: IVoidInfo;
  
  // --- Delivery ---
  delivery?: IDeliveryInfo;
  
  // --- Audit Trail ---
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  issuedBy?: Types.ObjectId;   // Who clicked "Issue"
  printedAt?: Date;            // First print timestamp
  emailedAt?: Date;            // First email timestamp
  emailCount: number;          // How many times sent
  
  // --- Notes ---
  termsAndConditions?: string; // Legal terms at time of issue
  internalNotes?: string;      // Staff-only notes
  clientNotes?: string;        // Shown to client on document
  recalculateTotals(): void;
}

// ----------------------------------------------------------------------------
// SCHEMA DEFINITIONS
// ----------------------------------------------------------------------------

const DocumentItemSchema = new Schema<IDocumentItem>({
  lineNumber: {
    type: Number,
    required: true
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
  category: String,
  quantity: {
    type: Number,
    required: true,
    min: 0.01
  },
  unit: {
    type: String,
    default: 'pcs',
    trim: true
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: true });

const DocumentPaymentSchema = new Schema<IDocumentPayment>({
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  method: {
    type: String,
    enum: ['CASH', 'BANK_TRANSFER', 'MPESA', 'CHEQUE', 'CARD', 'CREDIT_NOTE'],
    required: true
  },
  reference: String,
  receivedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  receivedAt: {
    type: Date,
    default: Date.now
  },
  notes: String,
  isReconciled: {
    type: Boolean,
    default: false
  },
  reconciledAt: Date,
  reconciledBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  }
}, { _id: true });

const IssuerInfoSchema = new Schema<IIssuerInfo>({
  businessName: {
    type: String,
    required: true
  },
  tradingName: String,
  address: {
    type: String,
    required: true
  },
  postalCode: String,
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'Kenya'
  },
  taxId: {
    type: String,
    required: true
  },
  taxRate: {
    type: Number,
    required: true,
    default: 16
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  bankDetails: {
    bankName: String,
    accountName: String,
    accountNumber: String,
    branchCode: String,
    swiftCode: String
  },
  mpesaPaybill: {
    businessNumber: String,
    accountNumber: String
  },
  logoUrl: String
}, { _id: false });

const ClientSnapshotSchema = new Schema<IClientSnapshot>({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  contactPerson: String,
  address: {
    type: String,
    required: true
  },
  postalCode: String,
  city: String,
  phone: {
    type: String,
    required: true
  },
  email: String,
  taxId: String,
  category: {
    type: String,
    enum: ['retail', 'wholesale', 'special'],
    required: true
  }
}, { _id: false });

const VoidInfoSchema = new Schema<IVoidInfo>({
  isVoided: {
    type: Boolean,
    default: false
  },
  voidedAt: Date,
  voidedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  },
  reason: String,
  replacementDocument: {
    type: Schema.Types.ObjectId,
    ref: 'FinancialDocument'
  },
  originalDocument: {
    type: Schema.Types.ObjectId,
    ref: 'FinancialDocument'
  }
}, { _id: false });

const DeliveryInfoSchema = new Schema<IDeliveryInfo>({
  address: String,
  contactName: String,
  contactPhone: String,
  instructions: String,
  estimatedDate: Date,
  actualDate: Date,
  deliveredBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  },
  deliveryNotes: String,
  proofOfDelivery: String
}, { _id: false });

const StatusHistorySchema = new Schema({
  status: {
    type: String,
    enum: ['DRAFT', 'ISSUED', 'PAID', 'PARTIAL', 'OVERDUE', 'EXPIRED', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'WRITTEN_OFF'],
    required: true
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
  notes: String
}, { _id: true });

// ----------------------------------------------------------------------------
// MAIN DOCUMENT SCHEMA
// ----------------------------------------------------------------------------

//const FinancialDocumentSchema = new Schema<IFinancialDocument>({
const FinancialDocumentSchema = new Schema<
  IFinancialDocument,
  FinancialDocumentModel
>({

  // --- Identity ---
  documentType: {
    type: String,
    enum: ['INVOICE', 'QUOTATION', 'CASH_SALE'],
    required: true,
    index: true
  },
  
  documentNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    index: true
  },

  // --- Legal Parties ---
  issuer: {
    type: IssuerInfoSchema,
    required: true
  },
  
  client: {
    type: ClientSnapshotSchema,
    required: true
  },

  // --- Content ---
  items: {
    type: [DocumentItemSchema],
    required: true,
    validate: {
      validator: (items: IDocumentItem[]) => items.length > 0,
      message: 'Document must have at least one item'
    }
  },

  // --- Financials ---
  currency: {
    type: String,
    default: 'KES',
    uppercase: true,
    trim: true
  },
  
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  
  taxRate: {
    type: Number,
    required: true,
    default: 16,
    min: 0,
    max: 100
  },
  
  taxAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  shippingAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  total: {
    type: Number,
    required: true,
    min: 0
  },
  
  amountPaid: {
    type: Number,
    default: 0,
    min: 0
  },
  
  balanceDue: {
    type: Number,
    required: true,
    default: 0
  },
  
  payments: [DocumentPaymentSchema],

  lastPaymentDate: Date,

  // --- Lifecycle ---
  status: {
    type: String,
    enum: ['DRAFT', 'ISSUED', 'PAID', 'PARTIAL', 'OVERDUE', 'EXPIRED', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'WRITTEN_OFF'],
    default: 'DRAFT',
    index: true
  },
  
  statusHistory: [StatusHistorySchema],

  // --- Dates ---
  issueDate: {
    type: Date,
    index: true
  },
  
  dueDate: {
    type: Date,
    index: true
  },
  
  expiryDate: {
    type: Date,
    index: true
  },

  // --- Immutability ---
  isLocked: {
    type: Boolean,
    default: false,
    index: true
  },
  
  lockedAt: Date,
  
  lockedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  },

  // --- Void Chain ---
  voidInfo: {
    type: VoidInfoSchema,
    default: () => ({ isVoided: false })
  },

  // --- Delivery ---
  delivery: DeliveryInfoSchema,

  // --- Audit ---
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  
  issuedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  },
  
  printedAt: Date,
  
  emailedAt: Date,
  
  emailCount: {
    type: Number,
    default: 0
  },

  // --- Notes ---
  termsAndConditions: String,
  internalNotes: String,
  clientNotes: String

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ----------------------------------------------------------------------------
// INDEXES
// ----------------------------------------------------------------------------

// Client document history
FinancialDocumentSchema.index({ 'client.clientId': 1, issueDate: -1 });

// Outstanding invoices (aging report)
FinancialDocumentSchema.index({ documentType: 1, status: 1, dueDate: 1 });

// Order linkage
FinancialDocumentSchema.index({ order: 1, documentType: 1 });

// Daily sales register
FinancialDocumentSchema.index({ issueDate: 1, documentType: 1, status: 1 });

// Void chain lookup
FinancialDocumentSchema.index({ 'voidInfo.originalDocument': 1 });

// ----------------------------------------------------------------------------
// VIRTUALS
// ----------------------------------------------------------------------------

/**
 * Days overdue (for invoices)
 */
FinancialDocumentSchema.virtual('daysOverdue').get(function(this: IFinancialDocument) {
  if (this.documentType !== 'INVOICE' || !this.dueDate) return null;
  if (this.status === 'PAID' || this.status === 'CANCELLED') return 0;
  
  const diff = Date.now() - this.dueDate.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

/**
 * Days until expiry (for quotations)
 */
FinancialDocumentSchema.virtual('daysUntilExpiry').get(function(this: IFinancialDocument) {
  if (this.documentType !== 'QUOTATION' || !this.expiryDate) return null;
  const diff = this.expiryDate.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

/**
 * Is this document editable?
 */
FinancialDocumentSchema.virtual('isEditable').get(function(this: IFinancialDocument) {
  return !this.isLocked && this.status === 'DRAFT' && !this.voidInfo.isVoided;
});

/**
 * Payment progress percentage
 */
FinancialDocumentSchema.virtual('paymentProgress').get(function(this: IFinancialDocument) {
  if (this.total === 0) return 100;
  return Math.round((this.amountPaid / this.total) * 100);
});

// ----------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------

/**
 * Calculate all financial totals from items
 */
FinancialDocumentSchema.methods.recalculateTotals = function(): void {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((sum: any, item: { quantity: number; unitPrice: number; discountAmount: number; discountPercent: any; total: number; }) => {
    const lineTotal = (item.quantity * item.unitPrice);
    const discount = item.discountAmount || (lineTotal * (item.discountPercent || 0) / 100);
    item.total = lineTotal - discount;
    return sum + item.total;
  }, 0);
  
  // Calculate tax
  this.taxAmount = Math.round(this.subtotal * (this.taxRate / 100) * 100) / 100;
  
  // Calculate total
  this.total = this.subtotal + this.taxAmount + (this.shippingAmount || 0);
  
  // Recalculate balance
  this.balanceDue = this.total - this.amountPaid;
};

/**
 * Issue the document - locks it permanently
 * This is the point of no return
 */
FinancialDocumentSchema.methods.issue = async function(
  issuedBy: Types.ObjectId,
  issueDate: Date = new Date()
): Promise<void> {
  if (this.isLocked) {
    throw new Error('Document already issued and locked');
  }
  
  if (this.voidInfo.isVoided) {
    throw new Error('Cannot issue a voided document');
  }
  
  // Validate based on document type
  if (this.documentType === 'INVOICE') {
    if (!this.dueDate) {
      throw new Error('Invoice requires a due date');
    }
  }
  
  if (this.documentType === 'QUOTATION') {
    if (!this.expiryDate) {
      throw new Error('Quotation requires an expiry date');
    }
  }
  
  // Lock the document
  this.isLocked = true;
  this.lockedAt = new Date();
  this.lockedBy = issuedBy;
  this.issuedBy = issuedBy;
  this.issueDate = issueDate;
  
  // Set initial status
  if (this.documentType === 'INVOICE') {
    this.status = this.balanceDue <= 0 ? 'PAID' : 'ISSUED';
  } else if (this.documentType === 'CASH_SALE') {
    this.status = 'PAID'; // Cash sales are immediate
  } else if (this.documentType === 'QUOTATION') {
    this.status = 'ISSUED';
  }
  
  this.statusHistory.push({
    status: this.status,
    changedBy: issuedBy,
    notes: 'Document issued and locked'
  });
  
  // If linked to order, update order
  if (this.order) {
    const Order = mongoose.model('Order');
    await Order.findByIdAndUpdate(this.order, {
      $push: {
        generatedDocuments: {
          type: this.documentType.toLowerCase().replace('_', '_'),
          documentId: this._id,
          number: this.documentNumber,
          createdAt: new Date()
        }
      }
    });
  }
};

/**
 * Record a payment
 * Supports partial payments and mixed methods
 */
FinancialDocumentSchema.methods.recordPayment = async function(
  amount: number,
  method: PaymentMethod,
  receivedBy: Types.ObjectId,
  reference?: string,
  notes?: string
): Promise<void> {
  if (!this.isLocked) {
    throw new Error('Cannot receive payment on unissued document');
  }
  
  if (this.voidInfo.isVoided) {
    throw new Error('Cannot receive payment on voided document');
  }
  
  if (this.status === 'PAID') {
    throw new Error('Document already fully paid');
  }
  
  if (amount > this.balanceDue) {
    throw new Error(`Payment amount exceeds balance due. Max: ${this.balanceDue}`);
  }
  
  // Add payment record
  this.payments.push({
    amount,
    method,
    reference,
    receivedBy,
    receivedAt: new Date(),
    notes,
    isReconciled: false
  } as IDocumentPayment);
  
  // Update totals
  this.amountPaid += amount;
  this.balanceDue = this.total - this.amountPaid;
  this.lastPaymentDate = new Date();
  
  // Update status
  const previousStatus = this.status;
  
  if (this.balanceDue <= 0) {
    this.status = 'PAID';
  } else if (this.amountPaid > 0) {
    this.status = 'PARTIAL';
  }
  
  if (this.status !== previousStatus) {
    this.statusHistory.push({
      status: this.status,
      changedBy: receivedBy,
      notes: `Payment received: ${amount}. Balance: ${this.balanceDue}`
    });
  }
  
  // Auto-log to Time Management
  console.log(`[TimeLog] Payment recorded on ${this.documentNumber} by staff ${receivedBy}`);
};

/**
 * Void the document - creates audit trail
 * Documents are never deleted, only voided with replacement link
 */
FinancialDocumentSchema.methods.void = async function(
  voidedBy: Types.ObjectId,
  reason: string,
  replacementDocId?: Types.ObjectId
): Promise<void> {
  if (this.voidInfo.isVoided) {
    throw new Error('Document already voided');
  }
  
  if (this.status === 'PAID' && this.documentType === 'INVOICE') {
    // Check if payments can be reversed
    const hasReconciledPayments = this.payments.some((p: { isReconciled: any; }) => p.isReconciled);
    if (hasReconciledPayments) {
      throw new Error('Cannot void invoice with reconciled payments');
    }
  }
  
  this.voidInfo = {
    isVoided: true,
    voidedAt: new Date(),
    voidedBy,
    reason,
    replacementDocument: replacementDocId
  };
  
  this.status = 'CANCELLED';
  this.statusHistory.push({
    status: 'CANCELLED',
    changedBy: voidedBy,
    notes: `Voided: ${reason}`
  });
  
  // If there's a replacement, link back
  if (replacementDocId) {
    await (this.constructor as any).findByIdAndUpdate(replacementDocId, {
      'voidInfo.originalDocument': this._id
    });
  }
};

/**
 * Mark as reconciled (accounting verification)
 */
FinancialDocumentSchema.methods.reconcilePayment = function(
  paymentIndex: number,
  reconciledBy: Types.ObjectId
): void {
  if (this.payments[paymentIndex]) {
    this.payments[paymentIndex].isReconciled = true;
    this.payments[paymentIndex].reconciledAt = new Date();
    this.payments[paymentIndex].reconciledBy = reconciledBy;
  }
};

/**
 * Record print event
 */
FinancialDocumentSchema.methods.recordPrint = function(): void {
  if (!this.printedAt) {
    this.printedAt = new Date();
  }
};

/**
 * Record email event
 */
FinancialDocumentSchema.methods.recordEmail = function(): void {
  if (!this.emailedAt) {
    this.emailedAt = new Date();
  }
  this.emailCount += 1;
};

// ----------------------------------------------------------------------------
// STATICS
// ----------------------------------------------------------------------------

/**
 * Generate next document number based on type
 * INV-2024-001234, QOT-2024-000567, CS-2024-000123
 */
FinancialDocumentSchema.statics.generateNumber = async function(
  documentType: DocumentType
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = {
    'INVOICE': 'INV',
    'QUOTATION': 'QOT',
    'CASH_SALE': 'CS'
  }[documentType];
  
  const lastDoc = await this.findOne(
    { documentType, documentNumber: { $regex: `^${prefix}-${year}-` } },
    { documentNumber: 1 },
    { sort: { documentNumber: -1 } }
  );
  
  let sequence = 1;
  if (lastDoc) {
    const parts = lastDoc.documentNumber.split('-');
    sequence = parseInt(parts[2]) + 1;
  }
  
  return `${prefix}-${year}-${sequence.toString().padStart(6, '0')}`;
};

/**
 * Get aging report for invoices (outstanding by days)
 */
FinancialDocumentSchema.statics.getAgingReport = async function(clientId?: string) {
  const match: any = {
    documentType: 'INVOICE',
    status: { $in: ['ISSUED', 'PARTIAL', 'OVERDUE'] },
    'voidInfo.isVoided': false
  };
  
  if (clientId) {
    match['client.clientId'] = new Types.ObjectId(clientId);
  }
  
  return this.aggregate([
    { $match: match },
    {
      $addFields: {
        daysOverdue: {
          $max: [
            0,
            {
              $ceil: {
                $divide: [
                  { $subtract: [new Date(), '$dueDate'] },
                  1000 * 60 * 60 * 24
                ]
              }
            }
          ]
        }
      }
    },
    {
      $bucket: {
        groupBy: '$daysOverdue',
        boundaries: [0, 30, 60, 90, 9999],
        default: 'Invalid',
        output: {
          total: { $sum: '$balanceDue' },
          count: { $sum: 1 },
          invoices: { $push: '$documentNumber' }
        }
      }
    }
  ]);
};

interface FinancialDocumentModel extends mongoose.Model<IFinancialDocument> {
  generateNumber(documentType: DocumentType): Promise<string>;
  getAgingReport(clientId?: string): Promise<any>;
  createFromOrder(
    order: any,
    issuerSnapshot: IIssuerInfo,
    createdBy: Types.ObjectId
  ): Promise<IFinancialDocument>;
}


/**
 * Create invoice from order
 */
/*FinancialDocumentSchema.statics.createFromOrder = async function(
  order: any, // IOrder type
  issuerSnapshot: IIssuerInfo,
  createdBy: Types.ObjectId
): Promise<IFinancialDocument> {*/
FinancialDocumentSchema.statics.createFromOrder = async function(
  this: FinancialDocumentModel, // 👈 CRITICAL
  order: any,
  issuerSnapshot: IIssuerInfo,
  createdBy: Types.ObjectId
): Promise<IFinancialDocument> {

  const documentNumber = await this.generateNumber('INVOICE');
  
  // Map order items to document items
  const items: IDocumentItem[] = order.items.map((item: any, index: number) => ({
    lineNumber: index + 1,
    sku: item.sku,
    name: item.name,
    description: item.description,
    category: item.category,
    quantity: item.quantity,
    unit: 'pcs',
    unitPrice: item.unitPrice,
    total: item.total
  }));
  
  const doc = new this({
    documentType: 'INVOICE',
    documentNumber,
    order: order._id,
    issuer: issuerSnapshot,
    client: {
      clientId: order.client,
      name: order.clientName, // Would need to populate from Client model
      address: order.destination.address,
      phone: order.destination.contactPhone,
      category: 'retail' // Would come from client record
    },
    items,
    currency: 'KES',
    subtotal: order.subtotal,
    taxRate: order.taxRate,
    taxAmount: order.tax,
    total: order.total,
    balanceDue: order.total,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    delivery: {
      address: order.destination.address,
      contactName: order.destination.contactName,
      contactPhone: order.destination.contactPhone,
      instructions: order.destination.instructions
    },
    createdBy
  });
  
  doc.recalculateTotals();
  return doc;
};

// ----------------------------------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------------------------------

/**
 * Pre-save: Enforce immutability, calculate totals
 */
FinancialDocumentSchema.pre('save', async function() {
  // If locked, prevent changes to critical fields
  if (this.isLocked && !this.isNew) {
    const protectedPaths = [
      'items', 'subtotal', 'taxAmount', 'total', 'client', 'issuer'
    ];
    
    const modified = this.modifiedPaths();
    const illegalChanges = modified.filter(p => 
      protectedPaths.some(path => p.startsWith(path))
    );
    
    if (illegalChanges.length > 0) {
      throw new Error(`Cannot modify locked document fields: ${illegalChanges.join(', ')}`);
    }
  }
  
  // Auto-calculate totals if items changed
  if (this.isModified('items') || this.isModified('taxRate') || this.isModified('shippingAmount')) {
    this.recalculateTotals();
  }
  
  // Check for overdue invoices
  if (this.documentType === 'INVOICE' && this.dueDate && !['PAID', 'CANCELLED'].includes(this.status)) {
    if (new Date() > this.dueDate) {
      this.status = 'OVERDUE';
    }
  }
  
  // Check for expired quotations
  if (this.documentType === 'QUOTATION' && this.expiryDate && this.status === 'ISSUED') {
    if (new Date() > this.expiryDate) {
      this.status = 'EXPIRED';
    }
  }
});

// ----------------------------------------------------------------------------
// MODEL EXPORT
// ----------------------------------------------------------------------------

/*export const FinancialDocument = mongoose.model<IFinancialDocument>(
  'FinancialDocument', 
  FinancialDocumentSchema
);*/

export const FinancialDocument = mongoose.model<
  IFinancialDocument,
  FinancialDocumentModel
>('FinancialDocument', FinancialDocumentSchema);


export default FinancialDocument;

// ============================================================================
// INTEGRATION EXAMPLES
// ============================================================================

/**
 * ORDER → INVOICE WORKFLOW:
 * 
 * // Order is packed, ready to invoice
 * const order = await Order.findById(orderId);
 * 
 * // Create invoice from order
 * const issuer = await getCurrentIssuerSnapshot(); // Your business details
 * const invoice = await FinancialDocument.createFromOrder(order, issuer, staffId);
 * 
 * // Issue to client (locks permanently)
 * await invoice.issue(staffId);
 * 
 * // Record payment
 * await invoice.recordPayment(5000, 'MPESA', staffId, 'QK7X9P2M', 'Deposit');
 * await invoice.recordPayment(15000, 'BANK_TRANSFER', staffId, 'TT2024021501');
 * 
 * // Check if fully paid
 * if (invoice.status === 'PAID') {
 *   await order.updateStatus('COMPLETED');
 * }
 */

/**
 * VOID & CORRECTION WORKFLOW:
 * 
 * // Wrong amount on issued invoice
 * const oldInvoice = await FinancialDocument.findOne({ documentNumber: 'INV-2024-001234' });
 * 
 * // Create replacement first
 * const correction = new FinancialDocument({
 *   documentType: 'INVOICE',
 *   documentNumber: await FinancialDocument.generateNumber('INVOICE'),
 *   // ... corrected details
 * });
 * await correction.save();
 * 
 * // Void original with link to replacement
 * await oldInvoice.void(staffId, 'Incorrect line item amount', correction._id);
 */

/**
 * CASH SALE (DIRECT):
 * 
 * // Walk-in customer, no order
 * const cashSale = new FinancialDocument({
 *   documentType: 'CASH_SALE',
 *   documentNumber: await FinancialDocument.generateNumber('CASH_SALE'),
 *   client: { clientId: walkInClientId, ... },
 *   items: [...],
 *   issuer: currentIssuer
 * });
 * 
 * cashSale.recalculateTotals();
 * await cashSale.issue(staffId);
 * // Cash sales auto-status to PAID
 */

/**
 * DASHBOARD AGGREGATION:
 * 
 * // Today's sales
 * const todaySales = await FinancialDocument.aggregate([
 *   { 
 *     $match: { 
 *       issueDate: { $gte: todayStart, $lte: todayEnd },
 *       status: { $nin: ['CANCELLED', 'DRAFT'] },
 *       'voidInfo.isVoided': false
 *     }
 *   },
 *   {
 *     $group: {
 *       _id: '$documentType',
 *       count: { $sum: 1 },
 *       total: { $sum: '$total' },
 *       paid: { $sum: '$amountPaid' }
 *     }
 *   }
 * ]);
 * 
 * // Outstanding receivables
 * const aging = await FinancialDocument.getAgingReport();
 */

/*
export const mockDocuments = [
  {
    _id: "65f1a8bcd1234567890abcde",
    documentType: "INVOICE",
    documentNumber: "INV-2026-000001",
    order: "65f1order1234567890abc",

    issuer: {
      businessName: "Hope Scientific Supplies Ltd",
      address: "Industrial Area, Nairobi",
      city: "Nairobi",
      country: "Kenya",
      taxId: "P051234567X",
      taxRate: 16,
      phone: "+254712345678",
      email: "info@hopechem.co.ke"
    },

    client: {
      clientId: "65f1client1234567890abc",
      name: "Nairobi Labs Ltd",
      address: "Westlands, Nairobi",
      city: "Nairobi",
      phone: "+254700000000",
      category: "wholesale"
    },

    items: [
      {
        _id: "item1",
        lineNumber: 1,
        sku: "CHEM-001",
        name: "Hydrochloric Acid",
        quantity: 10,
        unit: "L",
        unitPrice: 500,
        discountPercent: 0,
        discountAmount: 0,
        total: 5000
      }
    ],

    currency: "KES",
    subtotal: 5000,
    taxRate: 16,
    taxAmount: 800,
    shippingAmount: 0,
    total: 5800,

    amountPaid: 2000,
    balanceDue: 3800,

    payments: [],

    status: "PARTIAL",
    statusHistory: [],

    issueDate: "2026-02-01T00:00:00Z",
    dueDate: "2026-03-01T00:00:00Z",

    isLocked: true,
    voidInfo: { isVoided: false },

    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-02-10T00:00:00Z"
  }
];
*/
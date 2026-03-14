// models/document.model.js
import mongoose from 'mongoose';

// Document Types enum
const DocumentType = {
    INVOICE: 'INVOICE',
    QUOTATION: 'QUOTATION',
    CASH_SALE: 'CASH_SALE'
};

// Document Status enum
const DocumentStatus = {
    DRAFT: 'DRAFT',
    ISSUED: 'ISSUED',
    PAID: 'PAID',
    PARTIAL: 'PARTIAL',
    OVERDUE: 'OVERDUE',
    EXPIRED: 'EXPIRED',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED',
    WRITTEN_OFF: 'WRITTEN_OFF'
};

// Payment Methods enum
const PaymentMethod = {
    CASH: 'CASH',
    BANK_TRANSFER: 'BANK_TRANSFER',
    MPESA: 'MPESA',
    CHEQUE: 'CHEQUE',
    CARD: 'CARD',
    CREDIT_NOTE: 'CREDIT_NOTE'
};

// Bank Details schema
const bankDetailsSchema = new mongoose.Schema({
    bankName: { type: String },
    accountName: { type: String },
    accountNumber: { type: String },
    branchCode: { type: String },
    swiftCode: { type: String }
}, { _id: false });

// M-Pesa Paybill schema
const mpesaPaybillSchema = new mongoose.Schema({
    businessNumber: { type: String },
    accountNumber: { type: String }
}, { _id: false });

// Issuer Info schema
const issuerInfoSchema = new mongoose.Schema({
    businessName: { type: String, required: true },
    tradingName: { type: String, default: '' },
    address: { type: String, required: true },
    postalCode: { type: String, default: '' },
    city: { type: String, required: true },
    country: { type: String, default: 'Kenya' },
    taxId: { type: String, default: '' },
    taxRate: { type: Number, default: 16, min: 0, max: 100 },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    bankDetails: { type: bankDetailsSchema, default: null },
    mpesaPaybill: { type: mpesaPaybillSchema, default: null },
    logoUrl: { type: String, default: '' }
}, { _id: false });

// Client Snapshot schema
const clientSnapshotSchema = new mongoose.Schema({
    clientId: { type: String, required: true },
    name: { type: String, required: true },
    contactPerson: { type: String, default: '' },
    address: { type: String, required: true },
    postalCode: { type: String, default: '' },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    taxId: { type: String, default: '' },
    category: { type: String, default: 'retail' }
}, { _id: false });

// Document Item schema
const documentItemSchema = new mongoose.Schema({
    lineNumber: { type: Number, required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, default: 'pcs' },
    unitPrice: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    discountAmount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 }
}, { _id: false });

// Document Payment schema
const documentPaymentSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    method: { 
        type: String, 
        enum: Object.values(PaymentMethod),
        required: true 
    },
    reference: { type: String, default: '' },
    receivedBy: { type: String, required: true },
    receivedAt: { type: Date, required: true },
    notes: { type: String, default: '' },
    isReconciled: { type: Boolean, default: false },
    reconciledAt: { type: Date, default: null },
    reconciledBy: { type: String, default: null }
}, { _id: false });

// Status History Entry schema
const statusHistoryEntrySchema = new mongoose.Schema({
    status: { 
        type: String, 
        enum: Object.values(DocumentStatus),
        required: true 
    },
    changedAt: { type: Date, required: true },
    changedBy: { type: String, required: true },
    notes: { type: String, default: '' }
}, { _id: false });

// Void Info schema
const voidInfoSchema = new mongoose.Schema({
    isVoided: { type: Boolean, default: false },
    voidedAt: { type: Date, default: null },
    voidedBy: { type: String, default: null },
    reason: { type: String, default: '' },
    replacementDocument: { type: String, default: null },
    originalDocument: { type: String, default: null }
}, { _id: false });

// Delivery Info schema
const deliveryInfoSchema = new mongoose.Schema({
    address: { type: String, required: true },
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    instructions: { type: String, default: '' },
    estimatedDate: { type: Date, default: null },
    actualDate: { type: Date, default: null },
    deliveredBy: { type: String, default: null },
    deliveryNotes: { type: String, default: '' },
    proofOfDelivery: { type: String, default: '' }
}, { _id: false });

// MAIN DOCUMENT SCHEMA
const documentSchema = new mongoose.Schema({
    // --- Identity ---
    _id: { type: String, required: true },
    documentType: { 
        type: String, 
        enum: Object.values(DocumentType),
        required: true,
        index: true 
    },
    documentNumber: { type: String, required: true, unique: true, index: true },
    order: { type: String, default: null, index: true },
    
    // --- Legal Parties ---
    issuer: { type: issuerInfoSchema, required: true },
    client: { type: clientSnapshotSchema, required: true },
    
    // --- Content ---
    items: { type: [documentItemSchema], required: true, default: [] },
    
    // --- Financial Summary ---
    currency: { type: String, default: 'KES' },
    subtotal: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, required: true, min: 0, max: 100 },
    taxAmount: { type: Number, required: true, min: 0 },
    shippingAmount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    amountPaid: { type: Number, default: 0, min: 0 },
    balanceDue: { type: Number, required: true, min: 0 },
    payments: { type: [documentPaymentSchema], default: [] },
    lastPaymentDate: { type: Date, default: null },
    
    // --- Lifecycle ---
    status: { 
        type: String, 
        enum: Object.values(DocumentStatus),
        required: true,
        index: true 
    },
    statusHistory: { type: [statusHistoryEntrySchema], default: [] },
    
    // --- Critical Dates ---
    issueDate: { type: Date, default: null, index: true },
    dueDate: { type: Date, default: null, index: true },
    expiryDate: { type: Date, default: null, index: true },
    
    // --- Immutability Enforcement ---
    isLocked: { type: Boolean, default: false },
    lockedAt: { type: Date, default: null },
    lockedBy: { type: String, default: null },
    
    // --- Void/Correction Chain ---
    voidInfo: { type: voidInfoSchema, default: () => ({}) },
    
    // --- Delivery ---
    delivery: { type: deliveryInfoSchema, default: null },
    
    // --- Audit Trail ---
    createdBy: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    issuedBy: { type: String, default: null },
    printedAt: { type: Date, default: null },
    emailedAt: { type: Date, default: null },
    emailCount: { type: Number, default: 0 },
    
    // --- Notes ---
    termsAndConditions: { type: String, default: '' },
    internalNotes: { type: String, default: '' },
    clientNotes: { type: String, default: '' }
}, { 
    collection: 'documents',
    _id: false,
    timestamps: true 
});

// Indexes for common queries
documentSchema.index({ client: 1, documentType: 1 });
documentSchema.index({ status: 1, dueDate: 1 });
documentSchema.index({ createdAt: -1 });
documentSchema.index({ 'payments.receivedAt': -1 });

// Pre-save middleware to update timestamps
documentSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Virtuals
documentSchema.virtual('daysOverdue').get(function() {
    if (this.documentType !== DocumentType.INVOICE || !this.dueDate) return null;
    if ([DocumentStatus.PAID, DocumentStatus.CANCELLED].includes(this.status)) return 0;
    
    const due = new Date(this.dueDate).getTime();
    const now = Date.now();
    const diff = now - due;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

documentSchema.virtual('daysUntilExpiry').get(function() {
    if (this.documentType !== DocumentType.QUOTATION || !this.expiryDate) return null;
    const expiry = new Date(this.expiryDate).getTime();
    const now = Date.now();
    const diff = expiry - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

documentSchema.virtual('isEditable').get(function() {
    return !this.isLocked && this.status === DocumentStatus.DRAFT && !this.voidInfo.isVoided;
});

documentSchema.virtual('paymentProgress').get(function() {
    if (this.total === 0) return 100;
    return Math.round((this.amountPaid / this.total) * 100);
});

// Document Stats Schema
const documentStatsSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    totalDocuments: { type: Number, default: 0 },
    byType: {
        [DocumentType.INVOICE]: { type: Number, default: 0 },
        [DocumentType.QUOTATION]: { type: Number, default: 0 },
        [DocumentType.CASH_SALE]: { type: Number, default: 0 }
    },
    byStatus: {
        [DocumentStatus.DRAFT]: { type: Number, default: 0 },
        [DocumentStatus.ISSUED]: { type: Number, default: 0 },
        [DocumentStatus.PAID]: { type: Number, default: 0 },
        [DocumentStatus.PARTIAL]: { type: Number, default: 0 },
        [DocumentStatus.OVERDUE]: { type: Number, default: 0 },
        [DocumentStatus.EXPIRED]: { type: Number, default: 0 },
        [DocumentStatus.CANCELLED]: { type: Number, default: 0 }
    },
    monthlyTotals: {
        currentMonth: { type: Number, default: 0 },
        previousMonth: { type: Number, default: 0 },
        growth: { type: Number, default: 0 }
    },
    agingReport: [{
        bucket: { type: String, required: true },
        total: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    }]
}, { 
    collection: 'document_stats',
    timestamps: true 
});

// Aging Receivables Schema
const agingReceivablesSchema = new mongoose.Schema({
    bucket: { type: String, required: true },
    total: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    documents: [{ type: String }],
    updatedAt: { type: Date, default: Date.now }
}, { 
    collection: 'aging_receivables',
    indexes: [{ bucket: 1 }]
});

// Create and export models
export const Document = mongoose.model('Document', documentSchema);
export const DocumentStats = mongoose.model('DocumentStats', documentStatsSchema);
export const AgingReceivables = mongoose.model('AgingReceivables', agingReceivablesSchema);

// Export enums for use in other files
export {
    DocumentType,
    DocumentStatus,
    PaymentMethod
};
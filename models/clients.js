// models/client.model.js
import mongoose from 'mongoose';

// Client Types enum
const ClientType = {
    INDIVIDUAL: 'INDIVIDUAL',
    BUSINESS: 'BUSINESS',
    GOVERNMENT: 'GOVERNMENT',
    NGO: 'NGO'
};

// Client Categories enum
const ClientCategory = {
    RETAIL: 'RETAIL',
    WHOLESALE: 'WHOLESALE',
    SPECIAL: 'SPECIAL',
    EMPLOYEE: 'EMPLOYEE',
    VIP: 'VIP'
};

// Phone Types enum
const PhoneType = {
    MOBILE: 'MOBILE',
    WORK: 'WORK',
    HOME: 'HOME',
    FAX: 'FAX',
    WHATSAPP: 'WHATSAPP'
};

// Address Types enum
const AddressType = {
    BILLING: 'BILLING',
    SHIPPING: 'SHIPPING',
    SHOP_A: 'SHOP_A',
    SHOP_B: 'SHOP_B',
    WAREHOUSE: 'WAREHOUSE',
    RESIDENTIAL: 'RESIDENTIAL'
};

// Communication Types enum
const CommunicationType = {
    CALL: 'CALL',
    WHATSAPP: 'WHATSAPP',
    EMAIL: 'EMAIL',
    SMS: 'SMS',
    VISIT: 'VISIT',
    MEETING: 'MEETING'
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

// Communication Direction enum
const CommunicationDirection = {
    INBOUND: 'INBOUND',
    OUTBOUND: 'OUTBOUND'
};

// Related Entity Types enum
const RelatedEntityType = {
    ORDER: 'ORDER',
    INVOICE: 'INVOICE',
    GENERAL: 'GENERAL',
    COMPLAINT: 'COMPLAINT'
};

// Client Trend enum
const ClientTrend = {
    GROWING: 'GROWING',
    STABLE: 'STABLE',
    DECLINING: 'DECLINING',
    INACTIVE: 'INACTIVE'
};

// Coordinates schema
const coordinatesSchema = new mongoose.Schema({
    lat: { type: Number },
    lng: { type: Number }
}, { _id: false });

// Phone schema
const phoneSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    phoneType: { 
        type: String, 
        enum: Object.values(PhoneType),
        required: true 
    },
    number: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    extension: { type: String, default: '' },
    whatsappEnabled: { type: Boolean, default: true },
    callConsent: { type: Boolean, default: true },
    lastVerifiedAt: { type: Date, default: null }
}, { _id: false });

// Address schema
const addressSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    addressType: { 
        type: String, 
        enum: Object.values(AddressType),
        required: true 
    },
    label: { type: String, default: '' },
    attention: { type: String, default: '' },
    street: { type: String, required: true },
    building: { type: String, default: '' },
    floor: { type: String, default: '' },
    unit: { type: String, default: '' },
    city: { type: String, required: true },
    postalCode: { type: String, default: '' },
    county: { type: String, default: '' },
    country: { type: String, default: 'Kenya' },
    coordinates: { type: coordinatesSchema, default: null },
    instructions: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
    deliveryHours: { type: String, default: '' },
    accessRestrictions: { type: String, default: '' },
    active: { type: Boolean, default: true },
    addedAt: { type: Date, required: true }
}, { _id: false });

// Payment Summary schema
const paymentSummarySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'KES' },
    date: { type: Date, required: true },
    method: { 
        type: String, 
        enum: Object.values(PaymentMethod),
        required: true 
    },
    reference: { type: String, default: '' },
    againstInvoice: { type: String, default: null },
    invoiceNumber: { type: String, default: '' },
    recordedBy: { type: String, required: true },
    notes: { type: String, default: '' }
}, { _id: false });

// Communication Log schema
const communicationLogSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    timestamp: { type: Date, required: true },
    communicationType: { 
        type: String, 
        enum: Object.values(CommunicationType),
        required: true 
    },
    direction: { 
        type: String, 
        enum: Object.values(CommunicationDirection),
        required: true 
    },
    summary: { type: String, required: true },
    details: { type: String, default: '' },
    relatedTo: { 
        type: String, 
        enum: Object.values(RelatedEntityType),
        default: null 
    },
    relatedId: { type: String, default: null },
    staff: { type: String, required: true },
    duration: { type: Number, default: null }, // in minutes
    outcome: { type: String, default: '' },
    followUpDate: { type: Date, default: null },
    attachments: { type: [String], default: [] }
}, { _id: false });

// Client Flags schema
const clientFlagsSchema = new mongoose.Schema({
    isSlowPayer: { type: Boolean, default: false },
    isFrequentDisputer: { type: Boolean, default: false },
    frequentChanger: { type: Boolean, default: false },
    highMaintenance: { type: Boolean, default: false },
    preferred: { type: Boolean, default: false },
    onHold: { type: Boolean, default: false },
    requiresDeposit: { type: Boolean, default: false },
    creditSuspended: { type: Boolean, default: false },
    specialHandling: { type: Boolean, default: false },
    autoApprove: { type: Boolean, default: false }
}, { _id: false });

// Client Account schema
const clientAccountSchema = new mongoose.Schema({
    currency: { type: String, default: 'KES' },
    totalPurchases: { type: Number, default: 0, min: 0 },
    totalPaid: { type: Number, default: 0, min: 0 },
    balanceDue: { type: Number, default: 0, min: 0 },
    creditLimit: { type: Number, default: 0, min: 0 },
    availableCredit: { type: Number, default: 0, min: 0 },
    lastPaymentDate: { type: Date, default: null },
    lastPaymentAmount: { type: Number, default: null },
    averagePaymentDays: { type: Number, default: 0 },
    onTimePaymentRate: { type: Number, default: 100, min: 0, max: 100 },
    currentMonthPurchases: { type: Number, default: 0 },
    currentMonthPayments: { type: Number, default: 0 },
    oldestUnpaidInvoice: { type: Date, default: null },
    daysSinceLastPayment: { type: Number, default: null }
}, { _id: false });

// Client Stats schema
const clientStatsSchema = new mongoose.Schema({
    totalOrders: { type: Number, default: 0 },
    totalInvoices: { type: Number, default: 0 },
    totalQuotations: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0, min: 0, max: 100 },
    averageOrderValue: { type: Number, default: 0 },
    averageItemsPerOrder: { type: Number, default: 0 },
    preferredCategories: { type: [String], default: [] },
    firstOrderDate: { type: Date, default: null },
    lastOrderDate: { type: Date, default: null },
    daysSinceLastOrder: { type: Number, default: null },
    relationshipLengthDays: { type: Number, default: 0 },
    ordersPerMonth: { type: Number, default: 0 },
    trend: { 
        type: String, 
        enum: Object.values(ClientTrend),
        default: ClientTrend.INACTIVE 
    }
}, { _id: false });

// Client Tag schema
const clientTagSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    tag: { type: String, required: true },
    addedBy: { type: String, required: true },
    addedAt: { type: Date, required: true },
    color: { type: String, required: true }
}, { _id: false });

// MAIN CLIENT SCHEMA
const clientSchema = new mongoose.Schema({
    // --- Identity ---
    _id: { type: String, required: true },
    clientType: { 
        type: String, 
        enum: Object.values(ClientType),
        required: true 
    },
    clientNumber: { type: String, required: true, unique: true, index: true },
    
    // Basic info
    name: { type: String, required: true },
    tradingName: { type: String, default: '' },
    contactPerson: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    
    // Contact details
    phones: { type: [phoneSchema], default: [] },
    emails: { type: [String], default: [] },
    addresses: { type: [addressSchema], default: [] },
    
    // Classification
    category: { 
        type: String, 
        enum: Object.values(ClientCategory),
        required: true 
    },
    industry: { type: String, default: '' },
    
    // Financial terms
    paymentTerms: { type: Number, default: 0 }, // days
    taxId: { type: String, default: '' },
    taxExempt: { type: Boolean, default: false },
    
    // --- Relationship History ---
    orders: { type: [String], default: [] },
    documents: { type: [String], default: [] },
    payments: { type: [paymentSummarySchema], default: [] },
    communications: { type: [communicationLogSchema], default: [] },
    
    // --- Calculated Fields ---
    account: { type: clientAccountSchema, default: () => ({}) },
    flags: { type: clientFlagsSchema, default: () => ({}) },
    stats: { type: clientStatsSchema, default: () => ({}) },
    tags: { type: [clientTagSchema], default: [] },
    
    // --- Notes ---
    internalNotes: { type: String, default: '' },
    clientNotes: { type: String, default: '' },
    
    // --- Audit ---
    referredBy: { type: String, default: null },
    assignedTo: { type: String, default: null, index: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    lastActivityAt: { type: Date, required: true, default: Date.now }
}, { 
    collection: 'clients',
    _id: false,
    timestamps: true 
});

// Indexes for common queries
clientSchema.index({ name: 1 });
clientSchema.index({ category: 1 });
clientSchema.index({ 'account.balanceDue': 1 });
clientSchema.index({ 'flags.onHold': 1 });
clientSchema.index({ 'stats.trend': 1 });
clientSchema.index({ assignedTo: 1 });
clientSchema.index({ 'emails': 1 });
clientSchema.index({ 'phones.number': 1 });

// Pre-save middleware to update timestamps
clientSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Client Stats Aggregate schema
const clientStatsAggregateSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    totalClients: { type: Number, default: 0 },
    byCategory: {
        [ClientCategory.RETAIL]: { type: Number, default: 0 },
        [ClientCategory.WHOLESALE]: { type: Number, default: 0 },
        [ClientCategory.SPECIAL]: { type: Number, default: 0 },
        [ClientCategory.EMPLOYEE]: { type: Number, default: 0 },
        [ClientCategory.VIP]: { type: Number, default: 0 }
    },
    byType: {
        [ClientType.INDIVIDUAL]: { type: Number, default: 0 },
        [ClientType.BUSINESS]: { type: Number, default: 0 },
        [ClientType.GOVERNMENT]: { type: Number, default: 0 },
        [ClientType.NGO]: { type: Number, default: 0 }
    },
    financial: {
        totalReceivables: { type: Number, default: 0 },
        totalPaid: { type: Number, default: 0 },
        averageBalance: { type: Number, default: 0 }
    },
    riskMetrics: {
        slowPayers: { type: Number, default: 0 },
        onHold: { type: Number, default: 0 },
        creditSuspended: { type: Number, default: 0 },
        preferred: { type: Number, default: 0 }
    },
    activity: {
        activeLast30Days: { type: Number, default: 0 },
        newThisMonth: { type: Number, default: 0 },
        inactive: { type: Number, default: 0 }
    },
    topCategories: [{
        category: String,
        count: Number
    }]
}, { 
    collection: 'client_stats',
    timestamps: true 
});

// Aging Receivables schema
const agingReceivablesSchema = new mongoose.Schema({
    clientId: { type: String, required: true, ref: 'Client' },
    clientName: { type: String, required: true },
    current: { type: Number, default: 0 },
    days30: { type: Number, default: 0 },
    days60: { type: Number, default: 0 },
    days90: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
}, { 
    collection: 'aging_receivables',
    timestamps: true 
});

// Top Clients schema
const topClientsSchema = new mongoose.Schema({
    clientId: { type: String, required: true, ref: 'Client' },
    clientName: { type: String, required: true },
    revenue: { type: Number, required: true },
    orderCount: { type: Number, required: true },
    period: { type: String, enum: ['week', 'month', 'quarter', 'year'], required: true },
    date: { type: Date, required: true }
}, { 
    collection: 'top_clients',
    timestamps: true 
});

// Create and export models
export const Client = mongoose.model('Client', clientSchema);
export const ClientStats = mongoose.model('ClientStats', clientStatsAggregateSchema);
export const AgingReceivables = mongoose.model('AgingReceivables', agingReceivablesSchema);
export const TopClients = mongoose.model('TopClients', topClientsSchema);

// Export enums for use in other files
export {
    ClientType,
    ClientCategory,
    PhoneType,
    AddressType,
    CommunicationType,
    CommunicationDirection,
    PaymentMethod,
    RelatedEntityType,
    ClientTrend
};
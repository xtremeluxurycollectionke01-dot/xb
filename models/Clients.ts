// ============================================================================
// CLIENTS MODULE
// ============================================================================
// Core Purpose: Complete relationship history and single source of truth for customer data
// Interconnections:
//   - Referenced by Orders (client identity, pricing tier, delivery addresses)
//   - Referenced by Documents (invoicing details, tax info)
//   - Feeds Messaging (contact info, communication history)
//   - Updates from Time Management (interaction tracking)
//   - Powers Dashboard (revenue analytics, risk alerts)
//   - Triggers automated flags (slow payer → require deposit)
// ============================================================================

import mongoose, { Schema, Document, Types, Model } from 'mongoose';
import { TimeRecord } from './Time';
// ----------------------------------------------------------------------------
// TYPE DEFINITIONS
// ----------------------------------------------------------------------------

/**
 * Client types for different relationship handling
 */
export type ClientType = 'INDIVIDUAL' | 'BUSINESS' | 'GOVERNMENT' | 'NGO';

/**
 * Pricing/Service categories
 * Determines pricing tier and service level
 */
export type ClientCategory = 'RETAIL' | 'WHOLESALE' | 'SPECIAL' | 'EMPLOYEE' | 'VIP';

/**
 * Phone number types
 */
export type PhoneType = 'MOBILE' | 'WORK' | 'HOME' | 'FAX' | 'WHATSAPP';

/**
 * Address types - handles multiple locations per client
 */
export type AddressType = 
  | 'BILLING'      // Invoice/statement address
  | 'SHIPPING'     // Default delivery
  | 'SHOP_A'       // Branch/location 1
  | 'SHOP_B'       // Branch/location 2
  | 'WAREHOUSE'    // Receiving dock
  | 'RESIDENTIAL'; // Home address

/**
 * Communication types
 */
export type CommunicationType = 'CALL' | 'WHATSAPP' | 'EMAIL' | 'SMS' | 'VISIT' | 'MEETING';

/**
 * Phone contact
 */
export interface IPhone {
  phoneType: PhoneType;
  number: string;            // Normalized: +254712345678
  isPrimary: boolean;        // Default contact number
  isVerified: boolean;       // Double-checked correct number
  extension?: string;        // For landlines
  whatsappEnabled: boolean;  // Can receive WhatsApp
  callConsent: boolean;      // Marketing calls OK?
  lastVerifiedAt?: Date;
}

/**
 * Address with delivery instructions
 */
export interface IAddress {
  addressType: AddressType;
  label?: string;            // "Main Shop", "Warehouse", etc.
  attention?: string;        // "Attn: Purchasing Manager"
  street: string;
  building?: string;
  floor?: string;
  unit?: string;
  city: string;
  postalCode?: string;
  county?: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  instructions?: string;     // "Gate code 1234", "Use service elevator"
  isDefault: boolean;        // Use if no specific address requested
  deliveryHours?: string;    // "Mon-Fri 9am-5pm"
  accessRestrictions?: string;
  active: boolean;           // Soft delete for old addresses
  addedAt: Date;
}

/**
 * Payment record summary (denormalized from Documents)
 */
export interface IPaymentSummary {
  amount: number;
  currency: string;
  date: Date;
  method: 'CASH' | 'BANK_TRANSFER' | 'MPESA' | 'CHEQUE' | 'CARD' | 'CREDIT_NOTE';
  reference?: string;
  againstInvoice?: Types.ObjectId;
  invoiceNumber?: string;
  recordedBy: Types.ObjectId;
  notes?: string;
}

/**
 * Communication log entry
 * Auto-populated from Messaging module
 */
export interface ICommunicationLog {
  timestamp: Date;
  communicationType: CommunicationType;
  direction: 'INBOUND' | 'OUTBOUND';
  summary: string;           // "Discussed delivery delay"
  details?: string;          // Full transcript/reference
  relatedTo?: 'ORDER' | 'INVOICE' | 'GENERAL' | 'COMPLAINT';
  relatedId?: Types.ObjectId;
  staff: Types.ObjectId;     // Staff member handling
  duration?: number;         // Call duration in minutes
  outcome?: string;          // "Resolved", "Follow-up required"
  followUpDate?: Date;
  attachments?: string[];    // Call recordings, email PDFs
}

/**
 * Risk and behavioral flags
 * Automates business rules and intuition
 */
export interface IClientFlags {
  isSlowPayer: boolean;           // Pays after due date
  isFrequentDisputer: boolean;    // Often questions invoices
  frequentChanger: boolean;       // Modifies orders after confirmation
  highMaintenance: boolean;       // Requires excessive support
  preferred: boolean;             // VIP treatment
  onHold: boolean;                // New orders blocked
  requiresDeposit: boolean;       // Always require upfront payment
  creditSuspended: boolean;       // Cash only until balance cleared
  specialHandling: boolean;       // Fragile, custom process, etc.
  autoApprove: boolean;           // Skip approval for their orders
}

/**
 * Financial account summary
 * Real-time calculated from Documents
 */
export interface IClientAccount {
  currency: string;
  totalPurchases: number;         // Lifetime revenue
  totalPaid: number;              // Lifetime payments
  balanceDue: number;             // Positive = owes, Negative = credit
  creditLimit: number;            // Max outstanding allowed
  availableCredit: number;        // creditLimit - balanceDue
  
  // Payment behavior
  lastPaymentDate?: Date;
  lastPaymentAmount?: number;
  averagePaymentDays: number;     // How long they typically take
  onTimePaymentRate: number;      // Percentage paid on time
  
  // Current period
  currentMonthPurchases: number;
  currentMonthPayments: number;
  oldestUnpaidInvoice?: Date;
  daysSinceLastPayment?: number;
}

/**
 * Client statistics and analytics
 */
export interface IClientStats {
  totalOrders: number;
  totalInvoices: number;
  totalQuotations: number;
  acceptanceRate: number;         // Quotes accepted / total quotes
  
  // Order patterns
  averageOrderValue: number;
  averageItemsPerOrder: number;
  preferredCategories: string[];  // What they buy most
  
  // Timing
  firstOrderDate?: Date;
  lastOrderDate?: Date;
  daysSinceLastOrder?: number;
  
  // Relationship health
  relationshipLengthDays: number;
  ordersPerMonth: number;
  trend: 'GROWING' | 'STABLE' | 'DECLINING' | 'INACTIVE';
}

/**
 * Custom tags for flexible categorization
 */
export interface IClientTag {
  tag: string;                    // "Fragile handler", "Net 60 only"
  addedBy: Types.ObjectId;
  addedAt: Date;
  color?: string;                 // UI color coding
}

/**
 * Client document interface
 */
export interface IClient extends Document {
  // --- Identity ---
  clientType: ClientType;
  clientNumber: string;           // C-000001 (human-readable)
  
  // Basic info
  name: string;                   // Full name or company name
  tradingName?: string;           // DBA name for businesses
  contactPerson?: string;         // Primary contact (for businesses)
  jobTitle?: string;              // "Purchasing Manager"
  
  // Contact details
  phones: IPhone[];
  emails: string[];
  addresses: IAddress[];
  
  // Classification
  category: ClientCategory;
  industry?: string;              // "Retail", "Manufacturing", etc.
  
  // Financial terms
  paymentTerms: number;           // Days: 0 = cash, 30 = net 30, etc.
  taxId?: string;                 // KRA PIN, VAT number
  taxExempt: boolean;
  
  // --- Relationship History ---
  orders: Types.ObjectId[];       // References to Order collection
  documents: Types.ObjectId[];    // Invoices, quotations, receipts
  payments: IPaymentSummary[];    // Denormalized payment history
  communications: ICommunicationLog[];
  
  // --- Calculated Fields ---
  account: IClientAccount;
  flags: IClientFlags;
  stats: IClientStats;
  tags: IClientTag[];
  
  // --- Notes ---
  internalNotes: string;          // Staff-only
  clientNotes?: string;           // Visible to client (portal)
  
  // --- Audit ---
  referredBy?: Types.ObjectId;    // Referral tracking
  assignedTo?: Types.ObjectId;    // Account manager
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;

  // Add virtuals to interface
  primaryPhone?: IPhone;
  primaryEmail?: string;
  defaultAddress?: IAddress;
  fullAddress?: string;
  isCreditWorthy?: boolean;
  relationshipStatus?: string;


  // Methods
  logCommunication(
    type: CommunicationType,
    direction: 'INBOUND' | 'OUTBOUND',
    summary: string,
    staffId: Types.ObjectId,
    details?: {
      relatedTo?: 'ORDER' | 'INVOICE' | 'GENERAL' | 'COMPLAINT';
      relatedId?: Types.ObjectId;
      duration?: number;
      outcome?: string;
      followUpDate?: Date;
      attachments?: string[];
    }
  ): Promise<void>;

   recalculateStats(): void;
}


interface IClientModel extends Model<IClient> {
  generateClientNumber(): Promise<string>;
  search(
    query: string,
    options?: {
      category?: ClientCategory;
      flags?: Partial<IClientFlags>;
      assignedTo?: Types.ObjectId;
      hasBalance?: boolean;
      limit?: number;
    }
  ): Promise<IClient[]>;
  getRequiringAttention(): Promise<IClient[]>;
  getTopClients(
    limit?: number,
    period?: 'month' | 'quarter' | 'year'
  ): Promise<Array<{ client: IClient; revenue: number; orderCount: number }>>;
  getAgingReceivables(): Promise<Array<{
    client: IClient;
    current: number;
    days30: number;
    days60: number;
    days90: number;
    total: number;
  }>>;
  createFromLead(
    leadData: {
      name: string;
      phone: string;
      email?: string;
      address?: string;
      source?: string;
    },
    createdBy: Types.ObjectId
  ): Promise<IClient>;
}

// ----------------------------------------------------------------------------
// SCHEMA DEFINITIONS
// ----------------------------------------------------------------------------

const PhoneSchema = new Schema<IPhone>({
  phoneType: {
    type: String,
    enum: ['MOBILE', 'WORK', 'HOME', 'FAX', 'WHATSAPP'],
    required: true
  },
  number: {
    type: String,
    required: true,
    trim: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  extension: String,
  whatsappEnabled: {
    type: Boolean,
    default: true
  },
  callConsent: {
    type: Boolean,
    default: true
  },
  lastVerifiedAt: Date
}, { _id: true });

const AddressSchema = new Schema<IAddress>({
  addressType: {
    type: String,
    enum: ['BILLING', 'SHIPPING', 'SHOP_A', 'SHOP_B', 'WAREHOUSE', 'RESIDENTIAL'],
    required: true
  },
  label: String,
  attention: String,
  street: {
    type: String,
    required: true
  },
  building: String,
  floor: String,
  unit: String,
  city: {
    type: String,
    required: true
  },
  postalCode: String,
  county: String,
  country: {
    type: String,
    default: 'Kenya'
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  instructions: String,
  isDefault: {
    type: Boolean,
    default: false
  },
  deliveryHours: String,
  accessRestrictions: String,
  active: {
    type: Boolean,
    default: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const PaymentSummarySchema = new Schema<IPaymentSummary>({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'KES'
  },
  date: {
    type: Date,
    required: true
  },
  method: {
    type: String,
    enum: ['CASH', 'BANK_TRANSFER', 'MPESA', 'CHEQUE', 'CARD', 'CREDIT_NOTE'],
    required: true
  },
  reference: String,
  againstInvoice: {
    type: Schema.Types.ObjectId,
    ref: 'FinancialDocument'
  },
  invoiceNumber: String,
  recordedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  notes: String
}, { _id: true });

const CommunicationLogSchema = new Schema<ICommunicationLog>({
  timestamp: {
    type: Date,
    default: Date.now
  },
  communicationType: {
    type: String,
    enum: ['CALL', 'WHATSAPP', 'EMAIL', 'SMS', 'VISIT', 'MEETING'],
    required: true
  },
  direction: {
    type: String,
    enum: ['INBOUND', 'OUTBOUND'],
    required: true
  },
  summary: {
    type: String,
    required: true,
    maxlength: 500
  },
  details: String,
  relatedTo: {
    type: String,
    enum: ['ORDER', 'INVOICE', 'GENERAL', 'COMPLAINT']
  },
  relatedId: Schema.Types.ObjectId,
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  duration: Number,
  outcome: String,
  followUpDate: Date,
  attachments: [String]
}, { _id: true });

const ClientFlagsSchema = new Schema<IClientFlags>({
  isSlowPayer: {
    type: Boolean,
    default: false,
    index: true
  },
  isFrequentDisputer: {
    type: Boolean,
    default: false
  },
  frequentChanger: {
    type: Boolean,
    default: false
  },
  highMaintenance: {
    type: Boolean,
    default: false
  },
  preferred: {
    type: Boolean,
    default: false,
    index: true
  },
  onHold: {
    type: Boolean,
    default: false,
    index: true
  },
  requiresDeposit: {
    type: Boolean,
    default: false
  },
  creditSuspended: {
    type: Boolean,
    default: false
  },
  specialHandling: {
    type: Boolean,
    default: false
  },
  autoApprove: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const ClientAccountSchema = new Schema<IClientAccount>({
  currency: {
    type: String,
    default: 'KES'
  },
  totalPurchases: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  balanceDue: {
    type: Number,
    default: 0
  },
  creditLimit: {
    type: Number,
    default: 0
  },
  availableCredit: {
    type: Number,
    default: 0
  },
  lastPaymentDate: Date,
  lastPaymentAmount: Number,
  averagePaymentDays: {
    type: Number,
    default: 0
  },
  onTimePaymentRate: {
    type: Number,
    default: 100
  },
  currentMonthPurchases: {
    type: Number,
    default: 0
  },
  currentMonthPayments: {
    type: Number,
    default: 0
  },
  oldestUnpaidInvoice: Date,
  daysSinceLastPayment: Number
}, { _id: false });

const ClientStatsSchema = new Schema<IClientStats>({
  totalOrders: {
    type: Number,
    default: 0
  },
  totalInvoices: {
    type: Number,
    default: 0
  },
  totalQuotations: {
    type: Number,
    default: 0
  },
  acceptanceRate: {
    type: Number,
    default: 0
  },
  averageOrderValue: {
    type: Number,
    default: 0
  },
  averageItemsPerOrder: {
    type: Number,
    default: 0
  },
  preferredCategories: [String],
  firstOrderDate: Date,
  lastOrderDate: Date,
  daysSinceLastOrder: Number,
  relationshipLengthDays: {
    type: Number,
    default: 0
  },
  ordersPerMonth: {
    type: Number,
    default: 0
  },
  trend: {
    type: String,
    enum: ['GROWING', 'STABLE', 'DECLINING', 'INACTIVE'],
    default: 'INACTIVE'
  }
}, { _id: false });

const ClientTagSchema = new Schema<IClientTag>({
  tag: {
    type: String,
    required: true
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  color: String
}, { _id: true });

// ----------------------------------------------------------------------------
// MAIN CLIENT SCHEMA
// ----------------------------------------------------------------------------

//const ClientSchema = new Schema<IClient>({
const ClientSchema = new Schema<IClient, IClientModel>({
  // --- Identity ---
  clientType: {
    type: String,
    enum: ['INDIVIDUAL', 'BUSINESS', 'GOVERNMENT', 'NGO'],
    required: true,
    default: 'INDIVIDUAL'
  },
  
  clientNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  
  tradingName: String,
  contactPerson: String,
  jobTitle: String,
  
  // --- Contact ---
  phones: {
    type: [PhoneSchema],
    validate: {
      validator: (phones: IPhone[]) => phones.length > 0,
      message: 'At least one phone number required'
    }
  },
  
  emails: {
    type: [String],
    validate: {
      validator: (emails: string[]) => {
        return emails.every(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
      },
      message: 'Invalid email format'
    }
  },
  
  addresses: {
    type: [AddressSchema],
    validate: {
      validator: (addrs: IAddress[]) => addrs.length > 0,
      message: 'At least one address required'
    }
  },
  
  // --- Classification ---
  category: {
    type: String,
    enum: ['RETAIL', 'WHOLESALE', 'SPECIAL', 'EMPLOYEE', 'VIP'],
    required: true,
    default: 'RETAIL',
    index: true
  },
  
  industry: String,
  
  // --- Financial Terms ---
  paymentTerms: {
    type: Number,
    default: 0, // Cash by default
    min: 0,
    max: 90
  },
  
  taxId: String,
  taxExempt: {
    type: Boolean,
    default: false
  },
  
  // --- Relationship History ---
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  
  documents: [{
    type: Schema.Types.ObjectId,
    ref: 'FinancialDocument'
  }],
  
  payments: [PaymentSummarySchema],
  
  communications: {
    type: [CommunicationLogSchema],
    default: []
  },
  
  // --- Calculated Fields ---
  account: {
    type: ClientAccountSchema,
    default: () => ({})
  },
  
  flags: {
    type: ClientFlagsSchema,
    default: () => ({})
  },
  
  stats: {
    type: ClientStatsSchema,
    default: () => ({})
  },
  
  tags: [ClientTagSchema],
  
  // --- Notes ---
  internalNotes: {
    type: String,
    maxlength: 5000
  },
  
  clientNotes: String,
  
  // --- Audit ---
  referredBy: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  },
  
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    index: true
  },
  
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: false
  },
  
  lastActivityAt: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ----------------------------------------------------------------------------
// INDEXES
// ----------------------------------------------------------------------------

// Search by name
ClientSchema.index({ name: 'text', tradingName: 'text' });

// Account manager view
ClientSchema.index({ assignedTo: 1, category: 1 });

// Risk management
ClientSchema.index({ 'flags.onHold': 1, 'flags.requiresDeposit': 1 });

// Financial queries
ClientSchema.index({ 'account.balanceDue': -1 });
ClientSchema.index({ category: 1, 'stats.totalOrders': -1 });

// Activity tracking
ClientSchema.index({ lastActivityAt: -1 });

// ----------------------------------------------------------------------------
// VIRTUALS
// ----------------------------------------------------------------------------

/**
 * Primary phone number for quick contact
 */
ClientSchema.virtual('primaryPhone').get(function(this: IClient) {
  return this.phones.find(p => p.isPrimary) || this.phones[0];
});

/**
 * Primary email
 */
ClientSchema.virtual('primaryEmail').get(function(this: IClient) {
  return this.emails[0];
});

/**
 * Default shipping address
 */
ClientSchema.virtual('defaultAddress').get(function(this: IClient) {
  return this.addresses.find(a => a.isDefault && a.active) || 
         this.addresses.find(a => a.active);
});

/**
 * Full address string for display
 */
ClientSchema.virtual('fullAddress').get(function(this: IClient) {
  const addr = this.defaultAddress;
  if (!addr) return '';
  return `${addr.street}, ${addr.city}, ${addr.country}`;
});

/**
 * Is credit worthy (can place order on credit)
 */
ClientSchema.virtual('isCreditWorthy').get(function(this: IClient) {
  return !this.flags.creditSuspended && 
         !this.flags.onHold && 
         this.account.availableCredit > 0 &&
         this.account.onTimePaymentRate >= 80;
});

/**
 * Relationship status color for UI
 */
ClientSchema.virtual('relationshipStatus').get(function(this: IClient) {
  if (this.flags.preferred) return 'gold';
  if (this.flags.onHold) return 'red';
  if (this.flags.isSlowPayer) return 'orange';
  if (this.stats.trend === 'GROWING') return 'green';
  if (this.stats.trend === 'DECLINING') return 'yellow';
  return 'gray';
});

// ----------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------

/**
 * Add communication log entry
 * Called automatically from Messaging module
 */
ClientSchema.methods.logCommunication = async function(
  type: CommunicationType,
  direction: 'INBOUND' | 'OUTBOUND',
  summary: string,
  staffId: Types.ObjectId,
  details?: {
    relatedTo?: 'ORDER' | 'INVOICE' | 'GENERAL' | 'COMPLAINT';
    relatedId?: Types.ObjectId;
    duration?: number;
    outcome?: string;
    followUpDate?: Date;
    attachments?: string[];
  }
): Promise<void> {
  this.communications.push({
    timestamp: new Date(),
    communicationType: type,
    direction,
    summary,
    details: details?.outcome,
    relatedTo: details?.relatedTo,
    relatedId: details?.relatedId,
    staff: staffId,
    duration: details?.duration,
    outcome: details?.outcome,
    followUpDate: details?.followUpDate,
    attachments: details?.attachments
  });
  
  this.lastActivityAt = new Date();
  await this.save();
  
  // Auto-log to Time Management
  //const TimeRecord = mongoose.model('TimeRecord');
  await TimeRecord.startTask(
    staffId,
    type === 'CALL' ? 'CLIENT_CALL' : 'CLIENT_MESSAGE',
    {
      module: 'CLIENT',
      entityId: this._id,
      entityNumber: this.clientNumber,
      clientId: this._id,
      clientName: this.name
    },
    `${direction} ${type} with ${this.name}: ${summary}`,
    { deviceId: 'SYSTEM', type: 'DESKTOP' }
  );
};

/**
 * Record payment and update account
 */
ClientSchema.methods.recordPayment = async function(
  amount: number,
  method: string,
  invoiceId?: Types.ObjectId,
  invoiceNumber?: string,
  recordedBy?: Types.ObjectId,
  reference?: string
): Promise<void> {
  this.payments.push({
    amount,
    date: new Date(),
    method: method as any,
    reference,
    againstInvoice: invoiceId,
    invoiceNumber,
    recordedBy: recordedBy || new Types.ObjectId()
  });
  
  this.account.totalPaid += amount;
  this.account.balanceDue -= amount;
  this.account.availableCredit = this.account.creditLimit - Math.max(0, this.account.balanceDue);
  this.account.lastPaymentDate = new Date();
  this.account.lastPaymentAmount = amount;
  this.account.daysSinceLastPayment = 0;
  
  // Recalculate average payment days
  const paidInvoices = this.payments.filter((p: { againstInvoice: any; }) => p.againstInvoice);
  if (paidInvoices.length > 0) {
    // Would need invoice dates to calculate accurately
    // Simplified: track in document schema
  }
  
  this.lastActivityAt = new Date();
  await this.save();
  
  // Update flags based on payment
  await this.evaluateFlags();
};

/**
 * Add order to history
 */
ClientSchema.methods.addOrder = async function(orderId: Types.ObjectId): Promise<void> {
  this.orders.push(orderId);
  this.stats.totalOrders += 1;
  this.stats.lastOrderDate = new Date();
  
  if (!this.stats.firstOrderDate) {
    this.stats.firstOrderDate = new Date();
  }
  
  // Recalculate relationship metrics
  this.recalculateStats();
  
  this.lastActivityAt = new Date();
  await this.save();
};

/**
 * Add document (invoice/quotation) to history
 */
ClientSchema.methods.addDocument = async function(
  documentId: Types.ObjectId,
  docType: 'INVOICE' | 'QUOTATION' | 'RECEIPT',
  amount: number
): Promise<void> {
  this.documents.push(documentId);
  
  if (docType === 'INVOICE') {
    this.stats.totalInvoices += 1;
    this.account.totalPurchases += amount;
    this.account.balanceDue += amount;
    this.account.availableCredit = this.account.creditLimit - Math.max(0, this.account.balanceDue);
  } else if (docType === 'QUOTATION') {
    this.stats.totalQuotations += 1;
  }
  
  this.lastActivityAt = new Date();
  await this.save();
};

/**
 * Recalculate all statistics
 */
ClientSchema.methods.recalculateStats = function(): void {
  const now = new Date();
  
  // Relationship length
  if (this.stats.firstOrderDate) {
    this.stats.relationshipLengthDays = Math.floor(
      (now.getTime() - this.stats.firstOrderDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }
  
  // Orders per month
  if (this.stats.relationshipLengthDays > 0) {
    this.stats.ordersPerMonth = parseFloat(
      (this.stats.totalOrders / (this.stats.relationshipLengthDays / 30)).toFixed(2)
    );
  }
  
  // Days since last order
  if (this.stats.lastOrderDate) {
    this.stats.daysSinceLastOrder = Math.floor(
      (now.getTime() - this.stats.lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }
  
  // Trend analysis
  if (this.stats.daysSinceLastOrder && this.stats.daysSinceLastOrder > 90) {
    this.stats.trend = 'INACTIVE';
  } else if (this.stats.ordersPerMonth > 5) {
    this.stats.trend = 'GROWING';
  } else if (this.stats.ordersPerMonth < 1 && this.stats.totalOrders > 5) {
    this.stats.trend = 'DECLINING';
  } else {
    this.stats.trend = 'STABLE';
  }
  
  // Average order value
  if (this.stats.totalOrders > 0) {
    this.stats.averageOrderValue = Math.round(
      this.account.totalPurchases / this.stats.totalOrders
    );
  }
};

/**
 * Evaluate and update risk flags
 * Called after payments, disputes, order changes
 */
ClientSchema.methods.evaluateFlags = async function(): Promise<void> {
  // Slow payer detection (> 30 days average, > 2 late payments)
  if (this.account.averagePaymentDays > 30 || this.account.onTimePaymentRate < 70) {
    this.flags.isSlowPayer = true;
    this.flags.requiresDeposit = true;
  }
  
  // Credit limit exceeded
  if (this.account.balanceDue > this.account.creditLimit) {
    this.flags.creditSuspended = true;
  }
  
  // High maintenance (frequent communications)
  /*const recentCommunications = this.communications.filter(
      (    c: { timestamp: number; }) => c.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  */

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentCommunications = this.communications.filter(
    (c: { timestamp: any; }) => c.timestamp > thirtyDaysAgo
  );

  if (recentCommunications.length > 20) {
    this.flags.highMaintenance = true;
  }
  
  // Frequent changer (would need order modification tracking)
  // This would be updated from Order module when modifications occur
  
  await this.save();
};

/**
 * Get complete relationship summary for dashboard
 */
ClientSchema.methods.getRelationshipSummary = function(): object {
  return {
    clientId: this._id,
    clientNumber: this.clientNumber,
    name: this.name,
    category: this.category,
    
    // Financial snapshot
    financial: {
      balanceDue: this.account.balanceDue,
      availableCredit: this.account.availableCredit,
      creditWorthy: this.isCreditWorthy,
      paymentTerms: this.paymentTerms
    },
    
    // Activity summary
    activity: {
      totalOrders: this.stats.totalOrders,
      lastOrderDate: this.stats.lastOrderDate,
      daysSinceLastOrder: this.stats.daysSinceLastOrder,
      trend: this.stats.trend
    },
    
    // Risk flags
    flags: this.flags,
    statusColor: this.relationshipStatus,
    
    // Recent activity
    lastCommunication: this.communications[this.communications.length - 1],
    openOrders: this.orders.length, // Would filter by status in real implementation
    
    // Quick actions
    primaryPhone: this.primaryPhone?.number,
    primaryEmail: this.primaryEmail,
    defaultAddress: this.defaultAddress
  };
};

/**
 * Check if order can be placed
 * Validates credit, flags, holds
 */
ClientSchema.methods.canPlaceOrder = function(orderValue: number): {
  allowed: boolean;
  reason?: string;
  requiresDeposit?: boolean;
  depositAmount?: number;
} {
  // Check holds
  if (this.flags.onHold) {
    return { allowed: false, reason: 'Account on hold - contact management' };
  }
  
  // Check credit suspended
  if (this.flags.creditSuspended && this.account.balanceDue > 0) {
    return { 
      allowed: false, 
      reason: `Credit suspended. Outstanding balance: KSh ${this.account.balanceDue}` 
    };
  }
  
  // Check credit limit for this order
  const projectedBalance = this.account.balanceDue + orderValue;
  if (projectedBalance > this.account.creditLimit) {
    const available = this.account.creditLimit - this.account.balanceDue;
    return {
      allowed: false,
      reason: `Exceeds credit limit. Available: KSh ${available}, Order: KSh ${orderValue}`
    };
  }
  
  // Check if deposit required
  if (this.flags.requiresDeposit || this.category === 'RETAIL' && orderValue > 50000) {
    return {
      allowed: true,
      requiresDeposit: true,
      depositAmount: Math.round(orderValue * 0.5) // 50% deposit
    };
  }
  
  return { allowed: true };
};

/**
 * Add or update address
 */
ClientSchema.methods.addAddress = function(addressData: Omit<IAddress, 'addedAt'>): IAddress {
  // Deactivate existing default if new one is default
  if (addressData.isDefault) {
    this.addresses.forEach((a: { isDefault: boolean; }) => { if (a.isDefault) a.isDefault = false; });
  }
  
  const newAddress = {
    ...addressData,
    addedAt: new Date()
  } as IAddress;
  
  this.addresses.push(newAddress);
  return newAddress;
};

/**
 * Get address by type
 */
ClientSchema.methods.getAddressByType = function(type: AddressType): IAddress | undefined {
  return this.addresses.find((a: { addressType: string; active: any; }) => a.addressType === type && a.active);
};

/**
 * Add tag with validation
 */
ClientSchema.methods.addTag = function(
  tag: string, 
  addedBy: Types.ObjectId, 
  color?: string
): void {
  const exists = this.tags.find((t: { tag: string; }) => t.tag.toLowerCase() === tag.toLowerCase());
  if (!exists) {
    this.tags.push({
      tag,
      addedBy,
      addedAt: new Date(),
      color
    });
  }
};

/**
 * Get preferred delivery address for order
 */
ClientSchema.methods.getDeliveryAddress = function(preferredType?: AddressType): IAddress {
  if (preferredType) {
    const specific = this.getAddressByType(preferredType);
    if (specific) return specific;
  }
  
  return this.defaultAddress || this.addresses.find((a: { active: any; }) => a.active)!;
};

// ----------------------------------------------------------------------------
// STATICS
// ----------------------------------------------------------------------------

/**
 * Generate next client number
 * Format: C-000001, C-000002, etc.
 */
ClientSchema.statics.generateClientNumber = async function(): Promise<string> {
  const lastClient = await this.findOne(
    {},
    { clientNumber: 1 },
    { sort: { clientNumber: -1 } }
  );
  
  let lastNum = 0;
  if (lastClient) {
    const match = lastClient.clientNumber.match(/C-(\d+)/);
    if (match) lastNum = parseInt(match[1]);
  }
  
  return `C-${String(lastNum + 1).padStart(6, '0')}`;
};

/**
 * Search clients with filters
 */
ClientSchema.statics.search = async function(
  query: string,
  options: {
    category?: ClientCategory;
    flags?: Partial<IClientFlags>;
    assignedTo?: Types.ObjectId;
    hasBalance?: boolean;
    limit?: number;
  } = {}
): Promise<IClient[]> {
  const searchQuery: any = {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { tradingName: { $regex: query, $options: 'i' } },
      { clientNumber: { $regex: query, $options: 'i' } },
      { 'phones.number': { $regex: query } },
      { emails: { $regex: query, $options: 'i' } }
    ]
  };
  
  if (options.category) searchQuery.category = options.category;
  if (options.assignedTo) searchQuery.assignedTo = options.assignedTo;
  if (options.hasBalance) searchQuery['account.balanceDue'] = { $gt: 0 };
  
  // Handle flags
  if (options.flags) {
    Object.entries(options.flags).forEach(([key, value]) => {
      searchQuery[`flags.${key}`] = value;
    });
  }
  
  return this.find(searchQuery)
    .limit(options.limit || 20)
    .sort({ lastActivityAt: -1 })
    .populate('assignedTo', 'firstName lastName');
};

/**
 * Get clients requiring attention (dashboard alert)
 */
ClientSchema.statics.getRequiringAttention = async function(): Promise<IClient[]> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  return this.find({
    $or: [
      // Overdue balance
      { 'account.balanceDue': { $gt: 0 }, 'account.oldestUnpaidInvoice': { $lt: thirtyDaysAgo } },
      // On hold
      { 'flags.onHold': true },
      // Credit suspended but has balance
      { 'flags.creditSuspended': true, 'account.balanceDue': { $gt: 0 } },
      // High maintenance recent activity
      { 'flags.highMaintenance': true, lastActivityAt: { $gt: thirtyDaysAgo } }
    ]
  }).sort({ 'account.balanceDue': -1 });
};

/**
 * Get top clients by revenue
 */
ClientSchema.statics.getTopClients = async function(
  limit: number = 10,
  period: 'month' | 'quarter' | 'year' = 'year'
): Promise<Array<{ client: IClient; revenue: number; orderCount: number }>> {
  const now = new Date();
  let startDate: Date;
  
  switch (period) {
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }
  
  // Aggregate from documents
  const FinancialDocument = mongoose.model('FinancialDocument');
  
  const results = await FinancialDocument.aggregate([
    {
      $match: {
        issueDate: { $gte: startDate },
        documentType: { $in: ['INVOICE', 'CASH_SALE'] },
        status: { $nin: ['CANCELLED', 'DRAFT'] }
      }
    },
    {
      $group: {
        _id: '$client.clientId',
        revenue: { $sum: '$total' },
        documentCount: { $sum: 1 }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: limit }
  ]);
  
  // Populate client details
  const clients = await this.find({
    _id: { $in: results.map(r => r._id) }
  });
  
  return results.map(r => ({
    client: clients.find((c: { _id: { toString: () => any; }; }) => c._id.toString() === r._id.toString())!,
    revenue: r.revenue,
    orderCount: r.documentCount
  }));
};

/**
 * Get aging receivables by client
 */
ClientSchema.statics.getAgingReceivables = async function(): Promise<Array<{
  client: IClient;
  current: number;
  days30: number;
  days60: number;
  days90: number;
  total: number;
}>> {
  const clients = await this.find({ 'account.balanceDue': { $gt: 0 } });
  
  const now = new Date();
  return clients.map((client) => {
  //return clients.map((client: { documents: any; account: { balanceDue: any; }; }) => {
    const unpaidDocs = client.documents; // Would filter to unpaid invoices
    
    // Simplified aging - in real implementation, query Document collection
    const aging = {
      current: 0,
      days30: 0,
      days60: 0,
      days90: 0,
      total: client.account.balanceDue
    };
    
    return {
      client,
      ...aging
    };
  }).sort((a: { total: number; }, b: { total: number; }) => b.total - a.total);
};

/**
 * Create client from initial contact
 */
ClientSchema.statics.createFromLead = async function(
  leadData: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    source?: string;
  },
  createdBy: Types.ObjectId
): Promise<IClient> {
  const clientNumber = await this.generateClientNumber();
  
  const client = new this({
    clientNumber,
    clientType: 'INDIVIDUAL',
    name: leadData.name,
    phones: [{
      phoneType: 'MOBILE',
      number: leadData.phone,
      isPrimary: true,
      isVerified: false,
      whatsappEnabled: true,
      callConsent: true
    }],
    emails: leadData.email ? [leadData.email] : [],
    addresses: leadData.address ? [{
      addressType: 'SHIPPING',
      street: leadData.address,
      city: 'Unknown',
      country: 'Kenya',
      isDefault: true,
      active: true,
      addedAt: new Date()
    }] : [],
    category: 'RETAIL',
    paymentTerms: 0,
    createdBy
  });
  
  await client.save();
  
  // Log creation
  await client.logCommunication(
    'CALL',
    'INBOUND',
    `Initial contact from ${leadData.source || 'walk-in'}`,
    createdBy,
    { outcome: 'Converted to client' }
  );
  
  return client;
};

// ----------------------------------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------------------------------

/**
 * Pre-save: Generate client number if new
 */
/*ClientSchema.pre('save', async function() {
  if (this.isNew && !this.clientNumber) {
    this.clientNumber = await (this.constructor as any).generateClientNumber();
  }
  
  // Ensure at least one phone is primary
  if (this.phones.length > 0 && !this.phones.some(p => p.isPrimary)) {
    this.phones[0].isPrimary = true;
  }
  
  // Ensure at least one address is default
  if (this.addresses.length > 0 && !this.addresses.some(a => a.isDefault)) {
    this.addresses[0].isDefault = true;
  }
  
  // Recalculate stats
  if (this.isModified('orders') || this.isModified('account.totalPurchases')) {
    this.recalculateStats();
  }
  
  // Update available credit
  this.account.availableCredit = this.account.creditLimit - Math.max(0, this.account.balanceDue);
  
});*/

// With this:
ClientSchema.pre('validate', async function() {
  if (this.isNew && !this.clientNumber) {
    this.clientNumber = await (this.constructor as any).generateClientNumber();
  }
  
  // Ensure at least one phone is primary
  if (this.phones.length > 0 && !this.phones.some(p => p.isPrimary)) {
    this.phones[0].isPrimary = true;
  }
  
  // Ensure at least one address is default
  if (this.addresses.length > 0 && !this.addresses.some(a => a.isDefault)) {
    this.addresses[0].isDefault = true;
  }
  
  // Recalculate stats
  if (this.isModified('orders') || this.isModified('account.totalPurchases')) {
    this.recalculateStats();
  }
  
  // Update available credit
  this.account.availableCredit = this.account.creditLimit - Math.max(0, this.account.balanceDue);
});

/**
 * Post-save: Update search index (if using Elasticsearch, etc.)
 */
ClientSchema.post('save', async function(doc) {
  // Could trigger search index update here
  console.log(`[Client] Updated: ${doc.name} (${doc.clientNumber})`);
});

// ----------------------------------------------------------------------------
// MODEL EXPORT
// ----------------------------------------------------------------------------

//export const Client = mongoose.model<IClient>('Client', ClientSchema);
export const Client = mongoose.model<IClient, IClientModel>('Client', ClientSchema);
export default Client;

// ============================================================================
// INTEGRATION EXAMPLES
// ============================================================================

/**
 * ORDER CREATION WORKFLOW:
 * 
 * // Check client can place order
 * const client = await Client.findById(clientId);
 * const orderCheck = client.canPlaceOrder(orderTotal);
 * 
 * if (!orderCheck.allowed) {
 *   return res.status(400).json({ error: orderCheck.reason });
 * }
 * 
 * if (orderCheck.requiresDeposit) {
 *   // Require deposit before confirming
 *   order.depositRequired = orderCheck.depositAmount;
 * }
 * 
 * // Create order
 * const order = await Order.create({...});
 * 
 * // Link to client
 * await client.addOrder(order._id);
 * 
 * // Auto-log communication
 * await client.logCommunication(
 *   'EMAIL',
 *   'OUTBOUND',
 *   `Order confirmation ${order.orderNumber}`,
 *   jacky._id,
 *   { relatedTo: 'ORDER', relatedId: order._id }
 * );
 */

/**
 * INVOICE ISSUANCE:
 * 
 * // Create invoice
 * const invoice = await FinancialDocument.createFromOrder(order, issuer, staffId);
 * await invoice.issue(staffId);
 * 
 * // Update client
 * await client.addDocument(invoice._id, 'INVOICE', invoice.total);
 * 
 * // Check if credit limit approaching
 * if (client.account.availableCredit < 10000) {
 *   await Message.createSystemNotification(
 *     'Credit Limit Alert',
 *     `${client.name} is approaching credit limit. Available: KSh ${client.account.availableCredit}`,
 *     { relatedTo: 'CLIENT', relatedId: client._id, relatedNumber: client.clientNumber, priority: 'HIGH' },
 *     [gilbert._id]
 *   );
 * }
 */

/**
 * PAYMENT RECORDING:
 * 
 * // Record payment
 * await client.recordPayment(
 *   50000,
 *   'MPESA',
 *   invoice._id,
 *   invoice.documentNumber,
 *   george._id,
 *   'QK7X9P2M'
 * );
 * 
 * // Check if flags need updating
 * if (client.account.balanceDue <= 0 && client.flags.creditSuspended) {
 *   client.flags.creditSuspended = false;
 *   await client.save();
 *   
 *   await Message.createSystemNotification(
 *     'Credit Restored',
 *     `${client.name} has cleared balance. Credit restored.`,
 *     { relatedTo: 'CLIENT', relatedId: client._id, priority: 'NORMAL' },
 *     [gilbert._id, jacky._id]
 *   );
 * }
 */

/**
 * COMMUNICATION TRACKING:
 * 
 * // Incoming WhatsApp
 * await client.logCommunication(
 *   'WHATSAPP',
 *   'INBOUND',
 *   'Client asking about delivery date',
 *   jacky._id,
 *   { 
 *     relatedTo: 'ORDER', 
 *     relatedId: order._id,
 *     outcome: 'Provided tracking info',
 *     followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
 *   }
 * );
 * 
 * // Check if high maintenance
 * const recentComms = client.communications.filter(
 *   c => c.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
 * );
 * if (recentComms.length > 10 && !client.flags.highMaintenance) {
 *   client.flags.highMaintenance = true;
 *   await client.save();
 * }
 */

/**
 * DASHBOARD QUERIES:
 * 
 * // Get clients needing attention
 * const attentionNeeded = await Client.getRequiringAttention();
 * 
 * // Search clients
 * const results = await Client.search('ABC Ltd', { 
 *   category: 'WHOLESALE',
 *   hasBalance: true,
 *   limit: 10 
 * });
 * 
 * // Top clients this quarter
 * const topClients = await Client.getTopClients(10, 'quarter');
 * 
 * // Aging report
 * const aging = await Client.getAgingReceivables();
 * 
 * // Get relationship summary for client view
 * const summary = client.getRelationshipSummary();
 */

/**
 * AUTOMATED FLAG EVALUATION:
 * 
 * // Run daily via cron job
 * const clients = await Client.find({ isActive: true });
 * 
 * for (const client of clients) {
 *   // Check payment behavior
 *   if (client.account.averagePaymentDays > 45) {
 *     client.flags.isSlowPayer = true;
 *     client.flags.requiresDeposit = true;
 *   }
 *   
 *   // Check inactive clients
 *   if (client.stats.daysSinceLastOrder && client.stats.daysSinceLastOrder > 90) {
 *     client.stats.trend = 'INACTIVE';
 *     
 *     // Send re-engagement message
 *     await Messaging.sendToClient(client._id, {
 *       subject: 'We miss you!',
 *       body: 'It has been a while since your last order...'
 *     });
 *   }
 *   
 *   await client.save();
 * }
 */

/**
 * MULTI-LOCATION CLIENT:
 * 
 * // Client with multiple shops
 * const client = await Client.findById(shopChainId);
 * 
 * // Add new location
 * client.addAddress({
 *   addressType: 'SHOP_C',
 *   label: 'Mombasa Branch',
 *   street: '123 Moi Avenue',
 *   city: 'Mombasa',
 *   instructions: 'Loading dock at back',
 *   isDefault: false,
 *   active: true
 * });
 * 
 * // Place order for specific location
 * const deliveryAddr = client.getDeliveryAddress('SHOP_B');
 * 
 * // Create order with specific destination
 * const order = await Order.create({
 *   client: client._id,
 *   destination: {
 *     deliveryPointId: deliveryAddr._id,
 *     name: deliveryAddr.label,
 *     address: `${deliveryAddr.street}, ${deliveryAddr.city}`
 *   }
 * });
 */

/**
 * RISK MANAGEMENT:
 * 
 * // Before shipping large order
 * const client = await Client.findById(clientId);
 * 
 * if (client.flags.onHold) {
 *   throw new Error('Account on hold - do not ship');
 * }
 * 
 * if (client.account.balanceDue > client.account.creditLimit * 0.8) {
 *   // Require partial payment
 *   await Message.createSystemNotification(
 *     'High Balance Alert',
 *     `${client.name} at 80% of credit limit. Consider partial payment before shipping.`,
 *     { relatedTo: 'CLIENT', relatedId: client._id, priority: 'HIGH' },
 *     [gilbert._id]
 *   );
 * }
 * 
 * // Check dispute history
 * const recentDisputes = client.communications.filter(
 *   c => c.relatedTo === 'COMPLAINT' && 
 *        c.timestamp > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
 * );
 * 
 * if (recentDisputes.length > 3) {
 *   client.flags.isFrequentDisputer = true;
 *   // Require photo documentation for all shipments
 *   await client.save();
 * }
 */
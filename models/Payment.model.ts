// models/payment.model.ts
/*import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// ----------------------------------------------------------------------------
// TYPE DEFINITIONS
// ----------------------------------------------------------------------------

export type PaymentStatus = 
  | 'PENDING'      // Payment initiated but not completed
  | 'PROCESSING'   // STK push sent, waiting for user
  | 'COMPLETED'    // Payment successful
  | 'FAILED'       // Payment failed
  | 'CANCELLED'    // Payment cancelled by user
  | 'REVERSED';    // Payment reversed/refunded

export type PaymentMethod = 
  | 'mpesa' 
  | 'card' 
  | 'bank_transfer' 
  | 'cash' 
  | 'cheque';

export type PaymentChannel = 
  | 'stk_push' 
  | 'c2b' 
  | 'b2c' 
  | 'card_payment' 
  | 'bank_transfer';

export interface IPaymentMetadata {
  // M-Pesa specific fields
  checkoutRequestID?: string;
  merchantRequestID?: string;
  mpesaReceiptNumber?: string;
  resultCode?: number;
  resultDesc?: string;
  transactionDate?: string;
  
  // Additional metadata
  phoneNumber?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  billRefNumber?: string;
  
  // Custom fields
  customData?: Record<string, any>;
}

export interface IPayment extends Document {
  // Core fields
  paymentId: string;           // Unique payment ID (e.g., PAY-2024-0001)
  orderId: Types.ObjectId;     // Reference to Order
  orderNumber: string;         // Denormalized for quick access
  
  // Payment details
  amount: number;
  currency: string;            // Default 'KES'
  method: PaymentMethod;
  channel: PaymentChannel;
  status: PaymentStatus;
  
  // Customer information
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  
  // Transaction references
  transactionReference?: string;  // M-Pesa Receipt Number / Bank Ref
  externalReference?: string;     // CheckoutRequestID from Safaricom
  
  // Metadata
  metadata: IPaymentMetadata;
  
  // Timestamps
  requestedAt: Date;           // When payment was initiated
  processedAt?: Date;          // When payment was processed
  completedAt?: Date;          // When payment was successful
  failedAt?: Date;             // When payment failed
  
  // Status tracking
  statusHistory: IStatusHistoryEntry[];
  retryCount: number;
  maxRetries: number;
  
  // Error handling
  errorCode?: string;
  errorMessage?: string;
  
  // Audit
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  
  // Additional flags
  isVerified: boolean;
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;
  
  // For refunds
  refundedAmount?: number;
  refundedAt?: Date;
  refundReference?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Virtuals
  isSuccessful: boolean;
  isPending: boolean;
  canRetry: boolean;
  timeToComplete: number | null;
  
  // Methods
  markAsProcessing(): Promise<void>;
  markAsCompleted(receiptNumber: string, metadata?: Partial<IPaymentMetadata>): Promise<void>;
  markAsFailed(errorCode: string, errorMessage: string): Promise<void>;
  markAsReversed(reason: string, reference?: string): Promise<void>;
  retry(): Promise<IPayment>;
}

export interface IStatusHistoryEntry {
  status: PaymentStatus;
  changedAt: Date;
  reason?: string;
  metadata?: Record<string, any>;
}

// ----------------------------------------------------------------------------
// SCHEMA DEFINITIONS
// ----------------------------------------------------------------------------

const PaymentMetadataSchema = new Schema<IPaymentMetadata>({
  // M-Pesa specific fields
  checkoutRequestID: { type: String, index: true },
  merchantRequestID: { type: String, index: true },
  mpesaReceiptNumber: { type: String, index: true, sparse: true },
  resultCode: { type: Number },
  resultDesc: { type: String },
  transactionDate: { type: String },
  
  // Additional metadata
  phoneNumber: { type: String },
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  billRefNumber: { type: String },
  
  // Custom data
  customData: { type: Schema.Types.Mixed, default: {} }
}, { _id: false });

const StatusHistoryEntrySchema = new Schema<IStatusHistoryEntry>({
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REVERSED'], required: true },
  changedAt: { type: Date, default: Date.now },
  reason: { type: String },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, { _id: true });

// ----------------------------------------------------------------------------
// MAIN PAYMENT SCHEMA
// ----------------------------------------------------------------------------

const PaymentSchema = new Schema<IPayment>({
  paymentId: { type: String, required: true, unique: true, index: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  orderNumber: { type: String, required: true, index: true },
  
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'KES', uppercase: true },
  method: { type: String, enum: ['mpesa', 'card', 'bank_transfer', 'cash', 'cheque'], required: true },
  channel: { type: String, enum: ['stk_push', 'c2b', 'b2c', 'card_payment', 'bank_transfer'], required: true },
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REVERSED'], default: 'PENDING', index: true },
  
  customerName: { type: String },
  customerEmail: { type: String },
  customerPhone: { type: String, index: true },
  
  transactionReference: { type: String, index: true, sparse: true },
  externalReference: { type: String, index: true, sparse: true },
  
  metadata: { type: PaymentMetadataSchema, default: () => ({}) },
  
  requestedAt: { type: Date, default: Date.now, index: true },
  processedAt: { type: Date },
  completedAt: { type: Date, index: true },
  failedAt: { type: Date },
  
  statusHistory: [StatusHistoryEntrySchema],
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 },
  
  errorCode: { type: String },
  errorMessage: { type: String },
  
  createdBy: { type: Schema.Types.ObjectId, ref: 'Staff' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'Staff' },
  
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'Staff' },
  verifiedAt: { type: Date },
  
  refundedAmount: { type: Number, min: 0 },
  refundedAt: { type: Date },
  refundReference: { type: String }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ----------------------------------------------------------------------------
// INDEXES
// ----------------------------------------------------------------------------

PaymentSchema.index({ status: 1, requestedAt: -1 });
PaymentSchema.index({ orderId: 1, status: 1 });
PaymentSchema.index({ 'metadata.checkoutRequestID': 1 });
PaymentSchema.index({ 'metadata.mpesaReceiptNumber': 1 });
PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ customerPhone: 1, status: 1 });

// Compound indexes for common queries
PaymentSchema.index({ orderNumber: 1, method: 1 });
PaymentSchema.index({ status: 1, createdAt: 1 });
PaymentSchema.index({ completedAt: -1, amount: 1 });

// ----------------------------------------------------------------------------
// VIRTUALS
// ----------------------------------------------------------------------------

PaymentSchema.virtual('isSuccessful').get(function(this: IPayment) {
  return this.status === 'COMPLETED';
});

PaymentSchema.virtual('isPending').get(function(this: IPayment) {
  return ['PENDING', 'PROCESSING'].includes(this.status);
});

PaymentSchema.virtual('canRetry').get(function(this: IPayment) {
  return this.status === 'FAILED' && this.retryCount < this.maxRetries;
});

PaymentSchema.virtual('timeToComplete').get(function(this: IPayment) {
  if (!this.completedAt || !this.requestedAt) return null;
  return this.completedAt.getTime() - this.requestedAt.getTime();
});

// ----------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------

PaymentSchema.methods.markAsProcessing = async function(this: IPayment): Promise<void> {
  this.status = 'PROCESSING';
  this.processedAt = new Date();
  
  this.statusHistory.push({
    status: 'PROCESSING',
    changedAt: new Date(),
    reason: 'Payment processing initiated'
  });
  
  await this.save();
};

PaymentSchema.methods.markAsCompleted = async function(
  this: IPayment,
  receiptNumber: string,
  metadata?: Partial<IPaymentMetadata>
): Promise<void> {
  this.status = 'COMPLETED';
  this.completedAt = new Date();
  this.transactionReference = receiptNumber;
  this.isVerified = true;
  this.verifiedAt = new Date();
  
  if (metadata) {
    this.metadata = { ...this.metadata, ...metadata };
  }
  
  this.statusHistory.push({
    status: 'COMPLETED',
    changedAt: new Date(),
    reason: 'Payment completed successfully',
    metadata: { receiptNumber }
  });
  
  await this.save();
};

PaymentSchema.methods.markAsFailed = async function(
  this: IPayment,
  errorCode: string,
  errorMessage: string
): Promise<void> {
  this.status = 'FAILED';
  this.failedAt = new Date();
  this.errorCode = errorCode;
  this.errorMessage = errorMessage;
  
  this.statusHistory.push({
    status: 'FAILED',
    changedAt: new Date(),
    reason: errorMessage,
    metadata: { errorCode }
  });
  
  await this.save();
};

PaymentSchema.methods.markAsReversed = async function(
  this: IPayment,
  reason: string,
  reference?: string
): Promise<void> {
  this.status = 'REVERSED';
  this.refundReference = reference;
  this.refundedAt = new Date();
  
  this.statusHistory.push({
    status: 'REVERSED',
    changedAt: new Date(),
    reason,
    metadata: { reference }
  });
  
  await this.save();
};

PaymentSchema.methods.retry = async function(this: IPayment): Promise<IPayment> {
  if (!this.canRetry) {
    throw new Error(`Cannot retry payment. Current status: ${this.status}, Retry count: ${this.retryCount}`);
  }
  
  this.retryCount += 1;
  this.status = 'PENDING';
  this.errorCode = undefined;
  this.errorMessage = undefined;
  this.failedAt = undefined;
  
  this.statusHistory.push({
    status: 'PENDING',
    changedAt: new Date(),
    reason: `Retry attempt ${this.retryCount}`
  });
  
  await this.save();
  return this;
};

// ----------------------------------------------------------------------------
// STATIC METHODS
// ----------------------------------------------------------------------------

PaymentSchema.static('generatePaymentId', async function(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `PAY-${year}-`;
  
  const lastPayment = await this.findOne(
    { paymentId: { $regex: `^${prefix}` } },
    { paymentId: 1 },
    { sort: { paymentId: -1 } }
  );
  
  let sequence = 1;
  if (lastPayment) {
    const lastSequence = parseInt(lastPayment.paymentId.split('-')[2]);
    sequence = lastSequence + 1;
  }
  
  return `${prefix}${sequence.toString().padStart(6, '0')}`;
});

PaymentSchema.static('findByTransactionReference', function(transactionReference: string) {
  return this.findOne({ transactionReference });
});

PaymentSchema.static('findByCheckoutRequestId', function(checkoutRequestID: string) {
  return this.findOne({ 'metadata.checkoutRequestID': checkoutRequestID });
});

PaymentSchema.static('findPendingPayments', function(hoursOld: number = 1) {
  const cutoffTime = new Date(Date.now() - hoursOld * 60 * 60 * 1000);
  return this.find({
    status: { $in: ['PENDING', 'PROCESSING'] },
    requestedAt: { $lt: cutoffTime },
    retryCount: { $lt: 3 }
  }).sort({ requestedAt: 1 });
});

// ----------------------------------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------------------------------

PaymentSchema.pre<IPayment>('save', async function(next) {
  if (this.isNew) {
    this.paymentId = await (this.constructor as any).generatePaymentId();
  }

});

PaymentSchema.post<IPayment>('save', async function(doc) {
  // If payment is completed, update order payments
  if (doc.status === 'COMPLETED' && doc.isNew === false) {
    const Order = mongoose.model('Order');
    await Order.findByIdAndUpdate(doc.orderId, {
      $push: {
        payments: {
          method: doc.method,
          reference: doc.transactionReference,
          amount: doc.amount,
          paidAt: doc.completedAt,
          verifiedBy: doc.verifiedBy
        }
      },
      $inc: { balance: -doc.amount }
    });
    
    console.log(`[Payment] Updated order ${doc.orderNumber} with payment ${doc.paymentId}`);
  }
});

// ----------------------------------------------------------------------------
// MODEL EXPORT
// ----------------------------------------------------------------------------

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;*/

// models/payment.model.ts (Fixed)
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// ----------------------------------------------------------------------------
// TYPE DEFINITIONS
// ----------------------------------------------------------------------------

export type PaymentStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REVERSED';

export type PaymentMethod = 
  | 'mpesa' 
  | 'card' 
  | 'bank_transfer' 
  | 'cash' 
  | 'cheque';

export type PaymentChannel = 
  | 'stk_push' 
  | 'c2b' 
  | 'b2c' 
  | 'card_payment' 
  | 'bank_transfer';

export interface IPaymentMetadata {
  checkoutRequestID?: string;
  merchantRequestID?: string;
  mpesaReceiptNumber?: string;
  resultCode?: number;
  resultDesc?: string;
  transactionDate?: string;
  phoneNumber?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  billRefNumber?: string;
  customData?: Record<string, any>;
  toObject(): IPaymentMetadata;
}

export interface IStatusHistoryEntry {
  status: PaymentStatus;
  changedAt: Date;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface IPayment extends Document {
  paymentId: string;
  orderId: Types.ObjectId;
  orderNumber: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  channel: PaymentChannel;
  status: PaymentStatus;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  transactionReference?: string;
  externalReference?: string;
  metadata: IPaymentMetadata;
  requestedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  statusHistory: IStatusHistoryEntry[];
  retryCount: number;
  maxRetries: number;
  errorCode?: string;
  errorMessage?: string;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isVerified: boolean;
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;
  refundedAmount?: number;
  refundedAt?: Date;
  refundReference?: string;
  createdAt: Date;
  updatedAt: Date;
  wasNew?: boolean;
  isSuccessful: boolean;
  isPending: boolean;
  canRetry: boolean;
  timeToComplete: number | null;
  markAsProcessing(): Promise<void>;
  markAsCompleted(receiptNumber: string, metadata?: Partial<IPaymentMetadata>): Promise<void>;
  markAsFailed(errorCode: string, errorMessage: string): Promise<void>;
  markAsReversed(reason: string, reference?: string): Promise<void>;
  retry(): Promise<IPayment>;
}

// ----------------------------------------------------------------------------
// SCHEMA DEFINITIONS
// ----------------------------------------------------------------------------

const PaymentMetadataSchema = new Schema<IPaymentMetadata>({
  checkoutRequestID: { type: String },
  merchantRequestID: { type: String },
  mpesaReceiptNumber: { type: String },
  resultCode: { type: Number },
  resultDesc: { type: String },
  transactionDate: { type: String },
  phoneNumber: { type: String },
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  billRefNumber: { type: String },
  customData: { type: Schema.Types.Mixed, default: {} }
}, { _id: false });

const StatusHistoryEntrySchema = new Schema<IStatusHistoryEntry>({
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REVERSED'], required: true },
  changedAt: { type: Date, default: Date.now },
  reason: { type: String },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, { _id: true });

// ----------------------------------------------------------------------------
// MAIN PAYMENT SCHEMA
// ----------------------------------------------------------------------------

const PaymentSchema = new Schema<IPayment>({
  // FIX: Removed required: true — pre-save middleware auto-generates this
  paymentId: { type: String, unique: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  orderNumber: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'KES', uppercase: true },
  method: { type: String, enum: ['mpesa', 'card', 'bank_transfer', 'cash', 'cheque'], required: true },
  channel: { type: String, enum: ['stk_push', 'c2b', 'b2c', 'card_payment', 'bank_transfer'], required: true },
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REVERSED'], default: 'PENDING' },
  customerName: { type: String },
  customerEmail: { type: String },
  customerPhone: { type: String },
  transactionReference: { type: String },
  externalReference: { type: String },
  metadata: { type: PaymentMetadataSchema, default: () => ({}) },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
  completedAt: { type: Date },
  failedAt: { type: Date },
  statusHistory: [StatusHistoryEntrySchema],
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 },
  errorCode: { type: String },
  errorMessage: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Staff' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'Staff' },
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'Staff' },
  verifiedAt: { type: Date },
  refundedAmount: { type: Number, min: 0 },
  refundedAt: { type: Date },
  refundReference: { type: String }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ----------------------------------------------------------------------------
// INDEXES
// ----------------------------------------------------------------------------

// FIX: Removed PaymentSchema.index({ paymentId: 1 }) because unique: true 
// on the field definition already auto-creates this index.

PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ orderNumber: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ transactionReference: 1 }, { sparse: true });
PaymentSchema.index({ externalReference: 1 }, { sparse: true });
PaymentSchema.index({ customerPhone: 1 });
PaymentSchema.index({ requestedAt: -1 });
PaymentSchema.index({ completedAt: -1 });
PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ orderId: 1, status: 1 });
PaymentSchema.index({ status: 1, requestedAt: -1 });
PaymentSchema.index({ orderNumber: 1, method: 1 });
PaymentSchema.index({ status: 1, createdAt: 1 });
PaymentSchema.index({ 'metadata.checkoutRequestID': 1 });
PaymentSchema.index({ 'metadata.mpesaReceiptNumber': 1 });
PaymentSchema.index({ 'metadata.merchantRequestID': 1 });

// ----------------------------------------------------------------------------
// VIRTUALS
// ----------------------------------------------------------------------------

PaymentSchema.virtual('isSuccessful').get(function(this: IPayment) {
  return this.status === 'COMPLETED';
});

PaymentSchema.virtual('isPending').get(function(this: IPayment) {
  return ['PENDING', 'PROCESSING'].includes(this.status);
});

PaymentSchema.virtual('canRetry').get(function(this: IPayment) {
  return this.status === 'FAILED' && this.retryCount < this.maxRetries;
});

PaymentSchema.virtual('timeToComplete').get(function(this: IPayment) {
  if (!this.completedAt || !this.requestedAt) return null;
  return this.completedAt.getTime() - this.requestedAt.getTime();
});

// ----------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------

PaymentSchema.methods.markAsProcessing = async function(this: IPayment): Promise<void> {
  this.status = 'PROCESSING';
  this.processedAt = new Date();
  this.statusHistory.push({
    status: 'PROCESSING',
    changedAt: new Date(),
    reason: 'Payment processing initiated'
  });
  await this.save();
};

PaymentSchema.methods.markAsCompleted = async function(
  this: IPayment,
  receiptNumber: string,
  metadata?: Partial<IPaymentMetadata>
): Promise<void> {
  this.status = 'COMPLETED';
  this.completedAt = new Date();
  this.transactionReference = receiptNumber;
  this.isVerified = true;
  this.verifiedAt = new Date();
  if (metadata) {
    this.metadata = { ...this.metadata.toObject(), ...metadata };
  }
  this.statusHistory.push({
    status: 'COMPLETED',
    changedAt: new Date(),
    reason: 'Payment completed successfully',
    metadata: { receiptNumber }
  });
  await this.save();
};

PaymentSchema.methods.markAsFailed = async function(
  this: IPayment,
  errorCode: string,
  errorMessage: string
): Promise<void> {
  this.status = 'FAILED';
  this.failedAt = new Date();
  this.errorCode = errorCode;
  this.errorMessage = errorMessage;
  this.statusHistory.push({
    status: 'FAILED',
    changedAt: new Date(),
    reason: errorMessage,
    metadata: { errorCode }
  });
  await this.save();
};

PaymentSchema.methods.markAsReversed = async function(
  this: IPayment,
  reason: string,
  reference?: string
): Promise<void> {
  this.status = 'REVERSED';
  this.refundReference = reference;
  this.refundedAt = new Date();
  this.statusHistory.push({
    status: 'REVERSED',
    changedAt: new Date(),
    reason,
    metadata: { reference }
  });
  await this.save();
};

PaymentSchema.methods.retry = async function(this: IPayment): Promise<IPayment> {
  if (!this.canRetry) {
    throw new Error(`Cannot retry payment. Current status: ${this.status}, Retry count: ${this.retryCount}`);
  }
  this.retryCount += 1;
  this.status = 'PENDING';
  this.errorCode = undefined;
  this.errorMessage = undefined;
  this.failedAt = undefined;
  this.statusHistory.push({
    status: 'PENDING',
    changedAt: new Date(),
    reason: `Retry attempt ${this.retryCount}`
  });
  await this.save();
  return this;
};

// ----------------------------------------------------------------------------
// STATIC METHODS
// ----------------------------------------------------------------------------

PaymentSchema.static('generatePaymentId', async function(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `PAY-${year}-`;
  const lastPayment = await this.findOne(
    { paymentId: { $regex: `^${prefix}` } },
    { paymentId: 1 },
    { sort: { paymentId: -1 } }
  );
  let sequence = 1;
  if (lastPayment) {
    const parts = lastPayment.paymentId.split('-');
    const lastSequence = parseInt(parts[parts.length - 1]);
    sequence = lastSequence + 1;
  }
  return `${prefix}${sequence.toString().padStart(6, '0')}`;
});

PaymentSchema.static('findByTransactionReference', function(transactionReference: string) {
  return this.findOne({ transactionReference });
});

PaymentSchema.static('findByCheckoutRequestId', function(checkoutRequestID: string) {
  return this.findOne({ 'metadata.checkoutRequestID': checkoutRequestID });
});

PaymentSchema.static('findPendingPayments', function(hoursOld: number = 1) {
  const cutoffTime = new Date(Date.now() - hoursOld * 60 * 60 * 1000);
  return this.find({
    status: { $in: ['PENDING', 'PROCESSING'] },
    requestedAt: { $lt: cutoffTime },
    retryCount: { $lt: 3 }
  }).sort({ requestedAt: 1 });
});

// ----------------------------------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------------------------------

PaymentSchema.pre<IPayment>('save', async function(next) {
  try {
    this.wasNew = this.isNew;
    if (this.isNew && !this.paymentId) {
      this.paymentId = await (this.constructor as any).generatePaymentId();
      console.log(`📝 Generated paymentId: ${this.paymentId} for new payment`);
    }
    //next();
  } catch (error) {
    console.error('Error in payment pre-save middleware:', error);
    //next(error as Error);
  }
});

PaymentSchema.post<IPayment>('save', async function(doc) {
  if (doc.status === 'COMPLETED' && doc.wasNew) {
    try {
      const Order = mongoose.model('Order');
      const order = await Order.findById(doc.orderId);
      if (order) {
        const paymentExists = order.payments?.some(
          (p: any) => p.reference === doc.transactionReference
        );
        if (!paymentExists) {
          await Order.findByIdAndUpdate(doc.orderId, {
            $push: {
              payments: {
                method: doc.method,
                reference: doc.transactionReference,
                amount: doc.amount,
                paidAt: doc.completedAt,
                verifiedBy: doc.verifiedBy
              }
            },
            $inc: { balance: -doc.amount }
          });
          console.log(`[Payment] Updated order ${doc.orderNumber} with payment ${doc.paymentId}`);
        }
      }
    } catch (error) {
      console.error('Error updating order with payment:', error);
    }
  }
});

// ----------------------------------------------------------------------------
// MODEL EXPORT
// ----------------------------------------------------------------------------

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
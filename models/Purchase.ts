// models/Purchase.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchaseItem {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IPurchase extends Document {
  purchaseNumber: string;
  userId: string;
  userEmail: string;
  items: IPurchaseItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentMethod?: 'MPESA' | 'CASH' | 'BANK_TRANSFER';
  transactionReference?: string;
  mpesaReceiptNumber?: string;
  paymentMetadata?: {
    merchantRequestID?: string;
    checkoutRequestID?: string;
    resultCode?: string;
    resultDesc?: string;
    transactionDate?: string;
    phoneNumber?: string;
    amount?: number;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseItemSchema = new Schema<IPurchaseItem>({
  productId: {
    type: String,
    required: [true, 'Product ID is required'],
  },
  productName: {
    type: String,
    required: [true, 'Product name is required'],
  },
  productImage: {
    type: String,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be at least 0'],
  },
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: [0, 'Total must be at least 0'],
  },
});

const PurchaseSchema = new Schema<IPurchase>(
  {
    purchaseNumber: {
      type: String,
      required: [true, 'Purchase number is required'],
      unique: true,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
    },
    items: {
      type: [PurchaseItemSchema],
      required: [true, 'Items are required'],
      validate: {
        validator: (items: any[]) => items.length > 0,
        message: 'At least one item is required',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be at least 0'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'FAILED', 'CANCELLED'],
      default: 'PENDING',
    },
    paymentMethod: {
      type: String,
      enum: ['MPESA', 'CASH', 'BANK_TRANSFER'],
    },
    transactionReference: {
      type: String,
    },
    mpesaReceiptNumber: {
      type: String,
    },
    paymentMetadata: {
      merchantRequestID: String,
      checkoutRequestID: String,
      resultCode: String,
      resultDesc: String,
      transactionDate: String,
      phoneNumber: String,
      amount: Number,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Generate purchase number before saving
PurchaseSchema.pre('save', function (this: IPurchase, next) {
  if (this.isNew && !this.purchaseNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.purchaseNumber = `LINK-${year}${month}${day}-${random}`;
  }

});

// Method to mark as completed
PurchaseSchema.methods.markAsCompleted = function (
  mpesaReceiptNumber: string,
  metadata: any = {}
) {
  this.status = 'COMPLETED';
  this.mpesaReceiptNumber = mpesaReceiptNumber;
  this.paymentMethod = 'MPESA';
  this.transactionReference = mpesaReceiptNumber;
  if (metadata) {
    this.paymentMetadata = {
      ...this.paymentMetadata,
      ...metadata,
    };
  }
  return this.save();
};

// Method to mark as failed
PurchaseSchema.methods.markAsFailed = function (
  errorCode: string,
  errorMessage: string
) {
  this.status = 'FAILED';
  this.paymentMetadata = {
    ...this.paymentMetadata,
    resultCode: errorCode,
    resultDesc: errorMessage,
  };
  return this.save();
};

// Method to mark as confirmed
PurchaseSchema.methods.markAsConfirmed = function () {
  this.status = 'CONFIRMED';
  return this.save();
};

// Method to cancel
PurchaseSchema.methods.cancel = function (reason?: string) {
  this.status = 'CANCELLED';
  if (reason) {
    this.notes = this.notes ? `${this.notes}\nCancelled: ${reason}` : `Cancelled: ${reason}`;
  }
  return this.save();
};

const Purchase = mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', PurchaseSchema);
export default Purchase;
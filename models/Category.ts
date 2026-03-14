// models/category.model.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

// --------------------------
// Enums
// --------------------------
export enum AlertStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  IGNORED = 'ignored'
}

export enum UrgencyLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// --------------------------
// Category Summary Interfaces
// --------------------------
export interface CategoryInfo {
  category: string;
  categorySlug: string;
  count: number;
  totalStock: number;
  totalValue: number;
  averageMargin: number;
  averageRating: number;
}

export interface ICategorySummary {
  date: Date;
  categories: CategoryInfo[];
  totalProducts: number;
  totalStock: number;
  totalValue: number;
  createdAt: Date;
  updatedAt: Date;
}

// --------------------------
// Stock Alert Interfaces
// --------------------------
export interface IStockAlert {
  productId: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  status: string;
  urgency: UrgencyLevel;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// --------------------------
// Category Summary Schema
// --------------------------
const categoryInfoSchema = new Schema<CategoryInfo>({
  category: { type: String, required: true },
  categorySlug: { type: String, required: true },
  count: { type: Number, required: true, default: 0 },
  totalStock: { type: Number, required: true, default: 0 },
  totalValue: { type: Number, required: true, default: 0 },
  averageMargin: { type: Number, required: true, default: 0 },
  averageRating: { type: Number, required: true, default: 0 }
}, { _id: false });

const categorySummarySchema = new Schema<ICategorySummary, Model<ICategorySummary>>({
  date: { 
    type: Date, 
    required: true, 
    unique: true,
    index: true 
  },
  categories: { 
    type: [categoryInfoSchema], 
    default: [] 
  },
  totalProducts: { 
    type: Number, 
    default: 0 
  },
  totalStock: { 
    type: Number, 
    default: 0 
  },
  totalValue: { 
    type: Number, 
    default: 0 
  }
}, {
  collection: 'categorySummaries',
  timestamps: true
});

// --------------------------
// Stock Alert Schema
// --------------------------
const stockAlertSchema = new Schema<IStockAlert, Model<IStockAlert>>({
  productId: { 
    type: String, 
    required: true,
    index: true 
  },
  sku: { 
    type: String, 
    required: true,
    index: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    index: true 
  },
  currentStock: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  reorderPoint: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  status: { 
    type: String, 
    required: true,
    index: true 
  },
  urgency: { 
    type: String, 
    enum: Object.values(UrgencyLevel),
    default: UrgencyLevel.MEDIUM,
    index: true 
  },
  resolved: { 
    type: Boolean, 
    default: false,
    index: true 
  },
  resolvedAt: { 
    type: Date, 
    default: null 
  },
  resolvedBy: { 
    type: String, 
    default: '' 
  },
  notes: { 
    type: String, 
    default: '' 
  }
}, {
  collection: 'stockAlerts',
  timestamps: true
});

// --------------------------
// Indexes for Performance
// --------------------------
stockAlertSchema.index({ productId: 1, createdAt: -1 });
stockAlertSchema.index({ urgency: 1, resolved: 1 });
stockAlertSchema.index({ category: 1, resolved: 1 });

// --------------------------
// Export Models Only
// --------------------------
export const CategorySummary: Model<ICategorySummary> = mongoose.model<ICategorySummary>('CategorySummary', categorySummarySchema);
export const StockAlert: Model<IStockAlert> = mongoose.model<IStockAlert>('StockAlert', stockAlertSchema);
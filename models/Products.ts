// models/product.model.ts
/*import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// --------------------------
// Enums
// --------------------------
export enum PricingTier {
  RETAIL = 'retail',
  WHOLESALE = 'wholesale',
  SPECIAL = 'special'
}

export enum StockStatus {
  IN_STOCK = 'in-stock',
  LOW_STOCK = 'low-stock',
  OUT_OF_STOCK = 'out-of-stock'
}

export enum Urgency {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// --------------------------
// Subschemas Interfaces
// --------------------------
export interface SupplierRef {
  id: string;
  name: string;
  leadTime?: string;
  minimumOrder?: number;
}

export interface PricingTiers {
  retail: number;
  wholesale: number;
  special: number;
}

export interface PriceHistoryEntry {
  _id: string;
  oldPrice: number;
  newPrice: number;
  tier: PricingTier;
  changedBy: string;
  changedAt: Date;
  reason?: string;
}

export interface Review {
  _id?: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
}

export interface Download {
  name: string;
  url: string;
  type?: string;
}

export interface StockHistoryEntry {
  _id?: string;
  quantity: number;
  type: 'restock' | 'sale' | 'return' | 'damage' | 'adjustment';
  oldQuantity: number;
  newQuantity: number;
  supplier?: string;
  notes?: string;
  reference?: string;
  adjustedBy: string;
  timestamp: Date;
}

// --------------------------
// Product Interface
// --------------------------
export interface IProduct {
 
  id: string;
  sku: string;
  name: string;
  description: string;
  fullDescription?: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  photos: string[];
  price: number;
  retailPrice: number;
  wholesalePrice: number;
  pricing: PricingTiers;
  originalPrice?: number;
  unit?: string;
  minOrderQuantity?: number;
  costPrice: number;
  supplier?: string;
  suppliers: SupplierRef[];
  stock: number;
  stockQuantity: number;
  stockStatus: StockStatus;
  inStock: boolean;
  reorderPoint?: number;
  reorderLevel?: number;
  rating?: number;
  reviewCount?: number;
  reviews: Review[];
  specifications?: Record<string, any>;
  tags: string[];
  badge?: string;
  downloads: Download[];
  priceHistory: PriceHistoryEntry[];
  stockHistory?: StockHistoryEntry[];
  isFeatured?: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // New flags for product categorization
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSpecialOffer?: boolean;
  saleEndDate?: Date;
  saleStartDate?: Date;

  // Virtuals
  retailMargin?: number;
  wholesaleMargin?: number;
  specialMargin?: number;
  isLowStock?: boolean;
  averagePrice?: number;
  priceRange?: { min: number; max: number };
  discountPercentage?: number;
}

// --------------------------
// Subschemas
// --------------------------
const supplierRefSchema = new Schema<SupplierRef>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  leadTime: { type: String, default: '' },
  minimumOrder: { type: Number, default: 1 }
}, { _id: false });

const pricingTiersSchema = new Schema<PricingTiers>({
  retail: { type: Number, required: true, min: 0, default: 0 },
  wholesale: { type: Number, required: true, min: 0, default: 0 },
  special: { type: Number, required: true, min: 0, default: 0 }
}, { _id: false });

const priceHistoryEntrySchema = new Schema<PriceHistoryEntry>({
  _id: { type: String, required: true },
  oldPrice: { type: Number, required: true, min: 0 },
  newPrice: { type: Number, required: true, min: 0 },
  tier: { type: String, enum: Object.values(PricingTier), required: true },
  changedBy: { type: String, required: true },
  changedAt: { type: Date, required: true },
  reason: { type: String, default: '' }
}, { _id: false });

const reviewSchema = new Schema<Review>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const downloadSchema = new Schema<Download>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, default: 'pdf' }
}, { _id: false });

const stockHistoryEntrySchema = new Schema<StockHistoryEntry>({
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['restock', 'sale', 'return', 'damage', 'adjustment'], required: true },
  oldQuantity: { type: Number, required: true },
  newQuantity: { type: Number, required: true },
  supplier: { type: String },
  notes: { type: String },
  reference: { type: String },
  adjustedBy: { type: String, required: true, default: 'system' },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });


// --------------------------
// Product Schema
// --------------------------
const productSchema = new Schema<IProduct, Model<IProduct>>({
  id: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true, index: true },

  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  fullDescription: { type: String, default: '' },

  category: { type: String, required: true, index: true },
  categorySlug: { type: String, required: true },
  subcategory: { type: String, default: '' },
  brand: { type: String, default: '' },

  images: { type: [String], default: [] },
  photos: { type: [String], default: [] },

  price: { type: Number, required: true, min: 0 },
  retailPrice: { type: Number, required: true, min: 0 },
  wholesalePrice: { type: Number, required: true, min: 0 },

  pricing: { type: pricingTiersSchema, required: true },
  originalPrice: { type: Number, min: 0, default: 0 },

  unit: { type: String, default: 'piece' },
  minOrderQuantity: { type: Number, default: 1, min: 1 },
  costPrice: { type: Number, required: true, min: 0 },

  supplier: { type: String, default: null, index: true },
  suppliers: { type: [supplierRefSchema], default: [] },

  stock: { type: Number, required: true, min: 0, default: 0 },
  stockQuantity: { type: Number, required: true, min: 0, default: 0 },
  stockStatus: { type: String, enum: Object.values(StockStatus), default: StockStatus.IN_STOCK },
  inStock: { type: Boolean, default: true },

  reorderPoint: { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 0, min: 0 },

  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  reviews: { type: [reviewSchema], default: [] },

  specifications: { type: Schema.Types.Mixed, default: {} },
  tags: { type: [String], default: [] },
  badge: { type: String, default: '' },
  downloads: { type: [downloadSchema], default: [] },
  stockHistory: { type: [stockHistoryEntrySchema], default: [] },

  priceHistory: { type: [priceHistoryEntrySchema], default: [] },

  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isSpecialOffer: { type: Boolean, default: false },
  saleEndDate: { type: Date },
  saleStartDate: { type: Date },

  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, required: true, default: true, index: true },

}, {
  collection: 'products',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --------------------------
// Middleware
// --------------------------
productSchema.pre('save', function(next) {
  const doc = this as any;
  
  doc.updatedAt = new Date();
  doc.id = doc._id.toString();
  doc.stock = doc.stockQuantity;
  doc.retailPrice = doc.pricing.retail;
  doc.wholesalePrice = doc.pricing.wholesale;
  doc.price = doc.pricing.retail;

  const reorderThreshold = (doc.reorderLevel ?? 0) > 0 ? doc.reorderLevel : (doc.reorderPoint ?? 0);

  if (doc.stockQuantity === 0) {
    doc.stockStatus = StockStatus.OUT_OF_STOCK;
    doc.inStock = false;
  } else if (doc.stockQuantity <= reorderThreshold) {
    doc.stockStatus = StockStatus.LOW_STOCK;
    doc.inStock = true;
  } else {
    doc.stockStatus = StockStatus.IN_STOCK;
    doc.inStock = true;
  }
});

// --------------------------
// Virtuals
// --------------------------
productSchema.virtual('retailMargin').get(function() {
  const doc = this as any;
  return doc.costPrice === 0 ? 0 : ((doc.pricing.retail - doc.costPrice) / doc.costPrice) * 100;
});

productSchema.virtual('wholesaleMargin').get(function() {
  const doc = this as any;
  return doc.costPrice === 0 ? 0 : ((doc.pricing.wholesale - doc.costPrice) / doc.costPrice) * 100;
});

productSchema.virtual('specialMargin').get(function() {
  const doc = this as any;
  return doc.costPrice === 0 ? 0 : ((doc.pricing.special - doc.costPrice) / doc.costPrice) * 100;
});

productSchema.virtual('isLowStock').get(function() {
  const doc = this as any;
  const threshold = (doc.reorderLevel ?? 0) > 0 ? doc.reorderLevel : (doc.reorderPoint ?? 0);
  return doc.stockQuantity <= threshold;
});

productSchema.virtual('averagePrice').get(function() {
  const doc = this as any;
  const sum = doc.pricing.retail + doc.pricing.wholesale + doc.pricing.special;
  return sum / 3;
});

productSchema.virtual('priceRange').get(function() {
  const doc = this as any;
  const prices = [doc.pricing.retail, doc.pricing.wholesale, doc.pricing.special];
  return { min: Math.min(...prices), max: Math.max(...prices) };
});

productSchema.virtual('discountPercentage').get(function() {
  const doc = this as any;
  if (doc.originalPrice && doc.originalPrice > doc.pricing.retail) {
    return ((doc.originalPrice - doc.pricing.retail) / doc.originalPrice) * 100;
  }
  return 0;
});

// types/product.types.ts - Add these if not present

export const generateCategorySlug = (category: string): string => {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const determineStockStatus = (
  stockQuantity: number, 
  reorderLevel: number
): { status: 'in-stock' | 'low-stock' | 'out-of-stock'; inStock: boolean } => {
  if (stockQuantity === 0) {
    return { status: 'out-of-stock', inStock: false };
  } else if (stockQuantity <= reorderLevel) {
    return { status: 'low-stock', inStock: true };
  } else {
    return { status: 'in-stock', inStock: true };
  }
};

export const determineUrgency = (
  stockQuantity: number, 
  reorderLevel: number
): 'critical' | 'high' | 'medium' | 'low' => {
  if (stockQuantity === 0) return 'critical';
  if (stockQuantity <= reorderLevel * 0.5) return 'high';
  if (stockQuantity <= reorderLevel) return 'medium';
  return 'low';
};
// --------------------------
// Export Model
// --------------------------
export const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);*/


// models/product.model.ts
import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// --------------------------
// Enums
// --------------------------
export enum PricingTier {
  RETAIL = 'retail',
  WHOLESALE = 'wholesale',
  SPECIAL = 'special'
}

export enum StockStatus {
  IN_STOCK = 'in-stock',
  LOW_STOCK = 'low-stock',
  OUT_OF_STOCK = 'out-of-stock'
}

export enum Urgency {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// --------------------------
// Subschemas Interfaces
// --------------------------
export interface SupplierRef {
  id: string;
  name: string;
  leadTime?: string;
  minimumOrder?: number;
}

export interface PricingTiers {
  retail: number;
  wholesale: number;
  special: number;
}

export interface PriceHistoryEntry {
  _id: string;
  oldPrice: number;
  newPrice: number;
  tier: PricingTier;
  changedBy: string;
  changedAt: Date;
  reason?: string;
}

export interface Review {
  _id?: Types.ObjectId;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
}

export interface Download {
  name: string;
  url: string;
  type?: string;
}

export interface StockHistoryEntry {
  _id?: Types.ObjectId;
  quantity: number;
  type: 'restock' | 'sale' | 'return' | 'damage' | 'adjustment';
  oldQuantity: number;
  newQuantity: number;
  supplier?: string;
  notes?: string;
  reference?: string;
  adjustedBy: string;
  timestamp: Date;
}

// --------------------------
// Product Interface
// --------------------------
export interface IProduct extends Document {
  id: string;
  sku: string;
  name: string;
  description: string;
  fullDescription?: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  photos: string[];
  price: number;
  retailPrice: number;
  wholesalePrice: number;
  pricing: PricingTiers;
  originalPrice?: number;
  unit?: string;
  minOrderQuantity?: number;
  costPrice: number;
  supplier?: string;
  suppliers: SupplierRef[];
  stock: number;
  stockQuantity: number;
  stockStatus: StockStatus;
  inStock: boolean;
  reorderPoint?: number;
  reorderLevel?: number;
  rating?: number;
  reviewCount?: number;
  reviews: Review[];
  specifications?: Record<string, any>;
  tags: string[];
  badge?: string;
  downloads: Download[];
  priceHistory: PriceHistoryEntry[];
  stockHistory?: StockHistoryEntry[];
  isFeatured?: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // New flags for product categorization
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSpecialOffer?: boolean;
  saleEndDate?: Date;
  saleStartDate?: Date;

  // Virtuals
  retailMargin?: number;
  wholesaleMargin?: number;
  specialMargin?: number;
  isLowStock?: boolean;
  averagePrice?: number;
  priceRange?: { min: number; max: number };
  discountPercentage?: number;

  // Methods
  getPriceForTier(tier: PricingTier | string): number;
  reserveStock(quantity: number): Promise<boolean>;
  releaseStock(quantity: number): Promise<boolean>;
}

// --------------------------
// Subschemas
// --------------------------
const supplierRefSchema = new Schema<SupplierRef>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  leadTime: { type: String, default: '' },
  minimumOrder: { type: Number, default: 1 }
}, { _id: false });

const pricingTiersSchema = new Schema<PricingTiers>({
  retail: { type: Number, required: true, min: 0, default: 0 },
  wholesale: { type: Number, required: true, min: 0, default: 0 },
  special: { type: Number, required: true, min: 0, default: 0 }
}, { _id: false });

const priceHistoryEntrySchema = new Schema<PriceHistoryEntry>({
  _id: { type: String, required: true },
  oldPrice: { type: Number, required: true, min: 0 },
  newPrice: { type: Number, required: true, min: 0 },
  tier: { type: String, enum: Object.values(PricingTier), required: true },
  changedBy: { type: String, required: true },
  changedAt: { type: Date, required: true },
  reason: { type: String, default: '' }
}, { _id: false });

const reviewSchema = new Schema<Review>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const downloadSchema = new Schema<Download>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, default: 'pdf' }
}, { _id: false });

const stockHistoryEntrySchema = new Schema<StockHistoryEntry>({
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['restock', 'sale', 'return', 'damage', 'adjustment'], required: true },
  oldQuantity: { type: Number, required: true },
  newQuantity: { type: Number, required: true },
  supplier: { type: String },
  notes: { type: String },
  reference: { type: String },
  adjustedBy: { type: String, required: true, default: 'system' },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

// --------------------------
// Product Schema
// --------------------------
const productSchema = new Schema<IProduct>({
  id: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true, index: true },

  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  fullDescription: { type: String, default: '' },

  category: { type: String, required: true, index: true },
  categorySlug: { type: String, required: true },
  subcategory: { type: String, default: '' },
  brand: { type: String, default: '' },

  images: { type: [String], default: [] },
  photos: { type: [String], default: [] },

  price: { type: Number, required: true, min: 0 },
  retailPrice: { type: Number, required: true, min: 0 },
  wholesalePrice: { type: Number, required: true, min: 0 },

  pricing: { type: pricingTiersSchema, required: true },
  originalPrice: { type: Number, min: 0, default: 0 },

  unit: { type: String, default: 'piece' },
  minOrderQuantity: { type: Number, default: 1, min: 1 },
  costPrice: { type: Number, required: true, min: 0 },

  supplier: { type: String, default: null, index: true },
  suppliers: { type: [supplierRefSchema], default: [] },

  stock: { type: Number, required: true, min: 0, default: 0 },
  stockQuantity: { type: Number, required: true, min: 0, default: 0 },
  stockStatus: { type: String, enum: Object.values(StockStatus), default: StockStatus.IN_STOCK },
  inStock: { type: Boolean, default: true },

  reorderPoint: { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 0, min: 0 },

  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  reviews: { type: [reviewSchema], default: [] },

  specifications: { type: Schema.Types.Mixed, default: {} },
  tags: { type: [String], default: [] },
  badge: { type: String, default: '' },
  downloads: { type: [downloadSchema], default: [] },
  stockHistory: { type: [stockHistoryEntrySchema], default: [] },

  priceHistory: { type: [priceHistoryEntrySchema], default: [] },

  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isSpecialOffer: { type: Boolean, default: false },
  saleEndDate: { type: Date },
  saleStartDate: { type: Date },

  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, required: true, default: true, index: true },

}, {
  collection: 'products',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --------------------------
// Methods
// --------------------------

/**
 * Get price for specific pricing tier
 */
productSchema.methods.getPriceForTier = function(tier: PricingTier | string): number {
  const pricingMap = {
    [PricingTier.RETAIL]: this.pricing.retail,
    [PricingTier.WHOLESALE]: this.pricing.wholesale,
    [PricingTier.SPECIAL]: this.pricing.special
  };
  
  const tierKey = typeof tier === 'string' ? tier : tier;
  return pricingMap[tierKey as keyof typeof pricingMap] || this.pricing.retail;
};

/**
 * Reserve stock from available quantity
 */
productSchema.methods.reserveStock = async function(quantity: number): Promise<boolean> {
  if (this.stockQuantity >= quantity) {
    this.stockQuantity -= quantity;
    this.stock = this.stockQuantity;
    
    // Update stock status based on new quantity
    const reorderThreshold = (this.reorderLevel ?? 0) > 0 ? this.reorderLevel : (this.reorderPoint ?? 0);
    
    if (this.stockQuantity === 0) {
      this.stockStatus = StockStatus.OUT_OF_STOCK;
      this.inStock = false;
    } else if (this.stockQuantity <= reorderThreshold) {
      this.stockStatus = StockStatus.LOW_STOCK;
      this.inStock = true;
    } else {
      this.stockStatus = StockStatus.IN_STOCK;
      this.inStock = true;
    }
    
    // Add to stock history
    if (!this.stockHistory) this.stockHistory = [];
    this.stockHistory.push({
      quantity: -quantity,
      type: 'sale',
      oldQuantity: this.stockQuantity + quantity,
      newQuantity: this.stockQuantity,
      adjustedBy: 'system',
      timestamp: new Date()
    });
    
    await this.save();
    return true;
  }
  return false;
};

/**
 * Release reserved stock back to inventory
 */
productSchema.methods.releaseStock = async function(quantity: number): Promise<boolean> {
  this.stockQuantity += quantity;
  this.stock = this.stockQuantity;
  
  // Update stock status
  const reorderThreshold = (this.reorderLevel ?? 0) > 0 ? this.reorderLevel : (this.reorderPoint ?? 0);
  
  if (this.stockQuantity === 0) {
    this.stockStatus = StockStatus.OUT_OF_STOCK;
    this.inStock = false;
  } else if (this.stockQuantity <= reorderThreshold) {
    this.stockStatus = StockStatus.LOW_STOCK;
    this.inStock = true;
  } else {
    this.stockStatus = StockStatus.IN_STOCK;
    this.inStock = true;
  }
  
  // Add to stock history
  if (!this.stockHistory) this.stockHistory = [];
  this.stockHistory.push({
    quantity: quantity,
    type: 'return',
    oldQuantity: this.stockQuantity - quantity,
    newQuantity: this.stockQuantity,
    adjustedBy: 'system',
    timestamp: new Date()
  });
  
  await this.save();
  return true;
};

// --------------------------
// Middleware
// --------------------------
productSchema.pre('save', function(next) {
  const doc = this as any;
  
  doc.updatedAt = new Date();
  doc.id = doc._id.toString();
  doc.stock = doc.stockQuantity;
  doc.retailPrice = doc.pricing.retail;
  doc.wholesalePrice = doc.pricing.wholesale;
  doc.price = doc.pricing.retail;

  const reorderThreshold = (doc.reorderLevel ?? 0) > 0 ? doc.reorderLevel : (doc.reorderPoint ?? 0);

  if (doc.stockQuantity === 0) {
    doc.stockStatus = StockStatus.OUT_OF_STOCK;
    doc.inStock = false;
  } else if (doc.stockQuantity <= reorderThreshold) {
    doc.stockStatus = StockStatus.LOW_STOCK;
    doc.inStock = true;
  } else {
    doc.stockStatus = StockStatus.IN_STOCK;
    doc.inStock = true;
  }
  
});

// --------------------------
// Virtuals
// --------------------------
productSchema.virtual('retailMargin').get(function() {
  const doc = this as any;
  return doc.costPrice === 0 ? 0 : ((doc.pricing.retail - doc.costPrice) / doc.costPrice) * 100;
});

productSchema.virtual('wholesaleMargin').get(function() {
  const doc = this as any;
  return doc.costPrice === 0 ? 0 : ((doc.pricing.wholesale - doc.costPrice) / doc.costPrice) * 100;
});

productSchema.virtual('specialMargin').get(function() {
  const doc = this as any;
  return doc.costPrice === 0 ? 0 : ((doc.pricing.special - doc.costPrice) / doc.costPrice) * 100;
});

productSchema.virtual('isLowStock').get(function() {
  const doc = this as any;
  const threshold = (doc.reorderLevel ?? 0) > 0 ? doc.reorderLevel : (doc.reorderPoint ?? 0);
  return doc.stockQuantity <= threshold;
});

productSchema.virtual('averagePrice').get(function() {
  const doc = this as any;
  const sum = doc.pricing.retail + doc.pricing.wholesale + doc.pricing.special;
  return sum / 3;
});

productSchema.virtual('priceRange').get(function() {
  const doc = this as any;
  const prices = [doc.pricing.retail, doc.pricing.wholesale, doc.pricing.special];
  return { min: Math.min(...prices), max: Math.max(...prices) };
});

productSchema.virtual('discountPercentage').get(function() {
  const doc = this as any;
  if (doc.originalPrice && doc.originalPrice > doc.pricing.retail) {
    return ((doc.originalPrice - doc.pricing.retail) / doc.originalPrice) * 100;
  }
  return 0;
});

// --------------------------
// Helper Functions
// --------------------------
export const generateCategorySlug = (category: string): string => {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const determineStockStatus = (
  stockQuantity: number, 
  reorderLevel: number
): { status: 'in-stock' | 'low-stock' | 'out-of-stock'; inStock: boolean } => {
  if (stockQuantity === 0) {
    return { status: 'out-of-stock', inStock: false };
  } else if (stockQuantity <= reorderLevel) {
    return { status: 'low-stock', inStock: true };
  } else {
    return { status: 'in-stock', inStock: true };
  }
};

export const determineUrgency = (
  stockQuantity: number, 
  reorderLevel: number
): 'critical' | 'high' | 'medium' | 'low' => {
  if (stockQuantity === 0) return 'critical';
  if (stockQuantity <= reorderLevel * 0.5) return 'high';
  if (stockQuantity <= reorderLevel) return 'medium';
  return 'low';
};

// --------------------------
// Export Model
// --------------------------
export const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);
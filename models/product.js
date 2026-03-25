// models/product.model.js
/*import mongoose from 'mongoose';

// Pricing Tiers schema
const pricingTiersSchema = new mongoose.Schema({
    retail: { type: Number, required: true, min: 0, default: 0 },
    wholesale: { type: Number, required: true, min: 0, default: 0 },
    special: { type: Number, required: true, min: 0, default: 0 }
}, { _id: false });

// Price History Entry schema
const priceHistoryEntrySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    oldPrice: { type: Number, required: true, min: 0 },
    newPrice: { type: Number, required: true, min: 0 },
    tier: { 
        type: String, 
        enum: ['retail', 'wholesale', 'special'],
        required: true 
    },
    changedBy: { type: String, required: true },
    changedAt: { type: Date, required: true },
    reason: { type: String, default: '' }
}, { _id: false });

// MAIN PRODUCT SCHEMA
const productSchema = new mongoose.Schema({
    // --- Identity ---
    _id: { type: String, required: true },
    sku: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    photos: { type: [String], default: [] },
    
    // --- Pricing Tiers ---
    pricing: { type: pricingTiersSchema, required: true },
    
    // --- Cost Tracking ---
    costPrice: { type: Number, required: true, min: 0 },
    supplier: { type: String, default: null, index: true },
    
    // --- Stock Management ---
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    reorderLevel: { type: Number, required: true, min: 0, default: 10 },
    
    // --- Audit & History ---
    priceHistory: { type: [priceHistoryEntrySchema], default: [] },
    
    // --- Status ---
    isActive: { type: Boolean, required: true, default: true, index: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
}, { 
    collection: 'products',
    _id: false,
    timestamps: true 
});

// Indexes for common queries
productSchema.index({ stockQuantity: 1, reorderLevel: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ 'pricing.retail': 1 });
productSchema.index({ supplier: 1, isActive: 1 });

// Pre-save middleware to update timestamps
productSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Virtual for profit margin calculations
productSchema.virtual('retailMargin').get(function() {
    if (this.costPrice === 0) return 0;
    return ((this.pricing.retail - this.costPrice) / this.costPrice) * 100;
});

productSchema.virtual('wholesaleMargin').get(function() {
    if (this.costPrice === 0) return 0;
    return ((this.pricing.wholesale - this.costPrice) / this.costPrice) * 100;
});

productSchema.virtual('specialMargin').get(function() {
    if (this.costPrice === 0) return 0;
    return ((this.pricing.special - this.costPrice) / this.costPrice) * 100;
});

productSchema.virtual('isLowStock').get(function() {
    return this.stockQuantity <= this.reorderLevel;
});

productSchema.virtual('stockStatus').get(function() {
    if (this.stockQuantity === 0) return 'out-of-stock';
    if (this.stockQuantity <= this.reorderLevel) return 'low-stock';
    return 'in-stock';
});

productSchema.virtual('averagePrice').get(function() {
    const sum = this.pricing.retail + this.pricing.wholesale + this.pricing.special;
    return sum / 3;
});

productSchema.virtual('priceRange').get(function() {
    const prices = [this.pricing.retail, this.pricing.wholesale, this.pricing.special];
    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };
});

// SUPPLIER SCHEMA
const supplierSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, index: true },
    contactPerson: { type: String, default: '' },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    products: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    collection: 'suppliers',
    _id: false,
    timestamps: true 
});

// Pre-save middleware for suppliers
supplierSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Category Summary Schema (for dashboard)
const categorySummarySchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    categories: [{
        category: { type: String, required: true },
        count: { type: Number, default: 0 },
        totalStock: { type: Number, default: 0 },
        totalValue: { type: Number, default: 0 },
        averageMargin: { type: Number, default: 0 }
    }],
    totalProducts: { type: Number, default: 0 },
    activeProducts: { type: Number, default: 0 },
    lowStockItems: { type: Number, default: 0 },
    outOfStockItems: { type: Number, default: 0 },
    totalInventoryValue: { type: Number, default: 0 },
    averageMargin: { type: Number, default: 0 }
}, { 
    collection: 'category_summaries',
    timestamps: true 
});

// Stock Alert Schema (for real-time monitoring)
const stockAlertSchema = new mongoose.Schema({
    productId: { type: String, required: true, ref: 'Product' },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    currentStock: { type: Number, required: true, min: 0 },
    reorderLevel: { type: Number, required: true, min: 0 },
    status: { 
        type: String, 
        enum: ['out-of-stock', 'low-stock', 'in-stock'],
        required: true 
    },
    urgency: { 
        type: String, 
        enum: ['critical', 'high', 'medium', 'low'],
        required: true 
    },
    createdAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date, default: null },
    resolved: { type: Boolean, default: false }
}, { 
    collection: 'stock_alerts',
    indexes: [
        { status: 1, urgency: 1 },
        { resolved: 1, createdAt: -1 }
    ]
});

// Recent Price Changes Schema
const recentPriceChangeSchema = new mongoose.Schema({
    productId: { type: String, required: true, ref: 'Product' },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    tier: { type: String, enum: ['retail', 'wholesale', 'special'], required: true },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    changedBy: { type: String, required: true },
    changedAt: { type: Date, required: true },
    reason: { type: String, default: '' },
    percentageChange: { type: Number, required: true }
}, { 
    collection: 'recent_price_changes',
    indexes: [
        { changedAt: -1 },
        { productId: 1, changedAt: -1 }
    ]
});

// Create and export models
export const Product = mongoose.model('Product', productSchema);
export const Supplier = mongoose.model('Supplier', supplierSchema);
export const CategorySummary = mongoose.model('CategorySummary', categorySummarySchema);
export const StockAlert = mongoose.model('StockAlert', stockAlertSchema);
export const RecentPriceChange = mongoose.model('RecentPriceChange', recentPriceChangeSchema);

// Export enums/tiers for use in other files
export const PricingTiers = {
    RETAIL: 'retail',
    WHOLESALE: 'wholesale',
    SPECIAL: 'special'
};*/

// models/product.js
import mongoose from 'mongoose';

// Supplier reference schema (for embedded suppliers)
const supplierRefSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    leadTime: { type: String, default: '' },
    minimumOrder: { type: Number, default: 1 }
}, { _id: false });

// Pricing Tiers schema
const pricingTiersSchema = new mongoose.Schema({
    retail: { type: Number, required: true, min: 0, default: 0 },
    wholesale: { type: Number, required: true, min: 0, default: 0 },
    special: { type: Number, required: true, min: 0, default: 0 }
}, { _id: false });

// Price History Entry schema
const priceHistoryEntrySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    oldPrice: { type: Number, required: true, min: 0 },
    newPrice: { type: Number, required: true, min: 0 },
    tier: { 
        type: String, 
        enum: ['retail', 'wholesale', 'special'],
        required: true 
    },
    changedBy: { type: String, required: true },
    changedAt: { type: Date, required: true },
    reason: { type: String, default: '' }
}, { _id: false });

// Review schema
const reviewSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
}, { _id: true });

// Download schema
const downloadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, default: 'pdf' } // pdf, manual, specsheet, etc.
}, { _id: false });

// MAIN PRODUCT SCHEMA
const productSchema = new mongoose.Schema({
    // --- Identity ---
    id: { type: String, required: true, unique: true },
    _id: { type: String, required: true },
    sku: { type: String, required: true, unique: true, index: true },
    
    // --- Basic Info ---
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    fullDescription: { type: String, default: '' },
    
    // --- Categorization ---
    category: { type: String, required: true, index: true },
    categorySlug: { type: String, required: true },
    subcategory: { type: String, default: '' },
    brand: { type: String, default: '' },
    
    // --- Media ---
    images: { type: [String], default: [] },
    photos: { type: [String], default: [] }, // Kept for backward compatibility
    
    // --- Pricing (multiple formats for compatibility) ---
    price: { type: Number, required: true, min: 0 },
    retailPrice: { type: Number, required: true, min: 0 },
    wholesalePrice: { type: Number, required: true, min: 0 },
    
    // --- Pricing Tiers ---
    pricing: { type: pricingTiersSchema, required: true },
    
    // --- Original Price (for discounts) ---
    originalPrice: { type: Number, min: 0, default: 0 },
    
    // --- Units & Ordering ---
    unit: { type: String, default: 'piece' },
    minOrderQuantity: { type: Number, default: 1, min: 1 },
    
    // --- Cost Tracking ---
    costPrice: { type: Number, required: true, min: 0 },
    
    // --- Supplier Information ---
    supplier: { type: String, default: null, index: true },
    suppliers: { type: [supplierRefSchema], default: [] },
    
    // --- Stock Management (multiple formats) ---
    stock: { type: Number, required: true, min: 0, default: 0 },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    
    // --- Stock Status ---
    stockStatus: { 
        type: String, 
        enum: ['in-stock', 'low-stock', 'out-of-stock'],
        default: 'in-stock'
    },
    inStock: { type: Boolean, default: true },
    
    // --- Reorder Levels ---
    reorderPoint: { type: Number, default: 0, min: 0 },
    reorderLevel: { type: Number, default: 0, min: 0 },
    
    // --- Reviews & Ratings ---
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    reviews: { type: [reviewSchema], default: [] },
    
    // --- Specifications ---
    specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
    
    // --- Tags & Badges ---
    tags: { type: [String], default: [] },
    badge: { type: String, default: '' }, // 'new', 'featured', 'sale', etc.
    
    // --- Downloads ---
    downloads: { type: [downloadSchema], default: [] },
    
    // --- Audit & History ---
    priceHistory: { type: [priceHistoryEntrySchema], default: [] },
    
    // --- Status & Flags ---
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, required: true, default: true, index: true },
    
    // --- Timestamps ---
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
}, { 
    collection: 'products',
    _id: false,
    timestamps: true 
});

// Indexes for common queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ 'pricing.retail': 1 });
productSchema.index({ supplier: 1, isActive: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ stock: 1, reorderPoint: 1 });

// Pre-save middleware to update timestamps and sync fields
productSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    
    // Sync duplicate fields
    this.id = this._id;
    this.stock = this.stockQuantity;
    this.retailPrice = this.pricing.retail;
    this.wholesalePrice = this.pricing.wholesale;
    this.price = this.pricing.retail;
    
    // Update stock status
    if (this.stockQuantity === 0) {
        this.stockStatus = 'out-of-stock';
        this.inStock = false;
    } else if (this.stockQuantity <= (this.reorderLevel || this.reorderPoint)) {
        this.stockStatus = 'low-stock';
        this.inStock = true;
    } else {
        this.stockStatus = 'in-stock';
        this.inStock = true;
    }
    
    next();
});

// Virtual for profit margin calculations
productSchema.virtual('retailMargin').get(function() {
    if (this.costPrice === 0) return 0;
    return ((this.pricing.retail - this.costPrice) / this.costPrice) * 100;
});

productSchema.virtual('wholesaleMargin').get(function() {
    if (this.costPrice === 0) return 0;
    return ((this.pricing.wholesale - this.costPrice) / this.costPrice) * 100;
});

productSchema.virtual('specialMargin').get(function() {
    if (this.costPrice === 0) return 0;
    return ((this.pricing.special - this.costPrice) / this.costPrice) * 100;
});

productSchema.virtual('isLowStock').get(function() {
    return this.stockQuantity <= (this.reorderLevel || this.reorderPoint);
});

productSchema.virtual('averagePrice').get(function() {
    const sum = this.pricing.retail + this.pricing.wholesale + this.pricing.special;
    return sum / 3;
});

productSchema.virtual('priceRange').get(function() {
    const prices = [this.pricing.retail, this.pricing.wholesale, this.pricing.special];
    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };
});

productSchema.virtual('discountPercentage').get(function() {
    if (this.originalPrice > 0 && this.originalPrice > this.pricing.retail) {
        return ((this.originalPrice - this.pricing.retail) / this.originalPrice) * 100;
    }
    return 0;
});

// SUPPLIER SCHEMA (updated to match new structure)
const supplierSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    id: { type: String, required: true },
    name: { type: String, required: true, index: true },
    contactPerson: { type: String, default: '' },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    products: { type: [String], default: [] },
    leadTime: { type: String, default: '' },
    minimumOrder: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    collection: 'suppliers',
    _id: false,
    timestamps: true 
});

// Pre-save middleware for suppliers
supplierSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    this.id = this._id;
    next();
});

// Category Summary Schema (updated)
const categorySummarySchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    categories: [{
        category: { type: String, required: true },
        categorySlug: { type: String, required: true },
        count: { type: Number, default: 0 },
        totalStock: { type: Number, default: 0 },
        totalValue: { type: Number, default: 0 },
        averageMargin: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 }
    }],
    totalProducts: { type: Number, default: 0 },
    activeProducts: { type: Number, default: 0 },
    featuredProducts: { type: Number, default: 0 },
    lowStockItems: { type: Number, default: 0 },
    outOfStockItems: { type: Number, default: 0 },
    totalInventoryValue: { type: Number, default: 0 },
    averageMargin: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 }
}, { 
    collection: 'category_summaries',
    timestamps: true 
});

// Stock Alert Schema (updated)
const stockAlertSchema = new mongoose.Schema({
    productId: { type: String, required: true, ref: 'Product' },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    currentStock: { type: Number, required: true, min: 0 },
    reorderPoint: { type: Number, required: true, min: 0 },
    status: { 
        type: String, 
        enum: ['out-of-stock', 'low-stock', 'in-stock'],
        required: true 
    },
    urgency: { 
        type: String, 
        enum: ['critical', 'high', 'medium', 'low'],
        required: true 
    },
    createdAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date, default: null },
    resolved: { type: Boolean, default: false }
}, { 
    collection: 'stock_alerts',
    indexes: [
        { status: 1, urgency: 1 },
        { resolved: 1, createdAt: -1 }
    ]
});

// Recent Price Changes Schema (updated)
const recentPriceChangeSchema = new mongoose.Schema({
    productId: { type: String, required: true, ref: 'Product' },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    tier: { type: String, enum: ['retail', 'wholesale', 'special'], required: true },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    changedBy: { type: String, required: true },
    changedAt: { type: Date, required: true },
    reason: { type: String, default: '' },
    percentageChange: { type: Number, required: true }
}, { 
    collection: 'recent_price_changes',
    indexes: [
        { changedAt: -1 },
        { productId: 1, changedAt: -1 }
    ]
});

// Create and export models
export const Product = mongoose.model('Product', productSchema);
export const Supplier = mongoose.model('Supplier', supplierSchema);
export const CategorySummary = mongoose.model('CategorySummary', categorySummarySchema);
export const StockAlert = mongoose.model('StockAlert', stockAlertSchema);
export const RecentPriceChange = mongoose.model('RecentPriceChange', recentPriceChangeSchema);

// Export enums/tiers for use in other files
export const PricingTiers = {
    RETAIL: 'retail',
    WHOLESALE: 'wholesale',
    SPECIAL: 'special'
};

export const StockStatus = {
    IN_STOCK: 'in-stock',
    LOW_STOCK: 'low-stock',
    OUT_OF_STOCK: 'out-of-stock'
};
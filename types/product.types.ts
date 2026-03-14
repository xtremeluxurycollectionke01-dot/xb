// types/product.types.ts

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

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

export enum BadgeType {
    NEW = 'new',
    FEATURED = 'featured',
    SALE = 'sale',
    BESTSELLER = 'bestseller',
    LIMITED = 'limited',
    PREMIUM = 'premium'
}

export enum DownloadType {
    PDF = 'pdf',
    MANUAL = 'manual',
    SPECSHEET = 'specsheet',
    CATALOG = 'catalog',
    DRIVER = 'driver',
    SOFTWARE = 'software',
    OTHER = 'other'
}

export enum UrgencyLevel {
    CRITICAL = 'critical',
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low'
}

// ============================================================================
// INTERFACES - Embedded Documents
// ============================================================================

export interface ISupplierReference {
    id: string;
    name: string;
    leadTime?: string;
    minimumOrder: number;
}

export interface IPricingTiers {
    retail: number;
    wholesale: number;
    special: number;
}

export interface IPriceHistoryEntry {
    _id: string;
    oldPrice: number;
    newPrice: number;
    tier: PricingTier;
    changedBy: string;
    changedAt: Date;
    reason?: string;
}

export interface IReview {
    _id?: string;
    userId: string;
    userName: string;
    rating: number;
    comment?: string;
    createdAt: Date;
}

export interface IDownload {
    name: string;
    url: string;
    type: DownloadType | string;
}

export interface IPriceRange {
    min: number;
    max: number;
}

// ============================================================================
// MAIN PRODUCT INTERFACE
// ============================================================================

export interface IProduct {
    // Identity
    id: string;
    _id: string;
    sku: string;
    
    // Basic Info
    name: string;
    description: string;
    fullDescription?: string;
    
    // Categorization
    category: string;
    categorySlug: string;
    subcategory?: string;
    brand?: string;
    
    // Media
    images: string[];
    photos: string[];
    
    // Pricing (multiple formats)
    price: number;
    retailPrice: number;
    wholesalePrice: number;
    pricing: IPricingTiers;
    originalPrice?: number;
    
    // Units & Ordering
    unit: string;
    minOrderQuantity: number;
    
    // Cost Tracking
    costPrice: number;
    
    // Supplier Information
    supplier?: string | null;
    suppliers: ISupplierReference[];
    
    // Stock Management
    stock: number;
    stockQuantity: number;
    stockStatus: StockStatus;
    inStock: boolean;
    reorderPoint: number;
    reorderLevel: number;
    
    // Reviews & Ratings
    rating: number;
    reviewCount: number;
    reviews: IReview[];
    
    // Specifications (flexible key-value pairs)
    specifications: Record<string, any>;
    
    // Tags & Badges
    tags: string[];
    badge?: BadgeType | string;
    
    // Downloads
    downloads: IDownload[];
    
    // Audit & History
    priceHistory: IPriceHistoryEntry[];
    
    // Status & Flags
    isFeatured: boolean;
    isActive: boolean;
    
    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================

// Create Product DTO - for creating new products
export interface CreateProductDTO {
    id?: string; // Optional, will be generated if not provided
    sku: string;
    name: string;
    description: string;
    fullDescription?: string;
    category: string;
    categorySlug?: string; // Will be generated if not provided
    subcategory?: string;
    brand?: string;
    images?: string[];
    photos?: string[];
    
    // Pricing
    pricing: IPricingTiers;
    originalPrice?: number;
    
    // Units
    unit?: string;
    minOrderQuantity?: number;
    
    // Cost
    costPrice: number;
    
    // Suppliers
    supplier?: string;
    suppliers?: ISupplierReference[];
    
    // Stock
    stockQuantity: number;
    reorderPoint?: number;
    reorderLevel?: number;
    
    // Specifications
    specifications?: Record<string, any>;
    
    // Tags & Badges
    tags?: string[];
    badge?: BadgeType | string;
    
    // Downloads
    downloads?: IDownload[];
    
    // Status
    isFeatured?: boolean;
    isActive?: boolean;
}

// Update Product DTO - all fields optional
export interface UpdateProductDTO extends Partial<Omit<CreateProductDTO, 'id' | 'sku'>> {
    // Can include additional update-specific fields
    priceHistory?: IPriceHistoryEntry[];
}

// Product Response DTO - what we send to clients
export interface ProductResponseDTO extends Omit<IProduct, 'costPrice' | 'priceHistory'> {
    // Computed fields
    retailMargin?: number;
    wholesaleMargin?: number;
    specialMargin?: number;
    isLowStock: boolean;
    averagePrice: number;
    priceRange: IPriceRange;
    discountPercentage?: number;
}

// Product List Item DTO - for list views
export interface ProductListItemDTO {
    id: string;
    sku: string;
    name: string;
    category: string;
    categorySlug: string;
    price: number;
    originalPrice?: number;
    stockStatus: StockStatus;
    stockQuantity: number;
    rating: number;
    reviewCount: number;
    badge?: string;
    isFeatured: boolean;
    isActive: boolean;
    mainImage?: string;
    discountPercentage?: number;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// QUERY PARAMS & FILTERS
// ============================================================================

export interface ProductQueryParams {
    // Pagination
    page?: number;
    limit?: number;
    sortBy?: keyof IProduct | 'retailMargin' | 'discountPercentage';
    sortOrder?: 'asc' | 'desc';
    
    // Filters
    category?: string | string[];
    subcategory?: string | string[];
    brand?: string | string[];
    supplier?: string | string[];
    
    // Price range
    minPrice?: number;
    maxPrice?: number;
    
    // Stock status
    stockStatus?: StockStatus | StockStatus[];
    inStock?: boolean;
    isLowStock?: boolean;
    
    // Status
    isActive?: boolean;
    isFeatured?: boolean;
    
    // Ratings
    minRating?: number;
    
    // Tags
    tags?: string | string[];
    
    // Search
    search?: string; // Search in name, description, sku
    
    // Date range
    createdAfter?: Date;
    createdBefore?: Date;
    updatedAfter?: Date;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// ============================================================================
// STOCK ALERT INTERFACES
// ============================================================================

export interface IStockAlert {
    productId: string;
    sku: string;
    name: string;
    category: string;
    currentStock: number;
    reorderPoint: number;
    status: StockStatus;
    urgency: UrgencyLevel;
    createdAt: Date;
    resolvedAt?: Date | null;
    resolved: boolean;
}

export interface StockAlertQueryParams {
    resolved?: boolean;
    status?: StockStatus | StockStatus[];
    urgency?: UrgencyLevel | UrgencyLevel[];
    category?: string;
    limit?: number;
}

// ============================================================================
// PRICE CHANGE INTERFACES
// ============================================================================

export interface IRecentPriceChange {
    productId: string;
    productName: string;
    sku: string;
    tier: PricingTier;
    oldPrice: number;
    newPrice: number;
    changedBy: string;
    changedAt: Date;
    reason?: string;
    percentageChange: number;
}

// ============================================================================
// CATEGORY SUMMARY INTERFACES
// ============================================================================

export interface ICategorySummary {
    date: Date;
    categories: ICategoryStat[];
    totalProducts: number;
    activeProducts: number;
    featuredProducts: number;
    lowStockItems: number;
    outOfStockItems: number;
    totalInventoryValue: number;
    averageMargin: number;
    averageRating: number;
}

export interface ICategoryStat {
    category: string;
    categorySlug: string;
    count: number;
    totalStock: number;
    totalValue: number;
    averageMargin: number;
    averageRating: number;
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

export interface BulkOperationResult {
    success: boolean;
    message: string;
    processedCount: number;
    successCount: number;
    failedCount: number;
    errors?: Array<{
        id?: string;
        sku?: string;
        error: string;
    }>;
}

export interface BulkPriceUpdate {
    productIds: string[];
    tier: PricingTier;
    updateType: 'fixed' | 'percentage' | 'formula';
    value: number;
    reason?: string;
    changedBy: string;
}

export interface BulkStockUpdate {
    productIds: string[];
    operation: 'set' | 'add' | 'subtract';
    quantity: number;
    reason?: string;
}

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

export interface ProductStatistics {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    featuredProducts: number;
    
    totalInventoryValue: number;
    totalCostValue: number;
    potentialProfit: number;
    averageMargin: number;
    
    stockStats: {
        inStock: number;
        lowStock: number;
        outOfStock: number;
    };
    
    categoryStats: Array<{
        category: string;
        categorySlug: string;
        productCount: number;
        totalValue: number;
        averageMargin: number;
    }>;
    
    priceRangeStats: {
        min: number;
        max: number;
        average: number;
    };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

// Type for product form data (used in forms)
export type ProductFormData = Omit<CreateProductDTO, 'id' | 'categorySlug'> & {
    id?: string;
    categorySlug?: string;
};

// Type for product import/export
export interface ProductExportRow {
    SKU: string;
    Name: string;
    Description: string;
    Category: string;
    'Retail Price': number;
    'Wholesale Price': number;
    'Special Price': number;
    'Cost Price': number;
    'Stock Quantity': number;
    'Reorder Level': number;
    'Is Active': boolean;
    'Is Featured': boolean;
    Tags: string;
    Badge: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
        code: string;
        details?: any;
    };
}

export interface ProductApiResponse extends ApiResponse<ProductResponseDTO> {}
export interface ProductListApiResponse extends ApiResponse<PaginatedResponse<ProductListItemDTO>> {}
export interface StockAlertApiResponse extends ApiResponse<PaginatedResponse<IStockAlert>> {}
export interface CategorySummaryApiResponse extends ApiResponse<ICategorySummary> {}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const generateCategorySlug = (category: string): string => {
    return category
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
};

export const calculateDiscountPercentage = (originalPrice: number, currentPrice: number): number => {
    if (originalPrice <= 0 || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100 * 10) / 10;
};

export const calculateMargin = (sellingPrice: number, costPrice: number): number => {
    if (costPrice <= 0) return 0;
    return Math.round(((sellingPrice - costPrice) / costPrice) * 100 * 10) / 10;
};

export const determineStockStatus = (
    quantity: number,
    reorderLevel: number
): { status: StockStatus; inStock: boolean } => {
    if (quantity <= 0) {
        return { status: StockStatus.OUT_OF_STOCK, inStock: false };
    }
    if (quantity <= reorderLevel) {
        return { status: StockStatus.LOW_STOCK, inStock: true };
    }
    return { status: StockStatus.IN_STOCK, inStock: true };
};

export const determineUrgency = (currentStock: number, reorderPoint: number): UrgencyLevel => {
    if (currentStock === 0) return UrgencyLevel.CRITICAL;
    if (currentStock <= reorderPoint / 2) return UrgencyLevel.HIGH;
    if (currentStock <= reorderPoint) return UrgencyLevel.MEDIUM;
    return UrgencyLevel.LOW;
};

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

export const PRODUCT_VALIDATION = {
    SKU: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 50,
        PATTERN: /^[A-Z0-9-]+$/,
    },
    NAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 100,
    },
    DESCRIPTION: {
        MIN_LENGTH: 10,
        MAX_LENGTH: 500,
    },
    PRICE: {
        MIN: 0,
        MAX: 1000000,
    },
    STOCK: {
        MIN: 0,
        MAX: 100000,
    },
    RATING: {
        MIN: 0,
        MAX: 5,
    },
    TAGS: {
        MAX_COUNT: 20,
        MAX_LENGTH: 30,
    },
    IMAGES: {
        MAX_COUNT: 10,
        MAX_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    },
};


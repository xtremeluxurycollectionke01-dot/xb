// lib/models/product.model.ts
export interface Product {
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
  originalPrice?: number;
  unit?: string;
  minOrderQuantity?: number;
  costPrice?: number;
  supplier?: string;
  suppliers?: SupplierRef[];
  stock: number;
  stockQuantity: number;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  inStock: boolean;
  reorderPoint?: number;
  reorderLevel?: number;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  specifications?: Record<string, any>;
  tags: string[];
  badge?: string;
  downloads?: Download[];
  isFeatured?: boolean;
  isActive: boolean;
  discount?: number;
  createdAt: Date;
  updatedAt: Date;

  // New flags for product categorization
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSpecialOffer?: boolean;
  
  // For sale badge calculation
  saleEndDate?: Date;
  saleStartDate?: Date;

}

export interface SupplierRef {
  id: string;
  name: string;
  leadTime?: string;
  minimumOrder?: number;
}

export interface Review {
  id?: string;
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

export interface BulkPricingTier {
  quantity: number;
  price: number;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  ratings: number[];
  inStock: boolean;
  onSale: boolean;
  newArrivals: boolean;

  bestSellers?: boolean;
  specialOffers?: boolean;
}

export interface PriceRange {
  label: string;
  min: number;
  max: number;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    details: string;
  };
  message?: string;
}
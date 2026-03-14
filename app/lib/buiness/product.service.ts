// lib/business/product.service.ts
/*import { Product, FilterState, PriceRange } from '../models/product.model';
import { productApi, ProductQueryParams } from '../infrastructure/product.api';

export interface ProductFilters {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  ratings: number[];
  inStock: boolean;
  onSale: boolean;
  newArrivals: boolean;
}

export interface SortOption {
  field: string;
  order: 'asc' | 'desc';
}

export class ProductService {
  private static instance: ProductService;
  private productCache: Map<string, { data: Product[]; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  private getCacheKey(params: ProductQueryParams): string {
    return JSON.stringify(params);
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  async getProducts(
    page: number = 1,
    limit: number = 12,
    filters?: Partial<ProductFilters>,
    sort?: SortOption,
    search?: string
  ) {
    const params: ProductQueryParams = {
      page,
      limit,
      search,
      isActive: true
    };

    // Apply filters
    if (filters) {
      if (filters.categories?.length) {
        params.category = filters.categories;
      }
      
      if (filters.brands?.length) {
        params.brand = filters.brands;
      }
      
      if (filters.priceRange) {
        params.minPrice = filters.priceRange[0];
        params.maxPrice = filters.priceRange[1];
      }
      
      if (filters.ratings?.length) {
        // Use the highest rating selected as minimum
        params.minRating = Math.max(...filters.ratings);
      }
      
      if (filters.inStock) {
        params.inStock = true;
      }
      
      if (filters.onSale) {
        // We'll handle this on the client side for now
        // API doesn't have direct onSale filter
      }
      
      if (filters.newArrivals) {
        // We'll handle this on the client side for now
        // API doesn't have direct newArrivals filter
      }
    }

    // Apply sorting
    if (sort) {
      params.sortBy = sort.field;
      params.sortOrder = sort.order;
    }

    // Check cache
    const cacheKey = this.getCacheKey(params);
    const cached = this.productCache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await productApi.getProducts(params);
      
      // Apply client-side filters that API doesn't support
      let products = response.data;
      
      if (filters?.onSale) {
        products = products.filter(p => p.originalPrice && p.originalPrice > p.price);
      }
      
      if (filters?.newArrivals) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        products = products.filter(p => new Date(p.createdAt) > thirtyDaysAgo);
      }

      /*const result = {
        ...response,
        data: products
      };*

      const result = products;

      // Cache the result
      this.productCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error('Error in ProductService.getProducts:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      return await productApi.getProductById(id);
    } catch (error) {
      console.error('Error in ProductService.getProductById:', error);
      return null;
    }
  }

  async getRecentlyViewed(): Promise<Product[]> {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem('labpro_recently_viewed');
      const ids = stored ? JSON.parse(stored) : [];
      
      if (ids.length === 0) return [];
      
      const products = await productApi.getProductsByIds(ids);
      return products.slice(0, 6);
    } catch (error) {
      console.error('Error getting recently viewed:', error);
      return [];
    }
  }

  addToRecentlyViewed(productId: string) {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('labpro_recently_viewed');
      let ids: string[] = stored ? JSON.parse(stored) : [];
      
      ids = ids.filter(id => id !== productId);
      ids.unshift(productId);
      ids = ids.slice(0, 6);
      
      localStorage.setItem('labpro_recently_viewed', JSON.stringify(ids));
    } catch (error) {
      console.error('Failed to update recently viewed:', error);
    }
  }

  extractUniqueValues(products: Product[], key: keyof Product): string[] {
    const values = products
      .map(p => p[key])
      .filter((v): v is string => typeof v === 'string' && v.length > 0);
    return [...new Set(values)].sort();
  }

  getPriceRanges(): PriceRange[] {
    return [
      { label: 'Under KES 1,000', min: 0, max: 1000 },
      { label: 'KES 1,000 - 5,000', min: 1000, max: 5000 },
      { label: 'KES 5,000 - 20,000', min: 5000, max: 20000 },
      { label: 'KES 20,000 - 50,000', min: 20000, max: 50000 },
      { label: 'Over KES 50,000', min: 50000, max: Infinity },
    ];
  }

  clearCache() {
    this.productCache.clear();
  }
}

export const productService = ProductService.getInstance();*/

// lib/business/product.service.ts
import { Product, FilterState, PriceRange, PaginatedResponse } from '../models/product.model';
import { productApi, ProductQueryParams } from '../infrastructure/product.api';

export interface SortOption {
  field: string;
  order: 'asc' | 'desc';
}

export class ProductService {
  private static instance: ProductService;
  private productCache: Map<string, { data: PaginatedResponse<Product>; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  private getCacheKey(params: ProductQueryParams): string {
    return JSON.stringify(params);
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  async getProducts(
    page: number = 1,
    limit: number = 12,
    filters?: Partial<FilterState>,
    sort?: SortOption,
    search?: string
  ): Promise<PaginatedResponse<Product>> {
    const params: ProductQueryParams = { page, limit, search, isActive: true };

    // Apply filters
    if (filters) {
      if (filters.categories?.length) params.category = filters.categories;
      if (filters.brands?.length) params.brand = filters.brands;
      if (filters.priceRange) {
        params.minPrice = filters.priceRange[0];
        params.maxPrice = filters.priceRange[1];
      }
      if (filters.ratings?.length) params.minRating = Math.max(...filters.ratings);
      if (filters.inStock) params.inStock = true;
    }

    // Apply sorting
    if (sort) {
      params.sortBy = sort.field;
      params.sortOrder = sort.order;
    }

    // Check cache
    const cacheKey = this.getCacheKey(params);
    const cached = this.productCache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await productApi.getProducts(params);
      let products = response.data;

      // Client-side filters
      if (filters?.onSale) {
        products = products.filter(p => p.originalPrice && p.originalPrice > p.price);
      }

      if (filters?.newArrivals) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        products = products.filter(p => new Date(p.createdAt) > thirtyDaysAgo);
      }

      // Wrap products with pagination info
      const result: PaginatedResponse<Product> = {
        data: products,
        pagination: response.pagination || {
          page,
          limit,
          totalItems: products.length,
          totalPages: Math.ceil(products.length / limit),
          hasNext: page * limit < products.length,
          hasPrev: page > 1,
        },
      };

      // Cache the result
      this.productCache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    } catch (error) {
      console.error('Error in ProductService.getProducts:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      return await productApi.getProductById(id);
    } catch (error) {
      console.error('Error in ProductService.getProductById:', error);
      return null;
    }
  }

  async getRecentlyViewed(): Promise<Product[]> {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem('labpro_recently_viewed');
      const ids: string[] = stored ? JSON.parse(stored) : [];

      if (!ids.length) return [];

      const products = await productApi.getProductsByIds(ids);
      return products.slice(0, 6);
    } catch (error) {
      console.error('Error getting recently viewed:', error);
      return [];
    }
  }

  addToRecentlyViewed(productId: string) {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('labpro_recently_viewed');
      let ids: string[] = stored ? JSON.parse(stored) : [];

      ids = ids.filter(id => id !== productId);
      ids.unshift(productId);
      ids = ids.slice(0, 6);

      localStorage.setItem('labpro_recently_viewed', JSON.stringify(ids));
    } catch (error) {
      console.error('Failed to update recently viewed:', error);
    }
  }

  extractUniqueValues(products: Product[], key: keyof Product): string[] {
    const values = products
      .map(p => p[key])
      .filter((v): v is string => typeof v === 'string' && v.length > 0);
    return [...new Set(values)].sort();
  }

  getPriceRanges(): PriceRange[] {
    return [
      { label: 'Under KES 1,000', min: 0, max: 1000 },
      { label: 'KES 1,000 - 5,000', min: 1000, max: 5000 },
      { label: 'KES 5,000 - 20,000', min: 5000, max: 20000 },
      { label: 'KES 20,000 - 50,000', min: 20000, max: 50000 },
      { label: 'Over KES 50,000', min: 50000, max: Infinity },
    ];
  }

  clearCache() {
    this.productCache.clear();
  }
}

export const productService = ProductService.getInstance();
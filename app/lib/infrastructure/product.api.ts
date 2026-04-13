// lib/infrastructure/product.api.ts
import { Product, FilterState, PaginatedResponse, ApiResponse } from '../models/product.model';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string[];
  subcategory?: string[];
  brand?: string[];
  supplier?: string;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: string[];
  inStock?: boolean;
  isLowStock?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  minRating?: number;
  tags?: string[];
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  ids?: string;

  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSpecialOffer?: boolean;
}

class ProductAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/products';
  }

  private buildQueryString(params: ProductQueryParams): string {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            queryParams.append(key, value.join(','));
          }
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
    
    return queryParams.toString();
  }

  async getProducts(params: ProductQueryParams = {}): Promise<PaginatedResponse<Product>> {
    try {
      const queryString = this.buildQueryString(params);
      const url = `${this.baseUrl}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      const result: ApiResponse<PaginatedResponse<Product>> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.details || 'Failed to fetch products');
      }
      
      return result.data!;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const result: ApiResponse<{ product: Product }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.details || 'Failed to fetch product');
      }
      
      return result.data!.product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    try {
      const params: ProductQueryParams = {
        ids: ids.join(','),
        limit: ids.length
      };
      const response = await this.getProducts(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by ids:', error);
      return [];
    }
  }

  async getFeaturedByType(type: 'new' | 'best' | 'sale', limit: number = 6): Promise<Product[]> {
    try {
      let params: ProductQueryParams = { limit, isActive: true };
      
      switch (type) {
        case 'new':
          params = { ...params, isNewArrival: true, sortBy: 'createdAt', sortOrder: 'desc' };
          break;
        case 'best':
          params = { ...params, isBestSeller: true, sortBy: 'reviewCount', sortOrder: 'desc' };
          break;
        case 'sale':
          params = { ...params, isSpecialOffer: true, sortBy: 'discount', sortOrder: 'desc' };
          break;
      }
      
      const response = await this.getProducts(params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching featured ${type} products:`, error);
      return [];
    }
  }
}

export const productApi = new ProductAPI();
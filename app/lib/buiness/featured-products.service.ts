// lib/business/featured-products.service.ts
import { Product } from '../models/product.model';
import { productApi } from '../infrastructure/product.api';

export type FeaturedTabType = 'new' | 'best' | 'sale';

export interface FeaturedProductsResponse {
  newArrivals: Product[];
  bestSellers: Product[];
  specialOffers: Product[];
}

export class FeaturedProductsService {
  private static instance: FeaturedProductsService;
  private cache: Map<string, { data: Product[]; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): FeaturedProductsService {
    if (!FeaturedProductsService.instance) {
      FeaturedProductsService.instance = new FeaturedProductsService();
    }
    return FeaturedProductsService.instance;
  }

  private getCacheKey(tab: FeaturedTabType): string {
    return `featured_${tab}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  async getFeaturedProducts(tab: FeaturedTabType, limit: number = 6): Promise<Product[]> {
    const cacheKey = this.getCacheKey(tab);
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      let products: Product[] = [];
      
      switch (tab) {
        case 'new':
          products = await this.getNewArrivals(limit);
          break;
        case 'best':
          products = await this.getBestSellers(limit);
          break;
        case 'sale':
          products = await this.getSpecialOffers(limit);
          break;
      }
      
      // Cache the result
      this.cache.set(cacheKey, { data: products, timestamp: Date.now() });
      
      return products;
    } catch (error) {
      console.error(`Error fetching featured products for ${tab}:`, error);
      return [];
    }
  }

  private async getNewArrivals(limit: number): Promise<Product[]> {
    try {
      // Get products created in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const response = await productApi.getProducts({
        limit,
        isActive: true,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      // Filter for products that are marked as new arrival OR created recently
      let products = response.data;
      
      // First priority: products marked as isNewArrival
      const markedNewArrivals = products.filter(p => p.isNewArrival === true);
      
      // Second: recently created products (within 30 days) that aren't already included
      const recentlyCreated = products.filter(p => 
        !markedNewArrivals.some(marked => marked.id === p.id) && 
        new Date(p.createdAt) > thirtyDaysAgo
      );
      
      // Combine and limit
      const allNewArrivals = [...markedNewArrivals, ...recentlyCreated];
      return allNewArrivals.slice(0, limit);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      return [];
    }
  }

  private async getBestSellers(limit: number): Promise<Product[]> {
    try {
      // Fetch best sellers based on review count and rating
      const response = await productApi.getProducts({
        limit,
        isActive: true,
        sortBy: 'reviewCount',
        sortOrder: 'desc'
      });
      
      let products = response.data;
      
      // First priority: products marked as isBestSeller
      const markedBestSellers = products.filter(p => p.isBestSeller === true);
      
      // Second: products with high ratings and review counts
      const highRated = products
        .filter(p => !markedBestSellers.some(marked => marked.id === p.id))
        .sort((a, b) => {
          // Sort by rating and review count
          const aScore = (a.rating || 0) * (a.reviewCount || 0);
          const bScore = (b.rating || 0) * (b.reviewCount || 0);
          return bScore - aScore;
        });
      
      // Combine and limit
      const allBestSellers = [...markedBestSellers, ...highRated];
      return allBestSellers.slice(0, limit);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      return [];
    }
  }

  private async getSpecialOffers(limit: number): Promise<Product[]> {
    try {
      const response = await productApi.getProducts({
        limit: limit * 2, // Fetch more to filter
        isActive: true,
        sortBy: 'discount',
        sortOrder: 'desc'
      });
      
      let products = response.data;
      
      // Filter for special offers
      const specialOffers = products.filter(product => {
        // Check if marked as special offer
        if (product.isSpecialOffer) return true;
        
        // Check if has discount
        if (product.originalPrice && product.originalPrice > product.price) return true;
        
        // Check if discount percentage is significant (>= 10%)
        if (product.discount && product.discount >= 10) return true;
        
        // Check if sale is active
        if (product.saleStartDate && product.saleEndDate) {
          const now = new Date();
          const start = new Date(product.saleStartDate);
          const end = new Date(product.saleEndDate);
          if (now >= start && now <= end) return true;
        }
        
        return false;
      });
      
      return specialOffers.slice(0, limit);
    } catch (error) {
      console.error('Error fetching special offers:', error);
      return [];
    }
  }

  async getProductBadge(product: Product): Promise<{ type: string; label: string; icon?: any } | null> {
    if (product.isNewArrival) {
      return { type: 'new', label: 'New Arrival' };
    }
    
    if (product.isBestSeller) {
      return { type: 'trending', label: 'Best Seller' };
    }
    
    if (product.isSpecialOffer || (product.originalPrice && product.originalPrice > product.price)) {
      const discount = product.discount || 
        Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100);
      return { type: 'sale', label: `${discount}% OFF` };
    }
    
    return null;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const featuredProductsService = FeaturedProductsService.getInstance();
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { Product } from '@/models/Products';
import { Types } from 'mongoose';
import { StockStatus } from '@/models/Products';
import { PricingTier } from '@/models/Products';


/** GET /api/products/:id - Fetch a single product by ID */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    // In Next.js 15, params is a Promise that must be awaited
    const params = await context.params;
    const { id } = params;
    
    console.log('[Product API] GET request for ID:', id);

    if (!id || id === 'null' || id === 'undefined') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            details: 'Invalid product ID provided' 
          } 
        },
        { status: 400 }
      );
    }

    // Try to find by MongoDB _id or custom id field
    let product;
    
    // Check if it's a valid ObjectId
    if (Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean();
    }
    
    // If not found by _id, try by custom id field
    if (!product) {
      product = await Product.findOne({ id: id }).lean();
    }

    if (!product) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NOT_FOUND', 
            details: `Product with ID ${id} not found` 
          } 
        },
        { status: 404 }
      );
    }

    // Calculate margins and other computed fields
    const retailMargin = product.costPrice 
      ? ((product.pricing.retail - product.costPrice) / product.costPrice) * 100 
      : 0;
    const wholesaleMargin = product.costPrice 
      ? ((product.pricing.wholesale - product.costPrice) / product.costPrice) * 100 
      : 0;
    const specialMargin = product.costPrice 
      ? ((product.pricing.special - product.costPrice) / product.costPrice) * 100 
      : 0;
    
    const discountPercentage = product.originalPrice && product.originalPrice > product.pricing.retail
      ? ((product.originalPrice - product.pricing.retail) / product.originalPrice) * 100
      : 0;
    
    const isLowStock = product.stockQuantity <= (product.reorderLevel || product.reorderPoint || 0);

    const productDetail = {
      _id: product._id.toString(),
      id: product.id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      fullDescription: product.fullDescription,
      category: product.category,
      categorySlug: product.categorySlug,
      subcategory: product.subcategory,
      brand: product.brand,
      images: product.images || [],
      photos: product.photos || [],
      pricing: product.pricing,
      originalPrice: product.originalPrice,
      unit: product.unit,
      minOrderQuantity: product.minOrderQuantity,
      costPrice: product.costPrice,
      supplier: product.supplier,
      suppliers: product.suppliers || [],
      stockQuantity: product.stockQuantity,
      stockStatus: product.stockStatus,
      inStock: product.inStock,
      reorderLevel: product.reorderLevel,
      reorderPoint: product.reorderPoint,
      rating: product.rating,
      reviewCount: product.reviewCount,
      reviews: product.reviews || [],
      specifications: product.specifications,
      tags: product.tags || [],
      badge: product.badge,
      downloads: product.downloads || [],
      priceHistory: product.priceHistory || [],
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      retailMargin,
      wholesaleMargin,
      specialMargin,
      discountPercentage,
      isLowStock
    };

    return NextResponse.json({ 
      success: true, 
      data: productDetail 
    });
    
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_SERVER_ERROR', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        } 
      },
      { status: 500 }
    );
  }
}

/** PUT /api/products/:id - Update a product */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const params = await context.params;
    const { id } = params;
    const body = await request.json();

    console.log('[Product API] PUT request for ID:', id);

    if (!id || id === 'null' || id === 'undefined') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            details: 'Invalid product ID provided' 
          } 
        },
        { status: 400 }
      );
    }

    // Find the product
    let product;
    if (Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ id: id });
    }

    if (!product) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NOT_FOUND', 
            details: `Product with ID ${id} not found` 
          } 
        },
        { status: 404 }
      );
    }

    // Update fields
    if (body.name) product.name = body.name;
    if (body.description) product.description = body.description;
    if (body.fullDescription !== undefined) product.fullDescription = body.fullDescription;
    if (body.category) product.category = body.category;
    if (body.brand !== undefined) product.brand = body.brand;
    
    if (body.pricing) {
      product.pricing = { ...product.pricing, ...body.pricing };
      product.retailPrice = product.pricing.retail;
      product.wholesalePrice = product.pricing.wholesale;
      product.price = product.pricing.retail;
    }
    
    if (body.costPrice !== undefined) product.costPrice = body.costPrice;
    if (body.stockQuantity !== undefined) {
      product.stockQuantity = body.stockQuantity;
      product.stock = body.stockQuantity;
    }
    if (body.reorderLevel !== undefined) product.reorderLevel = body.reorderLevel;
    if (body.reorderPoint !== undefined) product.reorderPoint = body.reorderPoint;
    if (body.isActive !== undefined) product.isActive = body.isActive;
    if (body.supplier !== undefined) product.supplier = body.supplier;
    if (body.tags) product.tags = body.tags;
    if (body.specifications) product.specifications = body.specifications;

    // Update stock status
    const reorderThreshold = (product.reorderLevel ?? 0) > 0 
      ? product.reorderLevel 
      : (product.reorderPoint ?? 0);
    
    /*if (product.stockQuantity === 0) {
      product.stockStatus = 'out-of-stock';
      product.inStock = false;
    } else if (product.stockQuantity <= reorderThreshold) {
      product.stockStatus = 'low-stock';
      product.inStock = true;
    } else {
      product.stockStatus = 'in-stock';
      product.inStock = true;
    }*/

    if (product.stockQuantity === 0) {
      product.stockStatus = StockStatus.OUT_OF_STOCK;
      product.inStock = false;
    } else if (product.stockQuantity <= (reorderThreshold ?? 0)) {
      product.stockStatus = StockStatus.LOW_STOCK;
      product.inStock = true;
    } else {
      product.stockStatus = StockStatus.IN_STOCK;
      product.inStock = true;
    }

    await product.save();

    // If price was updated, add to price history
    /*if (body.pricing && body.priceChangeReason) {
      const priceHistoryEntry = {
        _id: `ph_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        oldPrice: body.oldPrice,
        newPrice: body.pricing[Object.keys(body.pricing)[0]],
        tier: Object.keys(body.pricing)[0] as 'retail' | 'wholesale' | 'special',
        changedBy: body.changedBy || 'system',
        changedAt: new Date(),
        reason: body.priceChangeReason
      };
      
      product.priceHistory.push(priceHistoryEntry);
      await product.save();
    }*/
   if (body.pricing && body.priceChangeReason) {
    // Map string keys to PricingTier enum values
    const tierKey = Object.keys(body.pricing)[0] as keyof typeof PricingTier;
    const tierMap: Record<string, PricingTier> = {
      'retail': PricingTier.RETAIL,
      'wholesale': PricingTier.WHOLESALE,
      'special': PricingTier.SPECIAL
    };
    
    const priceHistoryEntry = {
      _id: `ph_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      oldPrice: body.oldPrice,
      newPrice: body.pricing[tierKey],
      tier: tierMap[tierKey] || PricingTier.RETAIL, // Proper enum value
      changedBy: body.changedBy || 'system',
      changedAt: new Date(),
      reason: body.priceChangeReason
    };
    
    product.priceHistory.push(priceHistoryEntry);
  }

    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully',
      data: product 
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_SERVER_ERROR', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        } 
      },
      { status: 500 }
    );
  }
}

/** DELETE /api/products/:id - Delete a product */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const params = await context.params;
    const { id } = params;

    console.log('[Product API] DELETE request for ID:', id);

    if (!id || id === 'null' || id === 'undefined') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            details: 'Invalid product ID provided' 
          } 
        },
        { status: 400 }
      );
    }

    let product;
    if (Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ id: id });
    }

    if (!product) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NOT_FOUND', 
            details: `Product with ID ${id} not found` 
          } 
        },
        { status: 404 }
      );
    }

    // Soft delete (mark as inactive)
    product.isActive = false;
    await product.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_SERVER_ERROR', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        } 
      },
      { status: 500 }
    );
  }
}
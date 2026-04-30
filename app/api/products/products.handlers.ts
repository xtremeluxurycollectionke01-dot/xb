// app/api/products/products.handlers.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { Product } from '@/models/Products';
import { CategorySummary, StockAlert } from '@/models/Category';
import {
  CreateProductDTO,
  ProductListItemDTO,
  PaginatedResponse,
  generateCategorySlug,
  determineStockStatus,
  determineUrgency
} from '@/types/product.types';

/** GET /api/products - List products with filtering and pagination */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query: any = {};

    // --- Filters ---
    if (searchParams.get('category')) {
      const categories = searchParams.get('category')?.split(',');
      if (categories?.length) query.category = { $in: categories };
    }

    if (searchParams.get('subcategory')) {
      const subcategories = searchParams.get('subcategory')?.split(',');
      if (subcategories?.length) query.subcategory = { $in: subcategories };
    }

    if (searchParams.get('brand')) {
      const brands = searchParams.get('brand')?.split(',');
      if (brands?.length) query.brand = { $in: brands };
    }

    if (searchParams.get('supplier')) {
      query.supplier = searchParams.get('supplier');
    }

    if (searchParams.get('minPrice') || searchParams.get('maxPrice')) {
      query['pricing.retail'] = {};
      if (searchParams.get('minPrice'))
        query['pricing.retail'].$gte = parseFloat(searchParams.get('minPrice')!);
      if (searchParams.get('maxPrice'))
        query['pricing.retail'].$lte = parseFloat(searchParams.get('maxPrice')!);
    }

    if (searchParams.get('stockStatus')) {
      const statuses = searchParams.get('stockStatus')?.split(',');
      if (statuses?.length) query.stockStatus = { $in: statuses };
    }

    if (searchParams.get('inStock') === 'true') query.inStock = true;
    else if (searchParams.get('inStock') === 'false') query.inStock = false;

    if (searchParams.get('isLowStock') === 'true') {
      query.$expr = { $lte: ['$stockQuantity', '$reorderLevel'] };
    }

    if (searchParams.get('isActive') !== null)
      query.isActive = searchParams.get('isActive') === 'true';

    if (searchParams.get('isFeatured') === 'true') query.isFeatured = true;

    if (searchParams.get('minRating'))
      query.rating = { $gte: parseFloat(searchParams.get('minRating')!) };

    if (searchParams.get('tags')) {
      const tags = searchParams.get('tags')?.split(',');
      if (tags?.length) query.tags = { $in: tags };
    }

    if (searchParams.get('search')) {
      const searchTerm = searchParams.get('search');
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { sku: { $regex: searchTerm, $options: 'i' } },
        { fullDescription: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    if (searchParams.get('createdAfter')) {
      query.createdAt = { $gte: new Date(searchParams.get('createdAfter')!) };
    }
    if (searchParams.get('createdBefore')) {
      query.createdAt = { ...query.createdAt, $lte: new Date(searchParams.get('createdBefore')!) };
    }

    // --- Sorting ---
    const sortField = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    const sort: any = {};

    console.log('Incoming params:', request.nextUrl.search);
    console.log('PAGE:', page, 'LIMIT:', limit, 'SKIP:', skip);

    switch (sortField) {
      case 'retailMargin':
        sort['$expr'] = { $divide: [{ $subtract: ['$pricing.retail', '$costPrice'] }, '$costPrice'] };
        break;
      case 'discountPercentage':
        sort['$expr'] = {
          $cond: [
            { $gt: ['$originalPrice', 0] },
            { $divide: [{ $subtract: ['$originalPrice', '$pricing.retail'] }, '$originalPrice'] },
            0
          ]
        };
        break;
      default:
        sort[sortField] = sortOrder;
    }

    // --- Execute query ---
    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(query)
    ]);

    const productList: ProductListItemDTO[] = products.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      category: p.category,
      categorySlug: p.categorySlug,
      price: p.price,
      originalPrice: p.originalPrice ?? 0,
      stockStatus: p.stockStatus,
      stockQuantity: p.stockQuantity,
      rating: p.rating ?? 0,
      reviewCount: p.reviewCount ?? 0,
      badge: p.badge ?? '',
      isFeatured: p.isFeatured ?? false,
      isActive: p.isActive,
      mainImage: p.images?.[0] || p.photos?.[0] || '',
      discountPercentage:
        p.originalPrice && p.originalPrice > p.price
          ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100 * 10) / 10
          : 0,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));

    const response: PaginatedResponse<ProductListItemDTO> = {
      data: productList,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', details: error instanceof Error ? error.message : 'Unknown error' }
      },
      { status: 500 }
    );
  }
}

/** POST /api/products - Create a new product */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body: CreateProductDTO = await request.json();

    if (!body.sku || !body.name || !body.description || !body.category || !body.pricing || !body.costPrice || body.stockQuantity === undefined) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', details: 'Missing required fields' } },
        { status: 400 }
      );
    }

    const existingProduct = await Product.findOne({ sku: body.sku });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: { code: 'DUPLICATE_SKU', details: `Product with SKU ${body.sku} already exists` } },
        { status: 409 }
      );
    }

    const productId = body.id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const categorySlug = body.categorySlug || generateCategorySlug(body.category);
    const { status, inStock } = determineStockStatus(body.stockQuantity, body.reorderLevel || 0);

    const product = new Product({
      id: productId,
      sku: body.sku,
      name: body.name,
      description: body.description,
      fullDescription: body.fullDescription || '',
      category: body.category,
      categorySlug,
      subcategory: body.subcategory || '',
      brand: body.brand || '',
      images: body.images || [],
      photos: body.photos || [],
      price: body.pricing.retail,
      retailPrice: body.pricing.retail,
      wholesalePrice: body.pricing.wholesale,
      pricing: body.pricing,
      originalPrice: body.originalPrice || 0,
      unit: body.unit || 'piece',
      minOrderQuantity: body.minOrderQuantity || 1,
      costPrice: body.costPrice,
      supplier: body.supplier || null,
      suppliers: body.suppliers || [],
      stock: body.stockQuantity,
      stockQuantity: body.stockQuantity,
      stockStatus: status,
      inStock,
      reorderPoint: body.reorderPoint || 0,
      reorderLevel: body.reorderLevel || 0,
      rating: 0,
      reviewCount: 0,
      reviews: [],
      specifications: body.specifications || {},
      tags: body.tags || [],
      badge: body.badge || '',
      downloads: body.downloads || [],
      priceHistory: [],
      isFeatured: body.isFeatured || false,
      isActive: body.isActive !== undefined ? body.isActive : true
    });

    await product.save();

    if (!inStock || status === 'low-stock') {
      const alert = new StockAlert({
        productId: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        currentStock: product.stockQuantity,
        reorderPoint: product.reorderLevel ?? 0,
        status: product.stockStatus,
        urgency: determineUrgency(product.stockQuantity, body.reorderLevel ?? 0),
        createdAt: new Date(),
        resolved: false
      });
      await alert.save();
    }

    updateCategorySummary(product.category, product.categorySlug).catch(console.error);

    return NextResponse.json({ success: true, message: 'Product created successfully', data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', details: error instanceof Error ? error.message : 'Unknown error' } },
      { status: 500 }
    );
  }
}

// --- Helper function ---
async function updateCategorySummary(category: string, categorySlug: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const products = await Product.find({ category, isActive: true });

    const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.pricing.retail * p.stockQuantity), 0);
    const avgMargin = products.length
      ? products.reduce((sum, p) => sum + ((p.pricing.retail - p.costPrice) / p.costPrice) * 100, 0) / products.length
      : 0;
    const avgRating = products.length
      ? products.reduce((sum, p) => sum + (p.rating ?? 0), 0) / products.length
      : 0;

    await CategorySummary.findOneAndUpdate(
      { date: today },
      {
        $set: {
          [`categories.$[elem]`]: {
            category,
            categorySlug,
            count: products.length,
            totalStock,
            totalValue,
            averageMargin: Math.round(avgMargin * 10) / 10,
            averageRating: Math.round(avgRating * 10) / 10
          }
        }
      },
      { arrayFilters: [{ 'elem.category': category }], upsert: true }
    );
  } catch (error) {
    console.error('Error updating category summary:', error);
  }
}
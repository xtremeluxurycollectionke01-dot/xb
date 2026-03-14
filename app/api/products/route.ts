// app/api/products/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Products';
import { CategorySummary, StockAlert } from '@/models/Category'; 
import { 
    CreateProductDTO, 
    ProductQueryParams, 
    ProductListItemDTO,
    PaginatedResponse,
    generateCategorySlug,
    determineStockStatus,
    determineUrgency,
    ApiResponse
} from '@/types/product.types';
import dbConnect from '@/lib/db/mongoose';


// GET /api/products - List products with filtering and pagination
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        
        const searchParams = request.nextUrl.searchParams;
        
        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;
        
        // Build query
        const query: any = {};
        
        // Filters
        if (searchParams.get('category')) {
            const categories = searchParams.get('category')?.split(',');
            if (categories && categories.length > 0) {
                query.category = { $in: categories };
            }
        }
        
        if (searchParams.get('subcategory')) {
            const subcategories = searchParams.get('subcategory')?.split(',');
            if (subcategories && subcategories.length > 0) {
                query.subcategory = { $in: subcategories };
            }
        }
        
        if (searchParams.get('brand')) {
            const brands = searchParams.get('brand')?.split(',');
            if (brands && brands.length > 0) {
                query.brand = { $in: brands };
            }
        }
        
        if (searchParams.get('supplier')) {
            query.supplier = searchParams.get('supplier');
        }
        
        // Price range
        if (searchParams.get('minPrice') || searchParams.get('maxPrice')) {
            query['pricing.retail'] = {};
            if (searchParams.get('minPrice')) {
                query['pricing.retail'].$gte = parseFloat(searchParams.get('minPrice')!);
            }
            if (searchParams.get('maxPrice')) {
                query['pricing.retail'].$lte = parseFloat(searchParams.get('maxPrice')!);
            }
        }
        
        // Stock status
        if (searchParams.get('stockStatus')) {
            const statuses = searchParams.get('stockStatus')?.split(',');
            if (statuses && statuses.length > 0) {
                query.stockStatus = { $in: statuses };
            }
        }
        
        if (searchParams.get('inStock') === 'true') {
            query.inStock = true;
        } else if (searchParams.get('inStock') === 'false') {
            query.inStock = false;
        }
        
        if (searchParams.get('isLowStock') === 'true') {
            query.$expr = { $lte: ["$stockQuantity", "$reorderLevel"] };
        }
        
        // Status
        if (searchParams.get('isActive') !== null) {
            query.isActive = searchParams.get('isActive') === 'true';
        }
        
        if (searchParams.get('isFeatured') === 'true') {
            query.isFeatured = true;
        }
        
        // Rating
        if (searchParams.get('minRating')) {
            query.rating = { $gte: parseFloat(searchParams.get('minRating')!) };
        }
        
        // Tags
        if (searchParams.get('tags')) {
            const tags = searchParams.get('tags')?.split(',');
            if (tags && tags.length > 0) {
                query.tags = { $in: tags };
            }
        }
        
        // Search
        if (searchParams.get('search')) {
            const searchTerm = searchParams.get('search');
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { sku: { $regex: searchTerm, $options: 'i' } },
                { fullDescription: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        
        // Date range
        if (searchParams.get('createdAfter')) {
            query.createdAt = { $gte: new Date(searchParams.get('createdAfter')!) };
        }
        
        if (searchParams.get('createdBefore')) {
            query.createdAt = { 
                ...query.createdAt,
                $lte: new Date(searchParams.get('createdBefore')!) 
            };
        }
        
        // Sorting
        const sortField = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
        const sort: any = {};
        
        // Handle special sort fields
        switch (sortField) {
            case 'retailMargin':
                sort['$expr'] = { 
                    $divide: [
                        { $subtract: ["$pricing.retail", "$costPrice"] },
                        "$costPrice"
                    ]
                };
                break;
            case 'discountPercentage':
                sort['$expr'] = {
                    $cond: [
                        { $gt: ["$originalPrice", 0] },
                        { $divide: [
                            { $subtract: ["$originalPrice", "$pricing.retail"] },
                            "$originalPrice"
                        ]},
                        0
                    ]
                };
                break;
            default:
                sort[sortField] = sortOrder;
        }
        
        // Execute queries
        const [products, total] = await Promise.all([
            Product.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(query)
        ]);
        
        // Transform to DTOs with null coalescing for optional fields
        const productList: ProductListItemDTO[] = products.map(product => ({
            id: product.id,
            sku: product.sku,
            name: product.name,
            category: product.category,
            categorySlug: product.categorySlug,
            price: product.price,
            originalPrice: product.originalPrice ?? 0, // Fix: Provide default for undefined
            stockStatus: product.stockStatus,
            stockQuantity: product.stockQuantity,
            rating: product.rating ?? 0, // Fix: Provide default for undefined
            reviewCount: product.reviewCount ?? 0, // Fix: Provide default for undefined
            badge: product.badge ?? '', // Fix: Provide default for undefined
            isFeatured: product.isFeatured ?? false, // Fix: Provide default for undefined
            isActive: product.isActive,
            mainImage: product.images?.[0] || product.photos?.[0] || '', // Fix: Provide default for undefined
            discountPercentage: product.originalPrice && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100 * 10) / 10
                : 0,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
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
        
        return NextResponse.json({
            success: true,
            data: response
        });
        
    } catch (error) {
        console.error('Error fetching products:', error);
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

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        
        const body: CreateProductDTO = await request.json();
        
        // Validation
        if (!body.sku || !body.name || !body.description || !body.category || !body.pricing || !body.costPrice || body.stockQuantity === undefined) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: { 
                        code: 'VALIDATION_ERROR',
                        details: 'Missing required fields'
                    }
                },
                { status: 400 }
            );
        }
        
        // Check if SKU already exists
        const existingProduct = await Product.findOne({ sku: body.sku });
        if (existingProduct) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: { 
                        code: 'DUPLICATE_SKU',
                        details: `Product with SKU ${body.sku} already exists`
                    }
                },
                { status: 409 }
            );
        }
        
        // Generate ID if not provided
        const productId = body.id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Generate category slug if not provided
        const categorySlug = body.categorySlug || generateCategorySlug(body.category);
        
        // Determine stock status
        const { status, inStock } = determineStockStatus(
            body.stockQuantity,
            body.reorderLevel || 0
        );
        
        // Create product
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
            isActive: body.isActive !== undefined ? body.isActive : true,
        });
        
        await product.save();
        
        // Create stock alert if needed
        if (!inStock || status === 'low-stock') {
            const alert = new StockAlert({
                productId: product.id,
                sku: product.sku,
                name: product.name,
                category: product.category,
                currentStock: product.stockQuantity,
                reorderPoint: product.reorderLevel ?? 0, // Fix: Use nullish coalescing
                status: product.stockStatus,
                urgency: determineUrgency(product.stockQuantity, body.reorderLevel ?? 0), // Fix: Use nullish coalescing
                createdAt: new Date(),
                resolved: false
            });
            await alert.save();
        }
        
        // Update category summary (async, don't await)
        updateCategorySummary(product.category, product.categorySlug).catch(console.error);
        
        return NextResponse.json({
            success: true,
            message: 'Product created successfully',
            data: product
        }, { status: 201 });
        
    } catch (error) {
        console.error('Error creating product:', error);
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

// Helper function to update category summary
async function updateCategorySummary(category: string, categorySlug: string) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const products = await Product.find({ category, isActive: true });
        
        const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);
        const totalValue = products.reduce((sum, p) => sum + (p.pricing.retail * p.stockQuantity), 0);
        const avgMargin = products.length > 0
            ? products.reduce((sum, p) => sum + ((p.pricing.retail - p.costPrice) / p.costPrice * 100), 0) / products.length
            : 0;
        const avgRating = products.length > 0
            ? products.reduce((sum, p) => sum + (p.rating ?? 0), 0) / products.length // Fix: Use nullish coalescing
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
            {
                arrayFilters: [{ 'elem.category': category }],
                upsert: true
            }
        );
    } catch (error) {
        console.error('Error updating category summary:', error);
    }
}*/

// app/api/products/route.ts
import { withCORS } from '@/lib/cors/cors';
import { GET as productsGET, POST as productsPOST } from './products.handlers';

export const GET = withCORS(productsGET, 'http://127.0.0.1:5500');
export const POST = withCORS(productsPOST, 'http://127.0.0.1:5500');
export const OPTIONS = withCORS(async () => new Response(null, { status: 204 }), 'http://127.0.0.1:5500');
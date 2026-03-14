// app/api/categories/categories.handlers.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { Product } from '@/models/Products';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const includeInactive =
      request.nextUrl.searchParams.get('includeInactive') === 'true';

    const match: any = {};

    if (!includeInactive) {
      match.isActive = true;
    }

    const categories = await Product.aggregate([
      { $match: match },

      {
        $group: {
          _id: {
            category: '$category',
            slug: '$categorySlug'
          },
          productCount: { $sum: 1 },
          subcategories: { $addToSet: '$subcategory' },
          brands: { $addToSet: '$brand' },
          avgPrice: { $avg: '$pricing.retail' },
          minPrice: { $min: '$pricing.retail' },
          maxPrice: { $max: '$pricing.retail' }
        }
      },

      {
        $project: {
          _id: 0,
          name: '$_id.category',
          slug: '$_id.slug',

          productCount: 1,

          subcategories: {
            $filter: {
              input: '$subcategories',
              as: 'sub',
              cond: { $ne: ['$$sub', ''] }
            }
          },

          brands: {
            $filter: {
              input: '$brands',
              as: 'brand',
              cond: { $ne: ['$$brand', ''] }
            }
          },

          priceRange: {
            min: { $round: ['$minPrice', 2] },
            max: { $round: ['$maxPrice', 2] },
            avg: { $round: ['$avgPrice', 2] }
          }
        }
      },

      { $sort: { name: 1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);

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
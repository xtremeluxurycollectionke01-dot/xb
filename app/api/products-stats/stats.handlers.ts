import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Products';
import { ProductStatistics } from '@/types/product.types';
import dbConnect from '@/lib/db/mongoose';
import { CategorySummary } from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      featuredProducts,
      inventoryValue,
      stockStats,
      categoryStats,
      priceRangeStats
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: false }),
      Product.countDocuments({ isFeatured: true, isActive: true }),

      // Inventory value
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalCostValue: {
              $sum: { $multiply: ['$costPrice', '$stockQuantity'] }
            },
            totalRetailValue: {
              $sum: { $multiply: ['$pricing.retail', '$stockQuantity'] }
            },
            avgMargin: {
              $avg: {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ['$pricing.retail', '$costPrice'] },
                      '$costPrice'
                    ]
                  },
                  100
                ]
              }
            }
          }
        }
      ]),

      // Stock stats
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            inStock: {
              $sum: {
                $cond: [{ $gt: ['$stockQuantity', '$reorderLevel'] }, 1, 0]
              }
            },
            lowStock: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $lte: ['$stockQuantity', '$reorderLevel'] },
                      { $gt: ['$stockQuantity', 0] }
                    ]
                  },
                  1,
                  0
                ]
              }
            },
            outOfStock: {
              $sum: {
                $cond: [{ $eq: ['$stockQuantity', 0] }, 1, 0]
              }
            }
          }
        }
      ]),

      // Category stats
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: {
              category: '$category',
              categorySlug: '$categorySlug'
            },
            productCount: { $sum: 1 },
            totalValue: {
              $sum: { $multiply: ['$pricing.retail', '$stockQuantity'] }
            },
            avgMargin: {
              $avg: {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ['$pricing.retail', '$costPrice'] },
                      '$costPrice'
                    ]
                  },
                  100
                ]
              }
            }
          }
        },
        { $sort: { productCount: -1 } }
      ]),

      // Price stats
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$pricing.retail' },
            maxPrice: { $max: '$pricing.retail' },
            avgPrice: { $avg: '$pricing.retail' }
          }
        }
      ])
    ]);

    const stats: ProductStatistics = {
      totalProducts,
      activeProducts,
      inactiveProducts,
      featuredProducts,

      totalInventoryValue: inventoryValue[0]?.totalRetailValue || 0,
      totalCostValue: inventoryValue[0]?.totalCostValue || 0,

      potentialProfit:
        (inventoryValue[0]?.totalRetailValue || 0) -
        (inventoryValue[0]?.totalCostValue || 0),

      averageMargin:
        Math.round((inventoryValue[0]?.avgMargin || 0) * 10) / 10,

      stockStats: stockStats[0] || {
        inStock: 0,
        lowStock: 0,
        outOfStock: 0
      },

      categoryStats: categoryStats.map(stat => ({
        category: stat._id.category,
        categorySlug: stat._id.categorySlug,
        productCount: stat.productCount,
        totalValue: Math.round(stat.totalValue * 100) / 100,
        averageMargin: Math.round(stat.avgMargin * 10) / 10
      })),

      priceRangeStats: priceRangeStats[0] || {
        min: 0,
        max: 0,
        average: 0
      }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const categorySummary = await CategorySummary.findOne({ date: today });

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        categorySummary: categorySummary || null
      }
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);

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
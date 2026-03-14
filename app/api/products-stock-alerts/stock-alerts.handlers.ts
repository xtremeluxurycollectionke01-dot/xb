import { NextRequest, NextResponse } from 'next/server';
import { PaginatedResponse } from '@/types/product.types';
import { StockAlert } from '@/models/Category';
import dbConnect from '@/lib/db/mongoose';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query: any = {};

    if (searchParams.get('resolved') !== null) {
      query.resolved = searchParams.get('resolved') === 'true';
    }

    if (searchParams.get('status')) {
      const statuses = searchParams.get('status')?.split(',');
      if (statuses && statuses.length > 0) {
        query.status = { $in: statuses };
      }
    }

    if (searchParams.get('urgency')) {
      const urgencies = searchParams.get('urgency')?.split(',');
      if (urgencies && urgencies.length > 0) {
        query.urgency = { $in: urgencies };
      }
    }

    if (searchParams.get('category')) {
      query.category = searchParams.get('category');
    }

    const sort: any = { urgency: 1, createdAt: -1 };

    const [alerts, total] = await Promise.all([
      StockAlert.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      StockAlert.countDocuments(query)
    ]);

    const response: PaginatedResponse<any> = {
      data: alerts,
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
    console.error('Error fetching stock alerts:', error);

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


export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { alertId, resolved } = body;

    if (!alertId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            details: 'Alert ID is required'
          }
        },
        { status: 400 }
      );
    }

    const alert = await StockAlert.findById(alertId);

    if (!alert) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            details: 'Stock alert not found'
          }
        },
        { status: 404 }
      );
    }

    if (resolved !== undefined) {
      alert.resolved = resolved;
      //alert.resolvedAt = resolved ? new Date() : null;
    }

    await alert.save();

    return NextResponse.json({
      success: true,
      message: resolved ? 'Alert resolved' : 'Alert updated',
      data: alert
    });

  } catch (error) {
    console.error('Error updating stock alert:', error);

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
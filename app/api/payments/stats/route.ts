// app/api/payments/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { Payment } from '@/models/Payment.model';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let dateFilter: any = {};
    
    if (startDate || endDate) {
      dateFilter.requestedAt = {};
      if (startDate) dateFilter.requestedAt.$gte = new Date(startDate);
      if (endDate) dateFilter.requestedAt.$lte = new Date(endDate);
    }
    
    // Get payment statistics
    const stats = await Payment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);
    
    // Get payments by method
    const byMethod = await Payment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { method: '$method', status: '$status' },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    // Get daily payment volume
    const dailyVolume = await Payment.aggregate([
      { $match: { ...dateFilter, status: 'COMPLETED' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        summary: stats,
        byMethod,
        dailyVolume,
        totalPayments: await Payment.countDocuments(dateFilter),
        totalAmount: (await Payment.aggregate([
          { $match: dateFilter },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]))[0]?.total || 0
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching payment stats:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to fetch payment statistics'
      }
    }, { status: 500 });
  }
}
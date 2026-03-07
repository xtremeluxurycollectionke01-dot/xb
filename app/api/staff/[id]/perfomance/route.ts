import { NextRequest, NextResponse } from 'next/server';
import { Staff } from '@/models/Staff';
import { Types } from 'mongoose';
import { authenticateRequest, AuthContext, hasPermission } from '@/lib/middleware/auth';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const detail = searchParams.get('detail') || 'summary'; // summary, detailed, full

    // Get current user staff record
    let currentStaff = null;
    if (auth.staffId) {
      currentStaff = await Staff.findById(new Types.ObjectId(auth.staffId));
    }

    const isOwnProfile = currentStaff?._id.toString() === id;
    
    // Check if manager via Staff model or AuthContext
    const isManager = (
      currentStaff?.hasPermission('STAFF', 'ADMIN') || 
      currentStaff?.role?.name === 'SALES_MANAGER' ||
      hasPermission(auth, 'STAFF', 'ADMIN') ||
      hasPermission(auth, 'REPORT', 'READ')
    );

    if (!isOwnProfile && !isManager) {
      return NextResponse.json(
        { error: 'Insufficient permissions' }, 
        { status: 403 }
      );
    }

    const staff = await Staff.findById(id).lean();
    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    const metrics = staff.metrics || {};
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(currentMonthStart.getTime() - 1);

    // Calculate month-over-month comparison
    const currentMonthActivity = (staff.activity || []).filter((a: any) => 
      new Date(a.timestamp) >= currentMonthStart
    );
    const lastMonthActivity = (staff.activity || []).filter((a: any) => 
      new Date(a.timestamp) >= lastMonthStart && new Date(a.timestamp) < currentMonthStart
    );

    const comparison = {
      ordersCreated: {
        current: currentMonthActivity.filter((a: any) => a.action === 'ORDER_CREATED').length,
        previous: lastMonthActivity.filter((a: any) => a.action === 'ORDER_CREATED').length
      },
      documentsIssued: {
        current: currentMonthActivity.filter((a: any) => 
          ['INVOICE_ISSUED', 'QUOTATION_ISSUED', 'CASH_SALE_ISSUED'].includes(a.action)
        ).length,
        previous: lastMonthActivity.filter((a: any) => 
          ['INVOICE_ISSUED', 'QUOTATION_ISSUED', 'CASH_SALE_ISSUED'].includes(a.action)
        ).length
      }
    };

    // Calculate performance score
    const volumeScore = Math.min((metrics.ordersCreatedThisMonth || 0) / 10 * 40, 40);
    const qualityScore = Math.max(0, 30 - (metrics.errorRatePercent || 0) * 3);
    const baseScore = 30;
    const performanceScore = Math.min(100, Math.round(volumeScore + qualityScore + baseScore));

    // Peer benchmarking (if manager view)
    let peerComparison = null;
    if (isManager) {
      const peers = await Staff.find({ 
        'role.name': staff.role?.name, 
        isActive: true,
        _id: { $ne: new Types.ObjectId(id) }
      }).select('metrics').lean();

      const peerAvgOrders = peers.reduce((sum, p) => sum + (p.metrics?.ordersCreatedThisMonth || 0), 0) / (peers.length || 1);
      const peerAvgRevenue = peers.reduce((sum, p) => sum + (p.metrics?.totalRevenueThisMonth || 0), 0) / (peers.length || 1);

      peerComparison = {
        orders: {
          user: metrics.ordersCreatedThisMonth || 0,
          peerAverage: Math.round(peerAvgOrders * 100) / 100,
          percentile: peers.length > 0 ? 
            (peers.filter(p => (p.metrics?.ordersCreatedThisMonth || 0) < (metrics.ordersCreatedThisMonth || 0)).length / peers.length * 100) : 
            0
        },
        revenue: {
          user: metrics.totalRevenueThisMonth || 0,
          peerAverage: Math.round(peerAvgRevenue * 100) / 100,
          percentile: peers.length > 0 ? 
            (peers.filter(p => (p.metrics?.totalRevenueThisMonth || 0) < (metrics.totalRevenueThisMonth || 0)).length / peers.length * 100) : 
            0
        }
      };
    }

    // Generate insights
    const insights = [];
    if (metrics.errorRatePercent > 5) {
      insights.push({
        type: 'warning',
        message: 'Error rate is above team average. Consider reviewing recent voided documents.',
        metric: 'errorRate'
      });
    }
    if (metrics.ordersCreatedThisMonth > 20) {
      insights.push({
        type: 'success',
        message: 'Outstanding order volume this month!',
        metric: 'volume'
      });
    }
    if (comparison.ordersCreated.current < comparison.ordersCreated.previous * 0.8) {
      insights.push({
        type: 'info',
        message: 'Order creation is down from last month. Check for seasonal trends or capacity issues.',
        metric: 'trend'
      });
    }

    const response: any = {
      staffId: id,
      name: `${staff.firstName} ${staff.lastName}`,
      role: staff.role?.displayName,
      period: {
        currentMonth: currentMonthStart.toISOString(),
        comparison: 'month-over-month'
      },
      summary: {
        performanceScore,
        scoreColor: performanceScore >= 80 ? '#10B981' : performanceScore >= 60 ? '#3B82F6' : '#F59E0B',
        ordersCreated: metrics.ordersCreatedThisMonth || 0,
        documentsIssued: metrics.documentsIssuedThisMonth || 0,
        errorRate: metrics.errorRatePercent || 0,
        revenueGenerated: metrics.totalRevenueThisMonth || 0
      },
      comparison,
      insights
    };

    if (detail === 'detailed' || detail === 'full') {
      response.metrics = {
        orders: {
          created: metrics.ordersCreatedThisMonth,
          processed: metrics.ordersProcessedThisMonth,
          averageValue: metrics.averageOrderValue
        },
        documents: {
          issued: metrics.documentsIssuedThisMonth,
          voided: metrics.documentsVoidedThisMonth,
          errorRate: metrics.errorRatePercent
        },
        efficiency: {
          itemsPacked: metrics.itemsPackedThisMonth,
          averagePackingTime: metrics.averagePackingTimeMinutes,
          averageStartTime: metrics.averageStartTime,
          averageEndTime: metrics.averageEndTime
        },
        financial: {
          totalRevenue: metrics.totalRevenueThisMonth,
          totalCollected: metrics.totalCollectedThisMonth,
          averageOrderValue: metrics.averageOrderValue
        },
        quality: {
          complaints: metrics.clientComplaints,
          compliments: metrics.clientCompliments
        }
      };
      response.peerComparison = peerComparison;
    }

    if (detail === 'full') {
      response.recentActivity = (staff.activity || [])
        .slice(-50)
        .reverse()
        .map((a: any) => ({
          timestamp: a.timestamp,
          action: a.action,
          resource: a.resource,
          targetNumber: a.targetNumber,
          details: a.details
        }));
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('[Performance API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance data' }, 
      { status: 500 }
    );
  }
}
/*import { NextRequest, NextResponse } from 'next/server';
import { Staff } from '@/models/Staff';
import { authenticateRequest, AuthContext, hasPermission } from '@/lib/middleware/auth';

// Helper to check if user can view team performance
async function canViewTeamPerformance(auth: AuthContext): Promise<boolean> {
  // Check AuthContext permissions
  if (hasPermission(auth, 'REPORT', 'READ') || hasPermission(auth, 'STAFF', 'READ')) {
    return true;
  }
  
  // Also check if user is a staff member (fallback)
  if (auth.staffId) {
    const staff = await Staff.findById(auth.staffId);
    if (staff && staff.isActive) {
      return staff.hasPermission('REPORT', 'READ') || staff.hasPermission('STAFF', 'READ');
    }
  }
  
  return false;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasAccess = await canViewTeamPerformance(auth);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'monthly';
    
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'daily':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'monthly':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Aggregate team performance
    const teamStats = await Staff.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$role.name',
          roleDisplay: { $first: '$role.displayName' },
          count: { $sum: 1 },
          totalOrders: { $sum: '$metrics.ordersCreatedThisMonth' },
          totalRevenue: { $sum: '$metrics.totalRevenueThisMonth' },
          avgProductivity: { $avg: '$metrics.ordersCreatedThisMonth' },
          totalErrors: { $sum: '$metrics.documentsVoidedThisMonth' },
          totalDocuments: { $sum: '$metrics.documentsIssuedThisMonth' }
        }
      },
      {
        $project: {
          role: '$_id',
          roleDisplay: 1,
          count: 1,
          totalOrders: 1,
          totalRevenue: 1,
          avgProductivity: { $round: ['$avgProductivity', 2] },
          errorRate: {
            $cond: [
              { $eq: ['$totalDocuments', 0] },
              0,
              { $multiply: [{ $divide: ['$totalErrors', '$totalDocuments'] }, 100] }
            ]
          }
        }
      }
    ]);

    // Get individual rankings
    const individuals = await Staff.find({ isActive: true })
      .select('firstName lastName role.name metrics employeeId lastLoginAt')
      .sort({ 'metrics.ordersCreatedThisMonth': -1 })
      .limit(10)
      .lean();

    // Calculate composite performance scores
    const rankedStaff = individuals.map(staff => {
      const metrics = staff.metrics || {};
      const volumeScore = Math.min((metrics.ordersCreatedThisMonth || 0) / 10 * 40, 40);
      const qualityScore = Math.max(0, 30 - (metrics.errorRatePercent || 0) * 3);
      const baseScore = 30;
      const totalScore = Math.min(100, Math.round(volumeScore + qualityScore + baseScore));
      
      return {
        ...staff,
        fullName: `${staff.firstName} ${staff.lastName}`,
        performanceScore: totalScore
      };
    }).sort((a, b) => b.performanceScore - a.performanceScore);

    // Generate alerts
    const alerts = [];
    const highErrorStaff = rankedStaff.filter(s => (s.metrics?.errorRatePercent || 0) > 5);
    if (highErrorStaff.length > 0) {
      alerts.push({
        type: 'warning',
        message: `${highErrorStaff.length} staff members have high error rates (>5%)`,
        affectedStaff: highErrorStaff.map(s => s.fullName)
      });
    }

    const zeroActivityStaff = rankedStaff.filter(s => (s.metrics?.ordersCreatedThisMonth || 0) === 0);
    if (zeroActivityStaff.length > 0) {
      alerts.push({
        type: 'info',
        message: `${zeroActivityStaff.length} staff members have no activity this month`,
        affectedStaff: zeroActivityStaff.map(s => s.fullName)
      });
    }

    return NextResponse.json({
      period,
      summary: {
        totalStaff: individuals.length,
        activeToday: individuals.filter(s => {
          const today = new Date();
          const lastLogin = s.lastLoginAt ? new Date(s.lastLoginAt) : null;
          return lastLogin && today.getTime() - lastLogin.getTime() < 24 * 60 * 60 * 1000;
        }).length,
        avgTeamProductivity: Math.round(rankedStaff.reduce((sum, s) => sum + s.performanceScore, 0) / rankedStaff.length)
      },
      byRole: teamStats,
      rankings: rankedStaff,
      alerts
    });

  } catch (error) {
    console.error('[Team Performance API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team performance' }, 
      { status: 500 }
    );
  }
}*/



// app/api/staff/performance/team/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import { Staff } from '@/models/Staff';
import { authenticateRequest, AuthContext, hasPermission } from '@/lib/middleware/auth';
import { withCORS, corsHeaders } from '@/lib/cors/cors';
import dbConnect from '@/lib/db/mongoose';
import '@/models/Staff';

// Helper to check if user can view team performance
async function canViewTeamPerformance(auth: AuthContext): Promise<boolean> {
  // Check AuthContext permissions
  if (hasPermission(auth, 'REPORT', 'READ') || hasPermission(auth, 'STAFF', 'READ')) {
    return true;
  }
  
  // Also check if user is a staff member (fallback)
  if (auth.staffId) {
    const staff = await Staff.findById(auth.staffId);
    if (staff && staff.isActive) {
      return staff.hasPermission('REPORT', 'READ') || staff.hasPermission('STAFF', 'READ');
    }
  }
  
  return false;
}

async function getTeamPerformanceHandler(request: NextRequest) {
  try {
    await dbConnect();
    
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders(request.headers.get('origin') || 'http://127.0.0.1:5500')
      });
    }

    const hasAccess = await canViewTeamPerformance(auth);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { 
        status: 403,
        headers: corsHeaders(request.headers.get('origin') || 'http://127.0.0.1:5500')
      });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'monthly';
    
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'daily':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'monthly':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Aggregate team performance
    const teamStats = await Staff.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$role.name',
          roleDisplay: { $first: '$role.displayName' },
          count: { $sum: 1 },
          totalOrders: { $sum: '$metrics.ordersCreatedThisMonth' },
          totalRevenue: { $sum: '$metrics.totalRevenueThisMonth' },
          avgProductivity: { $avg: '$metrics.ordersCreatedThisMonth' },
          totalErrors: { $sum: '$metrics.documentsVoidedThisMonth' },
          totalDocuments: { $sum: '$metrics.documentsIssuedThisMonth' }
        }
      },
      {
        $project: {
          role: '$_id',
          roleDisplay: 1,
          count: 1,
          totalOrders: 1,
          totalRevenue: 1,
          avgProductivity: { $round: ['$avgProductivity', 2] },
          errorRate: {
            $cond: [
              { $eq: ['$totalDocuments', 0] },
              0,
              { $multiply: [{ $divide: ['$totalErrors', '$totalDocuments'] }, 100] }
            ]
          }
        }
      }
    ]);

    // Get individual rankings
    const individuals = await Staff.find({ isActive: true })
      .select('firstName lastName role.name metrics employeeId lastLoginAt')
      .sort({ 'metrics.ordersCreatedThisMonth': -1 })
      .limit(10)
      .lean();

    // Calculate composite performance scores
    const rankedStaff = individuals.map(staff => {
      const metrics = staff.metrics || {};
      const volumeScore = Math.min((metrics.ordersCreatedThisMonth || 0) / 10 * 40, 40);
      const qualityScore = Math.max(0, 30 - (metrics.errorRatePercent || 0) * 3);
      const baseScore = 30;
      const totalScore = Math.min(100, Math.round(volumeScore + qualityScore + baseScore));
      
      return {
        ...staff,
        fullName: `${staff.firstName} ${staff.lastName}`,
        performanceScore: totalScore
      };
    }).sort((a, b) => b.performanceScore - a.performanceScore);

    // Generate alerts
    const alerts = [];
    const highErrorStaff = rankedStaff.filter(s => (s.metrics?.errorRatePercent || 0) > 5);
    if (highErrorStaff.length > 0) {
      alerts.push({
        type: 'warning',
        message: `${highErrorStaff.length} staff members have high error rates (>5%)`,
        affectedStaff: highErrorStaff.map(s => s.fullName)
      });
    }

    const zeroActivityStaff = rankedStaff.filter(s => (s.metrics?.ordersCreatedThisMonth || 0) === 0);
    if (zeroActivityStaff.length > 0) {
      alerts.push({
        type: 'info',
        message: `${zeroActivityStaff.length} staff members have no activity this month`,
        affectedStaff: zeroActivityStaff.map(s => s.fullName)
      });
    }

    return NextResponse.json({
      period,
      summary: {
        totalStaff: individuals.length,
        activeToday: individuals.filter(s => {
          const today = new Date();
          const lastLogin = s.lastLoginAt ? new Date(s.lastLoginAt) : null;
          return lastLogin && today.getTime() - lastLogin.getTime() < 24 * 60 * 60 * 1000;
        }).length,
        avgTeamProductivity: Math.round(rankedStaff.reduce((sum, s) => sum + s.performanceScore, 0) / rankedStaff.length)
      },
      byRole: teamStats,
      rankings: rankedStaff,
      alerts
    }, {
      headers: corsHeaders(request.headers.get('origin') || 'http://127.0.0.1:5500')
    });

  } catch (error) {
    console.error('[Team Performance API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team performance' }, 
      { 
        status: 500,
        headers: corsHeaders(request.headers.get('origin') || 'http://127.0.0.1:5500')
      }
    );
  }
}

// Export with CORS middleware
export const GET = withCORS(getTeamPerformanceHandler);
export const OPTIONS = withCORS(async () => new Response(null, { status: 204 }));*/

// app/api/staff/performance/team/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Staff } from '@/models/Staff';
import { authenticateRequest, AuthContext, hasPermission } from '@/lib/middleware/auth';
import { withCORS } from '@/lib/cors/cors';
import dbConnect from '@/lib/db/mongoose';
import '@/models/Staff';

async function getTeamPerformanceHandler(request: NextRequest) {
  try {
    await dbConnect();
    
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Your existing logic here...
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'monthly';
    
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'daily':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'monthly':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Aggregate team performance
    const teamStats = await Staff.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$role.name',
          roleDisplay: { $first: '$role.displayName' },
          count: { $sum: 1 },
          totalOrders: { $sum: '$metrics.ordersCreatedThisMonth' },
          totalRevenue: { $sum: '$metrics.totalRevenueThisMonth' },
          avgProductivity: { $avg: '$metrics.ordersCreatedThisMonth' },
          totalErrors: { $sum: '$metrics.documentsVoidedThisMonth' },
          totalDocuments: { $sum: '$metrics.documentsIssuedThisMonth' }
        }
      },
      {
        $project: {
          role: '$_id',
          roleDisplay: 1,
          count: 1,
          totalOrders: 1,
          totalRevenue: 1,
          avgProductivity: { $round: ['$avgProductivity', 2] },
          errorRate: {
            $cond: [
              { $eq: ['$totalDocuments', 0] },
              0,
              { $multiply: [{ $divide: ['$totalErrors', '$totalDocuments'] }, 100] }
            ]
          }
        }
      }
    ]);

    // Get individual rankings
    const individuals = await Staff.find({ isActive: true })
      .select('firstName lastName role.name metrics employeeId lastLoginAt')
      .sort({ 'metrics.ordersCreatedThisMonth': -1 })
      .limit(10)
      .lean();

    // Calculate composite performance scores
    const rankedStaff = individuals.map(staff => {
      const metrics = staff.metrics || {};
      const volumeScore = Math.min((metrics.ordersCreatedThisMonth || 0) / 10 * 40, 40);
      const qualityScore = Math.max(0, 30 - (metrics.errorRatePercent || 0) * 3);
      const baseScore = 30;
      const totalScore = Math.min(100, Math.round(volumeScore + qualityScore + baseScore));
      
      return {
        ...staff,
        fullName: `${staff.firstName} ${staff.lastName}`,
        performanceScore: totalScore
      };
    }).sort((a, b) => b.performanceScore - a.performanceScore);

    // Generate alerts
    const alerts = [];
    const highErrorStaff = rankedStaff.filter(s => (s.metrics?.errorRatePercent || 0) > 5);
    if (highErrorStaff.length > 0) {
      alerts.push({
        type: 'warning',
        message: `${highErrorStaff.length} staff members have high error rates (>5%)`,
        affectedStaff: highErrorStaff.map(s => s.fullName)
      });
    }

    const zeroActivityStaff = rankedStaff.filter(s => (s.metrics?.ordersCreatedThisMonth || 0) === 0);
    if (zeroActivityStaff.length > 0) {
      alerts.push({
        type: 'info',
        message: `${zeroActivityStaff.length} staff members have no activity this month`,
        affectedStaff: zeroActivityStaff.map(s => s.fullName)
      });
    }

    return NextResponse.json({
      period,
      summary: {
        totalStaff: individuals.length,
        activeToday: individuals.filter(s => {
          const today = new Date();
          const lastLogin = s.lastLoginAt ? new Date(s.lastLoginAt) : null;
          return lastLogin && today.getTime() - lastLogin.getTime() < 24 * 60 * 60 * 1000;
        }).length,
        avgTeamProductivity: rankedStaff.length > 0 
          ? Math.round(rankedStaff.reduce((sum, s) => sum + s.performanceScore, 0) / rankedStaff.length)
          : 0
      },
      byRole: teamStats,
      rankings: rankedStaff,
      alerts
    });

  } catch (error) {
    console.error('[Team Performance API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team performance' }, 
      { status: 500 }
    );
  }
}

// Export with CORS middleware
export const GET = withCORS(getTeamPerformanceHandler);
export const OPTIONS = withCORS(async () => new Response(null, { status: 204 }));
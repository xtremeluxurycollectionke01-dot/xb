// app/api/staff/stats/stats.handler.ts
import { NextRequest } from 'next/server';
import { Staff } from '@/models/Staff';
import dbConnect from '@/lib/db/mongoose';


export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Get all staff members
    const staffMembers = await Staff.find({ isActive: true })
      .select('firstName lastName email role metrics activity schedule employeeId')
      .lean();

    const totalStaff = staffMembers.length;
    const activeStaff = staffMembers.filter(s => s.isActive).length;

    // Group by role
    const byRole: Record<string, number> = {};
    staffMembers.forEach(staff => {
      const roleName = staff.role?.name || 'UNKNOWN';
      byRole[roleName] = (byRole[roleName] || 0) + 1;
    });

    // Today's activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let totalToday = 0;
    let loginsToday = 0;
    let ordersCreated = 0;
    let ordersProcessed = 0;
    let documentsIssued = 0;

    staffMembers.forEach(staff => {
      const todayActivities = staff.activity?.filter((a: any) => 
        new Date(a.timestamp) >= today && new Date(a.timestamp) < tomorrow
      ) || [];

      totalToday += todayActivities.length;
      loginsToday += todayActivities.filter((a: any) => a.action === 'LOGIN').length;
      ordersCreated += todayActivities.filter((a: any) => a.action === 'ORDER_CREATED').length;
      ordersProcessed += todayActivities.filter((a: any) => 
        ['ORDER_CONFIRMED', 'ORDER_PACKED', 'ORDER_DELIVERED'].includes(a.action)
      ).length;
      documentsIssued += todayActivities.filter((a: any) => 
        ['INVOICE_ISSUED', 'QUOTATION_ISSUED', 'CASH_SALE_ISSUED'].includes(a.action)
      ).length;
    });

    // Performance metrics
    let totalRevenue = 0;
    let totalOrders = 0;
    let maxProductivity = 0;
    let topPerformer = '';

    staffMembers.forEach(staff => {
      const monthOrders = staff.metrics?.ordersCreatedThisMonth || 0;
      const monthRevenue = staff.metrics?.totalRevenueThisMonth || 0;
      const productivityScore = calculateProductivityScore(staff);

      totalOrders += monthOrders;
      totalRevenue += monthRevenue;

      if (productivityScore > maxProductivity) {
        maxProductivity = productivityScore;
        topPerformer = staff.employeeId || `${staff.firstName} ${staff.lastName}`;
      }
    });

    const avgProductivityScore = staffMembers.length > 0 
      ? Math.round(staffMembers.reduce((sum, staff) => sum + calculateProductivityScore(staff), 0) / staffMembers.length)
      : 0;

    // Schedule adherence
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayName = dayNames[now.getDay()] as keyof typeof scheduleExample;

    let onSchedule = 0;
    let offSchedule = 0;
    let lateStarters = 0;
    let earlyLeavers = 0;

    staffMembers.forEach(staff => {
      if (!staff.schedule) return;

      const todaySchedule = staff.schedule[todayName];
      if (!todaySchedule || !todaySchedule.isWorkingDay) {
        offSchedule++;
        return;
      }

      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const [startHour, startMinute] = (todaySchedule.start || '09:00').split(':').map(Number);
      const [endHour, endMinute] = (todaySchedule.end || '17:00').split(':').map(Number);

      const currentTime = currentHour * 60 + currentMinute;
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      if (currentTime >= startTime && currentTime <= endTime) {
        onSchedule++;
      } else {
        offSchedule++;
      }

      // Check for late start (if they have activity after start time)
      const startActivity = staff.activity?.find((a: any) => {
        const activityDate = new Date(a.timestamp);
        return activityDate >= today && activityDate < tomorrow && a.action === 'LOGIN';
      });

      if (startActivity) {
        const loginHour = new Date(startActivity.timestamp).getHours();
        const loginMinute = new Date(startActivity.timestamp).getMinutes();
        const loginTime = loginHour * 60 + loginMinute;
        
        if (loginTime > startTime + 15) { // More than 15 minutes late
          lateStarters++;
        }
      }
    });

    const stats = {
      totalStaff,
      activeStaff,
      byRole,
      activity: {
        totalToday,
        loginsToday,
        ordersCreated,
        ordersProcessed,
        documentsIssued
      },
      performance: {
        topPerformer,
        avgProductivityScore,
        totalRevenueThisMonth: totalRevenue,
        totalOrdersThisMonth: totalOrders
      },
      schedule: {
        onSchedule,
        offSchedule,
        lateStarters,
        earlyLeavers: 0
      },
      lastUpdated: new Date().toISOString()
    };

    return new Response(JSON.stringify({
      success: true,
      data: stats
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('[Staff Stats] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch staff stats'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

function calculateProductivityScore(staff: any): number {
  const metrics = staff.metrics || {};
  const activityCount = staff.activity?.length || 0;
  
  // Simple productivity score calculation
  const orderScore = Math.min((metrics.ordersCreatedThisMonth || 0) * 2, 30);
  const documentScore = Math.min((metrics.documentsIssuedThisMonth || 0) * 1, 20);
  const activityScore = Math.min(activityCount / 10, 30);
  const errorPenalty = (metrics.errorRatePercent || 0) * 0.5;
  
  let score = orderScore + documentScore + activityScore - errorPenalty;
  return Math.max(0, Math.min(100, Math.round(score)));
}

const scheduleExample = {
  monday: { start: '09:00', end: '17:00', isWorkingDay: true },
  tuesday: { start: '09:00', end: '17:00', isWorkingDay: true },
  wednesday: { start: '09:00', end: '17:00', isWorkingDay: true },
  thursday: { start: '09:00', end: '17:00', isWorkingDay: true },
  friday: { start: '09:00', end: '17:00', isWorkingDay: true },
  saturday: { start: '09:00', end: '13:00', isWorkingDay: false },
  sunday: { start: '09:00', end: '13:00', isWorkingDay: false }
};
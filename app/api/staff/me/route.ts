import { NextRequest, NextResponse } from 'next/server';
import { Staff } from '@/models/Staff';
import { Types } from 'mongoose';
import { authenticateRequest, AuthContext } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to find staff by staffId first, then by user ID
    let staff;
    if (auth.staffId) {
      staff = await Staff.findById(new Types.ObjectId(auth.staffId));
    } else {
      // Fallback: look up by user ID (though staffId should be set for staff users)
      staff = await Staff.findOne({ 
        user: new Types.ObjectId(auth.userId),
        isActive: true 
      });
    }

    if (!staff) {
      return NextResponse.json(
        { error: 'Staff profile not found' }, 
        { status: 404 }
      );
    }

    // Calculate derived fields
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayKey = days[now.getDay()];
    const todaySchedule = staff.schedule?.[todayKey as keyof typeof staff.schedule];
    
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isOnSchedule = todaySchedule?.isWorkingDay && 
                        currentTime >= todaySchedule.start && 
                        currentTime <= todaySchedule.end;

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentActivity = (staff.activity || [])
      .filter((a: any) => new Date(a.timestamp) >= sevenDaysAgo)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);

    // Calculate permission flags for UI
    const permissions = {
      canCreateOrder: staff.hasPermission('ORDER', 'CREATE'),
      canApproveOrder: staff.hasPermission('ORDER', 'APPROVE'),
      canIssueInvoice: staff.hasPermission('INVOICE', 'ISSUE'),
      canModifyPrices: staff.role.permissions?.find((p: any) => p.resource === 'PRICE')?.conditions?.canChangePrices || false,
      maxOrderValue: staff.role.permissions?.find((p: any) => p.resource === 'ORDER')?.conditions?.maxOrderValue || 0
    };

    return NextResponse.json({
      profile: {
        ...staff.toObject(),
        fullName: `${staff.firstName} ${staff.lastName}`,
        initials: `${staff.firstName[0]}${staff.lastName[0]}`.toUpperCase()
      },
      permissions,
      workStatus: {
        isOnSchedule,
        currentTime,
        todaySchedule,
        todaysActivityCount: staff.activity?.filter((a: any) => 
          new Date(a.timestamp).setHours(0,0,0,0) === now.setHours(0,0,0,0)
        ).length || 0
      },
      recentActivity,
      metrics: staff.metrics
    });

  } catch (error) {
    console.error('[Staff Me API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' }, 
      { status: 500 }
    );
  }
}
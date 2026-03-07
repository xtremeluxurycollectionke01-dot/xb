import { NextRequest, NextResponse } from 'next/server';
import { Staff } from '@/models/Staff';
import { Types } from 'mongoose';
import { authenticateRequest, AuthContext } from '@/lib/middleware/auth';

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
    const checkAt = searchParams.get('at'); // ISO timestamp or 'now'
    const duration = parseInt(searchParams.get('duration') || '60'); // minutes needed

    const staff = await Staff.findById(id).lean();
    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    const checkTime = checkAt ? new Date(checkAt) : new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayKey = days[checkTime.getDay()];
    const daySchedule = (staff.schedule as any)?.[dayKey];

    // Calculate if on schedule at check time
    const timeStr = `${String(checkTime.getHours()).padStart(2, '0')}:${String(checkTime.getMinutes()).padStart(2, '0')}`;
    let status: 'available' | 'busy' | 'off-duty' | 'on-break' = 'off-duty';
    let reason = '';

    if (!daySchedule?.isWorkingDay) {
      status = 'off-duty';
      reason = 'Not scheduled to work today';
    } else if (timeStr < daySchedule.start || timeStr > daySchedule.end) {
      status = 'off-duty';
      reason = `Working hours are ${daySchedule.start} - ${daySchedule.end}`;
    } else if (daySchedule.breakStart && daySchedule.breakEnd && 
               timeStr >= daySchedule.breakStart && timeStr <= daySchedule.breakEnd) {
      status = 'on-break';
      reason = `On break until ${daySchedule.breakEnd}`;
    } else {
      // Check current workload from recent activity
      const oneHourAgo = new Date(checkTime.getTime() - 60 * 60 * 1000);
      const recentActivity = (staff.activity || []).filter((a: any) => 
        new Date(a.timestamp) >= oneHourAgo &&
        ['ORDER_CREATED', 'ORDER_PACKED', 'INVOICE_ISSUED'].includes(a.action)
      );

      const queueDepth = recentActivity.length;
      const maxQueue = 10; // Configurable per role

      if (queueDepth >= maxQueue) {
        status = 'busy';
        reason = `High workload (${queueDepth} recent tasks)`;
      } else {
        status = 'available';
        reason = 'Ready for assignment';
      }
    }

    // Calculate next available slot if busy/off-duty
    let nextAvailable: Date | null = null;
    if (status !== 'available') {
      if (status === 'on-break') {
        const [breakEndHour, breakEndMin] = daySchedule.breakEnd.split(':').map(Number);
        nextAvailable = new Date(checkTime);
        nextAvailable.setHours(breakEndHour, breakEndMin, 0, 0);
      } else if (status === 'off-duty' && timeStr < daySchedule.start) {
        const [startHour, startMin] = daySchedule.start.split(':').map(Number);
        nextAvailable = new Date(checkTime);
        nextAvailable.setHours(startHour, startMin, 0, 0);
      } else {
        // Tomorrow
        nextAvailable = new Date(checkTime);
        nextAvailable.setDate(nextAvailable.getDate() + 1);
        nextAvailable.setHours(9, 0, 0, 0); // Default start
      }
    }

    // Check for conflicts in activity log (meetings, etc.)
    const checkEndTime = new Date(checkTime.getTime() + duration * 60 * 1000);
    const conflictingActivities = (staff.activity || []).filter((a: any) => {
      const actTime = new Date(a.timestamp);
      return actTime >= checkTime && actTime <= checkEndTime &&
             a.action === 'MEETING_SCHEDULED'; // If you track meetings
    });

    return NextResponse.json({
      staffId: id,
      name: `${staff.firstName} ${staff.lastName}`,
      checkTime: checkTime.toISOString(),
      status,
      reason,
      schedule: {
        day: dayKey,
        workingHours: daySchedule?.isWorkingDay ? 
          `${daySchedule.start} - ${daySchedule.end}` : 'Day off',
        isWorkingDay: daySchedule?.isWorkingDay || false
      },
      workload: {
        recentTasks: (staff.activity || []).filter((a: any) => 
          new Date(a.timestamp) >= new Date(checkTime.getTime() - 24 * 60 * 60 * 1000)
        ).length,
        queueDepth: 0 // Would be calculated from assigned orders
      },
      nextAvailable: nextAvailable?.toISOString(),
      conflicts: conflictingActivities.map((a: any) => ({
        time: a.timestamp,
        description: a.details?.metadata?.description || 'Scheduled activity'
      })),
      canAcceptTask: status === 'available' && conflictingActivities.length === 0,
      suggestedSlot: nextAvailable ? {
        start: nextAvailable.toISOString(),
        end: new Date(nextAvailable.getTime() + duration * 60 * 1000).toISOString()
      } : null
    });

  } catch (error) {
    console.error('[Availability API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' }, 
      { status: 500 }
    );
  }
}
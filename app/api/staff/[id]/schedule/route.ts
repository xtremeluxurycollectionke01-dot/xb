/*import { NextRequest, NextResponse } from 'next/server';
import { Staff } from '@/models/Staff';
import { Types } from 'mongoose';
import { authenticateRequest, AuthContext, hasPermission } from '@/lib/middleware/auth';

interface RouteParams {
  params: { id: string };
}

// Helper to extract IP from request headers
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

// GET /api/staff/[id]/schedule
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const staff = await Staff.findById(id).select('schedule timezone firstName lastName').lean();
    
    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Calculate weekly hours
    let weeklyHours = 0;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
      const daySchedule = (staff.schedule as any)?.[day];
      if (daySchedule?.isWorkingDay) {
        const [startHour, startMin] = daySchedule.start.split(':').map(Number);
        const [endHour, endMin] = daySchedule.end.split(':').map(Number);
        let hours = (endHour - startHour) + (endMin - startMin) / 60;
        
        if (daySchedule.breakStart && daySchedule.breakEnd) {
          const [breakStartHour, breakStartMin] = daySchedule.breakStart.split(':').map(Number);
          const [breakEndHour, breakEndMin] = daySchedule.breakEnd.split(':').map(Number);
          hours -= (breakEndHour - breakStartHour) + (breakEndMin - breakStartMin) / 60;
        }
        
        weeklyHours += hours;
      }
    });

    return NextResponse.json({
      staffId: id,
      fullName: `${staff.firstName} ${staff.lastName}`,
      timezone: staff.timezone || 'Africa/Nairobi',
      schedule: staff.schedule,
      weeklyHours: Math.round(weeklyHours * 10) / 10,
      currentDay: days[new Date().getDay()]
    });

  } catch (error) {
    console.error('[Schedule API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' }, 
      { status: 500 }
    );
  }
}

// PATCH /api/staff/[id]/schedule
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Get current user staff record
    let currentStaff = null;
    if (auth.staffId) {
      currentStaff = await Staff.findById(new Types.ObjectId(auth.staffId));
    }
    
    // Allow self-update for own schedule, or admin update for anyone
    const isOwnProfile = currentStaff?._id.toString() === id;
    const isAdmin = (currentStaff?.hasPermission('STAFF', 'ADMIN') || hasPermission(auth, 'STAFF', 'ADMIN'));
    
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions' }, 
        { status: 403 }
      );
    }

    const body = await request.json();
    const { schedule, timezone } = body;

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule data required' }, 
        { status: 400 }
      );
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    for (const day of days) {
      const daySchedule = schedule[day];
      if (daySchedule?.isWorkingDay) {
        if (!timeRegex.test(daySchedule.start) || !timeRegex.test(daySchedule.end)) {
          return NextResponse.json(
            { error: `Invalid time format for ${day}. Use HH:MM` }, 
            { status: 400 }
          );
        }
        
        if (daySchedule.breakStart && !timeRegex.test(daySchedule.breakStart)) {
          return NextResponse.json(
            { error: `Invalid break start time for ${day}` }, 
            { status: 400 }
          );
        }
      }
    }

    const updateData: any = { schedule };
    if (timezone) updateData.timezone = timezone;

    const staff = await Staff.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Log update
    if (currentStaff) {
      const clientIp = getClientIp(request);
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      //await currentStaff.logActivity('SCHEDULE_UPDATED', 'STAFF', {
      await currentStaff.logActivity('STAFF_CREATED', 'STAFF', {
        targetId: staff._id,
        targetNumber: staff.employeeId,
        metadata: { updatedBy: isOwnProfile ? 'self' : 'admin', timezone },
        ipAddress: clientIp,
        userAgent: userAgent
      });
    }

    return NextResponse.json({
      message: 'Schedule updated successfully',
      data: {
        schedule: staff.schedule,
        timezone: staff.timezone
      }
    });

  } catch (error) {
    console.error('[Schedule Update API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update schedule' }, 
      { status: 500 }
    );
  }
}*/

// app/api/staff/[id]/schedule/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Staff } from '@/models/Staff';
import { Types } from 'mongoose';
import { authenticateRequest, hasPermission } from '@/lib/middleware/auth';

interface RouteParams {
  params: { id: string };
}

// Helper: extract client IP from headers
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIp) return realIp;

  return 'unknown';
}

// GET /api/staff/[id]/schedule
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const staff = await Staff.findById(id).select('schedule timezone firstName lastName').lean();
    if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

    // Compute weekly working hours
    let weeklyHours = 0;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach(day => {
      const daySchedule = (staff.schedule as any)?.[day];
      if (daySchedule?.isWorkingDay) {
        const [startH, startM] = daySchedule.start.split(':').map(Number);
        const [endH, endM] = daySchedule.end.split(':').map(Number);
        let hours = (endH - startH) + (endM - startM) / 60;

        if (daySchedule.breakStart && daySchedule.breakEnd) {
          const [bStartH, bStartM] = daySchedule.breakStart.split(':').map(Number);
          const [bEndH, bEndM] = daySchedule.breakEnd.split(':').map(Number);
          hours -= (bEndH - bStartH) + (bEndM - bStartM) / 60;
        }

        weeklyHours += hours;
      }
    });

    return NextResponse.json({
      staffId: id,
      fullName: `${staff.firstName} ${staff.lastName}`,
      timezone: staff.timezone || 'Africa/Nairobi',
      schedule: staff.schedule,
      weeklyHours: Math.round(weeklyHours * 10) / 10,
      currentDay: days[new Date().getDay()]
    });

  } catch (error) {
    console.error('[Schedule API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}

// PATCH /api/staff/[id]/schedule
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const currentStaff = auth.staffId ? await Staff.findById(new Types.ObjectId(auth.staffId)) : null;

    const isOwnProfile = currentStaff?._id.toString() === id;
    const isAdmin = currentStaff?.hasPermission('STAFF', 'ADMIN') || hasPermission(auth, 'STAFF', 'ADMIN');

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { schedule, timezone } = body;

    if (!schedule) return NextResponse.json({ error: 'Schedule data required' }, { status: 400 });

    // Validate HH:MM format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    for (const day of days) {
      const daySchedule = schedule[day];
      if (daySchedule?.isWorkingDay) {
        if (!timeRegex.test(daySchedule.start) || !timeRegex.test(daySchedule.end)) {
          return NextResponse.json({ error: `Invalid time format for ${day}. Use HH:MM` }, { status: 400 });
        }
        if (daySchedule.breakStart && !timeRegex.test(daySchedule.breakStart)) {
          return NextResponse.json({ error: `Invalid break start time for ${day}` }, { status: 400 });
        }
        if (daySchedule.breakEnd && !timeRegex.test(daySchedule.breakEnd)) {
          return NextResponse.json({ error: `Invalid break end time for ${day}` }, { status: 400 });
        }
      }
    }

    const updateData: any = { schedule };
    if (timezone) updateData.timezone = timezone;

    const staff = await Staff.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

    // Log activity
    if (currentStaff) {
      const clientIp = getClientIp(request);
      const userAgent = request.headers.get('user-agent') || 'unknown';

      await currentStaff.logActivity('SCHEDULE_UPDATED', 'STAFF', {
        targetId: staff._id,
        targetNumber: staff.employeeId,
        metadata: { updatedBy: isOwnProfile ? 'self' : 'admin', timezone },
        ipAddress: clientIp,
        userAgent
      });
    }

    return NextResponse.json({
      message: 'Schedule updated successfully',
      data: { schedule: staff.schedule, timezone: staff.timezone }
    });

  } catch (error) {
    console.error('[Schedule Update API] Error:', error);
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}
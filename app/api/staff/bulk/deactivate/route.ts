import { NextRequest, NextResponse } from 'next/server';
import { Staff } from '@/models/Staff';
import { Types } from 'mongoose';
import { authenticateRequest, AuthContext, hasPermission } from '@/lib/middleware/auth';

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

export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin permission - try AuthContext first, then Staff model
    let currentStaff = null;
    let hasAdminPermission = false;
    
    // Check via AuthContext permissions
    if (hasPermission(auth, 'STAFF', 'ADMIN')) {
      hasAdminPermission = true;
    }
    
    // Also verify via Staff model if staffId exists
    if (auth.staffId) {
      currentStaff = await Staff.findById(new Types.ObjectId(auth.staffId));
      if (currentStaff && currentStaff.hasPermission('STAFF', 'ADMIN')) {
        hasAdminPermission = true;
      }
    }
    
    if (!hasAdminPermission) {
      return NextResponse.json(
        { error: 'Admin permission required' }, 
        { status: 403 }
      );
    }

    const body = await request.json();
    const { staffIds, reassignTo, reason } = body;

    if (!Array.isArray(staffIds) || staffIds.length === 0) {
      return NextResponse.json(
        { error: 'staffIds array required' }, 
        { status: 400 }
      );
    }

    // Safety check: prevent deactivating last admin
    const adminCount = await Staff.countDocuments({ 
      'role.name': 'SYSTEM_ADMIN', 
      isActive: true 
    });
    
    const adminsToDeactivate = await Staff.countDocuments({
      _id: { $in: staffIds.map((id: string) => new Types.ObjectId(id)) },
      'role.name': 'SYSTEM_ADMIN',
      isActive: true
    });

    if (adminCount - adminsToDeactivate <= 0) {
      return NextResponse.json(
        { error: 'Cannot deactivate last administrator' }, 
        { status: 400 }
      );
    }

    const results = {
      deactivated: [] as any[],
      failed: [] as any[]
    };

    const clientIp = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    for (const staffId of staffIds) {
      try {
        const staff = await Staff.findById(staffId);
        if (!staff) {
          results.failed.push({ id: staffId, reason: 'Not found' });
          continue;
        }

        if (!staff.isActive) {
          results.failed.push({ id: staffId, reason: 'Already inactive' });
          continue;
        }

        staff.isActive = false;
        staff.leftAt = new Date();
        await staff.save();

        // Log deactivation
        //await staff.logActivity('STAFF_DEACTIVATED', 'STAFF', {
        await staff.logActivity('STAFF_CREATED', 'STAFF', {
          targetId: staff._id,
          targetNumber: staff.employeeId,
          previousValue: 'ACTIVE',
          newValue: 'INACTIVE',
          metadata: { reason, reassignTo, deactivatedBy: currentStaff?._id || auth.userId },
          ipAddress: clientIp,
          userAgent: userAgent
        });

        results.deactivated.push({
          id: staffId,
          name: staff.fullName,
          employeeId: staff.employeeId
        });

      } catch (error: any) {
        results.failed.push({ id: staffId, error: error.message });
      }
    }

    // Log bulk deactivation if we have a staff record
    if (currentStaff) {
      //await currentStaff.logActivity('BULK_STAFF_DEACTIVATED', 'STAFF', {
      await currentStaff.logActivity('STAFF_CREATED', 'STAFF', {
        metadata: {
          affectedCount: results.deactivated.length,
          reason,
          reassignTo
        },
        ipAddress: clientIp,
        userAgent: userAgent
      });
    }

    return NextResponse.json({
      message: 'Deactivation completed',
      summary: {
        deactivated: results.deactivated.length,
        failed: results.failed.length
      },
      details: results
    });

  } catch (error) {
    console.error('[Bulk Deactivate API] Error:', error);
    return NextResponse.json(
      { error: 'Deactivation operation failed' }, 
      { status: 500 }
    );
  }
}
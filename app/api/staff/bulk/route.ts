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

export async function POST(request: NextRequest) {
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
    const { staff: staffList, skipDuplicates = true } = body;

    if (!Array.isArray(staffList) || staffList.length === 0) {
      return NextResponse.json(
        { error: 'Staff array required' }, 
        { status: 400 }
      );
    }

    if (staffList.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 staff members per batch' }, 
        { status: 400 }
      );
    }

    const results = {
      created: [] as any[],
      skipped: [] as any[],
      failed: [] as any[]
    };

    for (const staffData of staffList) {
      try {
        const { email, employeeId, role } = staffData;

        // Check duplicates if enabled
        if (skipDuplicates) {
          const exists = await Staff.findOne({
            $or: [{ email }, { employeeId }]
          });
          
          if (exists) {
            results.skipped.push({ email, reason: 'Already exists' });
            continue;
          }
        }

        // Generate employee ID if not provided
        if (!employeeId) {
          const lastStaff = await Staff.findOne().sort({ createdAt: -1 });
          const lastNum = lastStaff ? parseInt(lastStaff.employeeId.split('-')[1]) : 0;
          staffData.employeeId = `EMP-${String(lastNum + 1).padStart(3, '0')}`;
        }

        const newStaff = await Staff.createWithRole(
          new Types.ObjectId(),
          staffData.employeeId,
          {
            firstName: staffData.firstName,
            lastName: staffData.lastName,
            email: staffData.email,
            phone: staffData.phone
          },
          role
        );

        results.created.push({
          id: newStaff._id,
          employeeId: newStaff.employeeId,
          name: `${newStaff.firstName} ${newStaff.lastName}`
        });

      } catch (error: any) {
        results.failed.push({
          data: staffData,
          error: error.message
        });
      }
    }

    // Log bulk operation if we have a staff record
    if (currentStaff) {
      const clientIp = getClientIp(request);
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      //await currentStaff.logActivity('BULK_STAFF_CREATED', 'STAFF', {
      await currentStaff.logActivity('STAFF_CREATED', 'STAFF', {
        metadata: { 
          attempted: staffList.length,
          created: results.created.length,
          skipped: results.skipped.length,
          failed: results.failed.length
        },
        ipAddress: clientIp,
        userAgent: userAgent
      });
    }

    return NextResponse.json({
      message: 'Bulk operation completed',
      summary: {
        total: staffList.length,
        created: results.created.length,
        skipped: results.skipped.length,
        failed: results.failed.length
      },
      details: results
    });

  } catch (error) {
    console.error('[Bulk Staff API] Error:', error);
    return NextResponse.json(
      { error: 'Bulk operation failed' }, 
      { status: 500 }
    );
  }
}
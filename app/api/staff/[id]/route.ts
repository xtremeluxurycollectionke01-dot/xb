import { NextRequest, NextResponse } from 'next/server';
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

// Role templates for PATCH updates
const roleTemplates: Record<string, any> = {
  'SALES_ASSOCIATE': {
    name: 'SALES_ASSOCIATE',
    displayName: 'Sales Associate',
    description: 'Creates orders, issues invoices/quotations',
    permissions: [
      { resource: 'ORDER', actions: ['CREATE', 'READ', 'UPDATE'], conditions: { maxOrderValue: 50000 } },
      { resource: 'INVOICE', actions: ['CREATE', 'READ', 'ISSUE'] },
      { resource: 'CLIENT', actions: ['CREATE', 'READ', 'UPDATE'] }
    ]
  },
  'SALES_MANAGER': {
    name: 'SALES_MANAGER',
    displayName: 'Sales Manager',
    description: 'Approves large orders, manages inventory',
    permissions: [
      { resource: 'ORDER', actions: ['CREATE', 'READ', 'UPDATE', 'APPROVE'], conditions: { maxOrderValue: 200000 } },
      { resource: 'INVOICE', actions: ['CREATE', 'READ', 'UPDATE', 'ISSUE', 'APPROVE', 'VOID'] },
      { resource: 'PRODUCT', actions: ['CREATE', 'READ', 'UPDATE'] },
      { resource: 'STOCK', actions: ['CREATE', 'READ', 'UPDATE'] }
    ]
  },
  'CASHIER': {
    name: 'CASHIER',
    displayName: 'Cashier',
    description: 'Processes payments and cash sales',
    permissions: [
      { resource: 'CASH_SALE', actions: ['CREATE', 'READ', 'ISSUE'] },
      { resource: 'INVOICE', actions: ['READ', 'UPDATE'] },
      { resource: 'REPORT', actions: ['READ', 'EXPORT'] }
    ]
  },
  'SYSTEM_ADMIN': {
    name: 'SYSTEM_ADMIN',
    displayName: 'System Administrator',
    description: 'Full system access',
    permissions: [
      { resource: 'ORDER', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE'] },
      { resource: 'STAFF', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] },
      { resource: 'REPORT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT'] }
    ]
  },
  'DELIVERY': {
    name: 'DELIVERY',
    displayName: 'Delivery Personnel',
    description: 'Field delivery operations',
    permissions: [
      { resource: 'ORDER', actions: ['READ', 'UPDATE'] },
      { resource: 'PACKAGING', actions: ['READ'] }
    ]
  },
  'VIEWER': {
    name: 'VIEWER',
    displayName: 'Read-Only Access',
    description: 'View-only access',
    permissions: [
      { resource: 'ORDER', actions: ['READ'] },
      { resource: 'INVOICE', actions: ['READ'] },
      { resource: 'REPORT', actions: ['READ'] }
    ]
  }
};

// GET /api/staff/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Check if user is requesting own profile or has admin permissions
    let currentStaff = null;
    let isOwnProfile = false;
    let isAdmin = false;
    
    if (auth.staffId) {
      currentStaff = await Staff.findById(new Types.ObjectId(auth.staffId));
      if (currentStaff) {
        isOwnProfile = currentStaff._id.toString() === id;
        isAdmin = currentStaff.hasPermission('STAFF', 'ADMIN') || hasPermission(auth, 'STAFF', 'ADMIN');
      }
    }
    
    // If not own profile and not admin, check if user is viewing their own via userId match
    if (!isOwnProfile && !isAdmin && auth.staffId) {
      const targetStaff = await Staff.findById(id);
      if (targetStaff && targetStaff.user?.toString() === auth.userId) {
        isOwnProfile = true;
      }
    }

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions' }, 
        { status: 403 }
      );
    }

    const staff = await Staff.findById(id).lean();
    
    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Add computed fields
    const enrichedStaff = {
      ...staff,
      fullName: `${staff.firstName} ${staff.lastName}`,
      initials: `${staff.firstName[0]}${staff.lastName[0]}`.toUpperCase(),
      isOnSchedule: calculateIsOnSchedule(staff.schedule),
      effectivePermissions: calculateEffectivePermissions(
        staff.role?.permissions, 
        staff.customPermissions
      )
    };

    return NextResponse.json({ data: enrichedStaff });

  } catch (error) {
    console.error('[Staff Detail API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff' }, 
      { status: 500 }
    );
  }
}

// PATCH /api/staff/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    let currentStaff = null;
    let isOwnProfile = false;
    let isAdmin = false;
    
    if (auth.staffId) {
      currentStaff = await Staff.findById(new Types.ObjectId(auth.staffId));
      if (currentStaff) {
        isOwnProfile = currentStaff._id.toString() === id;
        isAdmin = currentStaff.hasPermission('STAFF', 'ADMIN') || hasPermission(auth, 'STAFF', 'ADMIN');
      }
    }

    // Check if viewing own profile via user link
    if (!isOwnProfile && !isAdmin) {
      const targetStaff = await Staff.findById(id);
      if (targetStaff && targetStaff.user?.toString() === auth.userId) {
        isOwnProfile = true;
      }
    }

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions' }, 
        { status: 403 }
      );
    }

    const body = await request.json();
    const updateData: any = {};

    // Fields that can be updated
    const allowedFields = ['firstName', 'lastName', 'phone', 'photo', 'timezone'];
    if (isAdmin) {
      allowedFields.push('email', 'isActive', 'role');
    }

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Handle role change separately (requires full role object reconstruction)
    if (body.role && isAdmin) {
      if (roleTemplates[body.role]) {
        updateData.role = roleTemplates[body.role];
      }
    }

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
      
      //await currentStaff.logActivity('STAFF_UPDATED', 'STAFF', {
      await currentStaff.logActivity('STAFF_CREATED', 'STAFF', {
        targetId: staff._id,
        targetNumber: staff.employeeId,
        previousValue: body,
        newValue: updateData,
        metadata: { isOwnProfile, updatedBy: currentStaff._id },
        ipAddress: clientIp,
        userAgent: userAgent
      });
    }

    return NextResponse.json({
      data: {
        ...staff.toObject(),
        fullName: `${staff.firstName} ${staff.lastName}`
      },
      message: 'Staff updated successfully'
    });

  } catch (error: any) {
    console.error('[Staff Update API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Update failed' }, 
      { status: 500 }
    );
  }
}

// DELETE /api/staff/[id] - Soft delete
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let currentStaff = null;
    let isAdmin = false;
    
    if (auth.staffId) {
      currentStaff = await Staff.findById(new Types.ObjectId(auth.staffId));
      if (currentStaff) {
        isAdmin = currentStaff.hasPermission('STAFF', 'ADMIN') || hasPermission(auth, 'STAFF', 'ADMIN');
      }
    }
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin permission required' }, 
        { status: 403 }
      );
    }

    const { id } = params;
    
    // Prevent self-deletion
    if (currentStaff && currentStaff._id.toString() === id) {
      return NextResponse.json(
        { error: 'Cannot deactivate yourself' }, 
        { status: 400 }
      );
    }

    // Check if last admin
    const staffToDelete = await Staff.findById(id);
    if (staffToDelete?.role?.name === 'SYSTEM_ADMIN') {
      const adminCount = await Staff.countDocuments({ 
        'role.name': 'SYSTEM_ADMIN', 
        isActive: true 
      });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot deactivate last administrator' }, 
          { status: 400 }
        );
      }
    }

    const result = await Staff.findByIdAndUpdate(
      id,
      { $set: { isActive: false, leftAt: new Date() } },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Log deactivation
    if (currentStaff) {
      const clientIp = getClientIp(request);
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      await currentStaff.logActivity('STAFF_CREATED', 'STAFF', {
      //await currentStaff.logActivity('STAFF_DEACTIVATED', 'STAFF', {
        targetId: result._id,
        targetNumber: result.employeeId,
        previousValue: 'ACTIVE',
        newValue: 'INACTIVE',
        ipAddress: clientIp,
        userAgent: userAgent
      });
    }

    return NextResponse.json({ 
      message: 'Staff deactivated successfully',
      data: {
        ...result.toObject(),
        fullName: `${result.firstName} ${result.lastName}`
      }
    });

  } catch (error) {
    console.error('[Staff Delete API] Error:', error);
    return NextResponse.json(
      { error: 'Deactivation failed' }, 
      { status: 500 }
    );
  }
}

// Helper functions
function calculateIsOnSchedule(schedule: any): boolean {
  if (!schedule) return false;
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[now.getDay()];
  const daySchedule = schedule[today];
  
  if (!daySchedule || !daySchedule.isWorkingDay) return false;
  
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return currentTime >= daySchedule.start && currentTime <= daySchedule.end;
}

function calculateEffectivePermissions(rolePerms: any[], customPerms: any[] = []) {
  const merged = [...(rolePerms || [])];
  for (const custom of customPerms || []) {
    const existingIndex = merged.findIndex(p => p.resource === custom.resource);
    if (existingIndex >= 0) {
      merged[existingIndex] = custom;
    } else {
      merged.push(custom);
    }
  }
  return merged;
}
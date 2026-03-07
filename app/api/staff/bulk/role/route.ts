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

// Role templates (mirroring those in Staff model)
const roleTemplates: Record<string, any> = {
  'SALES_ASSOCIATE': {
    name: 'SALES_ASSOCIATE',
    displayName: 'Sales Associate',
    description: 'Creates orders, issues invoices/quotations, manages client relationships',
    permissions: [
      {
        resource: 'ORDER',
        actions: ['CREATE', 'READ', 'UPDATE'],
        conditions: { maxOrderValue: 50000, canApproveOwn: false }
      },
      {
        resource: 'INVOICE',
        actions: ['CREATE', 'READ', 'ISSUE'],
        conditions: { maxOrderValue: 50000 }
      },
      {
        resource: 'QUOTATION',
        actions: ['CREATE', 'READ', 'UPDATE', 'ISSUE']
      },
      {
        resource: 'CLIENT',
        actions: ['CREATE', 'READ', 'UPDATE']
      },
      {
        resource: 'PRICE',
        actions: ['READ', 'UPDATE'],
        conditions: { canChangePrices: true, maxDiscountPercent: 10 }
      },
      {
        resource: 'PRODUCT',
        actions: ['READ']
      },
      {
        resource: 'PACKAGING',
        actions: ['READ', 'UPDATE']
      }
    ]
  },
  'SALES_MANAGER': {
    name: 'SALES_MANAGER',
    displayName: 'Sales Manager',
    description: 'Approves large orders, manages inventory and suppliers',
    permissions: [
      {
        resource: 'ORDER',
        actions: ['CREATE', 'READ', 'UPDATE', 'APPROVE'],
        conditions: { maxOrderValue: 200000, canApproveOwn: false }
      },
      {
        resource: 'INVOICE',
        actions: ['CREATE', 'READ', 'UPDATE', 'ISSUE', 'APPROVE', 'VOID'],
        conditions: { maxOrderValue: 200000 }
      },
      {
        resource: 'PRODUCT',
        actions: ['CREATE', 'READ', 'UPDATE']
      },
      {
        resource: 'STOCK',
        actions: ['CREATE', 'READ', 'UPDATE']
      },
      {
        resource: 'PRICE',
        actions: ['READ', 'UPDATE'],
        conditions: { canChangePrices: true }
      },
      {
        resource: 'SUPPLIER',
        actions: ['CREATE', 'READ', 'UPDATE']
      }
    ]
  },
  'CASHIER': {
    name: 'CASHIER',
    displayName: 'Cashier',
    description: 'Processes immediate payments, cash sales, and financial reports',
    permissions: [
      {
        resource: 'CASH_SALE',
        actions: ['CREATE', 'READ', 'ISSUE']
      },
      {
        resource: 'INVOICE',
        actions: ['READ', 'UPDATE'],
        conditions: { canModifyLocked: true }
      },
      {
        resource: 'REPORT',
        actions: ['READ', 'EXPORT', 'CREATE']
      },
      {
        resource: 'DASHBOARD',
        actions: ['READ']
      }
    ]
  },
  'SYSTEM_ADMIN': {
    name: 'SYSTEM_ADMIN',
    displayName: 'System Administrator',
    description: 'Full system access',
    permissions: [
      {
        resource: 'ORDER',
        actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE']
      },
      {
        resource: 'INVOICE',
        actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ISSUE', 'APPROVE', 'VOID']
      },
      {
        resource: 'STAFF',
        actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN']
      },
      {
        resource: 'REPORT',
        actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT']
      }
    ]
  },
  'DELIVERY': {
    name: 'DELIVERY',
    displayName: 'Delivery Personnel',
    description: 'Field delivery, proof of delivery',
    permissions: [
      {
        resource: 'ORDER',
        actions: ['READ', 'UPDATE'],
        conditions: { allowedCategories: ['deliverable'] }
      },
      {
        resource: 'PACKAGING',
        actions: ['READ']
      }
    ]
  },
  'VIEWER': {
    name: 'VIEWER',
    displayName: 'Read-Only Access',
    description: 'View-only access for auditing',
    permissions: [
      { resource: 'ORDER', actions: ['READ'] },
      { resource: 'INVOICE', actions: ['READ'] },
      { resource: 'REPORT', actions: ['READ'] }
    ]
  }
};

export async function PATCH(request: NextRequest) {
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
    const { staffIds, newRole, reason } = body;

    if (!Array.isArray(staffIds) || staffIds.length === 0 || !newRole) {
      return NextResponse.json(
        { error: 'staffIds array and newRole required' }, 
        { status: 400 }
      );
    }

    const results = {
      updated: [] as any[],
      failed: [] as any[]
    };

    for (const staffId of staffIds) {
      try {
        const staff = await Staff.findById(staffId);
        if (!staff) {
          results.failed.push({ id: staffId, reason: 'Not found' });
          continue;
        }

        const oldRole = staff.role.name;
        
        const template = roleTemplates[newRole];
        if (!template) {
          results.failed.push({ id: staffId, reason: 'Invalid role' });
          continue;
        }

        staff.role = template;
        await staff.save();

        // Log role change
        const clientIp = getClientIp(request);
        const userAgent = request.headers.get('user-agent') || 'unknown';
        
        await staff.logActivity('PERMISSION_CHANGED', 'STAFF', {
          previousValue: oldRole,
          newValue: newRole,
          metadata: { reason, changedBy: currentStaff?._id || auth.userId },
          ipAddress: clientIp,
          userAgent: userAgent
        });

        results.updated.push({
          id: staffId,
          name: staff.fullName,
          oldRole,
          newRole
        });

      } catch (error: any) {
        results.failed.push({ id: staffId, error: error.message });
      }
    }

    // Log bulk operation if we have a staff record
    if (currentStaff) {
      const clientIp = getClientIp(request);
      const userAgent = request.headers.get('user-agent') || 'unknown';

      await currentStaff.logActivity('STAFF_CREATED', 'STAFF', {
      //await currentStaff.logActivity('BULK_ROLE_CHANGED', 'STAFF', {
        metadata: {
          affectedCount: results.updated.length,
          newRole,
          reason
        },
        ipAddress: clientIp,
        userAgent: userAgent
      });
    }

    return NextResponse.json({
      message: 'Role change completed',
      summary: {
        updated: results.updated.length,
        failed: results.failed.length
      },
      details: results
    });

  } catch (error) {
    console.error('[Bulk Role API] Error:', error);
    return NextResponse.json(
      { error: 'Role change operation failed' }, 
      { status: 500 }
    );
  }
}
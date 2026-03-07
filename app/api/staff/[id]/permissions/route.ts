/*import { NextRequest, NextResponse } from 'next/server';
import { Staff } from '@/models/Staff';
import { Types } from 'mongoose';
import { authenticateRequest, AuthContext, hasPermission as hasUserPermission } from '@/lib/middleware/auth';

interface RouteParams {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { 
      resource, 
      action, 
      context = {},
      checkAlternatives = true 
    } = body;

    if (!resource || !action) {
      return NextResponse.json(
        { error: 'Resource and action required' }, 
        { status: 400 }
      );
    }

    const staff = await Staff.findById(id);
    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Check permission with context using Staff model method
    const hasPerm = staff.hasPermission(
      resource as any, 
      action as any, 
      {
        orderValue: context.orderValue,
        isOwnWork: context.isOwnWork
      }
    );

    // Also check AuthContext permissions as fallback/enhancement
    const hasAuthPerm = hasUserPermission(auth, resource, action, {
      value: context.orderValue,
      isOwner: context.isOwnWork
    });

    const isAllowed = hasPerm || hasAuthPerm;

    const result: any = {
      allowed: isAllowed,
      staffId: id,
      resource,
      action,
      context,
      checkedBy: auth.staffId === id ? 'self' : 'other'
    };

    // If not allowed, provide detailed reason and alternatives
    if (!isAllowed) {
      const resourcePerm = staff.effectivePermissions.find((p: any) => p.resource === resource);
      
      if (!resourcePerm) {
        result.reason = 'No permissions granted for this resource';
        result.requiredRole = 'Contact administrator for access';
      } else if (!resourcePerm.actions.includes(action)) {
        result.reason = `Action '${action}' not permitted for your role`;
        result.yourActions = resourcePerm.actions;
      } else if (context.orderValue && resourcePerm.conditions?.maxOrderValue) {
        if (context.orderValue > resourcePerm.conditions.maxOrderValue) {
          result.reason = `Order value (${context.orderValue}) exceeds your limit (${resourcePerm.conditions.maxOrderValue})`;
          result.escalationPath = {
            message: 'Requires manager approval',
            approverRoles: ['SALES_MANAGER', 'SYSTEM_ADMIN'],
            alternativeAction: 'SUBMIT_FOR_APPROVAL'
          };
        }
      } else if (action === 'APPROVE' && context.isOwnWork && !resourcePerm.conditions?.canApproveOwn) {
        result.reason = 'Separation of duties: Cannot approve your own work';
        result.escalationPath = {
          message: 'Ask a colleague or manager to approve',
          approverRoles: ['SALES_MANAGER', 'SYSTEM_ADMIN', 'CASHIER']
        };
      } else {
        result.reason = 'Permission denied by policy';
      }

      // Find alternative approvers if requested
      if (checkAlternatives && result.escalationPath) {
        const approvers = await Staff.find({
          isActive: true,
          $or: result.escalationPath.approverRoles.map((role: string) => ({
            'role.name': role
          }))
        }).select('firstName lastName role.displayName').limit(5);

        result.availableApprovers = approvers.map(a => ({
          id: a._id,
          name: `${a.firstName} ${a.lastName}`,
          role: a.role.displayName
        }));
      }
    } else {
      // Get the permission details to return conditions
      const resourcePerm = staff.effectivePermissions.find((p: any) => p.resource === resource);
      result.conditions = resourcePerm?.conditions || {};
      result.grantedVia = hasPerm ? 'staff_role' : 'user_permissions';
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Permissions API] Error:', error);
    return NextResponse.json(
      { error: 'Permission check failed' }, 
      { status: 500 }
    );
  }
}*/

// app/api/staff/[id]/check-permission/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Staff } from '@/models/Staff';
import { Types } from 'mongoose';
import { authenticateRequest, hasPermission as hasUserPermission } from '@/lib/middleware/auth';

// Next.js 15+ route context - params is now a Promise
type RouteParams = { 
  params: Promise<{ id: string }> 
};

export async function POST(request: NextRequest, context: RouteParams) {
  try {
    // Await params in Next.js 15+
    const { id } = await context.params;
    
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { resource, action, context: permContext = {}, checkAlternatives = true } = body;

    if (!resource || !action) {
      return NextResponse.json(
        { error: 'Resource and action required' },
        { status: 400 }
      );
    }

    const staff = await Staff.findById(id);
    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Check permissions via Staff model
    const hasPerm = staff.hasPermission(
      resource as any,
      action as any,
      {
        orderValue: permContext.orderValue,
        isOwnWork: permContext.isOwnWork
      }
    );

    // Fallback: check AuthContext permissions
    const hasAuthPerm = hasUserPermission(auth, resource, action, {
      value: permContext.orderValue,
      isOwner: permContext.isOwnWork
    });

    const isAllowed = hasPerm || hasAuthPerm;

    const result: any = {
      allowed: isAllowed,
      staffId: id,
      resource,
      action,
      context: permContext,
      checkedBy: auth.staffId === id ? 'self' : 'other'
    };

    // If not allowed, provide detailed reason and escalation path
    if (!isAllowed) {
      const resourcePerm = staff.effectivePermissions.find((p: any) => p.resource === resource);

      if (!resourcePerm) {
        result.reason = 'No permissions granted for this resource';
        result.requiredRole = 'Contact administrator for access';
      } else if (!resourcePerm.actions.includes(action)) {
        result.reason = `Action '${action}' not permitted for your role`;
        result.yourActions = resourcePerm.actions;
      } else if (permContext.orderValue && resourcePerm.conditions?.maxOrderValue) {
        if (permContext.orderValue > resourcePerm.conditions.maxOrderValue) {
          result.reason = `Order value (${permContext.orderValue}) exceeds your limit (${resourcePerm.conditions.maxOrderValue})`;
          result.escalationPath = {
            message: 'Requires manager approval',
            approverRoles: ['SALES_MANAGER', 'SYSTEM_ADMIN'],
            alternativeAction: 'SUBMIT_FOR_APPROVAL'
          };
        }
      } else if (action === 'APPROVE' && permContext.isOwnWork && !resourcePerm.conditions?.canApproveOwn) {
        result.reason = 'Separation of duties: Cannot approve your own work';
        result.escalationPath = {
          message: 'Ask a colleague or manager to approve',
          approverRoles: ['SALES_MANAGER', 'SYSTEM_ADMIN', 'CASHIER']
        };
      } else {
        result.reason = 'Permission denied by policy';
      }

      // Optionally find alternative approvers
      if (checkAlternatives && result.escalationPath) {
        const approvers = await Staff.find({
          isActive: true,
          $or: result.escalationPath.approverRoles.map((role: string) => ({ 'role.name': role }))
        })
          .select('firstName lastName role.displayName')
          .limit(5);

        result.availableApprovers = approvers.map(a => ({
          id: a._id,
          name: `${a.firstName} ${a.lastName}`,
          role: a.role.displayName
        }));
      }
    } else {
      // Allowed: return permission details
      const resourcePerm = staff.effectivePermissions.find((p: any) => p.resource === resource);
      result.conditions = resourcePerm?.conditions || {};
      result.grantedVia = hasPerm ? 'staff_role' : 'user_permissions';
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Permissions API] Error:', error);
    return NextResponse.json({ error: 'Permission check failed' }, { status: 500 });
  }
}
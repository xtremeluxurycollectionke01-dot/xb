/**
 * Authentication Middleware for Next.js App Router
 * Validates JWT and attaches user to request
 */

/*import { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/utils/jwt';
import dbConnect from '@/lib/db/mongoose';
import { User } from '@/models/Users';

export interface AuthContext {
  userId: string;
  staffId: string;
  employeeId: string;
  role: string;
  roleLevel: number;
  permissions: any[];
  sessionId: string;
}

/**
 * Authenticate request and return user context
 *
export async function authenticateRequest(request: NextRequest): Promise<AuthContext | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  const payload = verifyAccessToken(token);
  if (!payload) return null;

  // Verify user still exists and is active
  await dbConnect();
  const user = await User.findById(payload.userId);
  
  if (!user || user.status !== 'ACTIVE') return null;
  
  // Check if session is still valid
  const session = user.sessions.find((s: any) => s.token === token && s.isActive);
  if (!session) return null;

  return {
    userId: payload.userId,
    staffId: payload.staffId,
    employeeId: payload.employeeId,
    role: payload.role,
    roleLevel: payload.roleLevel,
    permissions: user.permissions,
    sessionId: payload.sessionId
  };
}

/**
 * Check if user has required permission
 *
export function hasPermission(
  user: AuthContext,
  resource: string,
  action: string,
  context?: { value?: number; isOwner?: boolean }
): boolean {
  // Admin has all permissions
  if (user.role === 'ADMIN') return true;

  const permission = user.permissions.find((p: any) => p.resource === resource);
  if (!permission) return false;

  if (!permission.actions.includes(action) && !permission.actions.includes('ADMIN')) {
    return false;
  }

  // Check conditions
  if (permission.conditions) {
    if (permission.conditions.maxValue && context?.value) {
      if (context.value > permission.conditions.maxValue) return false;
    }
    if (permission.conditions.ownRecordsOnly && !context?.isOwner) {
      return false;
    }
  }

  return true;
}

/**
 * Require specific role level
 *
export function requireRoleLevel(user: AuthContext, minLevel: number): boolean {
  return user.roleLevel >= minLevel;
}*/

/**
 * Authentication Middleware for Next.js App Router
 * Validates JWT and attaches user to request
 */

import { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/utils/jwt';
import dbConnect from '@/lib/db/mongoose';
import { User } from '@/models/Users';

export interface AuthContext {
  userId: string;
  staffId?: string;      // Made optional - only staff users have this
  employeeId?: string;   // Made optional - only staff users have this
  clientId?: string;     // Optional - only client users have this
  role: string;
  roleLevel: number;
  permissions: any[];
  sessionId: string;
  accountType?: string;  // Optional - helpful for role checks
}

/**
 * Authenticate request and return user context
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthContext | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  const payload = verifyAccessToken(token);
  if (!payload) return null;

  // Verify user still exists and is active
  await dbConnect();
  const user = await User.findById(payload.userId);
  
  if (!user || user.status !== 'ACTIVE') return null;
  
  // Check if session is still valid
  const session = user.sessions.find((s: any) => s.token === token && s.isActive);
  if (!session) return null;

  // Build context with optional fields
  const authContext: AuthContext = {
    userId: payload.userId,
    role: payload.role,
    roleLevel: payload.roleLevel || 0,
    permissions: user.permissions || [],
    sessionId: payload.sessionId
  };

  // Only add optional fields if they exist
  if (payload.staffId) authContext.staffId = payload.staffId;
  if (payload.employeeId) authContext.employeeId = payload.employeeId;
  if (payload.clientId) authContext.clientId = payload.clientId;
  if (payload.accountType) authContext.accountType = payload.accountType;

  return authContext;
}

/**
 * Check if user has required permission
 */
export function hasPermission(
  user: AuthContext,
  resource: string,
  action: string,
  context?: { value?: number; isOwner?: boolean }
): boolean {
  // Admin has all permissions
  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return true;

  const permission = user.permissions.find((p: any) => p.resource === resource);
  if (!permission) return false;

  if (!permission.actions.includes(action) && !permission.actions.includes('ADMIN')) {
    return false;
  }

  // Check conditions
  if (permission.conditions) {
    if (permission.conditions.maxValue && context?.value) {
      if (context.value > permission.conditions.maxValue) return false;
    }
    if (permission.conditions.ownRecordsOnly && !context?.isOwner) {
      return false;
    }
  }

  return true;
}

/**
 * Require specific role level
 */
export function requireRoleLevel(user: AuthContext, minLevel: number): boolean {
  return user.roleLevel >= minLevel;
}

/**
 * Type guard: Check if authenticated user is staff
 */
export function isStaff(auth: AuthContext): boolean {
  return !!auth.staffId || auth.accountType === 'STAFF' || auth.accountType === 'ADMIN';
}

/**
 * Type guard: Check if authenticated user is client
 */
export function isClient(auth: AuthContext): boolean {
  return !!auth.clientId || auth.accountType === 'CLIENT';
}
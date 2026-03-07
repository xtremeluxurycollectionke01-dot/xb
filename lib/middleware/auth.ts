// lib/middleware/auth.ts

/**
 * Authentication Middleware for Next.js App Router
 * Validates JWT and attaches user to request context
 */

/*import { NextRequest } from 'next/server';
import { verifyAccessToken, TokenPayload } from '@/lib/utils/jwt';
import dbConnect from '@/lib/db/mongoose';
import User from '@/lib/models/User';

export interface AuthContext {
  userId: string;
  staffId: string;
  employeeId: string;
  role: string;
  roleLevel: number;
  permissions: Permission[];
  sessionId: string;
}

export interface Permission {
  resource: string;
  actions: string[];
  conditions?: {
    maxValue?: number;
    ownRecordsOnly?: boolean;
    [key: string]: any;
  };
}

/**
 * Authenticate request and return user context
 * Extracts token from Authorization header and validates it
 *
export async function authenticateRequest(request: NextRequest): Promise<AuthContext | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.log('No authorization header');
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.log('Invalid authorization header format');
      return null;
    }

    const token = parts[1];
    if (!token) {
      return null;
    }

    // Verify JWT token
    const payload = verifyAccessToken(token);
    if (!payload) {
      console.log('Invalid or expired token');
      return null;
    }

    // Verify user still exists and is active
    await dbConnect();
    const user = await User.findById(payload.userId)
      .populate('staff', 'employeeId')
      .select('+sessions');

    if (!user) {
      console.log('User not found');
      return null;
    }

    // Check account status
    if (user.status !== 'ACTIVE') {
      console.log(`User status is ${user.status}`);
      return null;
    }

    // Verify session is still valid
    const session = user.sessions.find((s: any) => 
      s.token === token && s.isActive === true
    );

    if (!session) {
      console.log('Session not found or inactive');
      return null;
    }

    // Update last used time (fire and forget)
    session.lastUsedAt = new Date();
    user.save().catch((err: any) => console.error('Failed to update session:', err));

    return {
      userId: payload.userId,
      staffId: payload.staffId,
      employeeId: payload.employeeId,
      role: payload.role,
      roleLevel: payload.roleLevel,
      permissions: user.permissions || [],
      sessionId: payload.sessionId
    };

  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Require authentication wrapper for API routes
 * Returns 401 if authentication fails
 *
export function requireAuth(handler: (req: NextRequest, auth: AuthContext) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const auth = await authenticateRequest(request);
    
    if (!auth) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(request, auth);
  };
}

/**
 * Check if user has required permission
 * Supports resource-based permissions with optional conditions
 *
export function hasPermission(
  user: AuthContext,
  resource: string,
  action: string,
  context?: { value?: number; isOwner?: boolean; [key: string]: any }
): boolean {
  // Admin has all permissions
  if (user.role === 'ADMIN') {
    return true;
  }

  // Find permission for resource
  const permission = user.permissions.find((p: Permission) => p.resource === resource);
  
  if (!permission) {
    return false;
  }

  // Check if action is allowed
  const hasAction = permission.actions.includes(action) || 
                   permission.actions.includes('ADMIN') ||
                   permission.actions.includes('*');

  if (!hasAction) {
    return false;
  }

  // Check conditions if present
  if (permission.conditions && context) {
    // Check max value limit
    if (permission.conditions.maxValue !== undefined && context.value !== undefined) {
      if (context.value > permission.conditions.maxValue) {
        return false;
      }
    }

    // Check owner-only restriction
    if (permission.conditions.ownRecordsOnly === true && context.isOwner === false) {
      return false;
    }

    // Check custom conditions
    for (const [key, conditionValue] of Object.entries(permission.conditions)) {
      if (key === 'maxValue' || key === 'ownRecordsOnly') continue;
      
      const contextValue = context[key];
      if (contextValue !== undefined && contextValue !== conditionValue) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Require specific permission
 * Returns 403 if permission check fails
 *
export function requirePermission(
  resource: string,
  action: string,
  context?: { value?: number; isOwner?: boolean }
) {
  return (handler: (req: NextRequest, auth: AuthContext) => Promise<Response>) => {
    return async (request: NextRequest): Promise<Response> => {
      const auth = await authenticateRequest(request);
      
      if (!auth) {
        return Response.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }

      if (!hasPermission(auth, resource, action, context)) {
        return Response.json(
          { success: false, error: 'Forbidden' },
          { status: 403 }
        );
      }

      return handler(request, auth);
    };
  };
}

/**
 * Check if user has minimum role level
 * Higher level = more permissions (ADMIN = 100, INTERN = 20)
 *
export function requireRoleLevel(user: AuthContext, minLevel: number): boolean {
  return user.roleLevel >= minLevel;
}

/**
 * Check if user is admin
 *
export function isAdmin(user: AuthContext): boolean {
  return user.role === 'ADMIN';
}

/**
 * Check if user is manager or above
 *
export function isManagerOrAbove(user: AuthContext): boolean {
  return user.roleLevel >= 80;
}

/**
 * Middleware to check if user owns resource or has admin permission
 *
export function isOwnerOrAdmin(resourceUserId: string, auth: AuthContext): boolean {
  return resourceUserId === auth.userId || auth.role === 'ADMIN';
}

/**
 * Get role level from role name
 *
export function getRoleLevel(role: string): number {
  const levels: Record<string, number> = {
    'ADMIN': 100,
    'SUPER_ADMIN': 120,
    'MANAGER': 80,
    'SUPERVISOR': 60,
    'SENIOR_STAFF': 50,
    'STAFF': 40,
    'JUNIOR_STAFF': 30,
    'INTERN': 20,
    'TRAINEE': 10
  };
  
  return levels[role] || 40;
}

/**
 * Extract client IP from request
 *
export function getClientIp(request: NextRequest): string {
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

/**
 * Parse user agent to get device info
 *
export function parseUserAgent(userAgent: string | null): {
  browser: string;
  os: string;
  device: string;
  isMobile: boolean;
} {
  if (!userAgent) {
    return { browser: 'Unknown', os: 'Unknown', device: 'Unknown', isMobile: false };
  }

  const ua = userAgent.toLowerCase();
  
  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';

  // Detect OS
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

  // Detect device type
  const isMobile = /mobile|android|iphone|ipad|ipod/.test(ua);
  const device = isMobile ? 'Mobile' : 'Desktop';

  return { browser, os, device, isMobile };
}

/**
 * Create middleware that combines multiple checks
 *
export function createAuthMiddleware(options: {
  requireAuth?: boolean;
  permissions?: Array<{ resource: string; action: string }>;
  minRoleLevel?: number;
  allowOwner?: boolean;
}) {
  return async (request: NextRequest, resourceUserId?: string): Promise<AuthContext | Response> => {
    const auth = await authenticateRequest(request);
    
    if (options.requireAuth !== false && !auth) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!auth) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check role level
    if (options.minRoleLevel && !requireRoleLevel(auth, options.minRoleLevel)) {
      return Response.json(
        { success: false, error: 'Insufficient privileges' },
        { status: 403 }
      );
    }

    // Check permissions
    if (options.permissions) {
      const hasAllPermissions = options.permissions.every(
        perm => hasPermission(auth, perm.resource, perm.action)
      );
      
      if (!hasAllPermissions) {
        // Check if owner exception applies
        if (options.allowOwner && resourceUserId && resourceUserId === auth.userId) {
          // Allow access as owner
        } else {
          return Response.json(
            { success: false, error: 'Forbidden' },
            { status: 403 }
          );
        }
      }
    }

    return auth;
  };
}*/

// lib/middleware/auth.ts

/**
 * Authentication Middleware for Next.js App Router
 * Validates JWT and attaches user to request context
 */

import { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/utils/jwt';
import dbConnect from '@/lib/db/mongoose';
import { User } from '@/models/Users';


export interface AuthContext {
  userId: string;
  staffId?: string;        // Optional - only for staff users
  employeeId?: string;     // Optional - only for staff users
  clientId?: string;       // Optional - only for client users
  role: string;
  roleLevel: number;
  permissions: Permission[];
  sessionId: string;
  accountType?: string;    // CLIENT | STAFF | BOTH | ADMIN
}

export interface Permission {
  resource: string;
  actions: string[];
  conditions?: {
    maxValue?: number;
    ownRecordsOnly?: boolean;
    [key: string]: any;
  };
}

/**
 * Authenticate request and return user context
 * Extracts token from Authorization header and validates it
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthContext | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.log('No authorization header');
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.log('Invalid authorization header format');
      return null;
    }

    const token = parts[1];
    if (!token) {
      return null;
    }

    // Verify JWT token
    const payload = verifyAccessToken(token);
    if (!payload) {
      console.log('Invalid or expired token');
      return null;
    }

    // Verify user still exists and is active
    await dbConnect();
    const user = await User.findById(payload.userId)
      .populate('staffProfile', 'employeeId')
      .select('+sessions');

    if (!user) {
      console.log('User not found');
      return null;
    }

    // Check account status
    if (user.status !== 'ACTIVE') {
      console.log(`User status is ${user.status}`);
      return null;
    }

    // Verify session is still valid
    //console.log('[Auth] Looking for session with token:', token.substring(0, 30) + '...');
    //console.log('[Auth] User has', user.sessions?.length || 0, 'sessions');

    // Log all active sessions for debugging
    /*if (user.sessions && user.sessions.length > 0) {
      console.log('[Auth] All sessions:', user.sessions.map((s: any) => ({
        tokenPreview: s.token ? s.token.substring(0, 30) + '...' : 'missing',
        isActive: s.isActive,
        expiresAt: s.expiresAt,
        tokenMatch: s.token === token
      })));
    }*/

    // Verify session is still valid
    /*const session = user.sessions.find((s: any) => 
      s.token === token && s.isActive === true
    );*/

    // Verify session is still valid - LOOK UP BY SESSION ID, NOT TOKEN
    const session = user.sessions.find((s: any) => 
      s.token === payload.sessionId && s.isActive === true
    );

    if (!session) {
      console.log('Session not found or inactive');
      return null;
    }

    // Update last used time (fire and forget)
    session.lastUsedAt = new Date();
    user.save().catch((err: any) => console.error('Failed to update session:', err));

    // Build auth context with optional staff/client fields
    const authContext: AuthContext = {
      userId: payload.userId,
      role: payload.role,
      roleLevel: payload.roleLevel,
      permissions: user.permissions || [],
      sessionId: payload.sessionId,
      accountType: payload.accountType
    };

    // Only add optional fields if they exist in payload
    if (payload.staffId) {
      authContext.staffId = payload.staffId;
    }
    if (payload.employeeId) {
      authContext.employeeId = payload.employeeId;
    }
    if (payload.clientId) {
      authContext.clientId = payload.clientId;
    }

    return authContext;

  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Require authentication wrapper for API routes
 * Returns 401 if authentication fails
 */
export function requireAuth(handler: (req: NextRequest, auth: AuthContext) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const auth = await authenticateRequest(request);
    
    if (!auth) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(request, auth);
  };
}

/**
 * Check if user has required permission
 * Supports resource-based permissions with optional conditions
 */
export function hasPermission(
  user: AuthContext,
  resource: string,
  action: string,
  context?: { value?: number; isOwner?: boolean; [key: string]: any }
): boolean {
  // Admin has all permissions
  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
    return true;
  }

  // Find permission for resource
  const permission = user.permissions.find((p: Permission) => p.resource === resource);
  
  if (!permission) {
    return false;
  }

  // Check if action is allowed
  const hasAction = permission.actions.includes(action) || 
                   permission.actions.includes('ADMIN') ||
                   permission.actions.includes('*');

  if (!hasAction) {
    return false;
  }

  // Check conditions if present
  if (permission.conditions && context) {
    // Check max value limit
    if (permission.conditions.maxValue !== undefined && context.value !== undefined) {
      if (context.value > permission.conditions.maxValue) {
        return false;
      }
    }

    // Check owner-only restriction
    if (permission.conditions.ownRecordsOnly === true && context.isOwner === false) {
      return false;
    }

    // Check custom conditions
    for (const [key, conditionValue] of Object.entries(permission.conditions)) {
      if (key === 'maxValue' || key === 'ownRecordsOnly') continue;
      
      const contextValue = context[key];
      if (contextValue !== undefined && contextValue !== conditionValue) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Require specific permission
 * Returns 403 if permission check fails
 */
export function requirePermission(
  resource: string,
  action: string,
  context?: { value?: number; isOwner?: boolean }
) {
  return (handler: (req: NextRequest, auth: AuthContext) => Promise<Response>) => {
    return async (request: NextRequest): Promise<Response> => {
      const auth = await authenticateRequest(request);
      
      if (!auth) {
        return Response.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }

      if (!hasPermission(auth, resource, action, context)) {
        return Response.json(
          { success: false, error: 'Forbidden' },
          { status: 403 }
        );
      }

      return handler(request, auth);
    };
  };
}

/**
 * Check if user has minimum role level
 * Higher level = more permissions (ADMIN = 100, INTERN = 20)
 */
export function requireRoleLevel(user: AuthContext, minLevel: number): boolean {
  return user.roleLevel >= minLevel;
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AuthContext): boolean {
  return user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
}

/**
 * Check if user is manager or above
 */
export function isManagerOrAbove(user: AuthContext): boolean {
  return user.roleLevel >= 80;
}

/**
 * Middleware to check if user owns resource or has admin permission
 */
export function isOwnerOrAdmin(resourceUserId: string, auth: AuthContext): boolean {
  return resourceUserId === auth.userId || auth.role === 'ADMIN' || auth.role === 'SUPER_ADMIN';
}

/**
 * Get role level from role name
 */
export function getRoleLevel(role: string): number {
  const levels: Record<string, number> = {
    'SUPER_ADMIN': 120,
    'ADMIN': 100,
    'MANAGER': 80,
    'SUPERVISOR': 60,
    'SENIOR_STAFF': 50,
    'STAFF': 40,
    'JUNIOR_STAFF': 30,
    'INTERN': 20,
    'TRAINEE': 10,
    'CLIENT': 0,
    'READONLY': 0
  };
  
  return levels[role] || 40;
}

/**
 * Extract client IP from request
 */
export function getClientIp(request: NextRequest): string {
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

/**
 * Parse user agent to get device info
 */
export function parseUserAgent(userAgent: string | null): {
  browser: string;
  os: string;
  device: string;
  isMobile: boolean;
} {
  if (!userAgent) {
    return { browser: 'Unknown', os: 'Unknown', device: 'Unknown', isMobile: false };
  }

  const ua = userAgent.toLowerCase();
  
  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';

  // Detect OS
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

  // Detect device type
  const isMobile = /mobile|android|iphone|ipad|ipod/.test(ua);
  const device = isMobile ? 'Mobile' : 'Desktop';

  return { browser, os, device, isMobile };
}

/**
 * Create middleware that combines multiple checks
 */
export function createAuthMiddleware(options: {
  requireAuth?: boolean;
  permissions?: Array<{ resource: string; action: string }>;
  minRoleLevel?: number;
  allowOwner?: boolean;
}) {
  return async (request: NextRequest, resourceUserId?: string): Promise<AuthContext | Response> => {
    const auth = await authenticateRequest(request);
    
    if (options.requireAuth !== false && !auth) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!auth) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check role level
    if (options.minRoleLevel && !requireRoleLevel(auth, options.minRoleLevel)) {
      return Response.json(
        { success: false, error: 'Insufficient privileges' },
        { status: 403 }
      );
    }

    // Check permissions
    if (options.permissions) {
      const hasAllPermissions = options.permissions.every(
        perm => hasPermission(auth, perm.resource, perm.action)
      );
      
      if (!hasAllPermissions) {
        // Check if owner exception applies
        if (options.allowOwner && resourceUserId && resourceUserId === auth.userId) {
          // Allow access as owner
        } else {
          return Response.json(
            { success: false, error: 'Forbidden' },
            { status: 403 }
          );
        }
      }
    }

    return auth;
  };
}

/**
 * Type guard to check if user is staff
 */
export function isStaffUser(auth: AuthContext): boolean {
  return !!auth.staffId || auth.accountType === 'STAFF' || auth.accountType === 'ADMIN' || auth.accountType === 'BOTH';
}

/**
 * Type guard to check if user is client
 */
export function isClientUser(auth: AuthContext): boolean {
  return !!auth.clientId || auth.accountType === 'CLIENT' || auth.accountType === 'BOTH';
}
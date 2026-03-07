// app/api/auth/profile/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { User, SecurityLog } from '@/models/Users';
import { withCORS } from '@/lib/cors/cors';
import '@/models/Staff';
import mongoose from 'mongoose';

/** Get client IP helper *
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) return cfIP;
  // @ts-ignore
  if (request.ip) return request.ip;
  return 'unknown';
}

/** Profile handler - returns complete user profile with related data *
async function profileHandler(request: NextRequest) {
  try {
    await dbConnect();
    await import('@/models/Staff');

    // Get auth token from header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // Find user by session token and populate staff
    const user = await User.findOne({
      'sessions.token': token,
      'sessions.isActive': true,
      'sessions.expiresAt': { $gt: new Date() }
    }).populate({
      path: 'staff',
      model: 'Staff',
      select: 'firstName lastName employeeId department photo phone email'
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Update session last active
    const sessionIndex = user.sessions.findIndex((s: any) => s.token === token);
    if (sessionIndex !== -1) {
      user.sessions[sessionIndex].lastActiveAt = new Date();
      await user.save();
    }

    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Get login history (last 10 entries)
    const loginHistory = user.loginHistory
      ?.slice(-10)
      .reverse()
      .map((login: any) => ({
        timestamp: login.timestamp,
        device: login.device || 'Unknown Device',
        location: login.location || 'Unknown',
        ipAddress: login.ipAddress,
        success: login.success,
        failureReason: login.failureReason,
        method: login.method
      })) || [];

    // Get active sessions
    const activeSessions = user.sessions
      ?.filter((s: any) => s.isActive && s.expiresAt > new Date())
      .map((s: any) => ({
        _id: s._id?.toString() || s.token,
        token: s.token,
        device: s.device || 'Unknown Device',
        location: s.location || 'Unknown location',
        ipAddress: s.ipAddress,
        startedAt: s.startedAt,
        lastActiveAt: s.lastActiveAt,
        expiresAt: s.expiresAt,
        isTrusted: s.isTrusted || false,
        isCurrentSession: s.token === token
      })) || [];

    // Get recent security logs for this user
    const securityLogs = await SecurityLog.find({ 
      user: user._id 
    })
    .sort({ timestamp: -1 })
    .limit(10)
    .lean();

    const formattedSecurityLogs = securityLogs.map((log: any) => ({
      _id: log._id.toString(),
      action: log.action,
      severity: log.severity,
      severityClass: log.severity.toLowerCase(),
      icon: getSecurityIcon(log.action),
      timeAgo: formatTimeAgo(log.timestamp),
      timestamp: log.timestamp,
      details: log.details || {},
      acknowledged: log.acknowledged
    }));

    // --- FIX: Type guard to check if staff is populated ---
    const isStaffPopulated = (staff: any): staff is { 
      _id: mongoose.Types.ObjectId;
      firstName: string;
      lastName: string;
      employeeId: string;
      department?: string;
      photo?: string;
      email: string;
      phone: string;
    } => {
      return staff && typeof staff === 'object' && 'firstName' in staff;
    };

    // Build complete profile response with proper type checking
    const staffData = isStaffPopulated(user.staff) ? user.staff : null;

    const profile = {
      // Basic user info
      id: user._id.toString(),
      staff: staffData ? {
        id: staffData._id?.toString(),
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        employeeId: staffData.employeeId,
        department: staffData.department,
        photo: staffData.photo,
        email: staffData.email,
        phone: staffData.phone
      } : null,
      employeeId: user.employeeId,
      email: user.email,
      phone: user.phone,
      
      // Role & permissions
      role: user.role,
      roleLevel: user.roleLevel,
      permissions: user.permissions,
      
      // Status
      status: user.status,
      
      // Security settings
      security: {
        twoFactorEnabled: user.security?.twoFactorEnabled || false,
        mustChangePassword: user.security?.mustChangePassword || false,
        lockedUntil: user.security?.lockedUntil,
        lastPasswordReset: user.security?.lastPasswordReset,
        failedLoginAttempts: user.security?.failedLoginAttempts || 0
      },
      
      // Timestamps
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
      
      // Computed fields with null checks
      displayName: staffData 
        ? `${staffData.firstName} ${staffData.lastName}`
        : user.employeeId || 'User',
      initials: staffData 
        ? `${staffData.firstName[0]}${staffData.lastName[0]}`.toUpperCase()
        : user.employeeId?.substring(0, 2)?.toUpperCase() || 'U',
      
      // Related data
      loginHistory,
      activeSessions,
      securityLogs: formattedSecurityLogs,
      
      // Stats
      activeSessionCount: activeSessions.length,
      daysToPasswordExpiry: calculateDaysToExpiry(user.security?.lastPasswordReset || user.passwordChangedAt),
      isPasswordExpired: isPasswordExpired(user.security?.lastPasswordReset || user.passwordChangedAt)
    };

    return NextResponse.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('[Profile API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load profile' },
      { status: 500 }
    );
  }
}

/** Helper: Get icon for security action *
function getSecurityIcon(action: string): string {
  const icons: Record<string, string> = {
    'LOGIN': 'fa-sign-in-alt',
    'LOGOUT': 'fa-sign-out-alt',
    'LOGIN_FAILED': 'fa-exclamation-triangle',
    'PASSWORD_CHANGE': 'fa-key',
    'PASSWORD_RESET': 'fa-undo',
    'PERMISSION_DENIED': 'fa-ban',
    'SESSION_EXPIRED': 'fa-clock',
    'SESSION_REVOKED': 'fa-trash-alt',
    'ACCOUNT_LOCKED': 'fa-lock',
    'ACCOUNT_UNLOCKED': 'fa-unlock',
    'INVITE_SENT': 'fa-envelope',
    'INVITE_ACCEPTED': 'fa-user-check',
    'ROLE_CHANGED': 'fa-user-tag',
    'PERMISSION_CHANGED': 'fa-shield-alt',
    'SUSPICIOUS_ACTIVITY': 'fa-exclamation-circle'
  };
  return icons[action] || 'fa-shield-alt';
}

/** Helper: Format time ago *
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return new Date(date).toLocaleDateString();
}

/** Helper: Calculate days to password expiry *
function calculateDaysToExpiry(lastReset: Date): number {
  if (!lastReset) return 90; // Default if never reset
  const expiryDate = new Date(new Date(lastReset).getTime() + 90 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
}

/** Helper: Check if password is expired *
function isPasswordExpired(lastReset: Date): boolean {
  if (!lastReset) return false;
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  return new Date(lastReset) < ninetyDaysAgo;
}

/** CORS wrapped exports *
export const GET = withCORS(profileHandler, 'http://127.0.0.1:5500');
export const OPTIONS = withCORS(
  async () => new Response(null, { status: 204 }),
  'http://127.0.0.1:5500'
);*/

// app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { User, SecurityLog } from '@/models/Users';
import { withCORS } from '@/lib/cors/cors';
import '@/models/Staff';
import { verifyAccessToken, extractTokenFromHeader } from '@/lib/utils/jwt';
import mongoose from 'mongoose';

// Define interfaces for better type safety
interface PopulatedStaff {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  employeeId: string;
  department?: string;
  photo?: string;
  email: string;
  phone: string;
}

interface UserWithPopulatedStaff extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  staff?: PopulatedStaff | mongoose.Types.ObjectId;
  employeeId?: string;
  email: string;
  phone?: string;
  role: string;
  roleLevel?: number;
  permissions?: any[];
  status: string;
  security?: {
    twoFactorEnabled: boolean;
    mustChangePassword: boolean;
    lockedUntil?: Date;
    lastPasswordReset?: Date;
    failedLoginAttempts: number;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  loginHistory?: any[];
  sessions?: any[];
  save(): Promise<this>;
}

/** Get client IP helper */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) return cfIP;
  // @ts-ignore
  if (request.ip) return request.ip;
  return 'unknown';
}

/** Type guard to check if staff is populated */
function isStaffPopulated(staff: any): staff is PopulatedStaff {
  return staff && typeof staff === 'object' && 'firstName' in staff && 'lastName' in staff;
}

/** Profile handler - returns complete user profile with related data */
async function profileHandler(request: NextRequest) {
  try {
    await dbConnect();
    await import('@/models/Staff');

    // Extract and verify JWT token from header
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // Verify JWT token using your existing utility
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Find user by ID from JWT payload and populate staff
    const user = await User.findById(decoded.userId)
      /*.populate({
        path: 'staff',
        model: 'Staff',
        select: 'firstName lastName employeeId department photo phone email'
      })*/
      
       // changed to match the way staff in referenced in user model 
      .populate({
        path: 'staffProfile',
        model: 'Staff',
      })
      .lean() as unknown as UserWithPopulatedStaff;

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if account is active
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: `Account is ${user.status.toLowerCase()}` },
        { status: 403 }
      );
    }

    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Update session last active if session exists (match by sessionId from JWT)
    // Since we're using lean(), we need to update separately
    if (user.sessions) {
      await User.updateOne(
        { _id: user._id, 'sessions.token': decoded.sessionId },
        { $set: { 'sessions.$.lastActiveAt': new Date() } }
      );
    }

    // Get login history (last 10 entries)
    const loginHistory = user.loginHistory
      ?.slice(-10)
      .reverse()
      .map((login: any) => ({
        timestamp: login.timestamp,
        device: login.device || 'Unknown Device',
        location: login.location || 'Unknown',
        ipAddress: login.ipAddress,
        success: login.success,
        failureReason: login.failureReason,
        method: login.method
      })) || [];

    // Get active sessions
    const activeSessions = user.sessions
      ?.filter((s: any) => s.isActive && s.expiresAt > new Date())
      .map((s: any) => ({
        _id: s._id?.toString() || s.token,
        token: s.token,
        device: s.device || 'Unknown Device',
        location: s.location || 'Unknown location',
        ipAddress: s.ipAddress,
        startedAt: s.startedAt,
        lastActiveAt: s.lastActiveAt,
        expiresAt: s.expiresAt,
        isTrusted: s.isTrusted || false,
        isCurrentSession: s.token === decoded.sessionId
      })) || [];

    // Get recent security logs for this user
    const securityLogs = await SecurityLog.find({ 
      user: user._id 
    })
    .sort({ timestamp: -1 })
    .limit(10)
    .lean();

    const formattedSecurityLogs = securityLogs.map((log: any) => ({
      _id: log._id.toString(),
      action: log.action,
      severity: log.severity,
      severityClass: log.severity.toLowerCase(),
      icon: getSecurityIcon(log.action),
      timeAgo: formatTimeAgo(log.timestamp),
      timestamp: log.timestamp,
      details: log.details || {},
      acknowledged: log.acknowledged
    }));

    // Check if staff is populated
    const staffData = isStaffPopulated(user.staff) ? user.staff : null;

    // Build complete profile response with proper type checking
    const profile = {
      // Basic user info
      id: user._id.toString(),
      staff: staffData ? {
        id: staffData._id?.toString(),
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        employeeId: staffData.employeeId,
        department: staffData.department,
        photo: staffData.photo,
        email: staffData.email,
        phone: staffData.phone
      } : null,
      employeeId: user.employeeId,
      email: user.email,
      phone: user.phone,
      
      // Role & permissions
      role: user.role,
      roleLevel: user.roleLevel,
      permissions: user.permissions,
      
      // Status
      status: user.status,
      
      // Security settings
      security: {
        twoFactorEnabled: user.security?.twoFactorEnabled || false,
        mustChangePassword: user.security?.mustChangePassword || false,
        lockedUntil: user.security?.lockedUntil,
        lastPasswordReset: user.security?.lastPasswordReset,
        failedLoginAttempts: user.security?.failedLoginAttempts || 0
      },
      
      // Timestamps
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
      
      // Computed fields with null checks
      displayName: staffData 
        ? `${staffData.firstName} ${staffData.lastName}`
        : user.employeeId || 'User',
      initials: staffData 
        ? `${staffData.firstName[0]}${staffData.lastName[0]}`.toUpperCase()
        : user.employeeId?.substring(0, 2)?.toUpperCase() || 'U',
      
      // Related data
      loginHistory,
      activeSessions,
      securityLogs: formattedSecurityLogs,
      
      // Stats
      activeSessionCount: activeSessions.length,
      //daysToPasswordExpiry: calculateDaysToExpiry(user.security?.lastPasswordReset || user.passwordChangedAt),
      //isPasswordExpired: isPasswordExpired(user.security?.lastPasswordReset || user.passwordChangedAt)
    };

    return NextResponse.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('[Profile API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load profile' },
      { status: 500 }
    );
  }
}

/** Helper: Get icon for security action */
function getSecurityIcon(action: string): string {
  const icons: Record<string, string> = {
    'LOGIN': 'fa-sign-in-alt',
    'LOGOUT': 'fa-sign-out-alt',
    'LOGIN_FAILED': 'fa-exclamation-triangle',
    'PASSWORD_CHANGE': 'fa-key',
    'PASSWORD_RESET': 'fa-undo',
    'PERMISSION_DENIED': 'fa-ban',
    'SESSION_EXPIRED': 'fa-clock',
    'SESSION_REVOKED': 'fa-trash-alt',
    'ACCOUNT_LOCKED': 'fa-lock',
    'ACCOUNT_UNLOCKED': 'fa-unlock',
    'INVITE_SENT': 'fa-envelope',
    'INVITE_ACCEPTED': 'fa-user-check',
    'ROLE_CHANGED': 'fa-user-tag',
    'PERMISSION_CHANGED': 'fa-shield-alt',
    'SUSPICIOUS_ACTIVITY': 'fa-exclamation-circle'
  };
  return icons[action] || 'fa-shield-alt';
}

/** Helper: Format time ago */
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return new Date(date).toLocaleDateString();
}

/** Helper: Calculate days to password expiry */
function calculateDaysToExpiry(lastReset: Date): number {
  if (!lastReset) return 90;
  const expiryDate = new Date(new Date(lastReset).getTime() + 90 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
}

/** Helper: Check if password is expired */
function isPasswordExpired(lastReset: Date): boolean {
  if (!lastReset) return false;
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  return new Date(lastReset) < ninetyDaysAgo;
}

/** CORS wrapped exports */
export const GET = withCORS(profileHandler, 'http://127.0.0.1:5500');
export const OPTIONS = withCORS(
  async () => new Response(null, { status: 204 }),
  'http://127.0.0.1:5500'
);
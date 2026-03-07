// app/api/auth/login/route.ts

/**
 * POST /api/auth/login
 * 
 * Authenticate user with email and password.
 * 
 * @body {
 *   email: string,
 *   password: string,
 *   rememberMe?: boolean
 * }
 * 
 * @response 200 {
 *   success: true,
 *   data: {
 *     user: { id, email, role, permissions },
 *     tokens: { accessToken, refreshToken, expiresIn },
 *     requires2FA?: boolean
 *   }
 * }
 * 
 * @response 401 { success: false, error: 'Invalid credentials' }
 * @response 403 { success: false, error: 'Account is locked/suspended' }
 */

/*import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { User } from '@/lib/models';
import { successResponse, errors } from '@/lib/utils/api-response';
import { comparePassword } from '@/lib/utils/password';
import { generateTokens } from '@/lib/utils/jwt';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password, rememberMe = false } = body;

    if (!email || !password) {
      return errors.validationError('Email and password are required');
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
      .populate('staff', 'firstName lastName employeeId');

    if (!user) {
      return errors.unauthorized();
    }

    // Check account status
    if (user.status === 'SUSPENDED') {
      return errors.forbidden('Account is suspended. Contact administrator.');
    }

    if (user.status === 'LOCKED') {
      const lockDuration = 30 * 60 * 1000; // 30 minutes
      if (user.lockedUntil && new Date() < user.lockedUntil) {
        const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
        return errors.forbidden(`Account is locked. Try again in ${minutesLeft} minutes.`);
      } else {
        user.status = 'ACTIVE';
        user.failedLoginAttempts = 0;
        user.lockedUntil = undefined;
      }
    }

    // Verify password
    const isValid = await comparePassword(password, user.passwordHash);
    
    if (!isValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      
      // Lock account after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.status = 'LOCKED';
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
        await user.save();
        
        // Log security event
        const { SecurityLog } = await import('@/lib/models/index');
        await SecurityLog.create({
          user: user._id,
          action: 'ACCOUNT_LOCKED',
          severity: 'HIGH',
          details: {
            reason: 'Too many failed login attempts',
            ipAddress: request.ip || 'unknown'
          }
        });
        
        return errors.forbidden('Account locked due to too many failed attempts. Try again in 30 minutes.');
      }
      
      await user.save();
      return errors.unauthorized();
    }

    // Check if 2FA is required
    if (user.twoFactorEnabled) {
      return successResponse({
        requires2FA: true,
        tempToken: generateTemp2FAToken(user._id.toString())
      });
    }

    // Reset failed attempts
    user.failedLoginAttempts = 0;
    user.lastLoginAt = new Date();

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      staffId: user.staff?._id?.toString() || user.staff?.toString(),
      employeeId: user.staff?.employeeId,
      role: user.role,
      roleLevel: user.roleLevel
    });

    // Save session
    const session = {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      deviceInfo: request.headers.get('user-agent') || 'unknown',
      ipAddress: request.ip || 'unknown',
      isActive: true,
      trusted: rememberMe,
      createdAt: new Date(),
      expiresAt: rememberMe ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined
    };
    
    user.sessions.push(session);
    await user.save();

    // Log security event
    const { SecurityLog } = await import('@/lib/models/index');
    await SecurityLog.create({
      user: user._id,
      action: 'LOGIN_SUCCESS',
      severity: 'INFO',
      details: {
        method: 'PASSWORD',
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent')
      }
    });

    return successResponse({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        staff: user.staff
      },
      tokens
    });

  } catch (error) {
    console.error('Login error:', error);
    return errors.serverError();
  }
}

function generateTemp2FAToken(userId: string): string {
  // Simple temporary token for 2FA flow - in production use proper JWT with short expiry
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}*/

// app/api/auth/login/route.ts

/**
 * POST /api/auth/login
 * 
 * Authenticate user with email and password.
 * 
 * @body {
 *   email: string,
 *   password: string,
 *   rememberMe?: boolean
 * }
 * 
 * @response 200 {
 *   success: true,
 *   data: {
 *     user: { id, email, role, permissions },
 *     tokens: { accessToken, refreshToken, expiresIn },
 *     requires2FA?: boolean
 *   }
 * }
 * 
 * @response 401 { success: false, error: 'Invalid credentials' }
 * @response 403 { success: false, error: 'Account is locked/suspended' }
 */

/*import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { User } from '@/lib/models';
import { successResponse, errors } from '@/lib/utils/api-response';
import { comparePassword } from '@/lib/utils/password';
import { generateTokens } from '@/lib/utils/jwt';

/**
 * Helper function to extract client IP address from request headers
 * Checks common proxy headers and falls back to 'unknown'
 *
function getClientIP(request: NextRequest): string {
  // Check for forwarded IP (common when behind proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  // Check other common headers
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;
  
  // Next.js 14+ may have ip property on request object in some environments
  // @ts-ignore - accessing potential runtime property
  if (request.ip) return request.ip;
  
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password, rememberMe = false } = body;

    if (!email || !password) {
      return errors.validationError('Email and password are required');
    }

    // Get client IP for logging
    const clientIP = getClientIP(request);

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
      .populate('staff', 'firstName lastName employeeId');

    if (!user) {
      return errors.unauthorized();
    }

    // Check account status
    if (user.status === 'SUSPENDED') {
      return errors.forbidden('Account is suspended. Contact administrator.');
    }

    if (user.status === 'LOCKED') {
      const lockDuration = 30 * 60 * 1000; // 30 minutes
      if (user.lockedUntil && new Date() < user.lockedUntil) {
        const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
        return errors.forbidden(`Account is locked. Try again in ${minutesLeft} minutes.`);
      } else {
        user.status = 'ACTIVE';
        user.failedLoginAttempts = 0;
        user.lockedUntil = undefined;
      }
    }

    // Verify password
    const isValid = await comparePassword(password, user.passwordHash);
    
    if (!isValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      
      // Lock account after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.status = 'LOCKED';
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
        await user.save();
        
        // Log security event
        const { SecurityLog } = await import('@/lib/models/index');
        await SecurityLog.create({
          user: user._id,
          action: 'ACCOUNT_LOCKED',
          severity: 'HIGH',
          details: {
            reason: 'Too many failed login attempts',
            ipAddress: clientIP
          }
        });
        
        return errors.forbidden('Account locked due to too many failed attempts. Try again in 30 minutes.');
      }
      
      await user.save();
      return errors.unauthorized();
    }

    // Check if 2FA is required
    if (user.twoFactorEnabled) {
      return successResponse({
        requires2FA: true,
        tempToken: generateTemp2FAToken(user._id.toString())
      });
    }

    // Reset failed attempts
    user.failedLoginAttempts = 0;
    user.lastLoginAt = new Date();

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      staffId: user.staff?._id?.toString() || user.staff?.toString(),
      employeeId: user.staff?.employeeId,
      role: user.role,
      roleLevel: user.roleLevel
    });

    // Save session
    const session = {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      deviceInfo: request.headers.get('user-agent') || 'unknown',
      ipAddress: clientIP,
      isActive: true,
      trusted: rememberMe,
      createdAt: new Date(),
      expiresAt: rememberMe ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined
    };
    
    user.sessions.push(session);
    await user.save();

    // Log security event
    const { SecurityLog } = await import('@/lib/models/index');
    await SecurityLog.create({
      user: user._id,
      action: 'LOGIN_SUCCESS',
      severity: 'INFO',
      details: {
        method: 'PASSWORD',
        ipAddress: clientIP,
        userAgent: request.headers.get('user-agent')
      }
    });

    return successResponse({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        staff: user.staff
      },
      tokens
    });

  } catch (error) {
    console.error('Login error:', error);
    return errors.serverError();
  }
}

function generateTemp2FAToken(userId: string): string {
  // Simple temporary token for 2FA flow - in production use proper JWT with short expiry
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}*/


// app/api/auth/login/route.ts
/*import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { User, SecurityLog } from '@/models/Users';
import { successResponse, errors } from '@/lib/utils/api-response';
import { generateTokens } from '@/lib/utils/jwt';
import { withCORS } from '@/lib/cors/cors';
import crypto from 'crypto';
import mongoose from 'mongoose';
import '@/models/Staff';

/** Helper to extract client IP *
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

/** Generate device fingerprint *
function generateDeviceFingerprint(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const ip = getClientIP(request);
  return crypto.createHash('sha256').update(`${userAgent}:${ip}`).digest('hex').substring(0, 16);
}

/** Parse device info from user agent *
function parseDeviceInfo(userAgent: string): string {
  if (!userAgent) return 'Unknown Device';
  if (userAgent.includes('Mobile')) return 'Mobile Browser';
  if (userAgent.includes('Chrome')) return 'Chrome Desktop';
  if (userAgent.includes('Firefox')) return 'Firefox Desktop';
  if (userAgent.includes('Safari')) return 'Safari Desktop';
  return 'Desktop Browser';
}

/** Generate temporary token for 2FA *
function generateTemp2FAToken(userId: string): string {
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}

/** Actual login handler *
async function loginHandler(request: NextRequest) {
  try {
    await dbConnect();
    await import('@/models/Staff')
    const body = await request.json();
    const { employeeId, password, rememberMe = false } = body;

    if (!employeeId || !password) {
      return errors.validationError('Employee ID and password are required');
    }

    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const deviceInfo = parseDeviceInfo(userAgent);
    const deviceFingerprint = generateDeviceFingerprint(request);

    // Find user by employeeId (not email in new model)
    /*const user = await User.findOne({ 
      employeeId: employeeId.toUpperCase().trim() 
    }).populate('staff', 'firstName lastName employeeId department');*

    const user = await User.findOne({ 
      employeeId: employeeId.toUpperCase().trim() 
    }).populate({
      path: 'staff',
      model: 'Staff', // Explicitly specify the model
      select: 'firstName lastName employeeId role permissions'
    });

    if (!user) {
      // Log failed attempt without user reference
      await SecurityLog.create({
        user: new mongoose.Types.ObjectId(), // Dummy ID for anonymous
        action: 'LOGIN_FAILED',
        severity: 'WARNING',
        details: {
          ipAddress: clientIP,
          device: deviceInfo,
          userAgent: userAgent,
          success: false,
          reason: 'invalid_employee_id',
          metadata: { attemptedEmployeeId: employeeId }
        }
      });
      return errors.unauthorized();
    }

    // Check account status using new model structure
    if (user.status === 'SUSPENDED') {
      await user.recordLoginAttempt(false, {
        ipAddress: clientIP,
        device: deviceInfo,
        userAgent: userAgent,
        method: 'PASSWORD',
        reason: 'account_suspended'
      });
      return errors.forbidden('Account is suspended. Contact administrator.');
    }

    if (user.status === 'LOCKED') {
      // Check if still locked using the virtual isLocked or security.lockedUntil
      if (user.security?.lockedUntil && new Date() < user.security.lockedUntil) {
        const minutesLeft = Math.ceil((user.security.lockedUntil.getTime() - Date.now()) / 60000);
        
        await SecurityLog.create({
          user: user._id,
          action: 'LOGIN_FAILED',
          severity: 'WARNING',
          details: {
            ipAddress: clientIP,
            device: deviceInfo,
            userAgent: userAgent,
            success: false,
            reason: 'account_locked',
            metadata: { lockedUntil: user.security.lockedUntil }
          }
        });
        
        return errors.forbidden(`Account is locked. Try again in ${minutesLeft} minutes.`);
      } else {
        // Auto-unlock if time has passed
        user.unlockAccount();
        await user.save();
      }
    }

    if (user.status === 'PENDING') {
      await user.recordLoginAttempt(false, {
        ipAddress: clientIP,
        device: deviceInfo,
        userAgent: userAgent,
        method: 'PASSWORD',
        reason: 'account_pending_activation'
      });
      return errors.forbidden('Account pending activation. Please check your email for invitation link.');
    }

    // Verify password using model method
    const isValid = await user.comparePassword(password);
    
    if (!isValid) {
      // Record failed attempt - this handles failed attempts counting and auto-locking
      await user.recordLoginAttempt(false, {
        ipAddress: clientIP,
        device: deviceInfo,
        userAgent: userAgent,
        method: 'PASSWORD',
        reason: 'wrong_password'
      });

      // Check if account was just locked
      if (user.status === 'LOCKED') {
        await SecurityLog.create({
          user: user._id,
          action: 'ACCOUNT_LOCKED',
          severity: 'HIGH',
          details: {
            ipAddress: clientIP,
            device: deviceInfo,
            userAgent: userAgent,
            success: false,
            reason: 'Too many failed login attempts',
            metadata: { failedAttempts: user.security?.failedLoginAttempts || 5 }
          }
        });
        
        return errors.forbidden('Account locked due to too many failed attempts. Try again in 30 minutes.');
      }

      return errors.unauthorized();
    }

    // 2FA check using new model structure
    if (user.security?.twoFactorEnabled) {
      // Record successful password but 2FA pending
      await SecurityLog.create({
        user: user._id,
        action: 'LOGIN',
        severity: 'INFO',
        details: {
          ipAddress: clientIP,
          device: deviceInfo,
          userAgent: userAgent,
          success: true,
          reason: '2fa_required'
        }
      });

      return successResponse({
        requires2FA: true,
        tempToken: generateTemp2FAToken(user._id.toString()),
        message: 'Two-factor authentication required'
      });
    }

    // Password expiry check
    if (user.security?.mustChangePassword || user.isPasswordExpired) {
      // Create session but flag for password change
      const session = await user.createSession({
        device: deviceInfo,
        ipAddress: clientIP,
        userAgent: userAgent,
        fingerprint: deviceFingerprint,
        isTrusted: rememberMe
      });

      // Record successful login
      await user.recordLoginAttempt(true, {
        ipAddress: clientIP,
        device: deviceInfo,
        userAgent: userAgent,
        method: 'PASSWORD'
      });

      await SecurityLog.create({
        user: user._id,
        action: 'LOGIN_SUCCESS',
        severity: 'INFO',
        details: {
          ipAddress: clientIP,
          device: deviceInfo,
          userAgent: userAgent,
          success: true,
          reason: 'password_expired_redirect'
        }
      });

     const userProfile = user.getPublicProfile();

      return successResponse({
        //user: user.getPublicProfile(),
              user: {
        ...userProfile,
        staff: user.staff ? {
          id: user.staff._id,
          //firstName: user.staff.firstName,
         // lastName: user.staff.lastName,
          //employeeId: user.staff.employeeId,
          //role: user.staff.role
        } : null
      },
        tokens: {
          accessToken: session.token,
          refreshToken: session.refreshToken,
          expiresIn: Math.floor((session.expiresAt.getTime() - Date.now()) / 1000)
        },
        mustChangePassword: true,
        message: 'Password expired. Please change your password.'
      });
    }

    // Create session using model method
    const session = await user.createSession({
      device: deviceInfo,
      ipAddress: clientIP,
      userAgent: userAgent,
      fingerprint: deviceFingerprint,
      isTrusted: rememberMe
    });

    // Record successful login using model method (resets failed attempts, updates lastLoginAt)
    await user.recordLoginAttempt(true, {
      ipAddress: clientIP,
      device: deviceInfo,
      userAgent: userAgent,
      method: 'PASSWORD'
    });

    // Log security event using new SecurityLog model
    await SecurityLog.create({
      user: user._id,
      action: 'LOGIN',
      severity: 'INFO',
      details: {
        ipAddress: clientIP,
        device: deviceInfo,
        location: undefined, // Could add GeoIP lookup here
        userAgent: userAgent,
        success: true,
        metadata: {
          sessionId: session.token,
          trustedDevice: rememberMe,
          role: user.role
        }
      },
      sessionId: session.token
    });

    // Generate JWT tokens with enhanced payload
    const tokens = generateTokens({
      userId: user._id.toString(),
      staffId: user.staff?._id?.toString(),
      employeeId: user.employeeId,
      role: user.role,
      roleLevel: user.roleLevel,
      sessionId: session.token
    });

    // Update session with JWT if you want to link them (optional)
    // session.token = tokens.accessToken; // If you want JWT as session token

    return successResponse({
      user: user.getPublicProfile(),
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 28800 // 8 hours
      },
      session: {
        id: session.token,
        device: session.device,
        startedAt: session.startedAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Log critical error
    try {
      await SecurityLog.create({
        user: new mongoose.Types.ObjectId(),
        action: 'LOGIN_FAILED',
        severity: 'CRITICAL',
        details: {
          ipAddress: getClientIP(request),
          success: false,
          reason: 'system_error',
          metadata: { error: (error as Error).message }
        }
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return errors.serverError();
  }
}

/** Export API route wrapped in CORS *
//export const POST = withCORS(loginHandler, 'http://127.0.0.1:5500');
//export const OPTIONS = withCORS(loginHandler, 'http://127.0.0.1:5500');

export const POST = withCORS(loginHandler, 'http://127.0.0.1:5500');
export const OPTIONS = withCORS(
  async () => new Response(null, { status: 204 }),
  'http://127.0.0.1:5500'
);*/




// app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { User, SecurityLog } from '@/models/Users';
import { successResponse, errors } from '@/lib/utils/api-response';
import { generateTokens } from '@/lib/utils/jwt';
import { withCORS } from '@/lib/cors/cors';
import crypto from 'crypto';
import mongoose from 'mongoose';
import '@/models/Staff';

/** Helper to extract client IP */
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

/** Generate device fingerprint */
function generateDeviceFingerprint(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const ip = getClientIP(request);
  return crypto.createHash('sha256').update(`${userAgent}:${ip}`).digest('hex').substring(0, 16);
}

/** Parse device info from user agent */
function parseDeviceInfo(userAgent: string): string {
  if (!userAgent) return 'Unknown Device';
  if (userAgent.includes('Mobile')) return 'Mobile Browser';
  if (userAgent.includes('Chrome')) return 'Chrome Desktop';
  if (userAgent.includes('Firefox')) return 'Firefox Desktop';
  if (userAgent.includes('Safari')) return 'Safari Desktop';
  return 'Desktop Browser';
}

/** Generate temporary token for 2FA */
function generateTemp2FAToken(userId: string): string {
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}

/** Determine login context based on account type and device */
function determineLoginContext(user: any, deviceType: string): 'CLIENT_PORTAL' | 'STAFF_DESKTOP' | 'ADMIN_PANEL' {
  if (user.accountType === 'CLIENT' && deviceType.includes('Mobile')) {
    return 'CLIENT_PORTAL';
  } else if (user.role === 'ADMIN') {
    return 'ADMIN_PANEL';
  } else if (['STAFF', 'BOTH'].includes(user.accountType)) {
    return 'STAFF_DESKTOP';
  }
  return 'STAFF_DESKTOP'; // default
}

/** Actual login handler */
async function loginHandler(request: NextRequest) {
  try {
    await dbConnect();
    await import('@/models/Staff');
    
    const body = await request.json();
    console.log('LOGIN BODY:', body);
    //const { identifier, password, rememberMe = false, deviceType = 'Desktop' } = body;
        // Support multiple field name variations
    const identifier = body.identifier || body.username || body.email || body.phone;
    const password = body.password;
    const rememberMe = body.rememberMe || false;
    const deviceType = body.deviceType || 'Desktop';

    if (!identifier || !password) {
      return errors.validationError('Identifier and password are required');
    }

    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const deviceInfo = parseDeviceInfo(userAgent);
    const deviceFingerprint = generateDeviceFingerprint(request);

    // Find user by employeeId, email, or phone (supports all login methods)
    const user = await User.findOne({ 
      $or: [
        { employeeId: identifier.toUpperCase().trim() }, // Staff login
        { email: identifier.toLowerCase().trim() },      // Email login (clients/staff)
        { phone: identifier }                             // Phone login (clients)
      ],
      deletedAt: { $exists: false } // Exclude soft-deleted users
    }).populate({
      path: 'staffProfile', // Changed from 'staff' to 'staffProfile' based on your model
      model: 'Staff',
      select: 'firstName lastName employeeId role permissions department'
    }).populate({
      path: 'clientProfile', // Also populate client profile if it exists
      model: 'Client',
      select: 'name clientNumber category'
    });

    if (!user) {
      // Log failed attempt without user reference
      await SecurityLog.create({
        user: new mongoose.Types.ObjectId(), // Dummy ID for anonymous
        action: 'LOGIN_FAILED',
        severity: 'WARNING',
        details: {
          ipAddress: clientIP,
          device: deviceInfo,
          userAgent: userAgent,
          success: false,
          reason: 'invalid_credentials',
          metadata: { attemptedIdentifier: identifier }
        }
      });
      return errors.unauthorized();
    }

    // Check account status using new model structure
    if (user.status === 'SUSPENDED') {
      await user.recordLoginAttempt(false, {
        ipAddress: clientIP,
        device: deviceInfo,
        userAgent: userAgent,
        method: 'PASSWORD',
        reason: 'account_suspended'
      });
      return errors.forbidden('Account is suspended. Contact administrator.');
    }

    if (user.status === 'LOCKED' || user.isLocked) {
      // Check if still locked using the virtual isLocked or security.lockedUntil
      if (user.security?.lockedUntil && new Date() < user.security.lockedUntil) {
        const minutesLeft = Math.ceil((user.security.lockedUntil.getTime() - Date.now()) / 60000);
        
        await SecurityLog.create({
          user: user._id,
          action: 'LOGIN_FAILED',
          severity: 'WARNING',
          details: {
            ipAddress: clientIP,
            device: deviceInfo,
            userAgent: userAgent,
            success: false,
            reason: 'account_locked',
            metadata: { lockedUntil: user.security.lockedUntil }
          }
        });
        
        return errors.forbidden(`Account is locked. Try again in ${minutesLeft} minutes.`);
      } else {
        // Auto-unlock if time has passed
        user.unlockAccount();
        await user.save();
      }
    }

    if (user.status === 'PENDING') {
      await user.recordLoginAttempt(false, {
        ipAddress: clientIP,
        device: deviceInfo,
        userAgent: userAgent,
        method: 'PASSWORD',
        reason: 'account_pending_activation'
      });
      return errors.forbidden('Account pending activation. Please check your email for invitation link.');
    }

    // Verify password using model method
    const isValid = await user.comparePassword(password);
    
    if (!isValid) {
      // Record failed attempt - this handles failed attempts counting and auto-locking
      await user.recordLoginAttempt(false, {
        ipAddress: clientIP,
        device: deviceInfo,
        userAgent: userAgent,
        method: 'PASSWORD',
        reason: 'wrong_password'
      });

      // Check if account was just locked
      if (user.status === 'LOCKED') {
        await SecurityLog.create({
          user: user._id,
          action: 'ACCOUNT_LOCKED',
          severity: 'HIGH',
          details: {
            ipAddress: clientIP,
            device: deviceInfo,
            userAgent: userAgent,
            success: false,
            reason: 'Too many failed login attempts',
            metadata: { failedAttempts: user.security?.failedLoginAttempts || 5 }
          }
        });
        
        return errors.forbidden('Account locked due to too many failed attempts. Try again in 30 minutes.');
      }

      return errors.unauthorized();
    }

    // Determine login context
    const context = determineLoginContext(user, deviceType);

    // Check if user has appropriate profile for context
    if (context === 'CLIENT_PORTAL' && !user.isClient) {
      return errors.forbidden('No client portal access available for this account');
    }
    if (context === 'STAFF_DESKTOP' && !user.isStaff && user.role !== 'ADMIN') {
      return errors.forbidden('No staff access available for this account');
    }

    // 2FA check using new model structure
    if (user.security?.twoFactorEnabled) {
      // Record successful password but 2FA pending
      await SecurityLog.create({
        user: user._id,
        action: 'LOGIN',
        severity: 'INFO',
        details: {
          ipAddress: clientIP,
          device: deviceInfo,
          userAgent: userAgent,
          success: true,
          reason: '2fa_required'
        }
      });

      return successResponse({
        requires2FA: true,
        tempToken: generateTemp2FAToken(user._id.toString()),
        message: 'Two-factor authentication required'
      });
    }

    // Create session using model method
    const session = await user.createSession({
      device: deviceInfo,
      ipAddress: clientIP,
      userAgent: userAgent,
      fingerprint: deviceFingerprint,
      isTrusted: rememberMe
    }, context);

    // Record successful login using model method (resets failed attempts, updates lastLoginAt)
    await user.recordLoginAttempt(true, {
      ipAddress: clientIP,
      device: deviceInfo,
      userAgent: userAgent,
      method: 'PASSWORD'
    });

    // Log security event using new SecurityLog model
    await SecurityLog.create({
      user: user._id,
      action: 'LOGIN',
      severity: 'INFO',
      details: {
        ipAddress: clientIP,
        device: deviceInfo,
        location: undefined, // Could add GeoIP lookup here
        userAgent: userAgent,
        success: true,
        metadata: {
          sessionId: session.token,
          trustedDevice: rememberMe,
          role: user.role,
          accountType: user.accountType,
          context
        }
      },
      sessionId: session.token
    });

    // Get user profile
    const userProfile = user.getPublicProfile();

    // Prepare staff data if exists
    const staffData = user.staffProfile ? {
      id: user.staffProfile._id,
      firstName: (user.staffProfile as any).firstName,
      lastName: (user.staffProfile as any).lastName,
      employeeId: (user.staffProfile as any).employeeId,
      role: (user.staffProfile as any).role,
      department: (user.staffProfile as any).department
    } : null;

    // Prepare client data if exists
    const clientData = user.clientProfile ? {
      id: user.clientProfile._id,
      name: (user.clientProfile as any).name,
      clientNumber: (user.clientProfile as any).clientNumber,
      category: (user.clientProfile as any).category
    } : null;

    // Check password expiry
    if (user.security?.mustChangePassword || user.isPasswordExpired) {
      return successResponse({
        user: {
          ...userProfile,
          staff: staffData,
          client: clientData
        },
        tokens: {
          accessToken: session.token,
          refreshToken: session.refreshToken,
          expiresIn: Math.floor((session.expiresAt.getTime() - Date.now()) / 1000)
        },
        session: {
          id: session.token,
          device: session.device,
          startedAt: session.startedAt,
          context: session.context
        },
        mustChangePassword: true,
        message: 'Password expired. Please change your password.',
        daysToExpiry: user.daysToPasswordExpiry
      });
    }

    // Generate JWT tokens with enhanced payload
    const tokens = generateTokens({
      userId: user._id.toString(),
      staffId: user.staffProfile?._id?.toString(),
      clientId: user.clientProfile?._id?.toString(),
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
      roleLevel: user.roleLevel,
      accountType: user.accountType,
      sessionId: session.token
    });

    // Return comprehensive response
    return successResponse({
      user: {
        ...userProfile,
        staff: staffData,
        client: clientData,
        isClient: user.isClient,
        isStaff: user.isStaff
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 28800 // 8 hours
      },
      session: {
        id: session.token,
        device: session.device,
        startedAt: session.startedAt,
        context: session.context,
        isTrusted: session.isTrusted
      },
      permissions: {
        // Include base permissions for frontend routing
        canAccessStaff: user.isStaff,
        canAccessClientPortal: user.isClient,
        role: user.role,
        accountType: user.accountType
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Log critical error
    try {
      await SecurityLog.create({
        user: new mongoose.Types.ObjectId(),
        action: 'LOGIN_FAILED',
        severity: 'CRITICAL',
        details: {
          ipAddress: getClientIP(request),
          success: false,
          reason: 'system_error',
          metadata: { error: (error as Error).message }
        }
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return errors.serverError();
  }
}

/** Export API route wrapped in CORS */
export const POST = withCORS(loginHandler, 'http://127.0.0.1:5500 ');
export const OPTIONS = withCORS(
  async () => new Response(null, { status: 204 }),
  'http://127.0.0.1:5500 '
);
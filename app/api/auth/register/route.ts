// app/api/auth/register/route.ts

/**
 * POST /api/auth/register
 * 
 * Complete staff registration using invitation token.
 * 
 * @body {
 *   token: string,
 *   password: string,
 *   confirmPassword: string,
 *   pin: string (4-6 digits),
 *   acceptedTerms: boolean
 * }
 * 
 * @response 201 {
 *   success: true,
 *   data: {
 *     user: { id, email, role, staffId },
 *     tokens: { accessToken, refreshToken, expiresIn }
 *   }
 * }
 * 
 * @response 400 { success: false, error: 'Passwords do not match' }
 * @response 404 { success: false, error: 'Invalid or expired token' }
 * @response 409 { success: false, error: 'User already exists' }
 */

/*import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { User, Invitation } from '@/lib/models';
import { IStaff } from '@/lib/models/Staff';
import { successResponse, createdResponse, errors } from '@/lib/utils/api-response';
import { hashPassword, hashPin, validatePasswordStrength } from '@/lib/utils/password';
import { generateTokens } from '@/lib/utils/jwt';

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

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { token, password, confirmPassword, pin, acceptedTerms } = body;

    // Validation
    if (!token || !password || !confirmPassword || !pin) {
      return errors.validationError('All fields are required');
    }

    if (password !== confirmPassword) {
      return errors.validationError('Passwords do not match');
    }

    if (!acceptedTerms) {
      return errors.validationError('You must accept the terms and conditions');
    }

    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.valid) {
      return errors.validationError(passwordCheck.message!);
    }

    if (!/^\d{4,6}$/.test(pin)) {
      return errors.validationError('PIN must be 4-6 digits');
    }

    // Validate invitation
    const invitation = await Invitation.findOne({ token })
      .populate('staff');

    if (!invitation || invitation.status !== 'PENDING') {
      return errors.notFound('Invalid or expired invitation');
    }

    if (new Date() > invitation.expiresAt) {
      invitation.status = 'EXPIRED';
      await invitation.save();
      return errorResponse('Invitation has expired', 410);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ staff: invitation.staff._id });
    if (existingUser) {
      return errors.conflict('User already registered for this staff member');
    }

    // Hash credentials
    const passwordHash = await hashPassword(password);
    const pinHash = await hashPin(pin);

    // Get staff details
    const staff = invitation.staff as any;

    // Create user
    const user = await User.create({
      staff: staff._id,
      email: invitation.email.toLowerCase(),
      passwordHash,
      pinHash,
      role: staff.role,
      roleLevel: staff.roleLevel,
      status: 'ACTIVE',
      permissions: staff.defaultPermissions || [],
      acceptedTermsAt: new Date(),
      registeredAt: new Date(),
      sessions: []
    });

    // Mark invitation as accepted
    invitation.status = 'ACCEPTED';
    invitation.acceptedAt = new Date();
    invitation.acceptedBy = user._id;
    await invitation.save();

    // Update staff with user reference
    await staff.findByIdAndUpdate(staff._id, {
      user: user._id,
      status: 'ACTIVE'
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      staffId: staff._id.toString(),
      employeeId: staff.employeeId,
      role: user.role,
      roleLevel: user.roleLevel
    });

    // Save session
    user.sessions.push({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      deviceInfo: request.headers.get('user-agent') || 'unknown',
      ipAddress: request.ip || 'unknown',
      isActive: true,
      trusted: false,
      createdAt: new Date()
    });
    await user.save();

    // Log security event
    const { SecurityLog } = await import('@/lib/models/index');
    await SecurityLog.create({
      user: user._id,
      action: 'USER_REGISTERED',
      severity: 'INFO',
      details: {
        invitationId: invitation._id,
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent')
      }
    });

    return createdResponse({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        staffId: staff._id,
        employeeId: staff.employeeId
      },
      tokens
    }, 'Registration completed successfully');

  } catch (error) {
    console.error('Registration error:', error);
    return errors.serverError();
  }
}

function errorResponse(message: string, status: number) {
  return Response.json({ success: false, error: message }, { status });
}*/

// app/api/auth/register/route.ts
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { User, Invitation, SecurityLog } from '@/lib/models';
import { successResponse, createdResponse, errors } from '@/lib/utils/api-response';
import { hashPassword, hashPin, validatePasswordStrength } from '@/lib/utils/password';
import { generateTokens } from '@/lib/utils/jwt';
import { withCORS } from '@/lib/cors/cors';
import crypto from 'crypto';
import mongoose from 'mongoose';

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

/** Main registration handler */
async function registerHandler(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { token, password, confirmPassword, pin, acceptedTerms } = body;

    // Validation
    if (!token || !password || !confirmPassword || !pin) {
      return errors.validationError('All fields are required');
    }

    if (password !== confirmPassword) {
      return errors.validationError('Passwords do not match');
    }

    if (!acceptedTerms) {
      return errors.validationError('You must accept the terms and conditions');
    }

    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.valid) {
      return errors.validationError(passwordCheck.message!);
    }

    if (!/^\d{4,6}$/.test(pin)) {
      return errors.validationError('PIN must be 4-6 digits');
    }

    // Validate invitation
    const invitation = await Invitation.findOne({ token }).populate('staff');
    if (!invitation || invitation.status !== 'PENDING') {
      return errors.notFound('Invalid or expired invitation');
    }

    if (new Date() > invitation.expiresAt) {
      invitation.status = 'EXPIRED';
      await invitation.save();
      return errors.notFound('Invitation has expired');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ staff: invitation.staff._id });
    if (existingUser) {
      return errors.conflict('User already registered for this staff member');
    }

    // Hash credentials
    const passwordHash = await hashPassword(password);
    const pinHash = await hashPin(pin);

    // Staff details
    const staff = invitation.staff as any;

    // Create user
    const user = await User.create({
      staff: staff._id,
      email: invitation.email.toLowerCase(),
      passwordHash,
      pinHash,
      role: staff.role,
      roleLevel: staff.roleLevel,
      status: 'ACTIVE',
      permissions: staff.defaultPermissions || [],
      acceptedTermsAt: new Date(),
      registeredAt: new Date(),
      sessions: []
    });

    // Mark invitation as accepted
    invitation.status = 'ACCEPTED';
    invitation.acceptedAt = new Date();
    invitation.acceptedBy = user._id;
    await invitation.save();

    // Update staff reference
    await staff.findByIdAndUpdate(staff._id, { user: user._id, status: 'ACTIVE' });

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      staffId: staff._id.toString(),
      employeeId: staff.employeeId,
      role: user.role,
      roleLevel: user.roleLevel,
      accountType: ''
    });

    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const deviceInfo = parseDeviceInfo(userAgent);
    const deviceFingerprint = generateDeviceFingerprint(request);

    // Save session
    user.sessions.push({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      deviceInfo,
      ipAddress: clientIP,
      isActive: true,
      trusted: false,
      createdAt: new Date()
    });
    await user.save();

    // Log security event
    await SecurityLog.create({
      user: user._id,
      action: 'USER_REGISTERED',
      severity: 'INFO',
      details: {
        invitationId: invitation._id,
        ipAddress: clientIP,
        userAgent,
        device: deviceInfo
      }
    });

    return createdResponse(
      {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          staffId: staff._id,
          employeeId: staff.employeeId
        },
        tokens
      },
      'Registration completed successfully'
    );
  } catch (error) {
    console.error('Registration error:', error);
    try {
      await SecurityLog.create({
        user: new mongoose.Types.ObjectId(),
        action: 'USER_REGISTER_FAILED',
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
export const POST = withCORS(registerHandler, 'http://127.0.0.1:5500');
export const OPTIONS = withCORS(
  async () => new Response(null, { status: 204 }),
  'http://127.0.0.1:5500'
);
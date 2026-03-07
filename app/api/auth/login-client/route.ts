import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import { User, SecurityLog } from '@/models/Users';
import Client from '@/models/Clients';

interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export async function POST(req: NextRequest) {
  console.log('[LOGIN] Starting login process...');
  
  try {
    await dbConnect();
    const body: LoginInput = await req.json();
    const { email, password, rememberMe = false } = body;

    console.log(`[LOGIN] Attempt for email: ${email}`);

    // Validate input
    if (!email || !password) {
      console.warn('[LOGIN] Missing credentials');
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail })
      .populate('clientProfile', 'name clientNumber category')
      .populate('staffProfile', 'firstName lastName employeeId');

    if (!user) {
      console.warn(`[LOGIN] User not found: ${normalizedEmail}`);
      
      // Log failed attempt (no user found)
      await SecurityLog.create({
        user: new mongoose.Types.ObjectId(), // Placeholder
        action: 'LOGIN_FAILED',
        severity: 'WARNING',
        details: {
          ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          success: false,
          reason: 'User not found',
          metadata: { email: normalizedEmail }
        }
      });

      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.isLocked) {
      console.warn(`[LOGIN] Account locked: ${user._id}`);
      
      await SecurityLog.create({
        user: user._id,
        action: 'ACCOUNT_LOCKED',
        severity: 'WARNING',
        details: {
          ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          success: false,
          reason: 'Account locked due to too many failed attempts',
          metadata: { lockedUntil: user.security.lockedUntil }
        }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: 'Account temporarily locked. Please try again later or reset your password.',
          lockedUntil: user.security.lockedUntil 
        },
        { status: 403 }
      );
    }

    // Check if account is active
    if (user.status !== 'ACTIVE') {
      console.warn(`[LOGIN] Account not active: ${user._id}, status: ${user.status}`);
      
      await SecurityLog.create({
        user: user._id,
        action: 'LOGIN_FAILED',
        severity: 'WARNING',
        details: {
          ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          success: false,
          reason: `Account ${user.status.toLowerCase()}`
        }
      });

      return NextResponse.json(
        { success: false, error: `Account is ${user.status.toLowerCase()}. Please contact support.` },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      console.warn(`[LOGIN] Invalid password for user: ${user._id}`);
      
      // Record failed attempt
      await user.recordLoginAttempt(false, {
        ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        device: req.headers.get('sec-ch-ua-platform') || 'Unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        method: 'PASSWORD',
        reason: 'Invalid password'
      });

      await SecurityLog.create({
        user: user._id,
        action: 'LOGIN_FAILED',
        severity: 'WARNING',
        details: {
          ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          success: false,
          reason: 'Invalid password',
          metadata: { attemptCount: user.security.failedLoginAttempts + 1 }
        }
      });

      const attemptsLeft = 5 - (user.security.failedLoginAttempts + 1);
      const errorMessage = attemptsLeft > 0 
        ? `Invalid password. ${attemptsLeft} attempt(s) left before account lock.`
        : 'Invalid password. Account will be locked after this attempt.';

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 401 }
      );
    }

    console.log(`[LOGIN] Password verified for user: ${user._id}`);

    // Check if password change required
    if (user.security.mustChangePassword) {
      console.log(`[LOGIN] Password change required for user: ${user._id}`);
      
      // Record successful login but flag password change
      await user.recordLoginAttempt(true, {
        ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        device: req.headers.get('sec-ch-ua-platform') || 'Unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        method: 'PASSWORD'
      });

      // Create session with limited access
      const session = await user.createSession(
        {
          device: req.headers.get('sec-ch-ua-platform') || 'Unknown',
          ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          fingerprint: req.headers.get('x-device-fingerprint') || 'web-default',
          isTrusted: rememberMe
        },
        user.accountType === 'CLIENT' ? 'CLIENT_PORTAL' : 'STAFF_DESKTOP'
      );

      // Get client data if available
      const client = user.clientProfile ? await Client.findById(user.clientProfile) : null;

      // Prepare user response (limited due to password change requirement)
      const userResponse = {
        id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        name: client?.name || user.email.split('@')[0],
        role: user.role,
        accountType: user.accountType,
        clientId: client?._id.toString(),
        clientNumber: client?.clientNumber,
        mustChangePassword: true
      };

      await SecurityLog.create({
        user: user._id,
        action: 'LOGIN',
        severity: 'INFO',
        details: {
          ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          success: true,
          metadata: { passwordChangeRequired: true }
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Login successful. Password change required.',
        data: {
          user: userResponse,
          client: client ? {
            id: client._id.toString(),
            clientNumber: client.clientNumber,
            name: client.name,
            category: client.category
          } : null,
          session: {
            token: session.token,
            refreshToken: session.refreshToken,
            expiresAt: session.expiresAt
          },
          requiresPasswordChange: true
        }
      });
    }

    // Record successful login
    await user.recordLoginAttempt(true, {
      ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
      device: req.headers.get('sec-ch-ua-platform') || 'Unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      method: 'PASSWORD'
    });

    // Create new session
    const session = await user.createSession(
      {
        device: req.headers.get('sec-ch-ua-platform') || 'Unknown',
        ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        fingerprint: req.headers.get('x-device-fingerprint') || 'web-default',
        isTrusted: rememberMe
      },
      user.accountType === 'CLIENT' ? 'CLIENT_PORTAL' : 'STAFF_DESKTOP'
    );

    console.log(`[LOGIN] Session created for user: ${user._id}`);

    // Get client data
    const client = user.clientProfile ? await Client.findById(user.clientProfile) : null;

    // Prepare user response
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      name: client?.name || user.email.split('@')[0],
      role: user.role,
      accountType: user.accountType,
      clientId: client?._id.toString(),
      clientNumber: client?.clientNumber,
      mustChangePassword: false
    };

    // Log successful login
    await SecurityLog.create({
      user: user._id,
      action: 'LOGIN',
      severity: 'INFO',
      details: {
        ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        success: true,
        sessionId: session.token.substring(0, 8) + '...',
        metadata: { rememberMe }
      }
    });

    console.log(`[LOGIN] Login successful for user: ${user._id}`);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        client: client ? {
          id: client._id.toString(),
          clientNumber: client.clientNumber,
          name: client.name,
          category: client.category
        } : null,
        session: {
          token: session.token,
          refreshToken: session.refreshToken,
          expiresAt: session.expiresAt
        }
      }
    });

  } catch (error: any) {
    console.error('[LOGIN ERROR]', error);

    // Log server error
    try {
      await SecurityLog.create({
        user: new mongoose.Types.ObjectId(),
        action: 'LOGIN_FAILED',
        severity: 'CRITICAL',
        details: {
          ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          success: false,
          reason: 'Server error',
          metadata: { error: error.message }
        }
      });
    } catch (logError) {
      console.error('[LOGIN] Failed to log error:', logError);
    }

    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
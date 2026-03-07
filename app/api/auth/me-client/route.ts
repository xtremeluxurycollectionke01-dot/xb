import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import { User, SecurityLog } from '@/models/Users';
import '@/models/Clients'

export async function GET(req: NextRequest) {
  console.log('[GET /me] Fetching current user...');

  try {
    await dbConnect();

    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[GET /me] No authorization token provided');
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // Find user by session token
    const user = await User.findOne({
      'sessions.token': token,
      'sessions.isActive': true,
      'sessions.expiresAt': { $gt: new Date() }
    }).populate('clientProfile').populate('staffProfile');

    if (!user) {
      console.log('[GET /me] Invalid or expired session token');
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Update session last active
    const session = user.sessions.find((s: any) => s.token === token);
    if (session) {
      session.lastActiveAt = new Date();
      await user.save();
    }

    // Get client data if available
    const client = user.clientProfile;

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
      mustChangePassword: user.security.mustChangePassword
    };

    console.log(`[GET /me] User found: ${user._id}`);

    return NextResponse.json({
      success: true,
      data: {
        user: userResponse,
        client: client ? {
          id: client._id.toString(),
          clientNumber: client.clientNumber,
          name: client.name,
          category: client.category,
          account: client.account,
          flags: client.flags
        } : null
      }
    });

  } catch (error: any) {
    console.error('[GET /me ERROR]', error);

    // Log security event
    try {
      await SecurityLog.create({
        user: new mongoose.Types.ObjectId(),
        action: 'SESSION_VALIDATION_FAILED',
        severity: 'WARNING',
        details: {
          ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          success: false,
          reason: 'Server error',
          metadata: { error: error.message }
        }
      });
    } catch (logError) {
      console.error('[GET /me] Failed to log error:', logError);
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
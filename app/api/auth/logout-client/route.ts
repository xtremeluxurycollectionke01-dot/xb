import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import { User, SecurityLog } from '@/models/Users';

export async function POST(req: NextRequest) {
  console.log('[LOGOUT] Processing logout request...');

  try {
    await dbConnect();

    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[LOGOUT] No authorization token provided');
      return NextResponse.json(
        { success: true, message: 'Logged out' } // Still return success even if no token
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // Find user by session token
    const user = await User.findOne({
      'sessions.token': token,
      'sessions.isActive': true
    });

    if (!user) {
      console.log('[LOGOUT] No active session found for token');
      return NextResponse.json(
        { success: true, message: 'Logged out' }
      );
    }

    // Revoke the specific session
    await user.revokeSession(token);

    // Log logout
    await SecurityLog.create({
      user: user._id,
      action: 'LOGOUT',
      severity: 'INFO',
      details: {
        ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        success: true,
        sessionId: token.substring(0, 8) + '...',
        metadata: { logoutType: 'explicit' }
      }
    });

    console.log(`[LOGOUT] User ${user._id} logged out successfully`);

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error: any) {
    console.error('[LOGOUT ERROR]', error);

    // Try to log error
    try {
      await SecurityLog.create({
        user: new mongoose.Types.ObjectId(),
        action: 'LOGOUT_FAILED',
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
      console.error('[LOGOUT] Failed to log error:', logError);
    }

    // Still return success to client to clear local storage
    return NextResponse.json(
      { success: true, message: 'Logged out' }
    );
  }
}

// Also handle GET for logout (useful for logout links)
export async function GET(req: NextRequest) {
  return POST(req);
}
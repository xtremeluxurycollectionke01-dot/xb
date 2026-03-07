// app/api/auth/sessions/revoke-others/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { User, SecurityLog } from '@/models/Users';
import { withCORS } from '@/lib/cors/cors';
import '@/models/Staff';

async function revokeHandler(request: NextRequest) {
  try {
    await dbConnect();
    
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentSessionToken } = body;

    const user = await User.findOne({
      'sessions.token': token,
      'sessions.isActive': true
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Revoke all sessions except current
    let revokedCount = 0;
    user.sessions.forEach((session: any) => {
      if (session.token !== currentSessionToken && session.isActive) {
        session.isActive = false;
        revokedCount++;
      }
    });

    await user.save();

    // Log security event
    await SecurityLog.create({
      user: user._id,
      action: 'SESSION_REVOKED',
      severity: 'INFO',
      details: {
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        device: 'Web Interface',
        success: true,
        metadata: { revokedCount, reason: 'user_requested_revoke_others' }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Revoked ${revokedCount} session(s)`,
      revokedCount
    });

  } catch (error) {
    console.error('Revoke sessions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revoke sessions' },
      { status: 500 }
    );
  }
}

export const POST = withCORS(revokeHandler, 'http://127.0.0.1:5500');
export const OPTIONS = withCORS(
  async () => new Response(null, { status: 204 }),
  'http://127.0.0.1:5500'
);*/

// app/api/auth/sessions/revoke-others/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { User, SecurityLog } from '@/models/Users';
import { withCORS } from '@/lib/cors/cors';
import '@/models/Staff';
import { verifyAccessToken, extractTokenFromHeader } from '@/lib/utils/jwt';

async function revokeHandler(request: NextRequest) {
  try {
    await dbConnect();
    
    // Extract and verify JWT token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentSessionToken } = body;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Revoke all sessions except current (match by sessionId from JWT)
    let revokedCount = 0;
    user.sessions.forEach((session: any) => {
      if (session.token !== decoded.sessionId && session.isActive) {
        session.isActive = false;
        revokedCount++;
      }
    });

    await user.save();

    // Log security event
    await SecurityLog.create({
      user: user._id,
      action: 'SESSION_REVOKED',
      severity: 'INFO',
      details: {
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        device: 'Web Interface',
        success: true,
        metadata: { revokedCount, reason: 'user_requested_revoke_others' }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Revoked ${revokedCount} session(s)`,
      revokedCount
    });

  } catch (error) {
    console.error('Revoke sessions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revoke sessions' },
      { status: 500 }
    );
  }
}

export const POST = withCORS(revokeHandler, 'http://127.0.0.1:5500');
export const OPTIONS = withCORS(
  async () => new Response(null, { status: 204 }),
  'http://127.0.0.1:5500'
);
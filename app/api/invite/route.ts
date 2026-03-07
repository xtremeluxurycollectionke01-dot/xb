// app/api/auth/invite/route.ts

/**
 * POST /api/auth/invite
 * 
 * Invite a new staff member to the system.
 * Creates a pending invitation that expires in 48 hours.
 * 
 * @access Admin, Manager (with STAFF_CREATE permission)
 * 
 * @body {
 *   staffId: string - Existing staff record ID
 *   email: string - Work email address
 *   phone: string - Mobile number for SMS
 *   role?: string - Override staff role (optional)
 *   sendVia: ('SMS' | 'EMAIL')[]
 *   message?: string - Custom invitation message
 * }
 * 
 * @response 201 {
 *   success: true,
 *   data: {
 *     invitationId: string,
 *     token: string,
 *     expiresAt: Date,
 *     sentVia: string[]
 *   }
 * }
 * 
 * @response 403 { success: false, error: 'Insufficient permissions' }
 * @response 404 { success: false, error: 'Staff not found' }
 * @response 409 { success: false, error: 'User already exists for this staff' }
 */

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { User, Invitation } from '@/lib/models/index';
import { Staff } from '@/models/Staff';
import { authenticateRequest, hasPermission } from '@/lib/middleware/auth';
import { successResponse, createdResponse, errors } from '@/lib/utils/api-response';
import { generateSecureToken } from '@/lib/utils/password';
import { sendSMS, sendEmail } from '@/lib/services/notifications';

/** Helper to extract client IP */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;

  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) return cfIP;

  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Authenticate request
    const auth = await authenticateRequest(request);
    if (!auth) {
      return errors.unauthorized();
    }

    // Check permission
    if (!hasPermission(auth, 'STAFF', 'CREATE')) {
      return errors.forbidden();
    }

    // Parse body
    const body = await request.json();
    const { staffId, email, phone, role, sendVia = ['SMS', 'EMAIL'], message } = body;

    // Validate required fields
    if (!staffId || !email || !phone) {
      return errors.validationError('staffId, email, and phone are required');
    }

    // Verify staff exists
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return errors.notFound('Staff');
    }

    // Check if user already exists for this staff
    const existingUser = await User.findOne({ staff: staffId });
    if (existingUser) {
      return errors.conflict('User already exists for this staff member');
    }

    // Check if pending invitation exists
    const existingInvite = await Invitation.findOne({
      staff: staffId,
      status: 'PENDING'
    });

    if (existingInvite) {
      return errors.conflict('Pending invitation already exists. Resend or revoke it first.');
    }

    // Generate secure token
    const token = generateSecureToken(32);

    // Create invitation
    const invitation = await Invitation.create({
      invitedBy: auth.userId,
      staff: staffId,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      token,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
      status: 'PENDING'
    });

    // Send notifications
    const sentVia: string[] = [];
    
    if (sendVia.includes('SMS')) {
      try {
        await sendSMS(phone, `
You've been invited to Malex Business Manager.
Complete registration: ${process.env.NEXT_PUBLIC_APP_URL}/register?token=${token}
Token: ${token.slice(0, 8)}
Expires in 48 hours.
        `.trim());
        sentVia.push('SMS');
      } catch (error) {
        console.error('SMS sending failed:', error);
      }
    }

    if (sendVia.includes('EMAIL')) {
      try {
        await sendEmail({
          to: email,
          subject: 'Welcome to Malex - Complete Your Registration',
          html: `
            <h2>Welcome to Malex Business Manager</h2>
            <p>You've been invited to join as <strong>${staff.role}</strong>.</p>
            <p>Click below to complete your registration:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/register?token=${token}" 
               style="padding: 12px 24px; background: #bf2c7e; color: white; text-decoration: none; border-radius: 4px;">
              Complete Registration
            </a>
            <p>Or enter this token manually: <code>${token}</code></p>
            <p>This invitation expires on ${invitation.expiresAt.toLocaleString()}.</p>
            ${message ? `<p><em>${message}</em></p>` : ''}
          `
        });
        sentVia.push('EMAIL');
      } catch (error) {
        console.error('Email sending failed:', error);
      }
    }

    // Log security event
    const { SecurityLog } = await import('@/lib/models/index');
    await SecurityLog.create({
      user: auth.userId,
      action: 'INVITE_SENT',
      severity: 'INFO',
      details: {
        invitedStaff: staffId,
        invitationId: invitation._id,
        sentVia,
        ipAddress: getClientIP(request),
        success: true
      }
    });

    return createdResponse({
      invitationId: invitation._id,
      token: process.env.NODE_ENV === 'development' ? token : undefined, // Only show in dev
      expiresAt: invitation.expiresAt,
      sentVia
    }, 'Invitation sent successfully');

  } catch (error) {
    console.error('Invite error:', error);
    return errors.serverError();
  }
}
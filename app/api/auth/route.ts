// app/api/auth/users/route.ts

/**
 * GET /api/auth/users
 * 
 * List all users with filtering and pagination.
 * 
 * @access Admin, Manager (with STAFF_READ permission)
 * 
 * @query {
 *   role?: string,
 *   status?: 'ACTIVE' | 'SUSPENDED' | 'LOCKED',
 *   search?: string,
 *   page?: number,
 *   limit?: number
 * }
 * 
 * @response 200 {
 *   success: true,
 *   data: User[],
 *   meta: { page, limit, total, pages }
 * }
 */

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { User } from '@/lib/models/index';
import { authenticateRequest, hasPermission } from '@/lib/middleware/auth';
import { successResponse, errors } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const auth = await authenticateRequest(request);
    if (!auth) {
      return errors.unauthorized();
    }

    if (!hasPermission(auth, 'STAFF', 'READ')) {
      return errors.forbidden();
    }

    const { searchParams } = new URL(request.url);
    
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    // Build query
    const query: any = {};
    
    if (role) query.role = role;
    if (status) query.status = status;
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { 'staff.firstName': { $regex: search, $options: 'i' } },
        { 'staff.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    // Managers can only see users with lower role levels
    if (auth.role === 'MANAGER') {
      query.roleLevel = { $lt: auth.roleLevel };
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .populate('staff', 'firstName lastName employeeId department')
        .select('-passwordHash -pinHash -twoFactorSecret -sessions -passwordResetToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query)
    ]);

    return successResponse(users, undefined, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('List users error:', error);
    return errors.serverError();
  }
}
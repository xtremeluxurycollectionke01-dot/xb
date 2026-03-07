/*import { NextRequest, NextResponse } from 'next/server';
import { Staff } from '@/models/Staff';
import { Types } from 'mongoose';
import { authenticateRequest, AuthContext, hasPermission } from '@/lib/middleware/auth';

// Helper to extract IP from request headers
function getClientIp(request: NextRequest): string {
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

// Helper to check staff permissions
async function checkStaffPermission(auth: AuthContext, resource: string, action: string) {
  // Ensure user has a staff profile
  if (!auth.staffId) {
    return { allowed: false, staff: null };
  }
  
  const staff = await Staff.findById(new Types.ObjectId(auth.staffId));
  if (!staff || !staff.isActive) {
    return { allowed: false, staff: null };
  }
  
  // Check permissions via Staff model (maintains original behavior)
  // Also check AuthContext permissions as fallback
  const hasStaffPerm = staff.hasPermission(resource as any, action as any);
  const hasUserPerm = hasPermission(auth, resource, action);
  
  return { allowed: hasStaffPerm || hasUserPerm, staff };
}

// GET /api/staff - List all staff with filtering
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { allowed, staff: currentStaff } = await checkStaffPermission(auth, 'STAFF', 'READ');
    if (!allowed) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    
    // Build query
    const query: any = {};
    
    // Filter by active status
    const isActive = searchParams.get('isActive');
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    // Filter by role
    const role = searchParams.get('role');
    if (role && role !== 'all') {
      query['role.name'] = role;
    }

    // Search functionality
    const search = searchParams.get('search');
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { employeeId: searchRegex },
        { 'role.displayName': searchRegex }
      ];
    }

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'name-asc';
    let sortOption: any = {};
    switch (sortBy) {
      case 'name-asc':
        sortOption = { firstName: 1, lastName: 1 };
        break;
      case 'name-desc':
        sortOption = { firstName: -1, lastName: -1 };
        break;
      case 'role':
        sortOption = { 'role.name': 1 };
        break;
      case 'activity':
        sortOption = { 'metrics.ordersCreatedThisMonth': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Execute query
    const [staff, total] = await Promise.all([
      Staff.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Staff.countDocuments(query)
    ]);

    // Transform to include virtuals
    const transformedStaff = staff.map(s => ({
      ...s,
      fullName: `${s.firstName} ${s.lastName}`,
      isOnSchedule: calculateIsOnSchedule(s.schedule),
      todaysActivityCount: calculateTodaysActivity(s.activity || []),
      effectivePermissions: calculateEffectivePermissions(s.role?.permissions, s.customPermissions)
    }));

    return NextResponse.json({
      data: transformedStaff,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('[Staff API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// POST /api/staff - Create new staff member
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { allowed, staff: currentStaff } = await checkStaffPermission(auth, 'STAFF', 'CREATE');
    if (!allowed) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, employeeId, firstName, lastName, email, phone, role, schedule, timezone } = body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Check for duplicate email or employeeId
    const existing = await Staff.findOne({
      $or: [{ email }, { employeeId }]
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Staff with this email or employee ID already exists' }, 
        { status: 409 }
      );
    }

    // Create staff with role template
    const newStaff = await Staff.createWithRole(
      new Types.ObjectId(userId || auth.userId),
      employeeId || await generateEmployeeId(),
      { firstName, lastName, email, phone },
      role
    );

    // Log activity
    const clientIp = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await currentStaff?.logActivity('STAFF_CREATED', 'STAFF', {
      targetId: newStaff._id,
      targetNumber: newStaff.employeeId,
      newValue: { role, name: `${firstName} ${lastName}` },
      ipAddress: clientIp,
      userAgent: userAgent
    });

    return NextResponse.json(
      { 
        data: {
          ...newStaff.toObject(),
          fullName: `${newStaff.firstName} ${newStaff.lastName}`
        }, 
        message: 'Staff created successfully' 
      }, 
      { status: 201 }
    );

  } catch (error: any) {
    console.error('[Staff API] Error creating staff:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Helper functions
async function generateEmployeeId(): Promise<string> {
  const lastStaff = await Staff.findOne().sort({ createdAt: -1 });
  const lastNum = lastStaff ? parseInt(lastStaff.employeeId.split('-')[1]) : 0;
  return `EMP-${String(lastNum + 1).padStart(3, '0')}`;
}

function calculateIsOnSchedule(schedule: any): boolean {
  if (!schedule) return false;
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[now.getDay()];
  const daySchedule = schedule[today];
  
  if (!daySchedule || !daySchedule.isWorkingDay) return false;
  
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return currentTime >= daySchedule.start && currentTime <= daySchedule.end;
}

function calculateTodaysActivity(activity: any[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return activity.filter(a => new Date(a.timestamp) >= today).length;
}

function calculateEffectivePermissions(rolePerms: any[], customPerms: any[] = []) {
  const merged = [...(rolePerms || [])];
  for (const custom of customPerms) {
    const existingIndex = merged.findIndex(p => p.resource === custom.resource);
    if (existingIndex >= 0) {
      merged[existingIndex] = custom;
    } else {
      merged.push(custom);
    }
  }
  return merged;
}*/

// app/api/staff/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Staff } from '@/models/Staff';
import { Types } from 'mongoose';
import { authenticateRequest, AuthContext, hasPermission } from '@/lib/middleware/auth';
import { withCORS, corsHeaders } from '@/lib/cors/cors';
import dbConnect from '@/lib/db/mongoose';
import '@/models/Staff';

// Helper to extract IP from request headers
function getClientIp(request: NextRequest): string {
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

// Helper to check staff permissions
/*async function checkStaffPermission(auth: AuthContext, resource: string, action: string) {
  // Ensure user has a staff profile
  if (!auth.staffId) {
    return { allowed: false, staff: null };
  }
  
  const staff = await Staff.findById(new Types.ObjectId(auth.staffId));
  if (!staff || !staff.isActive) {
    return { allowed: false, staff: null };
  }
  
  // Check permissions via Staff model (maintains original behavior)
  // Also check AuthContext permissions as fallback
  const hasStaffPerm = staff.hasPermission(resource as any, action as any);
  const hasUserPerm = hasPermission(auth, resource, action);
  
  return { allowed: hasStaffPerm || hasUserPerm, staff };
}*/

// Helper to check staff permissions
async function checkStaffPermission(auth: AuthContext, resource: string, action: string) {
  // Admin bypass - admins can access everything
  if (auth.role === 'ADMIN' || auth.role === 'SUPER_ADMIN') {
    console.log('[StaffAPI] Admin bypass for:', { resource, action });
    return { allowed: true, staff: null };
  }
  
  // Ensure user has a staff profile
  if (!auth.staffId) {
    console.log('[StaffAPI] No staffId for non-admin user');
    return { allowed: false, staff: null };
  }
  
  const staff = await Staff.findById(new Types.ObjectId(auth.staffId));
  if (!staff || !staff.isActive) {
    console.log('[StaffAPI] Staff not found or inactive');
    return { allowed: false, staff: null };
  }
  
  // Check permissions via Staff model
  const hasStaffPerm = staff.hasPermission(resource as any, action as any);
  const hasUserPerm = hasPermission(auth, resource, action);
  
  console.log('[StaffAPI] Permission check:', { 
    hasStaffPerm, 
    hasUserPerm, 
    allowed: hasStaffPerm || hasUserPerm 
  });
  
  return { allowed: hasStaffPerm || hasUserPerm, staff };
}

// GET /api/staff - List all staff with filtering
async function getStaffHandler(request: NextRequest) {
  try {
    await dbConnect();
    
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders(request.headers.get('origin') || 'http://127.0.0.1:5500')
      });
    }

    const { allowed, staff: currentStaff } = await checkStaffPermission(auth, 'STAFF', 'READ');
    if (!allowed) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { 
        status: 403,
        headers: corsHeaders(request.headers.get('origin') || 'http://127.0.0.1:5500')
      });
    }

    const { searchParams } = new URL(request.url);
    
    // Build query
    const query: any = {};
    
    // Filter by active status
    const isActive = searchParams.get('isActive');
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    // Filter by role
    const role = searchParams.get('role');
    if (role && role !== 'all') {
      query['role.name'] = role;
    }

    // Search functionality
    const search = searchParams.get('search');
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { employeeId: searchRegex },
        { 'role.displayName': searchRegex }
      ];
    }

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'name-asc';
    let sortOption: any = {};
    switch (sortBy) {
      case 'name-asc':
        sortOption = { firstName: 1, lastName: 1 };
        break;
      case 'name-desc':
        sortOption = { firstName: -1, lastName: -1 };
        break;
      case 'role':
        sortOption = { 'role.name': 1 };
        break;
      case 'activity':
        sortOption = { 'metrics.ordersCreatedThisMonth': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Execute query
    const [staff, total] = await Promise.all([
      Staff.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Staff.countDocuments(query)
    ]);

    // Transform to include virtuals
    const transformedStaff = staff.map(s => ({
      ...s,
      fullName: `${s.firstName} ${s.lastName}`,
      isOnSchedule: calculateIsOnSchedule(s.schedule),
      todaysActivityCount: calculateTodaysActivity(s.activity || []),
      effectivePermissions: calculateEffectivePermissions(s.role?.permissions, s.customPermissions)
    }));

    return NextResponse.json({
      data: transformedStaff,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, {
      headers: corsHeaders(request.headers.get('origin') || 'http://127.0.0.1:5500')
    });

  } catch (error) {
    console.error('[Staff API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { 
        status: 500,
        headers: corsHeaders(request.headers.get('origin') || 'http://127.0.0.1:5500')
      }
    );
  }
}

// POST /api/staff - Create new staff member
async function postStaffHandler(request: NextRequest) {
  try {
    await dbConnect();
    
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders(request.headers.get('origin') || 'http://127.0.0.1:5500')
      });
    }

    const { allowed, staff: currentStaff } = await checkStaffPermission(auth, 'STAFF', 'CREATE');
    if (!allowed) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { 
        status: 403,
        headers: corsHeaders(request.headers.get('origin') || 'http://127.0.0.1:5500')
      });
    }

    const body = await request.json();
    const { userId, employeeId, firstName, lastName, email, phone, role, schedule, timezone } = body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { 
          status: 400,
          headers: corsHeaders(request.headers.get('origin') || 'http://127.0.0.1:5500')
        }
      );
    }

    // Check for duplicate email or employeeId
    const existing = await Staff.findOne({
      $or: [{ email }, { employeeId }]
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Staff with this email or employee ID already exists' }, 
        { 
          status: 409,
          headers: corsHeaders(request.headers.get('origin') || 'http://127.0.0.1:5500')
        }
      );
    }

    // Create staff with role template
    const newStaff = await Staff.createWithRole(
      new Types.ObjectId(userId || auth.userId),
      employeeId || await generateEmployeeId(),
      { firstName, lastName, email, phone },
      role
    );

    // Log activity
    const clientIp = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await currentStaff?.logActivity('STAFF_CREATED', 'STAFF', {
      targetId: newStaff._id,
      targetNumber: newStaff.employeeId,
      newValue: { role, name: `${firstName} ${lastName}` },
      ipAddress: clientIp,
      userAgent: userAgent
    });

    return NextResponse.json(
      { 
        data: {
          ...newStaff.toObject(),
          fullName: `${newStaff.firstName} ${newStaff.lastName}`
        }, 
        message: 'Staff created successfully' 
      }, 
      { 
        status: 201,
        headers: corsHeaders(request.headers.get('origin') || 'http://127.0.0.1:5500')
      }
    );

  } catch (error: any) {
    console.error('[Staff API] Error creating staff:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' }, 
      { 
        status: 500,
        headers: corsHeaders(request.headers.get('origin') || 'http://127.0.0.1:5500')
      }
    );
  }
}

// Helper functions
async function generateEmployeeId(): Promise<string> {
  const lastStaff = await Staff.findOne().sort({ createdAt: -1 });
  const lastNum = lastStaff ? parseInt(lastStaff.employeeId.split('-')[1]) : 0;
  return `EMP-${String(lastNum + 1).padStart(3, '0')}`;
}

function calculateIsOnSchedule(schedule: any): boolean {
  if (!schedule) return false;
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[now.getDay()];
  const daySchedule = schedule[today];
  
  if (!daySchedule || !daySchedule.isWorkingDay) return false;
  
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return currentTime >= daySchedule.start && currentTime <= daySchedule.end;
}

function calculateTodaysActivity(activity: any[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return activity.filter(a => new Date(a.timestamp) >= today).length;
}

function calculateEffectivePermissions(rolePerms: any[], customPerms: any[] = []) {
  const merged = [...(rolePerms || [])];
  for (const custom of customPerms) {
    const existingIndex = merged.findIndex(p => p.resource === custom.resource);
    if (existingIndex >= 0) {
      merged[existingIndex] = custom;
    } else {
      merged.push(custom);
    }
  }
  return merged;
}


// Export with CORS middleware
export const GET = withCORS(getStaffHandler);
export const POST = withCORS(postStaffHandler);
export const OPTIONS = withCORS(async () => new Response(null, { status: 204 }));
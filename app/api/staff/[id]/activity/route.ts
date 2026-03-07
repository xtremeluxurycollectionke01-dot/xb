import { NextRequest, NextResponse } from 'next/server';
import { Staff } from '@/models/Staff';
import { Types } from 'mongoose';
import { authenticateRequest, AuthContext, hasPermission } from '@/lib/middleware/auth';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;
    
    // Filters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const action = searchParams.get('action');
    const resource = searchParams.get('resource');

    // Get current user staff record
    let currentStaff = null;
    if (auth.staffId) {
      currentStaff = await Staff.findById(new Types.ObjectId(auth.staffId));
    }

    const isOwnProfile = currentStaff?._id.toString() === id;
    
    // Check admin via Staff model or AuthContext
    const isAdmin = (
      currentStaff?.hasPermission('STAFF', 'ADMIN') || 
      hasPermission(auth, 'STAFF', 'ADMIN')
    );

    // Only allow viewing own activity or admin viewing all
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json(
        { error: 'Can only view your own activity' }, 
        { status: 403 }
      );
    }

    const staff = await Staff.findById(id).select('activity firstName lastName').lean();
    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    let activities = staff.activity || [];

    // Apply filters
    if (startDate) {
      const start = new Date(startDate);
      activities = activities.filter((a: any) => new Date(a.timestamp) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      activities = activities.filter((a: any) => new Date(a.timestamp) <= end);
    }
    if (action) {
      activities = activities.filter((a: any) => a.action === action);
    }
    if (resource) {
      activities = activities.filter((a: any) => a.resource === resource);
    }

    // Sort by timestamp desc
    activities.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const total = activities.length;
    const paginatedActivities = activities.slice(skip, skip + limit);

    // Enrich with display info
    const enrichedActivities = paginatedActivities.map((a: any) => ({
      ...a,
      timeFormatted: new Date(a.timestamp).toLocaleString('en-KE', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      actionDisplay: formatActionDisplay(a.action),
      resourceDisplay: a.resource.replace('_', ' ').toLowerCase()
    }));

    // Calculate summary stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const summary = {
      total: total,
      byAction: {} as Record<string, number>,
      byResource: {} as Record<string, number>,
      today: activities.filter((a: any) => 
        new Date(a.timestamp).setHours(0,0,0,0) === today.getTime()
      ).length,
      thisWeek: activities.filter((a: any) => 
        new Date(a.timestamp) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
    };

    activities.forEach((a: any) => {
      summary.byAction[a.action] = (summary.byAction[a.action] || 0) + 1;
      summary.byResource[a.resource] = (summary.byResource[a.resource] || 0) + 1;
    });

    return NextResponse.json({
      staffId: id,
      staffName: `${staff.firstName} ${staff.lastName}`,
      summary,
      activities: enrichedActivities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + limit < total
      }
    });

  } catch (error) {
    console.error('[Activity API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity' }, 
      { status: 500 }
    );
  }
}

function formatActionDisplay(action: string): string {
  return action
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}
// app/api/staff/activity-feed/activity-feed.handler.ts
import { NextRequest } from 'next/server';
import { Staff } from '@/models/Staff';

import { Types } from 'mongoose';
import dbConnect from '@/lib/db/mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Get query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const days = parseInt(url.searchParams.get('days') || '7');
    const staffId = url.searchParams.get('staffId');

    // Calculate date range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);

    // Build query
    const matchQuery: any = { isActive: true };
    if (staffId && Types.ObjectId.isValid(staffId)) {
      matchQuery._id = new Types.ObjectId(staffId);
    }

    // Aggregate activities
    const staffActivities = await Staff.aggregate([
      { $match: matchQuery },
      { $unwind: '$activity' },
      { 
        $match: { 
          'activity.timestamp': { $gte: cutoffDate }
        } 
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $project: {
          _id: 1,
          staffId: '$_id',
          employeeId: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          photo: 1,
          role: '$role.name',
          activity: 1,
          'userInfo.email': 1
        }
      },
      { $sort: { 'activity.timestamp': -1 } },
      { $limit: limit }
    ]);

    // Format activities for feed
    const activities = staffActivities.map(item => ({
      id: item.activity._id || `${item.staffId}_${item.activity.timestamp}`,
      staffId: item.staffId,
      staffName: `${item.firstName} ${item.lastName}`,
      staffEmail: item.email,
      staffPhoto: item.photo,
      role: item.role,
      employeeId: item.employeeId,
      action: item.activity.action,
      resource: item.activity.resource,
      timestamp: item.activity.timestamp,
      targetId: item.activity.targetId,
      targetNumber: item.activity.targetNumber,
      details: item.activity.details,
      ipAddress: item.activity.ipAddress,
      userAgent: item.activity.userAgent,
      duration: item.activity.duration,
      timeAgo: getTimeAgo(new Date(item.activity.timestamp))
    }));

    // Group activities by date for better UI
    const groupedByDate = activities.reduce((groups: any, activity) => {
      const date = new Date(activity.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
      return groups;
    }, {});

    // Get action type counts for summary
    const actionSummary = activities.reduce((summary: any, activity) => {
      const action = activity.action;
      summary[action] = (summary[action] || 0) + 1;
      return summary;
    }, {});

    // Get unique staff members in feed
    const uniqueStaff = Array.from(new Map(
      activities.map(a => [a.staffId, {
        staffId: a.staffId,
        name: a.staffName,
        email: a.staffEmail,
        photo: a.staffPhoto,
        role: a.role,
        employeeId: a.employeeId
      }])
    ).values());

    const response = {
      success: true,
      data: {
        activities,
        groupedByDate,
        summary: {
          totalActivities: activities.length,
          uniqueStaff: uniqueStaff.length,
          dateRange: {
            from: cutoffDate.toISOString(),
            to: new Date().toISOString(),
            days
          },
          actionSummary,
          topActions: Object.entries(actionSummary)
            .sort((a: any, b: any) => b[1] - a[1])
            .slice(0, 5)
            .map(([action, count]) => ({ action, count }))
        },
        staff: uniqueStaff
      },
      pagination: {
        limit,
        returned: activities.length
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('[Activity Feed] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch activity feed'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
}
// app/api/purchases/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';

import { requireAuth } from '@/lib/auth';
import Purchase from '@/models/Purchase';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Get authenticated user
    const user = await requireAuth(request);
    const purchaseNumber = `PUR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, totalAmount, notes } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one item is required' },
        { status: 400 }
      );
    }

    if (totalAmount === undefined || totalAmount === null || totalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid total amount is required' },
        { status: 400 }
      );
    }

    // Validate items
    for (const item of items) {
      if (!item.productId || !item.productName) {
        return NextResponse.json(
          { success: false, error: 'Each item must have productId and productName' },
          { status: 400 }
        );
      }
      if (!item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { success: false, error: 'Each item must have a valid quantity' },
          { status: 400 }
        );
      }
      if (item.price === undefined || item.price < 0) {
        return NextResponse.json(
          { success: false, error: 'Each item must have a valid price' },
          { status: 400 }
        );
      }
    }

    // Create purchase with user info
    const purchase = await Purchase.create({
      userId: user._id.toString(),
      userEmail: user.email,
      items,
      totalAmount,
      purchaseNumber,
      notes,
      status: 'PENDING',
    });

    console.log(`✅ Purchase created: ${purchase.purchaseNumber} for user ${user.email}`);

    return NextResponse.json(
      {
        success: true,
        data: purchase,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error creating purchase:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create purchase',
      },
      { status: 500 }
    );
  }
}*/

// app/api/purchases/route.ts - Updated POST with manual purchase number generation
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';

import { requireAuth } from '@/lib/auth';
import Purchase from '@/models/Purchase';

// Helper function to generate purchase number
function generatePurchaseNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `LINK-${year}${month}${day}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Get authenticated user
    const user = await requireAuth(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, totalAmount, notes } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one item is required' },
        { status: 400 }
      );
    }

    if (totalAmount === undefined || totalAmount === null || totalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid total amount is required' },
        { status: 400 }
      );
    }

    // Validate items
    for (const item of items) {
      if (!item.productId || !item.productName) {
        return NextResponse.json(
          { success: false, error: 'Each item must have productId and productName' },
          { status: 400 }
        );
      }
      if (!item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { success: false, error: 'Each item must have a valid quantity' },
          { status: 400 }
        );
      }
      if (item.price === undefined || item.price < 0) {
        return NextResponse.json(
          { success: false, error: 'Each item must have a valid price' },
          { status: 400 }
        );
      }
    }

    // Generate purchase number manually
    const purchaseNumber = generatePurchaseNumber();

    // Create purchase with user info and explicit purchase number
    const purchase = await Purchase.create({
      purchaseNumber: purchaseNumber, // Explicitly set
      userId: user._id.toString(),
      userEmail: user.email,
      items,
      totalAmount,
      notes,
      status: 'PENDING',
    });

    console.log(`✅ Purchase created: ${purchase.purchaseNumber} for user ${user.email}`);

    return NextResponse.json(
      {
        success: true,
        data: purchase,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error creating purchase:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        {
          success: false,
          error: errors.join(', '),
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create purchase',
      },
      { status: 500 }
    );
  }
}

// app/api/purchases/route.ts (continued - add GET method)

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get authenticated user
    const user = await requireAuth(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { userId: user._id.toString() };
    if (status && ['PENDING', 'CONFIRMED', 'COMPLETED', 'FAILED', 'CANCELLED'].includes(status.toUpperCase())) {
      filter.status = status.toUpperCase();
    }

    // Get purchases with pagination
    const [purchases, total] = await Promise.all([
      Purchase.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Purchase.countDocuments(filter),
    ]);

    console.log(`📋 Retrieved ${purchases.length} purchases for user ${user.email}`);

    return NextResponse.json({
      success: true,
      data: purchases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching purchases:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch purchases',
      },
      { status: 500 }
    );
  }
}
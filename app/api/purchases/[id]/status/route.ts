// app/api/purchases/[id]/status/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';

import { requireAuth } from '@/lib/auth';
import Purchase from '@/models/Purchase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Purchase ID is required' },
        { status: 400 }
      );
    }

    // Find purchase and verify ownership
    const purchase = await Purchase.findOne({ 
      _id: id, 
      userId: user._id.toString() 
    }).lean();

    if (!purchase) {
      return NextResponse.json(
        { success: false, error: 'Purchase not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: purchase._id,
        status: purchase.status,
        purchaseNumber: purchase.purchaseNumber,
        totalAmount: purchase.totalAmount,
        mpesaReceiptNumber: purchase.mpesaReceiptNumber,
        transactionReference: purchase.transactionReference,
        paymentMetadata: purchase.paymentMetadata,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('❌ Error checking purchase status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to check purchase status',
      },
      { status: 500 }
    );
  }
}*/

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import Purchase from '@/models/Purchase';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const user = await requireAuth(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    // ✅ FIX: await params (Next.js 15 change)
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Purchase ID is required' },
        { status: 400 }
      );
    }

    const purchase = await Purchase.findOne({
      _id: id,
      userId: user._id.toString(),
    }).lean();

    if (!purchase) {
      return NextResponse.json(
        { success: false, error: 'Purchase not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: purchase._id,
        status: purchase.status,
        purchaseNumber: purchase.purchaseNumber,
        totalAmount: purchase.totalAmount,
        mpesaReceiptNumber: purchase.mpesaReceiptNumber,
        transactionReference: purchase.transactionReference,
        paymentMetadata: purchase.paymentMetadata,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('❌ Error checking purchase status:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to check purchase status',
      },
      { status: 500 }
    );
  }
}
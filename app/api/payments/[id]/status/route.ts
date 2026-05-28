// app/api/payments/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { Payment } from '@/models/Payment.model';
import { Order } from '@/models/Orders';
import { Types } from 'mongoose';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // FIX: params is now a Promise
) {
  try {
    await dbConnect();
    
    const { id } = await params;  // FIX: await the params Promise
    const body = await request.json();
    const { status, errorCode, errorMessage, metadata } = body;
    
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid payment ID format' }
      }, { status: 400 });
    }
    
    const payment = await Payment.findById(id);
    
    if (!payment) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Payment not found' }
      }, { status: 404 });
    }
    
    // Update based on status
    switch (status) {
      case 'PROCESSING':
        await payment.markAsProcessing();
        if (metadata) {
          payment.metadata = { ...payment.metadata, ...metadata };
          await payment.save();
        }
        break;
        
      case 'COMPLETED':
        await payment.markAsCompleted(
          metadata?.mpesaReceiptNumber || `REF-${Date.now()}`,
          metadata
        );
        break;
        
      case 'FAILED':
        await payment.markAsFailed(errorCode || 'UNKNOWN_ERROR', errorMessage || 'Payment failed');
        break;
        
      default:
        payment.status = status;
        payment.statusHistory.push({
          status,
          changedAt: new Date(),
          reason: errorMessage
        });
        await payment.save();
    }
    
    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment.paymentId,
        status: payment.status,
        orderNumber: payment.orderNumber
      }
    });
    
  } catch (error: any) {
    console.error('Error updating payment status:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to update payment status'
      }
    }, { status: 500 });
  }
}
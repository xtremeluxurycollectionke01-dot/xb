// app/api/payments/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { Payment } from '@/models/Payment.model';
import { Order } from '@/models/Orders';
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    const { orderId, orderNumber, amount, method, channel, customerPhone } = body;
    
    if (!orderId || !orderNumber || !amount || !method || !channel) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' }
      }, { status: 400 });
    }
    
    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' }
      }, { status: 404 });
    }
    
    // Create payment record
    const payment = new Payment({
      orderId: new Types.ObjectId(orderId),
      orderNumber: orderNumber,
      amount: amount,
      currency: body.currency || 'KES',
      method: method,
      channel: channel,
      status: 'PENDING',
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: customerPhone,
      metadata: body.metadata || {},
      requestedAt: new Date(),
      statusHistory: [{
        status: 'PENDING',
        changedAt: new Date(),
        reason: 'Payment initiated'
      }],
      retryCount: 0,
      maxRetries: 3,
      isVerified: false
    });
    
    await payment.save();
    
    console.log(`✅ Payment record created: ${payment.paymentId} for order ${orderNumber}`);
    
    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment.paymentId,
        payment: {
          id: payment._id,
          paymentId: payment.paymentId,
          status: payment.status,
          amount: payment.amount,
          orderNumber: payment.orderNumber
        }
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating payment:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to create payment record'
      }
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');
    const paymentId = searchParams.get('paymentId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    let query: any = {};
    
    if (orderId) {
      query.orderId = new Types.ObjectId(orderId);
    }
    
    if (paymentId) {
      query.paymentId = paymentId;
    }
    
    if (status) {
      query.status = status;
    }
    
    const [payments, total] = await Promise.all([
      Payment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Payment.countDocuments(query)
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        payments,
        pagination: {
          page,
          limit,
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to fetch payments'
      }
    }, { status: 500 });
  }
}*/

// app/api/payments/route.ts (Fixed)
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { Payment } from '@/models/Payment.model';
import { Order } from '@/models/Orders';
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    console.log('📝 Creating payment record with data:', body);
    
    // Validate required fields
    const { orderId, orderNumber, amount, method, channel, customerPhone } = body;
    
    if (!orderId || !orderNumber || !amount || !method || !channel) {
      return NextResponse.json({
        success: false,
        error: { 
          code: 'VALIDATION_ERROR', 
          message: 'Missing required fields: orderId, orderNumber, amount, method, channel are required' 
        }
      }, { status: 400 });
    }
    
    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' }
      }, { status: 404 });
    }
    
    // Check if payment already exists for this order
    const existingPayment = await Payment.findOne({ orderId: new Types.ObjectId(orderId), status: { $ne: 'FAILED' } });
    if (existingPayment) {
      console.log(`⚠️ Payment already exists for order ${orderNumber}: ${existingPayment.paymentId}`);
      return NextResponse.json({
        success: true,
        data: {
          paymentId: existingPayment.paymentId,
          payment: {
            id: existingPayment._id,
            paymentId: existingPayment.paymentId,
            status: existingPayment.status,
            amount: existingPayment.amount,
            orderNumber: existingPayment.orderNumber
          },
          existing: true
        }
      });
    }
    
    // Create payment record (paymentId will be auto-generated by pre-save middleware)
    const payment = new Payment({
      orderId: new Types.ObjectId(orderId),
      orderNumber: orderNumber,
      amount: amount,
      currency: body.currency || 'KES',
      method: method,
      channel: channel,
      status: 'PENDING',
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: customerPhone,
      metadata: body.metadata || {},
      requestedAt: new Date(),
      statusHistory: [{
        status: 'PENDING',
        changedAt: new Date(),
        reason: 'Payment initiated'
      }],
      retryCount: 0,
      maxRetries: 3,
      isVerified: false
    });
    
    // Save will trigger pre-save middleware to generate paymentId
    await payment.save();
    
    console.log(`✅ Payment record created: ${payment.paymentId} for order ${orderNumber}`);
    
    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment.paymentId,
        payment: {
          id: payment._id,
          paymentId: payment.paymentId,
          status: payment.status,
          amount: payment.amount,
          orderNumber: payment.orderNumber,
          createdAt: payment.createdAt
        }
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating payment:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'DUPLICATE_PAYMENT',
          message: 'A payment record already exists for this order'
        }
      }, { status: 409 });
    }
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to create payment record'
      }
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');
    const paymentId = searchParams.get('paymentId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    let query: any = {};
    
    if (orderId) {
      query.orderId = new Types.ObjectId(orderId);
    }
    
    if (paymentId) {
      query.paymentId = paymentId;
    }
    
    if (status) {
      query.status = status;
    }
    
    const [payments, total] = await Promise.all([
      Payment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Payment.countDocuments(query)
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        payments,
        pagination: {
          page,
          limit,
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to fetch payments'
      }
    }, { status: 500 });
  }
}
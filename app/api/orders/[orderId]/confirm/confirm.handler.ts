// app/api/orders/[orderId]/confirm/confirm.handler.ts
/*import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { Order } from '@/models/Orders';
import { Product, StockStatus } from '@/models/Products';
import { Types } from 'mongoose';

async function reserveStockForOrder(order: any, orderNumber: string): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      errors.push(`Product not found: ${item.sku}`);
      continue;
    }
    
    // Check stock
    if (product.stockQuantity < item.quantity) {
      errors.push(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`);
      continue;
    }
    
    // Reserve stock
    const oldQuantity = product.stockQuantity;
    product.stockQuantity -= item.quantity;
    
    // Add to stock history
    if (!product.stockHistory) product.stockHistory = [];
    product.stockHistory.push({
      quantity: item.quantity,
      type: 'sale',
      oldQuantity: oldQuantity,
      newQuantity: product.stockQuantity,
      reference: `ORDER-${orderNumber}`,
      notes: `Stock reserved for order confirmation`,
      adjustedBy: 'system',
      timestamp: new Date()
    });
    
    // Update stock status
    const reorderThreshold = product.reorderLevel || product.reorderPoint || 0;
    if (product.stockQuantity === 0) {
      product.stockStatus = StockStatus.OUT_OF_STOCK;
      product.inStock = false;
    } else if (product.stockQuantity <= reorderThreshold) {
      product.stockStatus = StockStatus.LOW_STOCK;
      product.inStock = true;
    } else {
      product.stockStatus = StockStatus.IN_STOCK;
      product.inStock = true;
    }
    
    await product.save();
    
    // Update order item with reserved quantity
    item.reservedQuantity = item.quantity;
  }
  
  return { success: errors.length === 0, errors };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await dbConnect();
    
    const orderId = params.orderId;
    const body = await request.json();
    const { paymentReference, confirmedBy } = body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order not found' }
      }, { status: 404 });
    }
    
    if (order.status !== 'DRAFT') {
      return NextResponse.json({
        success: false,
        error: { code: 'INVALID_STATUS', message: `Cannot confirm order in ${order.status} status` }
      }, { status: 400 });
    }
    
    // Reserve stock
    const reserveResult = await reserveStockForOrder(order, order.orderNumber);
    
    if (!reserveResult.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INSUFFICIENT_STOCK',
          message: 'Failed to reserve stock',
          details: { errors: reserveResult.errors }
        }
      }, { status: 409 });
    }
    
    // Update order status
    order.status = 'CONFIRMED';
    order.isLocked = true;
    order.version += 1;
    
    order.statusHistory.push({
      status: 'CONFIRMED',
      changedBy: confirmedBy ? new Types.ObjectId(confirmedBy) : order.createdBy,
      changedAt: new Date(),
      reason: 'Order confirmed - stock reserved'
    });
    
    // Update payment if reference provided
    if (paymentReference && order.payments && order.payments.length > 0) {
      const existingPayment = order.payments.find(
        (p: any) => p.reference === paymentReference
      );
      if (existingPayment) {
        existingPayment.status = 'CONFIRMED';
        //existingPayment.verifiedBy = confirmedBy ? new Types.ObjectId(confirmedBy) : null;
        existingPayment.verifiedBy = confirmedBy
        ? new Types.ObjectId(confirmedBy)
        : undefined;
        existingPayment.paidAt = new Date();
      }
    }
    
    // Add system message
    if (typeof order.addSystemMessage === 'function') {
      order.addSystemMessage('Order confirmed and stock reserved');
    } else {
      order.messages.push({
        _id: new Types.ObjectId(),
        from: new Types.ObjectId(),
        fromModel: 'System',
        text: 'Order confirmed and stock reserved',
        timestamp: new Date(),
        isInternal: false,
        messageType: 'system'
      });
    }
    
    await order.save();
    
    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        message: 'Order confirmed successfully'
      }
    });
    
  } catch (error) {
    console.error('Error confirming order:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to confirm order'
      }
    }, { status: 500 });
  }}*/

    
// app/api/orders/[orderId]/confirm/confirm.handler.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { Order } from '@/models/Orders';
import { Product, StockStatus } from '@/models/Products';
import { Types } from 'mongoose';

async function reserveStockForOrder(order: any, orderNumber: string): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      errors.push(`Product not found: ${item.sku}`);
      continue;
    }
    
    // Check stock
    if (product.stockQuantity < item.quantity) {
      errors.push(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`);
      continue;
    }
    
    // Reserve stock
    const oldQuantity = product.stockQuantity;
    product.stockQuantity -= item.quantity;
    
    // Add to stock history
    if (!product.stockHistory) product.stockHistory = [];
    product.stockHistory.push({
      quantity: item.quantity,
      type: 'sale',
      oldQuantity: oldQuantity,
      newQuantity: product.stockQuantity,
      reference: `ORDER-${orderNumber}`,
      notes: `Stock reserved for order confirmation`,
      adjustedBy: 'system',
      timestamp: new Date()
    });
    
    // Update stock status
    const reorderThreshold = product.reorderLevel || product.reorderPoint || 0;
    if (product.stockQuantity === 0) {
      product.stockStatus = StockStatus.OUT_OF_STOCK;
      product.inStock = false;
    } else if (product.stockQuantity <= reorderThreshold) {
      product.stockStatus = StockStatus.LOW_STOCK;
      product.inStock = true;
    } else {
      product.stockStatus = StockStatus.IN_STOCK;
      product.inStock = true;
    }
    
    await product.save();
    
    // Update order item with reserved quantity
    item.reservedQuantity = item.quantity;
  }
  
  return { success: errors.length === 0, errors };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await dbConnect();
    
    const orderId = params.orderId;
    const body = await request.json();
    const { paymentReference, confirmedBy } = body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order not found' }
      }, { status: 404 });
    }
    
    if (order.status !== 'DRAFT') {
      return NextResponse.json({
        success: false,
        error: { code: 'INVALID_STATUS', message: `Cannot confirm order in ${order.status} status` }
      }, { status: 400 });
    }
    
    // Validate required fields
    if (!confirmedBy) {
      return NextResponse.json({
        success: false,
        error: { code: 'MISSING_FIELD', message: 'confirmedBy is required' }
      }, { status: 400 });
    }
    
    // Reserve stock
    const reserveResult = await reserveStockForOrder(order, order.orderNumber);
    
    if (!reserveResult.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INSUFFICIENT_STOCK',
          message: 'Failed to reserve stock',
          details: { errors: reserveResult.errors }
        }
      }, { status: 409 });
    }
    
    // Update order status
    order.status = 'CONFIRMED';
    order.isLocked = true;
    order.version += 1;
    
    order.statusHistory.push({
      status: 'CONFIRMED',
      changedBy: new Types.ObjectId(confirmedBy),
      changedAt: new Date(),
      reason: 'Order confirmed - stock reserved'
    });
    
    // Update payment if reference provided
    if (paymentReference && order.payments && order.payments.length > 0) {
      const existingPayment = order.payments.find(
        (p: any) => p.reference === paymentReference
      );
      if (existingPayment) {
        // Instead of setting 'status' which doesn't exist, set 'verifiedBy' and 'paidAt'
        // Or you can add a status field to the IPaymentInfo interface
        existingPayment.verifiedBy = confirmedBy ? new Types.ObjectId(confirmedBy) : undefined;
        existingPayment.paidAt = new Date();
        
        // If you want to track payment confirmation status, you could add a custom field
        // or use the existing structure. For now, we'll just set the verification info.
      }
    }
    
    // Add system message
    if (typeof order.addSystemMessage === 'function') {
      order.addSystemMessage('Order confirmed and stock reserved');
    } else {
      order.messages.push({
        _id: new Types.ObjectId(),
        from: new Types.ObjectId('000000000000000000000000'), // System ID
        fromModel: 'System',
        text: 'Order confirmed and stock reserved',
        timestamp: new Date(),
        isInternal: false,
        messageType: 'system'
      });
    }
    
    await order.save();
    
    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        message: 'Order confirmed successfully'
      }
    });
    
  } catch (error) {
    console.error('Error confirming order:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to confirm order'
      }
    }, { status: 500 });
  }
}
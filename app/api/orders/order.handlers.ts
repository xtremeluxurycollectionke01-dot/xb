// app/api/orders/order.handlers.ts
/*import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { Order } from '@/models/Orders';
import { Product, StockStatus } from '@/models/Products';
import { Client } from '@/models/Clients';
import { Types } from 'mongoose';
import { CreateOrderDTO, OrderResponseDTO } from '@/types/order.types';
import jwt from 'jsonwebtoken';

// Helper to get authenticated user from token (without external API call)
function getAuthenticatedUserFromToken(request: NextRequest): any {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  try {
    // Verify JWT directly using your secret
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// Generate unique order number
async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `ORD-${year}-`;
  
  const lastOrder = await Order.findOne(
    { orderNumber: { $regex: `^${prefix}` } },
    { orderNumber: 1 },
    { sort: { orderNumber: -1 } }
  );
  
  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }
  
  return `${prefix}${sequence.toString().padStart(6, '0')}`;
}

// Validate stock availability using your Product model
async function validateStock(items: CreateOrderDTO['items']): Promise<{ 
  available: boolean; 
  errors: string[];
  products: any[];
}> {
  const errors: string[] = [];
  const products: any[] = [];
  
  for (const item of items) {
    // Find product by SKU
    const product = await Product.findOne({ sku: item.sku });
    
    if (!product) {
      errors.push(`Product with SKU ${item.sku} not found`);
      continue;
    }
    
    // Check stock quantity
    if (product.stockQuantity < item.quantity) {
      errors.push(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`);
    }
    
    // Verify the product is active
    if (!product.isActive) {
      errors.push(`Product ${product.name} is currently inactive`);
    }
    
    products.push({
      product,
      requestedQuantity: item.quantity,
      requestedPrice: item.unitPrice
    });
  }
  
  return {
    available: errors.length === 0,
    errors,
    products
  };
}

// Create a guest client with proper phone and address
async function createGuestClient(destination: CreateOrderDTO['destination']): Promise<Types.ObjectId> {
  const clientNumber = await Client.generateClientNumber();
  
  // Create phone entry
  const phoneNumber = destination.contactPhone || '+254700000000';
  const phoneEntry = {
    phoneType: 'MOBILE' as const,
    number: phoneNumber,
    isPrimary: true,
    isVerified: false,
    whatsappEnabled: true,
    callConsent: true
  };
  
  // Create address entry
  const addressEntry = {
    addressType: 'SHIPPING' as const,
    street: destination.address,
    city: 'Nairobi',
    country: 'Kenya',
    isDefault: true,
    active: true,
    addedAt: new Date()
  };
  
  // Extract name parts
  const nameParts = destination.name?.split(' ') || ['Guest', 'Customer'];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || 'Customer';
  
  const tempClient = new Client({
    clientNumber,
    clientType: 'INDIVIDUAL',
    name: destination.name || 'Guest Customer',
    tradingName: destination.name,
    contactPerson: destination.contactName,
    phones: [phoneEntry],
    emails: [`guest_${Date.now()}@temp.linkchem.co.ke`],
    addresses: [addressEntry],
    category: 'RETAIL',
    paymentTerms: 0,
    taxExempt: false,
    flags: {
      onHold: false,
      requiresDeposit: false,
      creditSuspended: false
    },
    account: {
      totalPurchases: 0,
      totalPaid: 0,
      balanceDue: 0,
      creditLimit: 0,
      availableCredit: 0,
      averagePaymentDays: 0,
      onTimePaymentRate: 100,
      currentMonthPurchases: 0,
      currentMonthPayments: 0
    },
    stats: {
      totalOrders: 0,
      totalInvoices: 0,
      totalQuotations: 0,
      acceptanceRate: 0,
      averageOrderValue: 0,
      averageItemsPerOrder: 0,
      preferredCategories: [],
      relationshipLengthDays: 0,
      ordersPerMonth: 0,
      trend: 'INACTIVE'
    },
    isGuest: true,
    createdBy: new Types.ObjectId()
  });
  
  await tempClient.save();
  return tempClient._id;
}

// Create order response DTO
function toOrderResponseDTO(order: any): OrderResponseDTO {
  const paymentsTotal = order.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const totalPaid = (order.deposit || 0) + paymentsTotal;
  
  let paymentStatus: 'pending' | 'partial' | 'paid' = 'pending';
  if (totalPaid >= order.total) paymentStatus = 'paid';
  else if (totalPaid > 0) paymentStatus = 'partial';
  
  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    deposit: order.deposit || 0,
    balance: order.balance,
    destination: order.destination,
    items: order.items.map((item: any) => ({
      productId: item.product?.toString() || '',
      sku: item.sku,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    })),
    orderDate: order.orderDate.toISOString(),
    requestedDeliveryDate: order.requestedDeliveryDate.toISOString(),
    promisedDeliveryDate: order.promisedDeliveryDate?.toISOString(),
    messages: order.messages?.map((msg: any) => ({
      text: msg.text,
      timestamp: msg.timestamp.toISOString(),
      isInternal: msg.isInternal,
      messageType: msg.messageType
    })) || [],
    paymentStatus
  };
}

/** POST /api/orders - Create a new order *
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body: CreateOrderDTO = await request.json();
    
    // Validate required fields
    if (!body.destination?.address) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Destination address is required' }
      }, { status: 400 });
    }
    
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Order must contain at least one item' }
      }, { status: 400 });
    }
    
    // Validate each item has required fields
    for (const item of body.items) {
      if (!item.sku || !item.name || !item.quantity || !item.unitPrice) {
        return NextResponse.json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Each item requires sku, name, quantity, and unitPrice' }
        }, { status: 400 });
      }
    }
    
    // Check stock availability using Product model
    const stockCheck = await validateStock(body.items);
    if (!stockCheck.available) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INSUFFICIENT_STOCK',
          message: 'Some items are out of stock',
          details: { errors: stockCheck.errors }
        }
      }, { status: 409 });
    }
    
    // Get authenticated user from JWT
    const user = getAuthenticatedUserFromToken(request);
    let clientId: Types.ObjectId | null = null;
    let createdBy: Types.ObjectId | null = null;
    
    if (user && user.userId) {
      // If authenticated, find existing client
      const client = await Client.findOne({ 
        $or: [
          { email: user.email },
          { clientNumber: user.clientNumber }
        ]
      });
      if (client) {
        clientId = client._id;
        createdBy = client.createdBy || new Types.ObjectId();
      }
    }
    
    // If no client ID found, create guest client
    if (!clientId && !body.clientId) {
      clientId = await createGuestClient(body.destination);
      createdBy = new Types.ObjectId();
    } else if (body.clientId) {
      clientId = new Types.ObjectId(body.clientId);
    }
    
    // Calculate financials
    const subtotal = body.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const taxRate = body.taxRate || 16;
    const tax = Math.round(subtotal * (taxRate / 100) * 100) / 100;
    let total = subtotal + tax;
    
    // Apply promo discount if any
    let promoDiscountAmount = body.promoDiscount || 0;
    if (body.promoCode === 'WELCOME10' && !promoDiscountAmount) {
      promoDiscountAmount = subtotal * 0.1;
      total = total - promoDiscountAmount;
    }
    
    const deposit = body.deposit || 0;
    const paymentsTotal = body.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const balance = total - deposit - paymentsTotal;
    
    // Generate order number
    const orderNumber = await generateOrderNumber();
    
    // Create order items with product references
    const orderItems = [];
    for (const item of body.items) {
      // Find product by SKU to get the ObjectId
      const product = await Product.findOne({ sku: item.sku });
      
      orderItems.push({
        product: product?._id || null,
        sku: item.sku,
        name: item.name,
        description: item.description || '',
        category: item.category || product?.category || 'Uncategorized',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.unitPrice * item.quantity,
        verified: { scanned: false },
        reservedQuantity: 0
      });
    }
    
    // Create the order (DRAFT status - stock not reserved yet)
    const order = new Order({
      orderNumber,
      client: clientId,
      destination: {
        deliveryPointId: body.destination.deliveryPointId || new Types.ObjectId(),
        name: body.destination.name,
        address: body.destination.address,
        contactName: body.destination.contactName,
        contactPhone: body.destination.contactPhone,
        instructions: body.destination.instructions,
        coordinates: body.destination.coordinates
      },
      items: orderItems,
      subtotal: subtotal - promoDiscountAmount,
      taxRate,
      tax,
      total,
      deposit,
      balance,
      payments: body.payments?.map(p => ({
        method: p.method,
        reference: p.reference,
        amount: p.amount,
        paidAt: new Date(),
        paidBy: p.paidBy || body.destination.contactName,
        status: 'PENDING'
      })) || [],
      status: 'DRAFT',
      statusHistory: [{
        status: 'DRAFT',
        changedBy: createdBy || new Types.ObjectId(),
        reason: 'Order created via web checkout'
      }],
      createdBy: createdBy || new Types.ObjectId(),
      orderDate: new Date(),
      requestedDeliveryDate: new Date(body.requestedDeliveryDate),
      messages: body.orderNotes ? [{
        _id: new Types.ObjectId(),
        from: clientId,
        fromModel: 'Client',
        text: body.orderNotes,
        timestamp: new Date(),
        isInternal: false,
        messageType: 'text'
      }] : [],
      version: 1,
      isLocked: false
    });
    
    await order.save();
    
    // Update client with this order
    const client = await Client.findById(clientId);
    if (client && typeof client.addOrder === 'function') {
      await client.addOrder(order._id);
    }
    
    // Return success with order details
    const responseDTO = toOrderResponseDTO(order);
    
    // Determine if payment is required immediately
    const requiresPayment = balance > 0 && paymentsTotal === 0 && deposit === 0;
    
    return NextResponse.json({
      success: true,
      data: {
        order: responseDTO,
        requiresPayment,
        paymentReference: order.orderNumber,
        clientId: clientId?.toString()
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create order'
      }
    }, { status: 500 });
  }
}

/** GET /api/orders - List orders for authenticated user *
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const user = getAuthenticatedUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Find client for this user
    const client = await Client.findOne({ 
      $or: [
        { email: user.email },
        { clientNumber: user.clientNumber }
      ]
    });
    
    if (!client) {
      return NextResponse.json({
        success: true,
        data: { orders: [], pagination: { page, limit, totalItems: 0, totalPages: 0, hasNext: false, hasPrev: false } }
      });
    }
    
    const query: any = { client: client._id };
    
    // Optional status filter
    if (searchParams.get('status')) {
      query.status = searchParams.get('status');
    }
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('items.product', 'name sku images pricing')
        .lean(),
      Order.countDocuments(query)
    ]);
    
    const orderDTOs = orders.map(toOrderResponseDTO);
    
    return NextResponse.json({
      success: true,
      data: {
        orders: orderDTOs,
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
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch orders'
      }
    }, { status: 500 });
  }
}*/


// app/api/orders/order.handlers.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import { Order } from '@/models/Orders';
import { Product, StockStatus } from '@/models/Products';
import { Client } from '@/models/Clients';
import { Types } from 'mongoose';
import { CreateOrderDTO, OrderResponseDTO } from '@/types/order.types';
import jwt from 'jsonwebtoken';

// Helper to get authenticated user from token (without external API call)
function getAuthenticatedUserFromToken(request: NextRequest): any {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  try {
    // Verify JWT directly using your secret
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// Generate unique order number
async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `ORD-${year}-`;
  
  const lastOrder = await Order.findOne(
    { orderNumber: { $regex: `^${prefix}` } },
    { orderNumber: 1 },
    { sort: { orderNumber: -1 } }
  );
  
  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }
  
  return `${prefix}${sequence.toString().padStart(6, '0')}`;
}

// Validate stock availability using your Product model
async function validateStock(items: CreateOrderDTO['items']): Promise<{ 
  available: boolean; 
  errors: string[];
  products: any[];
}> {
  const errors: string[] = [];
  const products: any[] = [];
  
  for (const item of items) {
    // Find product by SKU
    const product = await Product.findOne({ sku: item.sku });
    
    if (!product) {
      errors.push(`Product with SKU ${item.sku} not found`);
      continue;
    }
    
    // Check stock quantity
    if (product.stockQuantity < item.quantity) {
      errors.push(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`);
    }
    
    // Verify the product is active
    if (!product.isActive) {
      errors.push(`Product ${product.name} is currently inactive`);
    }
    
    products.push({
      product,
      requestedQuantity: item.quantity,
      requestedPrice: item.unitPrice
    });
  }
  
  return {
    available: errors.length === 0,
    errors,
    products
  };
}

// Create a guest client with proper phone and address
async function createGuestClient(destination: CreateOrderDTO['destination']): Promise<Types.ObjectId> {
  const clientNumber = await Client.generateClientNumber();
  
  // Create phone entry
  const phoneNumber = destination.contactPhone || '+254700000000';
  const phoneEntry = {
    phoneType: 'MOBILE' as const,
    number: phoneNumber,
    isPrimary: true,
    isVerified: false,
    whatsappEnabled: true,
    callConsent: true
  };
  
  // Create address entry
  const addressEntry = {
    addressType: 'SHIPPING' as const,
    street: destination.address,
    city: 'Nairobi',
    country: 'Kenya',
    isDefault: true,
    active: true,
    addedAt: new Date()
  };
  
  // Extract name parts
  const nameParts = destination.name?.split(' ') || ['Guest', 'Customer'];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || 'Customer';
  
  const tempClient = new Client({
    clientNumber,
    clientType: 'INDIVIDUAL',
    name: destination.name || 'Guest Customer',
    tradingName: destination.name,
    contactPerson: destination.contactName,
    phones: [phoneEntry],
    emails: [`guest_${Date.now()}@temp.linkchem.co.ke`],
    addresses: [addressEntry],
    category: 'RETAIL',
    paymentTerms: 0,
    taxExempt: false,
    flags: {
      onHold: false,
      requiresDeposit: false,
      creditSuspended: false
    },
    account: {
      totalPurchases: 0,
      totalPaid: 0,
      balanceDue: 0,
      creditLimit: 0,
      availableCredit: 0,
      averagePaymentDays: 0,
      onTimePaymentRate: 100,
      currentMonthPurchases: 0,
      currentMonthPayments: 0
    },
    stats: {
      totalOrders: 0,
      totalInvoices: 0,
      totalQuotations: 0,
      acceptanceRate: 0,
      averageOrderValue: 0,
      averageItemsPerOrder: 0,
      preferredCategories: [],
      relationshipLengthDays: 0,
      ordersPerMonth: 0,
      trend: 'INACTIVE'
    },
    isGuest: true,
    createdBy: new Types.ObjectId()
  });
  
  await tempClient.save();
  return tempClient._id;
}

// Create order response DTO
function toOrderResponseDTO(order: any): OrderResponseDTO {
  const paymentsTotal = order.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const totalPaid = (order.deposit || 0) + paymentsTotal;
  
  let paymentStatus: 'pending' | 'partial' | 'paid' = 'pending';
  if (totalPaid >= order.total) paymentStatus = 'paid';
  else if (totalPaid > 0) paymentStatus = 'partial';
  
  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    deposit: order.deposit || 0,
    balance: order.balance,
    destination: order.destination,
    items: order.items.map((item: any) => ({
      productId: item.product?.toString() || '',
      sku: item.sku,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    })),
    orderDate: order.orderDate.toISOString(),
    requestedDeliveryDate: order.requestedDeliveryDate.toISOString(),
    promisedDeliveryDate: order.promisedDeliveryDate?.toISOString(),
    messages: order.messages?.map((msg: any) => ({
      text: msg.text,
      timestamp: msg.timestamp.toISOString(),
      isInternal: msg.isInternal,
      messageType: msg.messageType
    })) || [],
    paymentStatus
  };
}

/** POST /api/orders - Create a new order */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body: CreateOrderDTO = await request.json();
    
    // Validate required fields
    if (!body.destination?.address) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Destination address is required' }
      }, { status: 400 });
    }
    
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Order must contain at least one item' }
      }, { status: 400 });
    }
    
    // Validate each item has required fields
    for (const item of body.items) {
      if (!item.sku || !item.name || !item.quantity || !item.unitPrice) {
        return NextResponse.json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Each item requires sku, name, quantity, and unitPrice' }
        }, { status: 400 });
      }
    }
    
    // Check stock availability using Product model
    const stockCheck = await validateStock(body.items);
    if (!stockCheck.available) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INSUFFICIENT_STOCK',
          message: 'Some items are out of stock',
          details: { errors: stockCheck.errors }
        }
      }, { status: 409 });
    }
    
    // Get authenticated user from JWT
    const user = getAuthenticatedUserFromToken(request);
    let clientId: Types.ObjectId | null = null;
    let createdBy: Types.ObjectId | null = null;
    
    if (user && user.userId) {
      // If authenticated, find existing client
      const client = await Client.findOne({ 
        $or: [
          { email: user.email },
          { clientNumber: user.clientNumber }
        ]
      });
      if (client) {
        clientId = client._id;
        createdBy = client.createdBy || new Types.ObjectId();
      }
    }
    
    // If no client ID found, create guest client
    if (!clientId && !body.clientId) {
      clientId = await createGuestClient(body.destination);
      createdBy = new Types.ObjectId();
    } else if (body.clientId) {
      clientId = new Types.ObjectId(body.clientId);
    }
    
    // Calculate financials
    const subtotal = body.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const taxRate = body.taxRate || 16;
    const tax = Math.round(subtotal * (taxRate / 100) * 100) / 100;
    let total = subtotal + tax;
    
    // Apply promo discount if any
    let promoDiscountAmount = body.promoDiscount || 0;
    if (body.promoCode === 'WELCOME10' && !promoDiscountAmount) {
      promoDiscountAmount = subtotal * 0.1;
      total = total - promoDiscountAmount;
    }
    
    const deposit = body.deposit || 0;
    const paymentsTotal = body.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const balance = total - deposit - paymentsTotal;
    
    // Generate order number
    const orderNumber = await generateOrderNumber();
    
    // Create order items with product references
    const orderItems = [];
    for (const item of body.items) {
      // Find product by SKU to get the ObjectId
      const product = await Product.findOne({ sku: item.sku });
      
      orderItems.push({
        product: product?._id || null,
        sku: item.sku,
        name: item.name,
        description: item.description || '',
        category: item.category || product?.category || 'Uncategorized',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.unitPrice * item.quantity,
        verified: { scanned: false },
        reservedQuantity: 0
      });
    }
    
    // Create the order (DRAFT status - stock not reserved yet)
    const order = new Order({
      orderNumber,
      client: clientId,
      destination: {
        deliveryPointId: body.destination.deliveryPointId || new Types.ObjectId(),
        name: body.destination.name,
        address: body.destination.address,
        contactName: body.destination.contactName,
        contactPhone: body.destination.contactPhone,
        instructions: body.destination.instructions,
        coordinates: body.destination.coordinates
      },
      items: orderItems,
      subtotal: subtotal - promoDiscountAmount,
      taxRate,
      tax,
      total,
      deposit,
      balance,
      payments: body.payments?.map(p => ({
        method: p.method,
        reference: p.reference,
        amount: p.amount,
        paidAt: new Date(),
        paidBy: p.paidBy || body.destination.contactName,
        status: 'PENDING'
      })) || [],
      status: 'DRAFT',
      statusHistory: [{
        status: 'DRAFT',
        changedBy: createdBy || new Types.ObjectId(),
        reason: 'Order created via web checkout'
      }],
      createdBy: createdBy || new Types.ObjectId(),
      orderDate: new Date(),
      requestedDeliveryDate: new Date(body.requestedDeliveryDate),
      messages: body.orderNotes ? [{
        _id: new Types.ObjectId(),
        from: clientId,
        fromModel: 'Client',
        text: body.orderNotes,
        timestamp: new Date(),
        isInternal: false,
        messageType: 'text'
      }] : [],
      version: 1,
      isLocked: false
    });
    
    await order.save();
    
    // Update client with this order
    const client = await Client.findById(clientId);
    if (client && typeof client.addOrder === 'function') {
      await client.addOrder(order._id);
    }
    
    // Return success with order details
    const responseDTO = toOrderResponseDTO(order);
    
    // Determine if payment is required immediately
    const requiresPayment = balance > 0 && paymentsTotal === 0 && deposit === 0;
    
    return NextResponse.json({
      success: true,
      data: {
        order: responseDTO,
        requiresPayment,
        paymentReference: order.orderNumber,
        clientId: clientId?.toString()
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create order'
      }
    }, { status: 500 });
  }
}

/** GET /api/orders - List orders for authenticated user */
/*export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const user = getAuthenticatedUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Find client for this user
    const client = await Client.findOne({ 
      $or: [
        { email: user.email },
        { clientNumber: user.clientNumber }
      ]
    });
    
    if (!client) {
      return NextResponse.json({
        success: true,
        data: { orders: [], pagination: { page, limit, totalItems: 0, totalPages: 0, hasNext: false, hasPrev: false } }
      });
    }
    
    const query: any = { client: client._id };
    
    // Optional status filter
    if (searchParams.get('status')) {
      query.status = searchParams.get('status');
    }
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('items.product', 'name sku images pricing')
        .lean(),
      Order.countDocuments(query)
    ]);
    
    const orderDTOs = orders.map(toOrderResponseDTO);
    
    return NextResponse.json({
      success: true,
      data: {
        orders: orderDTOs,
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
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch orders'
      }
    }, { status: 500 });
  }
}*/

export async function GET(request: NextRequest) {
  try {
    console.log('\n========== [GET /api/orders] START ==========');

    await dbConnect();
    console.log('[Orders API] ✅ DB Connected');

    const searchParams = request.nextUrl.searchParams;
    const params = Object.fromEntries(searchParams.entries());

    console.log('[Orders API] 🔍 Raw Query Params:', params);

    const page = parseInt(params.page || '1');
    const limit = parseInt(params.limit || '10');
    const skip = (page - 1) * limit;

    const clientId = params.clientId;
    const status = params.status;

    console.log('[Orders API] 📄 Pagination:', { page, limit, skip });
    console.log('[Orders API] 👤 Client ID:', clientId || 'NONE');

    let query: any = {};

    // ================= MODE SWITCH =================
    if (clientId) {
      try {
        query.client = new Types.ObjectId(clientId);
        console.log('[Orders API] 🔒 Mode: CLIENT FILTER');
      } catch (err) {
        console.warn('[Orders API] ⚠️ Invalid clientId:', clientId);

        return NextResponse.json({
          success: false,
          error: {
            code: 'INVALID_CLIENT_ID',
            message: 'Invalid clientId format'
          }
        }, { status: 400 });
      }
    } else {
      console.warn('[Orders API] ⚠️ No clientId → DEV MODE (ALL ORDERS)');
    }

    // Optional filters
    if (status && status !== 'all') {
      query.status = status;
    }

    console.log('[Orders API] 🧠 Mongo Query:', query);

    // ================= DB QUERY =================
    /*const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('items.product', 'name sku images pricing')
        .lean(),
      Order.countDocuments(query)
    ]);

    console.log('[Orders API] 📦 Orders fetched:', orders.length);
    console.log('[Orders API] 🔢 Total count:', total);

    if (orders.length > 0) {
      console.log('[Orders API] 🧾 Sample Order:', {
        id: orders[0]._id,
        orderNumber: orders[0].orderNumber,
        total: orders[0].total,
        client: orders[0].client
      });
    }*/

      // ================= DB QUERY =================
const [rawOrders, total] = await Promise.all([
  Order.find(query)
    .sort({ orderDate: -1 })
    .skip(skip)
    .limit(limit)
    .lean(), // ❗ remove populate here (prevents crash)
  Order.countDocuments(query)
]);

console.log('[Orders API] 📦 Raw Orders fetched:', rawOrders.length);
console.log('[Orders API] 🔢 Total count:', total);

// ================= SANITIZE PRODUCT REFS =================
const orders = rawOrders.map((order: any) => {
  const cleanedItems = order.items.map((item: any) => {
    const isValid = item.product && Types.ObjectId.isValid(item.product);

    if (!isValid && item.product) {
      console.warn('[Orders API] ⚠️ Invalid product ref detected:', {
        orderId: order._id,
        product: item.product,
        sku: item.sku
      });
    }

    return {
      ...item,
      product: isValid ? item.product : null // prevent crashes downstream
    };
  });

  return {
    ...order,
    items: cleanedItems
  };
});

// ================= DEBUG SAMPLE =================
if (orders.length > 0) {
  console.log('[Orders API] 🧾 Sample Order:', {
    id: orders[0]._id,
    orderNumber: orders[0].orderNumber,
    total: orders[0].total,
    client: orders[0].client,
    firstItem: orders[0].items?.[0]
  });
}

    // ================= TRANSFORM =================
    let transformedOrders: any[] = [];

    try {
      transformedOrders = orders.map(toOrderResponseDTO);
    } catch (err) {
      console.error('[Orders API] ❌ Transform Error:', err);
      console.log('[Orders API] ⚠️ Falling back to raw orders');

      transformedOrders = orders; // fallback (important for frontend stability)
    }

    console.log('[Orders API] 🔄 Transformed Orders Count:', transformedOrders.length);

    // ================= RESPONSE =================
    const responsePayload = {
      success: true,
      data: {
        orders: transformedOrders || [], // ALWAYS ARRAY
        pagination: {
          page,
          limit,
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    };

    console.log('[Orders API] ✅ Response Ready:', {
      ordersCount: responsePayload.data.orders.length,
      totalPages: responsePayload.data.pagination.totalPages
    });

    console.log('========== [GET /api/orders] END ==========\n');

    return NextResponse.json(responsePayload);

  } catch (error) {
    console.error('\n❌ [Orders API] ERROR:', error);
    console.error('========== [GET /api/orders] FAILED ==========\n');

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch orders'
      }
    }, { status: 500 });
  }
}
// app/api/clients/clients.handler.ts
import { NextRequest } from 'next/server';
import { Client } from '@/models/Clients';
import { Staff } from '@/models/Staff';
import { Types } from 'mongoose';
import dbConnect from '@/lib/db/mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category');
    const hasBalance = url.searchParams.get('hasBalance') === 'true';
    const onHold = url.searchParams.get('onHold') === 'true';
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { clientNumber: { $regex: search, $options: 'i' } },
        { 'phones.number': { $regex: search } },
        { emails: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (hasBalance) {
      query['account.balanceDue'] = { $gt: 0 };
    }
    
    if (onHold) {
      query['flags.onHold'] = true;
    }
    
    const clients = await Client.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'firstName lastName email')
      .lean();
    
    const total = await Client.countDocuments(query);
    
    // Format clients for response
    const formattedClients = clients.map(client => ({
      _id: client._id,
      clientNumber: client.clientNumber,
      name: client.name,
      tradingName: client.tradingName,
      clientType: client.clientType,
      category: client.category,
      primaryPhone: client.phones?.find(p => p.isPrimary)?.number || client.phones?.[0]?.number,
      primaryEmail: client.emails?.[0],
      balanceDue: client.account?.balanceDue || 0,
      totalPurchases: client.account?.totalPurchases || 0,
      flags: client.flags,
      stats: {
        totalOrders: client.stats?.totalOrders || 0,
        lastOrderDate: client.stats?.lastOrderDate,
        trend: client.stats?.trend
      },
      assignedTo: client.assignedTo,
      lastActivityAt: client.lastActivityAt,
      createdAt: client.createdAt
    }));
    
    return new Response(JSON.stringify({
      success: true,
      data: formattedClients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('[Clients GET] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch clients'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.phone) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Name and phone number are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generate client number
    const clientNumber = await Client.generateClientNumber();
    
    // Create client
    const client = new Client({
      clientNumber,
      clientType: body.clientType || 'INDIVIDUAL',
      name: body.name,
      tradingName: body.tradingName,
      contactPerson: body.contactPerson,
      phones: [{
        phoneType: 'MOBILE',
        number: body.phone,
        isPrimary: true,
        isVerified: false,
        whatsappEnabled: true,
        callConsent: true
      }],
      emails: body.email ? [body.email] : [],
      addresses: body.address ? [{
        addressType: 'SHIPPING',
        street: body.address,
        city: body.city || 'Nairobi',
        country: 'Kenya',
        isDefault: true,
        active: true,
        addedAt: new Date()
      }] : [],
      category: body.category || 'RETAIL',
      paymentTerms: body.paymentTerms || 0,
      taxId: body.taxId,
      taxExempt: body.taxExempt || false,
      assignedTo: body.assignedTo ? new Types.ObjectId(body.assignedTo) : undefined,
      createdBy: body.createdBy ? new Types.ObjectId(body.createdBy) : undefined,
      internalNotes: body.internalNotes,
      account: {
        currency: 'KES',
        totalPurchases: 0,
        totalPaid: 0,
        balanceDue: 0,
        creditLimit: body.creditLimit || 0,
        availableCredit: body.creditLimit || 0,
        averagePaymentDays: 0,
        onTimePaymentRate: 100
      }
    });
    
    await client.save();
    
    return new Response(JSON.stringify({
      success: true,
      data: client,
      message: 'Client created successfully'
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('[Clients POST] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create client'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
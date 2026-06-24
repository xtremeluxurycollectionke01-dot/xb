/*import { NextResponse } from "next/server";
import axios from "axios";
import dayjs from "dayjs";
import { getAccessToken } from "@/lib/mpesa/token";

export async function POST(req: Request) {
  const { phone, amount, orderId } = await req.json();

  const token = await getAccessToken();

  const timestamp = dayjs().format("YYYYMMDDHHmmss");

  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");

  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
    AccountReference: orderId,
    TransactionDesc: "Order Payment",
  };

  const response = await axios.post(
    "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("📲 STK Response:", response.data);

  return NextResponse.json(response.data);
}*/

// app/api/mpesa/stk/route.ts (Updated)
/*import { NextResponse } from "next/server";
import axios from "axios";
import dayjs from "dayjs";
import { getAccessToken } from "@/lib/mpesa/token";

export async function POST(req: Request) {
  const { phone, amount, orderId, paymentId } = await req.json();

  const token = await getAccessToken();

  const timestamp = dayjs().format("YYYYMMDDHHmmss");

  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");

  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
    AccountReference: paymentId || orderId, // Use payment ID as reference
    TransactionDesc: `Payment for Order ${orderId}`,
  };

  console.log("📲 STK Push Payload:", payload);

  const response = await axios.post(
    "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("📲 STK Response:", response.data);

  return NextResponse.json(response.data);
}*/

// app/api/mpesa/stk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import dayjs from 'dayjs';
import { getAccessToken } from '@/lib/mpesa/token';
import { dbConnect } from '@/lib/mongodb';

import { requireAuth } from '@/lib/auth';
import Purchase from '@/models/Purchase';

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

    const { purchaseId, phoneNumber } = await request.json();

    // Validate inputs
    if (!purchaseId) {
      return NextResponse.json(
        { success: false, error: 'Purchase ID is required' },
        { status: 400 }
      );
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Find purchase and verify ownership
    const purchase = await Purchase.findOne({
      _id: purchaseId,
      userId: user._id.toString()
    });

    if (!purchase) {
      return NextResponse.json(
        { success: false, error: 'Purchase not found' },
        { status: 404 }
      );
    }

    // Check if purchase is already completed
    if (purchase.status === 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'Purchase already completed' },
        { status: 400 }
      );
    }

    const amount = purchase.totalAmount;

    // Format phone number (remove leading 0 or +)
    let formattedPhone = phoneNumber.replace(/^\+/, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    }
    if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    const token = await getAccessToken();
    const timestamp = dayjs().format('YYYYMMDDHHmmss');

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(amount),
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
      AccountReference: purchase.purchaseNumber,
      TransactionDesc: `Payment for ${purchase.purchaseNumber}`,
    };

    console.log('📲 STK Push Payload:', payload);

    const response = await axios.post(
      'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    console.log('📲 STK Response:', response.data);

    // Store payment metadata in purchase
    if (response.data.ResponseCode === '0') {
      purchase.paymentMetadata = {
        ...purchase.paymentMetadata,
        checkoutRequestID: response.data.CheckoutRequestID,
        merchantRequestID: response.data.MerchantRequestID,
        phoneNumber: formattedPhone,
        amount: amount,
      };
      purchase.paymentMethod = 'MPESA';
      await purchase.save();
    }

    return NextResponse.json(response.data);
    
  } catch (error: any) {
    console.error('❌ STK Push error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to initiate payment',
        ResponseCode: '1',
        ResponseDescription: error.message || 'Payment initiation failed'
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
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
}
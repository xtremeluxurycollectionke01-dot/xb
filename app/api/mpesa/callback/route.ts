/*import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  const result = data?.Body?.stkCallback;

  console.log("🔁 CALLBACK RECEIVED:", JSON.stringify(result, null, 2));

  if (result.ResultCode === 0) {
    const items = result.CallbackMetadata.Item;

    const mpesaCode = items.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
    const phone = items.find((i: any) => i.Name === "PhoneNumber")?.Value;
    const amount = items.find((i: any) => i.Name === "Amount")?.Value;

    console.log("✅ PAYMENT SUCCESS:");
    console.log({ mpesaCode, phone, amount });

    // 👉 NEXT: update your DB order = PAID
  } else {
    console.log("❌ PAYMENT FAILED");
  }

  return NextResponse.json({ ResultCode: 0 });
}*/

// app/api/mpesa/callback/route.ts (Updated)
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { Payment } from "@/models/Payment.model";
import { Order } from "@/models/Orders";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const data = await req.json();
    const result = data?.Body?.stkCallback;

    console.log("🔁 M-Pesa Callback Received:", JSON.stringify(result, null, 2));

    if (!result) {
      console.error("❌ Invalid callback data structure");
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid callback data" });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = result;

    // Find payment by CheckoutRequestID
    let payment = await Payment.findOne({ 
      "metadata.checkoutRequestID": CheckoutRequestID 
    });

    if (!payment) {
      console.warn(`⚠️ Payment not found for CheckoutRequestID: ${CheckoutRequestID}`);
      
      // Try to find by merchant request ID
      payment = await Payment.findOne({ 
        "metadata.merchantRequestID": MerchantRequestID 
      });
    }

    if (!payment) {
      console.error(`❌ No payment record found for transaction: ${CheckoutRequestID}`);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Payment record not found" });
    }

    // Process successful payment
    if (ResultCode === 0) {
      console.log(`✅ Payment successful for ${payment.paymentId}`);
      
      // Extract metadata from callback
      const items = CallbackMetadata?.Item || [];
      
      const mpesaReceiptNumber = items.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
      const transactionDate = items.find((i: any) => i.Name === "TransactionDate")?.Value;
      const phoneNumber = items.find((i: any) => i.Name === "PhoneNumber")?.Value;
      const amount = items.find((i: any) => i.Name === "Amount")?.Value;
      
      // Update payment record
      await payment.markAsCompleted(mpesaReceiptNumber, {
        resultCode: ResultCode,
        resultDesc: ResultDesc,
        transactionDate: transactionDate?.toString(),
        phoneNumber: phoneNumber,
        mpesaReceiptNumber: mpesaReceiptNumber,
        checkoutRequestID: CheckoutRequestID,
        merchantRequestID: MerchantRequestID
      });
      
      // Also update the order status if needed
      const order = await Order.findById(payment.orderId);
      if (order && order.status === 'DRAFT') {
        order.status = 'CONFIRMED';
        //order.statusHistory.push({
        //  status: 'CONFIRMED',
        //  changedBy: order.createdBy,
        //  reason: `Payment confirmed via M-Pesa - Receipt: ${mpesaReceiptNumber}`
        //});
        order.statusHistory.push({
          status: 'CONFIRMED',
          changedBy: order.createdBy,
          changedAt: new Date(),
          reason: `Payment confirmed via M-Pesa - Receipt: ${mpesaReceiptNumber}`
        });
        await order.save();
        console.log(`✅ Order ${order.orderNumber} confirmed after payment`);
      }
      
      console.log(`💾 Payment record updated:`, {
        paymentId: payment.paymentId,
        orderNumber: payment.orderNumber,
        amount: payment.amount,
        receipt: mpesaReceiptNumber
      });
      
    } else {
      // Payment failed
      console.error(`❌ Payment failed for ${payment.paymentId}: ${ResultDesc}`);
      
      await payment.markAsFailed(ResultCode.toString(), ResultDesc);
      
      console.log(`💾 Failed payment recorded:`, {
        paymentId: payment.paymentId,
        orderNumber: payment.orderNumber,
        errorCode: ResultCode,
        errorMessage: ResultDesc
      });
    }
    
    // Always return success to Safaricom
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
    
  } catch (error: any) {
    console.error("❌ Callback processing error:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: error.message });
  }
}
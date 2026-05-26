import { NextResponse } from "next/server";

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
}
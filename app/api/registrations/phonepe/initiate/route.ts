import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getPhonePeConfig } from "@/src/lib/phonepe";
import { getPhonePeEnvironment } from "@/lib/payments/phonepe-env";
import { getSupabaseEnv, resolveSiteUrl } from "@/lib/env";
import { createPhonePePayment } from "@/src/lib/phonepe";

export async function POST(request: Request) {
  if (!getSupabaseEnv().configured) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  if (!getPhonePeConfig()) {
    return NextResponse.json({ error: "PhonePe not configured" }, { status: 503 });
  }

  let body: { registrationId?: string; returnOrigin?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const registrationId = body.registrationId;
  if (!registrationId) {
    return NextResponse.json({ error: "Registration ID required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { data: reg } = await supabase
    .from("event_registrations")
    .select("id, full_name, email, phone, amount_paise, payment_status, status, merchant_transaction_id")
    .eq("id", registrationId)
    .maybeSingle();

  if (!reg) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  if (reg.payment_status === "paid" || reg.status === "confirmed") {
    return NextResponse.json({ error: "Registration already paid" }, { status: 400 });
  }

  if ((reg.amount_paise ?? 0) < 100) {
    return NextResponse.json({ error: "No payment required for this registration" }, { status: 400 });
  }

  const merchantTransactionId =
    reg.merchant_transaction_id ??
    `GR${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

  if (!reg.merchant_transaction_id) {
    await supabase
      .from("event_registrations")
      .update({
        merchant_transaction_id: merchantTransactionId,
        payment_status: "pending",
        payment_environment: getPhonePeEnvironment(),
      })
      .eq("id", reg.id);
  }

  const normalizedPhone = String(reg.phone ?? "").replace(/\D/g, "").slice(-10);

  try {
    const siteUrl = resolveSiteUrl(request, body.returnOrigin ?? request.headers.get("origin"));
    const payment = await createPhonePePayment(
      {
        merchantTransactionId,
        amountPaise: reg.amount_paise,
        userId: reg.email,
        mobileNumber: normalizedPhone,
      },
      {
        siteUrl,
        returnPath: `/registration/status/?id=${encodeURIComponent(merchantTransactionId)}`,
      },
    );

    return NextResponse.json({
      redirectUrl: payment.redirectUrl,
      merchantTransactionId,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Payment failed" },
      { status: 502 },
    );
  }
}

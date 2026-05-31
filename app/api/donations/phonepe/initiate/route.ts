import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createPhonePePayment, getPhonePeConfig } from "@/src/lib/phonepe";
import { getPhonePeEnvironment } from "@/lib/payments/phonepe-env";
import { getSupabaseEnv, resolveSiteUrl } from "@/lib/env";

const bodySchema = z.object({
  tierSlug: z.string().optional(),
  amountPaise: z.number().int().min(100).optional(),
  donorName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  organization: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  pinCode: z.string().optional(),
  /** Browser origin — used when proxy headers are missing; must match request Host. */
  returnOrigin: z.string().url().optional(),
});

export async function POST(request: Request) {
  if (!getSupabaseEnv().configured) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  if (!getPhonePeConfig()) {
    return NextResponse.json(
      {
        error:
          "PhonePe not configured. Add PHONEPE_CLIENT_ID, PHONEPE_CLIENT_SECRET, and PHONEPE_CLIENT_VERSION to .env.local (legacy PHONEPE_MERCHANT_ID / PHONEPE_SALT_KEY also work).",
      },
      { status: 503 },
    );
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  let amountPaise = body.amountPaise ?? 0;
  let tierId: string | null = null;

  if (body.tierSlug) {
    const { data: tier } = await supabase
      .from("donation_tiers")
      .select("id, amount_paise")
      .eq("slug", body.tierSlug)
      .eq("is_enabled", true)
      .maybeSingle();
    if (!tier) {
      return NextResponse.json({ error: "Invalid donation tier" }, { status: 400 });
    }
    amountPaise = tier.amount_paise;
    tierId = tier.id;
  }

  if (amountPaise < 100) {
    return NextResponse.json({ error: "Amount required" }, { status: 400 });
  }

  const merchantTransactionId = `GT${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
  const normalizedPhone = body.phone.replace(/\D/g, "").slice(-10);
  if (normalizedPhone.length < 10) {
    return NextResponse.json({ error: "Valid phone is required" }, { status: 400 });
  }

  const { error: insertError } = await supabase.from("donations").insert({
    tier_id: tierId,
    donor_name: body.donorName,
    email: body.email,
    phone: normalizedPhone,
    organization: body.organization,
    country: body.country,
    state: body.state,
    district: body.district,
    pin_code: body.pinCode,
    amount_paise: amountPaise,
    merchant_transaction_id: merchantTransactionId,
    payment_provider: "phonepe",
    payment_environment: getPhonePeEnvironment(),
    status: "initiated",
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  try {
    const siteUrl = resolveSiteUrl(
      request,
      body.returnOrigin ?? request.headers.get("origin"),
    );
    const payment = await createPhonePePayment(
      {
        merchantTransactionId,
        amountPaise,
        userId: body.email,
        mobileNumber: normalizedPhone,
      },
      { siteUrl },
    );
    return NextResponse.json({
      redirectUrl: payment.redirectUrl,
      merchantTransactionId,
      returnUrl: payment.returnUrl,
    });
  } catch (e) {
    await supabase
      .from("donations")
      .update({ status: "failed" })
      .eq("merchant_transaction_id", merchantTransactionId);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Payment failed" },
      { status: 502 },
    );
  }
}

import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  checkPhonePeStatus,
  getPhonePeTransactionId,
  isPhonePePaymentSuccessful,
  verifyPhonePeWebhook,
} from "@/src/lib/phonepe";

type WebhookPayload = {
  event?: string;
  payload?: {
    merchantOrderId?: string;
    state?: string;
    paymentDetails?: Array<{ transactionId?: string }>;
  };
};

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!verifyPhonePeWebhook(authHeader)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as WebhookPayload;
    const merchantTransactionId = body.payload?.merchantOrderId;
    const webhookState = body.payload?.state;
    const event = body.event;

    if (!merchantTransactionId) {
      return NextResponse.json({ ok: true });
    }

    const supabase = createServiceRoleClient();
    const success =
      event === "checkout.order.completed" ||
      webhookState === "COMPLETED" ||
      (event !== "checkout.order.failed" &&
        webhookState !== "FAILED" &&
        isPhonePePaymentSuccessful(body.payload ?? {}));

    const failed = event === "checkout.order.failed" || webhookState === "FAILED";

    let statusRes: Awaited<ReturnType<typeof checkPhonePeStatus>> | null = null;
    if (!success && !failed) {
      statusRes = await checkPhonePeStatus(merchantTransactionId);
    }

    const paymentSuccess = success || (statusRes ? isPhonePePaymentSuccessful(statusRes) : false);
    const phonepeTransactionId =
      body.payload?.paymentDetails?.[0]?.transactionId ??
      (statusRes ? getPhonePeTransactionId(statusRes) : null);

    await supabase
      .from("donations")
      .update({
        status: paymentSuccess ? "success" : failed ? "failed" : "initiated",
        phonepe_transaction_id: phonepeTransactionId,
        callback_payload: statusRes ?? body,
        updated_at: new Date().toISOString(),
      })
      .eq("merchant_transaction_id", merchantTransactionId);

    if (paymentSuccess) {
      const { fulfillSuccessfulDonation } = await import("@/lib/donations/fulfill-donation");
      await fulfillSuccessfulDonation(merchantTransactionId);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[PhonePe callback]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

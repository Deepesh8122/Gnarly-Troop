import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  checkPhonePeStatus,
  getPhonePeTransactionId,
  isPhonePePaymentSuccessful,
  verifyPhonePeCallback,
  verifyPhonePeWebhook,
} from "@/src/lib/phonepe";

type WebhookPayload = {
  event?: string;
  response?: string;
  payload?: {
    merchantOrderId?: string;
    state?: string;
    paymentDetails?: Array<{ transactionId?: string }>;
  };
};

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let body: WebhookPayload = {};
    try {
      body = rawBody ? (JSON.parse(rawBody) as WebhookPayload) : {};
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const base64Response = body.response;
    const v1Checksum =
      request.headers.get("x-verify") ?? request.headers.get("X-VERIFY") ?? "";

    if (base64Response) {
      if (v1Checksum && !verifyPhonePeCallback(base64Response, v1Checksum)) {
        return NextResponse.json({ error: "Invalid checksum" }, { status: 401 });
      }

      const decoded = JSON.parse(Buffer.from(base64Response, "base64").toString("utf8"));
      const merchantTransactionId = decoded?.data?.merchantTransactionId as string | undefined;
      if (!merchantTransactionId) {
        return NextResponse.json({ ok: true });
      }

      const supabase = createServiceRoleClient();
      const statusRes = await checkPhonePeStatus(merchantTransactionId);
      const success = isPhonePePaymentSuccessful(statusRes);

      await supabase
        .from("donations")
        .update({
          status: success ? "success" : "failed",
          phonepe_transaction_id: getPhonePeTransactionId(statusRes),
          callback_payload: statusRes,
          updated_at: new Date().toISOString(),
        })
        .eq("merchant_transaction_id", merchantTransactionId);

      if (success) {
        const { fulfillSuccessfulDonation } = await import("@/lib/donations/fulfill-donation");
        await fulfillSuccessfulDonation(merchantTransactionId);
      }

      return NextResponse.json({ ok: true });
    }

    const authHeader = request.headers.get("authorization");
    if (!verifyPhonePeWebhook(authHeader)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      try {
        statusRes = await checkPhonePeStatus(merchantTransactionId);
      } catch (error) {
        console.error("[PhonePe callback] status check failed", merchantTransactionId, error);
      }
    }

    const phonepeTransactionId =
      body.payload?.paymentDetails?.[0]?.transactionId ??
      (statusRes ? getPhonePeTransactionId(statusRes) : null);

    const verifiedSuccess =
      Boolean(phonepeTransactionId) &&
      (success ||
        event === "checkout.order.completed" ||
        webhookState === "COMPLETED" ||
        (statusRes ? isPhonePePaymentSuccessful(statusRes) : false));

    await supabase
      .from("donations")
      .update({
        status: verifiedSuccess ? "success" : failed ? "failed" : "initiated",
        phonepe_transaction_id: phonepeTransactionId,
        callback_payload: statusRes ?? body,
        updated_at: new Date().toISOString(),
      })
      .eq("merchant_transaction_id", merchantTransactionId);

    if (verifiedSuccess) {
      const { fulfillSuccessfulDonation } = await import("@/lib/donations/fulfill-donation");
      await fulfillSuccessfulDonation(merchantTransactionId);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[PhonePe callback]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

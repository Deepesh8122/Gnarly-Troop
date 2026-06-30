import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  checkPhonePeStatus,
  getPhonePeTransactionId,
  isPhonePePaymentSuccessful,
  verifyPhonePeCallback,
  verifyPhonePeWebhook,
} from "@/src/lib/phonepe";
import { fulfillSuccessfulDonation } from "@/lib/donations/fulfill-donation";
import { isRegistrationMerchantId } from "@/lib/registration/fulfill-registration-payment";

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

      if (isRegistrationMerchantId(merchantTransactionId)) {
        const phonepeId = getPhonePeTransactionId(statusRes);
        if (success) {
          if (phonepeId) {
            await supabase
              .from("event_registrations")
              .update({ phonepe_transaction_id: phonepeId })
              .eq("merchant_transaction_id", merchantTransactionId);
          }
          const { markRegistrationPaymentPaid } = await import(
            "@/lib/registration/mark-registration-paid"
          );
          await markRegistrationPaymentPaid(merchantTransactionId);
        } else {
          await supabase
            .from("event_registrations")
            .update({
              payment_status: "failed",
              status: "failed",
              phonepe_transaction_id: phonepeId,
            })
            .eq("merchant_transaction_id", merchantTransactionId);
        }
      } else {
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
          await fulfillSuccessfulDonation(merchantTransactionId);
        }
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

    if (isRegistrationMerchantId(merchantTransactionId)) {
      if (verifiedSuccess) {
        if (phonepeTransactionId) {
          await supabase
            .from("event_registrations")
            .update({ phonepe_transaction_id: phonepeTransactionId })
            .eq("merchant_transaction_id", merchantTransactionId);
        }
        const { markRegistrationPaymentPaid } = await import(
          "@/lib/registration/mark-registration-paid"
        );
        await markRegistrationPaymentPaid(merchantTransactionId);
      } else if (failed) {
        await supabase
          .from("event_registrations")
          .update({
            payment_status: "failed",
            status: "failed",
            phonepe_transaction_id: phonepeTransactionId,
          })
          .eq("merchant_transaction_id", merchantTransactionId);
      }
    } else {
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
        await fulfillSuccessfulDonation(merchantTransactionId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[PhonePe callback]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

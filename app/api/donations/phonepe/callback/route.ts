import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { checkPhonePeStatus, verifyPhonePeCallback } from "@/src/lib/phonepe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const base64Response = body.response as string | undefined;
    const checksum =
      request.headers.get("x-verify") ?? request.headers.get("X-VERIFY") ?? "";

    if (base64Response && checksum && !verifyPhonePeCallback(base64Response, checksum)) {
      return NextResponse.json({ error: "Invalid checksum" }, { status: 401 });
    }

    let merchantTransactionId: string | undefined;
    let phonepeState: string | undefined;

    if (base64Response) {
      const decoded = JSON.parse(Buffer.from(base64Response, "base64").toString("utf8"));
      merchantTransactionId = decoded?.data?.merchantTransactionId;
      phonepeState = decoded?.code;
    }

    if (!merchantTransactionId) {
      return NextResponse.json({ ok: true });
    }

    const supabase = createServiceRoleClient();
    const statusRes = await checkPhonePeStatus(merchantTransactionId);
    const success =
      statusRes?.code === "PAYMENT_SUCCESS" ||
      statusRes?.data?.state === "COMPLETED" ||
      phonepeState === "PAYMENT_SUCCESS";

    await supabase
      .from("donations")
      .update({
        status: success ? "success" : "failed",
        phonepe_transaction_id: statusRes?.data?.transactionId ?? null,
        callback_payload: statusRes ?? body,
        updated_at: new Date().toISOString(),
      })
      .eq("merchant_transaction_id", merchantTransactionId);

    if (success) {
      const { fulfillSuccessfulDonation } = await import("@/lib/donations/fulfill-donation");
      await fulfillSuccessfulDonation(merchantTransactionId);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[PhonePe callback]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

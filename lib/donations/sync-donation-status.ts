import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  checkPhonePeStatus,
  getPhonePeTransactionId,
  isPhonePePaymentSuccessful,
} from "@/src/lib/phonepe";
import { fulfillSuccessfulDonation } from "@/lib/donations/fulfill-donation";

export async function syncDonationPaymentStatus(merchantTransactionId: string): Promise<{
  status: "success" | "failed" | "initiated" | "unknown";
}> {
  const supabase = createServiceRoleClient();
  const { data: donation } = await supabase
    .from("donations")
    .select("id, status, phonepe_transaction_id")
    .eq("merchant_transaction_id", merchantTransactionId)
    .maybeSingle();

  if (!donation) return { status: "unknown" };

  if (donation.status === "failed") {
    return { status: "failed" };
  }

  if (donation.status === "success" && donation.phonepe_transaction_id) {
    await fulfillSuccessfulDonation(merchantTransactionId);
    return { status: "success" };
  }

  try {
    const statusRes = await checkPhonePeStatus(merchantTransactionId);
    const success = isPhonePePaymentSuccessful(statusRes);
    const phonepeTransactionId = getPhonePeTransactionId(statusRes);

    if (success && phonepeTransactionId) {
      await supabase
        .from("donations")
        .update({
          status: "success",
          phonepe_transaction_id: phonepeTransactionId,
          callback_payload: statusRes,
          updated_at: new Date().toISOString(),
        })
        .eq("merchant_transaction_id", merchantTransactionId);

      await fulfillSuccessfulDonation(merchantTransactionId);
      return { status: "success" };
    }

    if (statusRes?.state === "FAILED") {
      await supabase
        .from("donations")
        .update({
          status: "failed",
          callback_payload: statusRes,
          updated_at: new Date().toISOString(),
        })
        .eq("merchant_transaction_id", merchantTransactionId);
      return { status: "failed" };
    }

    if (donation.status === "success" && !phonepeTransactionId) {
      await supabase
        .from("donations")
        .update({
          status: "initiated",
          phonepe_transaction_id: null,
          callback_payload: statusRes,
          updated_at: new Date().toISOString(),
        })
        .eq("merchant_transaction_id", merchantTransactionId);
    }

    return { status: "initiated" };
  } catch (error) {
    console.error("[syncDonationPaymentStatus]", merchantTransactionId, error);
    if (donation.status === "success" && donation.phonepe_transaction_id) {
      await fulfillSuccessfulDonation(merchantTransactionId);
      return { status: "success" };
    }
    return { status: "initiated" };
  }
}

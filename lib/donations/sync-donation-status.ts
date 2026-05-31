import { createServiceRoleClient } from "@/lib/supabase/server";
import { checkPhonePeStatus } from "@/src/lib/phonepe";
import { fulfillSuccessfulDonation } from "@/lib/donations/fulfill-donation";

export async function syncDonationPaymentStatus(merchantTransactionId: string): Promise<{
  status: "success" | "failed" | "initiated" | "unknown";
}> {
  const supabase = createServiceRoleClient();
  const { data: donation } = await supabase
    .from("donations")
    .select("id, status")
    .eq("merchant_transaction_id", merchantTransactionId)
    .maybeSingle();

  if (!donation) return { status: "unknown" };

  if (donation.status === "success") {
    await fulfillSuccessfulDonation(merchantTransactionId);
    return { status: "success" };
  }

  if (donation.status === "failed") {
    return { status: "failed" };
  }

  try {
    const statusRes = await checkPhonePeStatus(merchantTransactionId);
    const success =
      statusRes?.code === "PAYMENT_SUCCESS" || statusRes?.data?.state === "COMPLETED";

    const newStatus = success ? "success" : donation.status === "initiated" ? "initiated" : "failed";

    if (success) {
      await supabase
        .from("donations")
        .update({
          status: "success",
          phonepe_transaction_id: statusRes?.data?.transactionId ?? null,
          callback_payload: statusRes,
          updated_at: new Date().toISOString(),
        })
        .eq("merchant_transaction_id", merchantTransactionId);

      await fulfillSuccessfulDonation(merchantTransactionId);
      return { status: "success" };
    }

    return { status: newStatus as "initiated" | "failed" };
  } catch {
    return { status: "initiated" };
  }
}

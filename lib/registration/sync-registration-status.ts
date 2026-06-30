import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  checkPhonePeStatus,
  getPhonePeTransactionId,
  isPhonePePaymentSuccessful,
} from "@/src/lib/phonepe";
import { markRegistrationPaymentPaid } from "@/lib/registration/mark-registration-paid";

export async function syncRegistrationPaymentStatus(
  merchantTransactionId: string,
): Promise<{ status: string; payment_status: string } | null> {
  const supabase = createServiceRoleClient();
  const { data: reg } = await supabase
    .from("event_registrations")
    .select("id, payment_status, status, phonepe_transaction_id")
    .eq("merchant_transaction_id", merchantTransactionId)
    .maybeSingle();

  if (!reg) return null;

  if (reg.payment_status === "paid") {
    return { status: reg.status, payment_status: reg.payment_status };
  }

  try {
    const statusRes = await checkPhonePeStatus(merchantTransactionId);
    const success = isPhonePePaymentSuccessful(statusRes);
    const phonepeId = getPhonePeTransactionId(statusRes);

    if (success && phonepeId) {
      await supabase
        .from("event_registrations")
        .update({ phonepe_transaction_id: phonepeId })
        .eq("merchant_transaction_id", merchantTransactionId);

      await markRegistrationPaymentPaid(merchantTransactionId);
      return { status: "pending_review", payment_status: "paid" };
    }

    if (!success && phonepeId) {
      await supabase
        .from("event_registrations")
        .update({ payment_status: "failed", phonepe_transaction_id: phonepeId, status: "failed" })
        .eq("merchant_transaction_id", merchantTransactionId);
      return { status: "failed", payment_status: "failed" };
    }
  } catch (error) {
    console.error("[syncRegistrationPaymentStatus]", merchantTransactionId, error);
  }

  return { status: reg.status, payment_status: reg.payment_status };
}

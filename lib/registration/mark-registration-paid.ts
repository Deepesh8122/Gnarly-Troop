import { createServiceRoleClient } from "@/lib/supabase/server";
import { isRegistrationMerchantId } from "@/lib/registration/fulfill-registration-payment";
import { deliverRegistrationPass } from "@/lib/registration/deliver-registration-pass";

export async function markRegistrationPaymentPaid(merchantTransactionId: string): Promise<void> {
  if (!isRegistrationMerchantId(merchantTransactionId)) return;

  const supabase = createServiceRoleClient();
  const { data: reg } = await supabase
    .from("event_registrations")
    .select(
      "id, full_name, email, phone, whatsapp_number, delegate_id, payment_status, status, metadata",
    )
    .eq("merchant_transaction_id", merchantTransactionId)
    .maybeSingle();

  if (!reg || reg.payment_status === "paid") {
    return;
  }

  const wasPendingPayment = reg.status === "pending_payment";

  await supabase
    .from("event_registrations")
    .update({
      payment_status: "paid",
      status: "pending_review",
    })
    .eq("merchant_transaction_id", merchantTransactionId);

  if (wasPendingPayment) {
    try {
      await deliverRegistrationPass({
        registrationId: reg.id,
        notifyReceived: true,
      });
    } catch (error) {
      console.error("[markRegistrationPaymentPaid] pass delivery failed", merchantTransactionId, error);
    }
  }
}

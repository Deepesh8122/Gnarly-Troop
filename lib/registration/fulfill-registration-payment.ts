import { createServiceRoleClient } from "@/lib/supabase/server";

export function isRegistrationMerchantId(merchantTransactionId: string): boolean {
  return merchantTransactionId.startsWith("GR");
}

/** Payment success moves registration to secretariat review — PDF sent only after admin approval. */
export async function fulfillSuccessfulRegistration(merchantTransactionId: string): Promise<void> {
  const { markRegistrationPaymentPaid } = await import("@/lib/registration/mark-registration-paid");
  await markRegistrationPaymentPaid(merchantTransactionId);
}

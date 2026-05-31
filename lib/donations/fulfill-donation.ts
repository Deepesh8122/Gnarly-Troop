import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendDonationEmail } from "@/lib/mail";
import { generateDonationReceiptPdf } from "@/lib/pdf/donation-receipt";

type DonationRow = {
  id: string;
  donor_name: string;
  email: string;
  amount_paise: number;
  merchant_transaction_id: string;
  organization?: string | null;
  state?: string | null;
  district?: string | null;
  phonepe_transaction_id?: string | null;
  created_at?: string | null;
  receipt_sent_at?: string | null;
  status: string;
};

export async function fulfillSuccessfulDonation(merchantTransactionId: string): Promise<void> {
  const supabase = createServiceRoleClient();
  const { data: donation } = await supabase
    .from("donations")
    .select("*")
    .eq("merchant_transaction_id", merchantTransactionId)
    .maybeSingle();

  if (!donation || donation.status !== "success" || donation.receipt_sent_at) {
    return;
  }

  const row = donation as DonationRow;
  const amount = (row.amount_paise / 100).toLocaleString("en-IN");

  const pdf = await generateDonationReceiptPdf({
    donorName: row.donor_name,
    email: row.email,
    amountPaise: row.amount_paise,
    merchantTransactionId: row.merchant_transaction_id,
    organization: row.organization,
    state: row.state,
    district: row.district,
    createdAt: row.created_at,
    phonepeTransactionId: row.phonepe_transaction_id,
  });

  const text = [
    `Dear ${row.donor_name},`,
    "",
    `Thank you for donating Rs. ${amount} to Gnarly Troop Global Federation.`,
    "",
    "Your payment was successful. Please find your acknowledgement PDF attached.",
    "",
    `Reference: ${row.merchant_transaction_id}`,
    "",
    "With gratitude,",
    "Gnarly Troop Global Federation",
  ].join("\n");

  await sendDonationEmail(
    row.email,
    "Thank you for your donation — Gnarly Troop",
    text,
    pdf,
  );

  await supabase
    .from("donations")
    .update({ receipt_sent_at: new Date().toISOString() })
    .eq("id", row.id);
}

import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/env";
import {
  sendDonationReceiptEmail,
  sendMembershipReceiptEmail,
} from "@/lib/mail";
import { generateDonationReceiptPdf } from "@/lib/pdf/donation-receipt";
import { generateMembershipReceiptPdf } from "@/lib/pdf/membership-receipt";
import { storeReceiptPdf } from "@/lib/pdf/store-receipt-pdf";
import { receiptKindFromTierType } from "@/lib/receipts/types";

type DonationRow = {
  id: string;
  donor_name: string;
  email: string;
  phone?: string | null;
  amount_paise: number;
  merchant_transaction_id: string;
  organization?: string | null;
  country?: string | null;
  state?: string | null;
  district?: string | null;
  pin_code?: string | null;
  pan?: string | null;
  phonepe_transaction_id?: string | null;
  created_at?: string | null;
  receipt_sent_at?: string | null;
  receipt_kind?: string | null;
  status: string;
  tier_id?: string | null;
};

type TierRow = {
  title: string;
  receipt_type?: string | null;
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
  const siteUrl = getSiteUrl();

  let tier: TierRow | null = null;
  if (row.tier_id) {
    const { data } = await supabase
      .from("donation_tiers")
      .select("title, receipt_type")
      .eq("id", row.tier_id)
      .maybeSingle();
    tier = data as TierRow | null;
  }

  const receiptKind = receiptKindFromTierType(tier?.receipt_type ?? row.receipt_kind);
  const amount = (row.amount_paise / 100).toLocaleString("en-IN");

  try {
    const common = {
      donorName: row.donor_name,
      memberName: row.donor_name,
      email: row.email,
      phone: row.phone,
      amountPaise: row.amount_paise,
      merchantTransactionId: row.merchant_transaction_id,
      organization: row.organization,
      country: row.country,
      state: row.state,
      district: row.district,
      pinCode: row.pin_code,
      pan: row.pan,
      createdAt: row.created_at,
      siteUrl,
    };

    const pdf =
      receiptKind === "membership"
        ? await generateMembershipReceiptPdf({
            ...common,
            membershipCategory: tier?.title ?? "Global Access",
          })
        : await generateDonationReceiptPdf(common);

    const storageFolder = receiptKind === "membership" ? "memberships" : "donations";
    const stored = await storeReceiptPdf(storageFolder, row.id, pdf);

    if (receiptKind === "membership") {
      await sendMembershipReceiptEmail({
        to: row.email,
        memberName: row.donor_name,
        amountLabel: `Rs. ${amount}`,
        reference: row.merchant_transaction_id,
        pdfBuffer: pdf,
      });
    } else {
      await sendDonationReceiptEmail({
        to: row.email,
        donorName: row.donor_name,
        amountLabel: `Rs. ${amount}`,
        reference: row.merchant_transaction_id,
        pdfBuffer: pdf,
      });
    }

    await supabase
      .from("donations")
      .update({
        receipt_sent_at: new Date().toISOString(),
        receipt_kind: receiptKind,
        ...(stored ? { receipt_storage_path: stored.storagePath } : {}),
      })
      .eq("id", row.id);
  } catch (error) {
    console.error("[fulfillSuccessfulDonation] receipt email failed", merchantTransactionId, error);
  }
}

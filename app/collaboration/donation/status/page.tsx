import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import Link from "next/link";
import { getDonationByMerchantId } from "@/lib/services/donations";
import { checkPhonePeStatus } from "@/src/lib/phonepe";

type Props = { searchParams: Promise<{ id?: string }> };

export default async function DonationStatusPage({ searchParams }: Props) {
  const { id } = await searchParams;
  let donation = id ? await getDonationByMerchantId(id) : null;

  if (id && donation?.status === "initiated") {
    try {
      const status = await checkPhonePeStatus(id);
      const success =
        status?.code === "PAYMENT_SUCCESS" || status?.data?.state === "COMPLETED";
      if (success) donation = { ...donation, status: "success" };
    } catch {
      /* ignore */
    }
  }

  const success = donation?.status === "success";

  return (
    <>
      <Header />
      <main style={{ padding: "120px 24px", textAlign: "center", minHeight: "50vh" }}>
        <h1>{success ? "Thank you for your donation" : "Payment status"}</h1>
        {donation ? (
          <>
            <p style={{ marginTop: 12 }}>
              {success
                ? `We received ₹${(donation.amount_paise / 100).toLocaleString("en-IN")} from ${donation.donor_name}.`
                : `Status: ${donation.status}. If you completed payment, it may take a minute to update.`}
            </p>
            <p style={{ color: "#666", fontSize: 14 }}>Reference: {donation.merchant_transaction_id}</p>
          </>
        ) : (
          <p style={{ marginTop: 12 }}>Donation reference not found.</p>
        )}
        <Link href="/" style={{ display: "inline-block", marginTop: 24, color: "#0b66b3" }}>
          ← Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}

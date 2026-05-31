import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import Link from "next/link";
import { getDonationByMerchantId } from "@/lib/services/donations";
import { syncDonationPaymentStatus } from "@/lib/donations/sync-donation-status";
import styles from "./DonationStatus.module.css";

type Props = { searchParams: Promise<{ id?: string }> };

export default async function DonationStatusPage({ searchParams }: Props) {
  const { id } = await searchParams;

  let donation = id ? await getDonationByMerchantId(id) : null;
  let paymentStatus: "success" | "failed" | "initiated" | "unknown" = "unknown";

  if (id && donation) {
    const synced = await syncDonationPaymentStatus(id);
    paymentStatus = synced.status;
    donation = await getDonationByMerchantId(id);
  }

  const success =
    paymentStatus === "success" ||
    (donation?.status === "success" && Boolean(donation.phonepe_transaction_id));

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.card}>
          <h1>{success ? "Thank you for your donation" : "Payment status"}</h1>
          {donation ? (
            <>
              <p className={styles.message}>
                {success
                  ? `We received Rs. ${(donation.amount_paise / 100).toLocaleString("en-IN")} from ${donation.donor_name}.`
                  : `Status: ${donation.status}. If you completed payment on PhonePe, it may take a minute to update.`}
              </p>
              {success && (
                <p className={styles.emailNote}>
                  A PDF acknowledgement with your name and payment details has been sent to{" "}
                  <strong>{donation.email}</strong>.
                </p>
              )}
              <p className={styles.ref}>Reference: {donation.merchant_transaction_id}</p>
            </>
          ) : (
            <p className={styles.message}>Donation reference not found.</p>
          )}
          <Link href="/" className={styles.link}>
            ← Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import Link from "next/link";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { registrationPassDownloadUrl } from "@/lib/registration/deliver-registration-pass";
import { formatFeeInr } from "@/lib/registration/gsce-config";
import { syncRegistrationPaymentStatus } from "@/lib/registration/sync-registration-status";
import styles from "../RegistrationPage.module.css";

type Props = { searchParams: Promise<{ id?: string }> };

export default async function RegistrationStatusPage({ searchParams }: Props) {
  const { id } = await searchParams;

  let reg: {
    id: string;
    full_name: string;
    email: string;
    amount_paise: number;
    delegate_id: string | null;
    merchant_transaction_id: string;
    payment_status: string;
    status: string;
    receipt_storage_path: string | null;
  } | null = null;

  if (id) {
    await syncRegistrationPaymentStatus(id);
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("event_registrations")
      .select(
        "id, full_name, email, amount_paise, delegate_id, merchant_transaction_id, payment_status, status, phonepe_transaction_id, receipt_storage_path",
      )
      .eq("merchant_transaction_id", id)
      .maybeSingle();
    reg = data;
  }

  const paid = reg?.payment_status === "paid";
  const approved = reg?.status === "approved";
  const pendingReview = reg?.status === "pending_review";
  const passDownloadUrl =
    reg?.id && reg.delegate_id
      ? registrationPassDownloadUrl(reg.id, reg.delegate_id)
      : null;

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.formWrap}>
          <div className={styles.closedCard}>
            <h1 style={{ marginTop: 0 }}>
              {approved
                ? "Registration confirmed"
                : pendingReview && paid
                  ? "Payment received — under review"
                  : pendingReview
                    ? "Application under review"
                    : "Payment status"}
            </h1>
            {reg ? (
              <>
                <p>
                  {approved
                    ? `Thank you, ${reg.full_name}. Your GSCE delegate registration is approved.`
                    : pendingReview && paid
                      ? `Thank you, ${reg.full_name}. Payment was successful. The Summit Secretariat is reviewing your accreditation.`
                      : pendingReview
                        ? `Thank you, ${reg.full_name}. Your application is under Secretariat review.`
                        : `Payment status: ${reg.payment_status}. If you completed payment on PhonePe, it may take a minute to update.`}
                </p>
                {reg.delegate_id && (
                  <p>
                    <strong>Delegate ID:</strong> {reg.delegate_id}
                  </p>
                )}
                {passDownloadUrl && (
                  <p>
                    <a href={passDownloadUrl} className="admin-link" download>
                      Download delegate pass (PDF) ↓
                    </a>
                  </p>
                )}
                {(approved || (pendingReview && passDownloadUrl)) && (
                  <p>
                    Your delegate pass {approved ? "has been" : "was"} sent to{" "}
                    <strong>{reg.email}</strong>
                    {passDownloadUrl ? " — you can also download it above." : "."}
                  </p>
                )}
                {pendingReview && !passDownloadUrl && (
                  <p>Your delegate pass will appear here once registration is saved.</p>
                )}
                <p>
                  <strong>Fee:</strong> {formatFeeInr(reg.amount_paise ?? 0)}
                </p>
                <p>
                  <strong>Reference:</strong> {reg.merchant_transaction_id}
                </p>
              </>
            ) : (
              <p>Registration reference not found.</p>
            )}
            <Link href="/registration/">← Back to registration portal</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

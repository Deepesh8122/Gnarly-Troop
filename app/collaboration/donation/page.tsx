import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import DonationForm from "@/components/donation/DonationForm";
import { getDonationTiers } from "@/lib/services/donations";
import { getPhonePeConfig } from "@/src/lib/phonepe";
import styles from "./DonationPage.module.css";

export const metadata = {
  title: "Donate — Gnarly Troop",
  description: "Support Gnarly Troop Global Federation via secure PhonePe payment.",
};

export default async function DonationPage() {
  const tiers = await getDonationTiers();
  const phonePeReady = Boolean(getPhonePeConfig());

  return (
    <>
      <Header />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Support our mission</p>
          <h1>Donate to Gnarly Troop</h1>
          <p className={styles.lead}>
            Enter your amount and details below. You will be redirected to PhonePe to pay via
            QR code, UPI apps, or card — no mobile number required on this form.
          </p>
          <ul className={styles.highlights}>
            <li>PhonePe secure checkout</li>
            <li>Scan QR or pay with any UPI app</li>
            <li>PDF acknowledgement emailed after payment</li>
          </ul>
        </header>

        <div className={styles.formArea}>
          <DonationForm tiers={tiers} phonePeReady={phonePeReady} />
        </div>
      </main>
      <Footer />
    </>
  );
}

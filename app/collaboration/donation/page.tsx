import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import DonationForm from "@/components/donation/DonationForm";
import { getDonationTiers } from "@/lib/services/donations";
import { getPhonePeConfig } from "@/src/lib/phonepe";

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
      <main className="donation-page">
        <div className="donation-inner">
          <h1>Donate to Gnarly Troop</h1>
          <p className="donation-lead">
            Your contribution supports youth leadership, cultural exchange, and community
            programs across India. Payments are processed securely via PhonePe.
          </p>
          {!phonePeReady && (
            <p className="donation-warn">
              Payment gateway is being configured. You can still submit details; contact
              president@gnarlytroop.org if payment does not start.
            </p>
          )}
          <DonationForm tiers={tiers} phonePeReady={phonePeReady} />
        </div>
      </main>
      <Footer />
      <style>{`
        .donation-page { padding: 120px 24px 80px; background: #f8f8f6; min-height: 60vh; }
        .donation-inner { max-width: 560px; margin: 0 auto; }
        .donation-page h1 { font-size: 2rem; font-weight: 800; margin: 0 0 12px; }
        .donation-lead { line-height: 1.6; color: #444; margin: 0 0 28px; }
        .donation-warn { background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; }
      `}</style>
    </>
  );
}

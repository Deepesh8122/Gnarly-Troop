"use client";

import { FormEvent, useState } from "react";

type Tier = {
  id: string;
  slug: string;
  title: string;
  amount_paise: number;
  description: string | null;
};

type Props = {
  tiers: Tier[];
  phonePeReady: boolean;
};

export default function DonationForm({ tiers, phonePeReady }: Props) {
  const [tierSlug, setTierSlug] = useState(tiers[0]?.slug ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      tierSlug: tierSlug || undefined,
      donorName: String(fd.get("donorName")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone")),
      organization: String(fd.get("organization") || ""),
      country: String(fd.get("country") || "India"),
      state: String(fd.get("state") || ""),
      district: String(fd.get("district") || ""),
      pinCode: String(fd.get("pinCode") || ""),
    };

    try {
      const res = await fetch("/api/donations/phonepe/initiate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Payment could not start");
      if (json.redirectUrl) {
        window.location.href = json.redirectUrl;
        return;
      }
      throw new Error("No redirect URL from PhonePe");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form className="donation-form" onSubmit={onSubmit}>
      {tiers.length > 0 && (
        <fieldset className="tier-fieldset">
          <legend>Choose amount</legend>
          {tiers.map((t) => (
            <label key={t.id} className="tier-option">
              <input
                type="radio"
                name="tier"
                value={t.slug}
                checked={tierSlug === t.slug}
                onChange={() => setTierSlug(t.slug)}
              />
              <span>
                <strong>{t.title}</strong> — ₹{(t.amount_paise / 100).toLocaleString("en-IN")}
                {t.description && <small>{t.description}</small>}
              </span>
            </label>
          ))}
        </fieldset>
      )}

      <label>
        Full name *
        <input name="donorName" required />
      </label>
      <label>
        Email *
        <input name="email" type="email" required />
      </label>
      <label>
        Mobile (PhonePe) *
        <input name="phone" type="tel" required pattern="[0-9]{10,15}" placeholder="10-digit mobile" />
      </label>
      <label>
        Organization
        <input name="organization" />
      </label>
      <div className="donation-row">
        <label>
          State
          <input name="state" />
        </label>
        <label>
          District
          <input name="district" />
        </label>
      </div>
      <label>
        PIN
        <input name="pinCode" />
      </label>

      {error && <p className="donation-error">{error}</p>}

      <button type="submit" disabled={loading || !phonePeReady} className="donation-submit">
        {loading ? "Redirecting to PhonePe…" : "Pay with PhonePe"}
      </button>

      <style>{`
        .donation-form { display: flex; flex-direction: column; gap: 14px; }
        .donation-form label { display: flex; flex-direction: column; gap: 4px; font-size: 0.85rem; font-weight: 600; }
        .donation-form input { padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem; }
        .tier-fieldset { border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
        .tier-option { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 8px; cursor: pointer; }
        .tier-option small { display: block; color: #666; font-weight: 400; }
        .donation-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .donation-submit { margin-top: 8px; padding: 14px; background: #5f259f; color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; }
        .donation-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .donation-error { color: #c00; font-size: 0.9rem; }
      `}</style>
    </form>
  );
}

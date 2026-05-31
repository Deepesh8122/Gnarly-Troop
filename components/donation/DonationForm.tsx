"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./DonationForm.module.css";
import {
  passwordManagerIgnoreFormAttrs,
  publicFormInputAttrs,
} from "@/lib/admin/form-attrs";

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

const CUSTOM_SLUG = "custom";

function DonorDetailsPlaceholder() {
  return (
    <>
      <label className={styles.field} aria-hidden="true">
        Full name *
        <input disabled tabIndex={-1} />
      </label>
      <label className={styles.field} aria-hidden="true">
        Email *
        <input type="email" disabled tabIndex={-1} />
      </label>
      <label className={styles.field} aria-hidden="true">
        Phone *
        <input type="tel" disabled tabIndex={-1} />
      </label>
    </>
  );
}

function DonorDetailsFields() {
  return (
    <>
      <label className={styles.field}>
        Full name *
        <input name="donorName" required {...publicFormInputAttrs("name")} />
      </label>
      <label className={styles.field}>
        Email *
        <input name="email" type="email" required {...publicFormInputAttrs("email")} />
      </label>
      <label className={styles.field}>
        Phone *
        <input name="phone" type="tel" required {...publicFormInputAttrs("tel")} />
      </label>
    </>
  );
}

export default function DonationForm({ tiers, phonePeReady }: Props) {
  const [selected, setSelected] = useState(tiers[0]?.slug ?? CUSTOM_SLUG);
  const [customRupees, setCustomRupees] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsMounted, setDetailsMounted] = useState(false);

  useEffect(() => {
    setDetailsMounted(true);
  }, []);

  const selectedTier = tiers.find((t) => t.slug === selected);
  const isCustom = selected === CUSTOM_SLUG;

  const displayAmount = useMemo(() => {
    if (isCustom) {
      const n = Number(customRupees);
      return Number.isFinite(n) && n > 0 ? n : null;
    }
    return selectedTier ? selectedTier.amount_paise / 100 : null;
  }, [isCustom, customRupees, selectedTier]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (isCustom) {
      const rupees = Number(customRupees);
      if (!Number.isFinite(rupees) || rupees < 1) {
        setError("Please enter an amount of at least Rs. 1.");
        return;
      }
    } else if (!selectedTier) {
      setError("Please select a donation amount.");
      return;
    }

    setLoading(true);
    const fd = new FormData(e.currentTarget);

    const payload: Record<string, unknown> = {
      donorName: String(fd.get("donorName")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone")),
    };

    if (isCustom) {
      payload.amountPaise = Math.round(Number(customRupees) * 100);
    } else if (selectedTier) {
      payload.tierSlug = selectedTier.slug;
    }

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
    <form className={styles.form} onSubmit={onSubmit} {...passwordManagerIgnoreFormAttrs}>
      <section className={styles.amountSection}>
        <h2 className={styles.sectionTitle}>Choose amount</h2>

        <div className={styles.tierGrid}>
          {tiers.map((t) => {
            const active = selected === t.slug;
            return (
              <button
                key={t.id}
                type="button"
                className={`${styles.tierCard} ${active ? styles.tierCardActive : ""}`}
                onClick={() => setSelected(t.slug)}
              >
                <span className={styles.tierAmount}>
                  Rs. {(t.amount_paise / 100).toLocaleString("en-IN")}
                </span>
                <span className={styles.tierTitle}>{t.title}</span>
                {t.description && <span className={styles.tierDesc}>{t.description}</span>}
              </button>
            );
          })}

          <button
            type="button"
            className={`${styles.tierCard} ${isCustom ? styles.tierCardActive : ""}`}
            onClick={() => setSelected(CUSTOM_SLUG)}
          >
            <span className={styles.tierAmount}>Custom</span>
            <span className={styles.tierTitle}>Other amount</span>
            <span className={styles.tierDesc}>From Rs. 1</span>
          </button>
        </div>

        {isCustom && (
          <div className={styles.customWrap}>
            <label className={styles.customLabel}>
              Enter amount (INR)
              <div className={styles.customInputRow}>
                <span className={styles.rupee}>Rs.</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={customRupees}
                  onChange={(e) => setCustomRupees(e.target.value)}
                  placeholder="e.g. 2500"
                  className={styles.customInput}
                  required={isCustom}
                />
              </div>
            </label>
          </div>
        )}

        {displayAmount != null && (
          <p className={styles.selectedSummary}>
            Amount: <strong>Rs. {displayAmount.toLocaleString("en-IN")}</strong>
          </p>
        )}
      </section>

      <section className={styles.detailsSection}>
        <h2 className={styles.sectionTitle}>Your details</h2>
        <p className={styles.sectionLead}>
          Used for your acknowledgement PDF and email. Payment happens on PhonePe (QR / UPI).
        </p>

        {detailsMounted ? <DonorDetailsFields /> : <DonorDetailsPlaceholder />}
      </section>

      {error && <p className={styles.error}>{error}</p>}

      {!phonePeReady && (
        <p className={styles.warn}>
          Payment gateway is being configured. Contact president@gnarlytroop.org if payment does
          not start.
        </p>
      )}

      <button type="submit" disabled={loading || !phonePeReady} className={styles.submit}>
        {loading ? (
          "Opening PhonePe…"
        ) : (
          <>
            <span className={styles.phonepeBadge}>PhonePe</span>
            Pay
            {displayAmount != null ? ` Rs. ${displayAmount.toLocaleString("en-IN")}` : ""} — QR / UPI
          </>
        )}
      </button>

      <p className={styles.secureNote}>
        You will be redirected to PhonePe to scan a QR code or pay with any UPI app. A PDF
        acknowledgement will be emailed after successful payment.
      </p>
    </form>
  );
}

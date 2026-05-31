"use client";

import { FormEvent, useState } from "react";
import styles from "./EventRegistrationForm.module.css";
import {
  REGISTRATION_ELIGIBILITY_OPTIONS,
  type RegistrationEvent,
} from "@/lib/registration/constants";
import { passwordManagerIgnoreFormAttrs } from "@/lib/admin/form-attrs";

type Props = {
  event: RegistrationEvent;
};

export default function EventRegistrationForm({ event }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      eventId: event.id,
      full_name: String(fd.get("full_name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      organization: String(fd.get("organization") ?? ""),
      designation: String(fd.get("designation") ?? ""),
      country: String(fd.get("country") ?? "India"),
      state: String(fd.get("state") ?? ""),
      city: String(fd.get("city") ?? ""),
      eligibility: String(fd.get("eligibility") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/events/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; message?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Registration failed");
      }
      setSuccess(json.message ?? "Registration successful!");
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon} aria-hidden>
          ✓
        </div>
        <h2>Registration received</h2>
        <p>{success}</p>
        <p className={styles.successHint}>
          Please check your inbox for the confirmation email with a PDF containing your name,
          eligibility, and event details.
        </p>
        <button type="button" className={styles.secondaryBtn} onClick={() => setSuccess(null)}>
          Register another delegate
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} {...passwordManagerIgnoreFormAttrs}>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Full name *</span>
          <input name="full_name" required autoComplete="name" />
        </label>
        <label className={styles.field}>
          <span>Email *</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label className={styles.field}>
          <span>Mobile *</span>
          <input name="phone" type="tel" required pattern="[0-9+\s-]{10,15}" placeholder="+91" />
        </label>
        <label className={styles.field}>
          <span>Designation / Title</span>
          <input name="designation" placeholder="e.g. Director, Youth Leader" />
        </label>
        <label className={styles.field}>
          <span>Organization</span>
          <input name="organization" />
        </label>
        <label className={styles.field}>
          <span>Country</span>
          <input name="country" defaultValue="India" />
        </label>
        <label className={styles.field}>
          <span>State</span>
          <input name="state" />
        </label>
        <label className={styles.field}>
          <span>City</span>
          <input name="city" />
        </label>
      </div>

      <label className={styles.fieldFull}>
        <span>Where is your eligibility? *</span>
        <select name="eligibility" required defaultValue="">
          <option value="" disabled>
            Select your eligibility category
          </option>
          {REGISTRATION_ELIGIBILITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <small className={styles.hint}>
          Choose the category that best describes your role at the summit. Our team may verify
          eligibility before final confirmation.
        </small>
      </label>

      <label className={styles.fieldFull}>
        <span>Additional message</span>
        <textarea name="message" rows={4} placeholder="Special requirements, delegation details, etc." />
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "Submitting…" : "Complete registration"}
      </button>
    </form>
  );
}

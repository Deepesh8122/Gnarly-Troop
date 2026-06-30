"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./GsceRegistrationForm.module.css";
import {
  ACCREDITATION_CATEGORIES,
  ACCREDITATION_GROUPS,
  DAY1_SESSIONS,
  DAY2_SESSIONS,
  accreditationLabel,
  categoriesByGroup,
  formatFeeInr,
  resolveRegistrationFee,
} from "@/lib/registration/gsce-config";
import type { RegistrationEvent } from "@/lib/registration/constants";
import RegistrationDocumentUpload from "@/components/registration/RegistrationDocumentUpload";
import { RegistrationFormField, RegistrationFormFieldFull } from "@/components/registration/RegistrationFormField";
import { passwordManagerIgnoreFormAttrs } from "@/lib/admin/form-attrs";
import {
  INITIAL_FORM_VALUES,
  firstFieldError,
  validateRegistrationStep,
  type FieldErrors,
  type RegistrationFormValues,
} from "@/lib/registration/form-validation";

type Props = {
  event: RegistrationEvent;
  phonePeReady: boolean;
};

const STEPS = [
  { id: "welcome", label: "Welcome" },
  { id: "accreditation", label: "Accreditation" },
  { id: "details", label: "Your details" },
  { id: "documents", label: "Documents" },
  { id: "preferences", label: "Preferences" },
  { id: "review", label: "Review" },
] as const;

const NETWORKING = [
  ["ministerial_meetings", "Ministerial Meetings"],
  ["ambassador_roundtables", "Ambassador Roundtables"],
  ["investor_networking", "Investor Networking"],
  ["business_matchmaking", "Business Matchmaking"],
  ["youth_exchange", "Youth Exchange"],
  ["cultural_partnerships", "Cultural Partnerships"],
  ["academic_collaborations", "Academic Collaborations"],
  ["media_interviews", "Media Interviews"],
] as const;

function paymentReturnOrigin(): string {
  const { protocol, hostname, port } = window.location;
  const host = port && port !== "80" && port !== "443" ? `${hostname}:${port}` : hostname;
  const secure =
    protocol === "https:" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".local");
  return `${secure ? protocol : "https:"}//${host}`;
}

function toggleInList(list: string[], id: string, on: boolean): string[] {
  if (on) return list.includes(id) ? list : [...list, id];
  return list.filter((x) => x !== id);
}

export default function GsceRegistrationForm({ event, phonePeReady }: Props) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<RegistrationFormValues>(INITIAL_FORM_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passInfo, setPassInfo] = useState<{
    downloadUrl?: string;
    delegateId?: string;
    emailSent?: boolean;
    emailError?: string;
    passError?: string;
  } | null>(null);
  const [uploads, setUploads] = useState<Record<string, { path: string; name: string }>>({});

  const fee = useMemo(
    () => (values.accreditation_category ? resolveRegistrationFee(values.accreditation_category) : null),
    [values.accreditation_category],
  );

  const roleOptions = values.categoryGroup ? categoriesByGroup(values.categoryGroup) : [];
  const progress = ((step + 1) / STEPS.length) * 100;

  function setField<K extends keyof RegistrationFormValues>(key: K, value: RegistrationFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setFieldErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function validateCurrentStep(): boolean {
    const errs = validateRegistrationStep(step, values);
    if (step === 2 && !uploads.photo?.path) {
      errs.photo = "Official photograph is required.";
    }
    setFieldErrors(errs);
    const summary = firstFieldError(errs);
    if (summary) {
      setError(summary);
      return false;
    }
    setError(null);
    return true;
  }

  function next() {
    if (!validateCurrentStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setFieldErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setLoading(true);
    setError(null);

    const payload = {
      eventId: event.id,
      accreditation_category: values.accreditation_category,
      full_name: values.full_name.trim(),
      designation: values.designation.trim(),
      organization: values.organization.trim(),
      country: values.country.trim() || "India",
      nationality: values.nationality.trim(),
      state: values.state.trim(),
      city: values.city.trim(),
      date_of_birth: values.date_of_birth,
      gender: values.gender,
      biography: values.biography.trim(),
      email: values.email.trim(),
      official_email: values.email.trim(),
      phone: values.phone.trim(),
      whatsapp_number: values.whatsapp_number.trim() || values.phone.trim(),
      alternative_email: values.alternative_email.trim(),
      emergency_contact_name: values.emergency_contact_name.trim(),
      emergency_contact_phone: values.emergency_contact_phone.trim(),
      participation_format: values.participation_format,
      attendance_days: values.attendance_days,
      photo_storage_path: uploads.photo?.path,
      passport_storage_path: uploads.passport?.path,
      visa_storage_path: uploads.visa?.path,
      government_id_storage_path: uploads.government_id?.path,
      returnOrigin: paymentReturnOrigin(),
      metadata: {
        identity_type: values.identity_type,
        passport_number: values.passport_number,
        passport_country: values.passport_country,
        passport_issue_date: values.passport_issue_date,
        passport_expiry_date: values.passport_expiry_date,
        visa_number: values.visa_number,
        day1_sessions: values.day1_sessions,
        day2_sessions: values.day2_sessions,
        airport_reception: values.airport_reception === "yes",
        accommodation_assistance: values.accommodation_assistance === "yes",
        interpreter_required: values.interpreter_required === "yes",
        interpreter_language: values.interpreter_language,
        dietary_preference: values.dietary_preference,
        accessibility_requirement: values.accessibility_requirement,
        networking_interests: values.networking_interests,
        diplomatic_note_path: uploads.diplomatic_note?.path,
        code_of_conduct: values.code_of_conduct,
        digital_consent_email: values.digital_consent_email,
        digital_consent_whatsapp: values.digital_consent_whatsapp,
        digital_consent_sms: values.digital_consent_sms,
        declaration_accepted: values.declaration_accepted,
        signature_place: values.signature_place,
      },
    };

    try {
      const res = await fetch("/api/events/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
        redirectUrl?: string;
        downloadUrl?: string;
        delegateId?: string;
        emailSent?: boolean;
        emailError?: string;
        passError?: string;
      };

      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Registration failed");
      }

      if (json.redirectUrl) {
        window.location.href = json.redirectUrl;
        return;
      }

      setPassInfo({
        downloadUrl: json.downloadUrl,
        delegateId: json.delegateId,
        emailSent: json.emailSent,
        emailError: json.emailError,
        passError: json.passError,
      });
      setSuccess(json.message ?? "Registration submitted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSuccess(null);
    setPassInfo(null);
    setStep(0);
    setValues(INITIAL_FORM_VALUES);
    setUploads({});
    setFieldErrors({});
    setError(null);
  }

  if (success) {
    return (
      <div className={styles.widget}>
        <div className={styles.successCard}>
          <div className={styles.successIcon} aria-hidden>✓</div>
          <h2>Application received</h2>
          <p>{success}</p>
          {passInfo?.delegateId && (
            <p className={styles.successHint}>
              <strong>Delegate ID:</strong> {passInfo.delegateId}
            </p>
          )}
          {passInfo?.downloadUrl ? (
            <a
              href={passInfo.downloadUrl}
              className={styles.primaryBtn}
              style={{ display: "inline-block", marginTop: 16, textDecoration: "none" }}
              download
            >
              Download delegate pass (PDF)
            </a>
          ) : passInfo?.passError ? (
            <p className={styles.warn}>{passInfo.passError}</p>
          ) : null}
          {passInfo?.emailError && (
            <p className={styles.warn}>
              Email could not be sent: {passInfo.emailError} You can still download the pass below.
            </p>
          )}
          {passInfo?.emailSent === false && !passInfo?.emailError && !passInfo?.passError && (
            <p className={styles.warn}>
              Email was not sent. Configure MailerSend SMTP (trial domain) or API in .env.local, or
              download the pass above.
            </p>
          )}
          <p className={styles.successHint}>
            The Secretariat will complete accreditation review. Keep your delegate pass for summit
            entry.
          </p>
          <button type="button" className={styles.secondaryBtn} onClick={resetForm}>
            Register another delegate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <div>
          <p className={styles.widgetEyebrow}>GSCE 2026 · Step {step + 1} of {STEPS.length}</p>
          <h2 className={styles.widgetTitle}>{STEPS[step].label}</h2>
        </div>
        <span className={styles.widgetStepLabel}>{STEPS[step].label}</span>
      </div>

      <div className={styles.progressTrack} aria-hidden>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <form className={styles.form} onSubmit={onSubmit} noValidate {...passwordManagerIgnoreFormAttrs}>
        {step === 0 && (
          <section className={styles.section}>
            <p className={styles.lead}>
              Official delegate registration for the Global Leadership &amp; Cultural Exchange Summit.
              Fields marked with <span className={styles.requiredMark}>*</span> are required.
            </p>
            <div className={styles.declaration}>
              <p>
                Applications are reviewed by the Summit Secretariat. Approved delegates receive a
                digital identity pass by email and WhatsApp.
              </p>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className={styles.section}>
            <p className={styles.lead}>First choose your group, then your specific accreditation role.</p>

            <RegistrationFormField
              label="Accreditation group"
              required
              error={fieldErrors.categoryGroup}
            >
              <select
                value={values.categoryGroup}
                onChange={(e) => {
                  setValues((v) => ({
                    ...v,
                    categoryGroup: e.target.value,
                    accreditation_category: "",
                  }));
                  setFieldErrors((er) => {
                    const n = { ...er };
                    delete n.categoryGroup;
                    delete n.accreditation_category;
                    return n;
                  });
                }}
              >
                <option value="">Select group — e.g. Diplomatic &amp; Government</option>
                {ACCREDITATION_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </RegistrationFormField>

            {values.categoryGroup && (
              <RegistrationFormField
                label="Your specific role"
                required
                error={fieldErrors.accreditation_category}
                hint="Choose the option that best matches your delegation status."
              >
                <select
                  value={values.accreditation_category}
                  onChange={(e) => setField("accreditation_category", e.target.value)}
                >
                  <option value="">Select role within {values.categoryGroup}</option>
                  {roleOptions.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </RegistrationFormField>
            )}

            {fee && values.accreditation_category && (
              <div className={styles.feeCard}>
                <p>
                  <strong>Selected:</strong> {accreditationLabel(values.accreditation_category)}
                </p>
                <p className={styles.feeAmount}>{formatFeeInr(fee.amountPaise)}</p>
                <p className={styles.hint}>{fee.label}</p>
                {fee.requiresPayment && !phonePeReady && (
                  <p className={styles.warn}>Payment gateway is not ready — contact the secretariat.</p>
                )}
              </div>
            )}
          </section>
        )}

        {step === 2 && (
          <section className={styles.section}>
            <p className={styles.lead}>Required contact information for your accreditation file.</p>
            <div className={styles.grid}>
              <RegistrationFormField label="Full name (as per passport)" required error={fieldErrors.full_name}>
                <input
                  value={values.full_name}
                  onChange={(e) => setField("full_name", e.target.value)}
                  autoComplete="name"
                />
              </RegistrationFormField>
              <RegistrationFormField label="Official email" required error={fieldErrors.email}>
                <input
                  type="email"
                  value={values.email}
                  onChange={(e) => setField("email", e.target.value)}
                  autoComplete="email"
                />
              </RegistrationFormField>
              <RegistrationFormField label="Mobile number" required error={fieldErrors.phone}>
                <input
                  type="tel"
                  value={values.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  autoComplete="tel"
                />
              </RegistrationFormField>
              <RegistrationFormField label="WhatsApp number" hint="Defaults to mobile if empty">
                <input
                  type="tel"
                  value={values.whatsapp_number}
                  onChange={(e) => setField("whatsapp_number", e.target.value)}
                />
              </RegistrationFormField>
              <RegistrationFormField label="Designation">
                <input value={values.designation} onChange={(e) => setField("designation", e.target.value)} />
              </RegistrationFormField>
              <RegistrationFormField label="Organization">
                <input value={values.organization} onChange={(e) => setField("organization", e.target.value)} />
              </RegistrationFormField>
              <RegistrationFormField label="Country">
                <input value={values.country} onChange={(e) => setField("country", e.target.value)} />
              </RegistrationFormField>
              <RegistrationFormField label="City">
                <input value={values.city} onChange={(e) => setField("city", e.target.value)} />
              </RegistrationFormField>
            </div>
            <RegistrationFormFieldFull
              label="Official photograph"
              required
              error={fieldErrors.photo}
            >
              <RegistrationDocumentUpload
                kind="photo"
                label=""
                required
                value={uploads.photo?.path ?? ""}
                fileName={uploads.photo?.name ?? ""}
                onUploaded={(path, name) => {
                  setUploads((u) => ({ ...u, photo: { path, name } }));
                  setFieldErrors((e) => {
                    const n = { ...e };
                    delete n.photo;
                    return n;
                  });
                }}
              />
            </RegistrationFormFieldFull>
          </section>
        )}

        {step === 3 && (
          <section className={styles.section}>
            <p className={styles.lead}>Passport and ID details (optional unless requested by protocol).</p>
            <div className={styles.grid}>
              <RegistrationFormField label="Identity type">
                <select value={values.identity_type} onChange={(e) => setField("identity_type", e.target.value)}>
                  <option value="">Select</option>
                  <option value="passport">Passport</option>
                  <option value="diplomatic_passport">Diplomatic Passport</option>
                  <option value="official_passport">Official Passport</option>
                  <option value="aadhaar">Aadhaar</option>
                </select>
              </RegistrationFormField>
              <RegistrationFormField label="Passport / ID number">
                <input value={values.passport_number} onChange={(e) => setField("passport_number", e.target.value)} />
              </RegistrationFormField>
            </div>
            <div className={styles.uploadGrid}>
              <RegistrationDocumentUpload
                kind="passport"
                label="Passport scan"
                value={uploads.passport?.path ?? ""}
                fileName={uploads.passport?.name ?? ""}
                onUploaded={(path, name) => setUploads((u) => ({ ...u, passport: { path, name } }))}
              />
              <RegistrationDocumentUpload
                kind="government_id"
                label="Government ID"
                value={uploads.government_id?.path ?? ""}
                fileName={uploads.government_id?.name ?? ""}
                onUploaded={(path, name) => setUploads((u) => ({ ...u, government_id: { path, name } }))}
              />
            </div>
          </section>
        )}

        {step === 4 && (
          <section className={styles.section}>
            <div className={styles.grid}>
              <RegistrationFormField label="Participation format">
                <select
                  value={values.participation_format}
                  onChange={(e) => setField("participation_format", e.target.value)}
                >
                  <option value="physical">Physical</option>
                  <option value="virtual">Virtual</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </RegistrationFormField>
              <RegistrationFormField label="Attendance">
                <select
                  value={values.attendance_days}
                  onChange={(e) => setField("attendance_days", e.target.value)}
                >
                  <option value="both">Both days</option>
                  <option value="day1">Day 1 only</option>
                  <option value="day2">Day 2 only</option>
                </select>
              </RegistrationFormField>
              <RegistrationFormField label="Dietary preference">
                <select
                  value={values.dietary_preference}
                  onChange={(e) => setField("dietary_preference", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="jain">Jain</option>
                  <option value="halal">Halal</option>
                </select>
              </RegistrationFormField>
            </div>

            <details className={styles.collapse}>
              <summary>Session preferences (optional)</summary>
              <div className={styles.collapseBody}>
                <p className={styles.hint}>Day 1</p>
                {DAY1_SESSIONS.map((s) => (
                  <label key={s.id} className={styles.checkRow}>
                    <input
                      type="checkbox"
                      checked={values.day1_sessions.includes(s.id)}
                      onChange={(e) =>
                        setField("day1_sessions", toggleInList(values.day1_sessions, s.id, e.target.checked))
                      }
                    />
                    {s.label}
                  </label>
                ))}
                <p className={styles.hint}>Day 2</p>
                {DAY2_SESSIONS.map((s) => (
                  <label key={s.id} className={styles.checkRow}>
                    <input
                      type="checkbox"
                      checked={values.day2_sessions.includes(s.id)}
                      onChange={(e) =>
                        setField("day2_sessions", toggleInList(values.day2_sessions, s.id, e.target.checked))
                      }
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </details>

            <details className={styles.collapse}>
              <summary>Protocol &amp; networking (optional)</summary>
              <div className={styles.collapseBody}>
                <div className={styles.grid}>
                  <RegistrationFormField label="Airport reception">
                    <select
                      value={values.airport_reception}
                      onChange={(e) => setField("airport_reception", e.target.value)}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </RegistrationFormField>
                  <RegistrationFormField label="Accommodation help">
                    <select
                      value={values.accommodation_assistance}
                      onChange={(e) => setField("accommodation_assistance", e.target.value)}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </RegistrationFormField>
                </div>
                {NETWORKING.map(([id, label]) => (
                  <label key={id} className={styles.checkRow}>
                    <input
                      type="checkbox"
                      checked={values.networking_interests.includes(id)}
                      onChange={(e) =>
                        setField(
                          "networking_interests",
                          toggleInList(values.networking_interests, id, e.target.checked),
                        )
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </details>
          </section>
        )}

        {step === 5 && fee && (
          <section className={styles.section}>
            <div className={styles.reviewCard}>
              <p><strong>Name:</strong> {values.full_name || "—"}</p>
              <p><strong>Email:</strong> {values.email || "—"}</p>
              <p><strong>Role:</strong> {accreditationLabel(values.accreditation_category)}</p>
              <p><strong>Fee:</strong> {formatFeeInr(fee.amountPaise)}</p>
            </div>

            <label className={`${styles.checkRow} ${fieldErrors.code_of_conduct ? styles.fieldError : ""}`}>
              <input
                type="checkbox"
                checked={values.code_of_conduct}
                onChange={(e) => setField("code_of_conduct", e.target.checked)}
              />
              <span>
                I accept the code of conduct and summit protocol guidelines
                <span className={styles.requiredMark}> *</span>
              </span>
            </label>
            {fieldErrors.code_of_conduct && (
              <small className={styles.fieldErrorText}>{fieldErrors.code_of_conduct}</small>
            )}

            <label className={`${styles.checkRow} ${fieldErrors.declaration_accepted ? styles.fieldError : ""}`}>
              <input
                type="checkbox"
                checked={values.declaration_accepted}
                onChange={(e) => setField("declaration_accepted", e.target.checked)}
              />
              <span>
                I certify that all information is true and correct
                <span className={styles.requiredMark}> *</span>
              </span>
            </label>
            {fieldErrors.declaration_accepted && (
              <small className={styles.fieldErrorText}>{fieldErrors.declaration_accepted}</small>
            )}

            <RegistrationFormField label="Place of declaration" required error={fieldErrors.signature_place}>
              <input
                value={values.signature_place}
                onChange={(e) => setField("signature_place", e.target.value)}
                placeholder="City, Country"
              />
            </RegistrationFormField>

            <div className={styles.consentRow}>
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={values.digital_consent_email}
                  onChange={(e) => setField("digital_consent_email", e.target.checked)}
                />
                Email updates
              </label>
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={values.digital_consent_whatsapp}
                  onChange={(e) => setField("digital_consent_whatsapp", e.target.checked)}
                />
                WhatsApp alerts
              </label>
            </div>
          </section>
        )}

        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        <div className={styles.nav}>
          {step > 0 && (
            <button type="button" className={styles.secondaryBtn} onClick={back} disabled={loading}>
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" className={styles.primaryBtn} onClick={next}>
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={loading || (fee?.requiresPayment && !phonePeReady)}
            >
              {loading
                ? "Submitting…"
                : fee?.requiresPayment
                  ? `Pay ${formatFeeInr(fee.amountPaise)} & Submit`
                  : "Submit application"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

import {
  ACCREDITATION_CATEGORIES,
  DAY1_SESSIONS,
  DAY2_SESSIONS,
  FEE_TIERS,
  accreditationLabel,
  formatFeeInr,
} from "@/lib/registration/gsce-config";

export type RegistrationMetadata = {
  source?: string;
  submitted_at?: string;
  date_of_birth?: string;
  gender?: string;
  biography?: string;
  alternative_email?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  participation_format?: string;
  attendance_days?: string;
  identity_type?: string;
  passport_number?: string;
  passport_country?: string;
  passport_issue_date?: string;
  passport_expiry_date?: string;
  visa_number?: string;
  day1_sessions?: string[];
  day2_sessions?: string[];
  airport_reception?: boolean;
  accommodation_assistance?: boolean;
  interpreter_required?: boolean;
  interpreter_language?: string;
  dietary_preference?: string;
  accessibility_requirement?: string;
  networking_interests?: string[];
  code_of_conduct?: boolean;
  digital_consent_email?: boolean;
  digital_consent_whatsapp?: boolean;
  digital_consent_sms?: boolean;
  declaration_accepted?: boolean;
  signature_place?: string;
  diplomatic_note_path?: string;
};

export type RegistrationDetailRow = {
  id: string;
  full_name: string;
  email: string;
  official_email?: string | null;
  phone?: string | null;
  whatsapp_number?: string | null;
  organization?: string | null;
  designation?: string | null;
  country?: string | null;
  nationality?: string | null;
  state?: string | null;
  city?: string | null;
  accreditation_category?: string | null;
  fee_tier?: string | null;
  amount_paise?: number | null;
  payment_status?: string | null;
  delegate_id?: string | null;
  status: string;
  created_at: string;
  approved_at?: string | null;
  rejected_at?: string | null;
  rejection_reason?: string | null;
  review_notes?: string | null;
  receipt_storage_path?: string | null;
  receipt_sent_at?: string | null;
  photo_storage_path?: string | null;
  passport_storage_path?: string | null;
  visa_storage_path?: string | null;
  government_id_storage_path?: string | null;
  metadata?: RegistrationMetadata | null;
  events?: { title?: string; slug?: string; location?: string | null } | null;
};

function sessionLabels(ids: string[] | undefined, pool: readonly { id: string; label: string }[]) {
  if (!ids?.length) return ["—"];
  return ids.map((id) => pool.find((s) => s.id === id)?.label ?? id);
}

const NETWORKING_LABELS: Record<string, string> = {
  ministerial_meetings: "Ministerial Meetings",
  ambassador_roundtables: "Ambassador Roundtables",
  investor_networking: "Investor Networking",
  business_matchmaking: "Business Matchmaking",
  youth_exchange: "Youth Exchange Programs",
  cultural_partnerships: "Cultural Partnerships",
  academic_collaborations: "Academic Collaborations",
  media_interviews: "Media Interviews",
};

export type DetailSection = {
  id: string;
  title: string;
  fields: { label: string; value: string }[];
};

export function buildRegistrationDetailSections(row: RegistrationDetailRow): DetailSection[] {
  const m = row.metadata ?? {};
  const feeLabel = row.fee_tier
    ? (FEE_TIERS[row.fee_tier as keyof typeof FEE_TIERS]?.label ?? row.fee_tier)
    : "—";

  return [
    {
      id: "A",
      title: "Section A — Delegate Category & Accreditation",
      fields: [
        { label: "Accreditation category", value: accreditationLabel(row.accreditation_category) },
        {
          label: "Group",
          value:
            ACCREDITATION_CATEGORIES.find((c) => c.slug === row.accreditation_category)?.group ??
            "—",
        },
      ],
    },
    {
      id: "B",
      title: "Section B — Registration Fee",
      fields: [
        { label: "Fee tier", value: feeLabel },
        { label: "Amount", value: formatFeeInr(row.amount_paise ?? 0) },
        { label: "Payment status", value: row.payment_status ?? "—" },
      ],
    },
    {
      id: "C",
      title: "Section C — Personal & Official Identification",
      fields: [
        { label: "Full name", value: row.full_name },
        { label: "Designation", value: row.designation ?? "—" },
        { label: "Organization", value: row.organization ?? "—" },
        { label: "Country represented", value: row.country ?? "—" },
        { label: "Nationality", value: row.nationality ?? "—" },
        { label: "State / City", value: [row.state, row.city].filter(Boolean).join(", ") || "—" },
        { label: "Date of birth", value: m.date_of_birth ?? "—" },
        { label: "Gender", value: m.gender ?? "—" },
        { label: "Biography", value: m.biography ?? "—" },
      ],
    },
    {
      id: "D",
      title: "Section D — Passport & Security Verification",
      fields: [
        { label: "Identity type", value: m.identity_type ?? "—" },
        { label: "Passport / ID number", value: m.passport_number ?? "—" },
        { label: "Country of issue", value: m.passport_country ?? "—" },
        { label: "Issue date", value: m.passport_issue_date ?? "—" },
        { label: "Expiry date", value: m.passport_expiry_date ?? "—" },
        { label: "Visa number", value: m.visa_number ?? "—" },
      ],
    },
    {
      id: "E",
      title: "Section E — Contact Information",
      fields: [
        { label: "Mobile", value: row.phone ?? "—" },
        { label: "WhatsApp", value: row.whatsapp_number ?? "—" },
        { label: "Email", value: row.email },
        { label: "Official email", value: row.official_email ?? "—" },
        { label: "Alternative email", value: m.alternative_email ?? "—" },
        { label: "Emergency contact", value: m.emergency_contact_name ?? "—" },
        { label: "Emergency phone", value: m.emergency_contact_phone ?? "—" },
      ],
    },
    {
      id: "F",
      title: "Section F — Participation Format",
      fields: [
        { label: "Format", value: m.participation_format ?? "—" },
        { label: "Attendance", value: m.attendance_days ?? "—" },
      ],
    },
    {
      id: "G",
      title: "Section G — Session Selection",
      fields: [
        {
          label: "Day 1 sessions",
          value: sessionLabels(m.day1_sessions, DAY1_SESSIONS).join("; "),
        },
        {
          label: "Day 2 sessions",
          value: sessionLabels(m.day2_sessions, DAY2_SESSIONS).join("; "),
        },
      ],
    },
    {
      id: "H",
      title: "Section H — VIP Protocol & Hospitality",
      fields: [
        { label: "Airport reception", value: m.airport_reception ? "Yes" : "No" },
        { label: "Accommodation assistance", value: m.accommodation_assistance ? "Yes" : "No" },
        {
          label: "Interpreter",
          value: m.interpreter_required
            ? `Yes — ${m.interpreter_language ?? "language not specified"}`
            : "No",
        },
        { label: "Dietary preference", value: m.dietary_preference ?? "—" },
        { label: "Accessibility", value: m.accessibility_requirement ?? "—" },
      ],
    },
    {
      id: "I",
      title: "Section I — Bilateral & Networking",
      fields: [
        {
          label: "Interests",
          value:
            m.networking_interests
              ?.map((k) => NETWORKING_LABELS[k] ?? k)
              .join(", ") || "—",
        },
      ],
    },
    {
      id: "KLM",
      title: "Sections K, L & M — Declarations & Consent",
      fields: [
        { label: "Code of conduct accepted", value: m.code_of_conduct ? "Yes" : "No" },
        { label: "Email notifications", value: m.digital_consent_email ? "Yes" : "No" },
        { label: "WhatsApp alerts", value: m.digital_consent_whatsapp ? "Yes" : "No" },
        { label: "SMS updates", value: m.digital_consent_sms ? "Yes" : "No" },
        { label: "Declaration accepted", value: m.declaration_accepted ? "Yes" : "No" },
        { label: "Place of declaration", value: m.signature_place ?? "—" },
      ],
    },
    {
      id: "status",
      title: "Secretariat Review",
      fields: [
        { label: "Status", value: row.status },
        { label: "Delegate ID", value: row.delegate_id ?? "—" },
        { label: "Submitted", value: new Date(row.created_at).toLocaleString("en-IN") },
        { label: "Approved at", value: row.approved_at ? new Date(row.approved_at).toLocaleString("en-IN") : "—" },
        { label: "Rejected at", value: row.rejected_at ? new Date(row.rejected_at).toLocaleString("en-IN") : "—" },
        { label: "Rejection reason", value: row.rejection_reason ?? "—" },
        { label: "Review notes", value: row.review_notes ?? "—" },
      ],
    },
  ];
}

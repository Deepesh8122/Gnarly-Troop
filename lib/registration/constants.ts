export type RegistrationEvent = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  location: string | null;
  starts_at: string | null;
  ends_at: string | null;
  max_registrations: number | null;
  registration_enabled: boolean;
};

export const REGISTRATION_ELIGIBILITY_OPTIONS = [
  {
    value: "parliamentarians",
    label: "Hon'ble Parliamentarians & Union Ministers",
  },
  {
    value: "ambassadors",
    label: "Ambassadors & Diplomats from partner nations",
  },
  {
    value: "ceos",
    label: "CEOs, Cultural Icons and Youth Leaders",
  },
  {
    value: "academicians",
    label: "Academicians, Entrepreneurs and Global Thinkers",
  },
  {
    value: "delegate",
    label: "Summit Delegate / General Participant",
  },
  {
    value: "youth",
    label: "Youth Delegate",
  },
  {
    value: "media",
    label: "Media / Press",
  },
  {
    value: "other",
    label: "Other (please describe in your message)",
  },
] as const;

export type EligibilityValue = (typeof REGISTRATION_ELIGIBILITY_OPTIONS)[number]["value"];

export function eligibilityLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return (
    REGISTRATION_ELIGIBILITY_OPTIONS.find((o) => o.value === value)?.label ?? value
  );
}

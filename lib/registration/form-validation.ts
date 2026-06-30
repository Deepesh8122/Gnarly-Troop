import { ACCREDITATION_CATEGORIES, ACCREDITATION_GROUPS } from "@/lib/registration/gsce-config";

export type RegistrationFormValues = {
  categoryGroup: string;
  accreditation_category: string;
  full_name: string;
  designation: string;
  organization: string;
  country: string;
  nationality: string;
  state: string;
  city: string;
  date_of_birth: string;
  gender: string;
  biography: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  alternative_email: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  identity_type: string;
  passport_number: string;
  passport_country: string;
  passport_issue_date: string;
  passport_expiry_date: string;
  visa_number: string;
  participation_format: string;
  attendance_days: string;
  airport_reception: string;
  accommodation_assistance: string;
  interpreter_required: string;
  interpreter_language: string;
  dietary_preference: string;
  accessibility_requirement: string;
  signature_place: string;
  code_of_conduct: boolean;
  declaration_accepted: boolean;
  digital_consent_email: boolean;
  digital_consent_whatsapp: boolean;
  digital_consent_sms: boolean;
  day1_sessions: string[];
  day2_sessions: string[];
  networking_interests: string[];
};

export type FieldErrors = Partial<Record<keyof RegistrationFormValues | "photo", string>>;

export const INITIAL_FORM_VALUES: RegistrationFormValues = {
  categoryGroup: "",
  accreditation_category: "",
  full_name: "",
  designation: "",
  organization: "",
  country: "India",
  nationality: "Indian",
  state: "",
  city: "",
  date_of_birth: "",
  gender: "",
  biography: "",
  email: "",
  phone: "",
  whatsapp_number: "",
  alternative_email: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  identity_type: "",
  passport_number: "",
  passport_country: "",
  passport_issue_date: "",
  passport_expiry_date: "",
  visa_number: "",
  participation_format: "physical",
  attendance_days: "both",
  airport_reception: "no",
  accommodation_assistance: "no",
  interpreter_required: "no",
  interpreter_language: "",
  dietary_preference: "",
  accessibility_requirement: "",
  signature_place: "",
  code_of_conduct: false,
  declaration_accepted: false,
  digital_consent_email: true,
  digital_consent_whatsapp: true,
  digital_consent_sms: false,
  day1_sessions: [],
  day2_sessions: [],
  networking_interests: [],
};

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string): boolean {
  return value.replace(/\D/g, "").length >= 10;
}

export function validateRegistrationStep(
  step: number,
  values: RegistrationFormValues,
  options?: { requirePhoto?: boolean },
): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 1) {
    if (!values.categoryGroup) {
      errors.categoryGroup = "Please select an accreditation group.";
    } else if (!ACCREDITATION_GROUPS.includes(values.categoryGroup as (typeof ACCREDITATION_GROUPS)[number])) {
      errors.categoryGroup = "Please select a valid accreditation group.";
    }
    if (!values.accreditation_category) {
      errors.accreditation_category = "Please select your specific accreditation role.";
    } else {
      const cat = ACCREDITATION_CATEGORIES.find((c) => c.slug === values.accreditation_category);
      if (!cat || cat.group !== values.categoryGroup) {
        errors.accreditation_category = "Please select a role that matches your chosen group.";
      }
    }
  }

  if (step === 2) {
    if (!values.full_name.trim()) errors.full_name = "Full name is required.";
    if (!values.email.trim()) errors.email = "Official email is required.";
    else if (!isEmail(values.email.trim())) errors.email = "Enter a valid email address.";
    if (!values.phone.trim()) errors.phone = "Mobile number is required.";
    else if (!isPhone(values.phone)) errors.phone = "Enter a valid 10-digit mobile number.";
    if (values.alternative_email.trim() && !isEmail(values.alternative_email.trim())) {
      errors.alternative_email = "Enter a valid alternative email.";
    }
    if (options?.requirePhoto) {
      // photo validated via uploads in parent
    }
  }

  if (step === 5) {
    if (!values.code_of_conduct) {
      errors.code_of_conduct = "You must accept the code of conduct.";
    }
    if (!values.declaration_accepted) {
      errors.declaration_accepted = "You must accept the declaration to submit.";
    }
    if (!values.signature_place.trim()) {
      errors.signature_place = "Place of declaration is required.";
    }
  }

  return errors;
}

export function firstFieldError(errors: FieldErrors): string | null {
  const first = Object.values(errors).find(Boolean);
  return first ?? null;
}

import { z } from "zod";
import { ACCREDITATION_CATEGORIES } from "@/lib/registration/gsce-config";

const categorySlugs = ACCREDITATION_CATEGORIES.map((c) => c.slug) as [string, ...string[]];

export const gsceRegistrationSchema = z.object({
  eventId: z.string().uuid().optional(),
  accreditation_category: z.enum(categorySlugs),
  full_name: z.string().min(2).max(200),
  designation: z.string().max(200).optional(),
  organization: z.string().max(200).optional(),
  country: z.string().max(100).optional(),
  nationality: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  date_of_birth: z.string().max(20).optional(),
  gender: z.string().max(30).optional(),
  biography: z.string().max(2000).optional(),
  email: z.string().email(),
  official_email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(10).max(20),
  whatsapp_number: z.string().max(20).optional(),
  alternative_email: z.string().email().optional().or(z.literal("")),
  emergency_contact_name: z.string().max(200).optional(),
  emergency_contact_phone: z.string().max(20).optional(),
  participation_format: z.enum(["physical", "virtual", "hybrid"]).optional(),
  attendance_days: z.enum(["day1", "day2", "both"]).optional(),
  photo_storage_path: z.string().max(500).optional(),
  passport_storage_path: z.string().max(500).optional(),
  visa_storage_path: z.string().max(500).optional(),
  government_id_storage_path: z.string().max(500).optional(),
  metadata: z
    .object({
      identity_type: z.string().optional(),
      passport_number: z.string().optional(),
      passport_country: z.string().optional(),
      passport_issue_date: z.string().optional(),
      passport_expiry_date: z.string().optional(),
      visa_number: z.string().optional(),
      day1_sessions: z.array(z.string()).optional(),
      day2_sessions: z.array(z.string()).optional(),
      airport_reception: z.boolean().optional(),
      accommodation_assistance: z.boolean().optional(),
      interpreter_required: z.boolean().optional(),
      interpreter_language: z.string().optional(),
      dietary_preference: z.string().optional(),
      accessibility_requirement: z.string().optional(),
      networking_interests: z.array(z.string()).optional(),
      payment_mode: z.string().optional(),
      code_of_conduct: z.boolean().optional(),
      digital_consent_email: z.boolean().optional(),
      digital_consent_whatsapp: z.boolean().optional(),
      digital_consent_sms: z.boolean().optional(),
      declaration_accepted: z.boolean().optional(),
      signature_place: z.string().optional(),
      diplomatic_note_path: z.string().optional(),
    })
    .optional(),
  returnOrigin: z.string().url().optional(),
});

export type GsceRegistrationInput = z.infer<typeof gsceRegistrationSchema>;

import { createServiceRoleClient } from "@/lib/supabase/server";
import { deliverRegistrationPass } from "@/lib/registration/deliver-registration-pass";
import { mapAccreditationToLegacyEligibility } from "@/lib/registration/gsce-config";
import { notifyRegistrationApproved } from "@/lib/registration/notify-registration";

type EventRow = {
  id: string;
  title: string;
  location: string | null;
  starts_at: string | null;
  ends_at: string | null;
};

type RegistrationRow = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  whatsapp_number?: string | null;
  accreditation_category?: string | null;
  eligibility?: string | null;
  amount_paise?: number | null;
  delegate_id?: string | null;
  receipt_sent_at?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function fulfillEventRegistration(params: {
  registration: RegistrationRow;
  event: EventRow;
}): Promise<void> {
  const { registration, event } = params;
  const supabase = createServiceRoleClient();
  const meta = registration.metadata as { digital_consent_whatsapp?: boolean } | null;

  const delivered = await deliverRegistrationPass({
    registrationId: registration.id,
    resend: !registration.receipt_sent_at,
  });

  if (!delivered.ok) {
    throw new Error(delivered.error ?? "Could not deliver delegate pass.");
  }

  const delegateId = delivered.delegateId;

  await notifyRegistrationApproved({
    email: registration.email,
    fullName: registration.full_name,
    delegateId,
    eventTitle: event.title,
    phone: registration.phone,
    whatsappNumber: registration.whatsapp_number,
    metadata: meta,
  });

  await supabase
    .from("event_registrations")
    .update({
      status: "approved",
      delegate_id: delegateId,
    })
    .eq("id", registration.id);
}

export { mapAccreditationToLegacyEligibility };

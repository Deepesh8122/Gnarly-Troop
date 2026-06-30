import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/env";
import { generateRegistrationCertificatePdf } from "@/lib/pdf/registration-certificate";
import {
  accreditationLabel,
  formatFeeInr,
  generateDelegateId,
} from "@/lib/registration/gsce-config";
import { eligibilityLabel } from "@/lib/registration/constants";
import { formatEventDates } from "@/lib/registration/event-dates";

export type BuiltRegistrationPass = {
  pdf: Buffer;
  registrationId: string;
  delegateId: string;
  filename: string;
  fullName: string;
  email: string;
  eventTitle: string;
  eventDates: string;
  eventLocation: string;
  eligibilityLabel: string;
};

export async function buildRegistrationPassPdf(
  registrationId: string,
): Promise<BuiltRegistrationPass | null> {
  const supabase = createServiceRoleClient();

  const { data: reg, error } = await supabase
    .from("event_registrations")
    .select(
      `id, full_name, email, phone, accreditation_category, eligibility, amount_paise, delegate_id,
       events(id, title, location, starts_at, ends_at)`,
    )
    .eq("id", registrationId)
    .maybeSingle();

  if (error || !reg) return null;

  const event = Array.isArray(reg.events)
    ? (reg.events[0] as {
        title: string;
        location: string | null;
        starts_at: string | null;
        ends_at: string | null;
      } | null)
    : (reg.events as {
        title: string;
        location: string | null;
        starts_at: string | null;
        ends_at: string | null;
      } | null);

  if (!event) return null;

  const delegateId = reg.delegate_id ?? generateDelegateId(reg.id);
  const accredSlug = reg.accreditation_category;
  const eligibilityLabelText = accredSlug
    ? accreditationLabel(accredSlug)
    : eligibilityLabel(reg.eligibility);

  const eventDates = formatEventDates(event.starts_at, event.ends_at);
  const eventLocation = event.location ?? "Bharat Mandapam";

  const pdf = await generateRegistrationCertificatePdf({
    fullName: reg.full_name,
    email: reg.email,
    phone: reg.phone,
    eventTitle: event.title,
    eventDates,
    eventLocation,
    eligibilityLabel: eligibilityLabelText,
    registrationId: reg.id,
    eventCode: delegateId,
    seatZone: delegateId,
    amountLabel: formatFeeInr(reg.amount_paise ?? 0),
    siteUrl: getSiteUrl(),
  });

  return {
    pdf,
    registrationId: reg.id,
    delegateId,
    filename: `delegate-pass-${delegateId}.pdf`,
    fullName: reg.full_name,
    email: reg.email,
    eventTitle: event.title,
    eventDates,
    eventLocation,
    eligibilityLabel: eligibilityLabelText,
  };
}

export function pdfResponse(buffer: Buffer, filename: string): Response {
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

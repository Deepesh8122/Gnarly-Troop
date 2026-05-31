import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import {
  REGISTRATION_ELIGIBILITY_OPTIONS,
  countEventRegistrations,
  eligibilityLabel,
} from "@/lib/services/events";
import { sendRegistrationConfirmationEmail } from "@/lib/mail";
import { generateRegistrationCertificatePdf } from "@/lib/pdf/registration-certificate";

const eligibilityValues = REGISTRATION_ELIGIBILITY_OPTIONS.map((o) => o.value) as [
  string,
  ...string[],
];

const bodySchema = z.object({
  eventId: z.string().uuid().optional(),
  full_name: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  organization: z.string().max(200).optional(),
  designation: z.string().max(200).optional(),
  country: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  eligibility: z.enum(eligibilityValues),
  message: z.string().max(2000).optional(),
});

function formatEventDates(starts: string | null, ends: string | null): string {
  if (!starts) return "Dates to be announced";
  const start = new Date(starts);
  const end = ends ? new Date(ends) : null;
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  if (end && end.getTime() !== start.getTime()) {
    return `${fmt(start)} – ${fmt(end)}`;
  }
  return fmt(start);
}

export async function POST(request: Request) {
  if (!getSupabaseEnv().configured) {
    return NextResponse.json({ ok: false, error: "Registration is not available yet." }, { status: 503 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Please check all required fields." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  let eventQuery = supabase
    .from("events")
    .select("id, title, subtitle, location, starts_at, ends_at, max_registrations, registration_enabled, status")
    .eq("registration_enabled", true)
    .eq("status", "published");

  if (body.eventId) {
    eventQuery = eventQuery.eq("id", body.eventId);
  } else {
    eventQuery = eventQuery.eq("slug", "global-leadership-summit-2026");
  }

  const { data: event, error: eventError } = await eventQuery.maybeSingle();
  if (eventError || !event) {
    return NextResponse.json(
      { ok: false, error: "Registration is closed for this event." },
      { status: 400 },
    );
  }

  if (event.max_registrations != null) {
    const count = await countEventRegistrations(event.id);
    if (count >= event.max_registrations) {
      return NextResponse.json(
        { ok: false, error: "Registration capacity has been reached." },
        { status: 409 },
      );
    }
  }

  const { data: registration, error: insertError } = await supabase
    .from("event_registrations")
    .insert({
      event_id: event.id,
      full_name: body.full_name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      organization: body.organization?.trim() || null,
      designation: body.designation?.trim() || null,
      country: body.country?.trim() || "India",
      state: body.state?.trim() || null,
      city: body.city?.trim() || null,
      eligibility: body.eligibility,
      message: body.message?.trim() || null,
      status: "confirmed",
      metadata: {
        source: "website",
        eligibility: body.eligibility,
        submitted_at: new Date().toISOString(),
      },
    })
    .select("id")
    .single();

  if (insertError || !registration) {
    return NextResponse.json(
      { ok: false, error: insertError?.message ?? "Could not save registration." },
      { status: 500 },
    );
  }

  const label = eligibilityLabel(body.eligibility);
  const eventDates = formatEventDates(event.starts_at, event.ends_at);

  try {
    await sendRegistrationConfirmationEmail({
      to: body.email.trim(),
      fullName: body.full_name.trim(),
      eventTitle: event.title,
      eventDates,
      eventLocation: event.location ?? "Venue to be confirmed",
      eligibilityLabel: label,
      registrationId: registration.id,
      pdfBuffer: await generateRegistrationCertificatePdf({
        fullName: body.full_name.trim(),
        email: body.email.trim(),
        eventTitle: event.title,
        eventDates,
        eventLocation: event.location ?? "Venue to be confirmed",
        eligibilityLabel: label,
        registrationId: registration.id,
      }),
    });
  } catch (err) {
    console.error("[registration email]", err);
  }

  return NextResponse.json({
    ok: true,
    registrationId: registration.id,
    message: "Registration successful. A confirmation email has been sent.",
  });
}

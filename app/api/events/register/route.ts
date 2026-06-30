import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createPhonePePayment, getPhonePeConfig } from "@/src/lib/phonepe";
import { getPhonePeEnvironment } from "@/lib/payments/phonepe-env";
import { getSupabaseEnv, resolveSiteUrl } from "@/lib/env";
import { countEventRegistrations } from "@/lib/services/events";
import { gsceRegistrationSchema } from "@/lib/registration/register-schema";
import {
  mapAccreditationToLegacyEligibility,
} from "@/lib/registration/fulfill-registration";
import { deliverRegistrationPass } from "@/lib/registration/deliver-registration-pass";
import {
  generateDelegateId,
  resolveRegistrationFee,
} from "@/lib/registration/gsce-config";

export async function POST(request: Request) {
  if (!getSupabaseEnv().configured) {
    return NextResponse.json({ ok: false, error: "Registration is not available yet." }, { status: 503 });
  }

  let body: z.infer<typeof gsceRegistrationSchema>;
  try {
    body = gsceRegistrationSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Please check all required fields." }, { status: 400 });
  }

  if (!body.metadata?.declaration_accepted || !body.metadata?.code_of_conduct) {
    return NextResponse.json(
      { ok: false, error: "Please accept the code of conduct and declaration." },
      { status: 400 },
    );
  }

  const fee = resolveRegistrationFee(body.accreditation_category);
  if (fee.feeTier === "sponsor") {
    return NextResponse.json(
      {
        ok: false,
        error: "Sponsor delegates — please contact summit secretariat at president@gnarlytroop.org",
      },
      { status: 400 },
    );
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

  const merchantTransactionId = fee.requiresPayment
    ? `GR${Date.now()}${Math.random().toString(36).slice(2, 8)}`
    : null;

  const initialStatus = fee.requiresPayment ? "pending_payment" : "pending_review";
  const paymentStatus = fee.requiresPayment ? "pending" : "not_required";

  const diplomaticNotePath = body.metadata?.diplomatic_note_path ?? null;

  const { data: registration, error: insertError } = await supabase
    .from("event_registrations")
    .insert({
      event_id: event.id,
      full_name: body.full_name.trim(),
      email: body.email.trim().toLowerCase(),
      official_email: body.official_email?.trim() || null,
      phone: body.phone.trim(),
      whatsapp_number: body.whatsapp_number?.trim() || body.phone.trim(),
      organization: body.organization?.trim() || null,
      designation: body.designation?.trim() || null,
      country: body.country?.trim() || "India",
      nationality: body.nationality?.trim() || body.country?.trim() || "India",
      state: body.state?.trim() || null,
      city: body.city?.trim() || null,
      eligibility: mapAccreditationToLegacyEligibility(body.accreditation_category),
      accreditation_category: body.accreditation_category,
      fee_tier: fee.feeTier,
      amount_paise: fee.amountPaise,
      payment_status: paymentStatus,
      merchant_transaction_id: merchantTransactionId,
      payment_environment: fee.requiresPayment ? getPhonePeEnvironment() : null,
      status: initialStatus,
      photo_storage_path: body.photo_storage_path ?? null,
      passport_storage_path: body.passport_storage_path ?? null,
      visa_storage_path: body.visa_storage_path ?? null,
      government_id_storage_path: body.government_id_storage_path ?? null,
      metadata: {
        source: "gsce_portal",
        submitted_at: new Date().toISOString(),
        ...body.metadata,
        diplomatic_note_path: diplomaticNotePath,
        date_of_birth: body.date_of_birth,
        gender: body.gender,
        biography: body.biography,
        alternative_email: body.alternative_email,
        emergency_contact_name: body.emergency_contact_name,
        emergency_contact_phone: body.emergency_contact_phone,
        participation_format: body.participation_format,
        attendance_days: body.attendance_days,
      },
    })
    .select(
      "id, full_name, email, phone, whatsapp_number, accreditation_category, eligibility, amount_paise, delegate_id, receipt_sent_at, metadata",
    )
    .single();

  if (insertError || !registration) {
    return NextResponse.json(
      { ok: false, error: insertError?.message ?? "Could not save registration." },
      { status: 500 },
    );
  }

  const delegateId = generateDelegateId(registration.id);
  await supabase
    .from("event_registrations")
    .update({ delegate_id: delegateId })
    .eq("id", registration.id);

  if (!fee.requiresPayment) {
    let passDelivery: Awaited<ReturnType<typeof deliverRegistrationPass>> | null = null;
    try {
      passDelivery = await deliverRegistrationPass({
        registrationId: registration.id,
        notifyReceived: true,
      });
    } catch (err) {
      console.error("[registration pass]", err);
    }

    const downloadUrl = passDelivery?.downloadUrl;
    const emailNote = passDelivery?.emailError
      ? ` Email failed: ${passDelivery.emailError}`
      : passDelivery?.emailSkipped
        ? " Email could not be sent — check MailerSend SMTP or API settings in .env.local."
        : passDelivery?.emailSent
          ? " A copy has been emailed to you."
          : "";

    return NextResponse.json({
      ok: true,
      registrationId: registration.id,
      delegateId,
      requiresPayment: false,
      downloadUrl,
      emailSent: passDelivery?.emailSent ?? false,
      emailSkipped: passDelivery?.emailSkipped ?? true,
      emailError: passDelivery?.emailError,
      passError: passDelivery?.ok === false ? passDelivery.error : undefined,
      message: `Registration submitted successfully.${emailNote} Download your delegate pass below while the Secretariat completes accreditation review.`,
    });
  }

  if (!getPhonePeConfig()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Payment gateway is not configured. Contact president@gnarlytroop.org.",
      },
      { status: 503 },
    );
  }

  const normalizedPhone = body.phone.replace(/\D/g, "").slice(-10);
  try {
    const siteUrl = resolveSiteUrl(
      request,
      body.returnOrigin ?? request.headers.get("origin"),
    );
    const payment = await createPhonePePayment(
      {
        merchantTransactionId: merchantTransactionId!,
        amountPaise: fee.amountPaise,
        userId: body.email,
        mobileNumber: normalizedPhone,
      },
      {
        siteUrl,
        returnPath: `/registration/status/?id=${encodeURIComponent(merchantTransactionId!)}`,
        paymentMessage: "GSCE Summit Registration — Gnarly Troop",
      },
    );

    return NextResponse.json({
      ok: true,
      registrationId: registration.id,
      delegateId,
      requiresPayment: true,
      redirectUrl: payment.redirectUrl,
      merchantTransactionId,
      message: "Registration saved. Complete payment on PhonePe. Your application will then be reviewed by the Secretariat.",
    });
  } catch (e) {
    await supabase
      .from("event_registrations")
      .update({ status: "failed", payment_status: "failed" })
      .eq("id", registration.id);

    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Payment could not start" },
      { status: 502 },
    );
  }
}

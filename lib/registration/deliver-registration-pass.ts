import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendRegistrationConfirmationEmail } from "@/lib/mail";
import { storeReceiptPdf } from "@/lib/pdf/store-receipt-pdf";
import { buildRegistrationPassPdf } from "@/lib/registration/build-registration-pass-pdf";
import { generateDelegateId } from "@/lib/registration/gsce-config";
import { notifyRegistrationReceived } from "@/lib/registration/notify-registration";
import { smtpAuthHint } from "@/lib/notifications/config-status";

export type DeliverPassResult = {
  ok: boolean;
  pdfStored: boolean;
  emailSent: boolean;
  emailSkipped: boolean;
  downloadUrl: string;
  delegateId: string;
  error?: string;
  emailError?: string;
};

export function registrationPassDownloadUrl(
  registrationId: string,
  delegateId: string,
): string {
  const params = new URLSearchParams({
    registrationId,
    delegateId,
  });
  return `/api/registrations/pass/download/?${params.toString()}`;
}

export async function deliverRegistrationPass(params: {
  registrationId: string;
  resend?: boolean;
  notifyReceived?: boolean;
}): Promise<DeliverPassResult> {
  const supabase = createServiceRoleClient();

  const { data: reg, error } = await supabase
    .from("event_registrations")
    .select(
      `id, full_name, email, phone, whatsapp_number, accreditation_category, eligibility,
       amount_paise, delegate_id, receipt_sent_at, receipt_storage_path, metadata,
       events(id, title, location, starts_at, ends_at)`,
    )
    .eq("id", params.registrationId)
    .maybeSingle();

  if (error || !reg) {
    return {
      ok: false,
      pdfStored: false,
      emailSent: false,
      emailSkipped: false,
      downloadUrl: "",
      delegateId: "",
      error: "Registration not found.",
    };
  }

  const event = reg.events as {
    id: string;
    title: string;
    location: string | null;
    starts_at: string | null;
    ends_at: string | null;
  } | null;

  if (!event) {
    return {
      ok: false,
      pdfStored: false,
      emailSent: false,
      emailSkipped: false,
      downloadUrl: "",
      delegateId: reg.delegate_id ?? "",
      error: "Linked event not found.",
    };
  }

  const delegateId = reg.delegate_id ?? generateDelegateId(reg.id);
  const downloadUrl = registrationPassDownloadUrl(reg.id, delegateId);

  if (reg.receipt_sent_at && reg.receipt_storage_path && !params.resend) {
    return {
      ok: true,
      pdfStored: true,
      emailSent: true,
      emailSkipped: false,
      downloadUrl,
      delegateId,
    };
  }

  if (!reg.delegate_id) {
    await supabase.from("event_registrations").update({ delegate_id: delegateId }).eq("id", reg.id);
  }

  try {
    const built = await buildRegistrationPassPdf(reg.id);
    if (!built) {
      return {
        ok: false,
        pdfStored: false,
        emailSent: false,
        emailSkipped: false,
        downloadUrl,
        delegateId,
        error: "Could not build delegate pass PDF.",
      };
    }

    const stored = await storeReceiptPdf("registrations", reg.id, built.pdf);

    await supabase
      .from("event_registrations")
      .update({
        delegate_id: delegateId,
        ...(stored ? { receipt_storage_path: stored.storagePath } : {}),
      })
      .eq("id", reg.id);

    const meta = reg.metadata as { digital_consent_whatsapp?: boolean } | null;

    let emailSent = false;
    let emailSkipped = false;
    let emailError: string | undefined;

    try {
      const mailResult = await sendRegistrationConfirmationEmail({
        to: reg.email,
        fullName: reg.full_name,
        eventTitle: built.eventTitle,
        eventDates: built.eventDates,
        eventLocation: built.eventLocation,
        eligibilityLabel: built.eligibilityLabel,
        registrationId: reg.id,
        pdfBuffer: built.pdf,
      });
      emailSkipped = mailResult.skipped;
      emailSent = !mailResult.skipped;
      if (mailResult.skipped) {
        emailError = "Email not configured (set MailerSend SMTP or API vars).";
      } else {
        await supabase
          .from("event_registrations")
          .update({ receipt_sent_at: new Date().toISOString() })
          .eq("id", reg.id);
      }
    } catch (mailErr) {
      const message = mailErr instanceof Error ? mailErr.message : "Email delivery failed.";
      emailError = smtpAuthHint(message) ?? message;
      console.error("[deliverRegistrationPass] email failed", reg.id, mailErr);
    }

    if (params.notifyReceived) {
      try {
        await notifyRegistrationReceived({
          email: reg.email,
          fullName: reg.full_name,
          delegateId,
          phone: reg.phone,
          whatsappNumber: reg.whatsapp_number,
          metadata: meta,
          skipEmail: true,
        });
      } catch (notifyError) {
        console.error("[deliverRegistrationPass] whatsapp notify failed", reg.id, notifyError);
      }
    }

    return {
      ok: true,
      pdfStored: Boolean(stored),
      emailSent,
      emailSkipped,
      downloadUrl,
      delegateId,
      emailError,
      error: !stored
        ? "PDF generated but storage upload failed — download still works via on-demand generation."
        : undefined,
    };
  } catch (err) {
    console.error("[deliverRegistrationPass] failed", reg.id, err);
    return {
      ok: false,
      pdfStored: false,
      emailSent: false,
      emailSkipped: false,
      downloadUrl,
      delegateId,
      error: err instanceof Error ? err.message : "Could not generate delegate pass.",
    };
  }
}

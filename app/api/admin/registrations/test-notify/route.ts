import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApiAccess } from "@/lib/admin-api-guard";
import { sendEmail, verifySmtpConnection } from "@/lib/mail";
import { generateRegistrationCertificatePdf } from "@/lib/pdf/registration-certificate";
import { sendWhatsAppText } from "@/lib/whatsapp";
import {
  getNotificationConfigStatus,
  smtpAuthHint,
} from "@/lib/notifications/config-status";

const bodySchema = z.object({
  to: z.string().email().optional(),
  phone: z.string().optional(),
  test: z.enum(["config", "smtp-verify", "email", "pdf-generate", "pdf", "whatsapp", "all"]),
});

export async function GET() {
  const denied = await requireAdminApiAccess();
  if (denied) return denied;

  return NextResponse.json({
    ok: true,
    config: getNotificationConfigStatus(),
  });
}

export async function POST(request: Request) {
  const denied = await requireAdminApiAccess();
  if (denied) return denied;

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const config = getNotificationConfigStatus();
  const results: Record<string, { ok: boolean; skipped?: boolean; error?: string; hint?: string }> =
    {};

  if (body.test === "config") {
    return NextResponse.json({ ok: true, config });
  }

  if (body.test === "smtp-verify") {
    const verify = await verifySmtpConnection();
    results.smtpVerify = verify.ok
      ? { ok: true, hint: "Email transport verified — credentials look valid." }
      : {
          ok: false,
          error: verify.error,
          hint: smtpAuthHint(verify.error ?? ""),
        };
    return NextResponse.json({
      ok: verify.ok,
      config,
      results,
    });
  }

  if (body.test === "pdf-generate") {
    try {
      const pdf = await generateRegistrationCertificatePdf({
        fullName: "Test Delegate",
        email: body.to ?? "test@example.com",
        phone: "9876543210",
        eventTitle: "Global Leadership & Cultural Exchange Summit",
        eventDates: "21–22 February 2026",
        eventLocation: "Bharat Mandapam",
        eligibilityLabel: "Summit Delegate",
        registrationId: "00000000-0000-0000-0000-000000000001",
        eventCode: "GSCE-2026-TEST",
        amountLabel: "Complimentary",
      });
      results.pdfGenerate = {
        ok: true,
        hint: `PDF generated successfully (${pdf.length} bytes). Email is separate — use Test email or Test PDF email.`,
      };
    } catch (e) {
      results.pdfGenerate = {
        ok: false,
        error: e instanceof Error ? e.message : "PDF generation failed",
      };
    }
    return NextResponse.json({
      ok: results.pdfGenerate?.ok ?? false,
      config,
      results,
    });
  }

  if (!body.to && (body.test === "email" || body.test === "pdf" || body.test === "all")) {
    return NextResponse.json({ ok: false, error: "Test email address required." }, { status: 400 });
  }

  if (body.test === "email" || body.test === "all") {
    try {
      const res = await sendEmail({
        to: body.to!,
        subject: "GSCE Test — Email delivery check",
        text: "This is a test email from the Gnarly Troop GSCE registration system. If you received this, SMTP is configured correctly.",
      });
      results.email = res.skipped
        ? { ok: false, skipped: true, error: "Email not configured", hint: config.email.hints.join(" ") }
        : { ok: true };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Email failed";
      results.email = {
        ok: false,
        error: message,
        hint: smtpAuthHint(message),
      };
    }
  }

  if (body.test === "pdf" || body.test === "all") {
    try {
      const pdf = await generateRegistrationCertificatePdf({
        fullName: "Test Delegate",
        email: body.to!,
        phone: "9876543210",
        eventTitle: "Global Leadership & Cultural Exchange Summit",
        eventDates: "21–22 February 2026",
        eventLocation: "Bharat Mandapam",
        eligibilityLabel: "Summit Delegate",
        registrationId: "00000000-0000-0000-0000-000000000001",
        eventCode: "GSCE-2026-TEST",
        amountLabel: "Complimentary",
      });
      const res = await sendEmail({
        to: body.to!,
        subject: "GSCE Test — PDF generation check",
        text: "Attached is a sample delegate pass PDF. If you received this, PDF generation and email attachment work.",
        attachments: [{ filename: "test-delegate-pass.pdf", content: pdf, contentType: "application/pdf" }],
      });
      results.pdf = res.skipped
        ? { ok: false, skipped: true, error: "Email not configured", hint: config.email.hints.join(" ") }
        : { ok: true, hint: `PDF generated (${pdf.length} bytes) and emailed.` };
    } catch (e) {
      const message = e instanceof Error ? e.message : "PDF email failed";
      results.pdf = {
        ok: false,
        error: message,
        hint: smtpAuthHint(message) ?? "PDF may have generated — use Test PDF generate to verify without SMTP.",
      };
    }
  }

  if (body.test === "whatsapp" || body.test === "all") {
    if (!body.phone) {
      results.whatsapp = {
        ok: false,
        error: "Phone number required for WhatsApp test.",
        hint: config.whatsapp.hints.join(" "),
      };
    } else {
      try {
        const res = await sendWhatsAppText({
          to: body.phone,
          text: "GSCE test message from Gnarly Troop — WhatsApp alerts are working.",
        });
        if (res.skipped) {
          results.whatsapp = {
            ok: false,
            skipped: true,
            error: "WhatsApp not configured",
            hint: config.whatsapp.hints.join(" "),
          };
        } else if (!res.ok) {
          results.whatsapp = {
            ok: false,
            error: res.error ?? "WhatsApp API returned error",
            hint: "Check token expiry, phone number ID, and that the recipient opted in on Meta test numbers.",
          };
        } else {
          results.whatsapp = { ok: true };
        }
      } catch (e) {
        results.whatsapp = {
          ok: false,
          error: e instanceof Error ? e.message : "WhatsApp failed",
        };
      }
    }
  }

  const allOk = Object.values(results).every((r) => r.ok || r.skipped);

  return NextResponse.json({ ok: allOk, config, results });
}

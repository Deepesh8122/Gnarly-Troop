import {
  getEmailTransportMode,
  isEmailConfigured,
} from "@/lib/mail/env";
import { sendViaMailerSend, verifyMailerSendConnection } from "@/lib/mail/mailersend";
import { sendViaSmtp, verifySmtpRelay } from "@/lib/mail/smtp";

/**
 * Transactional email — MailerSend SMTP (trial domain, no DNS) or MailerSend API.
 *
 * Option A — SMTP with MailerSend trial domain (recommended for quick testing):
 *   app.mailersend.com → Domains → Trial domain → Manage → SMTP → Generate new user
 *   EMAIL_HOST=smtp.mailersend.net
 *   EMAIL_PORT=587
 *   EMAIL_USER=MS_xxxx@smtp.mailersend.net
 *   EMAIL_PASS=your-smtp-password
 *   EMAIL_FROM="Gnarly Troop <MS_xxxx@smtp.mailersend.net>"
 *
 * Option B — MailerSend API (verified or trial domain in EMAIL_FROM):
 *   MAILERSEND_API_KEY=mlsn.xxxxx...
 *   EMAIL_FROM="Gnarly Troop <sender@trial-xxx.mailersend.net>"
 *
 * SMTP is used when EMAIL_HOST + EMAIL_USER + EMAIL_PASS are set; otherwise API.
 */
export async function verifySmtpConnection(): Promise<{
  ok: boolean;
  error?: string;
}> {
  const mode = getEmailTransportMode();
  if (mode === "smtp") return verifySmtpRelay();
  if (mode === "mailersend-api") return verifyMailerSendConnection();
  return { ok: false, error: "Email not configured." };
}

export async function sendEmail(options: {
  to: string;
  toName?: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
}) {
  if (!isEmailConfigured()) {
    console.warn("[mail] Email not configured — skipping send to", options.to);
    return { skipped: true as const };
  }

  const mode = getEmailTransportMode();
  if (mode === "smtp") {
    await sendViaSmtp(options);
  } else {
    await sendViaMailerSend(options);
  }

  return { skipped: false as const };
}

/** @deprecated Use sendDonationReceiptEmail */
export async function sendDonationEmail(
  to: string,
  subject: string,
  text: string,
  pdfBuffer?: Buffer,
) {
  return sendEmail({
    to,
    subject,
    text,
    attachments: pdfBuffer
      ? [{ content: pdfBuffer, filename: "donor-acknowledgment.pdf", contentType: "application/pdf" }]
      : undefined,
  });
}

export async function sendDonationReceiptEmail(params: {
  to: string;
  donorName: string;
  amountLabel: string;
  reference: string;
  pdfBuffer?: Buffer;
}) {
  const subject = "Donor Acknowledgment — Gnarly Troop Global Federation";
  const text = [
    `Dear ${params.donorName},`,
    "",
    `Thank you for your contribution of ${params.amountLabel} to Gnarly Troop Global Federation.`,
    "",
    "Your payment was successful. Please find your Donor Acknowledgment PDF attached.",
    "",
    `Reference: ${params.reference}`,
    "",
    "With gratitude,",
    "Gnarly Troop Global Federation",
    "president@gnarlytroop.org",
  ].join("\n");

  return sendEmail({
    to: params.to,
    subject,
    text,
    attachments: params.pdfBuffer
      ? [
          {
            filename: "donor-acknowledgment.pdf",
            content: params.pdfBuffer,
            contentType: "application/pdf",
          },
        ]
      : undefined,
  });
}

export async function sendMembershipReceiptEmail(params: {
  to: string;
  memberName: string;
  amountLabel: string;
  reference: string;
  pdfBuffer?: Buffer;
}) {
  const subject = "Membership Recognition — Gnarly Troop Global Federation";
  const text = [
    `Dear ${params.memberName},`,
    "",
    `Welcome to Gnarly Troop Global Federation. Your membership payment of ${params.amountLabel} has been received.`,
    "",
    "Please find your official Membership Recognition document attached.",
    "",
    `Reference: ${params.reference}`,
    "",
    "With warm regards,",
    "Gnarly Troop Global Federation",
    "president@gnarlytroop.org",
  ].join("\n");

  return sendEmail({
    to: params.to,
    subject,
    text,
    attachments: params.pdfBuffer
      ? [
          {
            filename: "membership-recognition.pdf",
            content: params.pdfBuffer,
            contentType: "application/pdf",
          },
        ]
      : undefined,
  });
}

export async function sendRegistrationConfirmationEmail(params: {
  to: string;
  fullName: string;
  eventTitle: string;
  eventDates: string;
  eventLocation: string;
  eligibilityLabel: string;
  registrationId: string;
  pdfBuffer?: Buffer;
}) {
  const subject = `Official Pass — ${params.eventTitle}`;
  const text = [
    `Dear ${params.fullName},`,
    "",
    "Thank you for registering with Gnarly Troop Global Federation.",
    "",
    `Event: ${params.eventTitle}`,
    `Dates: ${params.eventDates}`,
    `Venue: ${params.eventLocation}`,
    `Your eligibility category: ${params.eligibilityLabel}`,
    `Registration reference: ${params.registrationId.slice(0, 8).toUpperCase()}`,
    "",
    "Your official event pass is attached. Please bring a copy to the summit.",
    "",
    "With warm regards,",
    "Gnarly Troop Global Federation",
    "president@gnarlytroop.org",
  ].join("\n");

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;color:#1a1a1a">
      <p>Dear <strong>${params.fullName}</strong>,</p>
      <p>Thank you for registering with <strong>Gnarly Troop Global Federation</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        <tr><td style="padding:8px 0;color:#666">Event</td><td><strong>${params.eventTitle}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#666">Dates</td><td>${params.eventDates}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Venue</td><td>${params.eventLocation}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Eligibility</td><td><strong>${params.eligibilityLabel}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#666">Reference</td><td><code>${params.registrationId.slice(0, 8).toUpperCase()}</code></td></tr>
      </table>
      <p>Your official event pass is attached. Please bring a copy to the summit.</p>
      <p style="color:#666;margin-top:24px">With warm regards,<br/>Gnarly Troop Global Federation</p>
    </div>`;

  return sendEmail({
    to: params.to,
    toName: params.fullName,
    subject,
    text,
    html,
    attachments: params.pdfBuffer
      ? [
          {
            filename: "event-official-pass.pdf",
            content: params.pdfBuffer,
            contentType: "application/pdf",
          },
        ]
      : undefined,
  });
}

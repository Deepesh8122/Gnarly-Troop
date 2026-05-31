import nodemailer from "nodemailer";

function isMailConfigured(): boolean {
  return Boolean(
    process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_FROM,
  );
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
}) {
  if (!isMailConfigured()) {
    console.warn("[mail] Email not configured — skipping send to", options.to);
    return { skipped: true as const };
  }

  const info = await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html ?? `<p>${options.text.replace(/\n/g, "<br/>")}</p>`,
    attachments: options.attachments,
  });
  return { skipped: false as const, info };
}

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
      ? [{ content: pdfBuffer, filename: "receipt.pdf", contentType: "application/pdf" }]
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
  const subject = `Registration confirmed — ${params.eventTitle}`;
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
    "Our team will review your registration and share further details by email.",
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
      <p>Our team will review your registration and share further details by email.</p>
      <p style="color:#666;margin-top:24px">With warm regards,<br/>Gnarly Troop Global Federation</p>
    </div>`;

  return sendEmail({
    to: params.to,
    subject,
    text,
    html,
    attachments: params.pdfBuffer
      ? [
          {
            filename: "summit-registration.pdf",
            content: params.pdfBuffer,
            contentType: "application/pdf",
          },
        ]
      : undefined,
  });
}

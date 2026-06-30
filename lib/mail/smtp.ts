import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { getSmtpEnv, isSmtpConfigured } from "@/lib/mail/env";

type SendOptions = {
  to: string;
  toName?: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
};

export function createSmtpTransporter() {
  const env = getSmtpEnv();
  const isMailerSend = env.host.includes("mailersend");

  const options: SMTPTransport.Options = {
    host: env.host,
    port: env.port,
    secure: env.port === 465,
    auth: {
      user: env.user,
      pass: env.pass,
    },
  };

  if (isMailerSend || env.port === 587) {
    options.requireTLS = true;
    options.tls = { minVersion: "TLSv1.2" };
  }

  return nodemailer.createTransport(options);
}

export async function verifySmtpRelay(): Promise<{ ok: boolean; error?: string }> {
  if (!isSmtpConfigured()) {
    return { ok: false, error: "SMTP not configured (EMAIL_HOST, EMAIL_USER, EMAIL_PASS, EMAIL_FROM)." };
  }

  try {
    await createSmtpTransporter().verify();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "SMTP verify failed" };
  }
}

export async function sendViaSmtp(options: SendOptions): Promise<void> {
  if (!isSmtpConfigured()) {
    throw new Error("SMTP is not configured.");
  }

  const env = getSmtpEnv();

  await createSmtpTransporter().sendMail({
    from: env.fromName ? `"${env.fromName}" <${env.fromEmail}>` : env.from,
    to: options.toName ? `"${options.toName}" <${options.to}>` : options.to,
    subject: options.subject,
    text: options.text,
    html: options.html ?? `<p>${options.text.replace(/\n/g, "<br/>")}</p>`,
    attachments: options.attachments?.map((file) => ({
      filename: file.filename,
      content: file.content,
      contentType: file.contentType,
    })),
  });
}

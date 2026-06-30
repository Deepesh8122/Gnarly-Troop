import {
  getEmailTransportMode,
  getMailerSendApiEnv,
  getSmtpEnv,
  isEmailConfigured,
  isMailerSendApiConfigured,
  isSmtpConfigured,
} from "@/lib/mail/env";

export type NotificationConfigStatus = {
  email: {
    configured: boolean;
    transport: "smtp" | "mailersend-api" | "none";
    host: string | null;
    fromEmail: string | null;
    apiKeySet: boolean;
    smtpUserSet: boolean;
    hasPlaceholderValues?: boolean;
    hints: string[];
  };
  whatsapp: {
    configured: boolean;
    tokenSet: boolean;
    phoneIdSet: boolean;
    hints: string[];
  };
};

export function getNotificationConfigStatus(): NotificationConfigStatus {
  const transport = getEmailTransportMode();
  const smtp = getSmtpEnv();
  const api = getMailerSendApiEnv();
  const configured = isEmailConfigured();

  const emailHints: string[] = [];

  if (transport === "none") {
    emailHints.push(
      "Quick start (no domain DNS): MailerSend trial domain + SMTP — see .env.admin.example Option A.",
    );
    emailHints.push(
      "app.mailersend.com → Domains → Trial domain → Manage → SMTP → Generate new user.",
    );
    emailHints.push("Set EMAIL_HOST, EMAIL_USER, EMAIL_PASS, EMAIL_FROM from those SMTP credentials.");
  }

  const looksLikePlaceholder = (value: string) =>
    /xxxx|your-|your_|example\.com|password|changeme|replace/i.test(value) ||
    value.includes("MS_xxxx");

  if (transport === "smtp") {
    if (looksLikePlaceholder(smtp.user) || looksLikePlaceholder(smtp.pass)) {
      emailHints.push(
        "EMAIL_USER or EMAIL_PASS still looks like the .env example — paste real values from MailerSend → Trial domain → SMTP → Generate new user.",
      );
    }
    if (smtp.host.includes("mailersend") && !smtp.user.includes("mailersend")) {
      emailHints.push(
        "EMAIL_HOST is MailerSend but EMAIL_USER is not — SMTP username must be from MailerSend (e.g. MS_abc123@smtp.mailersend.net).",
      );
    }
    if (looksLikePlaceholder(smtp.fromEmail)) {
      emailHints.push(
        "EMAIL_FROM still looks like a placeholder — use the exact sender address MailerSend shows for your SMTP user.",
      );
    }
    if (smtp.host.includes("mailersend")) {
      emailHints.push(
        "Using MailerSend SMTP. Trial plan: ~100 emails/month to limited recipients — upgrade for production.",
      );
      if (!smtp.fromEmail.includes("mailersend.net")) {
        emailHints.push(
          "EMAIL_FROM should match your MailerSend trial/sender address (usually *@smtp.mailersend.net or *@trial-*.mailersend.net).",
        );
      }
    }
  }

  if (transport === "mailersend-api") {
    if (api.apiKey && !api.apiKey.startsWith("mlsn.")) {
      emailHints.push("MAILERSEND_API_KEY should start with mlsn.");
    }
    if (!api.fromEmail.includes("mailersend.net") && !api.fromEmail.includes("gnarlytroop")) {
      emailHints.push("EMAIL_FROM must use your MailerSend trial or verified domain.");
    }
  }

  if (isSmtpConfigured() && isMailerSendApiConfigured()) {
    emailHints.push("Both SMTP and API keys are set — SMTP is used first.");
  }

  const tokenSet = Boolean(process.env.WHATSAPP_ACCESS_TOKEN?.trim());
  const phoneIdSet = Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID?.trim());
  const whatsappHints: string[] = [];
  if (!tokenSet) whatsappHints.push("Set WHATSAPP_ACCESS_TOKEN from Meta Developer → WhatsApp → API setup.");
  if (!phoneIdSet) {
    whatsappHints.push("Set WHATSAPP_PHONE_NUMBER_ID from Meta WhatsApp phone number settings.");
  }

  return {
    email: {
      configured,
      transport,
      host: smtp.host || (transport === "mailersend-api" ? "api.mailersend.com" : null),
      fromEmail: smtp.fromEmail || api.fromEmail || null,
      apiKeySet: Boolean(api.apiKey),
      smtpUserSet: Boolean(smtp.user),
      hints: emailHints,
      hasPlaceholderValues:
        transport === "smtp" &&
        (looksLikePlaceholder(smtp.user) ||
          looksLikePlaceholder(smtp.pass) ||
          looksLikePlaceholder(smtp.fromEmail)),
    },
    whatsapp: {
      configured: tokenSet && phoneIdSet,
      tokenSet,
      phoneIdSet,
      hints: whatsappHints,
    },
  };
}

export function smtpAuthHint(errorMessage: string): string | undefined {
  if (!/401|535|invalid|unauthorized|authentication|api key|token|EAUTH/i.test(errorMessage)) {
    return undefined;
  }

  const transport = getEmailTransportMode();

  if (transport === "smtp") {
    return [
      "MailerSend SMTP auth failed.",
      "Use credentials from Domains → Trial domain → Manage → SMTP (not the API token).",
      "EMAIL_USER is the SMTP username, EMAIL_PASS is the SMTP password.",
      "EMAIL_FROM must match the trial sender address MailerSend gave you.",
    ].join(" ");
  }

  return [
    "MailerSend API rejected the request.",
    "Create a token with email_full scope, or switch to SMTP trial credentials (no domain DNS).",
  ].join(" ");
}

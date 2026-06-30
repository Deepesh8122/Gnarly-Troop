/** Trim and strip optional surrounding quotes from env values. */
export function readEnv(name: string): string {
  const raw = process.env[name];
  if (!raw) return "";
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

export type ParsedFromAddress = {
  email: string;
  name: string;
};

/** Parse `"Name <email@domain.com>"` or plain `email@domain.com`. */
export function parseFromAddress(from: string): ParsedFromAddress {
  const trimmed = from.trim();
  const match = trimmed.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) {
    return { name: match[1].trim().replace(/^["']|["']$/g, ""), email: match[2].trim() };
  }
  return { name: "", email: trimmed };
}

export type SmtpEnv = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  fromEmail: string;
  fromName: string;
};

export type MailerSendApiEnv = {
  apiKey: string;
  from: string;
  fromEmail: string;
  fromName: string;
};

export type EmailTransportMode = "smtp" | "mailersend-api" | "none";

export function getSmtpEnv(): SmtpEnv {
  const from = readEnv("EMAIL_FROM");
  const parsed = parseFromAddress(from);
  return {
    host: readEnv("EMAIL_HOST"),
    port: Number(readEnv("EMAIL_PORT") || 587),
    user: readEnv("EMAIL_USER"),
    pass: readEnv("EMAIL_PASS"),
    from,
    fromEmail: parsed.email,
    fromName: parsed.name || "Gnarly Troop",
  };
}

export function getMailerSendApiEnv(): MailerSendApiEnv {
  const apiKey = readEnv("MAILERSEND_API_KEY");
  const from = readEnv("EMAIL_FROM");
  const parsed = parseFromAddress(from);
  return {
    apiKey,
    from,
    fromEmail: parsed.email,
    fromName: parsed.name || "Gnarly Troop",
  };
}

export function isSmtpConfigured(env: SmtpEnv = getSmtpEnv()): boolean {
  return Boolean(env.host && env.user && env.pass && env.fromEmail);
}

export function isMailerSendApiConfigured(env: MailerSendApiEnv = getMailerSendApiEnv()): boolean {
  return Boolean(env.apiKey && env.fromEmail);
}

/** SMTP is preferred when fully configured (works with MailerSend trial domain). */
export function getEmailTransportMode(): EmailTransportMode {
  if (isSmtpConfigured()) return "smtp";
  if (isMailerSendApiConfigured()) return "mailersend-api";
  return "none";
}

export function isEmailConfigured(): boolean {
  return getEmailTransportMode() !== "none";
}

/** @deprecated */
export function getEmailEnv() {
  const smtp = getSmtpEnv();
  return {
    host: smtp.host || "api.mailersend.com",
    port: smtp.port,
    user: smtp.user,
    pass: smtp.pass ? "***" : "",
    from: smtp.from,
  };
}

/** @deprecated */
export function getMailerSendEnv() {
  return getMailerSendApiEnv();
}

/** @deprecated */
export function isMailerSendConfigured() {
  return isEmailConfigured();
}

/** @deprecated */
export function isEmailEnvConfigured() {
  return isEmailConfigured();
}

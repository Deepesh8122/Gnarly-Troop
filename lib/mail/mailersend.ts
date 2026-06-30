import { getMailerSendApiEnv, isMailerSendApiConfigured } from "@/lib/mail/env";

const API_BASE = "https://api.mailersend.com/v1";

type SendOptions = {
  to: string;
  toName?: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
};

export async function verifyMailerSendConnection(): Promise<{
  ok: boolean;
  error?: string;
}> {
  if (!isMailerSendApiConfigured()) {
    return { ok: false, error: "MAILERSEND_API_KEY and EMAIL_FROM are required." };
  }

  const { apiKey } = getMailerSendApiEnv();

  try {
    const res = await fetch(`${API_BASE}/token?limit=1`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });

    if (res.ok) {
      return { ok: true };
    }

    const body = await res.text();
    let message = `MailerSend API returned ${res.status}`;
    try {
      const json = JSON.parse(body) as { message?: string };
      if (json.message) message = json.message;
    } catch {
      if (body) message = body.slice(0, 200);
    }

    if (res.status === 401) {
      return { ok: false, error: `Invalid MAILERSEND_API_KEY — ${message}` };
    }

    return { ok: false, error: message };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not reach MailerSend API." };
  }
}

export async function sendViaMailerSend(options: SendOptions): Promise<void> {
  if (!isMailerSendApiConfigured()) {
    throw new Error("MailerSend API is not configured.");
  }

  const env = getMailerSendApiEnv();
  const recipientName = options.toName ?? options.to.split("@")[0] ?? "Recipient";

  const payload: Record<string, unknown> = {
    from: {
      email: env.fromEmail,
      name: env.fromName,
    },
    to: [{ email: options.to, name: recipientName }],
    subject: options.subject,
    text: options.text,
    html: options.html ?? `<p>${options.text.replace(/\n/g, "<br/>")}</p>`,
  };

  if (options.attachments?.length) {
    payload.attachments = options.attachments.map((file) => ({
      filename: file.filename,
      content: file.content.toString("base64"),
      disposition: "attachment",
    }));
  }

  const res = await fetch(`${API_BASE}/email`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    let message = `MailerSend send failed (${res.status})`;
    try {
      const json = JSON.parse(body) as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      if (json.message) message = json.message;
      if (json.errors) {
        const details = Object.entries(json.errors)
          .map(([k, v]) => `${k}: ${v.join(", ")}`)
          .join("; ");
        if (details) message = `${message} — ${details}`;
      }
    } catch {
      if (body) message = body.slice(0, 300);
    }
    throw new Error(message);
  }
}

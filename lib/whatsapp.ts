/**
 * WhatsApp Cloud API (Meta) — optional transactional messages.
 *
 * Env:
 *   WHATSAPP_ACCESS_TOKEN=...
 *   WHATSAPP_PHONE_NUMBER_ID=...
 */

function isWhatsAppConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

function normalizeWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith("91") && digits.length === 12) return digits;
  return digits;
}

export async function sendWhatsAppText(params: {
  to: string;
  text: string;
}): Promise<{ skipped: true } | { skipped: false; ok: boolean; error?: string }> {
  if (!isWhatsAppConfigured()) {
    console.warn("[whatsapp] Not configured — skipping message to", params.to);
    return { skipped: true };
  }

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const to = normalizeWhatsAppNumber(params.to);

  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: params.text },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    let errMessage = errText;
    try {
      const parsed = JSON.parse(errText) as { error?: { message?: string } };
      errMessage = parsed.error?.message ?? errText;
    } catch {
      /* use raw text */
    }
    console.error("[whatsapp] send failed", res.status, errText);
    return { skipped: false, ok: false, error: errMessage };
  }

  return { skipped: false, ok: true };
}

export async function sendRegistrationReceivedWhatsApp(params: {
  phone: string;
  fullName: string;
  delegateId: string;
}): Promise<void> {
  await sendWhatsAppText({
    to: params.phone,
    text: [
      `Dear ${params.fullName},`,
      "",
      "Your GSCE 2026 delegate registration has been received and is under review by the Summit Secretariat.",
      "",
      `Reference: ${params.delegateId}`,
      "",
      "You will receive your official delegate pass by email and WhatsApp once accreditation is approved.",
      "",
      "— Gnarly Troop Global Federation",
    ].join("\n"),
  });
}

export async function sendRegistrationApprovedWhatsApp(params: {
  phone: string;
  fullName: string;
  delegateId: string;
  eventTitle: string;
}): Promise<void> {
  await sendWhatsAppText({
    to: params.phone,
    text: [
      `Dear ${params.fullName},`,
      "",
      `Your accreditation for ${params.eventTitle} has been approved.`,
      "",
      `Delegate ID: ${params.delegateId}`,
      "",
      "Your official digital summit identity pass has been sent to your registered email. Please bring a copy for venue entry.",
      "",
      "— Gnarly Troop Global Federation",
    ].join("\n"),
  });
}

import { sendEmail } from "@/lib/mail";
import {
  sendRegistrationApprovedWhatsApp,
  sendRegistrationReceivedWhatsApp,
} from "@/lib/whatsapp";

type RegistrationMeta = {
  digital_consent_whatsapp?: boolean;
};

export async function notifyRegistrationReceived(params: {
  email: string;
  fullName: string;
  delegateId: string;
  phone?: string | null;
  whatsappNumber?: string | null;
  metadata?: RegistrationMeta | null;
  skipEmail?: boolean;
}): Promise<void> {
  if (!params.skipEmail) {
    const subject = "GSCE Registration Received — Under Secretariat Review";
    const text = [
      `Dear ${params.fullName},`,
      "",
      "Thank you for registering for the Global Leadership & Cultural Exchange Summit (GSCE 2026).",
      "",
      "Your application has been received and is now under review by the Summit Secretariat for accreditation approval, protocol compliance, and security clearance.",
      "",
      `Delegate reference: ${params.delegateId}`,
      "",
      "Your provisional delegate pass has been emailed separately. The Secretariat will confirm final accreditation.",
      "",
      "— Gnarly Troop Global Federation",
      "president@gnarlytroop.org",
    ].join("\n");

    await sendEmail({ to: params.email, subject, text });
  }

  const waPhone = params.whatsappNumber ?? params.phone;
  if (waPhone && params.metadata?.digital_consent_whatsapp !== false) {
    await sendRegistrationReceivedWhatsApp({
      phone: waPhone,
      fullName: params.fullName,
      delegateId: params.delegateId,
    });
  }
}

export async function notifyRegistrationApproved(params: {
  email: string;
  fullName: string;
  delegateId: string;
  eventTitle: string;
  phone?: string | null;
  whatsappNumber?: string | null;
  metadata?: RegistrationMeta | null;
}): Promise<void> {
  const waPhone = params.whatsappNumber ?? params.phone;
  if (waPhone && params.metadata?.digital_consent_whatsapp !== false) {
    await sendRegistrationApprovedWhatsApp({
      phone: waPhone,
      fullName: params.fullName,
      delegateId: params.delegateId,
      eventTitle: params.eventTitle,
    });
  }
}

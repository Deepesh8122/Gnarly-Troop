import {
  joinAddress,
  shortReferenceId,
} from "@/lib/pdf/receipt-templates";
import { generateIdentityReceiptPdf } from "@/lib/pdf/identity-overlay";

export type RegistrationCertificateData = {
  fullName: string;
  email: string;
  phone?: string | null;
  eventTitle: string;
  eventDates: string;
  eventLocation: string;
  eligibilityLabel: string;
  registrationId: string;
  eventCode?: string | null;
  reportingTime?: string | null;
  seatZone?: string | null;
  pan?: string | null;
  amountLabel?: string | null;
  siteUrl?: string;
};

function mapPassType(eligibilityLabel: string): string {
  const lower = eligibilityLabel.toLowerCase();
  if (lower.includes("media") || lower.includes("press")) return "Observer";
  if (lower.includes("youth")) return "Delegate";
  if (lower.includes("parliament") || lower.includes("minister") || lower.includes("ambassador")) {
    return "Speaker";
  }
  if (lower.includes("ceo") || lower.includes("icon")) return "Guest";
  return "Delegate";
}

export async function generateRegistrationCertificatePdf(
  data: RegistrationCertificateData,
): Promise<Buffer> {
  const address = joinAddress([data.eventLocation]);

  const verifyUrl =
    data.siteUrl && data.registrationId
      ? `${data.siteUrl.replace(/\/$/, "")}/registration/?ref=${encodeURIComponent(data.registrationId)}`
      : undefined;

  const eventCode = data.eventCode ?? "GSCE – 2026";
  const passType = mapPassType(data.eligibilityLabel);

  return generateIdentityReceiptPdf("registration", {
    name: data.fullName,
    address: address || "—",
    qrUrl: verifyUrl,
    lines: [
      {
        x: 360,
        y: 198,
        text: passType,
        size: 10,
        bold: true,
      },
      {
        x: 320,
        y: 218,
        text: eventCode,
        size: 10,
        bold: true,
      },
      {
        x: 360,
        y: 238,
        text: data.eventTitle,
        size: 9,
        width: 380,
      },
      {
        x: 360,
        y: 258,
        text: data.eventDates,
        size: 10,
      },
      {
        x: 360,
        y: 278,
        text: data.eventLocation,
        size: 10,
        width: 360,
      },
      {
        x: 360,
        y: 298,
        text: data.reportingTime ?? "09:00 AM",
        size: 10,
      },
      {
        x: 360,
        y: 318,
        text: data.seatZone ?? shortReferenceId("REG", data.registrationId),
        size: 10,
      },
    ],
    bottomBoxes: [
      { x: 118, y: 348, width: 130, value: data.pan?.trim() || "—" },
      { x: 298, y: 348, width: 130, value: "Registration" },
      { x: 478, y: 348, width: 110, value: data.amountLabel ?? "Complimentary" },
      { x: 628, y: 348, width: 110, value: data.phone?.trim() || "—" },
    ],
  });
}

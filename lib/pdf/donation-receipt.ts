import {
  formatInrFromPaise,
  formatReceiptDate,
  joinAddress,
  shortReferenceId,
} from "@/lib/pdf/receipt-templates";
import { generateIdentityReceiptPdf } from "@/lib/pdf/identity-overlay";

export type DonationReceiptData = {
  donorName: string;
  email: string;
  phone?: string | null;
  amountPaise: number;
  merchantTransactionId: string;
  organization?: string | null;
  country?: string | null;
  state?: string | null;
  district?: string | null;
  pinCode?: string | null;
  pan?: string | null;
  createdAt?: string | null;
  contributionType?: string | null;
  purpose?: string | null;
  siteUrl?: string;
};

export async function generateDonationReceiptPdf(data: DonationReceiptData): Promise<Buffer> {
  const address = joinAddress([
    data.organization,
    data.district,
    data.state,
    data.country,
    data.pinCode ? `PIN ${data.pinCode}` : null,
  ]);

  const verifyUrl =
    data.siteUrl && data.merchantTransactionId
      ? `${data.siteUrl.replace(/\/$/, "")}/collaboration/donation/status/?id=${encodeURIComponent(data.merchantTransactionId)}`
      : undefined;

  return generateIdentityReceiptPdf("donation", {
    name: data.donorName,
    address: address || "—",
    qrUrl: verifyUrl,
    lines: [
      {
        x: 320,
        y: 198,
        text: shortReferenceId("DNR", data.merchantTransactionId),
        size: 10,
        bold: true,
      },
      {
        x: 360,
        y: 218,
        text: data.contributionType ?? "Individual",
        size: 10,
      },
      {
        x: 360,
        y: 238,
        text: formatReceiptDate(data.createdAt),
        size: 10,
      },
      {
        x: 360,
        y: 258,
        text: data.purpose ?? "Culture / Heritage / Education / Global Exchange",
        size: 9,
        width: 360,
      },
      {
        x: 360,
        y: 278,
        text: "Gnarly Troop Global Federation",
        size: 10,
      },
    ],
    bottomBoxes: [
      { x: 118, y: 328, width: 130, value: data.pan?.trim() || "—" },
      { x: 298, y: 328, width: 130, value: "PhonePe / UPI" },
      { x: 478, y: 328, width: 110, value: formatInrFromPaise(data.amountPaise) },
      { x: 628, y: 328, width: 110, value: data.phone?.trim() || "—" },
    ],
  });
}

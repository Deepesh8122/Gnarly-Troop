import {
  formatInrFromPaise,
  formatReceiptDate,
  joinAddress,
  shortReferenceId,
} from "@/lib/pdf/receipt-templates";
import { generateIdentityReceiptPdf } from "@/lib/pdf/identity-overlay";

export type MembershipReceiptData = {
  memberName: string;
  email: string;
  phone?: string | null;
  amountPaise: number;
  merchantTransactionId: string;
  membershipCategory?: string | null;
  organization?: string | null;
  country?: string | null;
  state?: string | null;
  district?: string | null;
  pinCode?: string | null;
  pan?: string | null;
  createdAt?: string | null;
  validTill?: string | null;
  siteUrl?: string;
};

export async function generateMembershipReceiptPdf(
  data: MembershipReceiptData,
): Promise<Buffer> {
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

  const validTillLabel = data.validTill
    ? formatReceiptDate(data.validTill)
    : "Lifetime";

  return generateIdentityReceiptPdf("membership", {
    name: data.memberName,
    address: address || "—",
    qrUrl: verifyUrl,
    lines: [
      {
        x: 320,
        y: 198,
        text: shortReferenceId("MBR", data.merchantTransactionId),
        size: 10,
        bold: true,
      },
      {
        x: 360,
        y: 218,
        text: data.membershipCategory ?? "Troop Community",
        size: 10,
        width: 380,
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
        text: validTillLabel,
        size: 10,
      },
      {
        x: 195,
        y: 278,
        text: "Entry to Exclusive Events | Priority Invitations | Member-only Cultural Programs | Global Networking Access",
        size: 8,
        width: 520,
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

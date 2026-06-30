import path from "node:path";

/** Landscape identity documents — 1024×416 px source artwork. */
export const RECEIPT_PAGE_SIZE: [number, number] = [1024, 416];

export type ReceiptTemplateKind = "donation" | "membership" | "registration";

const TEMPLATE_FILES: Record<ReceiptTemplateKind, string> = {
  donation: "donation.png",
  membership: "membership.png",
  registration: "registration.png",
};

export function receiptTemplatePath(kind: ReceiptTemplateKind): string {
  return path.join(process.cwd(), "public", "receipt-templates", TEMPLATE_FILES[kind]);
}

export function formatReceiptDate(value?: string | Date | null): string {
  const d = value ? new Date(value) : new Date();
  if (Number.isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd} | ${mm} | ${yyyy}`;
}

export function formatInrFromPaise(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export function shortReferenceId(prefix: string, id: string): string {
  const compact = id.replace(/-/g, "").slice(0, 5).toUpperCase();
  return `${prefix} – ${compact}`;
}

export function joinAddress(parts: Array<string | null | undefined>): string {
  return parts.map((p) => p?.trim()).filter(Boolean).join(", ");
}

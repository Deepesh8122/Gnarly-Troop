export type ReceiptKind = "donation" | "membership" | "registration";

export function isReceiptKind(value: string | null | undefined): value is ReceiptKind {
  return value === "donation" || value === "membership" || value === "registration";
}

/** Donation tiers with receipt_type = membership produce membership identity documents. */
export function receiptKindFromTierType(
  receiptType: string | null | undefined,
): "donation" | "membership" {
  return receiptType === "membership" ? "membership" : "donation";
}

export const donationStatusLabels: Record<string, string> = {
  success: "Completed",
  failed: "Failed",
  initiated: "Pending",
  pending: "Pending",
  refunded: "Refunded",
};

export function donationStatusLabel(status?: string | null) {
  if (!status) return "Unknown";
  return donationStatusLabels[status] ?? status;
}

export function displayDonationStatus(
  status?: string | null,
  phonepeTransactionId?: string | null,
) {
  if (status === "success" && !phonepeTransactionId) {
    return {
      status: "initiated",
      label: "Awaiting PhonePe confirmation",
    };
  }

  return {
    status: status ?? "unknown",
    label: donationStatusLabel(status),
  };
}

export function donationStatusClass(status?: string | null) {
  if (status === "success") return "bg-emerald-100 text-emerald-800";
  if (status === "failed") return "bg-rose-100 text-rose-800";
  if (status === "initiated" || status === "pending") return "bg-amber-100 text-amber-800";
  if (status === "refunded") return "bg-slate-100 text-slate-700";
  return "bg-slate-100 text-slate-700";
}

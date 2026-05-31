import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { getDonorLeaderboard, getRecentDonationTransactions } from "@/lib/services/donations";
import { getSupabaseEnv } from "@/lib/env";
import Link from "next/link";

function formatInr(paise: number | null) {
  if (paise == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

function formatTransactionDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderStatusLabel(status?: string | null) {
  if (status === "success") return "Done";
  if (status === "failed") return "Failed";
  if (status === "initiated") return "Initiated";
  return "Unknown";
}

function statusColor(status?: string | null) {
  if (status === "success") return "bg-emerald-100 text-emerald-800";
  if (status === "failed") return "bg-rose-100 text-rose-800";
  if (status === "initiated") return "bg-amber-100 text-amber-800";
  return "bg-slate-100 text-slate-700";
}

const statusOptions = [
  { value: "all", label: "All" },
  { value: "success", label: "Done" },
  { value: "failed", label: "Failed" },
  { value: "initiated", label: "Pending" },
];

export default async function AdminDonorsPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const env = getSupabaseEnv();
  const donors = env.configured ? await getDonorLeaderboard() : [];
  const statusFilter = (searchParams?.status ?? "all").toLowerCase();
  const transactions = env.configured
    ? await getRecentDonationTransactions(
        100,
        statusFilter === "all" ? undefined : statusFilter,
      )
    : [];

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="Top donors"
        description="Successful PhonePe donations, ranked by total amount."
      />

      {!env.configured && (
        <p className="admin-card border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Supabase not connected.{" "}
          <Link href="/admin/setup/" className="underline">
            Complete setup
          </Link>
        </p>
      )}

      <div className="admin-table-wrap">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Donations</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Last gift</th>
            </tr>
          </thead>
          <tbody className="bg-white text-slate-800">
            {donors.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No successful donations yet. Test at{" "}
                  <Link href="/collaboration/donation/" className="admin-link">
                    /collaboration/donation
                  </Link>
                </td>
              </tr>
            ) : (
              donors.map((d, i) => (
                <tr key={d.donor_key} className="border-t border-slate-100">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{d.donor_name ?? "—"}</td>
                  <td className="px-4 py-3">{d.phone ?? "—"}</td>
                  <td className="px-4 py-3">{d.email ?? "—"}</td>
                  <td className="px-4 py-3">{d.donation_count ?? 0}</td>
                  <td className="px-4 py-3 font-semibold text-teal-800">
                    {formatInr(d.total_amount_paise)}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {d.last_donation_at
                      ? new Date(d.last_donation_at).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-card border-slate-200 bg-slate-50 p-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent donation transactions</h2>
            <p className="text-sm text-slate-600">
              Includes sandbox/test and production payments from PhonePe.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <Link
                key={option.value}
                href={`?status=${option.value}`}
                className={`rounded-full border px-3 py-1 text-sm transition-all hover:border-slate-400 ${
                  statusFilter === option.value
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Transaction</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Provider</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No donation transactions to show.
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-slate-500">
                      {formatTransactionDate(txn.created_at)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">
                      {txn.merchant_transaction_id}
                    </td>
                    <td className="px-4 py-3">{txn.donor_name ?? "—"}</td>
                    <td className="px-4 py-3">{txn.email ?? "—"}</td>
                    <td className="px-4 py-3">{txn.phone ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold text-teal-800">
                      {formatInr(txn.amount_paise)}
                    </td>
                    <td className="px-4 py-3">{txn.payment_provider ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor(
                          txn.status,
                        )}`}
                      >
                        {renderStatusLabel(txn.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

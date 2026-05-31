import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { donationStatusLabels, displayDonationStatus } from "@/lib/admin/donation-status";
import { getDonorLeaderboard, getRecentDonationTransactions } from "@/lib/services/donations";
import { getSupabaseEnv, getSiteUrl } from "@/lib/env";
import { getPhonePeConfig, getPhonePeEnvironment } from "@/src/lib/phonepe";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatInr(paise: number | null) {
  if (paise == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

const transactionColumns: AdminTableColumn[] = [
  { key: "donor_name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "merchant_transaction_id", header: "Transaction ID", format: "mono" },
  { key: "phonepe_transaction_id", header: "PhonePe ID", format: "mono" },
  { key: "amount_paise", header: "Amount", format: "inr" },
  { key: "phone", header: "Phone", format: "mono" },
  { key: "created_at", header: "Date", format: "datetime" },
  { key: "status_label", header: "Status", format: "status-pill", statusKey: "status" },
];

export default async function AdminDonorsPage() {
  const env = getSupabaseEnv();
  const phonePeConfig = getPhonePeConfig();
  const phonePeEnv = getPhonePeEnvironment();
  const siteUrl = getSiteUrl();
  const donors = env.configured ? await getDonorLeaderboard() : [];
  const transactions = env.configured ? await getRecentDonationTransactions(500) : [];

  const transactionRows = transactions.map((txn) => {
    const display = displayDonationStatus(txn.status, txn.phonepe_transaction_id);
    return {
      id: txn.id,
      donor_name: txn.donor_name ?? "—",
      email: txn.email ?? "—",
      merchant_transaction_id: txn.merchant_transaction_id,
      phonepe_transaction_id: txn.phonepe_transaction_id ?? "—",
      amount_paise: txn.amount_paise,
      phone: txn.phone ?? "—",
      created_at: txn.created_at,
      status: display.status,
      status_label: display.label,
    };
  });

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
                <tr key={`${String(d.email ?? "").toLowerCase()}-${d.phone ?? ""}`} className="border-t border-slate-100">
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
        <div className="mb-4 space-y-3">
          <h2 className="text-lg font-semibold">Recent donation transactions</h2>
          <p className="text-sm text-slate-600">
            Completed payments shown by default. A row only counts as completed when PhonePe returns
            a transaction ID. Filter by phone, transaction ID, or transaction type.
          </p>
          {phonePeConfig ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <p>
                <strong>PhonePe mode:</strong>{" "}
                {phonePeEnv === "production" ? "Live / production" : "Sandbox / UAT test mode"}
              </p>
              <p className="mt-1">
                Return URL sent to PhonePe:{" "}
                <code className="text-xs">{siteUrl}/collaboration/donation/status/</code>
              </p>
              <p className="mt-1 text-xs text-amber-900/80">
                {phonePeEnv === "sandbox"
                  ? "Sandbox payments appear in the PhonePe Business dashboard under Developer / UAT (not live transactions). Use the same Client ID as in your server env."
                  : "Live payments appear in the PhonePe Business production dashboard. Set NEXT_PUBLIC_SITE_URL to your live domain on the server."}
              </p>
            </div>
          ) : (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              PhonePe is not configured on this server. Add PHONEPE_CLIENT_ID, PHONEPE_CLIENT_SECRET,
              and PHONEPE_CLIENT_VERSION to the host environment.
            </p>
          )}
        </div>

        <AdminDataTable
          rows={transactionRows}
          columns={transactionColumns}
          emptyMessage="No donation transactions yet"
          searchPlaceholder="Search name, email, phone, transaction ID…"
          searchKeys={[
            "donor_name",
            "email",
            "phone",
            "merchant_transaction_id",
            "phonepe_transaction_id",
          ]}
          statusFilterKey="status"
          statusFilterLabel="Transaction type"
          statusFilterLabels={donationStatusLabels}
          defaultStatusFilter="success"
          dateFilterKey="created_at"
          showRowNumbers
          defaultPageSize={25}
        />
      </div>
    </div>
  );
}

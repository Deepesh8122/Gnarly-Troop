import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { getDonorLeaderboard } from "@/lib/services/donations";
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

export default async function AdminDonorsPage() {
  const env = getSupabaseEnv();
  const donors = env.configured ? await getDonorLeaderboard() : [];

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
    </div>
  );
}

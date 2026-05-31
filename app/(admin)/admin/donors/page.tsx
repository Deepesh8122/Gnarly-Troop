import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminDonorsPanel from "@/components/admin/AdminDonorsPanel";
import { AdminPageHeader } from "@/components/admin/AdminForm";
import { getRecentDonationTransactions, getDonorLeaderboard } from "@/lib/services/donations";
import { getSupabaseEnv, getSiteUrl } from "@/lib/env";
import { getPhonePeConfig } from "@/src/lib/phonepe";
import { getPhonePeEnvironment } from "@/lib/payments/phonepe-env";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDonorsPage() {
  const env = getSupabaseEnv();
  const phonePeConfig = getPhonePeConfig();
  const phonePeEnv = getPhonePeEnvironment();
  const siteUrl = getSiteUrl();
  const donors = env.configured ? await getDonorLeaderboard() : [];
  const transactions = env.configured ? await getRecentDonationTransactions(500) : [];

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title="Top donors"
        description="PhonePe donations ranked by total amount. Filter live vs UAT test payments below."
      />

      {!env.configured && (
        <p className="admin-card border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Supabase not connected.{" "}
          <Link href="/admin/setup/" className="underline">
            Complete setup
          </Link>
        </p>
      )}

      <AdminDonorsPanel
        donors={donors}
        transactions={transactions}
        serverPhonePeEnv={phonePeEnv}
        siteUrl={siteUrl}
        phonePeConfigured={Boolean(phonePeConfig)}
      />
    </div>
  );
}

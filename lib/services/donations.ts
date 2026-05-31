import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import type { PhonePePaymentEnvironment } from "@/lib/payments/phonepe-env";

export type DonationTier = {
  id: string;
  slug: string;
  title: string;
  amount_paise: number;
  description: string | null;
};

export type DonorLeaderboardRow = {
  donor_key: string;
  donor_name: string | null;
  email: string | null;
  phone: string | null;
  donation_count: number | null;
  total_amount_paise: number | null;
  last_donation_at: string | null;
};

export type DonationEnvironmentFilter = PhonePePaymentEnvironment | "all";

export async function getDonationTiers(): Promise<DonationTier[]> {
  if (!getSupabaseEnv().configured) return [];
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("donation_tiers")
    .select("id, slug, title, amount_paise, description")
    .eq("is_enabled", true)
    .order("sort_order");
  return (data ?? []) as DonationTier[];
}

export type DonationTransactionRow = {
  id: string;
  merchant_transaction_id: string;
  phonepe_transaction_id: string | null;
  donor_name: string | null;
  email: string | null;
  phone: string | null;
  amount_paise: number | null;
  payment_provider: string | null;
  payment_environment: PhonePePaymentEnvironment | null;
  status: string | null;
  created_at: string | null;
};

type DonationAggregateRow = {
  donor_name: string | null;
  email: string | null;
  phone: string | null;
  amount_paise: number | null;
  created_at: string | null;
  status: string | null;
  phonepe_transaction_id: string | null;
  payment_environment: PhonePePaymentEnvironment | null;
};

function donorKey(row: Pick<DonationAggregateRow, "email" | "phone">): string {
  return `${String(row.email ?? "").toLowerCase()}|${row.phone ?? ""}`;
}

function aggregateDonorLeaderboard(rows: DonationAggregateRow[]): DonorLeaderboardRow[] {
  const map = new Map<string, DonorLeaderboardRow>();

  for (const row of rows) {
    if (row.status !== "success" || !row.phonepe_transaction_id) continue;

    const key = donorKey(row);
    const existing = map.get(key);
    const amount = row.amount_paise ?? 0;
    const createdAt = row.created_at ?? null;

    if (!existing) {
      map.set(key, {
        donor_key: key,
        donor_name: row.donor_name,
        email: row.email,
        phone: row.phone,
        donation_count: 1,
        total_amount_paise: amount,
        last_donation_at: createdAt,
      });
      continue;
    }

    existing.donation_count = (existing.donation_count ?? 0) + 1;
    existing.total_amount_paise = (existing.total_amount_paise ?? 0) + amount;
    if (
      createdAt &&
      (!existing.last_donation_at || new Date(createdAt) > new Date(existing.last_donation_at))
    ) {
      existing.last_donation_at = createdAt;
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => (b.total_amount_paise ?? 0) - (a.total_amount_paise ?? 0),
  );
}

export async function getDonorLeaderboard(
  environment: DonationEnvironmentFilter = "all",
): Promise<DonorLeaderboardRow[]> {
  if (!getSupabaseEnv().configured) return [];

  if (environment === "all") {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.from("donor_leaderboard").select("*").limit(100);
    if (error) {
      console.error("[donor_leaderboard]", error.message);
      return [];
    }
    return (data ?? []) as DonorLeaderboardRow[];
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("donations")
    .select(
      "donor_name, email, phone, amount_paise, created_at, status, phonepe_transaction_id, payment_environment",
    )
    .eq("payment_environment", environment);

  if (error) {
    console.error("[donor_leaderboard filtered]", error.message);
    return [];
  }

  return aggregateDonorLeaderboard((data ?? []) as DonationAggregateRow[]).slice(0, 100);
}

export async function getRecentDonationTransactions(
  limit = 100,
  status?: string,
  environment: DonationEnvironmentFilter = "all",
): Promise<DonationTransactionRow[]> {
  if (!getSupabaseEnv().configured) return [];
  const supabase = createServiceRoleClient();
  let query = supabase
    .from("donations")
    .select(
      "id, merchant_transaction_id, phonepe_transaction_id, donor_name, email, phone, amount_paise, payment_provider, payment_environment, status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (environment !== "all") {
    query = query.eq("payment_environment", environment);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[donations]", error.message);
    return [];
  }

  return (data ?? []) as DonationTransactionRow[];
}

export async function getDonationByMerchantId(merchantTransactionId: string) {
  if (!getSupabaseEnv().configured) return null;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("donations")
    .select("*")
    .eq("merchant_transaction_id", merchantTransactionId)
    .maybeSingle();
  return data;
}

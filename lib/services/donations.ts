import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";

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
  status: string | null;
  created_at: string | null;
};

export async function getDonorLeaderboard(): Promise<DonorLeaderboardRow[]> {
  if (!getSupabaseEnv().configured) return [];
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("donor_leaderboard")
    .select("*")
    .limit(100);
  if (error) {
    console.error("[donor_leaderboard]", error.message);
    return [];
  }
  return (data ?? []) as DonorLeaderboardRow[];
}

export async function getRecentDonationTransactions(
  limit = 100,
  status?: string,
): Promise<DonationTransactionRow[]> {
  if (!getSupabaseEnv().configured) return [];
  const supabase = createServiceRoleClient();
  let query = supabase
    .from("donations")
    .select(
      "id, merchant_transaction_id, phonepe_transaction_id, donor_name, email, phone, amount_paise, payment_provider, status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status && status !== "all") {
    query = query.eq("status", status);
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

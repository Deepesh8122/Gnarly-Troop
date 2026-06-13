import { getSupabaseEnv } from "@/lib/env";

/** True when Supabase URL + anon key are configured (public reads do not require admin login). */
export function isPublicCmsConfigured(): boolean {
  return getSupabaseEnv().configured;
}

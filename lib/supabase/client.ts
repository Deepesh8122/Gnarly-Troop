"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";

export function createClient() {
  const env = getSupabaseEnv();
  if (!env.url || !env.anonKey) {
    throw new Error(
      `Supabase client: ${env.issues[0] ?? "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"}`,
    );
  }
  return createBrowserClient(env.url, env.anonKey);
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv().configured;
}

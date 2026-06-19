import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { assertSupabaseEnv, getSupabaseEnv } from "../env";

export function createPublicSupabaseClient() {
  const { url, anonKey } = assertSupabaseEnv();
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function createServerSupabaseClient() {
  const { url, anonKey } = assertSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          /* ignore */
        }
      },
    },
  });
}

export async function createServiceRoleClient() {
  const env = getSupabaseEnv();
  if (!env.url || !env.serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY required");
  }
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false },
  });
}

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { assertSupabaseEnv, getSupabaseEnv } from "@/lib/env";
import { assertAdminDeployEnabled } from "@/lib/deploy-security";
import { assertServiceRoleKey } from "@/lib/supabase/service-role";

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
          /* Server Component — cookies set in middleware / route handler */
        }
      },
    },
  });
}

/** Server-only — bypasses RLS for admin writes */
export function createServiceRoleClient() {
  assertAdminDeployEnabled();
  const env = getSupabaseEnv();
  if (!env.url || !env.serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for admin operations (Project Settings → API → service_role secret).",
    );
  }
  assertServiceRoleKey(env.serviceRoleKey);
  return createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function testSupabaseConnection(): Promise<{
  ok: boolean;
  message: string;
  details?: string;
}> {
  const env = getSupabaseEnv();
  if (!env.configured) {
    return { ok: false, message: "Environment not configured", details: env.issues.join("; ") };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("site_settings").select("key").limit(1);
    if (error) {
      if (error.code === "42P01") {
        return {
          ok: false,
          message: "Connected but tables missing",
          details: "Run supabase/RUN_ONLY_IF_MISSING.sql in SQL Editor",
        };
      }
      if (
        error.message?.includes("Invalid API key") ||
        error.message?.includes("JWT")
      ) {
        return {
          ok: false,
          message: "Invalid API key for Supabase client",
          details:
            "Use the legacy anon public JWT (starts with eyJ) from Project Settings → API → anon public, not a truncated or wrong key.",
        };
      }
      return { ok: false, message: error.message, details: error.code ?? undefined };
    }
    return { ok: true, message: "Connected to Supabase" };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Connection failed",
    };
  }
}

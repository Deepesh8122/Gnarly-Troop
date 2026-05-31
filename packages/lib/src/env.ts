export type SupabaseEnvStatus = {
  configured: boolean;
  url: string | null;
  anonKey: string | null;
  serviceRoleKey: string | null;
  issues: string[];
  warnings: string[];
};

function readAnonKey(): string | null {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim() ||
    null
  );
}

export function getSupabaseEnv(): SupabaseEnvStatus {
  const issues: string[] = [];
  const warnings: string[] = [];
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    null;
  const anonKey = readAnonKey();
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    null;

  if (!url) issues.push("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey) issues.push("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return {
    configured: Boolean(url && anonKey && issues.length === 0),
    url,
    anonKey,
    serviceRoleKey,
    issues,
    warnings,
  };
}

export function assertSupabaseEnv(): { url: string; anonKey: string } {
  const env = getSupabaseEnv();
  if (!env.configured || !env.url || !env.anonKey) {
    throw new Error(env.issues.join("; ") || "Supabase not configured");
  }
  return { url: env.url, anonKey: env.anonKey };
}

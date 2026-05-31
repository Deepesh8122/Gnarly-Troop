/**
 * Central Supabase env resolution.
 * Supports: legacy JWT anon key (eyJ...) and newer publishable keys (sb_publishable_...).
 */

export type SupabaseEnvStatus = {
  configured: boolean;
  url: string | null;
  anonKey: string | null;
  serviceRoleKey: string | null;
  /** Blocks connection (missing URL/key) */
  issues: string[];
  /** Hints only — does not block configured */
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

function isJwtKey(key: string): boolean {
  return key.startsWith("eyJ");
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
    process.env.SUPABASE_SERVICE_ROLE?.trim() ||
    null;

  if (!url) {
    issues.push(
      "Missing NEXT_PUBLIC_SUPABASE_URL (Project Settings → API → Project URL).",
    );
  } else if (!url.startsWith("https://")) {
    issues.push("NEXT_PUBLIC_SUPABASE_URL must start with https://");
  }

  if (!anonKey) {
    issues.push(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY (API → anon public key or publishable key).",
    );
  } else {
    const hasPublicPrefix =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_KEY);

    if (!hasPublicPrefix) {
      warnings.push(
        "Prefer NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local so login works in the browser.",
      );
    }

    if (isJwtKey(anonKey) && anonKey.length < 80) {
      warnings.push("JWT anon key looks truncated — paste the full key from Supabase.");
    }

    if (anonKey.startsWith("sb_publishable_") && anonKey.length < 20) {
      warnings.push("Publishable key looks truncated.");
    }
  }

  if (!serviceRoleKey) {
    warnings.push(
      "SUPABASE_SERVICE_ROLE_KEY not set — admin writes and donor list need it.",
    );
  }

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
    const lines = [...env.issues, ...env.warnings];
    throw new Error(`Supabase not configured:\n- ${lines.join("\n- ")}`);
  }
  return { url: env.url, anonKey: env.anonKey };
}

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

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

function isLocalHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".local")
  );
}

function siteUrlFromPlatform(): string | null {
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return vercel.startsWith("http") ? vercel.replace(/\/$/, "") : `https://${vercel}`;
  }
  return null;
}

function siteUrlFromRequest(request: Request): string | null {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost?.split(",")[0]?.trim() || request.headers.get("host");
  if (!host) return null;

  const hostname = host.split(":")[0];
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    (isLocalHost(hostname) ? "http" : "https");

  return `${proto}://${host}`.replace(/\/$/, "");
}

function normalizeOrigin(origin: string | null | undefined): string | null {
  if (!origin) return null;
  try {
    return new URL(origin).origin.replace(/\/$/, "");
  } catch {
    return null;
  }
}

function clientOriginMatchesRequest(request: Request, origin: string): boolean {
  try {
    const clientHost = new URL(origin).host;
    const requestHost =
      request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      request.headers.get("host");
    if (!requestHost) return false;
    return clientHost === requestHost;
  } catch {
    return false;
  }
}

/**
 * Public site URL for redirects (PhonePe return URL, auth callbacks).
 * Always prefers the host the user is actually on (from the incoming request).
 */
export function resolveSiteUrl(request?: Request, clientOrigin?: string | null): string {
  if (request) {
    const fromRequest = siteUrlFromRequest(request);
    if (fromRequest) return fromRequest;

    const fromClient = normalizeOrigin(clientOrigin);
    if (fromClient && clientOriginMatchesRequest(request, fromClient)) {
      return fromClient;
    }
  }

  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "") ||
    siteUrlFromPlatform() ||
    null;

  if (envUrl) return envUrl;
  return "http://localhost:3000";
}

export function getSiteUrl(): string {
  return resolveSiteUrl();
}

/** Decode JWT role claim (no verification — env check only). */
export function getSupabaseKeyRole(key: string): string | null {
  if (!key.startsWith("eyJ")) return null;
  try {
    const part = key.split(".")[1];
    if (!part) return null;
    const json = Buffer.from(part.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
      "utf8",
    );
    const payload = JSON.parse(json) as { role?: string };
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function assertServiceRoleKey(key: string): void {
  if (key.startsWith("sb_publishable_") || key.startsWith("sb_")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY looks like a publishable key. Use the service_role secret from Supabase → Project Settings → API (JWT starting with eyJ, role service_role).",
    );
  }
  const role = getSupabaseKeyRole(key);
  if (role && role !== "service_role") {
    throw new Error(
      `SUPABASE_SERVICE_ROLE_KEY has JWT role "${role}" but must be service_role. Paste the service_role secret from Supabase API settings.`,
    );
  }
}

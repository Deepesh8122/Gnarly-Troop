/**
 * Controls whether CMS admin routes and service-role APIs are active on this deployment.
 *
 * Public website deploy:  ENABLE_ADMIN=false  (default in production)
 * Private admin deploy:   ENABLE_ADMIN=true   + SUPABASE_SERVICE_ROLE_KEY
 *
 * If ENABLE_ADMIN is unset: enabled in development, disabled in production.
 */

export function isAdminDeployEnabled(): boolean {
  const raw = process.env.ENABLE_ADMIN?.trim().toLowerCase();
  if (raw === "true" || raw === "1" || raw === "yes") return true;
  if (raw === "false" || raw === "0" || raw === "no") return false;
  // Default on in dev; off in production unless explicitly enabled
  if (process.env.NODE_ENV !== "production") return true;
  return false;
}

export function assertAdminDeployEnabled(): void {
  if (!isAdminDeployEnabled()) {
    throw new Error(
      "Admin CMS is disabled on this deployment (ENABLE_ADMIN is not true).",
    );
  }
}

/** True when this host should never expose admin UI or privileged APIs. */
export function isPublicSiteDeployment(): boolean {
  return !isAdminDeployEnabled();
}

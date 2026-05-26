/** Feature flags for incremental CMS migration */
export const CMS_ENABLED =
  process.env.NEXT_PUBLIC_CMS_ENABLED === "true";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

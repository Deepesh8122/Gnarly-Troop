import type { PublishStatus } from "@gnarly/types";

const PUBLISH_STATUSES = new Set<PublishStatus>(["draft", "published", "archived"]);

/** Normalize form / DB values to a known publish status. */
export function normalizePublishStatus(raw: unknown): PublishStatus {
  const value = String(raw ?? "draft").trim().toLowerCase();
  if (PUBLISH_STATUSES.has(value as PublishStatus)) {
    return value as PublishStatus;
  }
  return "draft";
}

/** Whether a CMS row should appear on the public website. */
export function isLiveOnSite(entity: {
  status?: string | null;
  is_enabled?: boolean | null;
}): boolean {
  return normalizePublishStatus(entity.status) === "published" && entity.is_enabled === true;
}

/**
 * Derive consistent status + is_enabled from admin forms.
 * Status is the single source of truth: published → live, draft/archived → hidden.
 */
export function resolvePublishFields(formData: FormData): {
  status: PublishStatus;
  is_enabled: boolean;
} {
  const status = normalizePublishStatus(formData.get("status"));
  return {
    status,
    is_enabled: status === "published",
  };
}

export function publishStatusLabel(status: unknown): string {
  switch (normalizePublishStatus(status)) {
    case "published":
      return "Published";
    case "archived":
      return "Archived";
    default:
      return "Draft";
  }
}

/** Human-readable label for the status dropdown in admin forms. */
export const PUBLISH_STATUS_OPTIONS = [
  { value: "published", label: "Published — visible on website" },
  { value: "draft", label: "Draft — hidden from website" },
  { value: "archived", label: "Archived — hidden from website" },
] as const;

export const PUBLISH_STATUS_OPTIONS_SIMPLE = [
  { value: "published", label: "Published — visible on website" },
  { value: "draft", label: "Draft — hidden from website" },
] as const;

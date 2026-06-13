import { resolveThumbUrl, type ThumbSource } from "@/lib/admin/thumbnails";
import { isLiveOnSite, normalizePublishStatus, publishStatusLabel } from "@/lib/cms/publish-state";

function categoryName(cat: unknown): string {
  if (!cat) return "—";
  if (Array.isArray(cat)) return (cat[0] as { name?: string })?.name ?? "—";
  return (cat as { name?: string }).name ?? "—";
}

function asOptionalBoolean(value: unknown): boolean | null | undefined {
  if (value === true || value === false) return value;
  if (value === null || value === undefined) return value;
  return Boolean(value);
}

export function mapLeadershipTableRows(team: Record<string, unknown>[]) {
  return team.map((m) => ({
    id: String(m.id),
    thumbUrl: resolveThumbUrl(
      {
        legacy_image_path: m.legacy_image_path as string | null,
        media: m.image as ThumbSource["media"],
      },
      "/images/sections/founder-img.png",
    ),
    full_name: String(m.full_name),
    designation: String(m.designation),
    category: categoryName(m.team_categories),
    status: publishStatusLabel(m.status),
    status_raw: String(m.status),
    is_live: isLiveOnSite({ status: String(m.status), is_enabled: asOptionalBoolean(m.is_enabled) }),
  }));
}

export function mapCollaborationTableRows(partners: Record<string, unknown>[]) {
  return partners.map((p) => ({
    id: String(p.id),
    thumbUrl: resolveThumbUrl(
      {
        legacy_image_path: p.legacy_image_path as string | null,
        media: p.logo as ThumbSource["media"],
      },
      "/images/logos/logo-2.png",
    ),
    name: String(p.name),
    slug: String(p.slug),
    category: categoryName(p.collaboration_categories),
    status: publishStatusLabel(p.status),
    status_raw: String(p.status),
    is_live: isLiveOnSite({ status: String(p.status), is_enabled: asOptionalBoolean(p.is_enabled) }),
  }));
}

export function mapEventsTableRows(events: Record<string, unknown>[]) {
  return events.map((e) => ({
    id: String(e.id),
    thumbUrl: resolveThumbUrl({ media: e.banner as ThumbSource["media"] }, "/images/sections/pm-img.png"),
    title: String(e.title),
    slug: String(e.slug),
    status: publishStatusLabel(e.status),
    status_raw: String(e.status),
    is_live: normalizePublishStatus(String(e.status)) === "published",
    starts_at: e.starts_at as string | null,
  }));
}

export function mapGalleriesTableRows(galleries: Record<string, unknown>[]) {
  return galleries.map((g) => ({
    id: String(g.id),
    thumbUrl: resolveThumbUrl(
      { media: g.cover as ThumbSource["media"] },
      "/images/sections/founder-img.png",
    ),
    title: String(g.title),
    slug: String(g.slug),
    status: publishStatusLabel(g.status),
    status_raw: String(g.status),
    is_live: isLiveOnSite({ status: String(g.status), is_enabled: asOptionalBoolean(g.is_enabled) }),
  }));
}

export function mapPagesTableRows(
  pages: {
    id: string;
    title: string;
    slug: string;
    status: string;
    is_home: boolean;
  }[],
) {
  return pages.map((p) => ({
    id: p.id,
    thumbUrl: p.is_home ? "/images/sections/founder-img.png" : `/images/logos/logo-2.png`,
    title: p.title,
    slug: `/${p.slug}`,
    status: publishStatusLabel(p.status),
    status_raw: p.status,
    is_live: normalizePublishStatus(p.status) === "published",
    is_home: p.is_home,
  }));
}

import { resolveThumbUrl, type ThumbSource } from "@/lib/admin/thumbnails";

function categoryName(cat: unknown): string {
  if (!cat) return "—";
  if (Array.isArray(cat)) return (cat[0] as { name?: string })?.name ?? "—";
  return (cat as { name?: string }).name ?? "—";
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
    status: String(m.status),
    is_enabled: Boolean(m.is_enabled),
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
    status: String(p.status),
    is_enabled: Boolean(p.is_enabled),
  }));
}

export function mapEventsTableRows(events: Record<string, unknown>[]) {
  return events.map((e) => ({
    id: String(e.id),
    thumbUrl: resolveThumbUrl({ media: e.banner as ThumbSource["media"] }, "/images/sections/pm-img.png"),
    title: String(e.title),
    slug: String(e.slug),
    status: String(e.status),
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
    status: String(g.status),
    is_enabled: Boolean(g.is_enabled),
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
    status: p.status,
    is_home: p.is_home,
  }));
}

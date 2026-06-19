import { cache } from "react";
import type { LeadershipItem } from "@/src/lib/leadership";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { isPublicCmsConfigured } from "@/lib/cms/public-read";
import { sanitizeLeadershipHtml } from "@/lib/cms/sanitizeHtml";
import { isAllowedTeamCategorySlug, TEAM_CATEGORY_SLUGS } from "@/lib/team-categories";
import { getPublicMediaUrl } from "@gnarly/lib";

export type LeadershipCategoryGroup = {
  slug: string;
  name: string;
  displayStyle: "carousel" | "grid";
  sortOrder: number;
  description?: string | null;
  members: LeadershipItem[];
};

type MemberRow = {
  id?: string;
  slug: string;
  full_name: string;
  designation: string;
  division: string | null;
  region: string | null;
  bio_html?: string | null;
  bio_paragraphs: string[] | unknown;
  education?: string | null;
  linkedin_url?: string | null;
  social_links?: Record<string, string> | null;
  legacy_image_path: string | null;
  sort_order: number;
  team_categories: { slug: string; name: string; display_style: string; sort_order: number } | null;
  image: {
    bucket: string;
    storage_path: string;
    alt_text?: string | null;
  } | {
    bucket: string;
    storage_path: string;
    alt_text?: string | null;
  }[] | null;
  articles?: {
    title: string;
    excerpt: string | null;
    href: string;
    article_type: string | null;
    is_enabled: boolean;
  }[];
};

function normalizeCategory(
  cat: MemberRow["team_categories"],
): { slug: string; name: string; display_style: string; sort_order: number } | null {
  if (!cat) return null;
  if (Array.isArray(cat)) return cat[0] ?? null;
  return cat;
}

function normalizeImage(
  image: MemberRow["image"],
): { bucket: string; storage_path: string; alt_text?: string | null } | null {
  if (!image) return null;
  const row = Array.isArray(image) ? image[0] : image;
  if (!row?.storage_path) return null;
  return row;
}

function imageSrc(row: MemberRow): string {
  if (row.legacy_image_path) {
    return row.legacy_image_path.startsWith("/")
      ? row.legacy_image_path
      : `/${row.legacy_image_path}`;
  }

  const image = normalizeImage(row.image);
  if (image) {
    if (image.bucket === "site" || image.storage_path.startsWith("/")) {
      return image.storage_path.startsWith("/")
        ? image.storage_path
        : `/${image.storage_path}`;
    }
    return getPublicMediaUrl(image);
  }

  return "/images/logos/logo-2.png";
}

function normalizeSocialLinks(
  row: MemberRow,
): LeadershipItem["socialLinks"] | undefined {
  const raw = row.social_links;
  const links: NonNullable<LeadershipItem["socialLinks"]> = {};

  if (raw && typeof raw === "object") {
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === "string" && value.trim()) {
        links[key as keyof NonNullable<LeadershipItem["socialLinks"]>] = value.trim();
      }
    }
  }

  if (row.linkedin_url?.trim()) {
    links.linkedin = row.linkedin_url.trim();
  }

  return Object.keys(links).length ? links : undefined;
}

function mapMember(row: MemberRow): LeadershipItem {
  const paragraphs = Array.isArray(row.bio_paragraphs)
    ? (row.bio_paragraphs as string[]).filter((p) => typeof p === "string" && p.trim())
    : [];
  const cat = normalizeCategory(row.team_categories);
  const sectionSlug = cat?.slug ?? "leaders";
  const image = normalizeImage(row.image);

  return {
    slug: row.slug,
    src: imageSrc(row),
    filename: image?.storage_path ?? "",
    title: row.designation,
    alt: row.full_name,
    name: row.full_name,
    division: row.division ?? undefined,
    section: sectionSlug as LeadershipItem["section"],
    categoryName: cat?.name,
    region: row.region ?? undefined,
    short: paragraphs[0] ?? stripHtml(row.bio_html)?.slice(0, 200),
    bio: row.bio_html ? sanitizeLeadershipHtml(row.bio_html) : undefined,
    bioParagraphs: paragraphs.length ? paragraphs : undefined,
    education: row.education ?? undefined,
    linkedin: row.linkedin_url ?? undefined,
    socialLinks: normalizeSocialLinks(row),
    articles: row.articles?.length
      ? row.articles
          .filter((a) => a.is_enabled)
          .map((a) => ({
            title: a.title,
            excerpt: a.excerpt ?? "",
            href: a.href,
            type: (a.article_type as "Article" | "Video" | "Story") ?? "Article",
          }))
      : undefined,
  };
}

function safeMapMember(row: MemberRow): LeadershipItem | null {
  try {
    return mapMember(row);
  } catch (error) {
    console.error("[mapMember]", row.slug, error);
    return null;
  }
}

function stripHtml(html: string | null | undefined): string | undefined {
  if (!html) return undefined;
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function hasCmsLeadership(): Promise<boolean> {
  if (!isPublicCmsConfigured()) return false;
  try {
    const supabase = createPublicSupabaseClient();
    const { count, error } = await supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .eq("is_enabled", true);
    if (error) {
      console.error("[hasCmsLeadership]", error.message);
      return false;
    }
    return (count ?? 0) > 0;
  } catch (error) {
    console.error("[hasCmsLeadership]", error);
    return false;
  }
}

/** Legacy section-based grouping (backward compatible) */
export async function fetchCmsLeadership(): Promise<{
  bySection: Record<string, LeadershipItem[]>;
  divisions: string[];
  regions: string[];
  slugs: string[];
} | null> {
  const grouped = await fetchCmsLeadershipByCategories();
  if (!grouped) return null;

  const bySection: Record<string, LeadershipItem[]> = {};
  for (const cat of grouped.categories) {
    bySection[cat.slug] = cat.members;
  }

  return {
    bySection,
    divisions: grouped.divisions,
    regions: grouped.regions,
    slugs: grouped.slugs,
  };
}

/** Dynamic categories from team_categories table */
export const fetchCmsLeadershipByCategories = cache(async (): Promise<{
  categories: LeadershipCategoryGroup[];
  divisions: string[];
  regions: string[];
  slugs: string[];
} | null> => {
  if (!isPublicCmsConfigured()) return null;

  const supabase = createPublicSupabaseClient();

  const [{ data: categoryRows, error: categoryError }, { data: memberRows, error: memberError }] =
    await Promise.all([
      supabase
        .from("team_categories")
        .select("slug, name, display_style, sort_order, description")
        .eq("is_enabled", true)
        .in("slug", TEAM_CATEGORY_SLUGS)
        .order("sort_order"),
      supabase
        .from("team_members")
        .select(
          `slug, full_name, designation, division, region, bio_paragraphs, legacy_image_path, sort_order,
           team_categories(slug, name, display_style, sort_order),
           image:media_library!team_members_image_media_id_fkey(bucket, storage_path, alt_text)`,
        )
        .eq("status", "published")
        .eq("is_enabled", true)
        .order("sort_order"),
    ]);

  if (categoryError) {
    console.error("[fetchCmsLeadershipByCategories]", categoryError.message);
  }

  if (memberError) {
    console.error("[fetchCmsLeadershipByCategories]", memberError.message);
    return null;
  }

  if (!memberRows?.length) return null;

  const members = (memberRows as unknown as MemberRow[])
    .map(safeMapMember)
    .filter((m): m is LeadershipItem => m !== null)
    .filter((m) => isAllowedTeamCategorySlug(m.section));
  const divisions = new Set<string>();
  const regions = new Set<string>();
  members.forEach((m) => {
    if (m.division) divisions.add(m.division);
    if (m.region) regions.add(m.region);
  });

  const membersByCategory = new Map<string, LeadershipItem[]>();
  for (const m of members) {
    const list = membersByCategory.get(m.section) ?? [];
    list.push(m);
    membersByCategory.set(m.section, list);
  }

  const categories: LeadershipCategoryGroup[] = (categoryRows ?? []).map((c) => ({
    slug: c.slug,
    name: c.name,
    displayStyle: (c.display_style === "carousel" ? "carousel" : "grid") as "carousel" | "grid",
    sortOrder: c.sort_order,
    description: c.description ?? null,
    members: membersByCategory.get(c.slug) ?? [],
  }));

  // Categories with members but missing from team_categories row
  for (const [slug, list] of membersByCategory) {
    if (!categories.some((c) => c.slug === slug) && list.length > 0) {
      categories.push({
        slug,
        name: list[0]?.categoryName ?? slug,
        displayStyle: "grid",
        sortOrder: 999,
        description: null,
        members: list,
      });
    }
  }

  categories.sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    categories,
    divisions: Array.from(divisions),
    regions: Array.from(regions).sort(),
    slugs: members.map((m) => m.slug),
  };
});

export const fetchCmsLeadershipMember = cache(async (
  slug: string,
): Promise<LeadershipItem | null> => {
  if (!isPublicCmsConfigured()) return null;

  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("team_members")
      .select(
        `*, team_categories(slug, name, display_style, sort_order),
       image:media_library!team_members_image_media_id_fkey(bucket, storage_path, alt_text),
       articles:team_member_articles(*)`,
      )
      .eq("slug", slug)
      .eq("status", "published")
      .eq("is_enabled", true)
      .maybeSingle();

    if (error) {
      console.error("[fetchCmsLeadershipMember]", slug, error.message);
      return null;
    }

    if (!data) return null;
    return safeMapMember(data as MemberRow);
  } catch (error) {
    console.error("[fetchCmsLeadershipMember]", slug, error);
    return null;
  }
});

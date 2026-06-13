import type { LeadershipItem } from "@/src/lib/leadership";
import { getSupabaseEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAllowedTeamCategorySlug, TEAM_CATEGORY_SLUGS } from "@/lib/team-categories";
import { getPublicMediaUrl } from "@gnarly/lib";

export type LeadershipCategoryGroup = {
  slug: string;
  name: string;
  displayStyle: "carousel" | "grid";
  sortOrder: number;
  members: LeadershipItem[];
};

type MemberRow = {
  id: string;
  slug: string;
  full_name: string;
  designation: string;
  division: string | null;
  region: string | null;
  bio_html: string | null;
  bio_paragraphs: string[] | unknown;
  education: string | null;
  linkedin_url: string | null;
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
  articles: {
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
  image: MemberRow["image"] | MemberRow["image"][] | null | undefined,
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
    bio: row.bio_html ?? undefined,
    bioParagraphs: paragraphs.length ? paragraphs : undefined,
    education: row.education ?? undefined,
    linkedin: row.linkedin_url ?? undefined,
    articles: (row.articles ?? [])
      .filter((a) => a.is_enabled)
      .map((a) => ({
        title: a.title,
        excerpt: a.excerpt ?? "",
        href: a.href,
        type: (a.article_type as "Article" | "Video" | "Story") ?? "Article",
      })),
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

function stripHtml(html: string | null): string | undefined {
  if (!html) return undefined;
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function hasCmsLeadership(): Promise<boolean> {
  if (!getSupabaseEnv().configured) return false;
  try {
    const supabase = await createServerSupabaseClient();
    const { count } = await supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .eq("is_enabled", true);
    return (count ?? 0) > 0;
  } catch {
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
export async function fetchCmsLeadershipByCategories(): Promise<{
  categories: LeadershipCategoryGroup[];
  divisions: string[];
  regions: string[];
  slugs: string[];
} | null> {
  if (!(await hasCmsLeadership())) return null;

  const supabase = await createServerSupabaseClient();

  const { data: categoryRows } = await supabase
    .from("team_categories")
    .select("slug, name, display_style, sort_order")
    .eq("is_enabled", true)
    .in("slug", TEAM_CATEGORY_SLUGS)
    .order("sort_order");

  const { data: memberRows } = await supabase
    .from("team_members")
    .select(
      `*, team_categories(slug, name, display_style, sort_order),
       image:media_library!team_members_image_media_id_fkey(bucket, storage_path, alt_text),
       articles:team_member_articles(*)`,
    )
    .eq("status", "published")
    .eq("is_enabled", true)
    .order("sort_order");

  if (!memberRows?.length) return null;

  const members = (memberRows as MemberRow[])
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
}

export async function fetchCmsLeadershipMember(
  slug: string,
): Promise<LeadershipItem | null> {
  if (!(await hasCmsLeadership())) return null;

  try {
    const supabase = await createServerSupabaseClient();
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
}

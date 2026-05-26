import type { LeadershipItem, LeadershipSection } from "@/src/lib/leadership";
import { getSupabaseEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPublicMediaUrl } from "@gnarly/lib";

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
  team_categories: { slug: string } | null;
  image: {
    bucket: string;
    storage_path: string;
    alt_text?: string | null;
  } | null;
  articles: {
    title: string;
    excerpt: string | null;
    href: string;
    article_type: string | null;
    is_enabled: boolean;
  }[];
};

function imageSrc(row: MemberRow): string {
  if (row.legacy_image_path) {
    return row.legacy_image_path.startsWith("/")
      ? row.legacy_image_path
      : `/${row.legacy_image_path}`;
  }
  if (row.image) {
    if (row.image.bucket === "site" || row.image.storage_path.startsWith("/")) {
      return row.image.storage_path.startsWith("/")
        ? row.image.storage_path
        : `/${row.image.storage_path}`;
    }
    return getPublicMediaUrl(row.image);
  }
  return "/images/logos/logo-2.png";
}

function mapMember(row: MemberRow): LeadershipItem {
  const paragraphs = Array.isArray(row.bio_paragraphs)
    ? (row.bio_paragraphs as string[])
    : [];
  const section = (row.team_categories?.slug ?? "leaders") as LeadershipSection;

  return {
    slug: row.slug,
    src: imageSrc(row),
    filename: row.image?.storage_path ?? "",
    title: row.designation,
    alt: row.full_name,
    name: row.full_name,
    division: row.division ?? undefined,
    section,
    region: row.region ?? undefined,
    short: paragraphs[0] ?? row.bio_html ?? undefined,
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

export async function fetchCmsLeadership(): Promise<{
  bySection: Record<LeadershipSection, LeadershipItem[]>;
  divisions: string[];
  regions: string[];
  slugs: string[];
} | null> {
  if (!(await hasCmsLeadership())) return null;

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("team_members")
    .select(
      `*, team_categories(slug),
       image:media_library!team_members_image_media_id_fkey(bucket, storage_path, alt_text),
       articles:team_member_articles(*)`,
    )
    .eq("status", "published")
    .eq("is_enabled", true)
    .order("sort_order");

  if (!data?.length) return null;

  const members = (data as MemberRow[]).map(mapMember);
  const bySection: Record<LeadershipSection, LeadershipItem[]> = {
    executive: [],
    board: [],
    advisory: [],
    leaders: [],
    historical: [],
  };

  for (const m of members) {
    if (bySection[m.section]) bySection[m.section].push(m);
  }

  const divisions = new Set<string>();
  const regions = new Set<string>();
  members.forEach((m) => {
    if (m.division) divisions.add(m.division);
    if (m.region) regions.add(m.region);
  });

  return {
    bySection,
    divisions: Array.from(divisions),
    regions: Array.from(regions).sort(),
    slugs: members.map((m) => m.slug),
  };
}

export async function fetchCmsLeadershipMember(
  slug: string,
): Promise<LeadershipItem | null> {
  if (!(await hasCmsLeadership())) return null;

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("team_members")
    .select(
      `*, team_categories(slug),
       image:media_library!team_members_image_media_id_fkey(bucket, storage_path, alt_text),
       articles:team_member_articles(*)`,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_enabled", true)
    .maybeSingle();

  if (!data) return null;
  return mapMember(data as MemberRow);
}

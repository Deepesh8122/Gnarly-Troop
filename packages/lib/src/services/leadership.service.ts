import type { TeamMember } from "@gnarly/types";
import { mapMediaRow } from "../media/resolve-url";
import { createServerSupabaseClient } from "../supabase/server";

export async function getTeamCategoriesWithMembers() {
  const supabase = await createServerSupabaseClient();

  const { data: categories } = await supabase
    .from("team_categories")
    .select("id, slug, name, display_style, sort_order")
    .eq("is_enabled", true)
    .order("sort_order");

  const { data: members } = await supabase
    .from("team_members")
    .select(
      `*, team_categories(slug), image:media_library!team_members_image_media_id_fkey(*),
       articles:team_member_articles(*)`,
    )
    .eq("status", "published")
    .eq("is_enabled", true)
    .order("sort_order");

  const grouped = (categories ?? []).map((cat) => ({
    ...cat,
    members: (members ?? [])
      .filter((m) => m.category_id === cat.id)
      .map(normalizeMember),
  }));

  return grouped;
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("team_members")
    .select(
      `*, team_categories(slug, name),
       image:media_library!team_members_image_media_id_fkey(*),
       articles:team_member_articles(*)`,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_enabled", true)
    .maybeSingle();

  if (error || !data) return null;
  return normalizeMember(data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMember(row: any): TeamMember {
  const image = row.image ? mapMediaRow(row.image) : null;
  return {
    id: row.id,
    slug: row.slug,
    full_name: row.full_name,
    designation: row.designation,
    division: row.division,
    region: row.region,
    bio_html: row.bio_html,
    bio_paragraphs: Array.isArray(row.bio_paragraphs) ? row.bio_paragraphs : [],
    education: row.education,
    image,
    linkedin_url: row.linkedin_url,
    category_slug: row.team_categories?.slug ?? "",
    articles: (row.articles ?? [])
      .filter((a: { is_enabled: boolean }) => a.is_enabled)
      .map((a: { id: string; title: string; excerpt: string; href: string; article_type: string }) => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt,
        href: a.href,
        article_type: a.article_type,
      })),
  };
}

import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  TEAM_PORTAL_CATEGORIES,
  TEAM_PORTAL_MEMBERS,
} from "@/lib/admin/team-portal-data";
import { isAllowedTeamCategorySlug } from "@/lib/team-categories";

function paragraphsToHtml(paragraphs: string[]): string {
  return paragraphs.map((p) => `<p>${p}</p>`).join("");
}

export async function importTeamPortalContent(): Promise<{
  categories: number;
  members: number;
  message: string;
}> {
  const supabase = createServiceRoleClient();
  let categories = 0;
  let members = 0;

  for (const cat of TEAM_PORTAL_CATEGORIES) {
    if (!isAllowedTeamCategorySlug(cat.slug)) continue;
    const { error } = await supabase.from("team_categories").upsert(
      {
        slug: cat.slug,
        name: cat.name,
        display_style: cat.display_style,
        sort_order: cat.sort_order,
        is_enabled: true,
      },
      { onConflict: "slug" },
    );
    if (error) throw new Error(`Category ${cat.slug}: ${error.message}`);
    categories++;
  }

  const { data: catRows, error: catErr } = await supabase
    .from("team_categories")
    .select("id, slug");
  if (catErr) throw new Error(catErr.message);

  const catMap = new Map((catRows ?? []).map((c) => [c.slug, c.id]));

  for (const member of TEAM_PORTAL_MEMBERS) {
    if (!isAllowedTeamCategorySlug(member.categorySlug)) continue;
    const categoryId = catMap.get(member.categorySlug);
    if (!categoryId) {
      throw new Error(`Unknown category slug: ${member.categorySlug}`);
    }

    const bioHtml = paragraphsToHtml(member.bio_paragraphs);
    const { error } = await supabase.from("team_members").upsert(
      {
        category_id: categoryId,
        slug: member.slug,
        full_name: member.full_name,
        designation: member.designation,
        bio_html: bioHtml,
        bio_paragraphs: member.bio_paragraphs,
        sort_order: member.sort_order,
        status: "published",
        is_enabled: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    );
    if (error) throw new Error(`Member ${member.slug}: ${error.message}`);
    members++;
  }

  return {
    categories,
    members,
    message: `Imported ${categories} categories and ${members} team members from GTGF Portal document.`,
  };
}

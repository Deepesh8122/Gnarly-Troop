import type { CollaborationPartner } from "@gnarly/types";
import { mapMediaRow } from "../media/resolve-url";
import { createServerSupabaseClient } from "../supabase/server";

export async function getCollaborationPartners() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("collaboration_partners")
    .select(
      `*, category:collaboration_categories(slug, name),
       logo:media_library!collaboration_partners_logo_media_id_fkey(*),
       banner:media_library!collaboration_partners_banner_media_id_fkey(*)`,
    )
    .eq("status", "published")
    .eq("is_enabled", true)
    .order("sort_order");

  return (data ?? []).map(normalizePartner);
}

export async function getCollaborationPartnerBySlug(
  slug: string,
): Promise<CollaborationPartner | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("collaboration_partners")
    .select(
      `*, category:collaboration_categories(slug, name),
       logo:media_library!collaboration_partners_logo_media_id_fkey(*),
       banner:media_library!collaboration_partners_banner_media_id_fkey(*),
       collaboration_partner_gallery(media_id, caption, sort_order, media:media_library(*))`,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_enabled", true)
    .maybeSingle();

  if (error || !data) return null;
  return normalizePartner(data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePartner(row: any): CollaborationPartner {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    short_description: row.short_description,
    description_html: row.description_html,
    logo: row.logo ? mapMediaRow(row.logo) : null,
    banner: row.banner ? mapMediaRow(row.banner) : null,
    phone: row.phone,
    email: row.email,
    website_url: row.website_url,
    additional_info: row.additional_info ?? {},
    landing_blocks: row.landing_blocks ?? [],
    detail_content: row.detail_content ?? {},
    category: row.category ?? null,
    gallery: (row.collaboration_partner_gallery ?? [])
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
      .map((g: { media: Parameters<typeof mapMediaRow>[0] }) => mapMediaRow(g.media)),
  };
}

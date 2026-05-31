import { getSupabaseEnv } from "@/lib/env";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { TEAM_CATEGORY_SLUGS } from "@/lib/team-categories";

function adminDb() {
  const env = getSupabaseEnv();
  if (!env.configured || !env.serviceRoleKey) return null;
  try {
    return createServiceRoleClient();
  } catch {
    return null;
  }
}

export { adminDb };

export async function getAdminDashboardStats() {
  const supabase = adminDb();
  if (!supabase) return null;

  const [
    pages,
    events,
    registrations,
    media,
    team,
    partners,
    galleries,
    donations,
    brochureLeads,
  ] = await Promise.all([
    supabase.from("pages").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase
      .from("event_registrations")
      .select("id", { count: "exact", head: true }),
    supabase.from("media_library").select("id", { count: "exact", head: true }),
    supabase.from("team_members").select("id", { count: "exact", head: true }),
    supabase.from("collaboration_partners").select("id", { count: "exact", head: true }),
    supabase.from("galleries").select("id", { count: "exact", head: true }),
    supabase
      .from("donations")
      .select("id", { count: "exact", head: true })
      .eq("status", "success")
      .not("phonepe_transaction_id", "is", null),
    supabase
      .from("brochure_download_leads")
      .select("id", { count: "exact", head: true }),
  ]);

  return {
    pages: pages.count ?? 0,
    events: events.count ?? 0,
    registrations: registrations.count ?? 0,
    media: media.count ?? 0,
    team: team.count ?? 0,
    partners: partners.count ?? 0,
    galleries: galleries.count ?? 0,
    donations: donations.count ?? 0,
    brochureLeads: brochureLeads.count ?? 0,
  };
}

export async function getAdminPages() {
  const supabase = adminDb();
  if (!supabase) return [];
  const { data } = await supabase
    .from("pages")
    .select("id, slug, title, status, is_home, updated_at")
    .order("slug");
  return data ?? [];
}

export async function getAdminPageSections(pageId: string) {
  const supabase = adminDb();
  if (!supabase) return [];
  const { data } = await supabase
    .from("page_sections")
    .select("id, section_type, title, sort_order, is_enabled, content")
    .eq("page_id", pageId)
    .order("sort_order");
  return data ?? [];
}

export async function getAdminEvents() {
  const supabase = adminDb();
  if (!supabase) return [];
  const { data } = await supabase
    .from("events")
    .select(
      "id, slug, title, status, starts_at, registration_enabled, banner:media_library!events_banner_media_id_fkey(bucket, storage_path)",
    )
    .order("starts_at", { ascending: false });
  return data ?? [];
}

export async function getAdminEventRegistrations(limit = 200) {
  const supabase = adminDb();
  if (!supabase) return [];
  const { data } = await supabase
    .from("event_registrations")
    .select(
      "id, full_name, email, phone, organization, designation, eligibility, country, state, city, status, created_at, events(title, slug)",
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getAdminTeam() {
  const supabase = adminDb();
  if (!supabase) return [];
  const { data } = await supabase
    .from("team_members")
    .select(
      "id, slug, full_name, designation, status, is_enabled, sort_order, legacy_image_path, image:media_library!team_members_image_media_id_fkey(bucket, storage_path), team_categories(name, slug)",
    )
    .order("sort_order");
  return data ?? [];
}

export async function getAdminCollaborationPartners() {
  const supabase = adminDb();
  if (!supabase) return [];
  const { data } = await supabase
    .from("collaboration_partners")
    .select(
      "id, slug, name, status, is_enabled, email, phone, legacy_image_path, logo:media_library!collaboration_partners_logo_media_id_fkey(bucket, storage_path), collaboration_categories(name)",
    )
    .order("sort_order");
  return data ?? [];
}

export async function getAdminGalleries() {
  const supabase = adminDb();
  if (!supabase) return [];
  const { data } = await supabase
    .from("galleries")
    .select(
      "id, slug, title, category, status, is_enabled, cover:media_library!galleries_cover_media_id_fkey(bucket, storage_path)",
    )
    .order("sort_order");
  return data ?? [];
}

export async function getAdminMenus() {
  const supabase = adminDb();
  if (!supabase) return [];
  const { data } = await supabase
    .from("navigation_menus")
    .select("id, name, slug, location, updated_at")
    .order("location");
  return data ?? [];
}

export async function getAdminMenu(id: string) {
  const supabase = adminDb();
  if (!supabase) return null;
  const { data } = await supabase
    .from("navigation_menus")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getAdminMenuItems(menuId: string) {
  const supabase = adminDb();
  if (!supabase) return [];
  const { data } = await supabase
    .from("navigation_menu_items")
    .select("id, label, url, page_id, sort_order, is_enabled, open_in_new_tab, pages(slug, title)")
    .eq("menu_id", menuId)
    .order("sort_order");
  return data ?? [];
}

export async function getAdminPagesForSelect() {
  const supabase = adminDb();
  if (!supabase) return [];
  const { data } = await supabase
    .from("pages")
    .select("id, slug, title, is_home")
    .eq("status", "published")
    .order("title");
  return data ?? [];
}

export async function getAdminMedia(limit = 100) {
  const supabase = adminDb();
  if (!supabase) return [];
  const { data } = await supabase
    .from("media_library")
    .select("id, file_name, bucket, storage_path, media_kind, mime_type, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getAdminSettings() {
  const supabase = adminDb();
  if (!supabase) return { settings: [], social: [] };
  const [{ data: settings }, { data: social }] = await Promise.all([
    supabase.from("site_settings").select("key, value, description").order("key"),
    supabase.from("social_links").select("id, platform, url, is_enabled, sort_order").order("sort_order"),
  ]);
  return { settings: settings ?? [], social: social ?? [] };
}

export async function getAdminPage(id: string) {
  const supabase = adminDb();
  if (!supabase) return null;
  const { data } = await supabase.from("pages").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getAdminPageSection(sectionId: string) {
  const supabase = adminDb();
  if (!supabase) return null;
  const { data } = await supabase
    .from("page_sections")
    .select("*, pages(slug, title)")
    .eq("id", sectionId)
    .maybeSingle();
  return data;
}

export async function getAdminEvent(id: string) {
  const supabase = adminDb();
  if (!supabase) return null;
  const { data } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getAdminTeamMember(id: string) {
  const supabase = adminDb();
  if (!supabase) return null;
  const { data } = await supabase
    .from("team_members")
    .select("*, team_categories(id, slug, name)")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getAdminTeamCategories() {
  const supabase = adminDb();
  if (!supabase) return [];
  const { data } = await supabase
    .from("team_categories")
    .select("id, slug, name, display_style, sort_order, is_enabled")
    .in("slug", TEAM_CATEGORY_SLUGS)
    .order("sort_order");
  return data ?? [];
}

export async function getAdminTeamCategory(id: string) {
  const supabase = adminDb();
  if (!supabase) return null;
  const { data } = await supabase
    .from("team_categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getAdminTeamCategoriesWithCounts() {
  const supabase = adminDb();
  if (!supabase) return [];
  const { data: categories } = await supabase
    .from("team_categories")
    .select("id, slug, name, display_style, sort_order, is_enabled")
    .in("slug", TEAM_CATEGORY_SLUGS)
    .order("sort_order");
  if (!categories?.length) return [];

  const { data: members } = await supabase.from("team_members").select("category_id");
  const counts = new Map<string, number>();
  for (const m of members ?? []) {
    counts.set(m.category_id, (counts.get(m.category_id) ?? 0) + 1);
  }

  return categories.map((c) => ({
    ...c,
    member_count: counts.get(c.id) ?? 0,
  }));
}

export async function getAdminCollaborationPartner(id: string) {
  const supabase = adminDb();
  if (!supabase) return null;
  const { data } = await supabase
    .from("collaboration_partners")
    .select("*, collaboration_categories(id, slug, name)")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getAdminCollaborationCategories() {
  const supabase = adminDb();
  if (!supabase) return [];
  const { data } = await supabase
    .from("collaboration_categories")
    .select("id, slug, name")
    .order("sort_order");
  return data ?? [];
}

export async function getAdminCollaborationLanding() {
  const supabase = adminDb();
  if (!supabase) return null;
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "collaboration_landing")
    .maybeSingle();
  return data?.value ?? null;
}

export async function getAdminGallery(id: string) {
  const supabase = adminDb();
  if (!supabase) return null;
  const { data } = await supabase.from("galleries").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getAdminMediaList() {
  return getAdminMedia(200);
}

export async function getAdminVisionPillar(id: string) {
  const supabase = adminDb();
  if (!supabase) return null;
  const { data } = await supabase
    .from("vision_items")
    .select(
      "*, cover:media_library!vision_items_cover_media_id_fkey(id, bucket, storage_path)",
    )
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getAdminVisionBlock(blockId: string) {
  const supabase = adminDb();
  if (!supabase) return null;
  const { data } = await supabase
    .from("vision_item_blocks")
    .select(
      "*, image:media_library!vision_item_blocks_image_media_id_fkey(id, bucket, storage_path)",
    )
    .eq("id", blockId)
    .maybeSingle();
  return data;
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { migrateStaticContentToSupabase } from "@/lib/admin/migrate-static";
import { revalidatePublicPaths } from "@/lib/admin/revalidate";
import { slugify } from "@/lib/utils/slug";
import { isAllowedTeamCategorySlug } from "@/lib/team-categories";

function adminClient() {
  const env = getSupabaseEnv();
  if (!env.configured || !env.serviceRoleKey) {
    throw new Error("Supabase service role key required for admin writes.");
  }
  return createServiceRoleClient();
}

export type ActionResult = { ok: boolean; error?: string };

// ——— Migrate ———
export async function migrateStaticAction(): Promise<ActionResult> {
  try {
    const result = await migrateStaticContentToSupabase();
    revalidatePublicPaths();
    revalidatePath("/admin", "layout");
    return { ok: result.ok, error: result.ok ? undefined : result.message };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Migration failed" };
  }
}

// ——— Pages ———
export async function updatePageAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    const { error } = await supabase
      .from("pages")
      .update({
        title: String(formData.get("title") ?? ""),
        slug:
          String(formData.get("slug") ?? "") ||
          slugify(String(formData.get("title") ?? "")),
        status: String(formData.get("status") ?? "draft"),
        is_home: formData.get("is_home") === "on",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
    revalidatePublicPaths();
    revalidatePath(`/admin/pages/${id}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Update failed" };
  }
}

export async function updatePageSectionAction(
  sectionId: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    let content: Record<string, unknown> = {};
    const raw = String(formData.get("content") ?? "{}");
    try {
      content = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return { ok: false, error: "Invalid JSON in section content" };
    }

    const bodyHtml = String(formData.get("body_html") ?? "").trim();
    if (bodyHtml) {
      content = { ...content, body_html: bodyHtml, html: bodyHtml, body: bodyHtml };
    }

    const { error } = await supabase
      .from("page_sections")
      .update({
        title: String(formData.get("title") ?? "") || null,
        sort_order: Number(formData.get("sort_order") ?? 0),
        is_enabled: formData.get("is_enabled") === "on",
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sectionId);

    if (error) throw error;
    revalidatePublicPaths();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Update failed" };
  }
}

export async function togglePageSectionAction(
  sectionId: string,
  enabled: boolean,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    const { error } = await supabase
      .from("page_sections")
      .update({ is_enabled: enabled })
      .eq("id", sectionId);
    if (error) throw error;
    revalidatePublicPaths();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Toggle failed" };
  }
}

/** Form-friendly toggle — must be a top-level server action (no inline closures). */
export async function togglePageSectionFormAction(formData: FormData): Promise<void> {
  const sectionId = String(formData.get("section_id") ?? "");
  const enabled = formData.get("enabled") === "1";
  const result = await togglePageSectionAction(sectionId, enabled);
  if (!result.ok) {
    throw new Error(result.error ?? "Toggle failed");
  }
}

export async function toggleMenuItemFormAction(formData: FormData): Promise<void> {
  const menuId = String(formData.get("menu_id") ?? "");
  const itemId = String(formData.get("item_id") ?? "");
  const enabled = formData.get("enabled") === "1";
  await toggleMenuItemEnabledAction(menuId, itemId, enabled);
}

export async function deleteMenuItemFormAction(formData: FormData): Promise<void> {
  const menuId = String(formData.get("menu_id") ?? "");
  const itemId = String(formData.get("item_id") ?? "");
  await deleteMenuItemAction(menuId, itemId);
}

// ——— Events ———
export async function saveEventAction(
  id: string | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    const payload = {
      slug:
        String(formData.get("slug") ?? "") || slugify(String(formData.get("title") ?? "")),
      title: String(formData.get("title") ?? ""),
      subtitle: String(formData.get("subtitle") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
      location: String(formData.get("location") ?? "") || null,
      starts_at: String(formData.get("starts_at") ?? "") || null,
      ends_at: String(formData.get("ends_at") ?? "") || null,
      status: String(formData.get("status") ?? "draft"),
      registration_enabled: formData.get("registration_enabled") === "on",
      is_featured: formData.get("is_featured") === "on",
      banner_media_id:
        String(formData.get("banner_media_id") ?? formData.get("cover_media_id") ?? "") || null,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await supabase.from("events").update(payload).eq("id", id);
      if (error) throw error;
      revalidatePath(`/admin/events/${id}`);
    } else {
      const { data, error } = await supabase
        .from("events")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      revalidatePublicPaths();
      redirect(`/admin/events/${data.id}/`);
    }

    revalidatePublicPaths();
    revalidatePath("/admin/events");
    return { ok: true };
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function deleteEventAction(id: string): Promise<void> {
  const supabase = adminClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/events");
  redirect("/admin/events/");
}

export async function deleteEventFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing event id");
  const supabase = adminClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicPaths();
  revalidatePath("/admin/events");
}

// ——— Leadership ———
export async function saveTeamMemberAction(
  id: string | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    let bioParagraphs: string[] = [];
    const bioHtml = String(formData.get("bio_html") ?? "") || null;
    const rawBioParagraphs = String(formData.get("bio_paragraphs") ?? "").trim();
    if (rawBioParagraphs) {
      try {
        bioParagraphs = JSON.parse(rawBioParagraphs);
      } catch {
        return { ok: false, error: "Invalid bio paragraphs JSON (use array of strings)" };
      }
    } else if (bioHtml) {
      bioParagraphs = [bioHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()].filter(Boolean);
    }

    let socialLinks: Record<string, string> = {};
    const rawSocial = String(formData.get("social_links") ?? "").trim();
    if (rawSocial) {
      try {
        socialLinks = JSON.parse(rawSocial) as Record<string, string>;
      } catch {
        return { ok: false, error: "Invalid social links JSON" };
      }
    }

    const payload: Record<string, unknown> = {
      category_id: String(formData.get("category_id") ?? ""),
      slug:
        String(formData.get("slug") ?? "") ||
        slugify(String(formData.get("full_name") ?? "")),
      full_name: String(formData.get("full_name") ?? ""),
      designation: String(formData.get("designation") ?? ""),
      division: String(formData.get("division") ?? "") || null,
      region: String(formData.get("region") ?? "") || null,
      education: String(formData.get("education") ?? "") || null,
      linkedin_url:
        String(formData.get("linkedin_url") ?? socialLinks.linkedin ?? "") || null,
      bio_html: bioHtml,
      bio_paragraphs: bioParagraphs,
      image_media_id:
        String(formData.get("profile_media_id") ?? formData.get("image_media_id") ?? "") ||
        null,
      legacy_image_path:
        String(formData.get("profile_legacy_path") ?? formData.get("legacy_image_path") ?? "") ||
        null,
      sort_order: Number(formData.get("sort_order") ?? 0),
      status: String(formData.get("status") ?? "published"),
      is_enabled: formData.get("is_enabled") === "on",
      updated_at: new Date().toISOString(),
    };

    if (Object.keys(socialLinks).length > 0) {
      payload.social_links = socialLinks;
    }

    if (id) {
      let { error } = await supabase.from("team_members").update(payload).eq("id", id);
      if (error?.message?.includes("social_links")) {
        delete payload.social_links;
        ({ error } = await supabase.from("team_members").update(payload).eq("id", id));
      }
      if (error) throw error;
      revalidatePath(`/admin/leadership/${id}`);
    } else {
      let { data, error } = await supabase
        .from("team_members")
        .insert(payload)
        .select("id")
        .single();
      if (error?.message?.includes("social_links")) {
        delete payload.social_links;
        ({ data, error } = await supabase
          .from("team_members")
          .insert(payload)
          .select("id")
          .single());
      }
      if (error) throw error;
      revalidatePublicPaths();
      redirect(`/admin/leadership/${data!.id}/`);
    }

    revalidatePublicPaths();
    revalidatePath("/admin/leadership");
    return { ok: true };
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function deleteTeamMemberAction(id: string): Promise<void> {
  const supabase = adminClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicPaths();
  redirect("/admin/leadership/");
}

export async function deleteTeamMemberFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing member id");
  const supabase = adminClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicPaths();
  revalidatePath("/admin/leadership");
}

// ——— Team categories ———
export async function saveTeamCategoryAction(
  id: string | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    const payload = {
      slug:
        String(formData.get("slug") ?? "") || slugify(String(formData.get("name") ?? "")),
      name: String(formData.get("name") ?? ""),
      display_style: String(formData.get("display_style") ?? "grid"),
      sort_order: Number(formData.get("sort_order") ?? 0),
      is_enabled: formData.get("is_enabled") === "on",
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { data: existing, error: existingError } = await supabase
        .from("team_categories")
        .select("slug")
        .eq("id", id)
        .maybeSingle();
      if (existingError) throw existingError;
      if (!existing || !isAllowedTeamCategorySlug(existing.slug)) {
        throw new Error("Editing this category is not allowed.");
      }
      if (!isAllowedTeamCategorySlug(payload.slug)) {
        throw new Error("Category slug is not allowed.");
      }
      const { error } = await supabase.from("team_categories").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      if (!isAllowedTeamCategorySlug(payload.slug)) {
        throw new Error("Cannot add new category. Only fixed team categories are allowed.");
      }
      const { error } = await supabase.from("team_categories").insert(payload);
      if (error) throw error;
    }

    revalidatePublicPaths();
    revalidatePath("/admin/leadership");
    revalidatePath("/admin/leadership/categories");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function deleteTeamCategoryFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing category id");
  const supabase = adminClient();
  const { count } = await supabase
    .from("team_members")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);
  if ((count ?? 0) > 0) {
    throw new Error("Cannot delete a category that still has team members. Reassign or delete members first.");
  }
  const { error } = await supabase.from("team_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicPaths();
  revalidatePath("/admin/leadership/categories");
}

export async function deleteTeamCategoryByIdFormAction(
  id: string,
  _formData: FormData,
): Promise<void> {
  const fd = new FormData();
  fd.set("id", id);
  await deleteTeamCategoryFormAction(fd);
  redirect("/admin/leadership/categories/");
}

export async function moveTeamCategoryFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!id || !["up", "down"].includes(direction)) throw new Error("Invalid reorder request");

  const supabase = adminClient();
  const { data: categories, error } = await supabase
    .from("team_categories")
    .select("id, sort_order")
    .order("sort_order");
  if (error) throw error;
  if (!categories?.length) return;

  const idx = categories.findIndex((c) => c.id === id);
  if (idx < 0) return;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= categories.length) return;

  const a = categories[idx];
  const b = categories[swapIdx];
  await supabase.from("team_categories").update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from("team_categories").update({ sort_order: a.sort_order }).eq("id", b.id);

  revalidatePublicPaths();
  revalidatePath("/admin/leadership/categories");
}

export async function importTeamPortalAction(): Promise<ActionResult> {
  try {
    const { importTeamPortalContent } = await import("@/lib/admin/import-team-portal");
    await importTeamPortalContent();
    revalidatePublicPaths();
    revalidatePath("/admin/leadership");
    revalidatePath("/admin/leadership/categories");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Import failed" };
  }
}

// ——— Collaboration ———
export async function saveCollaborationPartnerAction(
  id: string | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    let detailContent: Record<string, unknown> = {};
    try {
      detailContent = JSON.parse(String(formData.get("detail_content") ?? "{}"));
    } catch {
      return { ok: false, error: "Invalid detail content JSON" };
    }

    const payload = {
      category_id: String(formData.get("category_id") ?? "") || null,
      slug:
        String(formData.get("slug") ?? "") || slugify(String(formData.get("name") ?? "")),
      name: String(formData.get("name") ?? ""),
      short_description: String(formData.get("short_description") ?? "") || null,
      description_html: String(formData.get("description_html") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      email: String(formData.get("email") ?? "") || null,
      website_url: String(formData.get("website_url") ?? "") || null,
      logo_media_id:
        String(formData.get("partner_media_id") ?? formData.get("logo_media_id") ?? "") ||
        null,
      legacy_image_path:
        String(formData.get("partner_legacy_path") ?? formData.get("legacy_image_path") ?? "") ||
        null,
      detail_content: detailContent,
      sort_order: Number(formData.get("sort_order") ?? 0),
      status: String(formData.get("status") ?? "published"),
      is_enabled: formData.get("is_enabled") === "on",
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await supabase
        .from("collaboration_partners")
        .update(payload)
        .eq("id", id);
      if (error) throw error;
      revalidatePath(`/admin/collaboration/${id}`);
    } else {
      const { data, error } = await supabase
        .from("collaboration_partners")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      revalidatePublicPaths();
      redirect(`/admin/collaboration/${data.id}/`);
    }

    revalidatePublicPaths();
    revalidatePath("/admin/collaboration");
    return { ok: true };
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function saveCollaborationLandingAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    let value: unknown;
    try {
      value = JSON.parse(String(formData.get("landing") ?? "{}"));
    } catch {
      return { ok: false, error: "Invalid landing JSON" };
    }

    const { error } = await supabase.from("site_settings").upsert(
      {
        key: "collaboration_landing",
        value,
        description: "Collaboration landing page content",
      },
      { onConflict: "key" },
    );
    if (error) throw error;
    revalidatePublicPaths();
    revalidatePath("/admin/collaboration/landing");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function deleteCollaborationPartnerAction(id: string): Promise<void> {
  const supabase = adminClient();
  const { error } = await supabase.from("collaboration_partners").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicPaths();
  redirect("/admin/collaboration/");
}

export async function deleteCollaborationPartnerFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing partner id");
  const supabase = adminClient();
  const { error } = await supabase.from("collaboration_partners").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicPaths();
  revalidatePath("/admin/collaboration");
}

// ——— Gallery ———
export async function saveGalleryAction(
  id: string | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    const payload = {
      slug:
        String(formData.get("slug") ?? "") || slugify(String(formData.get("title") ?? "")),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      category: String(formData.get("category") ?? "") || null,
      status: String(formData.get("status") ?? "published"),
      is_enabled: formData.get("is_enabled") === "on",
      sort_order: Number(formData.get("sort_order") ?? 0),
      cover_media_id:
        String(formData.get("cover_media_id") ?? formData.get("gallery_media_id") ?? "") || null,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await supabase.from("galleries").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from("galleries")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      redirect(`/admin/gallery/${data.id}/`);
    }

    revalidatePublicPaths();
    revalidatePath("/admin/gallery");
    return { ok: true };
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function deleteGalleryAction(id: string): Promise<void> {
  const supabase = adminClient();
  const { error } = await supabase.from("galleries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicPaths();
  redirect("/admin/gallery/");
}

export async function deleteGalleryFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing gallery id");
  const supabase = adminClient();
  const { error } = await supabase.from("galleries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicPaths();
  revalidatePath("/admin/gallery");
}

// ——— Settings ———
export async function updateSiteSettingAction(
  key: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    let value: unknown;
    try {
      value = JSON.parse(String(formData.get("value") ?? '""'));
    } catch {
      return { ok: false, error: "Value must be valid JSON" };
    }

    const { error } = await supabase
      .from("site_settings")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("key", key);
    if (error) throw error;
    revalidatePublicPaths();
    revalidatePath("/admin/settings");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Update failed" };
  }
}

export async function saveSocialLinkAction(
  id: string | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    const payload = {
      platform: String(formData.get("platform") ?? ""),
      url: String(formData.get("url") ?? ""),
      sort_order: Number(formData.get("sort_order") ?? 0),
      is_enabled: formData.get("is_enabled") === "on",
    };

    if (id) {
      const { error } = await supabase.from("social_links").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("social_links").insert(payload);
      if (error) throw error;
    }

    revalidatePublicPaths();
    revalidatePath("/admin/settings");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function deleteSocialLinkAction(id: string): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) throw error;
    revalidatePublicPaths();
    revalidatePath("/admin/settings");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Delete failed" };
  }
}

// ——— Navigation menus ———
export async function saveMenuItemAction(
  menuId: string,
  itemId: string | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    const pageId = String(formData.get("page_id") ?? "") || null;
    const payload = {
      menu_id: menuId,
      label: String(formData.get("label") ?? ""),
      url: String(formData.get("url") ?? "") || null,
      page_id: pageId,
      sort_order: Number(formData.get("sort_order") ?? 0),
      is_enabled: formData.get("is_enabled") === "on",
      open_in_new_tab: formData.get("open_in_new_tab") === "on",
      updated_at: new Date().toISOString(),
    };

    if (itemId) {
      const { error } = await supabase
        .from("navigation_menu_items")
        .update(payload)
        .eq("id", itemId);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("navigation_menu_items").insert(payload);
      if (error) throw error;
    }

    revalidatePublicPaths();
    revalidatePath(`/admin/menus/${menuId}`);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function deleteMenuItemAction(menuId: string, itemId: string): Promise<void> {
  const supabase = adminClient();
  const { error } = await supabase.from("navigation_menu_items").delete().eq("id", itemId);
  if (error) throw new Error(error.message);
  revalidatePublicPaths();
  redirect(`/admin/menus/${menuId}/`);
}

export async function toggleMenuItemEnabledAction(
  menuId: string,
  itemId: string,
  enabled: boolean,
): Promise<void> {
  const supabase = adminClient();
  const { error } = await supabase
    .from("navigation_menu_items")
    .update({ is_enabled: enabled })
    .eq("id", itemId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/menus/${menuId}`);
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { migrateStaticContentToSupabase, seedHomepageSectionContent } from "@/lib/admin/migrate-static";
import {
  buildCollaborationDetail,
  buildCollaborationLanding,
  buildSectionContent,
} from "@/lib/admin/form-builders";
import {
  revalidateCmsPageSlug,
  revalidatePublicPaths,
} from "@/lib/admin/revalidate";
import { slugify } from "@/lib/utils/slug";
import { isAllowedTeamCategorySlug } from "@/lib/team-categories";
import { normalizePublishStatus, resolvePublishFields } from "@/lib/cms/publish-state";
import { sanitizeLeadershipHtml } from "@/lib/cms/sanitizeHtml";

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

export async function seedHomepageSectionsAction(): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    const warnings = await seedHomepageSectionContent(supabase);
    revalidatePublicPaths();
    return {
      ok: true,
      error: warnings.length ? warnings.join("; ") : undefined,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Seed failed" };
  }
}

// ——— Pages ———
export async function createPageAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    const title = String(formData.get("title") ?? "").trim();
    const slug =
      String(formData.get("slug") ?? "").trim() || slugify(title);
    const status = normalizePublishStatus(formData.get("status"));
    const bodyHtml = String(formData.get("body_html") ?? "").trim();

    const { data: page, error } = await supabase
      .from("pages")
      .insert({
        title,
        slug,
        status,
        is_home: false,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .select("id")
      .single();

    if (error) throw error;

    if (bodyHtml) {
      await supabase.from("page_sections").insert({
        page_id: page.id,
        section_type: "custom_html",
        title: "Page content",
        sort_order: 10,
        is_enabled: true,
        content: { body_html: bodyHtml, html: bodyHtml, body: bodyHtml },
      });
    }

    revalidatePublicPaths();
    revalidateCmsPageSlug(slug);
    revalidatePath("/admin/pages");
    redirect(`/admin/pages/${page.id}/`);
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    return { ok: false, error: e instanceof Error ? e.message : "Create failed" };
  }
}

export async function addPageSectionFormAction(
  pageId: string,
  formData: FormData,
): Promise<void> {
  const supabase = adminClient();
  const sectionType = String(formData.get("section_type") ?? "custom_html");
  const { error } = await supabase.from("page_sections").insert({
    page_id: pageId,
    section_type: sectionType,
    title: String(formData.get("title") ?? "Page content"),
    sort_order: Number(formData.get("sort_order") ?? 10),
    is_enabled: true,
    content: {},
  });
  if (error) throw new Error(error.message);
  revalidatePublicPaths();
  revalidatePath(`/admin/pages/${pageId}`);
}

export async function updatePageAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    const status = normalizePublishStatus(formData.get("status"));
    const { data: existing } = await supabase
      .from("pages")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();

    const updatePayload: Record<string, unknown> = {
      title: String(formData.get("title") ?? ""),
      slug:
        String(formData.get("slug") ?? "") ||
        slugify(String(formData.get("title") ?? "")),
      status,
      is_home: formData.get("is_home") === "on",
      updated_at: new Date().toISOString(),
    };

    if (status === "published" && !existing?.published_at) {
      updatePayload.published_at = new Date().toISOString();
    } else if (status !== "published") {
      updatePayload.published_at = null;
    }

    const { error } = await supabase.from("pages").update(updatePayload).eq("id", id);
    if (error) throw error;
    revalidatePublicPaths();
    revalidatePath(`/admin/pages/${id}`);
    revalidateCmsPageSlug(String(formData.get("slug") ?? ""));
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
    const sectionType = String(formData.get("section_type") ?? "");
    if (!sectionType) {
      const { data: row } = await supabase
        .from("page_sections")
        .select("section_type")
        .eq("id", sectionId)
        .maybeSingle();
      if (!row?.section_type) {
        return { ok: false, error: "Section type missing" };
      }
      formData.set("section_type", row.section_type);
    }

    const { data: sectionMeta } = await supabase
      .from("page_sections")
      .select("pages(slug)")
      .eq("id", sectionId)
      .maybeSingle();

    const content = buildSectionContent(
      String(formData.get("section_type")),
      formData,
    );

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
    revalidateCmsPageSlug(
      (sectionMeta?.pages as { slug?: string } | null)?.slug,
    );
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
      status: normalizePublishStatus(formData.get("status")),
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
    const rawBioHtml = String(formData.get("bio_html") ?? "") || null;
    const bioHtml = rawBioHtml ? sanitizeLeadershipHtml(rawBioHtml) : null;
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

    const publish = resolvePublishFields(formData);

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
      status: publish.status,
      is_enabled: publish.is_enabled,
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
    const descriptionRaw = String(formData.get("description") ?? "").trim();
    const payload = {
      slug:
        String(formData.get("slug") ?? "") || slugify(String(formData.get("name") ?? "")),
      name: String(formData.get("name") ?? ""),
      display_style: String(formData.get("display_style") ?? "grid"),
      sort_order: Number(formData.get("sort_order") ?? 0),
      description: descriptionRaw || null,
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
    let existingDetail: Record<string, unknown> = {};
    if (id) {
      const { data: existing } = await supabase
        .from("collaboration_partners")
        .select("detail_content")
        .eq("id", id)
        .maybeSingle();
      existingDetail = (existing?.detail_content as Record<string, unknown>) ?? {};
    }

    const built = buildCollaborationDetail(formData);
    const detailContent: Record<string, unknown> = {
      ...existingDetail,
      ...built,
      title: String(formData.get("name") ?? ""),
      slug:
        String(formData.get("slug") ?? "") || slugify(String(formData.get("name") ?? "")),
    };

    const publish = resolvePublishFields(formData);

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
      status: publish.status,
      is_enabled: publish.is_enabled,
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
    const value = buildCollaborationLanding(formData);

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
    const publish = resolvePublishFields(formData);
    const payload = {
      slug:
        String(formData.get("slug") ?? "") || slugify(String(formData.get("title") ?? "")),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      category: String(formData.get("category") ?? "") || null,
      status: publish.status,
      is_enabled: publish.is_enabled,
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
    const raw = String(formData.get("value_text") ?? "").trim();

    let value: unknown = raw;
    if (key === "brochure_gate_enabled") {
      value = formData.get("value_text") === "on";
    } else if (raw === "true") {
      value = true;
    } else if (raw === "false") {
      value = false;
    } else if (raw !== "" && !Number.isNaN(Number(raw)) && /^-?\d+(\.\d+)?$/.test(raw)) {
      value = Number(raw);
    } else {
      value = raw.replace(/^"|"$/g, "");
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

// ——— Vision (4C) ———
export async function saveVisionPillarAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    const coverMediaId =
      String(formData.get("cover_media_id") ?? formData.get("pillar_media_id") ?? "") || null;

    const publish = resolvePublishFields(formData);

    const { error } = await supabase
      .from("vision_items")
      .update({
        title: String(formData.get("title") ?? ""),
        subtitle: String(formData.get("subtitle") ?? "") || null,
        short_description: String(formData.get("short_description") ?? "") || null,
        cover_media_id: coverMediaId,
        status: publish.status,
        is_enabled: publish.is_enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
    revalidatePublicPaths();
    revalidatePath("/4cvision", "layout");
    revalidatePath(`/admin/vision/${id}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Update failed" };
  }
}

export async function saveVisionBlockAction(
  pillarId: string,
  blockId: string | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = adminClient();
    const payload = {
      vision_item_id: pillarId,
      slug:
        String(formData.get("slug") ?? "") ||
        slugify(String(formData.get("title") ?? "story")),
      block_type: String(formData.get("block_type") ?? "story"),
      title: String(formData.get("title") ?? "") || null,
      excerpt: String(formData.get("excerpt") ?? "") || null,
      body: String(formData.get("body") ?? "") || null,
      author: String(formData.get("author") ?? "") || null,
      read_time: formData.get("read_time") ? Number(formData.get("read_time")) : null,
      image_media_id:
        String(formData.get("block_media_id") ?? formData.get("image_media_id") ?? "") || null,
      legacy_image_path:
        String(formData.get("block_legacy_path") ?? formData.get("legacy_image_path") ?? "") ||
        null,
      sort_order: Number(formData.get("sort_order") ?? 0),
      is_enabled: formData.get("is_enabled") === "on",
      updated_at: new Date().toISOString(),
    };

    if (blockId) {
      const { error } = await supabase.from("vision_item_blocks").update(payload).eq("id", blockId);
      if (error) throw error;
      revalidatePath(`/admin/vision/${pillarId}/blocks/${blockId}`);
    } else {
      const { data, error } = await supabase
        .from("vision_item_blocks")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      revalidatePublicPaths();
      revalidatePath("/4cvision", "layout");
      redirect(`/admin/vision/${pillarId}/blocks/${data!.id}/`);
    }

    revalidatePublicPaths();
    revalidatePath("/4cvision", "layout");
    revalidatePath(`/admin/vision/${pillarId}`);
    return { ok: true };
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function deleteVisionBlockAction(pillarId: string, blockId: string): Promise<void> {
  const supabase = adminClient();
  const { error } = await supabase.from("vision_item_blocks").delete().eq("id", blockId);
  if (error) throw new Error(error.message);
  revalidatePublicPaths();
  revalidatePath("/4cvision", "layout");
  redirect(`/admin/vision/${pillarId}/`);
}

export async function deleteVisionBlockForPillarFormAction(
  pillarId: string,
  formData: FormData,
): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing block id");
  const supabase = adminClient();
  const { error } = await supabase.from("vision_item_blocks").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicPaths();
  revalidatePath("/4cvision", "layout");
  revalidatePath(`/admin/vision/${pillarId}`);
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

import type { PageSection, PageWithSections, SeoMeta } from "@gnarly/types";
import { getSupabaseEnv } from "../env";
import { createPublicSupabaseClient } from "../supabase/server";

export async function getPageBySlug(slug: string): Promise<PageWithSections | null> {
  if (!getSupabaseEnv().configured) return null;

  try {
    const supabase = createPublicSupabaseClient();

    const { data: page, error } = await supabase
      .from("pages")
      .select("id, slug, title, status")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !page) return null;

    const { data: sections } = await supabase
      .from("page_sections")
      .select("*")
      .eq("page_id", page.id)
      .eq("is_enabled", true)
      .order("sort_order", { ascending: true });

    const { data: seo } = await supabase
      .from("seo_meta")
      .select("*")
      .eq("page_id", page.id)
      .maybeSingle();

    return {
      ...page,
      sections: (sections ?? []) as PageSection[],
      seo: seo as SeoMeta | null,
    };
  } catch {
    return null;
  }
}

export async function getHomePage(): Promise<PageWithSections | null> {
  return getPageBySlug("home");
}

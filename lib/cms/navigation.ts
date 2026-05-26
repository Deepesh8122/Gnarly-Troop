import { getSupabaseEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type NavMenuItem = {
  id: string;
  label: string;
  url?: string;
  target?: string;
};

export async function getNavigationByMenuSlug(
  menuSlug: string,
): Promise<NavMenuItem[]> {
  if (!getSupabaseEnv().configured) return [];

  const supabase = await createServerSupabaseClient();
  const { data: menu } = await supabase
    .from("navigation_menus")
    .select("id")
    .eq("slug", menuSlug)
    .maybeSingle();

  if (!menu) return [];

  const { data: items } = await supabase
    .from("navigation_menu_items")
    .select("id, label, url, open_in_new_tab, pages(slug, is_home)")
    .eq("menu_id", menu.id)
    .eq("is_enabled", true)
    .is("parent_id", null)
    .order("sort_order");

  return (items ?? []).map((item) => {
    const page = item.pages as { slug?: string; is_home?: boolean } | null;
    let url = item.url ?? undefined;
    if (!url && page) {
      url = page.is_home ? "/" : `/${page.slug}/`;
    }
    return {
      id: item.id,
      label: item.label,
      url,
      target: item.open_in_new_tab ? "_blank" : undefined,
    };
  });
}

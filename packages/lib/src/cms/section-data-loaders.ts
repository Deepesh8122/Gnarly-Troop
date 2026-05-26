import type { PageSection } from "@gnarly/types";
import { createServerSupabaseClient } from "../supabase/server";
import { getPublicMediaUrl } from "../media/resolve-url";

/**
 * Loads normalized data per section type for SectionRenderer props.
 * Each loader returns props matching EXISTING component interfaces.
 */
export async function loadSectionData(
  section: PageSection,
): Promise<Record<string, unknown>> {
  const supabase = await createServerSupabaseClient();
  const loader = section.settings?.dataLoader ?? section.section_type;

  switch (loader) {
    case "hero":
    case "hero_banner": {
      const config = (section.content ?? {}) as Record<string, string>;
      let videoSrc = config.videoSrc ?? "/hero.mp4";
      let founderImg = config.founderImg ?? "/images/sections/founder-img.png";
      let pmImg = config.pmImg ?? "/images/sections/pm-img.png";

      const { data } = await supabase
        .from("hero_banners")
        .select(
          "settings, hero_banner_slides(video:media_library!hero_banner_slides_video_media_id_fkey(bucket, storage_path))",
        )
        .eq("is_active", true)
        .order("sort_order")
        .limit(1)
        .maybeSingle();

      const settings = (data?.settings ?? {}) as Record<string, string>;
      if (settings.videoSrc) videoSrc = settings.videoSrc;
      if (settings.founderImg) founderImg = settings.founderImg;
      if (settings.pmImg) pmImg = settings.pmImg;

      const slide = data?.hero_banner_slides?.[0] as
        | { video?: { bucket: string; storage_path: string } | { bucket: string; storage_path: string }[] }
        | undefined;
      const videoMedia = slide?.video;
      if (videoMedia) {
        const row = Array.isArray(videoMedia) ? videoMedia[0] : videoMedia;
        if (row) videoSrc = getPublicMediaUrl(row);
      }

      return { videoSrc, founderImg, pmImg, config: section.content };
    }
    case "vision":
    case "vision_4c": {
      const { data } = await supabase
        .from("vision_items")
        .select(
          "slug, title, subtitle, short_description, theme_color, detail_page_slug, cover:media_library!vision_items_cover_media_id_fkey(bucket, storage_path)",
        )
        .eq("status", "published")
        .eq("is_enabled", true)
        .order("sort_order");
      return { items: data ?? [], config: section.content };
    }
    case "recommendations": {
      const { data } = await supabase
        .from("recommendations")
        .select("*, recommendation_cards(*)")
        .eq("is_enabled", true)
        .order("sort_order")
        .limit(1)
        .maybeSingle();
      return { recommendation: data, config: section.content };
    }
    case "partners": {
      const { data } = await supabase
        .from("partners")
        .select("*, logo:media_library(*)")
        .eq("is_enabled", true)
        .order("sort_order");
      return { partners: data ?? [], config: section.content };
    }
    case "gallery": {
      const { data } = await supabase
        .from("galleries")
        .select("*, gallery_items(*, media:media_library(*))")
        .eq("status", "published")
        .eq("is_enabled", true)
        .order("sort_order");
      return { galleries: data ?? [], config: section.content };
    }
  }

  return { config: section.content, settings: section.settings };
}

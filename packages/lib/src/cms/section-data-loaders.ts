import type { PageSection } from "@gnarly/types";
import { createServerSupabaseClient } from "../supabase/server";
import { getPublicMediaUrl } from "../media/resolve-url";
import {
  DEFAULT_MINISTER_CARDS,
  mergeSectionContent,
  type MinisterCard,
} from "./homepage-defaults";

function mediaPath(
  row: { bucket: string; storage_path: string } | null | undefined,
): string | undefined {
  if (!row) return undefined;
  if (row.bucket === "site" || row.storage_path.startsWith("/")) {
    return row.storage_path.startsWith("/") ? row.storage_path : `/${row.storage_path}`;
  }
  try {
    return getPublicMediaUrl(row);
  } catch {
    return undefined;
  }
}

function cardsFromRecommendationRow(
  rec: {
    recommendation_cards?: {
      id: string;
      name: string;
      title: string | null;
      testimonial: string | null;
      sort_order: number;
      is_enabled: boolean;
      image?: { bucket: string; storage_path: string } | { bucket: string; storage_path: string }[];
      certificate?: { bucket: string; storage_path: string } | { bucket: string; storage_path: string }[];
    }[];
    static_image?: { bucket: string; storage_path: string } | { bucket: string; storage_path: string }[];
  } | null,
): MinisterCard[] {
  if (!rec?.recommendation_cards?.length) return [];
  return rec.recommendation_cards
    .filter((c) => c.is_enabled)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c, i) => {
      const img = Array.isArray(c.image) ? c.image[0] : c.image;
      const cert = Array.isArray(c.certificate) ? c.certificate[0] : c.certificate;
      return {
        id: c.id ?? i + 1,
        name: c.name,
        title: c.title ?? "",
        image: mediaPath(img) ?? "/images/logos/logo-2.png",
        certificateUrl: mediaPath(cert),
      };
    });
}

/**
 * Loads normalized data per section type for SectionRenderer props.
 * Merges page_sections.content with DB rows and static defaults.
 */
export async function loadSectionData(
  section: PageSection,
): Promise<Record<string, unknown>> {
  const supabase = await createServerSupabaseClient();
  const config = mergeSectionContent(
    section.section_type,
    (section.content as Record<string, unknown>) ?? {},
  );
  const loader = section.settings?.dataLoader ?? section.section_type;

  switch (loader) {
    case "hero":
    case "hero_banner": {
      let videoSrc = (config.videoSrc as string) ?? "/hero.mp4";
      let founderImg = (config.founderImg as string) ?? "/images/sections/founder-img.png";
      let pmImg = (config.pmImg as string) ?? "/images/sections/pm-img.png";

      const { data } = await supabase
        .from("hero_banners")
        .select(
          `settings,
           hero_banner_slides(
             video:media_library!hero_banner_slides_video_media_id_fkey(bucket, storage_path)
           )`,
        )
        .eq("page_section_id", section.id)
        .eq("is_active", true)
        .order("sort_order")
        .limit(1)
        .maybeSingle();

      if (!data) {
        const { data: fallback } = await supabase
          .from("hero_banners")
          .select(
            `settings,
             hero_banner_slides(
               video:media_library!hero_banner_slides_video_media_id_fkey(bucket, storage_path)
             )`,
          )
          .eq("is_active", true)
          .order("sort_order")
          .limit(1)
          .maybeSingle();
        if (fallback) {
          const settings = (fallback.settings ?? {}) as Record<string, string>;
          if (settings.videoSrc) videoSrc = settings.videoSrc;
          if (settings.founderImg) founderImg = settings.founderImg;
          if (settings.pmImg) pmImg = settings.pmImg;
          const slide = fallback.hero_banner_slides?.[0] as
            | { video?: { bucket: string; storage_path: string } | { bucket: string; storage_path: string }[] }
            | undefined;
          const videoMedia = slide?.video;
          const row = Array.isArray(videoMedia) ? videoMedia[0] : videoMedia;
          if (row) videoSrc = getPublicMediaUrl(row);
        }
      } else {
        const settings = (data.settings ?? {}) as Record<string, string>;
        if (settings.videoSrc) videoSrc = settings.videoSrc;
        if (settings.founderImg) founderImg = settings.founderImg;
        if (settings.pmImg) pmImg = settings.pmImg;
        const slide = data.hero_banner_slides?.[0] as
          | { video?: { bucket: string; storage_path: string } | { bucket: string; storage_path: string }[] }
          | undefined;
        const videoMedia = slide?.video;
        const row = Array.isArray(videoMedia) ? videoMedia[0] : videoMedia;
        if (row) videoSrc = getPublicMediaUrl(row);
      }

      return { videoSrc, founderImg, pmImg, config };
    }

    case "welcome":
    case "welcome_sections": {
      const { data } = await supabase
        .from("welcome_sections")
        .select("*")
        .eq("page_section_id", section.id)
        .eq("is_enabled", true)
        .order("sort_order")
        .limit(1)
        .maybeSingle();

      if (data) {
        return {
          config: {
            ...config,
            titleHi: data.title ?? config.titleHi,
            titleEn: data.subtitle ?? config.titleEn,
            body_html: data.body_html ?? config.body_html,
          },
        };
      }
      return { config };
    }

    case "recommendations": {
      const { data } = await supabase
        .from("recommendations")
        .select(
          `*,
           recommendation_cards(
             id, name, title, testimonial, sort_order, is_enabled,
             image:media_library!recommendation_cards_image_media_id_fkey(bucket, storage_path),
             certificate:media_library!recommendation_cards_certificate_media_id_fkey(bucket, storage_path)
           ),
           static_image:media_library!recommendations_static_image_media_id_fkey(bucket, storage_path)`,
        )
        .eq("page_section_id", section.id)
        .eq("is_enabled", true)
        .order("sort_order")
        .limit(1)
        .maybeSingle();

      let cards = cardsFromRecommendationRow(data);
      if (!cards.length) {
        const { data: anyRec } = await supabase
          .from("recommendations")
          .select(
            `*,
             recommendation_cards(
               id, name, title, testimonial, sort_order, is_enabled,
               image:media_library!recommendation_cards_image_media_id_fkey(bucket, storage_path),
               certificate:media_library!recommendation_cards_certificate_media_id_fkey(bucket, storage_path)
             )`,
          )
          .eq("is_enabled", true)
          .order("sort_order")
          .limit(1)
          .maybeSingle();
        cards = cardsFromRecommendationRow(anyRec);
      }

      const contentCards = config.cards as MinisterCard[] | undefined;
      if (!cards.length && Array.isArray(contentCards) && contentCards.length) {
        cards = contentCards;
      }
      if (!cards.length) cards = DEFAULT_MINISTER_CARDS;

      const staticImage =
        mediaPath(
          Array.isArray(data?.static_image) ? data?.static_image[0] : data?.static_image,
        ) ?? (config.staticImage as string);

      return { cards, staticImage, config };
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
      return { items: data ?? [], config };
    }

    case "timeline": {
      const { data } = await supabase
        .from("timelines")
        .select("*, timeline_items(*)")
        .eq("page_section_id", section.id)
        .eq("is_enabled", true)
        .order("sort_order")
        .limit(1)
        .maybeSingle();

      return { timeline: data, config };
    }

    case "partners": {
      const { data } = await supabase
        .from("partners")
        .select("*, logo:media_library(*)")
        .eq("is_enabled", true)
        .order("sort_order");
      return { partners: data ?? [], config };
    }

    case "gallery": {
      const { data } = await supabase
        .from("galleries")
        .select("*, gallery_items(*, media:media_library(*))")
        .eq("status", "published")
        .eq("is_enabled", true)
        .order("sort_order");
      return { galleries: data ?? [], config };
    }
  }

  return { config };
}

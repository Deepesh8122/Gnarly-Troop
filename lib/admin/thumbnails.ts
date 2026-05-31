import type { SectionType } from "@gnarly/types";
import { getPublicMediaUrl } from "@gnarly/lib";

export type ThumbSource = {
  legacy_image_path?: string | null;
  imageSrc?: string | null;
  media?: { bucket: string; storage_path: string } | { bucket: string; storage_path: string }[] | null;
};

export const PAGE_THUMBNAILS: Record<string, string> = {
  home: "/images/sections/founder-img.png",
  leadership: "/images/sections/founder-img.png",
  collaboration: "/images/sections/pm-img.png",
};

export const SECTION_THUMBNAILS: Record<SectionType, string> = {
  hero_banner: "/images/sections/pm-img.png",
  welcome: "/images/sections/img-globe-girl-flag-2.png",
  recommendations: "/images/crousel/ministers/img-shri-gajendra-singh-shekhawat.png",
  timeline: "/images/sections/founder-img.png",
  vision_4c: "/images/visions/climate/feature-article.jpg",
  ministries: "/images/sections/pm-img.png",
  summit_intro: "/images/sections/founder-img.png",
  summit_schedules: "/images/sections/pm-img.png",
  sikkim_train: "/images/sections/founder-img.png",
  sikkim_package: "/images/sections/pm-img.png",
  sikkim_circles: "/images/sections/img-globe-girl-flag-2.png",
  partners: "/images/logos/logo-2.png",
  gallery: "/images/sections/founder-img.png",
  event_registration: "/images/sections/pm-img.png",
  campaigns: "/images/sections/img-globe-girl-flag-2.png",
  image_slider: "/images/sections/pm-img.png",
  custom_html: "/images/logos/logo-2.png",
};

export const VISION_PILLAR_THUMBNAILS: Record<string, string> = {
  climate: "/images/visions/climate/feature-article.jpg",
  community: "/images/visions/community/feature-article.jpg",
  culture: "/images/visions/culture/feature-article.jpg",
  cooperation: "/images/visions/cooperation/feature-article.jpg",
};

function normalizeMedia(
  media: ThumbSource["media"],
): { bucket: string; storage_path: string } | null {
  if (!media) return null;
  if (Array.isArray(media)) return media[0] ?? null;
  return media;
}

/** Resolve a public image URL for admin list thumbnails. */
export function resolveThumbUrl(source: ThumbSource, fallback: string): string {
  if (source.imageSrc) {
    return source.imageSrc.startsWith("/") || source.imageSrc.startsWith("http")
      ? source.imageSrc
      : `/${source.imageSrc}`;
  }
  if (source.legacy_image_path) {
    const p = source.legacy_image_path;
    return p.startsWith("/") ? p : `/${p}`;
  }
  const row = normalizeMedia(source.media);
  if (row?.bucket && row?.storage_path) {
    try {
      return getPublicMediaUrl(row);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export function pageThumb(slug: string, isHome?: boolean): string {
  if (isHome) return PAGE_THUMBNAILS.home;
  return PAGE_THUMBNAILS[slug] ?? "/images/logos/logo-2.png";
}

export function sectionThumb(sectionType: string): string {
  return (
    SECTION_THUMBNAILS[sectionType as SectionType] ?? "/images/logos/logo-2.png"
  );
}

/** Prefer image from section JSON content when available (e.g. hero founderImg). */
export function sectionThumbFromContent(
  sectionType: string,
  content: Record<string, unknown> | null | undefined,
): string {
  if (content) {
    const img =
      content.founderImg ?? content.posterImg ?? content.image ?? content.staticImage;
    if (typeof img === "string" && img.length > 0) {
      return img.startsWith("/") ? img : `/${img}`;
    }
  }
  return sectionThumb(sectionType);
}

export function visionPillarThumb(slug: string): string {
  return VISION_PILLAR_THUMBNAILS[slug] ?? "/images/logos/logo-2.png";
}

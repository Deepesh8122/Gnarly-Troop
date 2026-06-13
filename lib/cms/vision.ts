import { isPublicCmsConfigured } from "@/lib/cms/public-read";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { getPublicMediaUrl } from "@gnarly/lib";

export type VisionPillar = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  short_description: string | null;
  theme_color: string | null;
  detail_page_slug: string | null;
  coverUrl: string | null;
};

export type VisionStory = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  imageSrc: string;
  alt: string;
  author: string | null;
  readTime: number | null;
  blockType: string;
};

export type VisionPillarPageData = {
  pillar: VisionPillar;
  featured: VisionStory | null;
  largeCards: VisionStory[];
  smallCards: VisionStory[];
  heroVideo: string;
  pageTitle: string;
  pageSubtitle: string;
  leadParagraphs: string[];
};

function normalizeMediaJoin(
  image: { bucket: string; storage_path: string } | { bucket: string; storage_path: string }[] | null | undefined,
): { bucket: string; storage_path: string } | null {
  if (!image) return null;
  if (Array.isArray(image)) return image[0] ?? null;
  return image;
}

function imageFromRow(row: {
  legacy_image_path?: string | null;
  image?: { bucket: string; storage_path: string } | null;
}): string {
  if (row.legacy_image_path) {
    return row.legacy_image_path.startsWith("/")
      ? row.legacy_image_path
      : `/${row.legacy_image_path}`;
  }
  if (row.image) return getPublicMediaUrl(row.image);
  return "/images/logos/logo-2.png";
}

export async function getVisionPillars(): Promise<VisionPillar[]> {
  if (!isPublicCmsConfigured()) return [];
  const supabase = createPublicSupabaseClient();
  const { data } = await supabase
    .from("vision_items")
    .select(
      "id, slug, title, subtitle, short_description, theme_color, detail_page_slug, cover:media_library!vision_items_cover_media_id_fkey(bucket, storage_path)",
    )
    .eq("status", "published")
    .eq("is_enabled", true)
    .order("sort_order");

  return (data ?? []).map((v) => ({
    id: v.id,
    slug: v.slug,
    title: v.title,
    subtitle: v.subtitle,
    short_description: v.short_description,
    theme_color: v.theme_color,
    detail_page_slug: v.detail_page_slug,
    coverUrl: v.cover
      ? getPublicMediaUrl(Array.isArray(v.cover) ? v.cover[0] : v.cover)
      : null,
  }));
}

export async function getVisionPillarPage(slug: string): Promise<VisionPillarPageData | null> {
  if (!isPublicCmsConfigured()) return null;
  const supabase = createPublicSupabaseClient();

  const { data: pillar } = await supabase
    .from("vision_items")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_enabled", true)
    .maybeSingle();

  if (!pillar) return null;

  const { data: blocks } = await supabase
    .from("vision_item_blocks")
    .select(
      "id, slug, block_type, title, body, excerpt, legacy_image_path, author, read_time, sort_order, image:media_library!vision_item_blocks_image_media_id_fkey(bucket, storage_path)",
    )
    .eq("vision_item_id", pillar.id)
    .eq("is_enabled", true)
    .order("sort_order");

  const stories: VisionStory[] = (blocks ?? []).map((b) => ({
    id: b.id,
    slug: b.slug ?? b.id,
    title: b.title ?? "",
    excerpt: b.excerpt,
    body: b.body,
    imageSrc: imageFromRow({ legacy_image_path: b.legacy_image_path, image: normalizeMediaJoin(b.image) }),
    alt: b.title ?? "",
    author: b.author,
    readTime: b.read_time,
    blockType: b.block_type,
  }));

  const featured = stories.find((s) => s.blockType === "featured") ?? stories[0] ?? null;
  const rest = stories.filter((s) => s.id !== featured?.id);
  const largeCards = rest.filter((s) => s.blockType === "large");
  const smallCards = rest.filter((s) => s.blockType !== "large" && s.blockType !== "featured");

  return {
    pillar: {
      id: pillar.id,
      slug: pillar.slug,
      title: pillar.title,
      subtitle: pillar.subtitle,
      short_description: pillar.short_description,
      theme_color: pillar.theme_color,
      detail_page_slug: pillar.detail_page_slug,
      coverUrl: null,
    },
    featured,
    largeCards: largeCards.length ? largeCards : rest.slice(0, 2),
    smallCards: smallCards.length ? smallCards : rest.slice(2),
    heroVideo: "/hero.mp4",
    pageTitle: pillar.title.toUpperCase(),
    pageSubtitle: pillar.subtitle ?? "",
    leadParagraphs: pillar.short_description ? [pillar.short_description] : [],
  };
}

export async function getVisionStory(
  pillarSlug: string,
  storySlug: string,
): Promise<(VisionStory & { pillarTitle: string }) | null> {
  const page = await getVisionPillarPage(pillarSlug);
  if (!page) return null;
  const all = [
    ...(page.featured ? [page.featured] : []),
    ...page.largeCards,
    ...page.smallCards,
  ];
  const story = all.find((s) => s.slug === storySlug);
  if (!story) return null;
  return { ...story, pillarTitle: page.pillar.title };
}

export async function getVisionStorySlugs(pillarSlug: string) {
  const page = await getVisionPillarPage(pillarSlug);
  if (!page) return [];
  return [
    ...(page.featured ? [page.featured] : []),
    ...page.largeCards,
    ...page.smallCards,
  ].map((s) => s.slug);
}

/** For homepage 4C section */
export async function getVisionItemsForHome() {
  const pillars = await getVisionPillars();
  const iconMap: Record<string, string> = {
    climate: "/images/visions/climate/feature-article.jpg",
    community: "/images/visions/community/feature-article.jpg",
    culture: "/images/visions/culture/feature-article.jpg",
    cooperation: "/images/visions/cooperation/feature-article.jpg",
  };
  return pillars.map((p) => ({
    id: p.slug,
    title: p.title.toUpperCase(),
    description: p.short_description ?? "",
    href: p.detail_page_slug ?? `/4cvision/${p.slug}`,
    image: p.coverUrl ?? iconMap[p.slug] ?? "/images/logos/logo-2.png",
    primaryColor: p.theme_color ?? undefined,
  }));
}

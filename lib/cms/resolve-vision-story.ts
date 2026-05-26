import { getVisionStory, type VisionStory } from "@/lib/cms/vision";

const PILLAR_LABELS: Record<string, string> = {
  climate: "Climate",
  community: "Community",
  culture: "Culture",
  cooperation: "Cooperation",
};

type StaticStory = {
  slug: string;
  title: string;
  imageSrc: string;
  alt: string;
  caption?: string;
  body: string;
  author?: string;
  readTime?: string | number;
};

async function loadStaticStories(pillarSlug: string) {
  switch (pillarSlug) {
    case "climate":
      return import("@/app/data/climateStories");
    case "community":
      return import("@/app/data/communityStories");
    case "culture":
      return import("@/app/data/cultureStories");
    case "cooperation":
      return import("@/app/data/cooperationStories");
    default:
      return null;
  }
}

function parseReadTime(value: string | number | undefined): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : parseInt(String(value), 10);
  return Number.isFinite(n) ? n : null;
}

function fromStatic(
  pillarSlug: string,
  s: StaticStory,
): VisionStory & { pillarTitle: string } {
  return {
    id: s.slug,
    slug: s.slug,
    title: s.title,
    excerpt: s.caption ?? null,
    body: s.body,
    imageSrc: s.imageSrc,
    alt: s.alt,
    author: s.author ?? null,
    readTime: parseReadTime(s.readTime),
    blockType: "story",
    pillarTitle: PILLAR_LABELS[pillarSlug] ?? pillarSlug,
  };
}

export async function resolveVisionStory(
  pillarSlug: string,
  storySlug: string,
): Promise<(VisionStory & { pillarTitle: string }) | null> {
  const cms = await getVisionStory(pillarSlug, storySlug);
  if (cms) return cms;

  const mod = await loadStaticStories(pillarSlug);
  if (!mod) return null;

  const all: StaticStory[] = [
    mod.featuredStory,
    ...(mod.largeCards ?? []),
    ...(mod.smallCards ?? []),
  ];
  const found = all.find((s) => s.slug === storySlug);
  if (!found) return null;
  return fromStatic(pillarSlug, found);
}

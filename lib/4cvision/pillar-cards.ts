import type { VisionPillarPageData } from "@/lib/cms/vision";

type Featured = {
  slug: string;
  title: string;
  imageSrc: string;
  alt: string;
  caption: string;
};

type LargeCard = {
  id: number;
  kicker: string;
  title: string;
  imageSrc: string;
  alt: string;
  caption: string;
  slug: string;
  body: string;
  author: string;
  readTime: string;
};

type SmallCard = {
  id: number;
  title: string;
  imageSrc: string;
  alt: string;
  caption: string;
  slug: string;
  body: string;
  author: string;
  readTime: string;
};

export function mapVisionPillarCards(
  cmsData: VisionPillarPageData | null | undefined,
  staticFeatured: Featured,
  staticLarge: LargeCard[],
  staticSmall: SmallCard[],
  defaults: { pageTitle: string; pageSubTitle: string; leads: string[] },
) {
  const featured = cmsData?.featured
    ? {
        slug: cmsData.featured.slug,
        title: cmsData.featured.title,
        imageSrc: cmsData.featured.imageSrc,
        alt: cmsData.featured.alt,
        caption: cmsData.featured.excerpt ?? "",
      }
    : staticFeatured;

  const large = cmsData?.largeCards?.length
    ? cmsData.largeCards.map((c, i) => ({
        id: i,
        kicker: c.blockType.toUpperCase(),
        title: c.title,
        imageSrc: c.imageSrc,
        alt: c.alt,
        caption: c.excerpt ?? "",
        slug: c.slug,
        body: c.body ?? "",
        author: c.author ?? "",
        readTime: String(c.readTime ?? ""),
      }))
    : staticLarge;

  const small = cmsData?.smallCards?.length
    ? cmsData.smallCards.map((c, i) => ({
        id: i + 100,
        title: c.title,
        imageSrc: c.imageSrc,
        alt: c.alt,
        caption: c.excerpt ?? "",
        slug: c.slug,
        body: c.body ?? "",
        author: c.author ?? "",
        readTime: String(c.readTime ?? ""),
      }))
    : staticSmall;

  return {
    featured,
    large,
    small,
    pageTitle: cmsData?.pageTitle ?? defaults.pageTitle,
    pageSubTitle: cmsData?.pageSubtitle ?? defaults.pageSubTitle,
    leads: cmsData?.leadParagraphs?.length ? cmsData.leadParagraphs : defaults.leads,
  };
}

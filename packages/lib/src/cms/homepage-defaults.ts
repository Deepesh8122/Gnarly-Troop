import type { SectionType } from "@gnarly/types";

export type MinisterCard = {
  id: string | number;
  name: string;
  title: string;
  image: string;
  certificateUrl?: string;
};

export const DEFAULT_MINISTER_CARDS: MinisterCard[] = [
  {
    id: 1,
    name: "Shri Gajendra Singh Shekhawat",
    title: "Hon'ble Union Minister of Culture & Tourism | Govt of India",
    image: "/images/crousel/ministers/img-shri-gajendra-singh-shekhawat.png",
    certificateUrl: "/images/crousel/letters/img-letter-gajendra-singh-shekhawat.jpg",
  },
  {
    id: 2,
    name: "Shri Bhajan Lal Sharma",
    title: "Hon'ble Chief Minister | Rajasthan",
    image: "/images/crousel/ministers/img-shri-bhajan-lal-sharma.png",
    certificateUrl: "/images/crousel/letters/img-letter-bhajan-lal-sharma.png",
  },
  {
    id: 3,
    name: "Shri Jhabar Singh Kharra",
    title: "Hon'ble Minister of State for Urban Housing | Government of India",
    image: "/images/crousel/ministers/img-shri-jhabar-singh-kharra.png",
    certificateUrl: "/images/crousel/letters/img-letter-jhabbar-kharra.png",
  },
  {
    id: 4,
    name: "Swami Balmukundacharya Ji Maharaj",
    title: "Hon'ble Member of the Legislative Assembly Rajasthan",
    image: "/images/crousel/ministers/img-swami-balmukundacharya-ji-maharaj.png",
    certificateUrl: "/images/crousel/letters/img-letter-balmukundacharya.png",
  },
];

export const HOMEPAGE_SECTION_DEFAULTS: Partial<Record<SectionType, Record<string, unknown>>> = {
  hero_banner: {
    videoSrc: "/hero.mp4",
    founderImg: "/images/sections/founder-img.png",
    pmImg: "/images/sections/pm-img.png",
  },
  welcome: {
    titleHi: "स्वागतम् मम राष्ट्रे भारतवर्षे !",
    titleEn: "Welcome to My Country, India",
    subtitle: "Explore Bharat with Gnarly Troop",
    estd: "EST. 2013",
    backgroundImage: "/images/sections/bg-about-country-maps.png",
  },
  recommendations: {
    staticImage: "/images/sections/img-globe-girl-flag-2.png",
    cards: DEFAULT_MINISTER_CARDS,
  },
};

export function getSectionDefaultContent(sectionType: string): Record<string, unknown> {
  return { ...(HOMEPAGE_SECTION_DEFAULTS[sectionType as SectionType] ?? {}) };
}

export function mergeSectionContent(
  sectionType: string,
  content: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  const merged = { ...getSectionDefaultContent(sectionType), ...(content ?? {}) };

  if (sectionType === "recommendations") {
    const cards = (content ?? {}).cards;
    merged.cards =
      Array.isArray(cards) && cards.length > 0 ? cards : DEFAULT_MINISTER_CARDS;
    merged.staticImage =
      (merged.staticImage as string) || "/images/sections/img-globe-girl-flag-2.png";
  }

  return merged;
}

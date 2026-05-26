import leadershipData, {
  LeadershipDataItem,
  LeadershipSection,
} from "../data/leadershipData";

export type LeadershipArticle = {
  title: string;
  excerpt: string;
  href: string;
  type?: "Article" | "Video" | "Story";
};

export type LeadershipItem = {
  slug: string;
  src: string;
  filename: string;
  title: string;
  alt: string;
  name: string;
  division?: string;
  section: LeadershipSection;
  region?: string;
  short?: string;
  bio?: string;
  bioParagraphs?: string[];
  education?: string;
  linkedin?: string;
  articles?: LeadershipArticle[];
};

function imageSrc(image: string): string {
  if (image.startsWith("/")) return image;
  return `/images/leadership/${encodeURIComponent(image)}`;
}

function mapDataItem(d: LeadershipDataItem): LeadershipItem {
  return {
    slug: d.slug,
    src: imageSrc(d.image),
    filename: d.image,
    title: d.title,
    alt: d.name,
    name: d.name,
    division: d.division,
    section: d.section,
    region: d.region,
    short: d.short,
    bio: d.bio,
    bioParagraphs: d.bioParagraphs,
    education: d.education,
    linkedin: d.linkedin,
    articles: d.articles,
  };
}

export async function getLeadershipItems(): Promise<LeadershipItem[]> {
  return leadershipData.map(mapDataItem);
}

export async function getLeadershipItem(slug: string): Promise<LeadershipItem | null> {
  const found = leadershipData.find((d) => d.slug === slug);
  return found ? mapDataItem(found) : null;
}

export async function getLeadershipBySection(
  section: LeadershipSection,
): Promise<LeadershipItem[]> {
  return leadershipData.filter((d) => d.section === section).map(mapDataItem);
}

export async function getDivisions(): Promise<string[]> {
  const divs = new Set<string>();
  leadershipData.forEach((d) => {
    if (d.division) divs.add(d.division);
  });
  return Array.from(divs);
}

export async function getRegions(): Promise<string[]> {
  const regions = new Set<string>();
  leadershipData.forEach((d) => {
    if (d.region) regions.add(d.region);
  });
  return Array.from(regions).sort();
}

export function getLeadershipStaticParams() {
  return leadershipData.map((d) => ({ slug: d.slug }));
}

import type { MinisterCard } from "@gnarly/lib";
import type { CollaborationDetail, CollaborationNarrative } from "@/src/data/collaborationData";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function paragraphs(field: string): string[] {
  return field
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function buildSectionContent(
  sectionType: string,
  formData: FormData,
): Record<string, unknown> {
  const bodyHtml = str(formData, "body_html");
  const base: Record<string, unknown> = {};
  if (bodyHtml) {
    base.body_html = bodyHtml;
    base.html = bodyHtml;
    base.body = bodyHtml;
  }

  switch (sectionType) {
    case "hero_banner":
      return {
        ...base,
        videoSrc: str(formData, "videoSrc") || "/hero.mp4",
        founderImg: str(formData, "founderImg") || "/images/sections/founder-img.png",
        pmImg: str(formData, "pmImg") || "/images/sections/pm-img.png",
      };
    case "welcome":
      return {
        ...base,
        titleHi: str(formData, "titleHi"),
        titleEn: str(formData, "titleEn"),
        subtitle: str(formData, "subtitle"),
        estd: str(formData, "estd"),
        backgroundImage: str(formData, "backgroundImage"),
      };
    case "recommendations": {
      let cards: MinisterCard[] = [];
      const raw = str(formData, "cards_json");
      if (raw) {
        try {
          cards = JSON.parse(raw) as MinisterCard[];
        } catch {
          throw new Error("Invalid recommendation cards data");
        }
      }
      return {
        ...base,
        staticImage: str(formData, "staticImage") || "/images/sections/img-globe-girl-flag-2.png",
        cards: cards.filter((c) => c.name?.trim()),
      };
    }
    default:
      return base;
  }
}

export function buildCollaborationLanding(formData: FormData) {
  const narratives: CollaborationNarrative[] = [0, 1, 2].map((i) => ({
    heading: str(formData, `narrative_${i}_heading`),
    paragraphs: paragraphs(str(formData, `narrative_${i}_paragraphs`)),
    imageSrc: str(formData, `narrative_${i}_imageSrc`),
    imageOnRight: bool(formData, `narrative_${i}_imageOnRight`),
  }));

  return {
    heroVideo: str(formData, "heroVideo") || "/hero.mp4",
    heroPoster: str(formData, "heroPoster"),
    heroLabel: str(formData, "heroLabel"),
    heroTitle: str(formData, "heroTitle"),
    heroBody: str(formData, "heroBody"),
    heroCtaLabel: str(formData, "heroCtaLabel"),
    heroCtaHref: str(formData, "heroCtaHref"),
    missionQuote: str(formData, "missionQuote"),
    missionAttr: str(formData, "missionAttr"),
    narratives,
    highlight: {
      title: str(formData, "highlight_title"),
      body: str(formData, "highlight_body"),
    },
    achievement: {
      title: str(formData, "achievement_title"),
      body: str(formData, "achievement_body"),
      ctaLabel: str(formData, "achievement_ctaLabel"),
      ctaHref: str(formData, "achievement_ctaHref"),
    },
    tracking: {
      title: str(formData, "tracking_title"),
      body: str(formData, "tracking_body"),
      stats: [0, 1, 2].map((i) => ({
        value: str(formData, `stat_${i}_value`),
        label: str(formData, `stat_${i}_label`),
      })),
    },
    roadTo2045: {
      title: str(formData, "road_title"),
      body: str(formData, "road_body"),
      imageSrc: str(formData, "road_imageSrc"),
      ctaLabel: str(formData, "road_ctaLabel"),
      ctaHref: str(formData, "road_ctaHref"),
    },
  };
}

export function buildCollaborationDetail(formData: FormData): Partial<CollaborationDetail> {
  return {
    subtitle: str(formData, "detail_subtitle"),
    lead: paragraphs(str(formData, "detail_lead")),
    heroVideo: str(formData, "detail_heroVideo") || undefined,
    heroImage: str(formData, "detail_heroImage") || undefined,
    stat: {
      value: str(formData, "detail_stat_value"),
      label: str(formData, "detail_stat_label"),
      source: str(formData, "detail_stat_source") || undefined,
    },
    whyTitle: str(formData, "detail_whyTitle") || undefined,
    whyBullets: str(formData, "detail_whyBullets")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
    pullQuote: str(formData, "detail_pullQuote"),
    howWeWork: [0, 1, 2].map((i) => ({
      title: str(formData, `detail_pillar_${i}_title`),
      body: str(formData, `detail_pillar_${i}_body`),
    })).filter((p) => p.title || p.body),
    body: str(formData, "detail_body"),
  };
}

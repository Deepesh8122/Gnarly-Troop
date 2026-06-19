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
    ctaLabel: str(formData, `narrative_${i}_ctaLabel`),
    ctaHref: str(formData, `narrative_${i}_ctaHref`),
    enabled: bool(formData, `narrative_${i}_enabled`),
  }));

  return {
    sections: {
      hero: bool(formData, "section_hero_enabled"),
      mission: bool(formData, "section_mission_enabled"),
      narratives: bool(formData, "section_narratives_enabled"),
      highlight: bool(formData, "section_highlight_enabled"),
      achievement: bool(formData, "section_achievement_enabled"),
      tracking: bool(formData, "section_tracking_enabled"),
      roadTo2045: bool(formData, "section_road_enabled"),
      progressInAction: bool(formData, "section_progress_enabled"),
    },
    heroVideo: str(formData, "heroVideo") || "/hero.mp4",
    heroPoster: str(formData, "heroPoster"),
    heroLabel: str(formData, "heroLabel"),
    heroTitle: str(formData, "heroTitle"),
    heroBody: str(formData, "heroBody"),
    heroCtaLabel: str(formData, "heroCtaLabel"),
    heroCtaHref: str(formData, "heroCtaHref"),
    missionQuote: str(formData, "missionQuote"),
    missionAttr: str(formData, "missionAttr"),
    missionLinkLabel: str(formData, "missionLinkLabel"),
    missionLinkHref: str(formData, "missionLinkHref"),
    narratives,
    highlight: {
      title: str(formData, "highlight_title"),
      body: str(formData, "highlight_body"),
      subline: str(formData, "highlight_subline"),
      videoSrc: str(formData, "highlight_videoSrc"),
      posterSrc: str(formData, "highlight_posterSrc"),
    },
    achievement: {
      eyebrow: str(formData, "achievement_eyebrow"),
      title: str(formData, "achievement_title"),
      body: str(formData, "achievement_body"),
      ctaLabel: str(formData, "achievement_ctaLabel"),
      ctaHref: str(formData, "achievement_ctaHref"),
      visualImageSrc: str(formData, "achievement_visualImageSrc"),
      visualVideoSrc: str(formData, "achievement_visualVideoSrc"),
    },
    tracking: {
      title: str(formData, "tracking_title"),
      body: str(formData, "tracking_body"),
      pillars: [0, 1, 2].map((i) => {
        const icon = str(formData, `pillar_${i}_icon`);
        return {
          icon: icon === "book" || icon === "chart" ? icon : "globe",
          title: str(formData, `pillar_${i}_title`),
          description: str(formData, `pillar_${i}_description`),
          linkLabel: str(formData, `pillar_${i}_linkLabel`),
          linkHref: str(formData, `pillar_${i}_linkHref`),
          enabled: bool(formData, `pillar_${i}_enabled`),
        };
      }),
    },
    roadTo2045: {
      title: str(formData, "road_title"),
      body: str(formData, "road_body"),
      imageSrc: str(formData, "road_imageSrc"),
      ctaLabel: str(formData, "road_ctaLabel"),
      ctaHref: str(formData, "road_ctaHref"),
    },
    progressInAction: {
      title: str(formData, "progressInAction_title"),
      readMoreLabel: str(formData, "progressInAction_readMoreLabel"),
      readMoreHref: str(formData, "progressInAction_readMoreHref"),
      emptyMessage: str(formData, "progressInAction_emptyMessage"),
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

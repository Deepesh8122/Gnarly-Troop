import type { CollaborationLandingContent, CollaborationTrackingPillar } from "@/src/data/collaborationData";
import { collaborationLanding as seedTemplate } from "@/src/data/collaborationData";

function sectionFlag(value: boolean | undefined, fallback: boolean): boolean {
  return value === undefined ? fallback : Boolean(value);
}

/** Deep-merge CMS JSON into a complete landing shape. */
export function normalizeCollaborationLanding(
  raw: Partial<CollaborationLandingContent> | null | undefined,
): CollaborationLandingContent {
  const source = raw && typeof raw === "object" ? raw : {};
  const seedSections = seedTemplate.sections;

  const narratives = (source.narratives ?? seedTemplate.narratives).map((n, i) => {
    const fallback = seedTemplate.narratives[i];
    return {
      heading: n?.heading ?? fallback?.heading ?? "",
      paragraphs: Array.isArray(n?.paragraphs) ? n.paragraphs : fallback?.paragraphs ?? [],
      imageSrc: n?.imageSrc ?? fallback?.imageSrc ?? "",
      imageOnRight: Boolean(n?.imageOnRight),
      ctaLabel: n?.ctaLabel ?? fallback?.ctaLabel ?? "",
      ctaHref: n?.ctaHref ?? fallback?.ctaHref ?? "",
      enabled: sectionFlag(n?.enabled, fallback?.enabled ?? true),
    };
  });

  const pillars = (source.tracking?.pillars ?? seedTemplate.tracking.pillars).map((p, i) => {
    const fallback = seedTemplate.tracking.pillars[i];
    const rawIcon = p?.icon ?? fallback?.icon ?? "globe";
    const icon: CollaborationTrackingPillar["icon"] =
      rawIcon === "book" || rawIcon === "chart" ? rawIcon : "globe";
    return {
      icon,
      title: p?.title ?? fallback?.title ?? "",
      description: p?.description ?? fallback?.description ?? "",
      linkLabel: p?.linkLabel ?? fallback?.linkLabel ?? "",
      linkHref: p?.linkHref ?? fallback?.linkHref ?? "",
      enabled: sectionFlag(p?.enabled, fallback?.enabled ?? true),
    };
  });

  return {
    sections: {
      hero: sectionFlag(source.sections?.hero, seedSections.hero),
      mission: sectionFlag(source.sections?.mission, seedSections.mission),
      narratives: sectionFlag(source.sections?.narratives, seedSections.narratives),
      highlight: sectionFlag(source.sections?.highlight, seedSections.highlight),
      achievement: sectionFlag(source.sections?.achievement, seedSections.achievement),
      tracking: sectionFlag(source.sections?.tracking, seedSections.tracking),
      roadTo2045: sectionFlag(source.sections?.roadTo2045, seedSections.roadTo2045),
      progressInAction: sectionFlag(source.sections?.progressInAction, seedSections.progressInAction),
    },
    heroVideo: source.heroVideo ?? seedTemplate.heroVideo,
    heroPoster: source.heroPoster ?? seedTemplate.heroPoster,
    heroLabel: source.heroLabel ?? seedTemplate.heroLabel,
    heroTitle: source.heroTitle ?? seedTemplate.heroTitle,
    heroBody: source.heroBody ?? seedTemplate.heroBody,
    heroCtaLabel: source.heroCtaLabel ?? seedTemplate.heroCtaLabel,
    heroCtaHref: source.heroCtaHref ?? seedTemplate.heroCtaHref,
    missionQuote: source.missionQuote ?? seedTemplate.missionQuote,
    missionAttr: source.missionAttr ?? seedTemplate.missionAttr,
    missionLinkLabel: source.missionLinkLabel ?? seedTemplate.missionLinkLabel,
    missionLinkHref: source.missionLinkHref ?? seedTemplate.missionLinkHref,
    narratives,
    highlight: {
      title: source.highlight?.title ?? seedTemplate.highlight.title,
      body: source.highlight?.body ?? seedTemplate.highlight.body,
      subline: source.highlight?.subline ?? seedTemplate.highlight.subline,
      videoSrc: source.highlight?.videoSrc ?? seedTemplate.highlight.videoSrc,
      posterSrc: source.highlight?.posterSrc ?? seedTemplate.highlight.posterSrc,
    },
    achievement: {
      eyebrow: source.achievement?.eyebrow ?? seedTemplate.achievement.eyebrow,
      title: source.achievement?.title ?? seedTemplate.achievement.title,
      body: source.achievement?.body ?? seedTemplate.achievement.body,
      ctaLabel: source.achievement?.ctaLabel ?? seedTemplate.achievement.ctaLabel,
      ctaHref: source.achievement?.ctaHref ?? seedTemplate.achievement.ctaHref,
      visualImageSrc: source.achievement?.visualImageSrc ?? seedTemplate.achievement.visualImageSrc,
      visualVideoSrc: source.achievement?.visualVideoSrc ?? seedTemplate.achievement.visualVideoSrc,
    },
    tracking: {
      title: source.tracking?.title ?? seedTemplate.tracking.title,
      body: source.tracking?.body ?? seedTemplate.tracking.body,
      pillars,
    },
    roadTo2045: {
      title: source.roadTo2045?.title ?? seedTemplate.roadTo2045.title,
      body: source.roadTo2045?.body ?? seedTemplate.roadTo2045.body,
      imageSrc: source.roadTo2045?.imageSrc ?? seedTemplate.roadTo2045.imageSrc,
      ctaLabel: source.roadTo2045?.ctaLabel ?? seedTemplate.roadTo2045.ctaLabel,
      ctaHref: source.roadTo2045?.ctaHref ?? seedTemplate.roadTo2045.ctaHref,
    },
    progressInAction: {
      title: source.progressInAction?.title ?? seedTemplate.progressInAction.title,
      readMoreLabel: source.progressInAction?.readMoreLabel ?? seedTemplate.progressInAction.readMoreLabel,
      readMoreHref: source.progressInAction?.readMoreHref ?? seedTemplate.progressInAction.readMoreHref,
      emptyMessage: source.progressInAction?.emptyMessage ?? seedTemplate.progressInAction.emptyMessage,
    },
  };
}

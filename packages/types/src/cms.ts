import type { SectionType } from "./database";

/** Maps DB section_type → existing React section component key (no UI redesign). */
export const SECTION_COMPONENT_MAP: Record<SectionType, string> = {
  hero_banner: "SectionHeroVideo",
  welcome: "SectionAbout",
  timeline: "SectionTimeline",
  vision_4c: "SectionVisions",
  recommendations: "SectionMinisterLetter",
  image_slider: "SectionImageSlider",
  event_registration: "SectionEventRegistration",
  campaigns: "SectionCampaigns",
  partners: "SectionPartners",
  gallery: "SectionGallery",
  ministries: "SectionMinistries",
  summit_intro: "SummitSection1",
  summit_schedules: "SectionSchedules",
  sikkim_train: "SectionSikkimTrain",
  sikkim_package: "SectionSikkimPackage",
  sikkim_circles: "SectionSikkimCircles",
  custom_html: "SectionCustomHtml",
};

export interface SectionRegistryEntry {
  type: SectionType;
  componentKey: string;
  label: string;
  description: string;
  /** Data loader key used by service layer */
  dataLoader: string;
  supportsChildren: boolean;
}

export const SECTION_REGISTRY: SectionRegistryEntry[] = [
  { type: "hero_banner", componentKey: "SectionHeroVideo", label: "Hero Banner", description: "Video/slides, CTAs, upcoming events", dataLoader: "hero", supportsChildren: true },
  { type: "welcome", componentKey: "SectionAbout", label: "Welcome", description: "Welcome copy, patron, member cards", dataLoader: "welcome", supportsChildren: true },
  { type: "recommendations", componentKey: "SectionMinisterLetter", label: "Recommendations", description: "Minister/testimonial cards", dataLoader: "recommendations", supportsChildren: true },
  { type: "timeline", componentKey: "SectionTimeline", label: "Timeline", description: "Past, present, future milestones", dataLoader: "timeline", supportsChildren: true },
  { type: "vision_4c", componentKey: "SectionVisions", label: "4C Vision", description: "Dynamic vision pillars", dataLoader: "vision", supportsChildren: true },
  { type: "ministries", componentKey: "SectionMinistries", label: "Ministries", description: "Ministry cards", dataLoader: "ministries", supportsChildren: false },
  { type: "summit_intro", componentKey: "SummitSection1", label: "Summit Intro", description: "Summit hero content", dataLoader: "summit_intro", supportsChildren: false },
  { type: "summit_schedules", componentKey: "SectionSchedules", label: "Summit Schedules", description: "Event schedule tables", dataLoader: "summit_schedules", supportsChildren: false },
  { type: "sikkim_train", componentKey: "SectionSikkimTrain", label: "Sikkim Train", description: "Tour train section", dataLoader: "sikkim_train", supportsChildren: false },
  { type: "sikkim_package", componentKey: "SectionSikkimPackage", label: "Sikkim Package", description: "Tour package section", dataLoader: "sikkim_package", supportsChildren: false },
  { type: "sikkim_circles", componentKey: "SectionSikkimCircles", label: "Sikkim Circles", description: "Icon circles section", dataLoader: "sikkim_circles", supportsChildren: false },
  { type: "partners", componentKey: "SectionPartners", label: "Partners", description: "Partner/sponsor logos", dataLoader: "partners", supportsChildren: true },
  { type: "gallery", componentKey: "SectionGallery", label: "Gallery", description: "Event galleries", dataLoader: "gallery", supportsChildren: true },
  { type: "event_registration", componentKey: "SectionEventRegistration", label: "Event Registration", description: "Registration + brochure gate", dataLoader: "events", supportsChildren: true },
  { type: "campaigns", componentKey: "SectionCampaigns", label: "Campaigns / Tours", description: "Upcoming tours", dataLoader: "campaigns", supportsChildren: true },
  { type: "image_slider", componentKey: "SectionImageSlider", label: "Image Slider", description: "Promo slides with CTA", dataLoader: "image_slider", supportsChildren: true },
  { type: "custom_html", componentKey: "SectionCustomHtml", label: "Custom HTML", description: "Admin-defined HTML block", dataLoader: "custom", supportsChildren: false },
];

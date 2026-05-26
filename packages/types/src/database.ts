/** Supabase-aligned domain types. Regenerate with `supabase gen types` after migrations. */

export type PublishStatus = "draft" | "published" | "archived";
export type MediaKind = "image" | "video" | "pdf" | "document" | "other";

export type SectionType =
  | "hero_banner"
  | "welcome"
  | "timeline"
  | "vision_4c"
  | "recommendations"
  | "image_slider"
  | "event_registration"
  | "campaigns"
  | "partners"
  | "gallery"
  | "ministries"
  | "summit_intro"
  | "summit_schedules"
  | "sikkim_train"
  | "sikkim_package"
  | "sikkim_circles"
  | "custom_html";

export interface MediaAsset {
  id: string;
  bucket: string;
  storage_path: string;
  public_url?: string;
  alt_text?: string | null;
  mime_type?: string | null;
  media_kind: MediaKind;
}

export interface PageSection {
  id: string;
  page_id: string;
  section_type: SectionType;
  title: string | null;
  sort_order: number;
  is_enabled: boolean;
  content: Record<string, unknown>;
  settings: Record<string, unknown>;
}

export interface PageWithSections {
  id: string;
  slug: string;
  title: string;
  status: PublishStatus;
  sections: PageSection[];
  seo?: SeoMeta | null;
}

export interface SeoMeta {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  og_image?: MediaAsset | null;
  canonical_url?: string | null;
  robots?: string | null;
}

export interface HeroBannerSlide {
  id: string;
  heading?: string | null;
  subheading?: string | null;
  description?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  video?: MediaAsset | null;
  poster?: MediaAsset | null;
  upcoming_event?: EventSummary | null;
}

export interface EventSummary {
  id: string;
  slug: string;
  title: string;
  starts_at?: string | null;
}

export interface VisionItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  short_description?: string | null;
  theme_color?: string | null;
  detail_page_slug?: string | null;
  icon?: MediaAsset | null;
  cover?: MediaAsset | null;
}

export interface TeamMember {
  id: string;
  slug: string;
  full_name: string;
  designation: string;
  division?: string | null;
  region?: string | null;
  bio_html?: string | null;
  bio_paragraphs: string[];
  education?: string | null;
  image?: MediaAsset | null;
  linkedin_url?: string | null;
  category_slug: string;
  articles?: TeamMemberArticle[];
}

export interface TeamMemberArticle {
  id: string;
  title: string;
  excerpt?: string | null;
  href: string;
  article_type?: string | null;
}

export interface CollaborationPartner {
  id: string;
  slug: string;
  name: string;
  short_description?: string | null;
  description_html?: string | null;
  logo?: MediaAsset | null;
  banner?: MediaAsset | null;
  phone?: string | null;
  email?: string | null;
  website_url?: string | null;
  additional_info: Record<string, unknown>;
  landing_blocks: CollaborationBlock[];
  detail_content: Record<string, unknown>;
  gallery: MediaAsset[];
  category?: { slug: string; name: string } | null;
}

export interface CollaborationBlock {
  type: "hero" | "narrative" | "quote" | "stats" | "cta" | "gallery";
  data: Record<string, unknown>;
}

export interface EventRegistrationPayload {
  event_id: string;
  full_name: string;
  email: string;
  phone?: string;
  organization?: string;
  country?: string;
  state?: string;
  city?: string;
  message?: string;
}

export interface BrochureLeadPayload {
  event_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  organization?: string;
}

-- =============================================================================
-- Gnarly Troop CMS — Initial Schema
-- Supabase PostgreSQL
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- -----------------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------------
CREATE TYPE publish_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE media_kind AS ENUM ('image', 'video', 'pdf', 'document', 'other');
CREATE TYPE section_type AS ENUM (
  'hero_banner',
  'welcome',
  'timeline',
  'vision_4c',
  'recommendations',
  'image_slider',
  'event_registration',
  'campaigns',
  'partners',
  'gallery',
  'ministries',
  'summit_intro',
  'summit_schedules',
  'sikkim_train',
  'sikkim_package',
  'sikkim_circles',
  'custom_html'
);

-- -----------------------------------------------------------------------------
-- AUTH & RBAC (profiles extend auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (resource, action)
);

CREATE TABLE role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  full_name TEXT,
  avatar_media_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- CMS: PAGES & SECTIONS
-- -----------------------------------------------------------------------------
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  status publish_status NOT NULL DEFAULT 'draft',
  is_home BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX pages_one_home ON pages (is_home) WHERE is_home = true;

CREATE TABLE page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  section_type section_type NOT NULL,
  title TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_sections_page ON page_sections(page_id, sort_order);
CREATE INDEX idx_page_sections_type ON page_sections(section_type);

CREATE TABLE seo_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  entity_type TEXT,
  entity_id UUID,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_image_media_id UUID,
  canonical_url TEXT,
  robots TEXT DEFAULT 'index,follow',
  structured_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT seo_meta_target CHECK (
    page_id IS NOT NULL OR (entity_type IS NOT NULL AND entity_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX seo_meta_page_unique ON seo_meta(page_id) WHERE page_id IS NOT NULL;
CREATE UNIQUE INDEX seo_meta_entity_unique ON seo_meta(entity_type, entity_id)
  WHERE entity_type IS NOT NULL AND entity_id IS NOT NULL;

-- -----------------------------------------------------------------------------
-- MEDIA LIBRARY
-- -----------------------------------------------------------------------------
CREATE TABLE media_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  parent_id UUID REFERENCES media_folders(id) ON DELETE SET NULL,
  bucket TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (parent_id, slug)
);

CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID REFERENCES media_folders(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  bucket TEXT NOT NULL,
  media_kind media_kind NOT NULL DEFAULT 'image',
  mime_type TEXT,
  file_size BIGINT,
  width INT,
  height INT,
  duration_seconds INT,
  alt_text TEXT,
  caption TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_library_folder ON media_library(folder_id);
CREATE INDEX idx_media_library_bucket_path ON media_library(bucket, storage_path);

ALTER TABLE profiles
  ADD CONSTRAINT profiles_avatar_fk
  FOREIGN KEY (avatar_media_id) REFERENCES media_library(id) ON DELETE SET NULL;

ALTER TABLE seo_meta
  ADD CONSTRAINT seo_meta_og_fk
  FOREIGN KEY (og_image_media_id) REFERENCES media_library(id) ON DELETE SET NULL;

-- -----------------------------------------------------------------------------
-- HOMEPAGE: HERO
-- -----------------------------------------------------------------------------
CREATE TABLE hero_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_section_id UUID REFERENCES page_sections(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE hero_banner_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_banner_id UUID NOT NULL REFERENCES hero_banners(id) ON DELETE CASCADE,
  heading TEXT,
  subheading TEXT,
  description TEXT,
  cta_label TEXT,
  cta_url TEXT,
  cta_secondary_label TEXT,
  cta_secondary_url TEXT,
  video_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  poster_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  background_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  upcoming_event_id UUID,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hero_slides_banner ON hero_banner_slides(hero_banner_id, sort_order);

-- -----------------------------------------------------------------------------
-- HOMEPAGE: WELCOME
-- -----------------------------------------------------------------------------
CREATE TABLE welcome_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_section_id UUID REFERENCES page_sections(id) ON DELETE SET NULL,
  title TEXT,
  subtitle TEXT,
  body_html TEXT,
  patron_name TEXT,
  patron_title TEXT,
  patron_image_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  certificate_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE welcome_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  welcome_section_id UUID NOT NULL REFERENCES welcome_sections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  image_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- HOMEPAGE: TIMELINE
-- -----------------------------------------------------------------------------
CREATE TABLE timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_section_id UUID REFERENCES page_sections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE timeline_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timeline_id UUID NOT NULL REFERENCES timelines(id) ON DELETE CASCADE,
  era TEXT NOT NULL CHECK (era IN ('past', 'present', 'future')),
  year_label TEXT,
  title TEXT NOT NULL,
  description TEXT,
  image_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_timeline_items ON timeline_items(timeline_id, era, sort_order);

-- -----------------------------------------------------------------------------
-- HOMEPAGE: 4C VISION (dynamic add/remove/reorder)
-- -----------------------------------------------------------------------------
CREATE TABLE vision_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  short_description TEXT,
  icon_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  cover_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  theme_color TEXT,
  detail_page_slug TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  status publish_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vision_item_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vision_item_id UUID NOT NULL REFERENCES vision_items(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL DEFAULT 'story',
  title TEXT,
  body TEXT,
  image_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- HOMEPAGE: RECOMMENDATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_section_id UUID REFERENCES page_sections(id) ON DELETE SET NULL,
  section_title TEXT,
  static_image_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE recommendation_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  image_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  certificate_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  testimonial TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- HOMEPAGE: IMAGE SLIDERS
-- -----------------------------------------------------------------------------
CREATE TABLE image_sliders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_section_id UUID REFERENCES page_sections(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE image_slider_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_slider_id UUID NOT NULL REFERENCES image_sliders(id) ON DELETE CASCADE,
  heading TEXT,
  description TEXT,
  image_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  cta_label TEXT,
  cta_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- EVENTS
-- -----------------------------------------------------------------------------
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  location TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  banner_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  brochure_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  registration_enabled BOOLEAN NOT NULL DEFAULT true,
  brochure_gate_enabled BOOLEAN NOT NULL DEFAULT true,
  max_registrations INT,
  status publish_status NOT NULL DEFAULT 'draft',
  sort_order INT NOT NULL DEFAULT 0,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_status_dates ON events(status, starts_at);

ALTER TABLE hero_banner_slides
  ADD CONSTRAINT hero_slides_event_fk
  FOREIGN KEY (upcoming_event_id) REFERENCES events(id) ON DELETE SET NULL;

CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email CITEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  country TEXT,
  state TEXT,
  city TEXT,
  message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_registrations_event ON event_registrations(event_id, created_at DESC);
CREATE INDEX idx_event_registrations_email ON event_registrations(email);

CREATE TABLE brochure_download_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email CITEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  brochure_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  downloaded_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- CAMPAIGNS / TOURS
-- -----------------------------------------------------------------------------
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_section_id UUID REFERENCES page_sections(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  offerings JSONB NOT NULL DEFAULT '[]'::jsonb,
  cover_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  cta_label TEXT,
  cta_url TEXT,
  starts_at DATE,
  ends_at DATE,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  status publish_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- PARTNERS
-- -----------------------------------------------------------------------------
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_section_id UUID REFERENCES page_sections(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  logo_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  website_url TEXT,
  partner_type TEXT NOT NULL DEFAULT 'partner',
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- GALLERIES
-- -----------------------------------------------------------------------------
CREATE TABLE galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_section_id UUID REFERENCES page_sections(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  cover_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  status publish_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  title TEXT,
  caption TEXT,
  media_id UUID NOT NULL REFERENCES media_library(id) ON DELETE CASCADE,
  media_kind media_kind NOT NULL DEFAULT 'image',
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gallery_items ON gallery_items(gallery_id, sort_order);

-- -----------------------------------------------------------------------------
-- LEADERSHIP
-- -----------------------------------------------------------------------------
CREATE TABLE team_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  display_style TEXT NOT NULL DEFAULT 'grid',
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES team_categories(id) ON DELETE RESTRICT,
  slug TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  division TEXT,
  region TEXT,
  bio_html TEXT,
  bio_paragraphs JSONB NOT NULL DEFAULT '[]'::jsonb,
  education TEXT,
  image_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  linkedin_url TEXT,
  twitter_url TEXT,
  email TEXT,
  phone TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  status publish_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_team_members_category ON team_members(category_id, sort_order);

CREATE TABLE team_member_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  excerpt TEXT,
  href TEXT NOT NULL,
  article_type TEXT DEFAULT 'Article',
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- COLLABORATION
-- -----------------------------------------------------------------------------
CREATE TABLE collaboration_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE collaboration_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES collaboration_categories(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_description TEXT,
  description_html TEXT,
  logo_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  banner_media_id UUID REFERENCES media_library(id) ON DELETE SET NULL,
  phone TEXT,
  email CITEXT,
  website_url TEXT,
  additional_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  landing_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  detail_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  status publish_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE collaboration_partner_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES collaboration_partners(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media_library(id) ON DELETE CASCADE,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- SITE SETTINGS & NAVIGATION
-- -----------------------------------------------------------------------------
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE navigation_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL DEFAULT 'header',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE navigation_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL REFERENCES navigation_menus(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES navigation_menu_items(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT,
  page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
  open_in_new_tab BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- UPDATED_AT TRIGGERS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'roles','profiles','pages','page_sections','seo_meta','media_folders','media_library',
    'hero_banners','hero_banner_slides','welcome_sections','timelines','vision_items',
    'recommendations','image_sliders','events','campaigns','partners','galleries',
    'team_categories','team_members','collaboration_categories','collaboration_partners',
    'site_settings','social_links','navigation_menus'
  ]
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      t, t
    );
  END LOOP;
END $$;

-- =============================================================================
-- Row Level Security & Policies
-- =============================================================================

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_banner_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE welcome_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE welcome_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_item_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_slider_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE brochure_download_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_partner_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_menu_items ENABLE ROW LEVEL SECURITY;

-- Helper: check if user has admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles p
    JOIN roles r ON r.id = p.role_id
    WHERE p.id = auth.uid()
      AND p.is_active = true
      AND r.slug IN ('super_admin', 'admin', 'editor')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION has_permission(p_resource TEXT, p_action TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles p
    JOIN role_permissions rp ON rp.role_id = p.role_id
    JOIN permissions perm ON perm.id = rp.permission_id
    WHERE p.id = auth.uid()
      AND p.is_active = true
      AND perm.resource = p_resource
      AND perm.action = p_action
  ) OR is_admin();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PUBLIC READ (published content)
CREATE POLICY "public_read_pages" ON pages FOR SELECT
  USING (status = 'published' OR is_admin());

CREATE POLICY "public_read_page_sections" ON page_sections FOR SELECT
  USING (
    is_enabled = true
    AND EXISTS (
      SELECT 1 FROM pages p
      WHERE p.id = page_sections.page_id
        AND (p.status = 'published' OR is_admin())
    )
  );

CREATE POLICY "public_read_seo" ON seo_meta FOR SELECT USING (true);

CREATE POLICY "public_read_media" ON media_library FOR SELECT USING (true);
CREATE POLICY "public_read_vision" ON vision_items FOR SELECT
  USING (status = 'published' AND is_enabled = true OR is_admin());
CREATE POLICY "public_read_events" ON events FOR SELECT
  USING (status = 'published' OR is_admin());
CREATE POLICY "public_read_galleries" ON galleries FOR SELECT
  USING (status = 'published' AND is_enabled = true OR is_admin());
CREATE POLICY "public_read_gallery_items" ON gallery_items FOR SELECT
  USING (is_enabled = true OR is_admin());
CREATE POLICY "public_read_team" ON team_members FOR SELECT
  USING (status = 'published' AND is_enabled = true OR is_admin());
CREATE POLICY "public_read_team_categories" ON team_categories FOR SELECT
  USING (is_enabled = true OR is_admin());
CREATE POLICY "public_read_collaboration" ON collaboration_partners FOR SELECT
  USING (status = 'published' AND is_enabled = true OR is_admin());
CREATE POLICY "public_read_collab_categories" ON collaboration_categories FOR SELECT
  USING (is_enabled = true OR is_admin());
CREATE POLICY "public_read_partners" ON partners FOR SELECT
  USING (is_enabled = true OR is_admin());
CREATE POLICY "public_read_social" ON social_links FOR SELECT
  USING (is_enabled = true OR is_admin());
CREATE POLICY "public_read_nav" ON navigation_menus FOR SELECT USING (true);
CREATE POLICY "public_read_nav_items" ON navigation_menu_items FOR SELECT
  USING (is_enabled = true OR is_admin());

-- Public read for homepage entity tables
CREATE POLICY "public_read_hero" ON hero_banners FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "public_read_hero_slides" ON hero_banner_slides FOR SELECT USING (is_enabled = true OR is_admin());
CREATE POLICY "public_read_welcome" ON welcome_sections FOR SELECT USING (is_enabled = true OR is_admin());
CREATE POLICY "public_read_welcome_members" ON welcome_members FOR SELECT USING (is_enabled = true OR is_admin());
CREATE POLICY "public_read_timelines" ON timelines FOR SELECT USING (is_enabled = true OR is_admin());
CREATE POLICY "public_read_timeline_items" ON timeline_items FOR SELECT USING (is_enabled = true OR is_admin());
CREATE POLICY "public_read_recommendations" ON recommendations FOR SELECT USING (is_enabled = true OR is_admin());
CREATE POLICY "public_read_recommendation_cards" ON recommendation_cards FOR SELECT USING (is_enabled = true OR is_admin());
CREATE POLICY "public_read_sliders" ON image_sliders FOR SELECT USING (is_enabled = true OR is_admin());
CREATE POLICY "public_read_slider_slides" ON image_slider_slides FOR SELECT USING (is_enabled = true OR is_admin());
CREATE POLICY "public_read_campaigns" ON campaigns FOR SELECT
  USING (status = 'published' AND is_enabled = true OR is_admin());

-- Anonymous inserts for leads/registrations
CREATE POLICY "anon_insert_event_registration" ON event_registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "anon_insert_brochure_lead" ON brochure_download_leads FOR INSERT
  WITH CHECK (true);

-- Admin full access pattern
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'pages','page_sections','seo_meta','media_folders','media_library',
    'hero_banners','hero_banner_slides','welcome_sections','welcome_members',
    'timelines','timeline_items','vision_items','vision_item_blocks',
    'recommendations','recommendation_cards','image_sliders','image_slider_slides',
    'events','event_registrations','brochure_download_leads','campaigns','partners',
    'galleries','gallery_items','team_categories','team_members','team_member_articles',
    'collaboration_categories','collaboration_partners','collaboration_partner_gallery',
    'site_settings','social_links','navigation_menus','navigation_menu_items',
    'roles','permissions','role_permissions','profiles'
  ]
  LOOP
    EXECUTE format(
      'CREATE POLICY "admin_all_%1$s" ON %1$I FOR ALL USING (is_admin()) WITH CHECK (is_admin())',
      t
    );
  END LOOP;
END $$;

-- Profiles: users read/update own row
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  USING (id = auth.uid() OR is_admin());

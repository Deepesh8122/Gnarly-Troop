-- Seed: roles, permissions, homepage page, default sections, vision items
INSERT INTO roles (name, slug, description) VALUES
  ('Super Admin', 'super_admin', 'Full system access'),
  ('Admin', 'admin', 'Content and user management'),
  ('Editor', 'editor', 'Content editing only'),
  ('Viewer', 'viewer', 'Read-only admin access')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO permissions (resource, action, description) VALUES
  ('pages', 'read', 'View pages'),
  ('pages', 'write', 'Edit pages'),
  ('events', 'read', 'View events'),
  ('events', 'write', 'Manage events'),
  ('media', 'read', 'View media'),
  ('media', 'write', 'Upload media'),
  ('team', 'write', 'Manage leadership'),
  ('collaboration', 'write', 'Manage partners'),
  ('users', 'write', 'Manage users'),
  ('settings', 'write', 'Site settings')
ON CONFLICT (resource, action) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.slug = 'super_admin'
ON CONFLICT DO NOTHING;

INSERT INTO pages (slug, title, status, is_home, published_at) VALUES
  ('home', 'Home', 'published', true, now()),
  ('leadership', 'Leadership', 'published', false, now()),
  ('collaboration', 'Collaboration', 'published', false, now())
ON CONFLICT (slug) DO NOTHING;

-- Default homepage section order (matches current static page)
INSERT INTO page_sections (page_id, section_type, title, sort_order, is_enabled, content)
SELECT p.id, s.section_type::section_type, s.title, s.sort_order, true, s.content
FROM pages p
CROSS JOIN (VALUES
  ('hero_banner', 'Hero Banner', 10, '{"videoSrc":"/hero.mp4","founderImg":"/images/sections/founder-img.png","pmImg":"/images/sections/pm-img.png"}'::jsonb),
  ('welcome', 'Welcome', 20, '{}'::jsonb),
  ('recommendations', 'Recommendations', 30, '{}'::jsonb),
  ('timeline', 'Global Timeline', 40, '{}'::jsonb),
  ('vision_4c', '4C Vision', 50, '{}'::jsonb),
  ('ministries', 'Ministries', 60, '{}'::jsonb),
  ('summit_intro', 'Summit Intro', 70, '{}'::jsonb),
  ('summit_schedules', 'Summit Schedules', 80, '{}'::jsonb),
  ('sikkim_train', 'Sikkim Train', 90, '{}'::jsonb),
  ('sikkim_package', 'Sikkim Package', 100, '{}'::jsonb),
  ('sikkim_circles', 'Sikkim Circles', 110, '{}'::jsonb),
  ('partners', 'Trusted Partners', 120, '{}'::jsonb),
  ('gallery', 'Gallery', 130, '{}'::jsonb)
) AS s(section_type, title, sort_order, content)
WHERE p.slug = 'home'
  AND NOT EXISTS (SELECT 1 FROM page_sections ps WHERE ps.page_id = p.id);

INSERT INTO vision_items (slug, title, subtitle, short_description, theme_color, detail_page_slug, sort_order, status) VALUES
  ('climate', 'Climate', 'Stewards for a greener tomorrow', 'Eco-initiatives and climate action', '#16b6a0', '/4cvision/climate', 1, 'published'),
  ('community', 'Community', 'Building stronger communities', 'Village adoption and outreach', '#1e88e5', '/4cvision/community', 2, 'published'),
  ('culture', 'Culture', 'Heritage and identity', 'Cultural revival and leadership', '#f08b3a', '/4cvision/culture', 3, 'published'),
  ('cooperation', 'Cooperation', 'Global partnerships', 'Cooperation and diplomacy', '#512da8', '/4cvision/cooperation', 4, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO team_categories (slug, name, display_style, sort_order) VALUES
  ('executive', 'Executive Policy & Leadership Council', 'carousel', 1),
  ('board', 'Strategic Support, Resources & Partnerships Council', 'carousel', 2),
  ('advisory', 'Gnarly Governance & Strategic Operations Council (Gnarly Team)', 'grid', 3),
  ('leaders', 'Troop Command & Mission Implementation Units (Troop Team)', 'grid', 4),
  ('historical', 'Member States, Chapters & Accredited Partners', 'grid', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO collaboration_categories (slug, name, sort_order) VALUES
  ('economic-opportunity', 'Economic Opportunity', 1),
  ('youth-partnerships', 'Youth Partnerships', 2),
  ('humanitarian', 'Humanitarian', 3),
  ('academic', 'Academic & Innovation', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO navigation_menus (name, slug, location) VALUES
  ('Main Header', 'main-header', 'header'),
  ('Footer Quick Links', 'footer-quick', 'footer')
ON CONFLICT (slug) DO NOTHING;

-- Default header links (editable in Admin → Menus)
INSERT INTO navigation_menu_items (menu_id, label, url, sort_order, is_enabled)
SELECT m.id, v.label, v.url, v.sort_order, true
FROM navigation_menus m
CROSS JOIN (VALUES
  ('Home', '/', 10),
  ('About', '/#sectionAbout', 20),
  ('Timeline', '/#sectionTimelines', 30),
  ('Visions', '/#sectionVisions', 40),
  ('Gallery', '/#sectionGallery', 50),
  ('Leadership', '/leadership/', 60),
  ('Collaboration', '/collaboration/', 70)
) AS v(label, url, sort_order)
WHERE m.slug = 'main-header'
  AND NOT EXISTS (
    SELECT 1 FROM navigation_menu_items i WHERE i.menu_id = m.id
  );

INSERT INTO site_settings (key, value, description) VALUES
  ('site_name', '"Gnarly Troop Global Federation"', 'Organization name'),
  ('footer_tagline', '"Welcome to My Country, India"', 'Footer tagline'),
  ('donation_url', '"/collaboration/donation"', 'Donation CTA URL'),
  ('brochure_gate_enabled', 'true', 'Require lead form before brochure download'),
  ('brochure_download_url', '"/documents/summit-brochure.pdf"', 'Public PDF path after lead form')
ON CONFLICT (key) DO NOTHING;

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
  ('welcome', 'Welcome', 20, '{"titleHi":"स्वागतम् मम राष्ट्रे भारतवर्षे !","titleEn":"Welcome to My Country, India","subtitle":"Explore Bharat with Gnarly Troop","estd":"EST. 2013","backgroundImage":"/images/sections/bg-about-country-maps.png"}'::jsonb),
  ('recommendations', 'Recommendations', 30, '{"staticImage":"/images/sections/img-globe-girl-flag-2.png"}'::jsonb),
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

-- Footer CMS pages (Contact, Help, etc.)
INSERT INTO pages (slug, title, status, published_at) VALUES
  ('contact', 'Contact', 'published', now()),
  ('help-center', 'Help Center', 'published', now()),
  ('careers', 'Careers', 'published', now()),
  ('who-we-are', 'Who We Are', 'published', now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO page_sections (page_id, section_type, title, sort_order, is_enabled, content)
SELECT p.id, 'custom_html', 'Page content', 10, true, v.content
FROM pages p
JOIN (VALUES
  ('contact', '{"body_html":"<h2>Contact Gnarly Troop</h2><p>Email: <a href=\"mailto:president@gnarlytroop.org\">president@gnarlytroop.org</a></p><p>For summit registration, visit <a href=\"/registration/\">Summit Registration</a>.</p>"}'::jsonb),
  ('help-center', '{"body_html":"<h2>Help Center</h2><p>Find answers about summit registration, donations, and membership.</p><ul><li><a href=\"/registration/\">Summit registration</a></li><li><a href=\"/collaboration/donation/\">Donate</a></li><li><a href=\"/leadership/\">Leadership</a></li></ul>"}'::jsonb),
  ('careers', '{"body_html":"<h2>Careers</h2><p>Join our mission to build youth leadership and cultural exchange across India. Send your CV to <a href=\"mailto:president@gnarlytroop.org\">president@gnarlytroop.org</a>.</p>"}'::jsonb),
  ('who-we-are', '{"body_html":"<h2>Who We Are</h2><p>Gnarly Troop Global Federation is a youth-led organisation advancing leadership, culture, and community service under the Padharo Mhare Desh Bharat vision.</p>"}'::jsonb)
) AS v(slug, content) ON p.slug = v.slug
WHERE NOT EXISTS (
  SELECT 1 FROM page_sections ps WHERE ps.page_id = p.id
);

INSERT INTO navigation_menu_items (menu_id, label, url, page_id, sort_order, is_enabled)
SELECT m.id, v.label, v.url, p.id, v.sort_order, true
FROM navigation_menus m
CROSS JOIN (VALUES
  ('Summit', '/registration/', NULL::text, 10),
  ('Leadership', '/leadership/', NULL::text, 20),
  ('Collaboration', '/collaboration/', NULL::text, 30),
  ('Give', '/collaboration/donation/', NULL::text, 40),
  ('Contact', NULL::text, 'contact', 50),
  ('Help Center', NULL::text, 'help-center', 60),
  ('Careers', NULL::text, 'careers', 70),
  ('Who We Are', NULL::text, 'who-we-are', 80),
  ('Sign In', '/admin/login/', NULL::text, 90)
) AS v(label, url, page_slug, sort_order)
LEFT JOIN pages p ON p.slug = v.page_slug
WHERE m.slug = 'footer-quick'
  AND NOT EXISTS (SELECT 1 FROM navigation_menu_items i WHERE i.menu_id = m.id);

INSERT INTO site_settings (key, value, description) VALUES
  ('site_name', '"Gnarly Troop Global Federation"', 'Organization name'),
  ('footer_tagline', '"Welcome to My Country, India"', 'Footer tagline'),
  ('donation_url', '"/collaboration/donation"', 'Donation CTA URL'),
  ('brochure_gate_enabled', 'true', 'Require lead form before brochure download'),
  ('brochure_download_url', '"/documents/summit-brochure.pdf"', 'Public PDF path after lead form')
ON CONFLICT (key) DO NOTHING;

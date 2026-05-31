-- Default footer CMS pages + footer menu links (editable in Admin → Pages / Menus)

INSERT INTO pages (slug, title, status, published_at) VALUES
  ('contact', 'Contact', 'published', now()),
  ('help-center', 'Help Center', 'published', now()),
  ('careers', 'Careers', 'published', now()),
  ('who-we-are', 'Who We Are', 'published', now())
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  updated_at = now();

-- Page body content (custom_html sections)
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

-- Footer menu items (two columns on site — order matters)
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

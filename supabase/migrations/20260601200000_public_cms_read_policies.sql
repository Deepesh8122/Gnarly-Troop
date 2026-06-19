-- Allow anonymous/public visitors to read published CMS content.
-- Without these, logged-in admins see everything via is_admin() but private/incognito fails.

CREATE POLICY "public_read_site_settings" ON site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "public_read_team_member_articles" ON team_member_articles
  FOR SELECT
  USING (
    (
      is_enabled = true
      AND EXISTS (
        SELECT 1
        FROM team_members tm
        WHERE tm.id = team_member_articles.team_member_id
          AND tm.status = 'published'
          AND tm.is_enabled = true
      )
    )
    OR is_admin()
  );

CREATE POLICY "public_read_vision_item_blocks" ON vision_item_blocks
  FOR SELECT
  USING (
    (
      is_enabled = true
      AND EXISTS (
        SELECT 1
        FROM vision_items vi
        WHERE vi.id = vision_item_blocks.vision_item_id
          AND vi.status = 'published'
          AND vi.is_enabled = true
      )
    )
    OR is_admin()
  );

CREATE POLICY "public_read_collab_partner_gallery" ON collaboration_partner_gallery
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM collaboration_partners cp
      WHERE cp.id = collaboration_partner_gallery.partner_id
        AND cp.status = 'published'
        AND cp.is_enabled = true
    )
    OR is_admin()
  );

-- Clarify precedence on existing public policies (drop + recreate).
DROP POLICY IF EXISTS "public_read_team" ON team_members;
CREATE POLICY "public_read_team" ON team_members
  FOR SELECT
  USING (
    (status = 'published' AND is_enabled = true)
    OR is_admin()
  );

DROP POLICY IF EXISTS "public_read_collaboration" ON collaboration_partners;
CREATE POLICY "public_read_collaboration" ON collaboration_partners
  FOR SELECT
  USING (
    (status = 'published' AND is_enabled = true)
    OR is_admin()
  );

DROP POLICY IF EXISTS "public_read_vision" ON vision_items;
CREATE POLICY "public_read_vision" ON vision_items
  FOR SELECT
  USING (
    (status = 'published' AND is_enabled = true)
    OR is_admin()
  );

DROP POLICY IF EXISTS "public_read_galleries" ON galleries;
CREATE POLICY "public_read_galleries" ON galleries
  FOR SELECT
  USING (
    (status = 'published' AND is_enabled = true)
    OR is_admin()
  );

DROP POLICY IF EXISTS "public_read_campaigns" ON campaigns;
CREATE POLICY "public_read_campaigns" ON campaigns
  FOR SELECT
  USING (
    (status = 'published' AND is_enabled = true)
    OR is_admin()
  );

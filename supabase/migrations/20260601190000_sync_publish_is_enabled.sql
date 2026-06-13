-- Keep is_enabled in sync with publish status for existing rows.
-- Public site requires status = 'published' AND is_enabled = true.

UPDATE team_members
SET is_enabled = (status = 'published')
WHERE is_enabled IS DISTINCT FROM (status = 'published');

UPDATE collaboration_partners
SET is_enabled = (status = 'published')
WHERE is_enabled IS DISTINCT FROM (status = 'published');

UPDATE galleries
SET is_enabled = (status = 'published')
WHERE is_enabled IS DISTINCT FROM (status = 'published');

UPDATE vision_items
SET is_enabled = (status = 'published')
WHERE is_enabled IS DISTINCT FROM (status = 'published');

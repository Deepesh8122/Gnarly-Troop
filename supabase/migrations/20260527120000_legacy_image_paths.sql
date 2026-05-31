-- Site-relative image paths for imports (no Storage upload required)
ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS legacy_image_path TEXT;

ALTER TABLE collaboration_partners
  ADD COLUMN IF NOT EXISTS legacy_image_path TEXT;

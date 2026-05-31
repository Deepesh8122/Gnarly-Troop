-- Extended fields for 4C vision story blocks (CMS)
ALTER TABLE vision_item_blocks
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS excerpt TEXT,
  ADD COLUMN IF NOT EXISTS legacy_image_path TEXT,
  ADD COLUMN IF NOT EXISTS author TEXT,
  ADD COLUMN IF NOT EXISTS read_time INT;

CREATE UNIQUE INDEX IF NOT EXISTS vision_item_blocks_slug_item
  ON vision_item_blocks (vision_item_id, slug)
  WHERE slug IS NOT NULL;

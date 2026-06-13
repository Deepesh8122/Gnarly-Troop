-- =============================================================================
-- RUN THIS ONLY IF you already ran initial_schema + rls and got
-- "already exists" errors. Do NOT re-run 20260526100000 or 20260526100001.
-- =============================================================================

-- ----- Donations (skip if you already ran 20260526120000) -----
DO $$ BEGIN
  CREATE TYPE donation_status AS ENUM (
    'pending', 'initiated', 'success', 'failed', 'refunded'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS donation_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  amount_paise BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id UUID REFERENCES donation_tiers(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL,
  email CITEXT NOT NULL,
  phone TEXT NOT NULL,
  organization TEXT,
  country TEXT,
  state TEXT,
  district TEXT,
  pin_code TEXT,
  pan TEXT,
  amount_paise BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_provider TEXT NOT NULL DEFAULT 'phonepe',
  merchant_transaction_id TEXT NOT NULL UNIQUE,
  phonepe_transaction_id TEXT,
  phonepe_payment_id TEXT,
  status donation_status NOT NULL DEFAULT 'pending',
  callback_payload JSONB DEFAULT '{}'::jsonb,
  receipt_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE VIEW donor_leaderboard AS
SELECT
  COALESCE(NULLIF(trim(phone), ''), email::text) AS donor_key,
  max(donor_name) AS donor_name,
  email,
  phone,
  count(*) FILTER (WHERE status = 'success') AS donation_count,
  sum(amount_paise) FILTER (WHERE status = 'success') AS total_amount_paise,
  max(created_at) FILTER (WHERE status = 'success') AS last_donation_at
FROM donations
GROUP BY COALESCE(NULLIF(trim(phone), ''), email::text), email, phone
HAVING sum(amount_paise) FILTER (WHERE status = 'success') > 0
ORDER BY total_amount_paise DESC;

-- Auth profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed data (safe to re-run)
INSERT INTO roles (name, slug, description) VALUES
  ('Super Admin', 'super_admin', 'Full system access'),
  ('Admin', 'admin', 'Content management'),
  ('Editor', 'editor', 'Content editing'),
  ('Viewer', 'viewer', 'Read-only')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO pages (slug, title, status, is_home, published_at) VALUES
  ('home', 'Home', 'published', true, now()),
  ('leadership', 'Leadership', 'published', false, now()),
  ('collaboration', 'Collaboration', 'published', false, now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO donation_tiers (slug, title, amount_paise, description, sort_order) VALUES
  ('supporter', 'Supporter', 50000, '₹500 — General support', 1),
  ('patron', 'Patron', 210000, '₹2,100 — Program patron', 2),
  ('champion', 'Champion', 1100000, '₹11,000 — Leadership circle', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO team_categories (slug, name, display_style, sort_order) VALUES
  ('executive', 'Executive Policy & Leadership Council', 'carousel', 1),
  ('board', 'Strategic Support, Resources & Partnerships Council', 'carousel', 2),
  ('advisory', 'Gnarly Governance & Strategic Operations Council (Gnarly Team)', 'grid', 3),
  ('leaders', 'Troop Command & Mission Implementation Units (Troop Team)', 'grid', 4),
  ('historical', 'Member States, Chapters & Accredited Partners', 'grid', 5)
ON CONFLICT (slug) DO NOTHING;

-- Legacy image paths for content import (no media_library insert required)
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS legacy_image_path TEXT;
ALTER TABLE collaboration_partners ADD COLUMN IF NOT EXISTS legacy_image_path TEXT;

-- ----- Public CMS read policies (anonymous visitors, no admin login) -----
-- Full file: supabase/migrations/20260601200000_public_cms_read_policies.sql
DO $$ BEGIN
  CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_team_member_articles" ON team_member_articles FOR SELECT
    USING (
      (
        is_enabled = true
        AND EXISTS (
          SELECT 1 FROM team_members tm
          WHERE tm.id = team_member_articles.team_member_id
            AND tm.status = 'published' AND tm.is_enabled = true
        )
      ) OR is_admin()
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_vision_item_blocks" ON vision_item_blocks FOR SELECT
    USING (
      (
        is_enabled = true
        AND EXISTS (
          SELECT 1 FROM vision_items vi
          WHERE vi.id = vision_item_blocks.vision_item_id
            AND vi.status = 'published' AND vi.is_enabled = true
        )
      ) OR is_admin()
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_collab_partner_gallery" ON collaboration_partner_gallery FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM collaboration_partners cp
        WHERE cp.id = collaboration_partner_gallery.partner_id
          AND cp.status = 'published' AND cp.is_enabled = true
      ) OR is_admin()
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

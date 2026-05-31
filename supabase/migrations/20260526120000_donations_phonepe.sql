-- Donations + PhonePe payment tracking

CREATE TYPE donation_status AS ENUM (
  'pending',
  'initiated',
  'success',
  'failed',
  'refunded'
);

CREATE TABLE donation_tiers (
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

CREATE TABLE donations (
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

CREATE INDEX idx_donations_status ON donations(status, created_at DESC);
CREATE INDEX idx_donations_email ON donations(email);
CREATE INDEX idx_donations_phone ON donations(phone);
CREATE INDEX idx_donations_merchant_txn ON donations(merchant_transaction_id);

-- Aggregated view for admin "top donors"
CREATE OR REPLACE VIEW donor_leaderboard AS
SELECT
  lower(email::text) || '|' || COALESCE(NULLIF(trim(phone), ''), '') AS donor_key,
  max(donor_name) AS donor_name,
  email,
  phone,
  count(*) FILTER (WHERE status = 'success') AS donation_count,
  sum(amount_paise) FILTER (WHERE status = 'success') AS total_amount_paise,
  max(created_at) FILTER (WHERE status = 'success') AS last_donation_at
FROM donations
GROUP BY email, phone
HAVING sum(amount_paise) FILTER (WHERE status = 'success') > 0
ORDER BY total_amount_paise DESC;

ALTER TABLE donation_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_donation_tiers" ON donation_tiers FOR SELECT
  USING (is_enabled = true OR is_admin());

CREATE POLICY "anon_insert_donations" ON donations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "public_read_own_donation_status" ON donations FOR SELECT
  USING (true);

CREATE POLICY "admin_all_donation_tiers" ON donation_tiers FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_all_donations" ON donations FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

CREATE TRIGGER trg_donation_tiers_updated_at
  BEFORE UPDATE ON donation_tiers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO donation_tiers (slug, title, amount_paise, description, sort_order) VALUES
  ('supporter', 'Supporter', 50000, '₹500 — General support', 1),
  ('patron', 'Patron', 210000, '₹2,100 — Program patron', 2),
  ('champion', 'Champion', 1100000, '₹11,000 — Leadership circle', 3)
ON CONFLICT (slug) DO NOTHING;

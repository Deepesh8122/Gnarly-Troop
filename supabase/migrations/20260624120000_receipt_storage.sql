-- Receipt PDF storage + membership tier classification

ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS receipt_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS receipt_kind TEXT NOT NULL DEFAULT 'donation'
    CHECK (receipt_kind IN ('donation', 'membership'));

ALTER TABLE event_registrations
  ADD COLUMN IF NOT EXISTS receipt_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS receipt_sent_at TIMESTAMPTZ;

ALTER TABLE donation_tiers
  ADD COLUMN IF NOT EXISTS receipt_type TEXT NOT NULL DEFAULT 'donation'
    CHECK (receipt_type IN ('donation', 'membership'));

CREATE INDEX IF NOT EXISTS idx_donations_receipt_kind ON donations (receipt_kind, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_registrations_receipt_sent ON event_registrations (receipt_sent_at);

-- Global Access membership tier (paid membership → membership identity PDF)
INSERT INTO donation_tiers (slug, title, amount_paise, description, sort_order, receipt_type)
VALUES (
  'global-access',
  'Global Access Membership',
  510000,
  '₹5,100 — Official membership recognition & global networking access',
  0,
  'membership'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  amount_paise = EXCLUDED.amount_paise,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  receipt_type = EXCLUDED.receipt_type;

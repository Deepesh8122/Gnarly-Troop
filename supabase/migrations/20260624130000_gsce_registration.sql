-- GSCE extended registration: accreditation, fees, payment, delegate ID

ALTER TABLE event_registrations
  ADD COLUMN IF NOT EXISTS accreditation_category TEXT,
  ADD COLUMN IF NOT EXISTS fee_tier TEXT,
  ADD COLUMN IF NOT EXISTS amount_paise BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'not_required',
  ADD COLUMN IF NOT EXISTS merchant_transaction_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS phonepe_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_environment TEXT,
  ADD COLUMN IF NOT EXISTS delegate_id TEXT,
  ADD COLUMN IF NOT EXISTS nationality TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS official_email TEXT;

CREATE INDEX IF NOT EXISTS idx_event_registrations_accreditation
  ON event_registrations (accreditation_category, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_event_registrations_payment
  ON event_registrations (payment_status, merchant_transaction_id);

CREATE INDEX IF NOT EXISTS idx_event_registrations_delegate_id
  ON event_registrations (delegate_id);

-- Donations: ensure receipt path is queryable in admin
CREATE INDEX IF NOT EXISTS idx_donations_receipt_storage
  ON donations (receipt_storage_path)
  WHERE receipt_storage_path IS NOT NULL;

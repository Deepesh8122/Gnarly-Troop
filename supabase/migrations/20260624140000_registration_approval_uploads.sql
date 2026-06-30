-- Secretariat approval workflow + registration document paths

ALTER TABLE event_registrations
  ADD COLUMN IF NOT EXISTS photo_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS passport_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS visa_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS government_id_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS review_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_event_registrations_review
  ON event_registrations (status, created_at DESC)
  WHERE status IN ('pending_review', 'pending_payment');

COMMENT ON COLUMN event_registrations.status IS
  'pending_payment | pending_review | approved | rejected | confirmed | failed';

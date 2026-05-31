-- Eligibility + designation on summit registrations
ALTER TABLE event_registrations
  ADD COLUMN IF NOT EXISTS eligibility TEXT,
  ADD COLUMN IF NOT EXISTS designation TEXT;

CREATE INDEX IF NOT EXISTS idx_event_registrations_eligibility
  ON event_registrations (eligibility);

-- Default summit event for /registration
INSERT INTO events (
  slug,
  title,
  subtitle,
  description,
  location,
  starts_at,
  ends_at,
  registration_enabled,
  is_featured,
  status
) VALUES (
  'global-leadership-summit-2026',
  'Padharo Mhare Desh Bharat Global Leadership Summit & Cultural Exchange-2026',
  '21st – 22nd February, 2026',
  'Register for the Global Leadership Summit at Bharat Mandapam, New Delhi.',
  'Bharat Mandapam, New Delhi',
  '2026-02-21 09:00:00+05:30',
  '2026-02-22 18:00:00+05:30',
  true,
  true,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  registration_enabled = EXCLUDED.registration_enabled,
  status = EXCLUDED.status,
  updated_at = now();

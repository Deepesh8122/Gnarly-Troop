-- Admin enhancements: team member social links
ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

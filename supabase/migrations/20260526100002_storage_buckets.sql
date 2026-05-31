-- =============================================================================
-- Storage buckets (run via Supabase Dashboard or storage API if buckets API unavailable in SQL)
-- Note: Supabase CLI `supabase storage` or Dashboard recommended for bucket creation.
-- This migration documents policies assuming buckets exist.
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('banners', 'banners', true, 52428800, ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm']),
  ('gallery', 'gallery', true, 52428800, ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm']),
  ('events', 'events', true, 52428800, ARRAY['image/jpeg','image/png','image/webp','application/pdf']),
  ('brochures', 'brochures', false, 104857600, ARRAY['application/pdf']),
  ('videos', 'videos', true, 209715200, ARRAY['video/mp4','video/webm','video/quicktime']),
  ('team', 'team', true, 20971520, ARRAY['image/jpeg','image/png','image/webp']),
  ('partners', 'partners', true, 20971520, ARRAY['image/jpeg','image/png','image/webp','image/svg+xml']),
  ('documents', 'documents', false, 104857600, ARRAY['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- Public read for public buckets
CREATE POLICY "public_read_banners" ON storage.objects FOR SELECT
  USING (bucket_id IN ('banners','gallery','events','videos','team','partners'));

CREATE POLICY "admin_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('banners','gallery','events','brochures','videos','team','partners','documents') AND is_admin());

CREATE POLICY "admin_update_storage" ON storage.objects FOR UPDATE
  USING (is_admin());

CREATE POLICY "admin_delete_storage" ON storage.objects FOR DELETE
  USING (is_admin());

-- Brochure downloads: authenticated admin upload; signed URLs for gated downloads
CREATE POLICY "admin_read_brochures" ON storage.objects FOR SELECT
  USING (bucket_id = 'brochures' AND (is_admin() OR bucket_id != 'brochures'));

CREATE POLICY "admin_read_documents" ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND is_admin());

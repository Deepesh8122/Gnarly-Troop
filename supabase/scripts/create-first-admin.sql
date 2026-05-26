-- Run AFTER creating a user in Supabase Auth (Authentication → Users → Add user)
-- Replace YOUR_AUTH_USER_UUID with that user's UUID

-- Example:
-- UPDATE profiles SET role_id = (SELECT id FROM roles WHERE slug = 'super_admin')
-- WHERE id = 'YOUR_AUTH_USER_UUID';

-- If profile row missing (trigger not added yet), insert manually:
/*
INSERT INTO profiles (id, role_id, full_name, is_active)
VALUES (
  'YOUR_AUTH_USER_UUID',
  (SELECT id FROM roles WHERE slug = 'super_admin'),
  'Admin User',
  true
)
ON CONFLICT (id) DO UPDATE SET role_id = EXCLUDED.role_id, is_active = true;
*/

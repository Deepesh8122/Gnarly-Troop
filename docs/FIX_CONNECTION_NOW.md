# Fix Supabase connection & admin (quick)

## Problem 1: SQL "already exists"

Your database **already has** tables and policies. **Stop re-running:**

- ❌ `20260526100000_initial_schema.sql`
- ❌ `20260526100001_rls_policies.sql`

**Run only this once** in Supabase SQL Editor:

→ `supabase/RUN_ONLY_IF_MISSING.sql`

---

## Problem 2: Health said `configured: false` (key too short)

The app wrongly rejected **publishable keys** (`sb_publishable_...`) because they are shorter than old JWT keys.

**Fixed in code.** Restart the dev server after pulling latest:

```bash
npm run dev
```

---

## Problem 3: Keys must be in `.env.local`

Next.js reads **`.env.local`**, not `.env.example`.

1. Create `.env.local` in project root (same folder as `package.json`).
2. Paste:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_FULL_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=eyJ_OR_sb_secret_YOUR_FULL_SECRET
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CMS_ENABLED=false
```

3. Copy keys from **Supabase → Project Settings → API**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** (full string) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **Secret key** or legacy **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

4. Restart:

```bash
# stop server (Ctrl+C), then:
npm run dev
```

---

## Problem 4: Verify

Open:

```
http://localhost:3000/api/health/supabase/
```

You want:

```json
"configured": true,
"connection": { "ok": true }
```

Then open:

- http://localhost:3000/admin/login/
- http://localhost:3000/admin/setup/

---

## Problem 5: Admin user

1. Supabase → **Authentication → Users → Add user**
2. SQL Editor (replace UUID):

```sql
INSERT INTO profiles (id, role_id, full_name, is_active)
VALUES (
  'PASTE-USER-UUID',
  (SELECT id FROM roles WHERE slug = 'super_admin'),
  'Admin',
  true
)
ON CONFLICT (id) DO UPDATE
SET role_id = EXCLUDED.role_id, is_active = true;
```

3. **Authentication → URL Configuration** add redirect:

`http://localhost:3000/auth/callback`

---

## Auth redirect for production domain

Add every domain you use:

| Site URL | Redirect URL |
|----------|----------------|
| `https://yourdomain.com` | `https://yourdomain.com/auth/callback` |
| `http://localhost:3000` | `http://localhost:3000/auth/callback` |

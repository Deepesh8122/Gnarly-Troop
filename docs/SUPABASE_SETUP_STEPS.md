# Gnarly Troop — Supabase & PhonePe setup (step by step)

## Step 1 — Create `.env.local`

Copy `.env.example` to `.env.local` in the project root.

```bash
cp .env.example .env.local
```

Fill in from **Supabase Dashboard → Project Settings → API**:

| Variable | Where to copy |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **anon public** JWT (`eyJ...`) **or** **publishable** key (`sb_publishable_...`) — both work |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` secret (server only) |

Restart dev server after any env change:

```bash
npm run dev
```

## Step 2 — Run database migrations

Supabase Dashboard → **SQL Editor** → New query.

Run each file **in order** (copy/paste full file → Run):

1. `supabase/migrations/20260526100000_initial_schema.sql`
2. `supabase/migrations/20260526100001_rls_policies.sql`
3. `supabase/migrations/20260526100002_storage_buckets.sql`
4. `supabase/migrations/20260526120000_donations_phonepe.sql`
5. `supabase/seed.sql`

### If you get "already exists" errors

Your database is **partially migrated**. Do **NOT** run `initial_schema` or `rls_policies` again.

Run only: **`supabase/RUN_ONLY_IF_MISSING.sql`**

| Error | Meaning |
|-------|---------|
| `type "publish_status" already exists` | Schema already created — skip file 1 |
| `policy "public_read_pages" already exists` | RLS already created — skip file 2 |

If you see `function set_updated_at does not exist`, run the trigger section from file 1 again.

## Step 3 — Verify connection

Open in browser:

```
http://localhost:3000/api/health/supabase/
```

You want `"connection": { "ok": true }`.

Or open: **http://localhost:3000/admin/setup/**

## Step 4 — Register your domain (Auth redirects)

Supabase → **Authentication** → **URL Configuration**:

| Field | Value |
|-------|--------|
| Site URL | `https://yourdomain.com` (or `http://localhost:3000` for local) |
| Redirect URLs | `http://localhost:3000/auth/callback` |
| | `https://yourdomain.com/auth/callback` |

Add every domain you use (staging + production).

## Step 5 — Create admin login

1. Supabase → **Authentication** → **Users** → **Add user** (email + password).
2. Copy the user **UUID**.
3. SQL Editor → run (replace UUID):

```sql
INSERT INTO profiles (id, role_id, full_name, is_active)
VALUES (
  'PASTE-USER-UUID-HERE',
  (SELECT id FROM roles WHERE slug = 'super_admin'),
  'Admin',
  true
)
ON CONFLICT (id) DO UPDATE
SET role_id = EXCLUDED.role_id, is_active = true;
```

4. Login: **http://localhost:3000/admin/login/**

## Step 6 — PhonePe donations

1. PhonePe Business / Developer dashboard → get **Merchant ID**, **Salt Key**, **Salt Index**.
2. Add to `.env.local`:

```
PHONEPE_MERCHANT_ID=...
PHONEPE_SALT_KEY=...
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=sandbox
```

3. Whitelist callback URL in PhonePe (if required):

```
https://yourdomain.com/api/donations/phonepe/callback/
```

4. Test donation: **http://localhost:3000/collaboration/donation/**

5. View top donors in admin: **http://localhost:3000/admin/donors/**

## Step 7 — CMS mode (optional, later)

Only after homepage content exists in `pages` / `page_sections`:

```
NEXT_PUBLIC_CMS_ENABLED=true
```

Until then, keep `false` so the site uses the existing static homepage.

## Common issues

| Problem | Fix |
|---------|-----|
| Pages blank / CMS errors | Set `NEXT_PUBLIC_CMS_ENABLED=false` |
| `Invalid API key` | Wrong anon key; no extra spaces in `.env.local` |
| Key not working in browser | Must be `NEXT_PUBLIC_SUPABASE_ANON_KEY`, not `SUPABASE_ANON_KEY` only |
| `relation does not exist` | Migrations not run — do Step 2 |
| Admin login works but no access | Run `profiles` SQL in Step 5 |
| Donation fails | Run donations migration; set PhonePe env vars |
| Storage upload fails | Create buckets in Storage UI if SQL bucket insert failed |

## Import old donors from MySQL (manual)

Export CSV from old database, then insert into `donations` with `status = 'success'` and `payment_provider = 'legacy'`.

The **donor_leaderboard** view will rank them automatically.

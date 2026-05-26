# Security & deployment model

This project combines a **public marketing site** and a **private CMS admin** in one codebase. Use the controls below so GitHub and public hosting never expose admin code, database schema, or privileged keys.

## What must never be public

| Asset | Why |
|--------|-----|
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses Row Level Security |
| `PHONEPE_SALT_KEY`, DB passwords | Full payment / DB access |
| `.env.local` | Contains all secrets |
| `supabase/migrations/`, `seed.sql` | Full database structure & seed data |
| Admin UI + `/api/admin/*` | CMS attack surface |

These paths are listed in `.gitignore`. **Anon key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) is designed to be public; security relies on **RLS policies** in Supabase.

## Two deployments (recommended)

### 1. Public website (e.g. `www.gnarlytroop.org`)

- **Env:** copy `.env.public.example` → hosting secrets  
- `ENABLE_ADMIN=false`  
- **Do not set** `SUPABASE_SERVICE_ROLE_KEY`  
- `/admin` and `/api/admin` return **404** (middleware + API guard)

### 2. Private admin (e.g. `admin.gnarlytroop.org` or VPN-only)

- **Env:** copy `.env.admin.example`  
- `ENABLE_ADMIN=true`  
- `SUPABASE_SERVICE_ROLE_KEY` only on this host  
- Restrict by Supabase Auth + optional IP allowlist on host

Same Git repo can deploy twice with different environment variables.

## Git / GitHub strategy

### Option A — Private repo (simplest for your team)

- One **private** GitHub repo with everything  
- Collaborators only; enable branch protection  
- Still never commit `.env.local`

### Option B — Public frontend + private backend repo

- **Public repo:** marketing site only (respect `.gitignore` — no `app/(admin)/`, no `supabase/migrations/`)  
- **Private repo:** full monorepo including admin + SQL  
- `.gitignore` already excludes admin paths and SQL for the public remote

If files were committed before updating `.gitignore`, remove from Git history (keep locally):

```bash
git rm -r --cached supabase/migrations supabase/seed.sql
git rm -r --cached "app/(admin)" lib/admin components/admin app/api/admin
git commit -m "Stop tracking private admin and database assets"
```

For secrets already pushed, rotate keys in Supabase and PhonePe.

## Environment variable reference

| Variable | Public site | Admin deploy |
|----------|-------------|--------------|
| `ENABLE_ADMIN` | `false` | `true` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** | Yes |

Default if `ENABLE_ADMIN` is unset: **on** in `development`, **off** in `production`.

## Build commands

```bash
# Local full stack (admin + site)
ENABLE_ADMIN=true npm run dev

# Production-like public build
ENABLE_ADMIN=false npm run build
ENABLE_ADMIN=false npm run start
```

## Code guards (runtime)

- `lib/deploy-security.ts` — `isAdminDeployEnabled()`  
- `middleware.ts` — blocks `/admin/*` and `/api/admin/*` when disabled  
- `createServiceRoleClient()` — throws if admin deploy disabled  
- `lib/admin-api-guard.ts` — auth + deploy check on admin APIs  

## Supabase hardening checklist

1. RLS enabled on all tables (migrations in private bundle)  
2. `service_role` key only on admin deployment  
3. Auth → redirect URLs limited to admin domain  
4. Storage policies: public read where needed; writes admin-only  
5. Rotate keys if they ever appeared in Git or logs  

## What public visitors can still see

Even with a “frontend-only” repo, the built Next.js app may include server bundles. **Disabling admin** prevents routes from working without the service role. For maximum separation, use two hostnames and two deploy projects as above.

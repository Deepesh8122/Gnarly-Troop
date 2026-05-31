# Database files (private)

SQL migrations and `seed.sql` are **not** committed to the public Git repository.

## Obtain schema

Ask your project lead for one of:

- A zip of `supabase/migrations/` + `seed.sql`
- Access to the **private** Git repository / 1Password vault
- Run order listed in `docs/SECURITY.md`

## Apply locally

1. Supabase Dashboard → **SQL Editor**
2. Run each migration file in timestamp order
3. Run `seed.sql` once
4. Never paste `service_role` keys into SQL or commit them

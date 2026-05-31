# Gnarly Troop — CMS Platform Architecture

Production architecture to convert the existing static Next.js site into a Supabase-driven CMS **without redesigning the UI**.

---

## 1. Current frontend analysis (mapped)

| Static section | Component | DB source |
|----------------|-----------|-----------|
| Hero video | `SectionHeroVideo` | `hero_banners` + `hero_banner_slides` |
| Welcome | `SectionAbout` | `welcome_sections` + `welcome_members` |
| Recommendations | `SectionMinisterLetter` | `recommendations` + `recommendation_cards` |
| Timeline | `SectionTimeline` | `timelines` + `timeline_items` |
| 4C Vision | `SectionVisions` / `SectionVisionsResponsive` | `vision_items` (dynamic add/remove/reorder) |
| Ministries | `SectionMinistries` | `page_sections.content` or dedicated table (phase 2) |
| Summit | `SummitSection1`, `SectionSchedules` | `page_sections` + `events` |
| Sikkim blocks | `SectionSikkim*` | `campaigns` or `page_sections.content` |
| Partners | `SectionPartners` | `partners` |
| Gallery | `SectionGallery` | `galleries` + `gallery_items` |
| Footer | `SectionFooter` | `site_settings`, `social_links`, `navigation_menus` |
| Leadership | `SectionLeadershipListing` | `team_categories` + `team_members` |
| Collaboration | `SectionCollaborationLanding` | `collaboration_partners.landing_blocks` |
| Collaboration detail | `SectionCollaborationDetail` | `collaboration_partners.detail_content` |

**4C vision story pages** (`/4cvision/*`) migrate to `vision_items` + `vision_item_blocks` (replaces `app/data/*Stories.ts`).

---

## 2. Target folder structure

```
gnarly-troop-react/
├── app/
│   ├── page.tsx                    # CMS flag → DynamicHome | StaticHome
│   ├── (admin)/admin/              # Admin panel (same Next app; split to apps/admin later)
│   ├── leadership/
│   └── collaboration/
├── components/
│   ├── cms/                        # SectionRenderer, DynamicHomePage
│   ├── pages/StaticHomePage.tsx    # Preserved static fallback
│   └── sections/                   # UNCHANGED UI components
├── packages/
│   ├── types/                      # @gnarly/types
│   └── lib/                        # @gnarly/lib — Supabase, services, loaders
├── supabase/
│   ├── migrations/                 # Schema + RLS + storage
│   └── seed.sql
├── lib/config.ts                   # Feature flags
└── middleware.ts                   # Admin auth session
```

**Future monorepo** (optional Phase 4):

```
apps/website/   ← move current app/
apps/admin/     ← dedicated admin Next app
packages/ui/    ← Shadcn components
packages/types/
packages/lib/
```

---

## 3. Database schema

See:

- `supabase/migrations/20260526100000_initial_schema.sql`
- `supabase/migrations/20260526100001_rls_policies.sql`
- `supabase/migrations/20260526100002_storage_buckets.sql`
- `supabase/seed.sql`

**Auth:** `profiles` extends `auth.users` → `roles` → `permissions` via `role_permissions`.

**CMS core:** `pages` + `page_sections` (sort, enable, JSONB content).

**Homepage entities:** Normalized tables per module (hero, welcome, timeline, vision, etc.).

**Events:** `events`, `event_registrations`, `brochure_download_leads`.

**Leadership:** `team_categories`, `team_members`, `team_member_articles`.

**Collaboration:** `collaboration_categories`, `collaboration_partners`, `collaboration_partner_gallery`.

---

## 4. Dynamic rendering strategy

1. **Server Components (default)** fetch via `@gnarly/lib` services.
2. **ISR:** `export const revalidate = 60` on public pages.
3. **Section pipeline:**
   - `getHomePage()` → ordered `page_sections`
   - `loadSectionData(section)` → typed props payload
   - `<SectionRenderer section data />` → existing React components
4. **Feature flag:** `NEXT_PUBLIC_CMS_ENABLED=false` keeps static site live during migration.

---

## 5. Admin panel architecture

| Module | Route | Stack |
|--------|-------|-------|
| Dashboard | `/admin` | Stats cards, TanStack Query |
| Pages | `/admin/pages` | Section reorder (dnd-kit), enable toggles |
| Events | `/admin/events` | CRUD + TanStack Table registrations + CSV export |
| Leadership | `/admin/leadership` | Categories + members CRUD |
| Collaboration | `/admin/collaboration` | Partners + gallery |
| Gallery | `/admin/gallery` | Multi-upload → Storage |
| Media | `/admin/media` | Folder tree + search |
| SEO | `/admin/seo` | Per-page meta form (Zod) |
| Users | `/admin/users` | Roles + invite via Supabase Auth |

**UI:** Shadcn UI + Tailwind (install via `npx shadcn@latest init` in Phase 2).

**Forms:** React Hook Form + Zod schemas in `packages/lib/src/schemas/`.

**Tables:** TanStack Table + server-side pagination.

**Mutations:** Server Actions in `app/(admin)/admin/actions/*.ts` using service role for admin writes.

---

## 6. Reusable CRUD pattern

```
admin/[module]/page.tsx          → list (TanStack Table)
admin/[module]/new/page.tsx      → create form
admin/[module]/[id]/page.tsx     → edit form

packages/lib/src/services/[module].service.ts   → getList, getById, create, update, delete
packages/lib/src/schemas/[module].schema.ts     → Zod
app/(admin)/admin/actions/[module].ts           → server actions
```

---

## 7. Media upload architecture

1. Admin uploads → Supabase Storage bucket (`team`, `gallery`, etc.).
2. Insert row in `media_library` with `bucket`, `storage_path`, metadata.
3. FK from content tables → `media_library.id`.
4. Public URLs via `getPublicMediaUrl()` in `@gnarly/lib`.

**Brochure gate:** `brochure_download_leads` insert → signed URL for `brochures` bucket.

---

## 8. Authentication & roles

1. Supabase Auth (email/password or OAuth).
2. On signup trigger → create `profiles` row.
3. `is_admin()` RLS helper checks `roles.slug`.
4. Middleware refreshes session on `/admin/*`.
5. Server actions verify `has_permission('events', 'write')` before mutations.

---

## 9. SEO architecture

- `seo_meta` per `pages` or polymorphic `entity_type` + `entity_id`.
- `generateMetadata()` in each `app/**/page.tsx` reads `seo_meta`.
- OG image via `media_library` FK.

---

## 10. State management

| Layer | Tool |
|-------|------|
| Server data | RSC + Server Actions |
| Client admin lists | TanStack Query |
| Forms | React Hook Form |
| URL state | `nuqs` (optional) |

No global Redux — keep server-first.

---

## 11. Implementation phases

### Phase 1 — Foundation (DONE in repo)
- [x] SQL schema, RLS, storage policies
- [x] `@gnarly/types`, `@gnarly/lib`
- [x] Section registry + `SectionRenderer`
- [x] Static/Dynamic home toggle
- [x] Admin shell routes

### Phase 2 — Admin CRUD (2–3 weeks)
- [ ] `npx shadcn@latest init`
- [ ] Auth login + role guard
- [ ] Media library upload UI
- [ ] Vision items CRUD (prove dynamic 4C)
- [ ] Events + registrations export

### Phase 3 — Data migration (1 week)
- [ ] Script: `scripts/migrate-static-to-supabase.ts`
- [ ] Import leadership from `src/data/leadershipData.ts`
- [ ] Import collaboration from `src/data/collaborationData.ts`
- [ ] Import minister cards, vision stories, partners

### Phase 4 — Wire all section adapters (2 weeks)
- [ ] Prop adapters in `components/cms/adapters/*.ts`
- [ ] Replace static `app/leadership` with DB services
- [ ] Replace static `app/collaboration` with DB services
- [ ] Header/Footer from `navigation_menus` + `site_settings`

### Phase 5 — Production (1 week)
- [ ] `supabase gen types` → replace hand-written types
- [ ] Enable `NEXT_PUBLIC_CMS_ENABLED=true`
- [ ] Monitoring, backup, CDN for Storage

---

## 12. Supabase setup commands

```bash
npm install
cp .env.example .env.local
npx supabase login
npx supabase link --project-ref YOUR_REF
npx supabase db push
psql $DATABASE_URL -f supabase/seed.sql
npx supabase gen types typescript --local > packages/types/src/supabase.generated.ts
```

---

## 13. Existing code preserved

- All `components/sections/*` CSS and markup stay as-is.
- `StaticHomePage` remains until CMS content is verified.
- MySQL/Razorpay/mail utilities remain for events/payments until ported.

---

## 14. Next actions for your team

1. Create Supabase project and run migrations.
2. Install npm dependencies (`npm install`).
3. Complete Shadcn admin UI per module.
4. Run migration script from static TS data files.
5. Flip `NEXT_PUBLIC_CMS_ENABLED=true` on staging only.

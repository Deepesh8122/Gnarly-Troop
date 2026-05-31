#!/usr/bin/env bash
# One-time split: monolith → apps/website + apps/admin
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ Creating app directories…"
mkdir -p apps/website apps/admin

# ── Website (public frontend) ──────────────────────────────────────────────
echo "→ Copying website app routes…"
mkdir -p apps/website/app
for item in page.tsx layout.tsx globals.css headers.module.css ministries.module.css about.module.css Breadcrumb.module.css; do
  [ -f "app/$item" ] && cp "app/$item" "apps/website/app/"
done
cp -R app/leadership app/collaboration app/4cvision app/data app/auth apps/website/app/
mkdir -p apps/website/app/api
cp -R app/api/navigation app/api/health app/api/brochure app/api/donations apps/website/app/api/

echo "→ Copying website components…"
cp -R components apps/website/
rm -rf apps/website/components/admin

echo "→ Copying website lib…"
mkdir -p apps/website/lib
cp -R lib/cms lib/4cvision lib/services lib/supabase apps/website/lib/
cp lib/config.ts lib/env.ts apps/website/lib/

echo "→ Copying src + public…"
cp -R src public apps/website/

# ── Admin (CMS backend) ──────────────────────────────────────────────────────
echo "→ Copying admin app routes…"
mkdir -p apps/admin/app
cp -R "app/(admin)/admin" apps/admin/app/admin
mkdir -p apps/admin/app/api
cp -R app/api/admin apps/admin/app/api/
cp -R app/auth apps/admin/app/

echo "→ Admin root layout…"
cat > apps/admin/app/layout.tsx << 'EOF'
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Gnarly Troop CMS",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
EOF

cp app/globals.css apps/admin/app/globals.css

echo "→ Copying admin components + lib…"
mkdir -p apps/admin/components
cp -R components/admin apps/admin/components/
mkdir -p apps/admin/lib
cp -R lib/admin apps/admin/lib/
cp lib/admin-api-guard.ts lib/deploy-security.ts lib/env.ts lib/team-categories.ts apps/admin/lib/
mkdir -p apps/admin/lib/utils
cp lib/utils/slug.ts apps/admin/lib/utils/ 2>/dev/null || true
cp -R lib/supabase apps/admin/lib/
mkdir -p apps/admin/src/data
cp src/data/leadershipData.ts src/data/collaborationData.ts apps/admin/src/data/ 2>/dev/null || true

echo "→ Copying shared config files…"
for f in postcss.config.mjs eslint.config.mjs; do
  cp "$f" apps/website/
  cp "$f" apps/admin/
done

echo "→ Done copying. Remove old monolith paths manually after verification."

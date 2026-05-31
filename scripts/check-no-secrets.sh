#!/usr/bin/env bash
# Quick scan before push — run: bash scripts/check-no-secrets.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FAIL=0

check_pattern() {
  local desc="$1"
  local pattern="$2"
  if git grep -nE "$pattern" -- ':!*.example' ':!docs/SECURITY.md' ':!scripts/check-no-secrets.sh' 2>/dev/null; then
    echo "FAIL: Possible $desc in tracked files (see above)"
    FAIL=1
  fi
}

echo "Checking for committed secrets..."

check_pattern "service_role JWT in source" 'SUPABASE_SERVICE_ROLE_KEY=eyJ[a-zA-Z0-9._-]{20,}'
check_pattern "PhonePe salt in source" 'PHONEPE_SALT_KEY=[^[:space:]]+'

if git ls-files --error-unmatch supabase/migrations 2>/dev/null | head -1 | grep -q .; then
  echo "WARN: supabase/migrations/ is still tracked by git. Run:"
  echo "  git rm -r --cached supabase/migrations supabase/seed.sql"
fi

if [ "$FAIL" -eq 0 ]; then
  echo "OK: No obvious secret patterns in tracked files."
else
  exit 1
fi

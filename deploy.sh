#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
# TestCEFR — Save & Deploy Script
# Usage: bash deploy.sh [commit message]
# This script:
#   1. Commits all changes to git (local backup)
#   2. Deploys to Vercel production (testcefr.com)
#   3. Pushes to GitHub (if credentials available)
# ═══════════════════════════════════════════════════════════

set -e
cd "$(dirname "$0")"

MSG="${1:-auto-save: $(date '+%Y-%m-%d %H:%M:%S')}"
VERCEL_TOKEN="${VERCEL_TOKEN:?Set VERCEL_TOKEN env var before running}"

echo "=== Step 1: Saving to local git ==="
git add -A
if git diff --cached --quiet; then
  echo "  No changes to commit"
else
  git commit -m "$MSG"
  echo "  Committed: $MSG"
fi

echo ""
echo "=== Step 2: Deploying to Vercel (production -> testcefr.com) ==="
npx vercel --token "$VERCEL_TOKEN" --prod --yes 2>&1 | tail -5
echo "  Deployed!"

echo ""
echo "=== Step 3: Pushing to GitHub ==="
git push origin main 2>&1 || echo "  [!] GitHub push failed. Code is safe locally & on Vercel."

echo ""
echo "=== Done! Changes saved and live at testcefr.com ==="

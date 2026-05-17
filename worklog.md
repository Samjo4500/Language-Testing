---
Task ID: 1
Agent: Main Agent
Task: Stabilize the CEFR test platform - fix login errors, test page screen changes, and routing issues

Work Log:
- Audited entire codebase structure and identified all routes, components, and auth flow
- Identified root causes: 15-minute token expiry causing frequent logouts, auth state flickering during refresh, test page redirecting on auth flicker, no beforeunload warning during tests
- Extended JWT access token expiry from 15m to 24h, refresh token from 7d to 30d
- Rewrote auth-store.ts: added isRefreshing state, prevent logout on network errors, only logout on explicit 401
- Rewrote auth-provider.tsx: hydrate from localStorage immediately to prevent UI flicker, then validate in background
- Fixed test page: replaced redirect-to-login with sign-in prompt UI, added beforeunload warning during active test
- Fixed login page: prevent premature redirect during hydration
- Added mounted guard to listening/speaking/writing/quick-tour pages to prevent auth state flickering
- Added (main)/layout.tsx for proper route group support
- Verified build succeeds, all routes return 200, login API works

Stage Summary:
- All key routes verified working: /, /dashboard/, /login/, /test/, /admin/ all return 200
- Login API returns tokens correctly with admin@testcefr.com / Admin@2026!
- Pushed commit 5bae336 to origin/main (Vercel deployment)
- 10 files changed across auth, pages, and components

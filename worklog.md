---
Task ID: 1
Agent: Main
Task: Phase 1 Question Rotation System Implementation

Work Log:
- Verified Prisma schema already includes all new models (Organization, OrganizationMember, ReadingPassage, ReadingQuestion, ListeningItem, ListeningQuestion, SpeakingPrompt, WritingPrompt, SeenQuestion)
- Pushed schema to Neon PostgreSQL - already in sync
- Verified question-selection.ts algorithm already implemented (Fisher-Yates shuffle, blended A2-C1 bell curve, anti-repeat, adaptive difficulty)
- Verified start/route.ts and submit/route.ts already use DB-driven questions with server-side verification
- Created comprehensive seed script (prisma/seed.ts) with:
  - 16 reading passages (4 per level: A2, B1, B2, C1) with 2 questions each
  - 12 listening items (3 per level: A2, B1, B2, C1) with 2 questions each
  - 20 speaking prompts (5 per level: A2, B1, B2, C1)
  - 16 writing prompts (4 per level: A2, B1, B2, C1)
- Successfully seeded database - now has: 1482 MCQs, 22 reading passages, 18 listening items, 26 speaking prompts, 22 writing prompts
- Enhanced questionSet serialization to include sub-question IDs for reading/listening (backward compatible)
- Created GET /api/assessments/[id]/questions endpoint for resuming in-progress assessments
- Fixed resume assessment flow in test/page.tsx (was broken - user couldn't get questions back after refresh)
- Updated submit route to handle both old and new serialization formats
- Build succeeded, deployed to Vercel via GitHub push

Stage Summary:
- Phase 1 Question Rotation System is LIVE
- All 6 question types are now DB-driven with random selection
- Anti-repeat tracking via SeenQuestion model is active
- Adaptive difficulty adjustment based on prior performance
- Resume flow fixed - users can now continue in-progress assessments
- Question bank sufficiently populated for rotation variety
- correctIndex properly stripped from all client responses

---
Task ID: 2
Agent: Main
Task: Add GA4 + PostHog analytics, server-side purchase tracking, and Search Console optimization

Work Log:
- Created `/src/lib/analytics.ts` — central analytics utility with typed GA4 + PostHog event helpers
- Created `/src/components/analytics-provider.tsx` — loads GA4 gtag.js and PostHog via next/script (afterInteractive)
- Added AnalyticsProvider to root layout (`/src/app/layout.tsx`) wrapping AuthProvider's children
- Installed `posthog-js` package
- Added 9 custom events across 5 pages:
  - `test_start` → `/test/page.tsx` on first skill start
  - `test_complete` → `/test/page.tsx` on assessment submission
  - `test_abandon` → `/test/page.tsx` on beforeunload via sendBeacon (with step, skills_completed)
  - `purchase` → `/pricing/page.tsx` on PayPal onApprove (client-side) + `/api/payments/capture` (server-side Measurement Protocol)
  - `speaking_demo_start` → `/page.tsx` LiveVoiceDemo mic click (with mic_permission param)
  - `speaking_demo_complete` → `/page.tsx` LiveVoiceDemo stop recording
  - `pricing_view` → `/page.tsx` IntersectionObserver on pricing section
  - `certificate_download` → `/certificate/[verificationId]/page.tsx` download click
  - `account_create` → `/register/page.tsx` on successful registration
- Added server-side GA4 Measurement Protocol in PayPal capture route (bypasses ad-blockers)
- Updated sitemap.ts with /login and /faq pages
- Updated .env.example with NEXT_PUBLIC_GA_MEASUREMENT_ID, GA_API_SECRET, NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST
- Built and deployed successfully via GitHub push → Vercel auto-deploy

Stage Summary:
- All analytics are graceful no-ops when env vars are empty (safe for dev/staging)
- PostHog auto-identifies users on login via AuthProvider integration
- Server-side purchase tracking ensures revenue data accuracy even with ad-blockers
- Sitemap now includes all public pages for Search Console
- User needs to: (1) Create GA4 property, (2) Create PostHog project, (3) Add env vars to Vercel, (4) Verify Search Console ownership

---
Task ID: 3
Agent: Main
Task: Add Analytics & Integrations tab to admin dashboard

Work Log:
- Added new tab 'analytics-integrations' to TABS array with Globe icon
- Added lucide imports: MousePointerClick, LineChart, SearchIcon, LayoutDashboard, CheckSquare, Square, Settings2, Circle
- Built 4 integration status cards: GA4, Search Console, PostHog, Looker Studio
- Each card shows: icon, name, description, connection status badge, key config values, and quick-launch button
- Added "Tracked Events Reference" table with all 9 custom events and their triggers/parameters
- Added "Setup Checklist" with 10 items, auto-checked based on process.env values
- Added "Environment Variables" reference showing which vars are set vs missing
- Build and deploy successful

Stage Summary:
- Admin dashboard now has an Analytics tab at /admin (last tab)
- Cards dynamically show Connected/Not Set based on Vercel env vars
- All external service links open in new tabs
- When user adds GA4/PostHog keys to Vercel env vars and redeploys, the cards will auto-update to show Connected

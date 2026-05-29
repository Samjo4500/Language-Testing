---
Task ID: 1-6
Agent: Main
Task: Fix "Most Popular" badge positioning on all pricing displays

Work Log:
- Identified root cause: `.glass-card` CSS class has `overflow: hidden` (globals.css line 160) which clips absolutely-positioned badges
- Badge was inside the `glass-card` div and got cut off by the rounded corners + overflow hidden
- Fix: Moved badge OUTSIDE the `glass-card` div to the parent wrapper (which doesn't have overflow:hidden)
- Changed z-index from z-10 to z-20 for proper layering
- Increased padding from py-1 to py-1.5 for better visibility
- Added Star icon to homepage badges for consistency
- Added Star import to admin system-tab.tsx

Files modified:
- src/app/(main)/pricing/page.tsx — Premium Pack + Intermediate Course badges
- src/app/page.tsx — Individual plans + Org plans badges (2 locations)
- src/app/(main)/courses/page.tsx — Course card badge
- src/components/admin/tabs/system-tab.tsx — Admin pricing preview badge

Stage Summary:
- All 6 "Most Popular" badge instances fixed across 4 files
- Badges now fully visible in upper right corner of pricing cards
- Consistent styling with Star icon and gradient pill

---
Task ID: 8-15
Agent: Main
Task: Implement Lexi AI Concierge feature (3 components + integration)

Work Log:
- Copied lexi-avatar.png from upload/ to public/
- Created src/components/lexi/LexiConcierge.tsx (~500 lines) — Main floating concierge with:
  - Voice engine using Web Speech API (free, no API keys)
  - Discovery flow (3-step questionnaire: Ready? → Goal? → Level?)
  - Smart routing with 12 personalized recommendation messages
  - Pricing advisor (3-question flow → plan recommendation)
  - Idle menu with 6 quick-action options
  - Breathing animation on minimized avatar pill
  - Mute/unmute, minimize, close controls
  - First-visit auto-appear (3 second delay, localStorage tracked)
- Created src/components/lexi/RegistrationGuide.tsx (~300 lines) — 5 stages:
  - pre-register: Info banner above form warning about email activation
  - post-register: Full-screen celebration modal with 3 steps + confetti
  - verify-success: Success modal with CTAs
  - verify-expired: Expired link modal with resend button
  - verify-pending: Warning banner on login page for unactivated users
- Created src/components/lexi/CommunityTour.tsx (~300 lines) — 7-step guided tour:
  - Welcome, Partners, Chatroom, SpeakSpace, Moments, Study Groups, Wrap-up
  - Spotlight overlay, progress dots, voice narration
  - First-visit auto-trigger (2 second delay, localStorage tracked)
- Created src/app/api/auth/resend-activation/route.ts — API endpoint for resending activation emails
- Integrated LexiConcierge into homepage (app/page.tsx)
- Integrated RegistrationGuide into register page (pre-register + post-register stages)
- Integrated RegistrationGuide into login page (verify-pending stage with auto-detection)
- Integrated CommunityTour into community page
- Build successful with no errors

Stage Summary:
- 3 new Lexi components created in src/components/lexi/
- 1 new API endpoint created (resend-activation)
- 4 pages modified for integration (homepage, register, login, community)
- All voice features use free browser Web Speech API (no costs)
- Avatar image placed at /public/lexi-avatar.png

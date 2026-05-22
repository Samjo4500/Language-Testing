---
Task ID: 1
Agent: Main Agent
Task: Debug and fix TTS (text-to-speech) robotic voice issue on testcefr.com

Work Log:
- Investigated the TTS route code (src/app/api/tts/route.ts)
- Tested Gemini TTS API directly: "User location is not supported" error from dev machine
- Tested Cloud TTS API: "API_KEY_SERVICE_BLOCKED" error (API not enabled in Google Cloud Console)
- Discovered z-ai-web-dev-sdk has audio.tts.create() with "kazi" voice (only works from internal network)
- Tested z-ai TTS: works locally at 48kHz PCM, converted to WAV successfully
- Key finding: Gemini TTS API works from Vercel's servers (just not from this dev machine)
- Rewrote TTS route with robust multi-provider support:
  - Primary: Gemini TTS (gemini-2.5-flash-preview-tts with "Kore" voice, female professional American)
  - Secondary: Cloud TTS (Neural2-F voice, needs API enabled)
  - Tertiary: z-ai TTS (for dev environments, requires ZAI_BASE_URL env var)
- Fixed PCM-to-WAV conversion: z-ai uses 48kHz, Gemini uses 24kHz
- Added GET /api/tts debug endpoint for provider availability checks
- Removed browser speechSynthesis fallback (was causing robotic voice)
- Added X-TTS-Provider response header for debugging
- Added detailed console logging for TTS provider selection and errors
- Updated client-side code with better error handling and logging
- Verified production deployment: Gemini TTS returns valid WAV audio (24kHz, 16-bit, mono)
- Production endpoint confirmed working: X-TTS-Provider: gemini-tts

Stage Summary:
- TTS is now working on production with Gemini "Kore" voice (female, professional, American accent)
- Previous "robotic" sound was caused by browser speechSynthesis fallback when server-side TTS failed
- Gemini TTS API works from Vercel's servers (tested and confirmed)
- If Gemini TTS fails in future, Cloud TTS can be enabled at: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
- For local development, set ZAI_BASE_URL env var to use z-ai TTS provider
---
Task ID: 1
Agent: Main Agent
Task: Fix TTS so listening comprehension uses natural female American voice instead of robotic browser TTS

Work Log:
- Read current TTS route code (`src/app/api/tts/route.ts`) and test page (`src/app/test/page.tsx`)
- Tested Gemini TTS API directly → discovered "User location is not supported for the API use" (geo-restricted from dev server)
- Tested Google Cloud TTS API → blocked with AI API key (requires separate Cloud Console API key)
- Discovered z-ai-web-dev-sdk has `audio.tts.create()` method that works on this dev server
- Tested z-ai SDK TTS → works perfectly, returns PCM at 48kHz, 16-bit, mono
- Key insight: z-ai SDK reads config from `/etc/.z-ai-config` which has an internal IP (`172.25.136.193:8080`) — NOT accessible from Vercel
- Verified Gemini TTS DOES work on Vercel production (tested via curl to testcefr.com) → returns valid WAV audio from "Kore" voice
- Fixed client-side fetch URL: `/api/tts` → `/api/tts/` to prevent 308 redirect that could lose POST body
- Restructured TTS provider priority:
  1. Gemini TTS (primary on Vercel US servers — "Kore" voice, female, American, professional)
  2. z-ai SDK TTS (secondary — works on dev with .z-ai-config)
  3. z-ai HTTP TTS (tertiary fallback — requires ZAI_BASE_URL env var)
- Added build script to generate `.z-ai-config` from env vars (`ZAI_BASE_URL`, `ZAI_API_KEY`, `ZAI_TOKEN`)
- Added dynamic import of z-ai SDK to prevent build failures when config is missing
- Deployed to production via GitHub → Vercel

Stage Summary:
- **Root cause**: Gemini TTS was listed first but was geo-restricted from some regions. The previous code also had the client calling `/api/tts` without trailing slash, causing a 308 redirect on `trailingSlash: true` config.
- **Fix**: Gemini TTS works on Vercel's US servers. Added trailing slash to client fetch. Dynamic import of z-ai SDK for dev environments.
- **Production verification**: Gemini TTS returns valid WAV audio (16-bit, mono, 24kHz) from "Kore" voice. Tested with both short and long passages.
- **Files modified**: `src/app/api/tts/route.ts`, `src/app/test/page.tsx`, `package.json`

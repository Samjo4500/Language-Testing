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

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';

// ── Rate limiting (per-user, in-memory) ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 TTS requests per minute per user

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ── In-memory cache for generated audio (keyed by text) ──
const audioCache = new Map<string, { base64Data: string; mimeType: string; timestamp: number }>();
const CACHE_MAX_AGE = 30 * 60 * 1000; // 30 minutes
const CACHE_MAX_SIZE = 200;

function cleanCache() {
  const now = Date.now();
  for (const [key, value] of audioCache) {
    if (now - value.timestamp > CACHE_MAX_AGE) audioCache.delete(key);
  }
  if (audioCache.size > CACHE_MAX_SIZE) {
    const entries = [...audioCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (const [key] of entries.slice(0, audioCache.size - CACHE_MAX_SIZE)) {
      audioCache.delete(key);
    }
  }
}

/**
 * Helper: create audio response from base64 data
 */
function audioResponse(base64Data: string, mimeType: string, cacheStatus: string, provider?: string): Response {
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const headers: Record<string, string> = {
    'Content-Type': mimeType,
    'Content-Length': bytes.length.toString(),
    'Cache-Control': 'private, max-age=1800',
    'X-Cache': cacheStatus,
  };
  if (provider) headers['X-TTS-Provider'] = provider;

  return new Response(bytes, { status: 200, headers });
}

/**
 * Convert raw PCM audio to WAV format.
 * @param pcmData Raw PCM samples (16-bit signed little-endian)
 * @param sampleRate Sample rate in Hz
 * @param numChannels Number of audio channels
 * @param bitsPerSample Bits per sample (16 for standard PCM)
 */
function pcmToWav(pcmData: Uint8Array, sampleRate: number = 24000, numChannels: number = 1, bitsPerSample: number = 16): Uint8Array {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const headerSize = 44;
  const wav = new Uint8Array(headerSize + dataSize);
  const view = new DataView(wav.buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) wav[offset + i] = str.charCodeAt(i);
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);
  wav.set(pcmData, 44);

  return wav;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// ══════════════════════════════════════════════════════════
// TTS PROVIDERS
// ══════════════════════════════════════════════════════════

/**
 * PROVIDER 1: Gemini TTS via Google AI API
 * Uses "Kore" voice — female, professional, American accent
 * Returns PCM audio at 24kHz, 16-bit, mono
 *
 * This is the PRIMARY provider for Vercel production (US servers).
 * Note: Gemini TTS is geo-restricted and may fail in some regions,
 * but works on Vercel's US-based servers where the Google AI API is available.
 */
async function generateWithGeminiTTS(apiKey: string, inputText: string): Promise<{ base64Data: string; mimeType: string }> {
  const prompt = `Read the following text aloud in a clear, professional, natural American English female voice. Speak SLOWLY and DELIBERATELY, at about 85% of normal conversational speed, as if you are narrating an important audio guide for non-native English speakers. Enunciate every word clearly. Do not add any commentary, just read the text exactly as written:\n\n${inputText}`;

  const requestBody = {
    contents: [{
      parts: [{ text: prompt }],
    }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  };

  // Try multiple Gemini TTS model endpoints
  const models = [
    'gemini-2.5-flash-preview-tts',
    'gemini-2.5-pro-preview-tts',
  ];

  let lastError: string = '';

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = `Model ${model}: ${response.status} - ${errText.slice(0, 200)}`;
        console.warn(`[TTS] Gemini model "${model}" failed:`, response.status, errText.slice(0, 150));
        continue; // Try next model
      }

      const data = await response.json();
      const audioPart = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;

      if (!audioPart?.data) {
        // Check if the response contains text instead of audio
        const textPart = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textPart) {
          lastError = `Model ${model}: returned text instead of audio.`;
          console.warn(`[TTS] Gemini model "${model}" returned text instead of audio`);
          continue;
        }
        lastError = `Model ${model}: No audio data in response`;
        continue;
      }

      const geminiMime = (audioPart.mimeType as string) || 'audio/L16;codec=pcm;rate=24000';
      const base64Audio = audioPart.data as string;

      // Convert PCM to WAV for browser compatibility
      if (geminiMime.includes('pcm') || geminiMime.includes('L16')) {
        const sampleRate = 24000;
        const pcmBinary = atob(base64Audio);
        const pcmBytes = new Uint8Array(pcmBinary.length);
        for (let i = 0; i < pcmBinary.length; i++) pcmBytes[i] = pcmBinary.charCodeAt(i);
        const wavBytes = pcmToWav(pcmBytes, sampleRate, 1, 16);
        console.log(`[TTS] Gemini TTS success: ${wavBytes.length} bytes WAV audio`);
        return { base64Data: toBase64(wavBytes), mimeType: 'audio/wav' };
      }

      // If not PCM, return as-is (e.g., MP3)
      console.log(`[TTS] Gemini TTS success: ${base64Audio.length} bytes ${geminiMime} audio`);
      return { base64Data: base64Audio, mimeType: geminiMime };
    } catch (err) {
      lastError = `Model ${model}: ${err instanceof Error ? err.message : String(err)}`;
      console.warn(`[TTS] Gemini model "${model}" error:`, lastError.slice(0, 150));
    }
  }

  throw new Error(`All Gemini TTS models failed. ${lastError}`);
}

/**
 * PROVIDER 2: z-ai-web-dev-sdk TTS
 * Uses "kazi" voice with tts-1-hd model — natural, female, American accent
 * Returns PCM audio at 48kHz, 16-bit, mono via the z-ai SDK
 *
 * This works in development environments where the .z-ai-config file exists.
 * On Vercel, this may fail if the config file is not available or the
 * API endpoint is on a private network.
 */
async function generateWithZaiSDK(inputText: string): Promise<{ base64Data: string; mimeType: string }> {
  // Dynamic import to handle cases where the SDK config is not available
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  const zai = await ZAI.create();

  const response = await zai.audio.tts.create({
    input: inputText,
    voice: 'kazi',
    model: 'tts-1-hd',
    speed: 0.9,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`z-ai SDK TTS error ${response.status}: ${errText.slice(0, 300)}`);
  }

  // z-ai SDK returns a standard Response object
  // The audio is PCM at 48kHz, 16-bit, mono
  const arrayBuffer = await response.arrayBuffer();
  const pcmBytes = new Uint8Array(arrayBuffer);

  if (pcmBytes.length === 0) {
    throw new Error('z-ai SDK TTS returned empty audio data');
  }

  // Convert PCM to WAV for browser compatibility
  const sampleRate = 48000;
  const wavBytes = pcmToWav(pcmBytes, sampleRate, 1, 16);
  console.log(`[TTS] z-ai SDK TTS success: ${wavBytes.length} bytes WAV audio`);

  return { base64Data: toBase64(wavBytes), mimeType: 'audio/wav' };
}

/**
 * PROVIDER 3: z-ai TTS via direct HTTP API
 * Same as Provider 2 but uses raw fetch — useful if SDK init fails
 * Requires ZAI_BASE_URL and ZAI_API_KEY environment variables
 */
async function generateWithZaiHTTP(inputText: string): Promise<{ base64Data: string; mimeType: string }> {
  const baseUrl = process.env.ZAI_BASE_URL;
  const apiKey = process.env.ZAI_API_KEY;
  if (!apiKey) {
    throw new Error('ZAI_API_KEY is not configured');
  }
  const token = process.env.ZAI_TOKEN;

  if (!baseUrl) {
    throw new Error('ZAI_BASE_URL is not configured');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'X-Z-AI-From': 'Z',
  };
  if (token) headers['X-Token'] = token;

  const response = await fetch(`${baseUrl}/audio/tts`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      input: inputText,
      voice: 'kazi',
      model: 'tts-1-hd',
      speed: 0.9,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`z-ai HTTP TTS error ${response.status}: ${errText.slice(0, 300)}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const pcmBytes = new Uint8Array(arrayBuffer);

  if (pcmBytes.length === 0) {
    throw new Error('z-ai HTTP TTS returned empty audio data');
  }

  const sampleRate = 48000;
  const wavBytes = pcmToWav(pcmBytes, sampleRate, 1, 16);
  console.log(`[TTS] z-ai HTTP TTS success: ${wavBytes.length} bytes WAV audio`);

  return { base64Data: toBase64(wavBytes), mimeType: 'audio/wav' };
}

// ══════════════════════════════════════════════════════════
// MAIN ROUTE HANDLER
// ══════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  try {
    // ── Auth check: require logged-in user ──
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to use text-to-speech.' },
        { status: 401 }
      );
    }

    // ── Rate limit: 20 requests per minute per user ──
    if (!checkRateLimit(user.userId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many TTS requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const { text } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const inputText = text.trim().slice(0, 2000);

    // Check cache
    const cacheKey = inputText;
    const cached = audioCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_MAX_AGE) {
      return audioResponse(cached.base64Data, cached.mimeType, 'HIT');
    }

    const googleApiKey = process.env.GOOGLE_AI_API_KEY;
    const zaiBaseUrl = process.env.ZAI_BASE_URL;

    let result: { base64Data: string; mimeType: string } | null = null;
    let usedProvider: string = 'none';
    const errors: string[] = [];

    // Build provider list in priority order:
    //
    // On Vercel (production): Gemini TTS is primary (works on US servers)
    // On local dev: z-ai SDK TTS is primary (works with .z-ai-config)
    //
    // 1. Gemini TTS — primary on Vercel, female "Kore" voice
    // 2. z-ai SDK TTS — primary on dev, natural "kazi" voice
    // 3. z-ai HTTP TTS — fallback if SDK fails but env vars are set
    const providers: Array<{ name: string; fn: () => Promise<{ base64Data: string; mimeType: string }> }> = [];

    if (googleApiKey) {
      providers.push({
        name: 'gemini-tts',
        fn: () => generateWithGeminiTTS(googleApiKey, inputText),
      });
    }

    providers.push({
      name: 'zai-sdk-tts',
      fn: () => generateWithZaiSDK(inputText),
    });

    if (zaiBaseUrl) {
      providers.push({
        name: 'zai-http-tts',
        fn: () => generateWithZaiHTTP(inputText),
      });
    }

    // Try providers in order
    for (const provider of providers) {
      try {
        console.log(`[TTS] Trying provider: ${provider.name}`);
        result = await provider.fn();
        usedProvider = provider.name;
        console.log(`[TTS] Success with provider: ${provider.name}`);
        break;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        errors.push(`${provider.name}: ${errMsg.slice(0, 150)}`);
        console.warn(`[TTS] Provider "${provider.name}" failed:`, errMsg.slice(0, 200));
        // Try next provider
      }
    }

    if (!result) {
      console.error('[TTS] All providers failed:', errors);
      return NextResponse.json(
        {
          error: 'All TTS providers failed',
          details: errors,
        },
        { status: 502 }
      );
    }

    // Cache the result
    cleanCache();
    audioCache.set(cacheKey, { ...result, timestamp: Date.now() });

    return audioResponse(result.base64Data, result.mimeType, 'MISS', usedProvider);
  } catch (error) {
    console.error('[TTS] API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate speech' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tts — Generate audio via query parameter OR check TTS provider availability
 *
 * When called with ?text=... query parameter, generates TTS audio and returns WAV.
 * This is the preferred method for browser <audio> elements because:
 * - The browser automatically sends HttpOnly cookies (no fetch credentials issue)
 * - Works with native audio element (better autoplay policy handling)
 * - No CORS or content-type issues with fetch
 *
 * Without ?text parameter, returns provider availability debug info.
 */
export async function GET(req: NextRequest) {
  const textParam = req.nextUrl.searchParams.get('text');

  // If text parameter is provided, generate TTS audio
  if (textParam && textParam.trim()) {
    try {
      // Auth check
      const user = getAuthUser(req);
      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'You must be logged in to use text-to-speech.' },
          { status: 401 }
        );
      }

      // Rate limit
      if (!checkRateLimit(user.userId)) {
        return NextResponse.json(
          { error: 'Rate limit exceeded', message: 'Too many TTS requests. Please wait a moment and try again.' },
          { status: 429 }
        );
      }

      const inputText = textParam.trim().slice(0, 2000);

      // Check cache
      const cacheKey = inputText;
      const cached = audioCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_MAX_AGE) {
        return audioResponse(cached.base64Data, cached.mimeType, 'HIT');
      }

      const googleApiKey = process.env.GOOGLE_AI_API_KEY;
      const zaiBaseUrl = process.env.ZAI_BASE_URL;

      let result: { base64Data: string; mimeType: string } | null = null;
      let usedProvider: string = 'none';
      const errors: string[] = [];

      const providers: Array<{ name: string; fn: () => Promise<{ base64Data: string; mimeType: string }> }> = [];

      if (googleApiKey) {
        providers.push({
          name: 'gemini-tts',
          fn: () => generateWithGeminiTTS(googleApiKey, inputText),
        });
      }

      providers.push({
        name: 'zai-sdk-tts',
        fn: () => generateWithZaiSDK(inputText),
      });

      if (zaiBaseUrl) {
        providers.push({
          name: 'zai-http-tts',
          fn: () => generateWithZaiHTTP(inputText),
        });
      }

      for (const provider of providers) {
        try {
          console.log(`[TTS GET] Trying provider: ${provider.name}`);
          result = await provider.fn();
          usedProvider = provider.name;
          console.log(`[TTS GET] Success with provider: ${provider.name}`);
          break;
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          errors.push(`${provider.name}: ${errMsg.slice(0, 150)}`);
          console.warn(`[TTS GET] Provider "${provider.name}" failed:`, errMsg.slice(0, 200));
        }
      }

      if (!result) {
        console.error('[TTS GET] All providers failed:', errors);
        return NextResponse.json(
          { error: 'All TTS providers failed', details: errors },
          { status: 502 }
        );
      }

      // Cache the result
      cleanCache();
      audioCache.set(cacheKey, { ...result, timestamp: Date.now() });

      return audioResponse(result.base64Data, result.mimeType, 'MISS', usedProvider);
    } catch (error) {
      console.error('[TTS GET] API Error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to generate speech' },
        { status: 500 }
      );
    }
  }

  // No text parameter — return debug info
  const googleApiKey = process.env.GOOGLE_AI_API_KEY;
  const zaiBaseUrl = process.env.ZAI_BASE_URL;

  const providers: Array<{ name: string; available: boolean; reason?: string }> = [];

  if (googleApiKey) {
    providers.push({ name: 'gemini-tts', available: true, reason: 'Primary on Vercel — may be geo-restricted in some regions' });
  } else {
    providers.push({ name: 'gemini-tts', available: false, reason: 'GOOGLE_AI_API_KEY not set' });
  }

  providers.push({ name: 'zai-sdk-tts', available: true, reason: 'Requires .z-ai-config file — may not work on Vercel' });

  if (zaiBaseUrl) {
    providers.push({ name: 'zai-http-tts', available: true });
  } else {
    providers.push({ name: 'zai-http-tts', available: false, reason: 'ZAI_BASE_URL not set' });
  }

  // Test z-ai SDK availability
  let zaiSdkStatus = 'not_tested';
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();
    zaiSdkStatus = 'config_found';
  } catch (e) {
    zaiSdkStatus = `no_config: ${e instanceof Error ? e.message.slice(0, 100) : String(e)}`;
  }

  const cacheStats = {
    size: audioCache.size,
    maxSize: CACHE_MAX_SIZE,
    maxAge: CACHE_MAX_AGE,
  };

  return NextResponse.json({
    status: 'ok',
    providers,
    zaiSdkStatus,
    cache: cacheStats,
    hasWorkingProvider: providers.some(p => p.available),
  });
}

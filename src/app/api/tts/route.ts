import { NextRequest, NextResponse } from 'next/server';

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
 * Tries multiple model names in case one is deprecated:
 * - gemini-2.5-flash-preview-tts
 * - gemini-2.5-pro-preview-tts
 */
async function generateWithGeminiTTS(apiKey: string, inputText: string): Promise<{ base64Data: string; mimeType: string }> {
  const prompt = `Read the following text aloud in a clear, professional, natural American English female voice. Speak at a moderate pace as if you are a professional narrator. Do not add any commentary, just read the text exactly as written:\n\n${inputText}`;

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
        // Check if the response contains text instead of audio (model might not support audio)
        const textPart = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textPart) {
          lastError = `Model ${model}: returned text instead of audio. The model may not support TTS output.`;
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
        // Gemini TTS outputs PCM at 24kHz, 16-bit, mono
        const sampleRate = 24000;
        const pcmBinary = atob(base64Audio);
        const pcmBytes = new Uint8Array(pcmBinary.length);
        for (let i = 0; i < pcmBinary.length; i++) pcmBytes[i] = pcmBinary.charCodeAt(i);
        const wavBytes = pcmToWav(pcmBytes, sampleRate, 1, 16);
        return { base64Data: toBase64(wavBytes), mimeType: 'audio/wav' };
      }

      // If not PCM, return as-is (e.g., MP3)
      return { base64Data: base64Audio, mimeType: geminiMime };
    } catch (err) {
      lastError = `Model ${model}: ${err instanceof Error ? err.message : String(err)}`;
      console.warn(`[TTS] Gemini model "${model}" error:`, lastError.slice(0, 150));
    }
  }

  throw new Error(`All Gemini TTS models failed. ${lastError}`);
}

/**
 * PROVIDER 2: Google Cloud Text-to-Speech API
 * Uses Neural2-F voice (female, professional, American accent)
 * Requires Cloud TTS API to be enabled in Google Cloud Console
 */
async function generateWithCloudTTS(apiKey: string, inputText: string): Promise<{ base64Data: string; mimeType: string }> {
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: inputText },
        voice: {
          languageCode: 'en-US',
          name: 'en-US-Neural2-F',
          ssmlGender: 'FEMALE',
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.95,
          pitch: 0,
          effectsProfileId: ['headphone-class'],
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cloud TTS error ${response.status}: ${errText.slice(0, 300)}`);
  }

  const data = await response.json();
  if (!data.audioContent) {
    throw new Error('No audio content in Cloud TTS response');
  }

  return { base64Data: data.audioContent as string, mimeType: 'audio/mpeg' };
}

/**
 * PROVIDER 3: z-ai-web-dev-sdk TTS API
 * Uses "kazi" voice with tts-1-hd model for highest quality
 * Returns PCM audio at 48kHz, 16-bit, mono
 * Requires ZAI_BASE_URL and ZAI_API_KEY environment variables
 */
async function generateWithZaiTTS(inputText: string): Promise<{ base64Data: string; mimeType: string }> {
  const baseUrl = process.env.ZAI_BASE_URL;
  const apiKey = process.env.ZAI_API_KEY || 'Z.ai';
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
    throw new Error(`z-ai TTS error ${response.status}: ${errText.slice(0, 300)}`);
  }

  // z-ai TTS returns raw PCM audio (48kHz, 16-bit, mono)
  const arrayBuffer = await response.arrayBuffer();
  const pcmBytes = new Uint8Array(arrayBuffer);

  const sampleRate = 48000;
  const wavBytes = pcmToWav(pcmBytes, sampleRate, 1, 16);

  return { base64Data: toBase64(wavBytes), mimeType: 'audio/wav' };
}

// ══════════════════════════════════════════════════════════
// MAIN ROUTE HANDLER
// ══════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  try {
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

    // Build provider list in priority order
    // 1. Gemini TTS (works from Vercel if API is accessible)
    // 2. Cloud TTS (requires API to be enabled in Google Cloud Console)
    // 3. z-ai SDK TTS (for dev/internal environments with ZAI_BASE_URL)
    const providers: Array<{ name: string; fn: () => Promise<{ base64Data: string; mimeType: string }> }> = [];

    if (googleApiKey) {
      providers.push({
        name: 'gemini-tts',
        fn: () => generateWithGeminiTTS(googleApiKey, inputText),
      });
      providers.push({
        name: 'cloud-tts',
        fn: () => generateWithCloudTTS(googleApiKey, inputText),
      });
    }

    if (zaiBaseUrl) {
      providers.push({
        name: 'zai-tts',
        fn: () => generateWithZaiTTS(inputText),
      });
    }

    if (providers.length === 0) {
      return NextResponse.json(
        { error: 'No TTS provider is configured. Set GOOGLE_AI_API_KEY or ZAI_BASE_URL environment variable.' },
        { status: 503 }
      );
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
          hint: googleApiKey
            ? 'If Gemini TTS shows "location not supported", enable Cloud TTS API at: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com'
            : 'Set GOOGLE_AI_API_KEY or ZAI_BASE_URL environment variable',
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
 * GET /api/tts — Debug endpoint to check TTS provider availability
 */
export async function GET() {
  const googleApiKey = process.env.GOOGLE_AI_API_KEY;
  const zaiBaseUrl = process.env.ZAI_BASE_URL;

  const providers: Array<{ name: string; available: boolean; reason?: string }> = [];

  if (googleApiKey) {
    providers.push({ name: 'gemini-tts', available: true });
    providers.push({ name: 'cloud-tts', available: true, reason: 'Requires Cloud TTS API to be enabled in Google Cloud Console' });
  } else {
    providers.push({ name: 'gemini-tts', available: false, reason: 'GOOGLE_AI_API_KEY not set' });
    providers.push({ name: 'cloud-tts', available: false, reason: 'GOOGLE_AI_API_KEY not set' });
  }

  if (zaiBaseUrl) {
    providers.push({ name: 'zai-tts', available: true });
  } else {
    providers.push({ name: 'zai-tts', available: false, reason: 'ZAI_BASE_URL not set' });
  }

  const cacheStats = {
    size: audioCache.size,
    maxSize: CACHE_MAX_SIZE,
    maxAge: CACHE_MAX_AGE,
  };

  return NextResponse.json({
    status: 'ok',
    providers,
    cache: cacheStats,
    hasWorkingProvider: providers.some(p => p.available),
  });
}

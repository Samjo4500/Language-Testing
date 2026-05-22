import { NextRequest, NextResponse } from 'next/server';

// In-memory cache for generated audio (keyed by text)
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
 * Gemini TTS returns PCM at 24kHz, 16-bit, mono.
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
  view.setUint16(20, 1, true);
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

/**
 * OPTION 1: Google Cloud Text-to-Speech API
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
 * OPTION 2: Gemini TTS with Kore voice (female, professional, American accent)
 * May have regional restrictions
 */
async function generateWithGeminiTTS(apiKey: string, inputText: string): Promise<{ base64Data: string; mimeType: string }> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Read the following text aloud in a clear, professional, natural American English female voice. Speak at a moderate pace as if you are a professional narrator. Do not add any commentary, just read the text exactly as written:\n\n${inputText}`,
          }],
        }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini TTS error ${response.status}: ${errText.slice(0, 300)}`);
  }

  const data = await response.json();
  const audioPart = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;

  if (!audioPart?.data) {
    throw new Error('No audio data in Gemini response');
  }

  const geminiMime = (audioPart.mimeType as string) || 'audio/L16;codec=pcm;rate=24000';
  const base64Audio = audioPart.data as string;

  // Convert PCM to WAV for browser compatibility
  if (geminiMime.includes('pcm') || geminiMime.includes('L16')) {
    const pcmBinary = atob(base64Audio);
    const pcmBytes = new Uint8Array(pcmBinary.length);
    for (let i = 0; i < pcmBinary.length; i++) pcmBytes[i] = pcmBinary.charCodeAt(i);
    const wavBytes = pcmToWav(pcmBytes, 24000, 1, 16);
    return { base64Data: toBase64(wavBytes), mimeType: 'audio/wav' };
  }

  return { base64Data: base64Audio, mimeType: geminiMime };
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const inputText = text.trim().slice(0, 2000);
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    // Check cache
    const cacheKey = inputText;
    const cached = audioCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_MAX_AGE) {
      return audioResponse(cached.base64Data, cached.mimeType, 'HIT');
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'TTS service is not configured. GOOGLE_AI_API_KEY is not set.' },
        { status: 503 }
      );
    }

    let result: { base64Data: string; mimeType: string } | null = null;
    let usedProvider: string = 'none';
    let lastError: string = '';

    // Try providers in order of quality
    const providers: Array<{ name: string; fn: () => Promise<{ base64Data: string; mimeType: string }> }> = [
      {
        name: 'cloud-tts',
        fn: () => generateWithCloudTTS(apiKey, inputText),
      },
      {
        name: 'gemini-tts',
        fn: () => generateWithGeminiTTS(apiKey, inputText),
      },
    ];

    for (const provider of providers) {
      try {
        result = await provider.fn();
        usedProvider = provider.name;
        break;
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        console.warn(`TTS provider "${provider.name}" failed:`, lastError.slice(0, 200));
        // Try next provider
      }
    }

    if (!result) {
      return NextResponse.json(
        {
          error: 'All TTS providers failed',
          details: lastError,
          hint: 'Enable Cloud Text-to-Speech API at: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com?project=642571779346',
        },
        { status: 502 }
      );
    }

    // Cache the result
    cleanCache();
    audioCache.set(cacheKey, { ...result, timestamp: Date.now() });

    return audioResponse(result.base64Data, result.mimeType, 'MISS', usedProvider);
  } catch (error) {
    console.error('TTS API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate speech' },
      { status: 500 }
    );
  }
}

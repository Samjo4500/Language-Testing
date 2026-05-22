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
 * Convert raw PCM audio to WAV format by prepending a WAV header.
 * Gemini TTS returns PCM at 24kHz, 16-bit, mono.
 */
function pcmToWav(pcmData: Uint8Array, sampleRate: number = 24000, numChannels: number = 1, bitsPerSample: number = 16): Uint8Array {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const headerSize = 44;
  const wav = new Uint8Array(headerSize + dataSize);
  const view = new DataView(wav.buffer);

  // RIFF header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) wav[offset + i] = str.charCodeAt(i);
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  // fmt sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);               // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data sub-chunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);
  wav.set(pcmData, 44);

  return wav;
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
 * Try Gemini TTS with Kore voice (female, professional, American accent)
 */
async function generateWithGemini(apiKey: string, inputText: string): Promise<{ base64Data: string; mimeType: string }> {
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
              prebuiltVoiceConfig: {
                voiceName: 'Kore',
              },
            },
          },
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText.slice(0, 300)}`);
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
    // Convert back to base64
    let wavBase64 = '';
    for (let i = 0; i < wavBytes.length; i++) wavBase64 += String.fromCharCode(wavBytes[i]);
    return { base64Data: btoa(wavBase64), mimeType: 'audio/wav' };
  }

  return { base64Data: base64Audio, mimeType: geminiMime };
}

/**
 * Fallback: z-ai-web-dev-sdk TTS with 'kazi' voice (clear standard English)
 */
async function generateWithZAI(inputText: string): Promise<{ base64Data: string; mimeType: string }> {
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  const zai = await ZAI.create();

  const response = await zai.audio.tts.create({
    input: inputText.slice(0, 1024),
    voice: 'kazi',
    speed: 0.9,
    response_format: 'mp3',
    stream: false,
  });

  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let base64 = '';
  for (let i = 0; i < bytes.length; i++) base64 += String.fromCharCode(bytes[i]);
  return { base64Data: btoa(base64), mimeType: 'audio/mpeg' };
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

    let result: { base64Data: string; mimeType: string };
    let usedProvider: string;

    // Try Gemini TTS first (best quality, natural voice)
    if (apiKey) {
      try {
        result = await generateWithGemini(apiKey, inputText);
        usedProvider = 'gemini';
      } catch (geminiError) {
        console.warn('Gemini TTS failed, falling back to z-ai SDK:', geminiError instanceof Error ? geminiError.message : String(geminiError));
        result = await generateWithZAI(inputText);
        usedProvider = 'zai';
      }
    } else {
      result = await generateWithZAI(inputText);
      usedProvider = 'zai';
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

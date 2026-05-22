import { NextRequest, NextResponse } from 'next/server';

// In-memory cache for generated audio (keyed by text+voice+speed)
const audioCache = new Map<string, { arrayBuffer: ArrayBuffer; timestamp: number }>();
const CACHE_MAX_AGE = 30 * 60 * 1000; // 30 minutes
const CACHE_MAX_SIZE = 200; // Max cached items

// Singleton ZAI instance
let zaiInstance: any = null;

async function getZAI() {
  if (!zaiInstance) {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// Clean expired cache entries
function cleanCache() {
  const now = Date.now();
  for (const [key, value] of audioCache) {
    if (now - value.timestamp > CACHE_MAX_AGE) {
      audioCache.delete(key);
    }
  }
  // If cache is too large, remove oldest entries
  if (audioCache.size > CACHE_MAX_SIZE) {
    const entries = [...audioCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = entries.slice(0, audioCache.size - CACHE_MAX_SIZE);
    for (const [key] of toRemove) {
      audioCache.delete(key);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'kazi', speed = 0.9 } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Truncate to max 1024 chars (API limit)
    const inputText = text.trim().slice(0, 1024);

    // Validate speed range
    const clampedSpeed = Math.max(0.5, Math.min(2.0, Number(speed) || 0.9));

    // Validate voice
    const validVoices = ['tongtong', 'chuichui', 'xiaochen', 'jam', 'kazi', 'douji', 'luodo'];
    const voiceName = validVoices.includes(voice) ? voice : 'kazi';

    // Check cache
    const cacheKey = `${inputText}|${voiceName}|${clampedSpeed}`;
    const cached = audioCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_MAX_AGE) {
      return new NextResponse(cached.arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': cached.arrayBuffer.byteLength.toString(),
          'Cache-Control': 'private, max-age=1800',
          'X-Cache': 'HIT',
        },
      });
    }

    // Generate TTS audio
    const zai = await getZAI();
    const response = await zai.audio.tts.create({
      input: inputText,
      voice: voiceName,
      speed: clampedSpeed,
      response_format: 'mp3',
      stream: false,
    });

    const arrayBuffer = await response.arrayBuffer();

    // Cache the result
    cleanCache();
    audioCache.set(cacheKey, { arrayBuffer, timestamp: Date.now() });

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': arrayBuffer.byteLength.toString(),
        'Cache-Control': 'private, max-age=1800',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('TTS API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate speech' },
      { status: 500 }
    );
  }
}

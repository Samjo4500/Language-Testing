import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

// POST: Translate a moment's content
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ momentId: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { momentId } = await params;
    const body = await request.json();
    const { targetLanguage } = body;

    if (!targetLanguage) {
      return NextResponse.json({ error: 'Target language is required.' }, { status: 400 });
    }

    const moment = await db.moment.findUnique({
      where: { id: momentId },
      select: { content: true, isDeleted: true },
    });

    if (!moment || moment.isDeleted) {
      return NextResponse.json({ error: 'Moment not found.' }, { status: 404 });
    }

    // Use z-ai-web-dev-sdk for translation
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a translator. Translate the following text to the target language. Only return the translation, nothing else.' },
        { role: 'user', content: `Translate to ${targetLanguage}:\n\n${moment.content}` },
      ],
    });

    const translatedText = completion.choices?.[0]?.message?.content || '';

    return NextResponse.json({ translatedText, targetLanguage });
  } catch (error) {
    console.error('Translate moment error:', error);
    return NextResponse.json({ error: 'Translation failed. Please try again.' }, { status: 500 });
  }
}

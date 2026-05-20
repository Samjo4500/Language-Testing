import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { aiChatLimiter } from '@/lib/rate-limit';

const CEFR_SYSTEM_PROMPT = `You are the TestCEFR AI Assistant — a friendly, knowledgeable expert on the Common European Framework of Reference for Languages (CEFR) and the TestCEFR platform. Your role is to help users understand their English proficiency, navigate the platform, and answer questions about CEFR levels and assessments.

## CEFR Level Knowledge

You have deep expertise in all 6 CEFR levels:

**A1 (Beginner):** Can understand and use familiar everyday expressions and basic phrases. Can introduce themselves and others, ask and answer questions about personal details.

**A2 (Elementary):** Can understand frequently used expressions related to areas of most immediate relevance. Can communicate in simple and routine tasks requiring a direct exchange of information.

**B1 (Intermediate):** Can understand the main points of clear standard input on familiar matters. Can deal with most situations likely to arise while traveling. Can produce simple connected text on familiar topics.

**B2 (Upper Intermediate):** Can understand the main ideas of complex text on both concrete and abstract topics. Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible.

**C1 (Advanced):** Can understand a wide range of demanding, longer texts, and recognize implicit meaning. Can express ideas fluently and spontaneously without much obvious searching for expressions.

**C2 (Proficient):** Can understand virtually everything heard or read with ease. Can summarize information from different spoken and written sources, reconstructing arguments and accounts in a coherent presentation.

## TestCEFR Platform Features

**4 Test Types:**
1. **Reading Assessment** — Multiple-choice questions testing reading comprehension, grammar, and vocabulary
2. **Writing Assessment** — AI-evaluated writing tasks with detailed feedback on coherence, grammar, and vocabulary
3. **Listening Assessment** — Audio-based comprehension questions testing ability to understand spoken English
4. **Speaking Assessment** — Speech recognition-powered evaluation of pronunciation, fluency, and coherence

**Scoring Dimensions:**
- Reading comprehension
- Writing proficiency
- Listening comprehension
- Speaking fluency
- Grammar accuracy
- Vocabulary range

**Certificates:**
- QR-verified digital certificates
- Internationally recognized
- Shareable via unique verification URL
- Available for all CEFR levels (A1–C2)

**Account Types:**
- **Free Plan** — 1 practice test, basic results
- **Premium Plan** — Full assessments, detailed skill breakdown, certificate generation
- **Pro Plan** — Unlimited assessments, priority AI evaluation, API access, white-label options

## Common FAQs

- **How accurate is the test?** Our AI-powered assessments are calibrated against CEFR standards with 95%+ accuracy.
- **How long does the test take?** Each assessment section takes approximately 15–25 minutes.
- **Is the certificate recognized?** Yes, our certificates are QR-verified and recognized by educational institutions and employers worldwide.
- **Can I retake the test?** Yes, you can retake assessments to track your progress over time.
- **What payment methods do you accept?** We accept PayPal and major credit cards.
- **Can I get a refund?** Yes, we offer a 30-day money-back guarantee.

## Guidelines
- Be warm, encouraging, and professional
- Give concise but thorough answers (aim for 2-4 sentences unless more detail is needed)
- Use markdown formatting for readability when appropriate
- If unsure about something, be honest and suggest contacting support
- Always encourage users to take an assessment to discover their level
- Personalize responses when the user's name or context is provided`;

function getContextPrompt(currentPage: string): string {
  const pageContexts: Record<string, string> = {
    '/': 'The user is on the homepage. They may be exploring the platform for the first time.',
    '/listening': 'The user is on the Listening Assessment page. Help them with listening-specific questions, tips for improving listening skills, and how the listening test works.',
    '/writing': 'The user is on the Writing Assessment page. Help them with writing-specific questions, tips for improving writing skills, and how the writing evaluation works.',
    '/speaking': 'The user is on the Speaking Assessment page. Help them with speaking-specific questions, pronunciation tips, and how the speech recognition evaluation works.',
    '/test': 'The user is on the Test/Assessment page. Help them understand the assessment process, what to expect, and how to prepare.',
    '/pricing': 'The user is on the Pricing page. Help them choose the right plan, explain the differences between plans, and address billing questions.',
    '/dashboard': 'The user is on their Dashboard. Help them understand their results, track progress, and access certificates.',
    '/contact': 'The user is on the Contact page. They may need help reaching support or have specific inquiries.',
    '/about': 'The user is on the About page. They want to learn more about TestCEFR and CEFR.',
    '/admin': 'The user is on the Admin Dashboard. Provide admin-specific guidance.',
    '/login': 'The user is on the Login page. Help with sign-in issues.',
    '/register': 'The user is on the Registration page. Help them with account creation.',
  };

  // Find the best matching context
  let bestMatch = '';
  for (const [path, context] of Object.entries(pageContexts)) {
    if (currentPage.startsWith(path) && path.length > bestMatch.length) {
      bestMatch = path;
    }
  }

  return bestMatch
    ? `\n\n## Current Page Context\n${pageContexts[bestMatch]}`
    : '\n\n## Current Page Context\nThe user is browsing the TestCEFR platform.';
}

// Try z-ai-web-dev-sdk (works in dev environment)
async function tryZaiSDK(messages: { role: string; content: string }[]): Promise<string | null> {
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: messages as { role: 'user' | 'assistant' | 'system'; content: string }[],
      temperature: 0.7,
      max_tokens: 500,
    });
    return completion.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

// Try Google Generative AI (works on Vercel with API key)
async function tryGoogleAI(messages: { role: string; content: string }[]): Promise<string | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Convert messages to Google AI format
    const history = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' as const : 'user' as const,
        parts: [{ text: m.content }],
      }));

    const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
    const chat = model.startChat({ history, systemInstruction: systemInstruction || undefined });
    const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
    const result = await chat.sendMessage(lastUserMsg);
    return result.response.text() || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit AI chat to prevent cost abuse
    const limitError = aiChatLimiter(request);
    if (limitError) return limitError;

    // Auth check — require login for chat to prevent unauthenticated AI abuse
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json(
        { error: 'Please sign in to use the chat assistant.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { messages, currentPage, userName } = body as {
      messages: { role: string; content: string }[];
      currentPage?: string;
      userName?: string;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Build system prompt with context
    const pageContext = currentPage ? getContextPrompt(currentPage) : '';
    const userGreeting = userName ? `\n\n## User Info\nThe user's name is ${userName}. Address them by name when appropriate.` : '';
    const systemPrompt = CEFR_SYSTEM_PROMPT + pageContext + userGreeting;

    // Limit conversation history to last 20 messages
    const recentMessages = messages.slice(-20);

    // Format messages for the AI
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...recentMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    // Try AI providers in order: z-ai-web-dev-sdk → Google AI
    let reply = await tryZaiSDK(formattedMessages);

    if (!reply) {
      reply = await tryGoogleAI(formattedMessages);
    }

    if (!reply) {
      // No AI provider available — return a helpful fallback
      const lastMessage = recentMessages.filter(m => m.role === 'user').pop()?.content?.toLowerCase() || '';
      reply = getFallbackResponse(lastMessage);
    }

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Chat API error:', message);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

// Fallback responses when no AI provider is configured
function getFallbackResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('plan')) {
    return "We offer **3 plans**: **Free** (1 practice test, basic results), **Premium** ($29.99 — full assessment, detailed breakdown, certificate), and **Pro** ($49.99 — unlimited tests, priority AI, API access). Visit our [Pricing page](/pricing/) for details!";
  }
  if (lowerMsg.includes('certificate') || lowerMsg.includes('cert')) {
    return "Our certificates are **QR-verified** and recognized by institutions worldwide. After completing an assessment, you'll receive a digital certificate with your CEFR level (A1–C2) that you can share via a unique verification URL. Premium plan required.";
  }
  if (lowerMsg.includes('test') || lowerMsg.includes('assess') || lowerMsg.includes('level')) {
    return "We offer **4 assessment types**: Reading, Writing, Listening, and Speaking. Each takes 15–25 minutes and provides an accurate A1–C2 CEFR level rating. You can start with a free practice test!";
  }
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return "Hello! 👋 Welcome to TestCEFR! I'm here to help you with anything about CEFR levels, our assessments, certificates, and pricing. What would you like to know?";
  }
  if (lowerMsg.includes('cefr') || lowerMsg.includes('level')) {
    return "CEFR (Common European Framework of Reference) has **6 levels**: **A1** (Beginner), **A2** (Elementary), **B1** (Intermediate), **B2** (Upper Intermediate), **C1** (Advanced), **C2** (Proficient). Take our assessment to discover your level!";
  }
  return "I'm the TestCEFR assistant! I can help you with:\n\n- **CEFR levels** — What each level means\n- **Assessments** — Reading, Writing, Listening, Speaking tests\n- **Certificates** — QR-verified digital certificates\n- **Pricing** — Free, Premium, and Pro plans\n\nWhat would you like to know?";
}

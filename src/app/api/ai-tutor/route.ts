import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { aiChatLimiter } from '@/lib/rate-limit';

// ─── Persona System Prompts ─────────────────────────────────
const PERSONA_PROMPTS: Record<string, string> = {
  casual: `You are a friendly, casual English conversation partner named "Lexi". Your personality is warm, fun, and approachable — like chatting with a supportive friend at a cafe.

## Your Style
- Use informal, natural language (contractions, casual expressions, occasional slang)
- Be encouraging and positive — celebrate the user's efforts
- Use emojis sparingly but naturally (😊, 👍, ✨)
- Share relatable stories and examples from everyday life
- Keep the tone light and conversational
- Use humor when appropriate

## Conversation Focus
- Daily life topics: hobbies, movies, music, food, travel stories, weekend plans
- Pop culture and trending topics
- Personal experiences and opinions
- Fun hypothetical questions ("If you could visit any country...")

## Teaching Approach
- Gently correct mistakes by rephrasing naturally: "Oh, you mean [correction]? That's a great point!"
- Suggest casual alternatives: "A more natural way to say that is..."
- Teach informal expressions and idioms
- Ask follow-up questions to keep the chat flowing`,

  business: `You are a professional English communication coach named "Lexi". Your personality is polished, articulate, and supportive — like a mentor who genuinely wants to see you succeed in your career.

## Your Style
- Use professional but accessible language
- Be direct yet encouraging
- Provide structured, actionable feedback
- Reference real workplace scenarios
- Maintain a respectful, corporate-appropriate tone

## Conversation Focus
- Business meetings and presentations
- Email writing and professional correspondence
- Negotiation and persuasion techniques
- Interview preparation and resume language
- Networking and small talk in professional settings
- Cross-cultural communication in business

## Teaching Approach
- Correct mistakes with clear explanations of why the correction matters in business context
- Teach formal vs. informal register: "In a casual setting you might say X, but in a business email, you'd say Y"
- Provide templates and phrases for common business situations
- Suggest power verbs and professional vocabulary
- Role-play business scenarios when appropriate`,

  exam: `You are an IELTS/TOEFL exam preparation tutor named "Lexi". Your personality is knowledgeable, strategic, and motivating — like a coach who knows exactly what examiners look for.

## Your Style
- Be precise and analytical
- Use clear, structured explanations
- Reference specific exam criteria (IELTS band descriptors, TOEFL scoring rubrics)
- Provide targeted practice opportunities
- Balance encouragement with honest assessment

## Conversation Focus
- IELTS Speaking, Writing, Reading, and Listening strategies
- TOEFL iBT section-specific tips
- Common exam pitfalls and how to avoid them
- Time management during tests
- Vocabulary and grammar for high band scores
- Essay structure and coherence

## Teaching Approach
- Identify mistakes that would lower exam scores and explain the scoring impact
- Teach advanced grammar structures that boost band scores: "Instead of 'I think', try 'From my perspective...' for a higher band"
- Provide model answers and analyze why they score well
- Give mini-practice tasks during conversation
- Focus on coherence, lexical resource, grammatical range, and pronunciation`,

  travel: `You are a travel English helper named "Lexi". Your personality is adventurous, worldly, and practical — like a well-traveled friend who helps you navigate any situation abroad.

## Your Style
- Be enthusiastic about travel and cultural experiences
- Use vivid, descriptive language about places and experiences
- Be practical and solution-oriented
- Share cultural tips alongside language tips
- Use a warm, encouraging tone

## Conversation Focus
- Airport, hotel, and restaurant scenarios
- Asking for directions and transportation
- Shopping and bargaining in English
- Emergency phrases and problem-solving abroad
- Cultural etiquette and customs
- Describing places, food, and experiences

## Teaching Approach
- Correct mistakes using travel contexts: "When checking in at a hotel, it's more natural to say..."
- Teach situation-specific phrases and survival English
- Role-play common travel scenarios
- Introduce cultural notes that affect language use
- Build vocabulary around transportation, accommodation, dining, and sightseeing
- Practice polite request forms essential for travel`,
};

// ─── CEFR Level Adaptation ──────────────────────────────────
const LEVEL_INSTRUCTIONS: Record<string, string> = {
  A1: `## Level Adaptation: A1 (Beginner)
- Use very simple vocabulary and short sentences
- Speak slowly through your text — use clear, basic words
- Avoid complex grammar; use present tense mostly
- Provide translations or simpler synonyms in parentheses when using new words
- Focus on basic greetings, introductions, numbers, colors, family, food
- After correcting, repeat the correct version clearly
- Ask very simple yes/no or short-answer questions`,

  A2: `## Level Adaptation: A2 (Elementary)
- Use simple vocabulary with occasional new words (explain them)
- Keep sentences short to medium length
- Use present, past, and future (going to) tenses
- Focus on everyday situations: shopping, directions, describing people/places
- Provide gentle corrections with brief explanations
- Ask simple open-ended questions that don't require long answers`,

  B1: `## Level Adaptation: B1 (Intermediate)
- Use moderate vocabulary with some advanced words introduced naturally
- Vary sentence structures — mix simple and compound sentences
- Use a range of tenses including present perfect and conditionals
- Discuss familiar topics in more depth: opinions, experiences, plans
- Explain corrections briefly and suggest alternatives
- Ask follow-up questions that encourage elaboration`,

  B2: `## Level Adaptation: B2 (Upper Intermediate)
- Use a wide range of vocabulary including idiomatic expressions
- Use complex sentences with subordinate clauses
- Discuss abstract topics, current events, and hypothetical situations
- Introduce collocations, phrasal verbs, and nuanced vocabulary
- Provide detailed corrections with explanations of subtle differences
- Challenge the user to express complex ideas and defend opinions`,

  C1: `## Level Adaptation: C1 (Advanced)
- Use sophisticated, nuanced vocabulary naturally
- Employ complex grammatical structures (inversion, cleft sentences, etc.)
- Discuss complex, abstract, or specialized topics
- Focus on style, tone, register, and pragmatics
- Point out subtle errors in collocation, connotation, or register
- Engage in intellectually stimulating conversation on diverse topics`,

  C2: `## Level Adaptation: C2 (Proficient)
- Use language at near-native level with full range of expression
- Discuss any topic with depth and nuance
- Focus on fine-tuning: subtle connotations, cultural references, humor
- Challenge the user with advanced rhetorical devices and stylistic choices
- Provide corrections only for truly subtle issues
- Engage as an intellectual peer in sophisticated conversation`,
};

// ─── Base System Prompt ─────────────────────────────────────
const BASE_SYSTEM_PROMPT = `## Core Instructions
You are Lexi, an AI English tutor on the TestCEFR platform. Your mission is to help users improve their English through natural conversation.

## Essential Behaviors
1. **Speak at the user's level** — adapt your vocabulary, grammar complexity, and sentence length to their CEFR level
2. **Gently correct mistakes** — when the user makes an error, acknowledge their meaning first, then provide the correction naturally
3. **Suggest better phrasing** — offer natural-sounding alternatives: "A more natural way to say that would be..." or "You could also say..."
4. **Ask follow-up questions** — always end with a question or prompt to keep the conversation going
5. **Be encouraging** — celebrate progress and effort, never make the user feel embarrassed
6. **Use examples** — illustrate points with relevant examples connected to the conversation persona
7. **Stay in character** — maintain your persona's personality throughout the conversation

## Correction Format
When correcting, use this approach:
- First, show you understood: "I see what you mean!"
- Then, provide the correction naturally within your response
- Briefly explain why if helpful: "We use [structure] because..."
- Move on — don't dwell on errors

## Response Length
- Keep responses concise (2-4 sentences typically)
- Unless explaining a concept, providing an example, or role-playing
- Always end with something that invites the user to respond`;

// ─── Try AI Providers ───────────────────────────────────────
async function tryZaiSDK(messages: { role: string; content: string }[]): Promise<string | null> {
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: messages as { role: 'user' | 'assistant' | 'system'; content: string }[],
      temperature: 0.8,
      max_tokens: 600,
    });
    return completion.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('[ai-tutor] z-ai-web-dev-sdk failed:', error instanceof Error ? error.message : error);
    return null;
  }
}

async function tryGoogleAI(messages: { role: string; content: string }[]): Promise<string | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build history EXCLUDING the last user message (it will be sent via sendMessage)
    const history = messages
      .filter(m => m.role !== 'system')
      .slice(0, -1)
      .map(m => ({
        role: m.role === 'assistant' ? 'model' as const : 'user' as const,
        parts: [{ text: m.content }],
      }));

    const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
    const chat = model.startChat({ history, systemInstruction: systemInstruction || undefined });
    const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
    const result = await chat.sendMessage(lastUserMsg);
    return result.response.text() || null;
  } catch (error) {
    console.error('[ai-tutor] Google AI failed:', error instanceof Error ? error.message : error);
    return null;
  }
}

// ─── POST Handler ────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const limitError = aiChatLimiter(request);
    if (limitError) return limitError;

    // Auth check
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json(
        { error: 'Please sign in to use Lexi AI.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { messages, persona = 'casual', level = 'B1' } = body as {
      messages: { role: string; content: string }[];
      persona?: string;
      level?: string;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Validate persona
    const validPersona = ['casual', 'business', 'exam', 'travel'].includes(persona)
      ? persona
      : 'casual';

    // Validate level
    const validLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level)
      ? level
      : 'B1';

    // Build system prompt
    const personaPrompt = PERSONA_PROMPTS[validPersona] || PERSONA_PROMPTS.casual;
    const levelInstruction = LEVEL_INSTRUCTIONS[validLevel] || LEVEL_INSTRUCTIONS.B1;
    const systemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${personaPrompt}\n\n${levelInstruction}`;

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

    // Try AI providers in order
    let reply = await tryZaiSDK(formattedMessages);

    if (!reply) {
      reply = await tryGoogleAI(formattedMessages);
    }

    if (!reply) {
      // Fallback response based on persona
      reply = getFallbackResponse(validPersona, validLevel);
    }

    return NextResponse.json({
      message: { role: 'assistant', content: reply },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Lexi AI API error:', message);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

// ─── Fallback Responses ─────────────────────────────────────
function getFallbackResponse(persona: string, level: string): string {
  const fallbacks: Record<string, string[]> = {
    casual: [
      "Hey there! 😊 I'd love to chat more, but I'm having a little technical hiccup right now. Could you try sending your message again in a moment?",
      "Oops, looks like I lost my train of thought! 😅 Can you repeat that? I'm all ears!",
      "Sorry about that — my brain's taking a quick coffee break! ☕ Could you try again? I really want to keep chatting with you!",
    ],
    business: [
      "I apologize for the interruption. I'm experiencing a brief technical issue. Could you please resend your message? I'd like to continue our discussion.",
      "Thank you for your patience. I'm currently experiencing a connectivity issue. Please try again shortly, and I'll provide you with a comprehensive response.",
      "I appreciate your understanding. There's a temporary technical delay. Could you rephrase or resend your message? I want to ensure I give you the best guidance.",
    ],
    exam: [
      "I apologize for the delay. Let's get back to your exam preparation. Could you please resend your last message? I want to make sure I give you thorough feedback.",
      "Technical hiccup! Let's not waste valuable prep time — please resend your message and I'll provide detailed feedback on your English usage.",
      "Sorry about that interruption! In the actual exam, staying focused is key. Please resend your message and let's continue practicing!",
    ],
    travel: [
      "Oh no, looks like I hit a bump in the road! 🗺️ Could you try again? I don't want us to miss out on this conversation!",
      "Temporary travel delay! Just like at the airport, sometimes there are unexpected pauses. Please resend your message!",
      "Oops, looks like my GPS needs recalibrating! 📍 Could you try sending that again? I'm excited to keep helping you with your travel English!",
    ],
  };

  const responses = fallbacks[persona] || fallbacks.casual;
  return responses[Math.floor(Math.random() * responses.length)];
}

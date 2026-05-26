import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { aiEvalLimiter } from '@/lib/rate-limit';
import { generateAIChat } from '@/lib/ai-provider';

const MAX_TEXT_LENGTH = 10000;

const SYSTEM_PROMPT = `You are an expert English grammar checker and writing analyst. Your job is to find ALL grammar, spelling, punctuation, and style errors in the user's text, then return a structured JSON analysis.

For each error you find, provide:
- "original": the exact text with the error
- "correction": the corrected version
- "explanation": a clear, concise explanation of why it's wrong
- "category": one of "grammar", "spelling", "punctuation", or "style"
- "severity": one of "high" (meaning changes), "medium" (noticeable issues), or "low" (minor suggestions)

Also provide:
- "correctedText": the full text with ALL corrections applied
- "score": an overall grammar score from 0-100 (100 = perfect)
- "suggestions": style improvement suggestions, each with "type" ("style"), "original", "suggestion", and "reason"
- "levelAssessment": a CEFR level assessment (e.g., "B1 - Your writing shows intermediate proficiency...") with a brief explanation

Scoring guide:
- 90-100: Near-perfect, only minor style suggestions
- 70-89: Good, a few grammar/punctuation errors
- 50-69: Moderate, several errors that affect clarity
- 30-49: Below average, many errors
- 0-29: Significant errors throughout

IMPORTANT: You must respond with ONLY valid JSON in exactly this format, no additional text before or after:
{
  "originalText": "the original text",
  "correctedText": "the fully corrected text",
  "score": 85,
  "errors": [
    {
      "original": "I has went",
      "correction": "I have gone",
      "explanation": "Use present perfect (have + past participle) for actions completed in the recent past",
      "category": "grammar",
      "severity": "high"
    }
  ],
  "suggestions": [
    {
      "type": "style",
      "original": "very good",
      "suggestion": "excellent",
      "reason": "More precise and professional vocabulary"
    }
  ],
  "levelAssessment": "B1 - Your writing shows intermediate proficiency with some grammar errors that are typical of this level."
}

If there are no errors, return an empty errors array and a score of 100. If there are no style suggestions, return an empty suggestions array.`;

export async function POST(request: NextRequest) {
  // Rate limit AI evaluation to prevent cost abuse
  const limitError = aiEvalLimiter(request);
  if (limitError) return limitError;

  try {
    // Auth check
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to use the grammar checker.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { text, level } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string.' },
        { status: 400 }
      );
    }

    if (text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Text is too short. Please enter at least a full sentence.' },
        { status: 400 }
      );
    }

    // Input length limit
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Text too long. Maximum ${MAX_TEXT_LENGTH.toLocaleString()} characters.` },
        { status: 400 }
      );
    }

    const userMessage = level
      ? `Analyze the following English text for grammar, spelling, punctuation, and style errors. The writer's approximate CEFR level is ${level}.\n\nText to analyze:\n${text}`
      : `Analyze the following English text for grammar, spelling, punctuation, and style errors.\n\nText to analyze:\n${text}`;

    // Use the AI provider with timeout
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new DOMException('Grammar check timed out', 'AbortError')), 45000)
    );

    const responseText = await Promise.race([
      generateAIChat(
        [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        { temperature: 0.3, maxTokens: 4000 }
      ),
      timeoutPromise,
    ]);

    // Parse JSON response
    let result;
    try {
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
      result = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse grammar check AI response:', responseText?.substring(0, 500));
      return NextResponse.json(
        { error: 'Failed to parse grammar check result. Please try again.' },
        { status: 502 }
      );
    }

    // Validate and sanitize the result
    if (!result.originalText) result.originalText = text;
    if (!result.correctedText) result.correctedText = text;
    if (typeof result.score !== 'number' || result.score < 0 || result.score > 100) {
      result.score = 50;
    }
    if (!Array.isArray(result.errors)) result.errors = [];
    if (!Array.isArray(result.suggestions)) result.suggestions = [];
    if (typeof result.levelAssessment !== 'string') {
      result.levelAssessment = 'Unable to assess level.';
    }

    // Sanitize each error
    result.errors = result.errors.map((err: any) => ({
      original: String(err.original || ''),
      correction: String(err.correction || ''),
      explanation: String(err.explanation || ''),
      category: ['grammar', 'spelling', 'punctuation', 'style'].includes(err.category)
        ? err.category
        : 'grammar',
      severity: ['high', 'medium', 'low'].includes(err.severity)
        ? err.severity
        : 'medium',
    }));

    // Sanitize each suggestion
    result.suggestions = result.suggestions.map((sug: any) => ({
      type: 'style',
      original: String(sug.original || ''),
      suggestion: String(sug.suggestion || ''),
      reason: String(sug.reason || ''),
    }));

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Grammar check timed out. Please try again with shorter text.' },
        { status: 504 }
      );
    }
    console.error('Grammar check error:', error);
    return NextResponse.json(
      { error: 'Failed to check grammar. Please try again.' },
      { status: 500 }
    );
  }
}

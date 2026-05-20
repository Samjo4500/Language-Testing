import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAuthUser } from '@/lib/auth-middleware';

const MAX_TEXT_LENGTH = 10000;

/**
 * POST /api/assessments/writing/evaluate
 * Evaluate a writing submission using Gemini AI.
 * Body: { text: string, prompt: string, level: string }
 * Evaluates 4 dimensions: Grammar accuracy, Vocabulary range, Coherence, Task achievement.
 * Returns: { cefrLevel, score (0-100), feedback, strengths[], improvements[] }
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check — prevent unauthenticated AI abuse
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to use AI evaluation.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { text, prompt, level } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'text is required and must be a string.' },
        { status: 400 }
      );
    }

    // Input length limit — prevent API abuse
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Text too long. Maximum ${MAX_TEXT_LENGTH.toLocaleString()} characters.` },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'prompt is required and must be a string.' },
        { status: 400 }
      );
    }

    if (!level || typeof level !== 'string') {
      return NextResponse.json(
        { error: 'level is required and must be a string.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_AI_API_KEY is not set');
      return NextResponse.json(
        { error: 'AI evaluation service is not configured.' },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const evaluationPrompt = `You are an expert CEFR English language assessor. Evaluate the following writing submission.

Target CEFR Level: ${level}
Writing Prompt: ${prompt}
Student's Writing: ${text}

Evaluate the writing on these 4 dimensions (each scored 0-100):
1. Grammar accuracy - Correctness of grammar structures and sentence construction
2. Vocabulary range - Appropriateness and variety of vocabulary for the target level
3. Coherence - Logical organization, use of connectors, and paragraph structure
4. Task achievement - How well the writing addresses the given prompt

Then determine the overall CEFR level (A1, A2, B1, B2, C1, or C2) and an overall score (0-100).

IMPORTANT: You must respond with ONLY valid JSON in exactly this format, no additional text:
{
  "cefrLevel": "B1",
  "score": 72,
  "feedback": "A brief overall feedback paragraph (2-3 sentences).",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"]
}`;

    // 30-second timeout for AI calls using Promise.race
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new DOMException('AI evaluation timed out', 'AbortError')), 30000)
    );

    try {
      const result = await Promise.race([model.generateContent(evaluationPrompt), timeoutPromise]);
      const response = result.response;
      const responseText = response.text();

      // Parse the JSON response from Gemini
      let evaluationResult;
      try {
        // Try to extract JSON from the response (handle markdown code blocks)
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
        const jsonStr = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
        evaluationResult = JSON.parse(jsonStr);
      } catch {
        console.error('Failed to parse Gemini response:', responseText);
        return NextResponse.json(
          { error: 'Failed to parse AI evaluation result.' },
          { status: 502 }
        );
      }

      // Validate the result structure
      const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      if (!evaluationResult.cefrLevel || !validLevels.includes(evaluationResult.cefrLevel)) {
        evaluationResult.cefrLevel = level;
      }
      if (typeof evaluationResult.score !== 'number' || evaluationResult.score < 0 || evaluationResult.score > 100) {
        evaluationResult.score = 50;
      }
      if (typeof evaluationResult.feedback !== 'string') {
        evaluationResult.feedback = 'Evaluation completed.';
      }
      if (!Array.isArray(evaluationResult.strengths)) {
        evaluationResult.strengths = [];
      }
      if (!Array.isArray(evaluationResult.improvements)) {
        evaluationResult.improvements = [];
      }

      return NextResponse.json(evaluationResult);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'AI evaluation timed out. Please try again.' },
          { status: 504 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Writing evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate writing submission.' },
      { status: 500 }
    );
  }
}

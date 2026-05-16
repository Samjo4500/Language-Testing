import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * POST /api/assessments/speaking/evaluate
 * Evaluate a speaking submission using Gemini AI.
 * Body: { transcript: string, prompt: string, level: string }
 * Evaluates 5 dimensions: Fluency, Vocabulary, Grammar, Pronunciation (estimated), Task achievement.
 * Returns: { cefrLevel, score (0-100), feedback, strengths[], improvements[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcript, prompt, level } = body;

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'transcript is required and must be a string.' },
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

    const evaluationPrompt = `You are an expert CEFR English language assessor. Evaluate the following speaking submission transcript.

Target CEFR Level: ${level}
Speaking Prompt: ${prompt}
Student's Speech Transcript: ${transcript}

Note: Since this is a transcript of spoken language, pronunciation cannot be directly assessed from text. Estimate pronunciation quality based on common patterns for speakers at this level, and focus primarily on the transcript content.

Evaluate the speaking on these 5 dimensions (each scored 0-100):
1. Fluency - Smoothness of speech flow, appropriate pacing, lack of excessive hesitation markers (um, uh, etc.)
2. Vocabulary - Range and appropriateness of vocabulary for the target level
3. Grammar - Correctness of grammar structures used in spontaneous speech
4. Pronunciation (estimated) - Estimated pronunciation quality based on speech patterns, word choices, and common error patterns in the transcript
5. Task achievement - How well the speaker addresses the given prompt and communicates their ideas

Then determine the overall CEFR level (A1, A2, B1, B2, C1, or C2) and an overall score (0-100).

IMPORTANT: You must respond with ONLY valid JSON in exactly this format, no additional text:
{
  "cefrLevel": "B1",
  "score": 72,
  "feedback": "A brief overall feedback paragraph (2-3 sentences).",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"]
}`;

    const result = await model.generateContent(evaluationPrompt);
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
    console.error('Speaking evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate speaking submission.' },
      { status: 500 }
    );
  }
}

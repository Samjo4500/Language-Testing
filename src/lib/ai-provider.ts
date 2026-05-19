/**
 * AI Provider utility — tries z-ai-web-dev-sdk first (works everywhere),
 * then falls back to Google Generative AI (may have regional restrictions).
 */

let _zai: any = null;

async function getZAI() {
  if (_zai) return _zai;
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    _zai = await ZAI.create();
    return _zai;
  } catch {
    return null;
  }
}

/**
 * Generate a completion using the best available AI provider.
 * Returns the raw text response.
 */
export async function generateAICompletion(
  prompt: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const { temperature = 0.7, maxTokens = 4000 } = options || {};

  // Try z-ai-web-dev-sdk first (works in all regions)
  try {
    const zai = await getZAI();
    if (zai) {
      const completion = await zai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens,
      });
      const content = completion.choices?.[0]?.message?.content;
      if (content) return content;
    }
  } catch (e) {
    console.warn('z-ai-web-dev-sdk failed, falling back to Google AI:', e);
  }

  // Fallback to Google Generative AI
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (apiKey) {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) return text;
    } catch (e) {
      console.error('Google AI also failed:', e);
    }
  }

  throw new Error('No AI provider available. Both z-ai-sdk and Google AI failed.');
}

/**
 * Generate a structured JSON completion using the best available AI provider.
 * Parses the response as JSON, handling markdown code blocks.
 */
export async function generateAIJSON<T = any>(
  prompt: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<T> {
  const responseText = await generateAICompletion(prompt, options);

  // Try to extract JSON from the response (handle markdown code blocks)
  const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : responseText.trim();

  return JSON.parse(jsonStr);
}

/**
 * Generate a chat completion using the best available AI provider.
 * Supports multi-turn conversations with system prompts.
 */
export async function generateAIChat(
  messages: { role: string; content: string }[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const { temperature = 0.7, maxTokens = 1000 } = options || {};

  // Try z-ai-web-dev-sdk first
  try {
    const zai = await getZAI();
    if (zai) {
      const completion = await zai.chat.completions.create({
        messages: messages.map(m => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
        })),
        temperature,
        max_tokens: maxTokens,
      });
      const content = completion.choices?.[0]?.message?.content;
      if (content) return content;
    }
  } catch (e) {
    console.warn('z-ai-web-dev-sdk chat failed, falling back to Google AI:', e);
  }

  // Fallback to Google Generative AI
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (apiKey) {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
      const history = messages
        .filter(m => m.role !== 'system')
        .slice(0, -1)
        .map(m => ({
          role: m.role === 'assistant' ? 'model' as const : 'user' as const,
          parts: [{ text: m.content }],
        }));

      const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';

      const chat = model.startChat({
        history,
        systemInstruction: systemInstruction || undefined,
      });
      const result = await chat.sendMessage(lastUserMsg);
      const text = result.response.text();
      if (text) return text;
    } catch (e) {
      console.error('Google AI chat also failed:', e);
    }
  }

  throw new Error('No AI provider available for chat.');
}

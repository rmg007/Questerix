import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.1.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerationRequest {
  text: string;
  difficulty_distribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  custom_instructions?: string;
  model?: 'gemini-1.5-flash' | 'gpt-4o-mini';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, difficulty_distribution, custom_instructions, model = 'gemini-1.5-flash' }: GenerationRequest =
      await req.json();

    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error('Text content is required');
    }

    const totalQuestions = difficulty_distribution.easy + difficulty_distribution.medium + difficulty_distribution.hard;
    if (totalQuestions === 0 || totalQuestions > 100) {
      throw new Error('Total questions must be between 1 and 100');
    }

    // Initialize AI client
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build prompt
    const prompt = buildPrompt(text, difficulty_distribution, custom_instructions);

    // Call AI
    const startTime = Date.now();
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    const generationTime = Date.now() - startTime;

    // Parse JSON response
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON array');
    }

    const questions = JSON.parse(jsonMatch[0]);

    // Return response
    return new Response(
      JSON.stringify({
        questions,
        metadata: {
          model: 'gemini-1.5-flash',
          generation_time_ms: generationTime,
          token_count: estimateTokenCount(prompt, generatedText),
          questions_generated: questions.length,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Generation error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to generate questions',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function buildPrompt(
  text: string,
  difficultyDistribution: { easy: number; medium: number; hard: number },
  customInstructions?: string
): string {
  const schema = {
    text: 'string (question prompt)',
    question_type: 'enum: mcq | mcq_multi | text_input | boolean | reorder_steps',
    difficulty: 'enum: easy | medium | hard',
    metadata: {
      options: 'string[] (for MCQ types)',
      correct_answer: 'string | string[] (answer key)',
      explanation: 'string (why this answer is correct)',
    },
  };

  return `You are a curriculum question generator. Generate high-quality educational questions from the source material below.

**Source Material:**
${text.substring(0, 5000)} ${text.length > 5000 ? '...(truncated)' : ''}

**Requirements:**
- Generate EXACTLY ${difficultyDistribution.easy} EASY, ${difficultyDistribution.medium} MEDIUM, and ${difficultyDistribution.hard} HARD questions
- Mix question types (mcq, mcq_multi, text_input, boolean, reorder_steps)
- Ensure questions are clear, unambiguous, and based strictly on the source material
- For MCQ: Provide 4 options with exactly 1 correct answer
- Always include explanations

${customInstructions ? `**Additional Instructions:**\n${customInstructions}\n` : ''}

**Output Format (JSON Array):**
${JSON.stringify(schema, null, 2)}

**IMPORTANT**: Return ONLY a valid JSON array. No markdown, no code blocks, no explanations. Just the raw JSON array.

[`;
}

function estimateTokenCount(prompt: string, response: string): number {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil((prompt.length + response.length) / 4);
}

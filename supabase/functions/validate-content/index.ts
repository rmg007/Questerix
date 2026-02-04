import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.1.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidationRequest {
  questions: any[];
  source_text: string;
  rules?: {
    name: string;
    rule_type: string;
    params: any;
  }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { questions, source_text, rules = [] }: ValidationRequest = await req.json();

    if (!questions || !Array.isArray(questions)) {
      throw new Error('Questions array is required');
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use Gemini Pro for validation (Stronger reasoning than Flash)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = buildValidationPrompt(questions, source_text, rules);

    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const validationText = response.text();
    const duration = Date.now() - startTime;

    // Parse JSON response
    const jsonMatch = validationText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON validation report');
    }

    const validationReport = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify({
        ...validationReport,
        metadata: {
          model: 'gemini-1.5-pro',
          validation_time_ms: duration,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Validation error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to validate content',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function buildValidationPrompt(questions: any[], sourceText: string, rules: any[]): string {
  return `You are an expert educational content auditor. Your task is to validate AI-generated questions against source material and specific quality rules.

**Source Material:**
${sourceText.substring(0, 5000)}

**Generated Questions to Validate:**
${JSON.stringify(questions, null, 2)}

**Validation Rules:**
${rules.length > 0 ? JSON.stringify(rules, null, 2) : 'Default: Accuracy, Safety, and Formatting'}

**Evaluation Criteria:**
1. **Accuracy**: Are the questions factually correct based ONLY on the source?
2. **Pedagogy**: Is the difficulty distribution actually appropriate?
3. **Safety**: Any sensitive, biased, or inappropriate content?
4. **Formatting**: Does it strictly follow the required schema?

**Output Format (JSON Object ONLY):**
{
  "overall_score": 0.0 to 1.0,
  "status": "approved" | "flagged" | "rejected",
  "consensus_reached": boolean,
  "findings": [
    {
      "question_id": number (index),
      "score": 0.0 to 1.0,
      "issues": string[],
      "suggestions": string
    }
  ],
  "summary": "Executive summary of validation"
}

Return ONLY the JSON object.`;
}

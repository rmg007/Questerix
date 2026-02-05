import { generateQuestions, GenerateQuestionsRequest, GenerateQuestionsResponse } from './generateQuestions';
import { validateContent, ValidationResponse } from './validateContent';
import { supabase } from '@/lib/supabase';

export interface GovernedGenerationResponse extends GenerateQuestionsResponse {
  validation?: ValidationResponse;
  governance: {
    tokens_consumed: number;
    quota_remaining: number;
    throttled: boolean;
  };
}

export async function governedGenerateQuestions(
  appId: string,
  request: GenerateQuestionsRequest
): Promise<GovernedGenerationResponse> {
  // 1. Pre-check (Optional: could use estimatedTokens for soft-locking quota)
  // const estimatedTokens = Math.ceil(request.text.length / 4) + 2000;

  // 2. Initial quota check
  // Note: consume_tenant_tokens RPC will be typed after regenerating database.types.ts
  const { data: quotaData, error: quotaError } = await (supabase as unknown as { rpc: (n: string, p: any) => Promise<{ data: any; error: any }> }).rpc('consume_tenant_tokens', {
    p_app_id: appId,
    p_token_count: 0,
  });

  if (quotaError) throw quotaError;
  const initialQuota = quotaData as { success: boolean; message?: string };
  if (!initialQuota.success) {
    throw new Error(initialQuota.message || 'Quota exceeded or tenant throttled');
  }

  // 3. Generate Content (Gemini Flash)
  const generationResult = await generateQuestions(request);

  // 4. Validate Content (Gemini Pro)
  const validationResult = await validateContent({
    questions: generationResult.questions,
    source_text: request.text,
  });

  // 5. Final token consumption (Exact amount)
  const actualTokens = generationResult.metadata.token_count + 
                      Math.ceil(JSON.stringify(validationResult).length / 4);
                      
  const { data: finalQuotaData } = await (supabase as unknown as { rpc: (n: string, p: any) => Promise<{ data: any; error: any }> }).rpc('consume_tenant_tokens', {
    p_app_id: appId,
    p_token_count: actualTokens,
  });

  const finalQuota = (finalQuotaData ?? {}) as { success: boolean; remaining: number; is_throttled?: boolean };

  return {
    ...generationResult,
    validation: validationResult,
    governance: {
      tokens_consumed: actualTokens,
      quota_remaining: finalQuota?.remaining ?? 0,
      throttled: finalQuota?.is_throttled ?? false,
    }
  };
}

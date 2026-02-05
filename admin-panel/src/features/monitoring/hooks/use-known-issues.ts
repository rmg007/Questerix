import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface KnownIssue {
  id: string;
  title: string;
  description: string;
  error_message?: string;
  root_cause?: string;
  resolution?: string;
  status: 'open' | 'closed' | 'recurring';
  severity: 'low' | 'medium' | 'high' | 'critical';
  sentry_link?: string;
  created_at: string;
  updated_at: string;
}

export function useKnownIssues() {
  return useQuery({
    queryKey: ['known-issues'],
    queryFn: async () => {
      // Note: known_issues table types will be available after regenerating database.types.ts
      const { data, error } = await (supabase as unknown as { from: (t: string) => any })
        .from('known_issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as KnownIssue[];
    },
  });
}

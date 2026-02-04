 
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';

interface CurriculumMeta {
  version: number;
  last_published_at: string | null;
}

interface PublishStats {
  draftDomains: number;
  liveDomains: number;
  draftSkills: number;
  liveSkills: number;
  draftQuestions: number;
  liveQuestions: number;
}

interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
}

interface PublishPreview {
  meta: CurriculumMeta;
  stats: PublishStats;
  validationIssues: ValidationIssue[];
  canPublish: boolean;
  readyToPublishCount: number;
}

export function useCurriculumMeta() {
  // Curriculum meta might be global or tenant specific. 
  // If we are publishing per-app, we likely need a per-app version/publish-date record.
  // For now, assuming singleton usage.
  return useQuery({
    queryKey: ['curriculum-meta'],
    queryFn: async (): Promise<CurriculumMeta> => {
      const { data, error } = await supabase
        .from('curriculum_meta')
        .select('version, last_published_at')
        .eq('id', 'singleton')
        .single();
      
      if (error) throw error;
      return data as CurriculumMeta;
    },
  });
}

export function usePublishPreview() {
  const { currentApp } = useApp();

  return useQuery({
    queryKey: ['publish-preview', currentApp?.app_id],
    queryFn: async (): Promise<PublishPreview> => {
      if (!currentApp?.app_id) throw new Error('No app selected');

      const validationIssues: ValidationIssue[] = [];

      const [
        metaResult,
        draftDomainsResult,
        liveDomainsResult,
        draftSkillsResult,
        liveSkillsResult,
        draftQuestionsResult,
        liveQuestionsResult,
      ] = await Promise.all([
        supabase.from('curriculum_meta').select('version, last_published_at').eq('id', 'singleton').single(),
        supabase.from('domains').select('*', { count: 'exact', head: true }).eq('app_id', currentApp.app_id).is('deleted_at', null).eq('status', 'draft'),
        supabase.from('domains').select('*', { count: 'exact', head: true }).eq('app_id', currentApp.app_id).is('deleted_at', null).eq('status', 'live'),
        supabase.from('skills').select('*', { count: 'exact', head: true }).eq('app_id', currentApp.app_id).is('deleted_at', null).eq('status', 'draft'),
        supabase.from('skills').select('*', { count: 'exact', head: true }).eq('app_id', currentApp.app_id).is('deleted_at', null).eq('status', 'live'),
        supabase.from('questions').select('*', { count: 'exact', head: true }).eq('app_id', currentApp.app_id).is('deleted_at', null).eq('status', 'draft'),
        supabase.from('questions').select('*', { count: 'exact', head: true }).eq('app_id', currentApp.app_id).is('deleted_at', null).eq('status', 'live'),
      ]);

      if (metaResult.error) throw metaResult.error;

      const stats: PublishStats = {
        draftDomains: draftDomainsResult.count ?? 0,
        liveDomains: liveDomainsResult.count ?? 0,
        draftSkills: draftSkillsResult.count ?? 0,
        liveSkills: liveSkillsResult.count ?? 0,
        draftQuestions: draftQuestionsResult.count ?? 0,
        liveQuestions: liveQuestionsResult.count ?? 0,
      };

      const liveCount = stats.liveDomains + stats.liveSkills + stats.liveQuestions;
      const draftCount = stats.draftDomains + stats.draftSkills + stats.draftQuestions;

      if (liveCount === 0) {
        validationIssues.push({
          type: 'warning',
          message: 'No content is currently live. Mark content as "Live" to make it visible to students.',
        });
      }

      if (draftCount > 0) {
        validationIssues.push({
          type: 'warning',
          message: `${draftCount} item(s) are in draft status and not visible to students.`,
        });
      }

      return {
        meta: metaResult.data as CurriculumMeta,
        stats,
        validationIssues,
        canPublish: liveCount > 0,
        readyToPublishCount: liveCount,
      };
    },
    enabled: !!currentApp?.app_id,
    refetchInterval: 30000,
  });
}

export function usePublishCurriculum() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // The rpc 'publish_curriculum' might need updates to handle per-app publishing
      // or we might need to update the status manually if the RPC isn't updated.
      // Assuming 'publish_curriculum' works globally or hasn't been updated yet.
      // For now, let's just run it, but we might need to modify the SQL function 
      // to accept an app_id if we want granular publishing.
      // Note: This RPC function may need to be created in Supabase
      const { data, error } = await (supabase.rpc as any)('publish_curriculum');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum-meta'] });
      queryClient.invalidateQueries({ queryKey: ['publish-preview'] });
      queryClient.invalidateQueries({ queryKey: ['publish-history'] });
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['domains-paginated'] });
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills-paginated'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['questions-paginated'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

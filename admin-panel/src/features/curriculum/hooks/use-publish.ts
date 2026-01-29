/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface CurriculumMeta {
  version: number;
  last_published_at: string | null;
}

interface PublishStats {
  draftDomains: number;
  publishedDomains: number;
  liveDomains: number;
  draftSkills: number;
  publishedSkills: number;
  liveSkills: number;
  draftQuestions: number;
  publishedQuestions: number;
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
  return useQuery({
    queryKey: ['publish-preview'],
    queryFn: async (): Promise<PublishPreview> => {
      const validationIssues: ValidationIssue[] = [];

      const [
        metaResult,
        draftDomainsResult,
        publishedDomainsResult,
        liveDomainsResult,
        draftSkillsResult,
        publishedSkillsResult,
        liveSkillsResult,
        draftQuestionsResult,
        publishedQuestionsResult,
        liveQuestionsResult,
      ] = await Promise.all([
        supabase.from('curriculum_meta').select('version, last_published_at').eq('id', 'singleton').single(),
        supabase.from('domains').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'draft'),
        supabase.from('domains').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'published'),
        supabase.from('domains').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'live'),
        supabase.from('skills').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'draft'),
        supabase.from('skills').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'published'),
        supabase.from('skills').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'live'),
        supabase.from('questions').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'draft'),
        supabase.from('questions').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'published'),
        supabase.from('questions').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'live'),
      ]);

      if (metaResult.error) throw metaResult.error;

      const stats: PublishStats = {
        draftDomains: draftDomainsResult.count ?? 0,
        publishedDomains: publishedDomainsResult.count ?? 0,
        liveDomains: liveDomainsResult.count ?? 0,
        draftSkills: draftSkillsResult.count ?? 0,
        publishedSkills: publishedSkillsResult.count ?? 0,
        liveSkills: liveSkillsResult.count ?? 0,
        draftQuestions: draftQuestionsResult.count ?? 0,
        publishedQuestions: publishedQuestionsResult.count ?? 0,
        liveQuestions: liveQuestionsResult.count ?? 0,
      };

      const readyToPublishCount = stats.publishedDomains + stats.publishedSkills + stats.publishedQuestions;

      if (readyToPublishCount === 0) {
        validationIssues.push({
          type: 'error',
          message: 'Nothing to publish. Mark content as "Published" first to make it ready for release.',
        });
      }

      if (stats.liveDomains === 0 && stats.liveSkills === 0 && stats.liveQuestions === 0) {
        validationIssues.push({
          type: 'warning',
          message: 'No content is currently live. This will be the first release.',
        });
      }

      return {
        meta: metaResult.data as CurriculumMeta,
        stats,
        validationIssues,
        canPublish: readyToPublishCount > 0,
        readyToPublishCount,
      };
    },
    refetchInterval: 30000,
  });
}

export function usePublishCurriculum() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('publish_curriculum');
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

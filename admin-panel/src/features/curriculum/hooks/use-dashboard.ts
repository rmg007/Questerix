/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalDomains: number;
  totalSkills: number;
  totalQuestions: number;
  liveDomains: number;
  liveSkills: number;
  liveQuestions: number;
  draftDomains: number;
  draftSkills: number;
  draftQuestions: number;
  currentVersion: number;
  lastPublishedAt: string | null;
}

interface RecentActivity {
  id: string;
  type: 'domain' | 'skill' | 'question';
  title: string;
  action: 'created' | 'updated';
  timestamp: string;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const [
        domainsResult,
        liveDomainsResult,
        draftDomainsResult,
        skillsResult,
        liveSkillsResult,
        draftSkillsResult,
        questionsResult,
        liveQuestionsResult,
        draftQuestionsResult,
        metaResult,
      ] = await Promise.all([
        supabase.from('domains').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('domains').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'live'),
        supabase.from('domains').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'draft'),
        supabase.from('skills').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('skills').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'live'),
        supabase.from('skills').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'draft'),
        supabase.from('questions').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('questions').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'live'),
        supabase.from('questions').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'draft'),
        supabase.from('curriculum_meta').select('version, last_published_at').eq('id', 'singleton').single(),
      ]);

      if (domainsResult.error) throw domainsResult.error;
      if (skillsResult.error) throw skillsResult.error;
      if (questionsResult.error) throw questionsResult.error;

      return {
        totalDomains: domainsResult.count ?? 0,
        totalSkills: skillsResult.count ?? 0,
        totalQuestions: questionsResult.count ?? 0,
        liveDomains: liveDomainsResult.count ?? 0,
        liveSkills: liveSkillsResult.count ?? 0,
        liveQuestions: liveQuestionsResult.count ?? 0,
        draftDomains: draftDomainsResult.count ?? 0,
        draftSkills: draftSkillsResult.count ?? 0,
        draftQuestions: draftQuestionsResult.count ?? 0,
        currentVersion: (metaResult.data as any)?.version ?? 0,
        lastPublishedAt: (metaResult.data as any)?.last_published_at ?? null,
      };
    },
    refetchInterval: 60000,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async (): Promise<RecentActivity[]> => {
      const [domainsResult, skillsResult, questionsResult] = await Promise.all([
        supabase
          .from('domains')
          .select('id, title, created_at, updated_at')
          .is('deleted_at', null)
          .order('updated_at', { ascending: false })
          .limit(4),
        supabase
          .from('skills')
          .select('id, title, created_at, updated_at')
          .is('deleted_at', null)
          .order('updated_at', { ascending: false })
          .limit(4),
        supabase
          .from('questions')
          .select('id, content, created_at, updated_at')
          .is('deleted_at', null)
          .order('updated_at', { ascending: false })
          .limit(4),
      ]);

      if (domainsResult.error) throw domainsResult.error;
      if (skillsResult.error) throw skillsResult.error;
      if (questionsResult.error) throw questionsResult.error;

      const activities: RecentActivity[] = [];

      (domainsResult.data as any[])?.forEach((d: any) => {
        const isNew = d.created_at === d.updated_at;
        activities.push({
          id: d.id,
          type: 'domain',
          title: d.title,
          action: isNew ? 'created' : 'updated',
          timestamp: d.updated_at,
        });
      });

      (skillsResult.data as any[])?.forEach((s: any) => {
        const isNew = s.created_at === s.updated_at;
        activities.push({
          id: s.id,
          type: 'skill',
          title: s.title,
          action: isNew ? 'created' : 'updated',
          timestamp: s.updated_at,
        });
      });

      (questionsResult.data as any[])?.forEach((q: any) => {
        const isNew = q.created_at === q.updated_at;
        activities.push({
          id: q.id,
          type: 'question',
          title: q.content.substring(0, 50) + (q.content.length > 50 ? '...' : ''),
          action: isNew ? 'created' : 'updated',
          timestamp: q.updated_at,
        });
      });

      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    },
    refetchInterval: 30000,
  });
}

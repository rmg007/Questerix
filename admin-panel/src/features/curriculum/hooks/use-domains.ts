/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import { useApp } from '@/hooks/use-app';

type Domain = Database['public']['Tables']['domains']['Row'];

// Form input type - excludes auto-generated fields
export type DomainFormInput = {
  slug: string;
  title: string;
  description?: string;
  sort_order: number;
  status: 'draft' | 'live';
};

export type CurriculumStatus = 'draft' | 'published' | 'live';

export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: 'all' | 'draft' | 'published' | 'live';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useDomains() {
  const { currentApp } = useApp();

  return useQuery({
    queryKey: ['domains', currentApp?.app_id],
    queryFn: async () => {
      if (!currentApp?.app_id) throw new Error('No app selected');

      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('app_id', currentApp.app_id)
        .is('deleted_at', null)
        .order('sort_order');
      
      if (error) throw error;
      return data as Domain[];
    },
    enabled: Boolean(currentApp?.app_id),
  });
}

export function usePaginatedDomains(params: PaginationParams) {
  const { currentApp } = useApp();

  return useQuery({
    queryKey: ['domains-paginated', params, currentApp?.app_id],
    queryFn: async (): Promise<PaginatedResponse<Domain>> => {
      if (!currentApp?.app_id) throw new Error('No app selected');

      const { page, pageSize, search, status, sortBy = 'sort_order', sortOrder = 'asc' } = params;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('domains')
        .select('*', { count: 'exact' })
        .eq('app_id', currentApp.app_id)
        .is('deleted_at', null);

      if (search) {
        query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%`);
      }

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data as Domain[],
        totalCount: count ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      };
    },
    enabled: Boolean(currentApp?.app_id),
  });
}

export function useDomain(id: string) {
    const { currentApp } = useApp();
    return useQuery({
        queryKey: ['domain', id, currentApp?.app_id],
        queryFn: async () => {
             const { data, error } = await supabase
                .from('domains')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Domain;
        },
        enabled: Boolean(id) && Boolean(currentApp?.app_id),
    });
}

export function useCreateDomain() {
  const queryClient = useQueryClient();
  const { currentApp } = useApp();
  
  return useMutation({
    mutationFn: async (domain: DomainFormInput) => {
      if (!currentApp?.app_id) throw new Error('No app selected');
      
      const payload = {
          ...domain,
          app_id: currentApp.app_id
      };

      const { data, error } = await (supabase
        .from('domains') as any)
        .insert(payload as any) // Cast to any because types might be wrong
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as Domain;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['domains-paginated'] });
    },
  });
}

export function useUpdateDomain() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ domain_id, ...updates }: { domain_id: string } & Partial<Domain>) => {
            const { data, error } = await (supabase
                .from('domains') as any)
                .update(updates as any)
                .eq('domain_id', domain_id)
                .select()
                .single();

            if (error) throw error;
            return data as unknown as Domain;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['domains'] });
            queryClient.invalidateQueries({ queryKey: ['domains-paginated'] });
            queryClient.invalidateQueries({ queryKey: ['domain', (data as any).domain_id] });
        },
    });
}

export function useDeleteDomain() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (domain_id: string) => {
            const { error } = await (supabase
                .from('domains') as any)
                .update({ deleted_at: new Date().toISOString() } as any)
                .eq('domain_id', domain_id);
            
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['domains'] });
            queryClient.invalidateQueries({ queryKey: ['domains-paginated'] });
        },
    });
}

export function useBulkDeleteDomains() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (domain_ids: string[]) => {
            const { error } = await (supabase
                .from('domains') as any)
                .update({ deleted_at: new Date().toISOString() } as any)
                .in('domain_id', domain_ids);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['domains'] });
            queryClient.invalidateQueries({ queryKey: ['domains-paginated'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        },
    });
}

export function useBulkUpdateDomainsStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ ids, status }: { ids: string[]; status: CurriculumStatus }) => {
            const { error } = await (supabase
                .from('domains') as any)
                .update({ status } as any)
                .in('id', ids);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['domains'] });
            queryClient.invalidateQueries({ queryKey: ['domains-paginated'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            queryClient.invalidateQueries({ queryKey: ['publish-preview'] });
        },
    });
}

export function useUpdateDomainOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updates: { id: string; sort_order: number }[]) => {
            const promises = updates.map(({ id, sort_order }) =>
                (supabase.from('domains') as any)
                    .update({ sort_order } as any)
                    .eq('id', id)
            );

            const results = await Promise.all(promises);
            const errors = results.filter(r => r.error);
            if (errors.length > 0) {
                throw errors[0].error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['domains'] });
            queryClient.invalidateQueries({ queryKey: ['domains-paginated'] });
        },
    });
}

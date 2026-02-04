import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

export type Group = Database['public']['Tables']['groups']['Row']

export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })
}

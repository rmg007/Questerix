import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type App = Database['public']['Tables']['apps']['Row'];

interface AppContextType {
  currentApp: App | null;
  setCurrentApp: (app: App) => void;
  apps: App[];
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentApp, setCurrentApp] = useState<App | null>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadApps() {
      try {
        const { data, error } = await supabase
          .from('apps')
          .select('*')
          .order('display_name');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setApps(data);
          // Auto-select first active app or first app
          const activeApp = (data as any[]).find(a => a.is_active) || data[0];
          setCurrentApp(activeApp);
        }
      } catch (err) {
        console.error('Failed to load apps:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadApps();
  }, []);

  return (
    <AppContext.Provider value={{ currentApp, setCurrentApp, apps, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

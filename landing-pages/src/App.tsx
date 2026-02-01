import { useState, useEffect, useCallback } from 'react';
import { RootPage } from './pages/RootPage';
import { SubjectHubPage } from './pages/SubjectHubPage';
import { GradeLandingPage } from './pages/GradeLandingPage';
import { supabase } from './lib/supabase';
import type { Database } from './lib/database.types';

type AppData = Database['public']['Tables']['apps']['Row'] & {
  subjects: Database['public']['Tables']['subjects']['Row'] | null
};

type SubjectData = Database['public']['Tables']['subjects']['Row'];

const getInitialSubdomain = () => {
  const hostname = window.location.hostname;
  // Localhost handling
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    const params = new URLSearchParams(window.location.search);
    return params.get('subdomain');
  }
  // Production handling
  const parts = hostname.split('.');
  if (parts.length > 2) { 
     const subdomain = parts[0];
     if (subdomain !== 'www') return subdomain;
  }
  return null;
};

function App() {
  const [view, setView] = useState<'root' | 'subject' | 'grade'>('root');
  const [data, setData] = useState<AppData | SubjectData | null>(null);
  
  // Initialize loading based on whether we have a subdomain to check
  const [loading, setLoading] = useState(() => !!getInitialSubdomain());

  const handleSubdomain = useCallback(async (subdomain: string) => {
     console.log('Handling subdomain:', subdomain);
     
     // 1. Try to find an App (e.g. m7)
     const { data: appData, error: appError } = await supabase
       .from('apps')
       .select('*, subjects(*)')
       .eq('subdomain', subdomain)
       .maybeSingle();

     if (appError) console.error(appError);
      
     if (appData) {
       console.log('Found App:', appData);
       setView('grade');
       setData(appData);
       setLoading(false);
       return;
     }

     // 2. Try to find a Subject (e.g. math)
     const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('*')
        .eq('slug', subdomain)
        .maybeSingle();

     if (subjectError) console.error(subjectError);

      if (subjectData) {
        console.log('Found Subject:', subjectData);
        setView('subject');
        setData(subjectData);
        setLoading(false);
        return;
      }

      console.log('No match found for subdomain. Defaulting to root.');
      // If nothing found, maybe show 404 or redirect to root
      setLoading(false);
  }, []);

  useEffect(() => {
    const subdomain = getInitialSubdomain();
    if (subdomain) {
      // eslint-disable-next-line
      handleSubdomain(subdomain);
    }
  }, [handleSubdomain]);

  if (loading) return (
     <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
     </div>
  );

  if (view === 'grade') return <GradeLandingPage app={data as AppData} />;
  if (view === 'subject') return <SubjectHubPage subject={data as SubjectData} />;
  return <RootPage />;
}

export default App;

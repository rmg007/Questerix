import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          navigate('/login')
          return
        }
        setLoading(false)
      } catch (e) {
        console.error(e)
        navigate('/login')
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login')
      } else if (event === 'SIGNED_IN') {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

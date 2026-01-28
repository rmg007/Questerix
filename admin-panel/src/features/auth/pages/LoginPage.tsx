import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setError(error.message)
    } else {
      navigate("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Math7 Admin</h1>
            <p className="text-gray-500 mt-2">Sign in to your dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                {...register("email")} 
                className={`h-12 px-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input 
                type="password" 
                placeholder="Enter your password" 
                {...register("password")} 
                className={`h-12 px-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 ${errors.password ? "border-red-500" : ""}`}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <p className="text-center text-gray-400 text-sm mt-6">
            Curriculum Management System
          </p>
        </div>
      </div>
    </div>
  )
}

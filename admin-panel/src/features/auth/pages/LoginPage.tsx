import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  inviteCode: z.string().min(1, "Invitation code is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>
type RegisterFormValues = z.infer<typeof registerSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isRegister, setIsRegister] = useState(false)
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onLogin = async (data: LoginFormValues) => {
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

  const onRegister = async (data: RegisterFormValues) => {
    setError(null)
    
    const expectedCode = import.meta.env.VITE_ADMIN_INVITE_CODE || 'math7admin2024'
    if (data.inviteCode !== expectedCode) {
      setError("Invalid invitation code")
      return
    }
    
    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: undefined,
        data: {
          full_name: data.fullName,
          role: 'admin',
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    navigate("/")
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
            <p className="text-gray-500 mt-2">
              {isRegister ? "Create your account" : "Sign in to your dashboard"}
            </p>
          </div>
          
          {isRegister ? (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input 
                  type="text" 
                  placeholder="Enter your full name" 
                  {...registerForm.register("fullName")} 
                  className={`h-12 px-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 ${registerForm.formState.errors.fullName ? "border-red-500" : ""}`}
                />
                {registerForm.formState.errors.fullName && <p className="text-sm text-red-500">{registerForm.formState.errors.fullName.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  {...registerForm.register("email")} 
                  className={`h-12 px-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 ${registerForm.formState.errors.email ? "border-red-500" : ""}`}
                />
                {registerForm.formState.errors.email && <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input 
                  type="password" 
                  placeholder="Enter your password" 
                  {...registerForm.register("password")} 
                  className={`h-12 px-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 ${registerForm.formState.errors.password ? "border-red-500" : ""}`}
                />
                {registerForm.formState.errors.password && <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Invitation Code</label>
                <Input 
                  type="text" 
                  placeholder="Enter your invitation code" 
                  {...registerForm.register("inviteCode")} 
                  className={`h-12 px-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 ${registerForm.formState.errors.inviteCode ? "border-red-500" : ""}`}
                />
                {registerForm.formState.errors.inviteCode && <p className="text-sm text-red-500">{registerForm.formState.errors.inviteCode.message}</p>}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl" 
                disabled={registerForm.formState.isSubmitting}
              >
                {registerForm.formState.isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          ) : (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  {...loginForm.register("email")} 
                  className={`h-12 px-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 ${loginForm.formState.errors.email ? "border-red-500" : ""}`}
                />
                {loginForm.formState.errors.email && <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input 
                  type="password" 
                  placeholder="Enter your password" 
                  {...loginForm.register("password")} 
                  className={`h-12 px-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 ${loginForm.formState.errors.password ? "border-red-500" : ""}`}
                />
                {loginForm.formState.errors.password && <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl" 
                disabled={loginForm.formState.isSubmitting}
              >
                {loginForm.formState.isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister)
                setError(null)
              }}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              {isRegister 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Register"
              }
            </button>
          </div>
          
          <p className="text-center text-gray-400 text-sm mt-6">
            Curriculum Management System
          </p>
        </div>
      </div>
    </div>
  )
}

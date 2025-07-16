/* src/app/login/page.tsx */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabaseClient'

/* -------- validation schema -------- */
const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof Schema>

export default function LoginPage() {
  const router = useRouter()
  const [errMsg, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    mode: 'onChange',
  })

  async function onSubmit({ email, password }: FormData) {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setErr(error.message)
    router.push('/dashboard')
  }

  async function resetPw() {
    const email = (document.getElementById('email') as HTMLInputElement)?.value
    if (!email) return setErr('Enter your e-mail first')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/login/reset`,
    })
    setErr(error ? error.message : 'Password reset link sent!')
  }

  return (
    <div className="max-w-sm mx-auto py-16 space-y-8 text-center">
      <h1 className="text-3xl font-bold text-orange-600">Login to Manage<br />Your Account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="text-left space-y-1">
          <label htmlFor="email" className="font-medium">Username or email address <span className="text-red-600">*</span></label>
          <input id="email" type="email" placeholder="E-mail address" {...register('email')}
                 className="input-field"/>
          {errors.email && <p className="text-red-600 text-xs">{errors.email.message}</p>}
        </div>

        <div className="text-left space-y-1">
          <label htmlFor="pw" className="font-medium">Password <span className="text-red-600">*</span></label>
          <input id="pw" type="password" placeholder="Password" {...register('password')}
                 className="input-field"/>
          {errors.password && <p className="text-red-600 text-xs">{errors.password.message}</p>}
        </div>

        {/* Reset link + submit */}
        <div className="flex items-center justify-between">
          <button type="button" onClick={resetPw} className="text-blue-600 text-sm hover:underline">
            Reset Your Password
          </button>
          <button type="submit" className="btn-secondary disabled:opacity-60" disabled={!isValid || loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </div>

        <label className="inline-flex items-center gap-2 text-sm mt-2">
          <input type="checkbox" className="accent-emerald-600" disabled />
          Remember me
        </label>

        {errMsg && <p className="text-red-600 text-sm mt-4">{errMsg}</p>}
      </form>
    </div>
  )
}

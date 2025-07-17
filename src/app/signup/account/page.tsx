'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWizard } from '@/components/signup/WizardStore'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabaseClient'

/* ---------- validation ---------- */
const Schema = z
  .object({
    password: z.string().min(6, 'At least 6 characters'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  })

type FormData = z.infer<typeof Schema>

function AccountPageContent() {
  const router = useRouter()
  const { data, update, setStep } = useWizard()
  const [errMsg, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  /* guard: need previous steps complete */
  useEffect(() => {
    setStep(2) // main step index: Account
    if (!data.address || !data.firstName) router.replace('/signup/delivery/contact')
  }, [data.address, data.firstName, setStep, router])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    mode: 'onChange',
  })

  async function onSubmit(f: FormData) {
    setErr(null)
    setLoading(true)

    /* Supabase sign-up */
    const { error } = await supabase.auth.signUp({
      email: data.email!,
      password: f.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          dob: data.dob,
        },
      },
    })

    setLoading(false)
    if (error) return setErr(error.message)

    update({ password: '🗝' }) // store placeholder (not real pw)
    router.push('/signup/confirm') // next step
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Create your account</h1>
      <p className="text-center text-slate-600">
        Your e-mail will be your username. We'll send a confirmation link after sign-up.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block font-medium mb-1">E-mail</label>
          <input value={data.email ?? ''} disabled className="input-field opacity-70" />
        </div>
        <div>
          <label className="block font-medium mb-1">Password *</label>
          <input type="password" {...register('password')} className="input-field" />
          {errors.password && <p className="text-red-600 text-xs">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Repeat password *</label>
          <input type="password" {...register('confirm')} className="input-field" />
          {errors.confirm && <p className="text-red-600 text-xs">{errors.confirm.message}</p>}
        </div>
        {errMsg && <p className="text-red-600 text-sm">{errMsg}</p>}
        <div className="flex justify-between mt-6">
          <button type="button" onClick={() => router.back()} className="btn-oauth">
            ← Back
          </button>
          <button type="submit" className="btn-primary" disabled={!isValid || loading}>
            {loading ? 'Creating…' : 'Next →'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto text-center">Loading...</div>}>
      <AccountPageContent />
    </Suspense>
  )
}
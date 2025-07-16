/*  src/app/signup/plan/email/page.tsx  */
'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useWizard } from '@/components/signup/WizardStore'
import { useRouter } from 'next/navigation'
import React from 'react'

/* ---------- schema ---------- */
const Schema = z.object({
  email: z.string().email({ message: 'Enter a valid e-mail address' }),
})

type FormData = z.infer<typeof Schema>

/* ---------- component ---------- */
export default function EmailPage() {
  const router = useRouter()
  const { data, update, setStep } = useWizard()

  /* set main/sub step once */
  React.useEffect(() => setStep(0), [setStep])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    mode: 'onChange',
    defaultValues: { email: data.email ?? '' },
  })

  const onSubmit = async ({ email }: FormData) => {
    update({ email })
    /* auto-save draft (fire-and-forget) */
    fetch('/api/draft/save', {
      method: 'POST',
      body: JSON.stringify({ current_step: 0, payload: { email } }),
    }).catch(() => {})
    router.push('/signup/plan/quantity')
  }

  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <h1 className="text-2xl font-bold">Let’s get started</h1>

      <p className="text-slate-600">
        Enter your e-mail to begin customising your weekly bone-broth delivery.
        We’ll never sell or share your information.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <input
          type="email"
          placeholder="E-mail address"
          {...register('email')}
          className={`w-full rounded border px-4 py-2 ${
            errors.email ? 'border-red-500' : 'border-slate-300'
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}

        <button
          type="submit"
          className="btn-primary mt-4"
          disabled={!isValid}
        >
          Let’s&nbsp;Get&nbsp;Started&nbsp;→
        </button>
      </form>

      <p className="text-sm text-slate-500">
        Already have an account?{' '}
        <a href="/login" className="text-emerald-600 hover:underline">
          Sign&nbsp;in
        </a>{' '}
        &nbsp;|&nbsp;{' '}
        <a href="#" className="text-emerald-600 hover:underline">
          I&nbsp;have&nbsp;a&nbsp;promo&nbsp;code
        </a>
      </p>
    </div>
  )
}

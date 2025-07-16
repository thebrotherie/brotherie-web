'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWizard } from '@/components/signup/WizardStore'
import { TIERS, TierId } from '@/components/signup/TierSelect'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loadStripe } from '@stripe/stripe-js'
import {PriceTag} from '@/components/Pricetag'

/* ---------- stripe ---------- */
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

/* ---------- schema (final T&C tick) ---------- */
const Schema = z.object({ agree: z.boolean() }).refine((d)=>d.agree,{
  path:['agree'], message:'Please accept T&C'
})
type FormData = z.infer<typeof Schema>

/* ---------- helpers ---------- */
const splitLabel = (c: number, b: number) =>
  c === 0 ? 'All beef'
  : b === 0 ? 'All chicken'
  : c === b ? 'Even split'
  : c > b ? 'Mostly chicken' : 'Mostly beef'

export default function ConfirmPage() {
  const router = useRouter()
  const { data, setStep } = useWizard()
  const [loading, setLoading] = useState(false)
  const [errMsg, setErr] = useState<string | null>(null)

  /* guard: need account created */
  useEffect(() => {
    setStep(3)                                      // main step index Confirm
    if (!data.password) router.replace('/signup/account')
  }, [data.password, setStep, router])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    mode: 'onChange',
  })

  if (!data.tierId || !data.address) return null   // still loading wizard

  const tier   = TIERS.find(t => t.id === data.tierId as TierId)!
  const price  = tier.price
  const first  = +(price * 0.9).toFixed(2)         // 10 % promo
  const split  = splitLabel(data.chickenCt!, data.beefCt!)

  /* ---------- submit (Stripe checkout) ---------- */
  const pay = async () => {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout-session', {
      method: 'POST',
      body: JSON.stringify({
        tierId: tier.id,
        price: first,
        email: data.email,
        promo: 'FIRST10',
      }),
    })
    if (!res.ok) {
      setErr('Failed to start payment, please try again.')
      setLoading(false)
      return
    }
    const { id } = await res.json()
    const stripe = await stripePromise
    await stripe?.redirectToCheckout({ sessionId: id })
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Review &amp; confirm</h1>

      {/* -------- summary card -------- */}
      <div className="border rounded-lg p-6 space-y-2">
        <p><strong>Plan:</strong> {tier.name} – {split}</p>
        <p><strong>Weekly cost:</strong>{' '}
          <s className="text-slate-500">${price}</s></p>
          <p><strong>Promotional cost:</strong>{' '}
          <span className="text-emerald-600 font-semibold"><PriceTag amount={first} useIntl /></span>{' '}
          <span className="text-xs">(10% discount for the first-week, then recurring at ${price})</span></p>
                <hr />
        <p><strong>Deliver to:</strong><br/>
          {data.address.street}{data.address.unit ? `, ${data.address.unit}` : ''}<br/>
          {data.address.city}, 'MA' {data.address.zip}</p>
        <p><strong>Contact:</strong><br/>
          {data.firstName} {data.lastName}<br/>
          {data.phone}{data.smsOk ? ' (Text Alerts: Yes)' : ''}</p>
      </div>

      {/* ---------- T&C & pay ---------- */}
      <form onSubmit={handleSubmit(pay)} className="space-y-4">
        <label className="items-center gap-2 text-sm">
          <input type="checkbox" className="accent-emerald-600" {...register('agree')} />
          &nbsp;&nbsp;By ticking here I agree to &nbsp;
          <a href="/legal/terms" target="_blank" className="text-emerald-600 hover:underline">
            The Brotherie Terms &amp; Conditions. 
          </a>           
          <p className="text-xs text-slate-500 text-left">
        Note that weekly deliveries billed each Thursday at 10:00 AM prior to delivery week.<br/>
        Skip or cancel any week before that deadline.
      </p>
        </label>
        {errors.agree && <p className="text-red-600 text-xs">{errors.agree.message}</p>}
        {errMsg && <p className="text-red-600 text-sm">{errMsg}</p>}

        <div className="flex justify-between">
          <button type="button" onClick={() => router.back()} className="btn-oauth">
            ← Back
          </button>
          <button type="submit" className="btn-primary" disabled={!isValid || loading}>
            {loading ? 'Redirecting…' : 'Proceed to payment →'}
          </button>
        </div>
      </form>

      
    </div>
  )
}

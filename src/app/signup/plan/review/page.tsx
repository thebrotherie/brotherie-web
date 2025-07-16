'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWizard } from '@/components/signup/WizardStore'
import { TIERS, TierId } from '@/components/signup/TierSelect'
import {PriceTag} from '@/components/Pricetag'

export default function ReviewPage() {
  const router = useRouter()
  const { data, setStep } = useWizard()

  /* ── Guard + step indicator ───────────────────────── */
  useEffect(() => {
    setStep(0)                                               // still on Plan
    if (!data.tierId || data.chickenCt === undefined) {
      router.replace('/signup/plan/quantity')
    }
  }, [data.tierId, data.chickenCt, router, setStep])
  /* --------------------------------------------------- */

  if (!data.tierId) return null

  /* ---------- helpers ---------- */
  const tier   = TIERS.find(t => t.id === data.tierId as TierId)!
  const total  = tier.price
  const first  = +(total * 0.9).toFixed(2)  // 10 % off
  const splitLabel = getSplitLabel(data.chickenCt!, data.beefCt!)

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <h1 className="text-xl font-semibold">Review your plan</h1>

      <div className="rounded-lg border p-6 text-left space-y-2">
        <p><span className="font-medium">Plan Name:</span> {tier.name}</p>
        <p><span className="font-medium">Description:</span> {splitLabel}</p>
        <p>
          <span className="font-medium">Weekly cost:</span>{' '}
          <s className="text-slate-500">${total}</s>{' '}
          <span className="text-emerald-600 font-medium">
            <PriceTag amount={first} useIntl /> <span className="text-sm font-normal">(10 % first-week)</span>
          </span>
        </p>
      </div>

      <button
        className="btn-primary"
        onClick={() => router.push('/signup/delivery/address')}
      >
        Looks good →<span className="sr-only">proceed to delivery info</span>
      </button>
    </div>
  )
}

/* --- util to generate split label --- */
function getSplitLabel(chickenCt: number, beefCt: number) {
  if (chickenCt === 0) return 'All beef'
  if (beefCt === 0)    return 'All chicken'
  const pct = chickenCt / (chickenCt + beefCt)
  if (pct === 0.5) return 'Even split'
  return pct > 0.5 ? 'Mostly chicken' : 'Mostly beef'
}

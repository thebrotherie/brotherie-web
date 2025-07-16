'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWizard } from '@/components/signup/WizardStore'
import { TIERS } from '@/components/signup/TierSelect'          // single source of truth
import { Check } from 'lucide-react'

type TierId = 'sip' | 'daily' | 'chef'

export default function QuantityPage() {
  const router = useRouter()
  const { data, update, setStep } = useWizard()

  /*— guard: need email first —*/
  useEffect(() => {
    setStep(0)                              // main step = Plan
    if (!data.email) router.replace('/signup/plan/email')
  }, [data.email, router, setStep])

  /* selected = tier id (sip|daily|chef) */
  //const [selId, setSelId] = useState<'sip' | 'daily' | 'chef'>(data.tierId ?? 'daily')

  //function choose(id: 'sip' | 'daily' | 'chef') {
const [selId, setSelId] = useState<TierId>(
    (data.tierId ?? 'daily') as TierId
    )
    function choose(id: TierId) {
  setSelId(id)
    const tier = TIERS.find(t => t.id === id)!
    update({ tierId: id, tierQty: tier.containers as 4 | 8 | 12 })
  }

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <h1 className="text-xl font-semibold">How much broth each week?</h1>
      <p className="text-slate-600">
        Select the plan that matches your family’s appetite. You can change it anytime.
      </p>

      {/* ----- quantity cards ----- */}
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map(tier => {
          const isSel = tier.id === selId
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => choose(tier.id)}
              className={`
                relative rounded-lg border p-4 w-full text-left cursor-pointer
                hover:shadow transition
                ${isSel ? 'border-emerald-600 ring-2 ring-emerald-600' : 'border-slate-300'}
              `}
            >
              {isSel && <Check size={20} className="absolute top-2 right-2 text-emerald-600" />}
              <h2 className="text-lg font-semibold mb-1">{tier.name}</h2>
              <p className="text-slate-500 text-sm">
                {tier.containers} × {tier.sizeOz}&nbsp;oz containers
              </p>
            </button>
          )
        })}
      </div>

      <button
        className="btn-primary"
        disabled={!selId}
        onClick={() => router.push('/signup/plan/split')}
      >
        Next&nbsp;→
      </button>
    </div>
  )
}

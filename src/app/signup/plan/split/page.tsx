'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWizard } from '@/components/signup/WizardStore'
import { Check } from 'lucide-react'

/* --- option presets (in containers, not %) --- */
const OPTIONS = [
  { id: 'all-chicken',  label: 'All chicken',      chicken: 1,  beef: 0 },
  { id: 'mostly-chick', label: 'Mostly chicken',   chicken: 0.75, beef: 0.25 },
  { id: 'even',         label: 'Even split',       chicken: 0.5,  beef: 0.5 },
  { id: 'mostly-beef',  label: 'Mostly beef',      chicken: 0.25, beef: 0.75 },
  { id: 'all-beef',     label: 'All beef',         chicken: 0,    beef: 1 },
] as const
type OptionId = typeof OPTIONS[number]['id']

export default function SplitPage() {
  const router = useRouter()
  const { data, update, setStep } = useWizard()

  /* guard: need tierQty from previous page */
  useEffect(() => {
    setStep(0)                       /** still in Plan main step **/
    if (!data.tierQty) router.replace('/signup/plan/quantity')
  }, [data.tierQty, router, setStep])

  const [sel, setSel] = useState<OptionId | null>(null)

  function choose(o: (typeof OPTIONS)[number]) {
    const qty = data.tierQty ?? 0
    const chickenCt = Math.round(qty * o.chicken)
    const beefCt    = qty - chickenCt
    setSel(o.id)
    update({ chickenCt, beefCt })
  }

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <h1 className="text-xl font-semibold">Chicken vs. Beef</h1>
      <p className="text-slate-600">
        Tell us how you’d like your {data.tierQty ?? '—'} containers split each week.
        You can adjust anytime.
      </p>

      {/* options */}
      <div className="grid gap-4">
        {OPTIONS.map(o => {
          const isSel = o.id === sel
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(o)}
              className={`relative rounded-lg border px-4 py-3 text-left cursor-pointer
                         hover:shadow transition
                         ${isSel ? 'border-emerald-600 ring-2 ring-emerald-600' : 'border-slate-300'}`}
            >
              {isSel && <Check size={18} className="absolute top-2 right-2 text-emerald-600" />}
              <span className="font-medium">{o.label}</span>
            </button>
          )
        })}
      </div>

      {/* nav buttons */}
      <div className="mt-8 flex justify-between">
        <button onClick={()=>router.back()} className="btn-oauth">← Back</button>
        <button
          className="btn-primary"
          disabled={!sel}
          onClick={()=>router.push('/signup/plan/review')}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

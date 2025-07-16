'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Check, Star } from 'lucide-react'

export type TierId = 'sip' | 'daily' | 'chef'

/* ---------- Tier catalogue (edit in one place) ---------- */
export type TierOption = {
  id: 'sip' | 'daily' | 'chef'
  name: string
  containers: number
  sizeOz: number
  price: number
  tagline: string
  savings?: string
  popular?: boolean
  image: string
}

export const TIERS: TierOption[] = [
  {
    id: 'sip',
    name: 'The Sipper',
    containers: 4,
    sizeOz: 18,
    price: 46,
    tagline: 'Occasional wellness boost',
    image: '/images/chicken_broth.jpg',
  },
  {
    id: 'daily',
    name: 'Daily Ritual',
    containers: 8,
    sizeOz: 18,
    price: 88,
    tagline: 'A nourishing cup every day',
    savings: 'Save $4 / week',
    popular: true,
    image: '/images/beef_broth.jpg',
  },
  {
    id: 'chef',
    name: 'Kitchen Hero',
    containers: 12,
    sizeOz: 18,
    price: 126,
    tagline: 'Sip & cook all week',
    savings: 'Save $12 / week',
    image: '/images/hero_broth.jpg',
  },
]

/* ---------- Component ---------- */
interface Props {
  defaultId?: TierOption['id']
  onSelect?: (id: TierOption['id']) => void
}

export default function TierSelect({ defaultId = 'daily', onSelect }: Props) {
  const [selected, setSelected] = useState<TierOption['id']>(defaultId)

  function choose(id: TierOption['id']) {
    setSelected(id)
    onSelect?.(id)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {TIERS.map((tier) => {
        const isSel = tier.id === selected
        return (
          <div
            key={tier.id}
            role="button"
            onMouseDown={(e) => e.preventDefault()}      /* 🔒 no focus scroll */
            onClick={() => choose(tier.id)}
            className={`
              cursor-pointer relative flex flex-col border bg-white shadow-sm
              transition-transform transform-gpu hover:scale-105 fixed-card-h
              ${isSel
                ? 'ring-2 ring-emerald-600 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105'
                : 'border-slate-200'}
            `}
          >
            {tier.popular && (
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
                <Star size={12} /> Most&nbsp;Popular
              </div>
            )}

            <Image
              src={tier.image}
              alt=""
              width={600}
              height={260}
              className="w-full h-44 object-cover"
            />

            <div className="p-6 flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{tier.name}</h3>
                {isSel && <Check size={20} className="text-emerald-600" />}
              </div>

              <p className="text-slate-500">{tier.tagline}</p>

              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mt-2">
                <li>
                  {tier.containers} × {tier.sizeOz} oz containers
                </li>
                <li>Custom chicken/beef mix at checkout</li>
                <li>Free Tuesday delivery</li>
              </ul>

              {tier.savings && (
                <p className="text-emerald-600 text-sm font-medium mt-2">
                  {tier.savings}
                </p>
              )}

              <span className="mt-auto text-sm text-slate-400">
                <strong>${tier.price}</strong> / week
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

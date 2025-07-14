'use client'
import Image from 'next/image'
import { useState } from 'react'
import { Check, Star } from 'lucide-react'

/* ==== Business data (single source of truth) ==================== */
type Tier = {
  id: 'sip' | 'daily' | 'chef'
  name: string
  containers: number
  sizeOz: number
  price: number
  tagline: string
  savings?: string    // optional line like “Save $4/wk”
  popular?: boolean
  image: string
}

const TIERS: Tier[] = [
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
    price: 126,               // updated price
    tagline: 'Sip & cook all week',
    savings: 'Save $12 / week',
    image: '/images/hero_broth.jpg',
  },
]

const FREE_DELIVERY_THRESHOLD = 45
/* =============================================================== */

export default function ProductsPage() {
  const [selectedTier, setSelectedTier] = useState<Tier>(TIERS[1]) /* Daily pre-selected */

  /* ---------- Tier Card ---------- */
  const TierCard = ({ tier }: { tier: Tier }) => {
    const isSelected = tier.id === selectedTier.id
    return (
      <div
        role="button"
        onClick={(e) => {
          e.preventDefault()
          setSelectedTier(tier)
        }}
        className={`
          cursor-pointer
          relative flex flex-col border bg-white shadow-sm 
          transition-transform transform-gpu hover:scale-105
          fixed-card-h
          ${isSelected 
            ? 'ring-2 ring-emerald-600 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105' : 'border-slate-200'}
        `}
      >
        {/* “Most Popular” banner */}
        {tier.popular && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
            <Star size={12} /> Most&nbsp;Popular
          </div>
        )}

        {/* smaller image */}
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
            {isSelected && <Check size={20} className="text-emerald-600" />}
          </div>

          <p className="text-slate-500">{tier.tagline}</p>

          {/* bullets */}
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mt-2">
            <li>{tier.containers} × {tier.sizeOz} oz containers</li>
            <li>Custom chicken/beef mix at checkout</li>
            <li>Free delivery over ${FREE_DELIVERY_THRESHOLD}</li>
          </ul>

          {/* savings line */}
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
  }

  /* ---------- Feature block (unchanged layout but square images) ---------- */
  const FeatureBlock = ({
    img, heading, text, reverse=false,
  }: { img:string; heading:string; text:string; reverse?:boolean }) => (
    <div className={`full-bleed py-8 ${reverse ? 'bg-slate-50' : ''}`}>
      <div className={`mx-auto max-w-6xl flex flex-col gap-8 px-4
                       ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
        <Image src={img} alt="" width={550} height={380} className="w-full lg:w-1/2 object-cover" />
        <div className="lg:w-1/2 space-y-4 flex flex-col justify-center text-center lg:text-left">
          <h2 className="text-2xl font-semibold">{heading}</h2>
          <p className="text-slate-600">{text}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {/* HERO omitted for brevity (unchanged) */}

      {/* SHOWCASE blocks */}
      <FeatureBlock
        img="/images/chicken_broth.jpg"
        heading="Chicken Bone Broth"
        text="Pasture-raised backs, necks & feet, simmered 18 h for collagen-rich sips that love your joints & skin."
      />
      <FeatureBlock
        img="/images/beef_broth.jpg"
        heading="Beef Bone Broth"
        text="Grass-fed marrow & knuckle bones, slow-cooked 24 h—deep flavor and gut-friendly gelatin in every cup."
        reverse
      />

      {/* brew line */}
      <section className="bg-emerald-600 py-2 text-center text-sm text-white">
        Fresh broth brewed every Monday, delivered Tuesdays.
      </section>

      {/* SUBSCRIPTIONS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Weekly Subscriptions</h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-slate-600">
          Select a plan below. Pay weekly, <strong>free delivery over ${FREE_DELIVERY_THRESHOLD}</strong>,
          and pause or cancel any time—no strings attached!
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          {TIERS.map(tier => <TierCard key={tier.id} tier={tier} />)}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            disabled={!selectedTier}
            onClick={() =>
              alert(`Proceed to signup: tier=${selectedTier.name}
Price=$${selectedTier.price} | Containers=${selectedTier.containers}`)}
            className={`rounded bg-emerald-600 px-6 py-3 text-white font-semibold transition
                        ${selectedTier ? 'hover:bg-emerald-700' : 'opacity-60 cursor-not-allowed'}`}
          >
            {selectedTier ? 'Subscribe Now' : 'Select a tier to continue'}
          </button>
        </div>
      </section>
    </div>
  )
}

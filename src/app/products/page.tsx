'use client'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TierSelect, { TIERS } from '@/components/signup/TierSelect'

/* ---------- Helper: alternating feature blocks ---------- */
function FeatureBlock({
  img,
  heading,
  text,
  reverse = false,
}: {
  img: string
  heading: string
  text: string
  reverse?: boolean
}) {
  return (
    <div className={`full-bleed py-8 ${reverse ? 'bg-slate-50' : ''}`}>
      <div
        className={`mx-auto max-w-6xl flex flex-col gap-8 px-4 ${
          reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
        }`}
      >
        <Image
          src={img}
          alt=""
          width={550}
          height={380}
          className="w-full lg:w-1/2 object-cover"
        />
        <div className="lg:w-1/2 space-y-4 flex flex-col justify-center text-center lg:text-left">
          <h2 className="text-2xl font-semibold">{heading}</h2>
          <p className="text-slate-600">{text}</p>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const router = useRouter()
  const [selectedTier, setSelectedTier] =
    useState<'sip' | 'daily' | 'chef'>('daily')

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative h-72 w-full">
        <Image
          src="/images/hero_broth.jpg"
          alt="Golden broth jars"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-xl">
            Our Broths
          </h1>
        </div>
      </section>

      {/* ---------- SHOWCASE ---------- */}
      <FeatureBlock
        img="/images/chicken_broth.jpg"
        heading="Chicken Bone Broth"
        text="Pasture-raised backs, necks & feet, simmered 18 hours for collagen-rich sips that love your joints & skin."
      />
      <FeatureBlock
        img="/images/beef_broth.jpg"
        heading="Beef Bone Broth"
        text="Grass-fed marrow & knuckle bones, slow-cooked 24 hours—deep flavor and gut-friendly gelatin in every cup."
        reverse
      />

      {/* ---------- BREW NOTE ---------- */}
      <section className="bg-emerald-600 py-2 text-center text-sm text-white">
        Fresh broth brewed every Monday, delivered Tuesdays.
      </section>

      {/* ---------- SUBSCRIPTIONS ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">
          Weekly Subscriptions
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-slate-600">
          Choose a plan below. Free Tuesday delivery is included with every
          subscription, and you can pause, skip, or cancel any week—no strings
          attached!
        </p>

        {/* unified picker */}
        <TierSelect
          defaultId="daily"
          onSelect={(id) => setSelectedTier(id)}
        />

        {/* subscribe CTA */}
        <div className="mt-10 text-center">
          <button
            type="button"
            disabled={!selectedTier}
            onClick={() =>
              router.push(`/signup/plan/email?tier=${selectedTier}`)            }
            className={`rounded bg-emerald-600 px-6 py-3 text-white font-semibold transition
                        ${
                          selectedTier
                            ? 'hover:bg-emerald-700'
                            : 'opacity-60 cursor-not-allowed'
                        }`}
          >
            {selectedTier ? 'Subscribe Now' : 'Select a tier to continue'}
          </button>
        </div>
      </section>
    </div>
  )
}

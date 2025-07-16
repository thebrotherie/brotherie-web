/* src/app/signup/delivery/address/page.tsx */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWizard } from '@/components/signup/WizardStore'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DELIVERY_DAY } from '@/lib/constants'

/* ---------- constants ---------- */
const ALLOWED_ZIPS = [
  '02474', '02476', '02478', '01801', '01890',
  '01742', '02420', '02421', '01803',
]

/* ---------- schema ---------- */
const Schema = z.object({
  street: z.string().min(3),
  unit: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string().length(5),
  instructions: z.string().max(200).optional(),
})
type FormData = z.infer<typeof Schema>

/* ---------- component ---------- */
export default function AddressPage() {
  const router = useRouter()
  const { data, update, setStep } = useWizard()

  /* guard */
  useEffect(() => {
    setStep(1)                                  // Delivery step
    if (!data.tierId) router.replace('/signup/plan/email')
  }, [data.tierId, router, setStep])

  /* RHF */
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    mode: 'onChange',
    defaultValues: data.address
      ? {
          street: data.address.street,
          city: data.address.city,
          state: 'MA',
          zip: data.address.zip,
          instructions: data.instructions,
        }
      : {},
  })

  /* ---------- local state ---------- */
  const [search, setSearch] = useState('')
  const [locked, setLocked] = useState(false)
  const [preds, setPreds] = useState<google.maps.places.AutocompletePrediction[]>([])

  /* ---------- autocomplete fetch ---------- */
  useEffect(() => {
    if (!search || locked) return setPreds([])

    const g = (window as any).google
    if (!g?.maps?.places) return

    const Ctor =
      (g.maps.places as any).AutocompleteSuggestionService ??
      g.maps.places.AutocompleteService

    if (!Ctor) return                                 // script not ready yet

    const svc = new Ctor()
    svc.getPlacePredictions(
      { input: search, types: ['address'], language: 'en' },
      (p: google.maps.places.AutocompletePrediction[] | null) => setPreds(p ?? [])
    )
  }, [search])

  /* ---------- on select prediction ---------- */
  async function handlePick(p: google.maps.places.AutocompletePrediction) {
    setPreds([])                 // close dropdown
    setSearch(p.description)     // freeze input
    setLocked(true) //stop further fetches

    const g = (window as any).google
    const geocoder = new g.maps.Geocoder()

    geocoder.geocode({ placeId: p.place_id }, (res: any, status: string) => {
      if (status !== 'OK' || !res?.length) return

      const place = res[0] as google.maps.GeocoderResult
      const find = (t: string) =>
        place.address_components.find((c) => c.types.includes(t))?.long_name ?? ''
      const findShort = (t: string) =>
        place.address_components.find((c) => c.types.includes(t))?.short_name ?? ''

      const street = [
        find('street_number'),
        find('route'),
      ].filter(Boolean).join(' ') || place.formatted_address.split(',')[0]

      setValue('street', street, { shouldValidate: true })
      setValue('city',   find('locality') || find('postal_town') || find('sublocality_level_1'), { shouldValidate: true })
      setValue('state',  findShort('administrative_area_level_1') || 'MA', { shouldValidate: true })
      setValue('zip',    findShort('postal_code'), { shouldValidate: true })
      clearErrors()
    })
  }

  /* ---------- submit ---------- */
  async function onSubmit(f: FormData) {
    const inZone = ALLOWED_ZIPS.includes(f.zip)

    if (!inZone) {
      await fetch('/api/interest', {
        method: 'POST',
        body: JSON.stringify({ email: data.email, zip: f.zip, street: f.street }),
      }).catch(() => {})
      alert('We are not in your area yet, but we have added your zip to our interest list. Thank you!')
      router.push('/products')
      return
    }

    update({
      address: { street: f.street, unit: f.unit, city: f.city, zip: f.zip },
      instructions: f.instructions,
    })
    router.push('/signup/delivery/contact')
  }

  /* ---------- UI ---------- */
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Delivery Information</h1>
      <p className="text-center text-slate-600">
        We currently deliver to Arlington, Belmont, Burlington, Concord,
        Lexington, Winchester &amp; Woburn every <strong>{DELIVERY_DAY}</strong>.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Street address */}
        <div>
          <label className="block font-medium mb-1">Street address *</label>
          <input
            type="text"
            placeholder="123 Main St"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
          />
          {preds.length > 0 && (
            <ul className="border rounded bg-white shadow mt-1 max-h-56 overflow-auto">
              {preds.map((p) => (
                <li
                  key={p.place_id}
                  className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                  onClick={() => handlePick(p)}
                >
                  {p.description}
                </li>
              ))}
            </ul>
          )}
          {errors.street && <p className="text-red-600 text-xs">{errors.street.message}</p>}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Unit / Apt (optional)</label>
            <input type="text" placeholder="Unit" {...register('unit')} className="input-field" />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">ZIP *</label>
            <input type="text" placeholder="02474" {...register('zip')} className="input-field" />
            {errors.zip && <p className="text-red-600 text-xs">{errors.zip.message}</p>}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">City *</label>
            <input type="text" {...register('city')} className="input-field" />
          </div>
          <div className="w-24">
            <label className="block font-medium mb-1">State *</label>
            <input type="text" {...register('state')} className="input-field" />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Delivery instructions (optional)</label>
          <textarea
            rows={3}
            placeholder="Back porch, door code 1234..."
            {...register('instructions')}
            className="input-field resize-none"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={!isValid}>
          Next →
        </button>
      </form>
    </div>
  )
}

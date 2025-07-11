'use client'
import { useState, useMemo } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

const mapContainerStyle = { width: '100%', height: '230px' }
const boston = { lat: 42.3736, lng: -71.1097 }   // Cambridge center as initial focus

const SERVICE_TOWNS = (process.env.NEXT_PUBLIC_SERVICE_TOWNS ??
  'Arlington,Belmont,Burlington,Concord,Lexington,Winchester,Woburn')
  .split(',').map(t => t.trim().toLowerCase())

type Status = 'idle' | 'in' | 'out' | 'sent' | 'error'

export default function DeliveryArea() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [town, setTown] = useState('')
  const [email, setEmail] = useState('')
  const [marker, setMarker] = useState<{lat:number;lng:number}|null>(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!

  /** Extract town name from Places result */
  function townFromPlace(place: google.maps.places.PlaceResult) {
    const comp = place.address_components ?? []
    const townObj = comp.find(c => c.types.includes('locality'))
                 ?? comp.find(c => c.types.includes('postal_town'))
    return townObj?.long_name ?? ''
  }

  async function handleSelect(place: google.maps.places.PlaceResult | null) {
    if (!place || !place.geometry) return
    const townName = townFromPlace(place)
    setTown(townName)
    setMarker({
      lat: place.geometry.location?.lat() ?? 0,
      lng: place.geometry.location?.lng() ?? 0,
    })

    const inZone = SERVICE_TOWNS.includes(townName.toLowerCase())
    if (inZone) {
      setStatus('in')
    } else {
      setStatus('out')
    }
  }

  async function handleInterest(e: React.FormEvent) {
    e.preventDefault()
    if (status !== 'out') return
    const res = await fetch('/api/interest', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ town, address: query, email }),
    })
    setStatus(res.ok ? 'sent' : 'error')
  }

  /** marketing copy */
  const Marketing = () => (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Fresh Broth<br/>Delivered Local</h1>
      <p>
        We currently hand-deliver to a small set of Boston-area towns while we perfect our
        routes.  Pop your address in the checker&nbsp;→ we’ll let you know instantly.
        Not in zone yet?  Leave an email and be the first to hear when we expand!
      </p>
      <img
        src="https://placehold.co/500x300?text=Bone+Broth"
        alt="Hero broth jars"
        className="rounded-lg shadow"
      />
    </div>
  )

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* left side marketing */}
        <Marketing />

        {/* right side checker */}
        <div>
          <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
            <label className="block text-sm font-medium mb-2">
              Enter your address
            </label>

            <input
              type="text"
              placeholder="123 Pleasant St, Arlington MA"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              id="address"
              autoComplete="off"
              className="mb-4 w-full rounded border border-slate-300 p-2"
            />

            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={marker ?? boston}
              zoom={marker ? 12 : 9}
              onLoad={(map) => {
                const autocomplete = new google.maps.places.Autocomplete(
                  document.getElementById('address') as HTMLInputElement,
                  { fields: ['geometry','address_components']}
                )
                autocomplete.addListener('place_changed', () =>
                  handleSelect(autocomplete.getPlace())
                )
              }}
            >
              {marker && <Marker position={marker} />}
            </GoogleMap>
          </LoadScript>

          {/* status messages */}
          {status === 'in' && (
            <p className="mt-6 rounded bg-emerald-50 p-4 text-emerald-700 text-center">
              Great news! We deliver to {town}. 🎉 <br/>
              <a href="/products" className="underline font-semibold">
                Browse broths&nbsp;→
              </a>
            </p>
          )}

          {status === 'out' && (
            <form onSubmit={handleInterest} className="mt-6 space-y-3">
              <p className="rounded bg-amber-50 p-3 text-amber-800 text-sm">
                We’re not in {town || 'your town'} yet&mdash;but we’d love to know you’re
                interested!  Leave an email and we’ll keep you posted.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="you@example.com (optional)"
                className="w-full rounded border border-slate-300 p-2"
              />
              <button
                type="submit"
                className="w-full rounded bg-emerald-600 py-2 font-semibold text-white"
              >
                Notify me when you expand
              </button>
            </form>
          )}

          {status === 'sent' && (
            <p className="mt-6 rounded bg-emerald-50 p-4 text-emerald-700 text-center">
              Thanks!  We’ve logged your interest and will let you know as soon
              as we reach your area. 😊
            </p>
          )}

          {status === 'error' && (
            <p className="mt-6 rounded bg-rose-50 p-4 text-rose-700 text-center">
              Oops! Something went wrong—please try again later.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

/* src/app/signup/confirm/success/page.tsx */
'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function SuccessPageContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  /* Optional: verify the session server-side */
  useEffect(() => {
    async function notifyServer() {
      const id = params.get('session_id')
      if (!id) return router.replace('/') // fallback
      
      await fetch('/api/stripe/session-complete', {
        method: 'POST',
        body: JSON.stringify({ sessionId: id }),
      }).catch(() => {})
      
      setLoading(false)
    }
    notifyServer()
  }, [params, router])

  return (
    <div className="max-w-lg mx-auto py-24 space-y-6 text-center">
      {loading ? (
        <p className="text-lg">Finalising your subscription…</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-emerald-600">Thank you!</h1>
          <p className="text-slate-700">
            Your first delivery will arrive on <strong>Tuesday</strong>. We've
            sent a confirmation e-mail to your inbox.
          </p>
          <a
            href="/dashboard"
            className="inline-block mt-6 rounded bg-emerald-600 px-6 py-2 text-white font-semibold hover:bg-emerald-700"
          >
            Go to my dashboard →
          </a>
        </>
      )}
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto py-24 text-center">Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  )
}
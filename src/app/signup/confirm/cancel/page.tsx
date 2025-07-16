/* src/app/signup/confirm/cancel/page.tsx */
'use client'

import { useRouter } from 'next/navigation'

export default function CancelPage() {
  const router = useRouter()

  return (
    <div className="max-w-lg mx-auto py-24 space-y-6 text-center">
      <h1 className="text-3xl font-bold text-amber-600">Payment cancelled</h1>
      <p className="text-slate-700">
        No worries—your card has not been charged. You can resume checkout or
        modify your choices at any time.
      </p>
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => router.back()}
          className="btn-oauth"
        >
          ← Return to review
        </button>
        <a
          href="/"
          className="rounded bg-slate-800 px-6 py-2 text-white font-semibold hover:bg-slate-900"
        >
          Back to home
        </a>
      </div>
    </div>
  )
}

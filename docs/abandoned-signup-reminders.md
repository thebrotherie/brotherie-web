// src/app/api/activate-subscription/route.ts
import { stripe }   from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const { sessionId, tierId, chickenCt, beefCt, promoId } = await req.json()

  /* ── Retrieve session & expand objects ────────────────────── */
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['customer', 'subscription'],
  })

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  /* ── Safe customer-id extraction ──────────────────────────── */
  let stripeCustomerId: string | null = null
  if (typeof session.customer === 'string') {
    stripeCustomerId = session.customer
  } else if (
    session.customer &&
    'id' in session.customer &&
    (session.customer as Stripe.Customer).id
  ) {
    stripeCustomerId = (session.customer as Stripe.Customer).id
  }

  /* Optional: customer-level metadata
     const metadata = typeof session.customer === 'object'
       ? (session.customer as Stripe.Customer).metadata
       : null
  */

  /* ── Insert into subscriptions table ─────────────────────── */
  const { error } = await supabase.from('subscriptions').insert({
    customer_id: stripeCustomerId,
    tier_id: tierId,            // ← snake-case column name
    status: 'active',
    stripe_subscription_id: session.subscription?.toString(),
    chicken_ct: chickenCt,
    beef_ct: beefCt,
    promo_id: promoId ?? null,
    started_at: new Date(),
  })

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 500 })
  }

  /* ── Analytics event ─────────────────────────────────────── */
  await supabase.rpc('record_event', {
    name: 'signup_completed',
    data: { tierId },
  })

  return NextResponse.json({ ok: true })
}

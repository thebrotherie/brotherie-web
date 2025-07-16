// src/app/api/activate-subscription/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'   // service-role client

export async function POST(req: Request) {
  const { sessionId, tierId, chickenCt, beefCt, promoId } = await req.json()

  /* ── Retrieve session ───────────────────────────── */
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['customer', 'subscription'],
  })
  if (session.payment_status !== 'paid')
    return NextResponse.json({ ok: false }, { status: 400 })

  /* ── Extract Stripe customer id safely ──────────── */
  const stripeCustomerId: string =
    typeof session.customer === 'string'
      ? session.customer
      : (session.customer as Stripe.Customer).id

  /* ── Write subscription row ─────────────────────── */
  const { error } = await supabaseAdmin.from('subscriptions').insert({
    customer_id: stripeCustomerId,
    tier_id: tierId,
    status: 'active',
    stripe_subscription_id: session.subscription?.toString(),
    chicken_ct: chickenCt,
    beef_ct: beefCt,
    promo_id: promoId ?? null,
    started_at: new Date(),
  })
  if (error)
    return NextResponse.json({ ok: false, error }, { status: 500 })

  /* ── Clean up abandoned-draft record ────────────── */
  await supabaseAdmin
    .from('signup_drafts')
    .delete()
    .eq('stripe_customer_id', stripeCustomerId)

  /* ── Fire analytics event ───────────────────────── */
  await supabaseAdmin.rpc('record_event', {
    name: 'signup_completed',
    data: { tierId },
  })

  return NextResponse.json({ ok: true })
}

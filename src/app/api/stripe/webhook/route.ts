import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!
  const buf = await req.arrayBuffer()

  let evt: Stripe.Event
  try {
    evt = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (evt.type === 'checkout.session.completed') {
    const s = evt.data.object as Stripe.Checkout.Session
    await supabaseAdmin.from('customers').upsert({
      stripe_customer_id: s.customer as string,
      email: s.customer_details?.email ?? '',
    })
  }

  if (evt.type === 'customer.subscription.created') {
    const sub = evt.data.object as Stripe.Subscription
    await supabaseAdmin.from('subscriptions').upsert({
      id: sub.id,
      customer_id: sub.customer as string,
      tier_id: sub.items.data[0].price.metadata.tier_id,
      status: sub.status,
      started_at: new Date(sub.start_date * 1000),
    })

    /* draft cleanup */
    await supabaseAdmin
      .from('signup_drafts')
      .delete()
      .eq('stripe_customer_id', sub.customer as string)
  }

  return NextResponse.json({ received: true })
}

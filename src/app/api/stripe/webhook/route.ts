// src/app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import type { Stripe } from 'stripe'

export const config = {
  api: {
    bodyParser: false,   // ensure we can read the raw body
  },
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  await supabaseAdmin
    .from('customers')
    .upsert({
      stripe_customer_id: session.customer as string,
      email: session.customer_details?.email ?? '',
    })
}

async function handleSubscriptionCreated(sub: Stripe.Subscription) {
  await supabaseAdmin.from('subscriptions').upsert({
    id: sub.id,
    customer_id: sub.customer as string,
    tier_id: sub.items.data[0].price.metadata.tier_id,
    status: sub.status,
    started_at: new Date(sub.start_date * 1000),
  })

  // clean up any unfinished signup drafts
  await supabaseAdmin
    .from('signup_drafts')
    .delete()
    .eq('stripe_customer_id', sub.customer as string)
}

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature')!
  const buffer = Buffer.from(await req.arrayBuffer())

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      buffer,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        )
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        )
        break

      // add more event handlers here as needed
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`)
    }
  } catch (err) {
    console.error('Error processing webhook event:', err)
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

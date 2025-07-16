import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const { tierId, price, promo, email } = await req.json()

  /* map tier → Stripe Price ID */
  const priceMap: Record<string, string> = {
    sip:   'price_1RigV0QvMf7vJlqHMWItyjU0',   // replace with real IDs
    daily: 'price_1RigVMQvMf7vJlqHMjTdQXAw',
    chef:  'price_1RigVZQvMf7vJlqHWLg6HXLs',

    // LIVE:
    // sip:   'price_1RlYSfJ8ndLagr2ktiUjxXaO',   // replace with real IDs
    // daily: 'price_1RlYThJ8ndLagr2kOffEV50g',
    // chef:  'price_1RlYUqJ8ndLagr2kh4wNaPpS',
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{ price: priceMap[tierId], quantity: 1 }],
    customer_email: email,
    discounts: promo ? [{ coupon: 'promo_10pct' }] : undefined,  // optional
    //customer_creation: 'always',            // create new Stripe customer
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/signup/confirm/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/signup/confirm/cancel`,
    metadata: { tier_id: tierId },
  })

  return NextResponse.json({ id: session.id })
}

// src/lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // apiVersion omitted – Stripe uses your account’s default version
  typescript: true,
})

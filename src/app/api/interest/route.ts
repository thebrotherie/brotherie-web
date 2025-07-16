// src/app/api/interest/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { sendInterestEmail } from '@/lib/email'

export async function POST(req: Request) {
  const body = await req.json()  // { email?, zip, street? }

  const { error } = await supabaseAdmin
    .from('service_interest')
    .insert([{ email: body.email ?? null, zip: body.zip, street: body.street ?? '' }])

  if (error) {
    console.error('service_interest error →', error)   // <-- shows in Vercel / terminal
    return NextResponse.json({ ok: false, error }, { status: 500 })
  }

  await sendInterestEmail(body)
  return NextResponse.json({ ok: true })
}

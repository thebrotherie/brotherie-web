import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendContactEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const data = await req.json()          // { name, email, subject, message }

    /* 1️⃣  save to Supabase */
    const { error } = await supabase
      .from('contact_messages')
      .insert([{ ...data }])
    if (error) throw error

    /* 2️⃣  email the team */
    await sendContactEmail(data)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

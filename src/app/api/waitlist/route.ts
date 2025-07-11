import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendWaitlistEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const data = await req.json()           // { email, name? }

    /* store in Supabase */
    const { error } = await supabase
      .from('waitlist')                     // create this table later
      .insert([{ ...data }])
    if (error) throw error

    /* notify team */
    await sendWaitlistEmail(data)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendInterestEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const data = await req.json()      // { town, address, email }

    // store in DB
    const { error } = await supabase
      .from('service_interest')
      .insert([{ ...data }])
    if (error) throw error

    // notify team
    await sendInterestEmail(data)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

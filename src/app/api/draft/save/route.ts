// src/app/api/draft/save/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  const body = await req.json()        // { id?, current_step, payload }
  const uid  = (await supabase.auth.getUser()).data?.user?.id ?? null

  const upsert = {
    id: body.id,                       // allow null for new draft
    user_id: uid,
    current_step: body.current_step,
    payload: body.payload,
  }

  const { data, error } = await supabase
    .from('signup_drafts')
    .upsert(upsert, { onConflict: 'id' })
    .select('id').single()

  if (error) return NextResponse.json({ ok:false, error }, { status:500 })
  return NextResponse.json({ ok:true, id:data.id })
}

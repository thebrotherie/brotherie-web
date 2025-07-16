// supabase/functions/reminder24h.ts
import { resend } from '@/lib/resend'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function handler() {
  const { data: drafts } = await supabaseAdmin
    .from('signup_drafts')
    .select('id, payload')
    .is('completed', null)
    .gte('updated_at', 'now() - interval \'25 hours\'')
    .lt('updated_at', 'now() - interval \'23 hours\'')
    .eq('wants_reminder', true)

  for (const d of drafts ?? []) {
    const email = d.payload?.email
    if (!email) continue
    await resend.emails.send({
      to: email,
      from: 'hello@thebrotherie.com',
      subject: 'Finish setting up your broth subscription',
      html: `<p>Pick up where you left off → <a href="${process.env.NEXT_PUBLIC_SITE_URL}/signup?draft=${d.id}">Resume</a></p>`
    })
  }
}

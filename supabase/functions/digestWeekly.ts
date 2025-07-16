import { supabaseAdmin } from '@/lib/supabaseClient'
import { resend } from '@/lib/resend'

interface DraftRow {
  id: string
  payload: { email?: string }
  updated_at: string
}

export default async function digest() {
  const { data, error } = await supabaseAdmin
    .from('signup_drafts')
    .select('id, payload, updated_at')      // plain string
    .lt('updated_at', 'now() - interval \'7 days\'')
    .is('completed', null)

  if (error || !data?.length) return        // nothing to send

  const rows = (data as DraftRow[])
    .map(
      (r) =>
        `<tr><td>${r.id}</td><td>${r.payload?.email ?? '—'}</td><td>${r.updated_at}</td></tr>`
    )
    .join('')

  await resend.emails.send({
    to: 'ops@thebrotherie.com',
    from: 'hello@thebrotherie.com',
    subject: 'Abandoned sign-ups digest',
    html: `<table>${rows}</table>`,
  })
}

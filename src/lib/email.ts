import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_KEY!)
const TO   = process.env.EMAIL_TO!        // hello@thebrotherie.com
const FROM = 'The Brotherie Website <hello@thebrotherie.com'     // must match the verified domain

/** Low-level helper used by all other email helpers */
export async function sendEmail({
  subject,
  html,
  replyTo,
}: {
  subject: string
  html: string
  replyTo?: string
}) {
  try {
    const resp = await resend.emails.send({
      from: FROM,
      to:   TO,
      subject,
      html,
      headers: replyTo ? { 'Reply-To': replyTo } : undefined,
    })
   // console.log('✅ resend-response ➜', resp)   // success log
    return resp
  } catch (err) {
    //console.error('❌ resend-error ➜', err)      // error log
    throw err                                    // bubble up to route
  }
}

/** Public helper for the contact form */
export async function sendContactEmail(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const { name, email, subject, message } = data
  await sendEmail({
    subject: `[Web Contact] ${subject || 'New inquiry'}`,
    html: `
      <p><strong>From:</strong> ${name} (${email})</p>
      <p>${message}</p>
    `,
    replyTo: email,
  })
}

/** Public helper for the wait-list form */
export async function sendWaitlistEmail(data: { email: string; name?: string }) {
  const { email, name } = data
  await sendEmail({
    subject: '[Wait-list] New subscriber',
    html: `
      <p>${name ? `<strong>Name:</strong> ${name}<br/>` : '' }
         <strong>Email:</strong> ${email}</p>
    `,
    replyTo: email,
  })
}

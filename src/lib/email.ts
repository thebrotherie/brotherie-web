import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_KEY!)
const TO = process.env.EMAIL_TO!        // hello@thebrotherie.com
const FROM = 'hello@thebrotherie.com'   // must match the verified domain

export async function sendEmail({
  subject,
  html,
  replyTo,          // <— new
}: {
  subject: string
  html: string
  replyTo?: string
}) {
  return resend.emails.send({
    from: FROM,
    to: TO,
    subject,
    html,
    headers: replyTo ? { 'Reply-To': replyTo } : undefined,
  })
}

export async function sendContactEmail(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const { name, email, subject, message } = data
  await sendEmail({
    subject: `[Contact] ${subject || 'New message'}`,
    html: `
      <p><strong>From:</strong> ${name} (${email})</p>
      <p>${message}</p>
    `,
    replyTo: email,     // so “Reply” in Gmail goes to the visitor
  })
}

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

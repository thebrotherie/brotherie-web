'use client'
import { useState } from 'react'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  // Grab the current form element before resetting
  const form = e.currentTarget;

  const data = Object.fromEntries(new FormData(form)) as {
    name: string;
    email: string;
    subject: string;
    message: string;
  };

  // Call your API
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    form.reset();           // 1️⃣ clear all fields
    setStatus("sent");      // 2️⃣ show thank-you banner
  } else {
    setStatus("error");
  }
}


  return (
    <section className="bg-[#eae2d8] dark:bg-slate-900 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-4xl font-bold text-center mb-2">Contact&nbsp;Us</h1>
        <p className="text-center mb-10 text-slate-600 max-w-2xl mx-auto">
          We&apos;d love to hear from you! Questions about products, delivery, or just want to say
          hello? — We&apos;re here to help.
        </p>

        {/* === GRID === */}
        <div className="grid gap-10 lg:grid-cols-[370px_1fr]">
          {/* === LEFT COLUMN === */}
          <div className="space-y-8">
            {/* Card 1 */}
            <div className="rounded-lg bg-white dark:bg-slate-500 p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Get in&nbsp;Touch</h2>
              <ul className="space-y-6 text-sm">
                <li>
                  📧 <strong>Email</strong>
                  <div>hello@thebrotherie.com</div>
                  <div className="text-xs text-slate-500">
                    We typically respond within&nbsp;24&nbsp;hours
                  </div>
                </li>
                <li>
                  📞 <strong>Phone</strong>
                  <div>(617) 468-8402</div>
                  <div className="text-xs text-slate-500">Mon — Fri, 8 AM — 6 PM</div>
                </li>
                <li>
                  📍 <strong>Service Area</strong>
                  <div>Northwest Metro of Boston — </div>
                  <div>Arlington, Belmont, Burlington, Concord, Lexington, Woburn, Winchester</div>
                  <div className="text-xs text-slate-500"> More to come!</div>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="rounded-lg bg-white dark:bg-slate-500 p-6 shadow">
              <h2 className="text-lg font-semibold text-emerald-700 mb-4">
                Frequently Asked Questions
              </h2>
              <ul className="text-sm space-y-3">
                <li>
                  <strong>How often do you deliver?</strong>
                  <div>Tuesdays for now—more days coming soon.</div>
                </li>
                <li>
                  <strong>Can I pause my subscription?</strong>
                  <div>Absolutely! Email us any time.</div>
                </li>
                <li>
                  <strong>Do you deliver to my area?</strong>
                  <div>Contact us with your ZIP code.</div>
                </li>
              </ul>
            </div>
          </div>

          {/* === RIGHT COLUMN === */}
          <div className="rounded-lg bg-white dark:bg-slate-500 p-8 shadow">
            <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>

            {/* flash messages */}
            {status === 'sent' && (
              <p className="mb-6 rounded bg-emerald-50 p-3 text-emerald-700">
                Thank you for your message — we&apos;ll respond shortly!
              </p>
            )}
            {status === 'error' && (
              <p className="mb-6 rounded bg-rose-50 p-3 text-rose-700">
                Oops! Something went wrong. Please try again.
              </p>
            )}

            {/* form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="name">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="w-full rounded border border-slate-300 dark:bg-slate-200 dark:border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded border border-slate-300 dark:bg-slate-200 dark:border-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="subject">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  className="w-full rounded border border-slate-300 dark:bg-slate-200 dark:border-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="message">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full rounded border border-slate-300 dark:bg-slate-200 dark:border-slate-600"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sent'}
                className="block w-full rounded border bg-black dark:bg-slate-800 px-4 py-2 font-semibold text-white
                           hover:bg-slate-800 disabled:opacity-60"
              >
                Send Message
              </button>
            </form>

            <p className="mt-4 text-xs text-center text-slate-500">
              * Required fields. We never share your information.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

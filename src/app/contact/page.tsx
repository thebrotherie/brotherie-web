'use client'
/**
 * Contact page
 * TODO: wire up the form to your /api/contact route + Resend later.
 */
export default function Contact() {
  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">Contact Us</h1>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            className="w-full rounded border-slate-300 dark:border-slate-600
                       bg-white dark:bg-slate-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full rounded border-slate-300 dark:border-slate-600
                       bg-white dark:bg-slate-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="msg">
            Message
          </label>
          <textarea
            id="msg"
            rows={4}
            required
            className="w-full rounded border-slate-300 dark:border-slate-600
                       bg-white dark:bg-slate-800"
          />
        </div>

        {/* TODO: replace alert() with real submit logic */}
        <button
          type="button"
          onClick={() => alert('Message sent (stub)')}
          className="rounded bg-emerald-600 px-4 py-2 font-semibold text-white
                     hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          Send
        </button>
      </form>
    </section>
  );
}

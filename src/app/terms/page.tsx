'use client'
export default function Terms() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 prose dark:prose-invert">
      <h1>Terms &amp; Conditions</h1>
      <p><em>Last updated&nbsp;{new Date().toLocaleDateString()}</em></p>

      <h2>1. Agreement to Terms</h2>
      <p>
        By accessing or using <strong>thebrotherie.com</strong> (the “Site”),
        you agree to be bound by these Terms &amp; Conditions (“Terms”).
        If you do not agree to these Terms, please do not use the Site.
      </p>

      <h2>2. Products &amp; Subscriptions</h2>
      <p>
        The Brotherie&nbsp;LLC (“we,” “our,” “us”) produces and
        delivers bone broth products within a limited service area. Subscription
        plans renew automatically until cancelled. You may pause or cancel any
        time before your next billing date.
      </p>

      <h2>3. Payment &amp; Refunds</h2>
      <p>
        Payments are processed securely via third-party providers (e.g., Stripe).
        All sales are final once delivered; however, if you are dissatisfied,
        contact <a href="mailto:hello@thebrotherie.com">hello@thebrotherie.com</a>
        within&nbsp;48&nbsp;hours and we will make it right.
      </p>

      <h2>4. Intellectual Property</h2>
      <p>
        All content on the Site, including text, graphics, and logos,
        is our property and may not be used without written permission.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, The Brotherie is not liable for
        any indirect or consequential damages arising from your use of the Site
        or our products.
      </p>

      <h2>6. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the Commonwealth of Massachusetts,
        without regard to conflict-of-law principles.
      </p>

      <h2>7. Changes to Terms</h2>
      <p>
        We may update these Terms occasionally. Updated versions will be posted
        with a revised “Last updated” date.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions? Email&nbsp;
        <a href="mailto:hello@thebrotherie.com">hello@thebrotherie.com</a>.
      </p>
    </section>
  )
}

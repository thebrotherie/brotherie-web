'use client'
export default function Privacy() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 prose dark:prose-invert">
      <h1>Privacy&nbsp;Policy</h1>
      <p><em>Last updated&nbsp;{new Date().toLocaleDateString()}</em></p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Information you provide&nbsp;</strong>(e.g., name, email, delivery address)</li>
        <li><strong>Automatically collected&nbsp;</strong>(e.g., IP address, browser type)</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>Process and deliver orders</li>
        <li>Send transactional or promotional emails (with consent)</li>
        <li>Improve our website and services</li>
      </ul>

      <h2>3. Sharing of Information</h2>
      <p>
        We never sell your personal information. We share data only with trusted
        providers (e.g., payment processors, delivery services) as required to
        operate our business.
      </p>

      <h2>4. Cookies &amp; Tracking</h2>
      <p>
        We use cookies and similar technologies for site analytics and to store
        your preferences. You can disable cookies in your browser settings.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We employ industry-standard measures to protect your data, including
        encryption in transit and at rest.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal
        information by emailing&nbsp;
        <a href="mailto:privacy@thebrotherie.com">privacy@thebrotherie.com</a>.
      </p>

      <h2>7. Children’s Privacy</h2>
      <p>
        The Site is not directed to children under 13. We do not knowingly
        collect data from children.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Policy periodically. Changes are effective when
        posted with a revised “Last updated” date.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions? Email&nbsp;
        <a href="mailto:privacy@thebrotherie.com">privacy@thebrotherie.com</a>.
      </p>
    </section>
  )
}

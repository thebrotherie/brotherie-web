/**
 * Admin dashboard (protected route in future).
 * Add product CRUD, order management, etc.
 */
export default function AdminDashboard() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">Admin Overview</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg bg-emerald-600/10 dark:bg-emerald-600/20 p-4">
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm">New Orders</p>
        </div>
        <div className="rounded-lg bg-sky-600/10 dark:bg-sky-600/20 p-4">
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm">Active Subscriptions</p>
        </div>
      </div>
    </section>
  );
}

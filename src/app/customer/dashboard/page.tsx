/**
 * Customer dashboard (protected route in future).
 * Replace stub data with Supabase query after auth is added.
 */
export default function CustomerDashboard() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">Your Upcoming Deliveries</h1>

      {/* placeholder table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 dark:text-slate-400">
            <th className="py-2">Date</th>
            <th>Items</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-200 dark:border-slate-700">
            <td className="py-2">Aug 2, 2025</td>
            <td>2× Chicken, 1× Beef</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

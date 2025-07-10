/**
 * Products page
 * Replace the sample array with a Supabase fetch later.
 */
const sampleProducts = [
  { id: 1, name: 'Chicken Bone Broth', size: '32 oz', price: '$14' },
  { id: 2, name: 'Beef Bone Broth',    size: '32 oz', price: '$16' },
];

export default function Products() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-center">Our Products</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sampleProducts.map((p) => (
          <article
            key={p.id}
            className="rounded-lg border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800 p-6 flex flex-col"
          >
            <h2 className="font-semibold mb-2">{p.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{p.size}</p>
            <span className="mt-auto text-lg font-bold">{p.price}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

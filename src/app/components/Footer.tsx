export default function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-slate-600 dark:text-slate-400">
        © {new Date().getFullYear()} The Brotherie — Nourishment Delivered
      </div>
    </footer>
  )
}

'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SunIcon, MoonIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

const nav = [
  { href: '/',        label: 'Home' },
  { href: '/about',   label: 'About' },
  { href: '/products',label: 'Products' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const path = usePathname()
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <header className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
          The&nbsp;Brotherie
        </Link>

        <nav className="flex gap-6 text-sm">
          {nav.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className={`hover:text-emerald-600 dark:hover:text-emerald-400 ${
                path === n.href ? 'font-semibold' : ''
              }`}
            >
              {n.label}
            </Link>
          ))}
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            className="ml-4 rounded p-1 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {dark ? <SunIcon size={18}/> : <MoonIcon size={18}/>}
          </button>
        </nav>
      </div>
    </header>
  )
}

'use client'
import { usePathname } from 'next/navigation'
import { Disclosure } from '@headlessui/react'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/logo'
import Link from 'next/link'

const nav = [
  { href: '/',          label: 'Home' },
  { href: '/about',     label: 'About' },
  { href: '/products',  label: 'Products' },
  { href: '/delivery',  label: 'Delivery Area' },
  { href: '/contact',   label: 'Contact' },
]

export default function Header() {
  const path = usePathname()

  return (
    <Disclosure
      as="header"
      className="relative border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur h-"
    >
      {({ open }) => (
        <>
          <div className="relative z-10 mx-auto max-w-6xl px-4 py-3 flex h-full items-center justify-between lg:justify-start">
            {/* --- Brand (left) --- */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Logo
                src="/images/text_only_light.png"
                darkSrc="/images/text_only_light.png"
                alt="The Brotherie"
                height={120}
              />
            </Link>


            {/* --- Hamburger (mobile only) --- */}
            <Disclosure.Button className="lg:hidden ml-auto text-slate-800 dark:text-slate-100">
              {open ? <X size={24} /> : <Menu size={24} />}
            </Disclosure.Button>

            {/* --- Nav links (desktop) --- */}
            <nav className="ml-auto hidden lg:flex gap-6 text-sm">
              {nav.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`hover:text-emerald-600 dark:hover:text-emerald-400
                    ${path === href ? 'font-semibold' : ''}`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* --- Mobile panel --- */}
          <Disclosure.Panel className="lg:hidden border-t bg-white dark:bg-slate-800">
            <nav className="px-4 py-3 flex flex-col gap-2 text-sm">
              {nav.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`py-1 hover:text-emerald-600 dark:hover:text-emerald-400
                    ${path === href ? 'font-semibold' : ''}`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

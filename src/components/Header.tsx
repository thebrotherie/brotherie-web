'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Disclosure } from '@headlessui/react'
import { Menu, X, User, LogOut } from 'lucide-react'
import Logo from '@/components/logo'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { User as SupabaseUser } from '@supabase/supabase-js'

const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/delivery', label: 'Delivery Area' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const path = usePathname()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for authenticated user on component mount
  useEffect(() => {
    checkUser()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      // Optionally redirect to home page
      window.location.href = '/'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Render auth buttons based on user state
  const renderAuthButtons = () => {
    if (loading) {
      return (
        <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
      )
    }

    if (user) {
      return (
        <div className="flex items-center gap-3">
          {/* Dashboard Link */}
          <Link
            href="/customer/dashboard"
            className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-slate-700 hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400"
          >
            <User size={16} />
            Dashboard
          </Link>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-slate-700 hover:text-red-600 dark:text-slate-200 dark:hover:text-red-400"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )
    }

    // Not logged in - show login and signup buttons
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="px-3 py-1 text-sm font-medium text-slate-700 hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400"
        >
          Log In
        </Link>
        <Link
          href="/signup/plan/email"
          className="rounded bg-emerald-600 px-3 py-1 text-white font-semibold hover:bg-emerald-700"
        >
          Sign Up
        </Link>
      </div>
    )
  }

  // Mobile auth buttons
  const renderMobileAuthButtons = () => {
    if (loading) {
      return <div className="w-full h-8 bg-gray-200 animate-pulse rounded mx-4 my-2"></div>
    }

    if (user) {
      return (
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-2">
            <Link
              href="/customer/dashboard"
              className="flex items-center gap-2 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400"
            >
              <User size={16} />
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 py-2 text-sm font-medium text-slate-700 hover:text-red-600 dark:text-slate-200 dark:hover:text-red-400 text-left"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-2">
          <Link
            href="/auth/login"
            className="py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400"
          >
            Log In
          </Link>
          <Link
            href="/signup/plan/email"
            className="rounded bg-emerald-600 px-3 py-2 text-white font-semibold hover:bg-emerald-700 text-center"
          >
            Sign Up
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Disclosure
      as="header"
      className="relative border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur"
    >
      {({ open }) => (
        <>
          <div className="relative z-10 mx-auto max-w-6xl px-4 py-3 flex h-20 items-center justify-between lg:justify-start">
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
            <nav className="ml-auto hidden lg:flex gap-6 text-sm items-center">
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
              
              {/* Auth buttons for desktop */}
              {renderAuthButtons()}
            </nav>
          </div>

          {/* --- Mobile panel --- */}
          <Disclosure.Panel className="lg:hidden border-t bg-white dark:bg-slate-800">
            {/* Mobile auth buttons */}
            {renderMobileAuthButtons()}
            
            {/* Mobile navigation */}
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
import Logo from '@/components/logo'
import Link from 'next/link'
import { Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-slate-800">
      <div className="mx-auto max-w-6xl grid gap-8 px-4 py-10 text-sm sm:grid-cols-2 md:grid-cols-4">
        {/* Brand */}
        <div>
          <Logo src="/images/text_only_light.png"
              darkSrc="/images/default_logo.png" /*change this to dark*/
              alt="The Brotherie"
              height = {100}
            />

          <p className="text-slate-600 dark:text-slate-400">
            <br />
            Small-batch bone broth&nbsp;<br />
            simmered low &amp; slow in Arlington&nbsp;MA.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold mb-2">Company</h4>
          <ul className="space-y-1">
            <li><Link href="/about"   className="hover:underline">About</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="space-y-1">
            <li><Link href="/terms"    className="hover:underline">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy"  className="hover:underline">Privacy&nbsp;Policy</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-2">Follow&nbsp;Us</h4>
          <Link
            href="https://instagram.com/thebrotherie"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:underline"
          >
            <Instagram size={18} /> thebrotherie
          </Link>
        </div>
      </div>

      <div className="border-t text-center text-xs py-4 text-slate-600 dark:text-slate-400">
        © {new Date().getFullYear()} The Brotherie&nbsp;— Nourishment Delivered
      </div>
    </footer>
  )
}

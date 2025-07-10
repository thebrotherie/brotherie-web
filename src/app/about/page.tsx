/**
 * About Page
 * ----------
 * • Uses the shared <Header /> and <Footer /> from `app/layout.tsx`.
 * • Hero section with a full-width image + tagline.                (🚩 Replace the src="")
 * • Origin-story block written in a warm “founder’s-letter” tone.  (🚩 Tweak copy anytime)
 * • Tailwind utility classes keep it fully responsive.
 */

import Image from 'next/image'

export const metadata = {
  title: 'About Us – The Brotherie',
  description: 'Get to know the story and the people behind our bone broth.',
}

export default function AboutPage() {
  return (
    <section className="space-y-16">
      {/* ---------- Hero / Tagline ---------- */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden rounded-lg shadow">
        {/* 
          🚩 Replace `/about-hero.jpg` with a real image in /public.
          - Tip: 2400×1600 JPG ~300 kB is a good balance. 
        */}
        <Image
          src="/about-hero.jpg"
          alt="Our kitchen in action"
          fill
          priority
          className="object-cover"
        />

        {/* Tagline overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center drop-shadow-lg">
            {/* 🚩 Swap in real tagline later */}
            Placeholder Tagline
          </h1>
        </div>
      </div>

      {/* ---------- Origin Story ---------- */}
      <article className="prose prose-lg max-w-3xl mx-auto dark:prose-invert">
        <h2 className="text-center font-bold text-2xl">How The Brotherie Came to Life</h2>

        <p>
          Hi! I&apos;m Allie, engineer by training,
          food-lover by destiny, and lifelong soup afficiando. I grew up in Northeast China, where my mom&apos;s
          bone-rich broths were a part of every meal. Moving to the U.S.,
          that tradition followed me, simmering gently in the background of my
          busy life.
        </p>

        <p>
          Fast-forward to my second pregnancy: coffee was out, bone broth was
          in. Each morning the slow ritual of skimming, tasting, and finally
          sipping became a moment of calm—nourishing my body, steadying my
          mind, and reminding me of home. When the freezer ran out, the
          store-bought pouches I tried were either over-priced, over-salted, or
          both. So I did what any product-manager-turned-food-geek would do:
          I engineered a better broth.
        </p>

        <p>
          Leaving a corporate career that spanned healthcare software at
          Epic Systems and high-growth tech start-ups, I dove into kettles,
          not code. Today I run The Brotherie with my husband, our two young taste-testers—who swear by chicken broth
          mac-&-cheese—and Porter the dog, whose tail thumps loudest when his
          kibble gets a broth boost. We simmer local bones low & slow, skip the
          shortcuts, and deliver the kind of honest flavor my family has loved
          for generations.
        </p>

        <p>
          Whether you&apos;re looking for a morning coffee alternative, a
          chef-grade cooking base, or simply a wholesome daily ritual, we&apos;re
          honored to bring our broth to your table. From our kitchen in
          Arlington, MA to yours. 
        </p>

        <p>
          Love, Allie
        </p>
      </article>
    </section>
  )
}

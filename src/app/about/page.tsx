// src/app/about/page.tsx
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
        <Image
          src="/about-hero.jpg"
          alt="Our bone broth in the making"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center drop-shadow-lg">
            {/* 🚩 Swap in real tagline later */}
            Placeholder Tagline
          </h1>
        </div>
      </div>

      {/* ---------- Origin Story ---------- */}
      <div className="max-w-3xl mx-auto py-8 space-y-6 prose prose-lg dark:prose-invert">
        <h2 className="text-center font-bold text-2xl">How The Brotherie Came to Life</h2>
        <p>
        Welcome! I'm Allie, the founder of the Brotherie. I started this business I love cooking and spending time with my family, especially around a great meal. With my second pregnancy, I was looking for a new habit to replace my daily cup of coffee in the morning. I quickly became obsessed with bone broth and was making batches of it. It was savory, it was warm, it was filling and nutritious.

<br></br>The benefits of a great bone broth are endless but all the options commercially available just didn't cut it! The powders don't dissolve well. The shelf-stable, refridgerated, and shipped options all came with excess ingredients, sub-par ingredients, and extra flavors. I was looking for a high-quality, versatile, and sustainable solution and couldn't find one. I saw the opportunity to deliver quality and convenience to customers and families like mine, and thus I launched "the Brotherie."

<br></br>Now, I'm passionate about sharing my new rituals of sipping on-, cooking with-, and swapping in- bone broth daily with other busy families who want to prioritize health & wellness but with the utmost convenience. Every batch is crafted with the same care, attention, and quality ingredients that I used for feeding my own family. I cannot wait for you to try it and love it as much as my family does!

Cheers, Allie
</p>
      </div>

      {/* ---------- About Our Broth ---------- */}
      <div className="max-w-3xl mx-auto py-8 space-y-6 prose prose-lg dark:prose-invert">
        <h2 className="text-center font-bold text-2xl">About Our Broth</h2>
        <p>
          {/* 🚩 Replace this with your actual “about our broth” copy */}
          Our broth is crafted from locally sourced bones, roasted and then simmered gently for hours to draw out all the collagen and minerals that makes bone broth so good for you. Every batch is hand-skimmmed and seasoned. We take our time so you can save yours.
        </p>
      </div>

      {/* ---------- About Our Cooking Process ---------- 
      //<div className="max-w-3xl mx-auto py-8 space-y-6 prose prose-lg dark:prose-invert">
        <h2 className="text-center font-bold text-2xl">About Our Cooking Process</h2>
        <p>
          {/* 🚩 Replace this with your actual “cooking process” copy 
          We start with grass-fed beef and pasture-raised chicken bones, and roast themm in the oven first.  Then we move to a slow, low simmer. Our small-batch kettles let us monitor temperature and taste.  The result is a pure broth that you can taste
        </p>
      </div>*/}
    </section>
  )
}

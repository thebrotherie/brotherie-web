import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-center">
        <Image
          className="dark:invert"
          src="/images/default_logo.png"
          alt="Brotherie ogo"
          width={250}
          height={138}
          priority
        />
        <div className="list-inside list-decimal text-center sm:text-center font-[family-name:var(--font-geist-mono)] text-3xl font-semibold">
        The Brotherie is simmering...<br></br><br></br>
          <div className="mb-2 tracking-[-.01em] text-sm font-normal">
            We're a small-batch bone broth company based just outside Boston, born from a personal journey through pregnancy and the search for a nourishing ritual.

We slow-simmer bones from local butchers with organic vegetables and herbs to create rich, clean broths—no shortcuts, no preservatives—then deliver comfort and nutrition to your doorstep.

Whether you're postpartum, on a wellness journey, or simply love bone broth, we're here to bring ease and warmth to your table.{" "}
          </div>
        </div>
 
      </main>
    </div>
  );
}

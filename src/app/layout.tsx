import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Brotherie",
  description: "Locally crafted bone broth delivered weekly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
                    flex min-h-screen flex-col
                    bg-slate-50 dark:bg-slate-900
                    text-slate-800 dark:text-slate-100`}
      >
        {/* shared nav */}
        <Header />

        {/* page content */}
        <main className="flex-1">{children}</main>

        {/* shared footer */}
        <Footer />
      </body>
    </html>
  );
}

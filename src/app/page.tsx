"use client"
import Image from "next/image";
import {useState} from 'react'
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address')
      setIsSuccess(false)
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase
        .from('email_signups') // Replace with your actual table name
        .insert([
          {
            email: email,
            created_at: new Date().toISOString()
          }
        ])

      if (error) {
        throw error
      }

      setMessage('Thanks for signing up! We\'ll notify you when we launch.')
      setIsSuccess(true)
      setEmail('')
    } catch (error: any) {
      console.error('Error:', error)
      setMessage(error.message || 'Something went wrong. Please try again.')
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="grid grid-rows-[10px_1fr_10px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-center">
        <Image
          className="dark:invert"
          src="/images/default_logo.png"
          alt="Brotherie ogo"
          width={250}
          height={138}
          priority
        />
        <div className="text-center sm:text-center font-[family-name:var(--font-geist-mono)] text-3xl font-semibold">
        The Brotherie is simmering...
          <div className="mt-4 mb-2 tracking-[-.01em] text-sm font-normal">
            We're a small-batch bone broth company based just outside Boston, born from a personal journey through pregnancy and the search for a nourishing ritual. <br></br>We slow-simmer bones from local butchers with organic vegetables and herbs to create rich, clean broths—no shortcuts, no preservatives—then deliver comfort and nutrition to your doorstep. 
            <br></br>Whether you're postpartum, on a wellness journey, or simply love bone broth, we're here to bring ease and warmth to your table.{" "}
          </div>
              </div>
        
       <div className="text-center sm:text-center font-[family-name:var(--font-geist-mono)] text-3xl font-semibold">
        Want to stay in the know?
          
          {/* Left side - Heading and Description */}
          <div className="text-center lg:text-center">
            <p className="mt-4 mb-2 tracking-[-.01em] text-sm font-normal">
              Sign up for our pre-launch e-mail list for the latest updates & a special early bird promotion! 
              We promise to only send pertinent updates, never spam and never selling your data.
            </p>
          

          {/* Right side - Signup Form */}
          <div className="flex mt-4 justify-center items-center w-full">
            <div className="w-full max-w-md mt-4"> 
            {/* Customizable background and border colors */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-8">
              
              {/* Heading */}
              <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                Stay Updated
              </h2>
              
              {/* Subtext */}
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm font-normal">
                Be the first to know when we launch!
              </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email address*
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-100
                         disabled:opacity-50 disabled:cursor-not-allowed text-sm text-center"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black dark:bg-white text-white dark:text-black 
                       font-medium py-2 px-4 rounded-md
                       hover:bg-gray-800 dark:hover:bg-gray-200
                       focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200 text-sm"
            >
              {isLoading ? 'Signing up...' : 'Notify Me'}
            </button>
          </form>

          {/* Status Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-md text-sm ${
              isSuccess 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
              {message}
            </div>
          )}
          </div>
          </div>
          </div>
      </div>
      </div>
      </main>
    </div>
  );
}

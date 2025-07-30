// src/app/signup/page.tsx
'use client'

/**
 * Step 0: Email Collection
 * Initial entry point that captures email and starts tracking signup progress
 * Creates entry in Supabase for abandoned cart recovery
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSignup } from '@/contexts/SignupContext'
import { Button, Card, Alert, Input } from '@/components/ui'
import { validateEmail } from '@/lib/utils'
import { supabase } from '@/lib/supabaseClient'

export default function SignupEmailPage() {
  const router = useRouter()
  const { updateFormData, nextStep } = useSignup()
  
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Save signup progress to database
  const saveSignupProgress = async (step: number, updatedFormData: any) => {
    if (!updatedFormData.contactInfo?.email) {
      return true // Skip if no email yet
    }

    try {
      const progressData = {
        email: updatedFormData.contactInfo.email,
        current_step: step,
        form_data: updatedFormData,
        updated_at: new Date().toISOString(),
        status: 'in_progress'
      }

      console.log('Saving progress for step:', step, 'email:', updatedFormData.contactInfo.email)

      // Check if progress record exists
      const { data: existing, error: selectError } = await supabase
        .from('signup_progress')
        .select('id')
        .eq('email', updatedFormData.contactInfo.email)
        .single()

      console.log('Existing record found:', existing, 'Error:', selectError)

      if (existing && !selectError) {
        // Update existing record
        console.log('Updating existing record with ID:', existing.id)
        const { error } = await supabase
          .from('signup_progress')
          .update(progressData)
          .eq('id', existing.id)
        
        if (error) {
          console.error('Update error:', error)
          throw error
        }
        console.log('Successfully updated existing record')
      } else {
        // Create new record
        console.log('Creating new record')
        const { error } = await supabase
          .from('signup_progress')
          .insert([{
            ...progressData,
            created_at: new Date().toISOString()
          }])
        
        if (error) {
          console.error('Insert error:', error)
          throw error
        }
        console.log('Successfully created new record')
      }
      
      return true
    } catch (error) {
      console.error('Error saving signup progress:', error)
      return false
    }
  }

  const handleContinue = async () => {
    setIsLoading(true)
    setError('')

    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address')
      setIsLoading(false)
      return
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      // Update form data with email
      const updatedFormData = {
        contactInfo: {
          firstName: '',
          lastName: '',
          email: email.trim(),
          phone: '',
          birthday: '',
          receiveSmsNotifications: true,
          password: ''
        },
        selectedPlan: null,
        brothPreference: null,
        deliveryInfo: {
          street: '',
          unit: '',
          city: '',
          state: '',
          postalCode: '',
          deliveryInstructions: '',
          isValidAddress: false,
          isInDeliveryArea: false
        },
        promoCode: '',
        agreedToTerms: false,
        currentStep: 0, // Current step is 0 (email collection)
        completedSteps: [],
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }

      updateFormData(updatedFormData)

      // Save progress to database (step 0 = email collected, moving to step 1)
      const progressSaved = await saveSignupProgress(0, updatedFormData)
      if (!progressSaved) {
        console.warn('Failed to save signup progress, but continuing...')
      }

      // Move to next step
      nextStep()
      router.push('/signup/plan')

    } catch (error) {
      console.error('Signup initialization error:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome to The Brotherie
          </h1>
          <p className="text-xl text-slate-600 max-w-lg mx-auto">
            Join thousands who've discovered the power of locally-sourced, 
            organic bone broth delivered fresh to your door.
          </p>
        </div>

        {/* Email Collection Card */}
        <Card className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              Let's get started
            </h2>
            <p className="text-slate-600">
              Enter your email to begin customizing your weekly bone broth delivery. 
              We'll never sell or share your information.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="text-lg py-4"
              required
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleContinue()
                }
              }}
            />

            {/* Error Alert */}
            {error && (
              <Alert type="error">
                {error}
              </Alert>
            )}

            <Button
              onClick={handleContinue}
              isLoading={isLoading}
              disabled={!email.trim()}
              size="lg"
              className="w-full py-4 text-lg"
            >
              {isLoading ? 'Starting your journey...' : 'Get Started →'}
            </Button>
          </div>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500 mb-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure & Private
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Cancel Anytime
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Local & Organic
            </div>
          </div>
          
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <a href="/auth/login" className="text-emerald-600 hover:underline">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
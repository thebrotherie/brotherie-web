'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import { toast, Toaster } from 'react-hot-toast'

// Plan configuration - easily editable
const PLANS = {
  sip: {
    id: 'sip',
    name: 'Sip',
    description: 'For the occasional daily sipper of bone broth',
    containers: 4,
    size: '18oz',
    weeklyPrice: 32, // Update with actual pricing
    features: ['Perfect for beginners', 'Weekly delivery', 'Premium quality']
  },
  daily: {
    id: 'daily', 
    name: 'Daily',
    description: 'So you\'re cooking a little and sipping on broth',
    containers: 8,
    size: '18oz', 
    weeklyPrice: 56, // Update with actual pricing
    features: ['Great for regular users', 'Weekly delivery', 'Mix of cooking & sipping']
  },
  chef: {
    id: 'chef',
    name: 'Chef', 
    description: 'All star kitchen hero. You\'re cooking & sipping constantly or maybe you\'re a larger family!',
    containers: 12,
    size: '18oz',
    weeklyPrice: 84, // Update with actual pricing
    features: ['Perfect for families', 'Weekly delivery', 'Maximum variety']
  }
}

// Broth allocation options
const BROTH_OPTIONS = [
  { id: 'all-chicken', label: 'All Chicken', chicken: 100, beef: 0 },
  { id: 'mostly-chicken', label: 'Mostly Chicken', chicken: 75, beef: 25 },
  { id: 'balanced', label: 'Balanced', chicken: 50, beef: 50 },
  { id: 'mostly-beef', label: 'Mostly Beef', chicken: 25, beef: 75 },
  { id: 'all-beef', label: 'All Beef', chicken: 0, beef: 100 }
]

// Types for our data structure
interface CustomerData {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  street: string
  city: string
  state: string
  postal_code: string
  credit_balance: number
  delivery_instructions: string
  receive_sms_notifications: boolean
  stripe_customer_id: string
}

interface SubscriptionData {
  id: string
  customer_id: string
  tier_id: string
  status: string
  chicken_ct: number
  beef_ct: number
  stripe_subscription_id: string
}

interface PaymentMethod {
  id: string
  type: string
  last4: string
  exp_month: number
  exp_year: number
  brand: string
}

export default function CustomerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('delivery')
  
  // Form states for editing
  const [deliveryForm, setDeliveryForm] = useState({
    phone: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    delivery_instructions: '',
    receive_sms_notifications: false
  })
  
  const [planForm, setPlanForm] = useState({
    tier_id: '',
    chicken_ct: 0,
    beef_ct: 0
  })

  // Using the existing supabase client from lib

  // Load user data and customer information
  useEffect(() => {
    loadCustomerData()
  }, [])

  const loadCustomerData = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      setUser(user)

      // Load customer data
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('email', user.email)
        .single()

      if (customerError) throw customerError
      setCustomerData(customer)

      // Set delivery form with current data
      setDeliveryForm({
        phone: customer.phone || '',
        street: customer.street || '',
        city: customer.city || '',
        state: customer.state || '',
        postal_code: customer.postal_code || '',
        delivery_instructions: customer.delivery_instructions || '',
        receive_sms_notifications: customer.receive_sms_notifications || false
      })

      // Load subscription data
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('customer_id', customer.id)
        .eq('status', 'active')
        .single()

      if (subError) throw subError
      setSubscriptionData(subscription)

      // Set plan form with current data
      setPlanForm({
        tier_id: subscription.tier_id,
        chicken_ct: subscription.chicken_ct,
        beef_ct: subscription.beef_ct
      })

      // TODO: Load payment method from Stripe
      // This would require a server-side API route to fetch from Stripe
      setPaymentMethod({
        id: 'pm_fake',
        type: 'card',
        last4: '4242',
        exp_month: 12,
        exp_year: 2025,
        brand: 'visa'
      })

    } catch (error) {
      console.error('Error loading customer data:', error)
      toast.error('Failed to load account information')
    } finally {
      setLoading(false)
    }
  }

  // Save delivery information
  const saveDeliveryInfo = async () => {
    if (!customerData) return

    try {
      const { error } = await supabase
        .from('customers')
        .update({
          phone: deliveryForm.phone,
          street: deliveryForm.street,
          city: deliveryForm.city,
          state: deliveryForm.state,
          postal_code: deliveryForm.postal_code,
          delivery_instructions: deliveryForm.delivery_instructions,
          receive_sms_notifications: deliveryForm.receive_sms_notifications
        })
        .eq('id', customerData.id)

      if (error) throw error

      // Update local state
      setCustomerData({ ...customerData, ...deliveryForm })
      toast.success('Your delivery information has been updated!')
      
    } catch (error) {
      console.error('Error updating delivery info:', error)
      toast.error('Failed to update delivery information')
    }
  }

  // Save plan changes
  const savePlanInfo = async () => {
    if (!subscriptionData) return

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          tier_id: planForm.tier_id,
          chicken_ct: planForm.chicken_ct,
          beef_ct: planForm.beef_ct
        })
        .eq('id', subscriptionData.id)

      if (error) throw error

      // Update local state
      setSubscriptionData({ 
        ...subscriptionData, 
        tier_id: planForm.tier_id,
        chicken_ct: planForm.chicken_ct,
        beef_ct: planForm.beef_ct
      })
      toast.success('Your plan has been updated!')
      
    } catch (error) {
      console.error('Error updating plan:', error)
      toast.error('Failed to update plan')
    }
  }

  // Calculate broth allocation percentages
  const getBrothAllocation = () => {
    if (!subscriptionData) return null
    const total = subscriptionData.chicken_ct + subscriptionData.beef_ct
    return {
      chicken: Math.round((subscriptionData.chicken_ct / total) * 100),
      beef: Math.round((subscriptionData.beef_ct / total) * 100)
    }
  }

  // Get current plan details
  const getCurrentPlan = () => {
    if (!subscriptionData) return null
    return PLANS[subscriptionData.tier_id as keyof typeof PLANS]
  }

  // Navigation items for the sidebar
  const navItems = [
    { id: 'delivery', label: 'Delivery Info', icon: '📍' },
    { id: 'plan', label: 'Plan Details', icon: '📦' },
    { id: 'payment', label: 'Payment Method', icon: '💳' },
    { id: 'other', label: 'Account Options', icon: '⚙️' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Credit Balance Banner */}
      {customerData?.credit_balance && customerData.credit_balance > 0 && (
        <div className="bg-green-100 border-l-4 border-green-500 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-green-500 text-xl">💰</span>
              </div>
              <div className="ml-3">
                <p className="text-green-700 font-medium">
                  You have a credit balance of ${customerData.credit_balance.toFixed(2)}
                </p>
                <p className="text-green-600 text-sm">This will be automatically applied to your next order.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Account</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {customerData?.first_name}! Update your delivery preferences, plan details, and account settings.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeSection === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Delivery Information Section */}
            {activeSection === 'delivery' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={deliveryForm.phone}
                      onChange={(e) => setDeliveryForm({...deliveryForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  {/* SMS Notifications Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sms-notifications"
                      checked={deliveryForm.receive_sms_notifications}
                      onChange={(e) => setDeliveryForm({...deliveryForm, receive_sms_notifications: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sms-notifications" className="ml-2 block text-sm text-gray-700">
                      Receive delivery confirmation texts
                    </label>
                  </div>

                  {/* Street Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={deliveryForm.street}
                      onChange={(e) => setDeliveryForm({...deliveryForm, street: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123 Main Street"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={deliveryForm.city}
                      onChange={(e) => setDeliveryForm({...deliveryForm, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your City"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={deliveryForm.state}
                      onChange={(e) => setDeliveryForm({...deliveryForm, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="CA"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={deliveryForm.postal_code}
                      onChange={(e) => setDeliveryForm({...deliveryForm, postal_code: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="12345"
                    />
                  </div>

                  {/* Delivery Instructions */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={deliveryForm.delivery_instructions}
                      onChange={(e) => setDeliveryForm({...deliveryForm, delivery_instructions: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Leave at front door, ring doorbell, etc."
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-6">
                  <button
                    onClick={saveDeliveryInfo}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    Save Delivery Information
                  </button>
                </div>
              </div>
            )}

            {/* Plan Information Section */}
            {activeSection === 'plan' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Plan Information</h2>
                
                {getCurrentPlan() && (
                  <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Current Plan: {getCurrentPlan()?.name}
                    </h3>
                    <p className="text-blue-700 mb-3">{getCurrentPlan()?.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600 font-medium">Containers:</span>
                        <p className="text-blue-900">{getCurrentPlan()?.containers}</p>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Size:</span>
                        <p className="text-blue-900">{getCurrentPlan()?.size}</p>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Weekly Cost:</span>
                        <p className="text-blue-900">${getCurrentPlan()?.weeklyPrice}</p>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Broth Mix:</span>
                        <p className="text-blue-900">
                          {getBrothAllocation()?.chicken}% Chicken, {getBrothAllocation()?.beef}% Beef
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Plan Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Your Plan
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.values(PLANS).map((plan) => (
                      <div
                        key={plan.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          planForm.tier_id === plan.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setPlanForm({
                          ...planForm, 
                          tier_id: plan.id,
                          chicken_ct: Math.floor(plan.containers / 2),
                          beef_ct: Math.ceil(plan.containers / 2)
                        })}
                      >
                        <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                        <p className="font-medium text-gray-900">{plan.containers} containers • ${plan.weeklyPrice}/week</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Broth Allocation */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Broth Allocation
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {BROTH_OPTIONS.map((option) => {
                      const totalContainers = getCurrentPlan()?.containers || 4
                      const chickenCount = Math.round((option.chicken / 100) * totalContainers)
                      const beefCount = totalContainers - chickenCount
                      
                      return (
                        <div
                          key={option.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            planForm.chicken_ct === chickenCount && planForm.beef_ct === beefCount
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => setPlanForm({
                            ...planForm,
                            chicken_ct: chickenCount,
                            beef_ct: beefCount
                          })}
                        >
                          <h5 className="font-medium text-gray-900">{option.label}</h5>
                          <p className="text-sm text-gray-600">
                            {chickenCount} Chicken • {beefCount} Beef
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-6">
                  <button
                    onClick={savePlanInfo}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    Save Plan Changes
                  </button>
                </div>
              </div>
            )}

            {/* Payment Method Section */}
            {activeSection === 'payment' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                
                {paymentMethod && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center mr-4">
                        <span className="text-white text-xs font-bold">
                          {paymentMethod.brand.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          **** **** **** {paymentMethod.last4}
                        </p>
                        <p className="text-sm text-gray-600">
                          Expires {paymentMethod.exp_month.toString().padStart(2, '0')}/{paymentMethod.exp_year}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        // TODO: Implement Stripe payment method update
                        toast.success('Redirecting to secure payment update...')
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                      Update Card
                    </button>
                  </div>
                )}

                <p className="text-sm text-gray-600">
                  Your payment information is securely stored and processed by Stripe. 
                  Click "Update Card" to change your payment method.
                </p>
              </div>
            )}

            {/* Other Options Section */}
            {activeSection === 'other' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Options</h2>
                
                <div className="space-y-4">
                  {/* Previous Orders */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Previous Orders</h3>
                      <p className="text-sm text-gray-600">View your order history and tracking information</p>
                    </div>
                    <a
                      href="/dashboard/orders"
                      className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      View Orders
                    </a>
                  </div>

                  {/* Change Password */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Change Password</h3>
                      <p className="text-sm text-gray-600">Update your account password</p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const { error } = await supabase.auth.resetPasswordForEmail(
                            user?.email || '',
                            { redirectTo: `${window.location.origin}/auth/reset-password` }
                          )
                          if (error) throw error
                          toast.success('Password reset email sent!')
                        } catch (error) {
                          toast.error('Failed to send password reset email')
                        }
                      }}
                      className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      Reset Password
                    </button>
                  </div>

                  {/* Cancel Service */}
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <h3 className="font-medium text-red-900">Cancel Service</h3>
                      <p className="text-sm text-red-600">Cancel your subscription (we'll be sad to see you go!)</p>
                    </div>
                    <a
                      href="/dashboard/cancel"
                      className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-100 transition-colors"
                    >
                      Cancel Service
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
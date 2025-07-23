'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { PLANS, getAllPlans, getDefaultPlan, Plan } from '@/lib/plansConfig'
import Link from 'next/link'
import Image from 'next/image'
import { Check, Truck, Award, Leaf } from 'lucide-react'

// Types for our data
interface Product {
  id: string
  name: string
  slug: string
  marketing_description: string
  image_url: string
  category: string
  is_active: boolean
  sort_order: number
}

interface ProductBenefit {
  id: string
  product_id: string
  benefit: string
  sort_order: number
}

interface ProductWithBenefits extends Product {
  product_benefits: ProductBenefit[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithBenefits[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string>(getDefaultPlan().id)

  // Load products from database
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      
      // Get products with their benefits from database
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          product_benefits (
            id,
            product_id,
            benefit,
            sort_order
          )
        `)
        .eq('is_active', true)
        .eq('category', 'broth')
        .order('sort_order')

      if (productsError) throw productsError

      // Sort benefits by sort_order
      const productsWithSortedBenefits = productsData.map(product => ({
        ...product,
        product_benefits: product.product_benefits.sort((a: any, b: any) => a.sort_order - b.sort_order)
      }))

      setProducts(productsWithSortedBenefits)
    } catch (error) {
      console.error('Error loading products:', error)
      // You could add error handling/fallback here if needed
    } finally {
      setLoading(false)
    }
  }

  // Handle plan selection
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  // Get signup URL with selected plan
  const getSignupUrl = (planId?: string) => {
    const targetPlan = planId || selectedPlan
    return `/signup/plan/email?plan=${targetPlan}`
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading our premium broths...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags would be handled by Next.js head or metadata API */}
      
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-emerald-50 to-emerald-100 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Premium Bone Broths
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Slow-simmered perfection using pasture-raised, grass-fed bones from local farms. 
              Small batches, big flavor, zero additives.
            </p>
            
            {/* Quality Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-emerald-800">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                <span>Organic & Local</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Small Batch</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                <span>Free Local Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Products Section - Side-by-Side Layout */}
        <section className="mb-20">
          <div className="space-y-24">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className={`flex flex-col lg:flex-row items-center gap-16 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Product Image */}
                <div className="flex-1 max-w-lg">
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0} // Prioritize first image
                    />
                  </div>
                </div>

                {/* Product Content */}
                <div className="flex-1 max-w-2xl">
                  <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                    {product.name}
                  </h2>
                  
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    {product.marketing_description}
                  </p>

                  {/* Health Benefits */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Health Benefits
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.product_benefits.map((benefit) => (
                        <div key={benefit.id} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 leading-relaxed">{benefit.benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              Get fresh, premium bone broth delivered weekly to your door.
            </p>
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-medium">
              <Truck className="w-5 h-5" />
              <span>Free local delivery included</span>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {getAllPlans().map((plan) => (
              <div
                key={plan.id}
                onClick={() => handlePlanSelect(plan.id)}
                className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 transition-all hover:shadow-xl cursor-pointer ${
                  selectedPlan === plan.id
                    ? 'border-emerald-500 scale-105 ring-4 ring-emerald-100' 
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Selected Badge */}
                {selectedPlan === plan.id && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-emerald-600 text-white p-2 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                )}

                {/* Plan Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.weeklyPrice}
                    </span>
                    <span className="text-gray-600">/week</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center justify-center gap-2 text-gray-700">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Main CTA Button */}
          <div className="text-center mt-12">
            <Link
              href={getSignupUrl()}
              className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Start Your {PLANS[selectedPlan].name} Subscription
            </Link>
            <p className="text-sm text-gray-600 mt-3">
              Selected: {PLANS[selectedPlan].containers} containers weekly for ${PLANS[selectedPlan].weeklyPrice}/week
            </p>
          </div>

          {/* Additional CTA */}
          <div className="text-center mt-12 pt-8 border-t border-emerald-200">
            <p className="text-gray-600 mb-4">
              Questions about our broths or ingredients?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-emerald-700 font-medium hover:text-emerald-800 transition-colors"
            >
              Get in touch with us
              <span>→</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
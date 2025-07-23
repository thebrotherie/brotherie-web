// src/lib/plansConfig.ts
// Centralized plan configuration - edit here to update everywhere

export interface Plan {
  id: string
  name: string
  description: string
  containers: number
  size: string
  weeklyPrice: number
  popular: boolean
  features: string[]
}

export const PLANS: Record<string, Plan> = {
  sip: {
    id: 'sip',
    name: 'Sip',
    description: 'Perfect for the occasional daily sipper',
    containers: 4,
    size: '18oz',
    weeklyPrice: 46, // Update pricing here
    popular: false,
    features: ['4 containers weekly', 'Mix of chicken & beef', 'Free local delivery', 'Pause anytime']
  },
  daily: {
    id: 'daily', 
    name: 'Daily',
    description: 'Great for cooking and regular sipping',
    containers: 8,
    size: '18oz', 
    weeklyPrice: 88, // Update pricing here
    popular: true, // Default/recommended plan
    features: ['8 containers weekly', 'Choose your mix', 'Free local delivery', 'Perfect for most families']
  },
  chef: {
    id: 'chef',
    name: 'Chef', 
    description: 'For the kitchen hero or larger families',
    containers: 12,
    size: '18oz',
    weeklyPrice: 124, // Update pricing here
    popular: false,
    features: ['12 containers weekly', 'Maximum variety', 'Free local delivery', 'Great for meal prep']
  }
}

// Helper function to get plan by ID
export const getPlanById = (planId: string): Plan | null => {
  return PLANS[planId] || null
}

// Helper function to get all plans as array
export const getAllPlans = (): Plan[] => {
  return Object.values(PLANS)
}

// Helper function to get default plan
export const getDefaultPlan = (): Plan => {
  return Object.values(PLANS).find(plan => plan.popular) || PLANS.daily
}
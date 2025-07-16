'use client'
import { create } from 'zustand'
import React from 'react'

/* ---------- zustand store ---------- */
export type WizardData = {
  tierId: string
  email?: string
  promoCode?: string
  tierQty?: 4 | 8 | 12
  chickenCt?: number
  beefCt?: number
  address?: { street: string; unit?: string; city: string; zip: string }
  instructions?: string
  firstName?: string
  lastName?: string
  dob?: string
  phone?: string
  smsOk?: boolean
  password?: string
}


interface State {
  step: number
  data: WizardData
  setStep: (n: number) => void
  update: (d: Partial<WizardData>) => void
}

export const useWizard = create<State>((set) => ({
  step: 0,
  data: {
      tierId: ''
  },                              
  setStep: (n) => set({ step: n }),
  update: (d) => set((s) => ({ data: { ...s.data, ...d } })),
}))

/* ---------- NEW: React context wrapper ---------- */
export function WizardProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;       {/* acts as a logical provider if we add context later */}
}

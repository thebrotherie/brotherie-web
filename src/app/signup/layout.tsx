//src/app/signup/layout.tsx 
'use client'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { WizardProvider, useWizard } from '@/components/signup/WizardStore'
import Stepper from '@/components/signup/Stepper'

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <WizardProvider>
      <Suspense fallback={null}>
        <InitTier /> {/* reads ?tier=… once */}
      </Suspense>
      <div className="mx-auto max-w-lg p-4">
        <Stepper />
        {children}
      </div>
    </WizardProvider>
  )
}

/* --- read ?tier=daily and store once --- */
function InitTier() {
  const params = useSearchParams()
  const tier = params.get('tier') as 'sip' | 'daily' | 'chef' | null
  const { data, update } = useWizard()

  useEffect(() => {
    if (tier && !data.tierId) update({ tierId: tier })
  }, [tier, data.tierId, update])

  return null
}
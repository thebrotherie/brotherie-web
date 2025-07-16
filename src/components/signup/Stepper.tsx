'use client'
import { useWizard } from './WizardStore'

const steps = ['1. Select Plan', '2. Delivery Info', '3. Create Account', '4. Confirm']

export default function Stepper() {
  const { step } = useWizard()
  return (
    <nav aria-label="Progress" className="mb-6">
      <ol className="flex items-center">
        {steps.map((s, i) => (
          <li key={s} className="flex-1">
            <div
              className={`text-xs text-center ${
                i === step ? 'font-semibold text-emerald-600' : 'text-slate-400'
              }`}
              aria-current={i === step ? 'step' : undefined}
            >
              {s}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

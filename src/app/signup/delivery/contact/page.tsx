'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWizard } from '@/components/signup/WizardStore'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

/* ------ validation schema ------ */
const phoneRegex = /^(\+1\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/
const Schema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName: z.string().min(2, 'Required'),
  dob: z
    .string()
    .optional()
    .refine(
      (v) => !v || v === '' || (v.match(/^\d{4}-\d{2}-\d{2}$/) && new Date(v) < new Date()),
      'Date must be in the past and in MM-DD-YYYY format'
    ),
  phone: z.string().regex(phoneRegex, 'US phone number'),
  smsOk: z.boolean(),
})
type FormData = z.infer<typeof Schema>

export default function ContactPage() {
  const router = useRouter()
  const { data, update, setStep } = useWizard()

  /* guard: need address from previous page */
  useEffect(() => {
    setStep(1)                                    // still Delivery main step
    if (!data.address) router.replace('/signup/delivery/address')
  }, [data.address, router, setStep])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    mode: 'onChange',
    defaultValues: {
      firstName: data.firstName ?? '',
      lastName:  data.lastName ?? '',
      phone:     data.phone ?? '',
      smsOk:     data.smsOk ?? true,
      dob: data.dob ?? '',
    },
  })

  const onSubmit = (f: FormData) => {
    update({
      firstName: f.firstName,
      lastName:  f.lastName,
      dob:       f.dob || undefined, // convert empty string to undefined
      phone:     f.phone,
      smsOk:     f.smsOk,
    })
    router.push('/signup/account')              // next main step
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Contact details</h1>
      <p className="text-center text-slate-600">
        We will only use your phone number for delivery notifications. 
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">First name *</label>
            <input {...register('firstName')} className="input-field" />
            {errors.firstName && <p className="text-red-600 text-xs">{errors.firstName.message}</p>}
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Last name *</label>
            <input {...register('lastName')} className="input-field" />
            {errors.lastName && <p className="text-red-600 text-xs">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Date of birth (optional) <span className="text-xs">(MM-DD-YYYY)</span>
          </label>
          <input 
            type="date"
            {...register('dob')}
            className="input-field"
            onFocus={(e) => {
              if (!e.target.value) {
                e.target.type = 'date';
              }
            }}
            onBlur={(e) => {
              if (!e.target.value) {
                e.target.type = 'text';
              }
            }}
          />
          {errors.dob && <p className="text-red-600 text-xs">{errors.dob.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Phone number *</label>
          <input type="tel" {...register('phone')} placeholder="555-123-4567" className="input-field" />
          {errors.phone && <p className="text-red-600 text-xs">{errors.phone.message}</p>}
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" className="accent-emerald-600" {...register('smsOk')} />
          Text me delivery updates
        </label>

        <div className="flex justify-between mt-6">
          <button type="button" onClick={() => router.back()} className="btn-oauth">
            ← Back
          </button>
          <button type="submit" className="btn-primary" disabled={!isValid}>
            Next →
          </button>
        </div>
      </form>
    </div>
  )
}
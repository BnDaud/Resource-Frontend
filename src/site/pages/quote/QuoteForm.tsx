import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api, ApiError } from '../../../api/client'
import { Field } from '../../../components/ui'
import { useQuoteList } from '../../context/QuoteListContext'

export const PHONE_RE = /^\+?[0-9][0-9\s\-()]{5,23}$/

const schema = z.object({
  full_name: z.string().trim().min(2, 'Enter your full name').max(160),
  customer_type: z.enum(['wholesale', 'retail']),
  phone: z.string().trim().regex(PHONE_RE, 'Enter a phone number we can reach you on'),
  email: z.string().trim().max(254).refine((v) => v === '' || /^\S+@\S+\.\S+$/.test(v), 'Enter a valid email or leave it empty'),
  company: z.string().max(160),
  preferred_contact: z.enum(['', 'phone', 'whatsapp', 'email']),
  message: z.string().max(3000, 'Please keep the message under 3000 characters'),
  website: z.string().max(200), // honeypot: real visitors never see or fill this
})
type Values = z.infer<typeof schema>

export interface Submitted { reference: string; phone: string }

export function QuoteForm({ onSent }: { onSent: (r: Submitted) => void }) {
  const { lines } = useQuoteList()
  const [formError, setFormError] = useState('')
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: '', customer_type: 'retail', phone: '', email: '', company: '', preferred_contact: '', message: '', website: '' },
  })

  const submit = handleSubmit(async (v) => {
    setFormError('')
    try {
      const res = await api.post<{ reference: string }>('/quotes', {
        ...v, email: v.email || null,
        items: lines.map((l) => ({ product_id: l.productId, quantity: l.quantity, note: l.note })),
      })
      onSent({ reference: res.reference, phone: v.phone })
    } catch (e) {
      if (e instanceof ApiError && e.fields) Object.entries(e.fields).forEach(([k, m]) => k in v && setError(k as keyof Values, { message: m }))
      setFormError(e instanceof ApiError ? (e.status === 429 ? 'Too many requests from this device. Please try again later or contact us on WhatsApp.' : e.message) : 'Something went wrong. Please try again.')
    }
  })

  return (
    <form onSubmit={submit} noValidate className="space-y-4 rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
      <h2 className="text-xl font-bold">Your details</h2>
      {formError && <div role="alert" className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-800">{formError}</div>}
      <Field label="Full name *" htmlFor="full_name" error={errors.full_name?.message}><input id="full_name" autoComplete="name" className="input" {...register('full_name')} /></Field>
      <fieldset>
        <legend className="label">I am a *</legend>
        <div className="grid grid-cols-2 gap-2 rounded-full bg-ice p-1">
          {([['retail', 'Retail customer'], ['wholesale', 'Wholesale buyer']] as const).map(([v, l]) => (
            <label key={v} className="has-[:checked]:bg-navy has-[:checked]:text-white flex min-h-[2.5rem] cursor-pointer items-center justify-center rounded-full text-sm font-bold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold">
              <input type="radio" value={v} className="sr-only" {...register('customer_type')} />{l}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Phone number *" htmlFor="phone" hint="We may contact you on this number, including on WhatsApp." error={errors.phone?.message}><input id="phone" type="tel" autoComplete="tel" className="input" {...register('phone')} /></Field>
      <Field label="Email (optional)" htmlFor="email" error={errors.email?.message}><input id="email" type="email" autoComplete="email" className="input" {...register('email')} /></Field>
      <Field label="Company (optional)" htmlFor="company"><input id="company" autoComplete="organization" className="input" {...register('company')} /></Field>
      <Field label="Preferred contact (optional)" htmlFor="preferred_contact">
        <select id="preferred_contact" className="input" {...register('preferred_contact')}><option value="">No preference</option><option value="phone">Phone call</option><option value="whatsapp">WhatsApp</option><option value="email">Email</option></select>
      </Field>
      <Field label="Message (optional)" htmlFor="message" error={errors.message?.message}><textarea id="message" rows={4} className="input py-3" placeholder="Sizes, finishes, delivery area, when you need it…" {...register('message')} /></Field>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Website<input tabIndex={-1} autoComplete="off" {...register('website')} /></label></div>
      <button className="btn-gold !min-h-[3rem] w-full text-base" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Submit quote request'}</button>
      <p className="text-center text-xs leading-relaxed text-mute">We use your details only to respond to this request. No payment is taken online.</p>
    </form>
  )
}

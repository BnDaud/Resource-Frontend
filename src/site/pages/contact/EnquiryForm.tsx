import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { api, ApiError } from '../../../api/client'
import { Field } from '../../../components/ui'
import { PHONE_RE } from '../quote/QuoteForm'

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(160),
  phone: z.string().trim().regex(PHONE_RE, 'Enter a phone number we can reach you on'),
  email: z.string().trim().max(254).refine((v) => v === '' || /^\S+@\S+\.\S+$/.test(v), 'Enter a valid email or leave it empty'),
  subject: z.string().trim().min(2, 'Enter a subject').max(200),
  message: z.string().trim().min(5, 'Write a short message').max(5000),
  website: z.string().max(200), // honeypot
})
type Values = z.infer<typeof schema>

export function EnquiryForm({ onSent }: { onSent: (r: { reference: string; phone: string; subject: string }) => void }) {
  const [formError, setFormError] = useState('')
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema), defaultValues: { name: '', phone: '', email: '', subject: '', message: '', website: '' },
  })
  const submit = handleSubmit(async (v) => {
    setFormError('')
    try {
      const res = await api.post<{ reference: string }>('/enquiries', { ...v, email: v.email || null })
      onSent({ reference: res.reference, phone: v.phone, subject: v.subject })
    } catch (e) {
      if (e instanceof ApiError && e.fields) Object.entries(e.fields).forEach(([k, m]) => k in v && setError(k as keyof Values, { message: m }))
      setFormError(e instanceof ApiError ? (e.status === 429 ? 'Too many messages from this device. Please try again later or contact us on WhatsApp.' : e.message) : 'Something went wrong. Please try again.')
    }
  })
  return (
    <form onSubmit={submit} noValidate className="space-y-4 rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
      <h2 className="text-xl font-bold">Send a message</h2>
      <p className="-mt-2 text-sm text-mute">General questions only. For prices on several products, <Link className="font-bold text-gold-deep" to="/quote">request a quote</Link>.</p>
      {formError && <div role="alert" className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-800">{formError}</div>}
      <Field label="Name *" htmlFor="e-name" error={errors.name?.message}><input id="e-name" autoComplete="name" className="input" {...register('name')} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone number *" htmlFor="e-phone" error={errors.phone?.message}><input id="e-phone" type="tel" autoComplete="tel" className="input" {...register('phone')} /></Field>
        <Field label="Email (optional)" htmlFor="e-email" error={errors.email?.message}><input id="e-email" type="email" autoComplete="email" className="input" {...register('email')} /></Field>
      </div>
      <Field label="Subject *" htmlFor="e-subject" error={errors.subject?.message}><input id="e-subject" className="input" {...register('subject')} /></Field>
      <Field label="Message *" htmlFor="e-message" error={errors.message?.message}><textarea id="e-message" rows={5} className="input py-3" {...register('message')} /></Field>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Website<input tabIndex={-1} autoComplete="off" {...register('website')} /></label></div>
      <button className="btn-gold !min-h-[3rem] w-full text-base" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send message'}</button>
    </form>
  )
}

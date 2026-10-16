import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api, ApiError } from '../../api/client'
import type { SiteSettings } from '../../api/types'
import { ErrorNote, Field, PageHeader, Spinner, useToast } from '../../components/ui'
import { useFetch } from '../../lib/useFetch'

const url = z.string().max(300).refine((v) => v === '' || /^https?:\/\/.+/.test(v), 'Must start with https://')
const schema = z.object({
  business_name: z.string().trim().min(1, 'Required').max(160),
  address: z.string().trim().min(1, 'Required').max(300),
  opening_hours: z.string().max(200),
  phone: z.string().max(40),
  email: z.string().max(254).refine((v) => v === '' || /^\S+@\S+\.\S+$/.test(v), 'Enter a valid email'),
  whatsapp_number: z.string().regex(/^(\d{8,15})?$/, 'Digits only, international format (e.g. 2348012345678)'),
  whatsapp_message: z.string().max(300),
  instagram_url: url,
  tiktok_url: url,
  seo_title: z.string().max(160),
  seo_description: z.string().max(320),
})

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="card"><h2 className="mb-4 text-base font-bold">{title}</h2>{children}</section>
)

export default function SettingsPage() {
  const toast = useToast()
  const { data, error, loading, reload } = useFetch(() => api.get<SiteSettings>('/admin/settings'), [])
  const { register, handleSubmit, reset, watch, setError, formState: { errors, isSubmitting, isDirty } } = useForm<SiteSettings>({ resolver: zodResolver(schema) })
  useEffect(() => { if (data) reset(data) }, [data, reset])
  const number = watch('whatsapp_number'), message = watch('whatsapp_message')

  const submit = handleSubmit(async (v) => {
    try { reset(await api.put<SiteSettings>('/admin/settings', v)); toast('Settings saved') }
    catch (e) {
      if (e instanceof ApiError && e.fields) Object.entries(e.fields).forEach(([k, m]) => setError(k as keyof SiteSettings, { message: m }))
      toast(e instanceof ApiError ? e.message : 'Could not save', 'err')
    }
  })
  if (loading && !data) return <Spinner />
  if (error) return <ErrorNote message={error} onRetry={reload} />

  const text = (name: keyof SiteSettings, label: string, o: { hint?: string; placeholder?: string; type?: string } = {}) => (
    <Field label={label} htmlFor={name} hint={o.hint} error={errors[name]?.message}>
      <input id={name} type={o.type ?? 'text'} placeholder={o.placeholder} className="input" {...register(name)} />
    </Field>
  )

  return (
    <form onSubmit={submit} noValidate>
      <PageHeader title="Site settings" sub="Shown on the public website. Empty fields are hidden, never replaced with made-up values."
        actions={<button className="btn-gold" disabled={isSubmitting || !isDirty}>{isSubmitting ? 'Saving…' : 'Save settings'}</button>} />
      <div className="max-w-3xl space-y-4">
        <Section title="Business">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">{text('business_name', 'Business name')}</div>
            <div className="sm:col-span-2">{text('address', 'Address', { hint: 'The "Get directions" button opens Google Maps with this address.' })}</div>
            <div className="sm:col-span-2">{text('opening_hours', 'Opening hours', { placeholder: 'e.g. Mon–Sat, 8am–6pm' })}</div>
            {text('phone', 'Phone', { placeholder: '+234…' })}{text('email', 'Email', { type: 'email' })}
          </div>
        </Section>
        <Section title="WhatsApp">
          <div className="space-y-4">
            {text('whatsapp_number', 'WhatsApp number', { placeholder: '2348012345678', hint: 'International format, digits only: no +, spaces or dashes.' })}
            <Field label="Default message" htmlFor="wm" error={errors.whatsapp_message?.message}><textarea id="wm" rows={2} className="input py-3" {...register('whatsapp_message')} /></Field>
            <div className="break-all rounded-2xl bg-ice p-4 text-xs text-slate-700"><strong>Link preview</strong><br />{number ? `https://wa.me/${number}?text=${encodeURIComponent(message ?? '')}` : 'Enter a number to see the link.'}</div>
          </div>
        </Section>
        <Section title="Social links">
          <div className="grid gap-4 sm:grid-cols-2">{text('instagram_url', 'Instagram URL', { placeholder: 'https://instagram.com/…' })}{text('tiktok_url', 'TikTok URL', { placeholder: 'https://tiktok.com/@…' })}</div>
        </Section>
        <Section title="Search & sharing">
          <div className="space-y-4">{text('seo_title', 'Site title')}<Field label="Meta description" htmlFor="sd" error={errors.seo_description?.message}><textarea id="sd" rows={2} className="input py-3" {...register('seo_description')} /></Field></div>
        </Section>
      </div>
    </form>
  )
}

import { Check } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../../components/Container'
import { WhatsAppButton } from '../../components/WhatsAppButton'
import { useSettings } from '../../context/SettingsContext'
import { saveRequest } from '../../lib/savedRequests'
import { usePageMeta } from '../../lib/usePageMeta'
import { EnquiryForm } from './EnquiryForm'

export default function ContactPage() {
  const { settings: s, directionsUrl } = useSettings()
  const [sent, setSent] = useState<{ reference: string; subject: string } | null>(null)
  usePageMeta({ title: 'Contact', description: `Visit ${s.business_name} at ${s.address}, or send us a message.` })

  // Only details the business has actually entered are shown.
  const details = [['Phone', s.phone, `tel:${s.phone}`], ['Email', s.email, `mailto:${s.email}`], ['Hours', s.opening_hours, ''], ['Instagram', s.instagram_url, s.instagram_url], ['TikTok', s.tiktok_url, s.tiktok_url]].filter(([, v]) => v)

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact {s.business_name}</h1>
      <p className="mb-8 mt-2 max-w-2xl text-slate-600">Questions about availability, sizes or finishes? Message us, call, or visit. For several products, a quote request is faster.</p>
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gold-deep">Address</h2>
            <p className="mt-2 text-lg font-bold leading-snug">{s.address}</p>
            <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn-ghost btn-sm mt-4">Get directions in Google Maps</a>
          </div>
          {details.length > 0 && (
            <dl className="divide-y divide-slate-100 rounded-3xl bg-white px-6 py-2 shadow-card">
              {details.map(([k, v, href]) => (
                <div key={k} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-mute">{k}</dt><dd className="font-bold">{href ? <a href={href} className="hover:underline" {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{v}</a> : v}</dd></div>
              ))}
            </dl>
          )}
          <WhatsAppButton className="btn w-full !min-h-[3.25rem] bg-emerald-700 text-base text-white shadow-btn hover:bg-emerald-800" />
          <div className="h-52 overflow-hidden rounded-3xl bg-ice-deep shadow-card">
            <iframe title="Map" loading="lazy" className="h-full w-full border-0" src={`https://maps.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`} />
          </div>
        </div>

        {sent ? (
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-card" role="status">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-800"><Check className="h-7 w-7" aria-hidden /></div>
            <h2 className="mt-4 text-2xl font-bold">Message received</h2>
            <p className="mt-2 text-slate-600">We will reply soon. Your reference is <strong className="font-display">{sent.reference}</strong>.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <WhatsAppButton text={`Hello ${s.business_name}, I sent a message about "${sent.subject}". Reference ${sent.reference}.`}>Send reference on WhatsApp</WhatsAppButton>
              <Link to="/track" className="btn-ghost">Track this message</Link>
            </div>
          </div>
        ) : <EnquiryForm onSent={(r) => { saveRequest({ reference: r.reference, kind: 'enquiry', phone: r.phone }); setSent({ reference: r.reference, subject: r.subject }) }} />}
      </div>
    </Container>
  )
}

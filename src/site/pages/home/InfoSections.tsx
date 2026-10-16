import { Link } from 'react-router-dom'
import { Container, SectionHeading } from '../../components/Container'
import { WhatsAppButton } from '../../components/WhatsAppButton'
import { useSettings } from '../../context/SettingsContext'
import type { Testimonial } from '../../types'

export function Intro() {
  const { settings } = useSettings()
  return (
    <section className="pt-20">
      <Container>
        <div className="grid overflow-hidden rounded-[2rem] bg-navy text-white lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">Suppliers of kitchen, furniture and building components</h2>
            <p className="mt-4 leading-relaxed text-slate-300">{settings.business_name} supplies boards, doors, edge tape, profiles, kitchen accessories and more from Mushin, Lagos, to wholesale and retail customers.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-5"><h3 className="font-bold text-gold">Wholesale</h3><p className="mt-1 text-sm text-slate-300">Bulk requests for contractors, workshops and resellers. Pricing confirmed by quotation.</p></div>
              <div className="rounded-2xl bg-white/10 p-5"><h3 className="font-bold text-gold">Retail</h3><p className="mt-1 text-sm text-slate-300">Homeowners and small projects welcome. Ask about availability.</p></div>
            </div>
          </div>
          <div className="min-h-[16rem]"><img src="/site/wardrobe-oak.jpg" alt="Fitted wardrobe with oak shelving" loading="lazy" className="h-full w-full object-cover" /></div>
        </div>
      </Container>
    </section>
  )
}

const STEPS = [
  ['Browse', 'Find components by category, name or SKU.'],
  ['Build your list', 'Add products and quantities. Your list is saved on this device.'],
  ['Send the request', 'Share your contact details as a wholesale or retail customer.'],
  ['We respond', 'Our team checks availability and prepares your quotation.'],
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28 pt-20">
      <Container>
        <SectionHeading eyebrow="Process" title="How quotation works" />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="rounded-3xl bg-white p-6 shadow-card">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gold font-display text-lg font-bold text-ink">{i + 1}</div>
              <h3 className="mt-4 text-lg font-bold">{t}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{d}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

/** Only approved testimonials are ever returned by the API; with none, the section is omitted. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null
  return (
    <section className="pt-20">
      <Container>
        <SectionHeading eyebrow="Customers" title="What customers say" />
        <ul className="grid gap-4 md:grid-cols-3">
          {items.map((t) => (
            <li key={t.id} className="flex flex-col rounded-3xl bg-white p-6 shadow-card">
              <blockquote className="flex-1 leading-relaxed text-slate-700">“{t.text}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                {t.image_url ? <img src={t.image_url} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-tint font-bold text-gold-deep">{t.display_name[0]}</div>}
                <div><div className="text-sm font-bold">{t.display_name}</div>{t.company && <div className="text-xs text-mute">{t.company}</div>}</div>
              </figcaption>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export function CtaBand() {
  return (
    <section className="pt-20">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-gold p-8 sm:p-12">
          <div className="max-w-xl"><h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Ready to price your project?</h2><p className="mt-2 text-ink/80">Ask about availability on WhatsApp, or send a full quote request.</p></div>
          <div className="flex flex-wrap gap-3"><WhatsAppButton className="btn !min-h-[3rem] bg-emerald-800 !px-6 text-white shadow-btn hover:bg-emerald-900" /><Link to="/quote" className="btn-navy !min-h-[3rem] !px-6">Request a Quote</Link></div>
        </div>
      </Container>
    </section>
  )
}

export function Location() {
  const { settings: s, directionsUrl } = useSettings()
  return (
    <section className="pt-20">
      <Container className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-card">
          <h2 className="text-2xl font-bold">Visit us</h2>
          <p className="mt-3 text-lg font-semibold leading-snug">{s.address}</p>
          <dl className="mt-3 space-y-1 text-sm text-slate-600">
            {s.opening_hours && <div>Hours: {s.opening_hours}</div>}
            {s.phone && <div>Phone: <a href={`tel:${s.phone}`} className="font-semibold text-ink hover:underline">{s.phone}</a></div>}
            {s.email && <div>Email: <a href={`mailto:${s.email}`} className="font-semibold text-ink hover:underline">{s.email}</a></div>}
          </dl>
          <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn-ghost mt-5">Get directions in Google Maps</a>
        </div>
        <div className="min-h-[15rem] overflow-hidden rounded-3xl bg-ice-deep shadow-card">
          <iframe title={`Map showing ${s.business_name}`} loading="lazy" className="h-full min-h-[15rem] w-full border-0" referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`} />
        </div>
      </Container>
    </section>
  )
}

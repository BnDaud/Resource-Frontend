import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { Container } from './Container'

export function Footer() {
  const { settings: s, directionsUrl, whatsappUrl } = useSettings()
  const wa = whatsappUrl()
  const socials = [['Instagram', s.instagram_url], ['TikTok', s.tiktok_url]].filter(([, u]) => u)
  return (
    <footer className="mt-20 rounded-t-[2rem] bg-ink pb-8 pt-12 text-sm text-slate-300">
      <Container>
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 font-display text-lg font-bold text-white"><img src="/brand/logo-64.png" alt="" className="h-10 w-10" />{s.business_name}</div>
            <p className="mt-3 max-w-sm leading-relaxed">Kitchen, furniture and building components. Wholesale and retail.</p>
            <address className="mt-3 not-italic leading-relaxed">{s.address}<br /><a href={directionsUrl} target="_blank" rel="noreferrer" className="font-semibold text-gold hover:underline">Get directions</a></address>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-2">
            <Link to="/products" className="hover:text-white">Products</Link>
            <Link to="/quote" className="hover:text-white">Quote list</Link>
            <Link to="/track" className="hover:text-white">Track a request</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </nav>
          <div className="flex flex-col gap-2">
            {s.phone && <a href={`tel:${s.phone}`} className="hover:text-white">{s.phone}</a>}
            {s.email && <a href={`mailto:${s.email}`} className="hover:text-white">{s.email}</a>}
            {wa && <a href={wa} target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp</a>}
            {socials.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer" className="hover:text-white">{name}</a>)}
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} {s.business_name}</span>
          <Link to="/admin" className="hover:text-white">Staff login</Link>
        </div>
      </Container>
    </footer>
  )
}

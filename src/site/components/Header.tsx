import { ChevronDown, ClipboardList, Menu, Search, X } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { SECTIONS } from '../../lib/sections'
import { useFetch } from '../../lib/useFetch'
import { useQuoteList } from '../context/QuoteListContext'
import { useSettings } from '../context/SettingsContext'
import type { Category } from '../types'

const LINKS = [
  { to: '/products', label: 'Products' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/track', label: 'Track a request' },
  { to: '/contact', label: 'Contact' },
]
const link = 'rounded-full px-1 py-2 text-sm font-semibold text-slate-700 hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-gold aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8'

function CategoriesMenu() {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const { data } = useFetch(() => api.get<Category[]>('/categories'), [])
  useEffect(() => {
    if (!open) return
    const out = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', out); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('keydown', esc) }
  }, [open])
  return (
    <div ref={box} className="relative">
      <button className={`${link} inline-flex items-center gap-1`} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)}>Categories <ChevronDown className="h-4 w-4" aria-hidden /></button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-3 grid w-[40rem] max-w-[90vw] gap-4 rounded-3xl bg-white p-4 shadow-card ring-1 ring-line sm:grid-cols-[13rem_1fr]">
          {SECTIONS.map((s) => (
            <div key={s.id}>
              <Link to={`/products?section=${s.id}`} onClick={() => setOpen(false)} className="mb-1 block px-3 text-xs font-bold uppercase tracking-wide text-gold-deep hover:underline">{s.label}</Link>
              <ul className={s.id === 'accessories' ? 'grid grid-cols-2 gap-1' : 'space-y-1'}>
                {data?.filter((c) => c.section === s.id).map((c) => (
                  <li key={c.id}><Link to={`/products?section=${s.id}&category=${c.slug}`} onClick={() => setOpen(false)} className="flex items-center justify-between gap-2 rounded-2xl px-3 py-2 text-sm font-semibold hover:bg-ice"><span>{c.name}</span><span className="text-xs text-mute">{c.product_count}</span></Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Header() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  const { count } = useQuoteList()
  const { settings, whatsappUrl } = useSettings()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  useEffect(() => setOpen(false), [pathname])
  const wa = whatsappUrl()

  const search = (e: FormEvent) => { e.preventDefault(); if (q.trim()) nav(`/products?q=${encodeURIComponent(q.trim())}`); setOpen(false) }
  const searchBox = (
    <form onSubmit={search} role="search" className="relative">
      <label className="sr-only" htmlFor="site-search">Search the website</label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
      <input id="site-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or SKU" className="input rounded-full pl-10" />
    </form>
  )

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center gap-4 rounded-full bg-white py-2 pl-4 pr-2 shadow-card ring-1 ring-black/5">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 font-display text-sm font-bold" aria-label={`${settings.business_name} home`}>
          <img src="/brand/logo-64.png" alt="" className="h-9 w-9" /><span className="hidden min-[26rem]:inline">{settings.business_name}</span>
        </Link>
        <nav aria-label="Main" className="ml-4 hidden items-center gap-6 lg:flex">
          <NavLink to="/products" className={link}>Products</NavLink>
          <CategoriesMenu />
          {LINKS.slice(1).map((l) => <NavLink key={l.to} to={l.to} className={link} end>{l.label}</NavLink>)}
        </nav>
        <div className="ml-auto hidden w-52 xl:block">{searchBox}</div>
        <Link to="/quote" className="btn-navy relative ml-auto !px-4 xl:ml-0" aria-label={`Quote list, ${count} item${count === 1 ? '' : 's'}`}>
          <ClipboardList className="h-4 w-4" aria-hidden /><span className="hidden sm:inline">Quote list</span>
          <span className="grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-gold px-1 text-[0.7rem] font-bold text-ink">{count}</span>
        </Link>
        <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-ice lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav aria-label="Mobile" className="mx-auto mt-2 max-w-7xl space-y-3 rounded-3xl bg-white p-4 shadow-card ring-1 ring-black/5 lg:hidden">
          {searchBox}
          <ul className="grid gap-1">
            {LINKS.map((l) => <li key={l.to}><Link to={l.to} className="block rounded-2xl px-3 py-3 font-semibold hover:bg-ice">{l.label}</Link></li>)}
            {wa && <li><a href={wa} target="_blank" rel="noreferrer" className="block rounded-2xl px-3 py-3 font-semibold text-emerald-800 hover:bg-ice">Chat on WhatsApp</a></li>}
          </ul>
        </nav>
      )}
    </header>
  )
}

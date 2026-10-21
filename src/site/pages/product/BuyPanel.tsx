import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AvailabilityBadge, PriceLine } from '../../components/AvailabilityBadge'
import { Swatch } from '../../../components/Swatch'
import { WhatsAppButton } from '../../components/WhatsAppButton'
import { useQuoteList } from '../../context/QuoteListContext'
import type { Option, ProductDetail } from '../../types'

function Pills({ label, options, value, onChange }: { label: string; options: Option[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="mt-5">
      <legend className="mb-2 text-sm font-bold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => <button key={o.id} type="button" aria-pressed={value === o.label} onClick={() => onChange(value === o.label ? '' : o.label)}
          className={`btn btn-sm gap-2 ${value === o.label ? 'bg-navy text-white shadow-btn' : 'bg-white text-ink ring-1 ring-inset ring-line hover:ring-navy'}`}><Swatch color={o.color} />{o.label}</button>)}
      </div>
    </fieldset>
  )
}

/** The choices a product offers (finish, colour, size, ...), quantity and the Add to quote action. The choices are saved as a note on the quote line. */
export function BuyPanel({ product: p }: { product: ProductDetail }) {
  const { add, has } = useQuoteList()
  const [chosen, setChosen] = useState<Record<number, string>>({})  // attribute id -> option label
  const [qty, setQty] = useState(1)
  const choices = p.attributes.filter((a) => a.customer_picks && a.options.length > 1)
  const note = choices.filter((a) => chosen[a.id]).map((a) => `${a.name}: ${chosen[a.id]}`).join(', ')
  const added = has(p.id)
  const addNow = () => add({ productId: p.id, slug: p.slug, name: p.name, sku: p.sku, category: p.category_name, image: p.main_image, note }, qty)

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
      <Link to={`/products?category=${p.category_slug}`} className="inline-block rounded-full bg-gold-tint px-3 py-1 text-xs font-bold uppercase tracking-wide text-gold-deep">{p.category_name}</Link>
      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight">{p.name}</h1>
      <p className="mt-1 text-sm text-mute">SKU {p.sku}{p.brand && ` · ${p.brand}`}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3"><AvailabilityBadge value={p.availability} /><span className="text-xs text-mute">Availability is confirmed when we reply to your request.</span></div>
      <PriceLine mode={p.price_mode} price={p.public_price} className="mt-4 block font-display text-2xl font-bold" />
      {p.short_description && <p className="mt-4 leading-relaxed text-slate-600">{p.short_description}</p>}
      {choices.map((a) => <Pills key={a.id} label={a.name} options={a.options} value={chosen[a.id] ?? ''} onChange={(v) => setChosen({ ...chosen, [a.id]: v })} />)}

      {p.availability === 'discontinued' ? <p className="mt-6 rounded-2xl bg-ice p-4 text-sm font-semibold">This product is discontinued. Contact us for alternatives.</p> : (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full bg-ice p-1" role="group" aria-label="Quantity">
            <button type="button" aria-label="Decrease quantity" className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-card disabled:opacity-40" disabled={qty <= 1} onClick={() => setQty(qty - 1)}><Minus className="h-4 w-4" /></button>
            <span className="min-w-[3rem] text-center font-bold" aria-live="polite">{qty}</span>
            <button type="button" aria-label="Increase quantity" className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-card" onClick={() => setQty(Math.min(100000, qty + 1))}><Plus className="h-4 w-4" /></button>
          </div>
          <button className="btn-gold !min-h-[3rem] flex-1" onClick={addNow}>{added ? 'Update quote list' : 'Add to quote list'}</button>
        </div>
      )}
      {added && <p className="mt-3 text-sm font-semibold text-emerald-800" role="status">Added. <Link to="/quote" className="underline">View your quote list</Link></p>}
      <WhatsAppButton text={`Hello, I'm asking about ${p.name} (SKU ${p.sku}).`} className="btn-ghost mt-4 w-full !text-emerald-800">Ask about this product on WhatsApp</WhatsAppButton>
    </div>
  )
}

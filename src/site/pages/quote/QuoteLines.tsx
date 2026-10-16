import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductImage } from '../../components/ProductCard'
import { useQuoteList } from '../../context/QuoteListContext'

export function QuoteLines() {
  const { lines, setQuantity, remove } = useQuoteList()
  return (
    <ul className="space-y-3">
      {lines.map((l) => (
        <li key={l.productId} className="flex flex-wrap items-center gap-3 rounded-3xl bg-white p-3 shadow-card sm:flex-nowrap">
          <Link to={`/products/${l.slug}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-ice-deep" aria-label={l.name}><ProductImage src={l.image} alt="" /></Link>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-mute">{l.category}</div>
            <Link to={`/products/${l.slug}`} className="font-bold leading-snug hover:underline">{l.name}</Link>
            <div className="text-xs text-mute">SKU {l.sku}{l.note && ` · ${l.note}`}</div>
          </div>
          <div className="flex items-center rounded-full bg-ice p-1" role="group" aria-label={`Quantity for ${l.name}`}>
            <button type="button" aria-label="Decrease quantity" disabled={l.quantity <= 1} onClick={() => setQuantity(l.productId, l.quantity - 1)} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-card disabled:opacity-40"><Minus className="h-4 w-4" /></button>
            <input aria-label="Quantity" inputMode="numeric" value={l.quantity} onChange={(e) => setQuantity(l.productId, Number(e.target.value.replace(/\D/g, '')))} className="w-14 bg-transparent text-center font-bold outline-none" />
            <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(l.productId, l.quantity + 1)} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-card"><Plus className="h-4 w-4" /></button>
          </div>
          <button type="button" aria-label={`Remove ${l.name}`} onClick={() => remove(l.productId)} className="grid h-10 w-10 place-items-center rounded-full text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
        </li>
      ))}
    </ul>
  )
}

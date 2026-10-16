import { Check, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuoteList } from '../context/QuoteListContext'
import type { Product } from '../types'

/** Adds one unit to the quote list. After adding it becomes a link to the list. */
export function AddToQuoteButton({ product, size = 'sm' }: { product: Product; size?: 'sm' | 'md' }) {
  const { has, add } = useQuoteList()
  const cls = size === 'sm' ? 'btn-sm' : ''
  if (product.availability === 'discontinued') return <span className="text-xs font-semibold text-mute">No longer available</span>
  if (has(product.id)) return <Link to="/quote" className={`btn-ghost ${cls} text-emerald-800`}><Check className="h-4 w-4" aria-hidden />In quote list</Link>
  return (
    <button className={`btn-navy ${cls}`} onClick={() => add({ productId: product.id, slug: product.slug, name: product.name, sku: product.sku, category: product.category_name, image: product.main_image, note: '' })}>
      <Plus className="h-4 w-4" aria-hidden />Add to quote
    </button>
  )
}

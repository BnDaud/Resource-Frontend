import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui'
import type { Product } from '../types'
import { AddToQuoteButton } from './AddToQuoteButton'
import { AvailabilityBadge, PriceLine } from './AvailabilityBadge'

export function ProductImage({ src, alt, className = '' }: { src: string | null; alt: string; className?: string }) {
  return src
    ? <img src={src} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} />
    : <div className="grid h-full w-full place-items-center bg-ice-deep text-xs font-bold text-mute">No photo yet</div>
}

function ProductCard({ product: p }: { product: Product }) {
  return (
    <article className="group flex flex-col rounded-3xl bg-white p-2.5 shadow-card transition hover:-translate-y-1">
      <Link to={`/products/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-ice-deep" aria-hidden="true" tabIndex={-1}>
        <ProductImage src={p.main_image} alt={p.name} className="transition duration-300 group-hover:scale-105" />
        <span className="absolute left-2.5 top-2.5 flex gap-1.5"><AvailabilityBadge value={p.availability} />{p.is_new && <Badge tone="navy">New</Badge>}</span>
      </Link>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
        <div className="text-xs text-mute">{p.category_name}</div>
        <Link to={`/products/${p.slug}`} className="mt-0.5 font-bold leading-snug hover:underline">{p.name}</Link>
        <div className="text-xs text-mute">SKU {p.sku}</div>
        <div className="mt-3 flex items-center justify-between gap-2 pt-1">
          <PriceLine mode={p.price_mode} price={p.public_price} className="text-sm font-semibold text-slate-700" />
          <AddToQuoteButton product={p} />
        </div>
      </div>
    </article>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  return <div className="grid grid-cols-1 gap-4 min-[30rem]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 min-[30rem]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => <div key={i} className="h-72 animate-pulse rounded-3xl bg-white/70" />)}
    </div>
  )
}

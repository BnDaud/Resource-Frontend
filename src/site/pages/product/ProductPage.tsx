import { Link, useParams } from 'react-router-dom'
import { api } from '../../../api/client'
import { ErrorNote, Spinner } from '../../../components/ui'
import { useFetch } from '../../../lib/useFetch'
import { Container, SectionHeading } from '../../components/Container'
import { ProductGrid } from '../../components/ProductCard'
import { usePageMeta } from '../../lib/usePageMeta'
import type { Product, ProductDetail } from '../../types'
import NotFoundPage from '../NotFoundPage'
import { BuyPanel } from './BuyPanel'
import { Gallery } from './Gallery'

function Details({ p }: { p: ProductDetail }) {
  const related = useFetch(() => api.get<Product[]>(`/products/${p.slug}/related`), [p.slug])
  usePageMeta({
    title: p.name,
    description: p.short_description || `${p.name} (SKU ${p.sku}) from Resources Components. Request a quotation.`,
    image: p.main_image ?? undefined,
    // Structured data lists a price only when the admin published one.
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'Product', name: p.name, sku: p.sku, description: p.short_description || p.description,
      ...(p.main_image && { image: p.main_image }), ...(p.brand && { brand: { '@type': 'Brand', name: p.brand } }),
      ...(p.price_mode === 'public' && p.public_price && { offers: { '@type': 'Offer', priceCurrency: 'NGN', price: p.public_price } }),
    },
  })
  return (
    <Container className="py-8">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-mute"><Link to="/" className="hover:underline">Home</Link> / <Link to="/products" className="hover:underline">Products</Link> / <Link to={`/products?category=${p.category_slug}`} className="hover:underline">{p.category_name}</Link> / <span className="text-ink">{p.name}</span></nav>
      <div className="grid items-start gap-8 lg:grid-cols-2"><Gallery images={p.images} name={p.name} /><BuyPanel product={p} /></div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {p.description && <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8"><h2 className="text-xl font-bold">Description</h2><p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">{p.description}</p></section>}
        {p.specs.length > 0 && (
          <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8"><h2 className="text-xl font-bold">Specifications</h2>
            <dl className="mt-3">{p.specs.map((s) => <div key={s.name} className="flex gap-4 border-t border-slate-100 py-3 text-sm first:border-0"><dt className="w-36 shrink-0 text-mute">{s.name}</dt><dd className="font-semibold">{s.value}</dd></div>)}</dl></section>
        )}
      </div>

      {related.data && related.data.length > 0 && <section className="mt-14"><SectionHeading title="Related products" /><ProductGrid products={related.data} /></section>}
    </Container>
  )
}

export default function ProductPage() {
  const { slug } = useParams()
  const { data, error, loading, reload } = useFetch(() => api.get<ProductDetail>(`/products/${slug}`), [slug])
  if (loading && !data) return <div className="py-24"><Spinner /></div>
  if (error === 'Product not found') return <NotFoundPage />
  if (error || !data) return <Container className="py-16"><ErrorNote message={error ?? 'Could not load'} onRetry={reload} /></Container>
  return <Details p={data} key={data.id} />
}


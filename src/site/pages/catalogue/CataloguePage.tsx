import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../../../api/client'
import { EmptyState, ErrorNote, Pagination } from '../../../components/ui'
import { useDebounced } from '../../../lib/useDebounced'
import { useFetch } from '../../../lib/useFetch'
import { Container } from '../../components/Container'
import { ProductGrid, ProductGridSkeleton } from '../../components/ProductCard'
import { usePageMeta } from '../../lib/usePageMeta'
import type { Category, ProductPage } from '../../types'
import { CatalogueFilters, type Filters } from './CatalogueFilters'

/** Search, category, availability, sort and page all live in the URL, so every view can be shared and the back button works. */
export default function CataloguePage() {
  const [params, setParams] = useSearchParams()
  const filters: Filters = {
    q: params.get('q') ?? '', category: params.get('category') ?? '', availability: params.get('availability') ?? '', sort: params.get('sort') ?? 'relevance',
  }
  const page = Math.max(1, Number(params.get('page')) || 1)

  // The search box edits local text immediately; the URL (and request) follow after a short pause.
  const [text, setText] = useState(filters.q)
  const typed = useDebounced(text)
  useEffect(() => { if (typed !== filters.q) update({ q: typed }) }, [typed]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => setText(filters.q), [filters.q])

  const update = (patch: Partial<Filters>, nextPage = 1) => {
    const next = { ...filters, ...patch }
    const p = new URLSearchParams()
    if (next.q) p.set('q', next.q)
    if (next.category) p.set('category', next.category)
    if (next.availability) p.set('availability', next.availability)
    if (next.sort !== 'relevance') p.set('sort', next.sort)
    if (nextPage > 1) p.set('page', String(nextPage))
    setParams(p, { replace: 'q' in patch })
  }

  const categories = useFetch(() => api.get<Category[]>('/categories'), [])
  const { data, error, loading, reload } = useFetch(
    () => api.get<ProductPage>('/products', { ...filters, availability: filters.availability || undefined, category: filters.category || undefined, q: filters.q || undefined, page, page_size: 12 }),
    [filters.q, filters.category, filters.availability, filters.sort, page],
  )
  const current = categories.data?.find((c) => c.slug === filters.category)
  usePageMeta({
    title: current ? current.name : 'Products',
    description: current ? `Browse ${current.name} from Resources Components. Request a wholesale or retail quotation.` : 'Browse kitchen, furniture and building components. Request a wholesale or retail quotation.',
  })

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{current ? current.name : 'All products'}</h1>
      <p className="mb-6 mt-1 text-sm text-mute">{data ? `${data.total} product${data.total === 1 ? '' : 's'}` : ' '}</p>
      <CatalogueFilters filters={{ ...filters, q: text }} categories={categories.data ?? []} onChange={(patch) => ('q' in patch ? setText(patch.q ?? '') : update(patch))} />
      <div className="mt-6" aria-live="polite">
        {error && <ErrorNote message="We could not load the products. Check your connection." onRetry={reload} />}
        {loading && !data ? <ProductGridSkeleton />
          : data && data.items.length === 0 ? <EmptyState title="No products match your search">Try a different word, or clear the filters. You can also <Link className="font-bold text-gold-deep" to="/contact">ask us</Link>.</EmptyState>
          : data && <><div className={loading ? 'opacity-60 transition' : 'transition'}><ProductGrid products={data.items} /></div><Pagination page={data.page} pages={data.pages} onChange={(n) => update({}, n)} /></>}
      </div>
    </Container>
  )
}

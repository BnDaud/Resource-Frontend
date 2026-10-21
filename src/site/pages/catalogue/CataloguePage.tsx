import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../../../api/client'
import { EmptyState, ErrorNote, Pagination } from '../../../components/ui'
import { isSection, SECTIONS, type Section } from '../../../lib/sections'
import { useDebounced } from '../../../lib/useDebounced'
import { useFetch } from '../../../lib/useFetch'
import { Container } from '../../components/Container'
import { ProductGrid, ProductGridSkeleton } from '../../components/ProductCard'
import { usePageMeta } from '../../lib/usePageMeta'
import type { Attribute, Category, ProductPage } from '../../types'
import { AttributeFilters } from './AttributeFilters'
import { CatalogueFilters, type Filters } from './CatalogueFilters'

/** Division, category, search, availability, sort and page all live in the URL, so every view can be shared and the back button works. */
export default function CataloguePage() {
  const [params, setParams] = useSearchParams()
  const categories = useFetch(() => api.get<Category[]>('/categories'), [])
  const category = params.get('category') ?? ''
  const fromUrl = params.get('section')
  // A link to a category without a division (an old link) opens in that category's division.
  const section: Section = isSection(fromUrl) ? fromUrl : categories.data?.find((c) => c.slug === category)?.section ?? 'boards'
  const opts = params.getAll('opt').map(Number).filter(Number.isInteger)
  const filters: Filters = { q: params.get('q') ?? '', section, category, opts, availability: params.get('availability') ?? '', sort: params.get('sort') ?? 'relevance' }
  const page = Math.max(1, Number(params.get('page')) || 1)

  // The search box edits local text immediately; the URL (and request) follow after a short pause.
  const [text, setText] = useState(filters.q)
  const typed = useDebounced(text)
  useEffect(() => { if (typed !== filters.q) update({ q: typed }) }, [typed]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => setText(filters.q), [filters.q])

  const update = (patch: Partial<Filters>, nextPage = 1) => {
    const next = { ...filters, ...patch }
    if (('section' in patch || 'category' in patch) && !('opts' in patch)) next.opts = []  // filters belong to a division or category
    const p = new URLSearchParams()
    p.set('section', next.section)
    if (next.q) p.set('q', next.q)
    if (next.category) p.set('category', next.category)
    next.opts.forEach((id) => p.append('opt', String(id)))
    if (next.availability) p.set('availability', next.availability)
    if (next.sort !== 'relevance') p.set('sort', next.sort)
    if (nextPage > 1) p.set('page', String(nextPage))
    setParams(p, { replace: 'q' in patch })
  }

  const { data, error, loading, reload } = useFetch(
    () => api.get<ProductPage>('/products', {
      section: filters.category ? undefined : filters.section, category: filters.category || undefined, q: filters.q || undefined,
      opt: filters.opts, availability: filters.availability || undefined, sort: filters.sort, page, page_size: 12,
    }),
    [filters.q, filters.section, filters.category, filters.opts.join(), filters.availability, filters.sort, page],
  )
  const attributes = useFetch(() => api.get<Attribute[]>('/attributes', filters.category ? { category: filters.category } : { section: filters.section }), [filters.category, filters.section])
  const current = categories.data?.find((c) => c.slug === filters.category)
  const division = SECTIONS.find((s) => s.id === filters.section)!
  const other = SECTIONS.find((s) => s.id !== filters.section)!
  usePageMeta({
    title: current ? current.name : division.label,
    description: current ? `Browse ${current.name} from Resources Components. Request a wholesale or retail quotation.` : `Browse ${division.label.toLowerCase()} from Resources Components. ${division.blurb} Request a wholesale or retail quotation.`,
  })

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{current ? current.name : division.label}</h1>
      <p className="mb-6 mt-1 text-sm text-mute">{data ? `${data.total} product${data.total === 1 ? '' : 's'}` : ' '}</p>
      <CatalogueFilters filters={{ ...filters, q: text }} categories={categories.data ?? []} onChange={(patch) => ('q' in patch ? setText(patch.q ?? '') : update(patch))} />
      <div className="mt-4"><AttributeFilters groups={attributes.data ?? []} selected={filters.opts} onChange={(ids) => update({ opts: ids })} /></div>
      <div className="mt-6" aria-live="polite">
        {error && <ErrorNote message="We could not load the products. Check your connection." onRetry={reload} />}
        {loading && !data ? <ProductGridSkeleton />
          : data && data.items.length === 0 ? <EmptyState title="No products match your search">Try a different word, or clear the filters.{filters.q && <> Or <button className="font-bold text-gold-deep" onClick={() => update({ section: other.id, category: '' })}>look in {other.label.toLowerCase()}</button>.</>} You can also <Link className="font-bold text-gold-deep" to="/contact">ask us</Link>.</EmptyState>
          : data && <><div className={loading ? 'opacity-60 transition' : 'transition'}><ProductGrid products={data.items} /></div><Pagination page={data.page} pages={data.pages} onChange={(n) => update({}, n)} /></>}
      </div>
    </Container>
  )
}

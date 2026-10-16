import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import type { Category, Page, Product } from '../../api/types'
import { EmptyState, ErrorNote, PageHeader, Pagination, Spinner, useToast } from '../../components/ui'
import { AVAILABILITY, options } from '../../lib/status'
import { useDebounced } from '../../lib/useDebounced'
import { useFetch } from '../../lib/useFetch'
import ProductList from './ProductList'

export default function ProductsPage() {
  const toast = useToast()
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [availability, setAvailability] = useState('')
  const [archived, setArchived] = useState(false)
  const [page, setPage] = useState(1)
  const search = useDebounced(q)

  const cats = useFetch(() => api.get<Category[]>('/admin/categories'), [])
  const { data, error, loading, reload } = useFetch(
    () => api.get<Page<Product>>('/admin/products', { q: search, category_id: category, availability, archived, page }),
    [search, category, availability, archived, page],
  )
  const filtered = Boolean(q || category || availability)
  const reset = (fn: () => void) => { fn(); setPage(1) }

  const restore = async (p: Product) => {
    try { await api.patch(`/admin/products/${p.id}/archive?archived=false`); toast('Product restored'); reload() }
    catch { toast('Could not restore', 'err') }
  }

  return (
    <>
      <PageHeader title="Products" sub={data ? `${data.total} ${archived ? 'archived' : 'active'}` : undefined}
        actions={<Link to="/admin/products/new" className="btn-gold"><Plus className="h-4 w-4" /> New product</Link>} />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_14rem_13rem_auto]">
        <label className="relative sm:col-span-2 lg:col-span-1">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
          <input className="input pl-10" placeholder="Search name or SKU" value={q} onChange={(e) => reset(() => setQ(e.target.value))} />
        </label>
        <select aria-label="Category" className="input" value={category} onChange={(e) => reset(() => setCategory(e.target.value))}>
          <option value="">All categories</option>{cats.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select aria-label="Availability" className="input" value={availability} onChange={(e) => reset(() => setAvailability(e.target.value))}>
          <option value="">Any availability</option>{options(AVAILABILITY).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <label className="flex min-h-[2.75rem] items-center gap-2 text-sm font-semibold">
          <input type="checkbox" className="h-4 w-4 accent-navy" checked={archived} onChange={(e) => reset(() => setArchived(e.target.checked))} /> Archived
        </label>
      </div>

      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data ? <Spinner /> : data && data.items.length === 0 ? (
        <EmptyState title={filtered ? 'No products match these filters' : archived ? 'No archived products' : 'No products yet'}>
          {!filtered && !archived && <Link to="/admin/products/new" className="font-bold text-gold-deep">Add your first product</Link>}
        </EmptyState>
      ) : data && (
        <>
          <ProductList items={data.items} showRestore={archived} onRestore={restore} />
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </>
  )
}

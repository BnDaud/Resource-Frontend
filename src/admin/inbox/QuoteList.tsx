import { Search } from 'lucide-react'
import type { Page, QuoteListItem } from '../../api/types'
import { Badge, EmptyState, ErrorNote, Pagination, Spinner } from '../../components/ui'
import { dateTime } from '../../lib/format'
import { options, QUOTE_STATUS } from '../../lib/status'
import type { useFetch } from '../../lib/useFetch'

export interface QuoteFilters { q: string; status: string; from: string; to: string }

interface Props {
  list: ReturnType<typeof useFetch<Page<QuoteListItem>>>
  selectedId: string | null
  onSelect: (id: string) => void
  onHover: (id: string) => void
  filters: QuoteFilters
  onFilters: (f: QuoteFilters) => void
  page: number
  onPage: (p: number) => void
}

export default function QuoteList({ list, selectedId, onSelect, onHover, filters, onFilters, onPage }: Props) {
  const { data, error, loading, reload } = list
  const set = (patch: Partial<QuoteFilters>) => onFilters({ ...filters, ...patch })

  return (
    <section aria-label="Quote requests">
      <div className="mb-3 space-y-2">
        <label className="relative block"><span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
          <input className="input pl-10" placeholder="Reference, name or phone" value={filters.q} onChange={(e) => set({ q: e.target.value })} />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select aria-label="Filter by status" className="input col-span-2" value={filters.status} onChange={(e) => set({ status: e.target.value })}>
            <option value="">All statuses</option>{options(QUOTE_STATUS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <input aria-label="From date" type="date" className="input" value={filters.from} onChange={(e) => set({ from: e.target.value })} />
          <input aria-label="To date" type="date" className="input" value={filters.to} onChange={(e) => set({ to: e.target.value })} />
        </div>
        <p className="hint !mt-0">Names and phones are stored encrypted, so search matches whole words or a full number.</p>
      </div>

      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data ? <Spinner /> : data && data.items.length === 0 ? <EmptyState title="No quote requests found" /> : data && (
        <>
          <ul className="card space-y-1 !p-2">
            {data.items.map((r) => {
              const active = r.id === selectedId
              return (
                <li key={r.id}>
                  <button onClick={() => onSelect(r.id)} onMouseEnter={() => onHover(r.id)} onFocus={() => onHover(r.id)} aria-current={active} aria-label={`Open ${r.reference}`}
                    className={`block w-full rounded-2xl px-4 py-3 text-left transition ${active ? 'bg-gold-tint ring-2 ring-gold' : 'hover:bg-ice'}`}>
                    <div className="flex items-center justify-between gap-2"><strong className="text-sm">{r.reference}</strong><Badge tone={QUOTE_STATUS[r.status].tone}>{QUOTE_STATUS[r.status].label}</Badge></div>
                    <div className="mt-1 text-sm">{r.full_name} · <span className="capitalize">{r.customer_type}</span></div>
                    <div className="text-xs text-mute">{r.item_count} item{r.item_count === 1 ? '' : 's'} · {dateTime(r.created_at)}</div>
                  </button>
                </li>
              )
            })}
          </ul>
          <Pagination page={data.page} pages={data.pages} onChange={onPage} />
        </>
      )}
    </section>
  )
}

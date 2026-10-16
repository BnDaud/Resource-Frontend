import { Search } from 'lucide-react'
import type { Enquiry, Page } from '../../api/types'
import { Badge, EmptyState, ErrorNote, Pagination, Spinner } from '../../components/ui'
import { dateTime } from '../../lib/format'
import { ENQUIRY_STATUS, options } from '../../lib/status'
import type { useFetch } from '../../lib/useFetch'

interface EnquiryFilters { q: string; status: string }

interface Props {
  list: ReturnType<typeof useFetch<Page<Enquiry>>>
  selectedId: string | null
  onSelect: (id: string) => void
  filters: EnquiryFilters
  onFilters: (f: EnquiryFilters) => void
  onPage: (p: number) => void
}

export default function EnquiryList({ list, selectedId, onSelect, filters, onFilters, onPage }: Props) {
  const { data, error, loading, reload } = list
  return (
    <section aria-label="General enquiries">
      <div className="mb-3 space-y-2">
        <label className="relative block"><span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
          <input className="input pl-10" placeholder="Name, subject or phone" value={filters.q} onChange={(e) => onFilters({ ...filters, q: e.target.value })} />
        </label>
        <select aria-label="Filter by status" className="input" value={filters.status} onChange={(e) => onFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>{options(ENQUIRY_STATUS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data ? <Spinner /> : data && data.items.length === 0 ? <EmptyState title="No enquiries found" /> : data && (
        <>
          <ul className="card space-y-1 !p-2">
            {data.items.map((e) => {
              const active = e.id === selectedId
              return (
                <li key={e.id}>
                  <button onClick={() => onSelect(e.id)} aria-current={active} aria-label={`Open enquiry ${e.subject}`}
                    className={`block w-full rounded-2xl px-4 py-3 text-left transition ${active ? 'bg-gold-tint ring-2 ring-gold' : 'hover:bg-ice'}`}>
                    <div className="flex items-center justify-between gap-2"><strong className="truncate text-sm">{e.subject}</strong><Badge tone={ENQUIRY_STATUS[e.status].tone}>{ENQUIRY_STATUS[e.status].label}</Badge></div>
                    <div className="mt-1 text-sm">{e.name}</div>
                    <div className="text-xs text-mute">{e.phone} · {dateTime(e.created_at)}</div>
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

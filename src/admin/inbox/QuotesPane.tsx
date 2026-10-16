import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../../api/client'
import type { Page, Quote, QuoteListItem } from '../../api/types'
import { useDebounced } from '../../lib/useDebounced'
import { useFetch } from '../../lib/useFetch'
import { useIsDesktop } from '../../lib/useIsDesktop'
import { MasterDetail } from './MasterDetail'
import QuoteDetail from './QuoteDetail'
import QuoteList from './QuoteList'
import { useSelection } from './useSelection'

export default function QuotesPane() {
  const { id, select } = useSelection()
  const desktop = useIsDesktop()
  const [filters, setFilters] = useState({ q: '', status: '', from: '', to: '' })
  const [page, setPage] = useState(1)
  const q = useDebounced(filters.q)

  const list = useFetch(
    () => api.get<Page<QuoteListItem>>('/admin/quotes', { q, status: filters.status, date_from: filters.from, date_to: filters.to, page }),
    [q, filters.status, filters.from, filters.to, page],
  )

  // On desktop the first request is open by default.
  const first = list.data?.items[0]?.id ?? null
  useEffect(() => { if (desktop && id === null && first !== null) select(first, true) }, [desktop, id, first, select])

  // Quote details are cached and the first few are fetched ahead, so clicking a row feels instant.
  const cache = useRef(new Map<string, Quote>())
  const prefetch = useCallback((qid: string) => {
    if (!cache.current.has(qid)) api.get<Quote>(`/admin/quotes/${qid}`).then((d) => cache.current.set(qid, d)).catch(() => {})
  }, [])
  useEffect(() => { list.data?.items.slice(0, 6).forEach((i) => prefetch(i.id)) }, [list.data, prefetch])

  const onChanged = (updated: Quote) => {
    cache.current.set(updated.id, updated)
    if (!list.data) return
    list.setData({ ...list.data, items: list.data.items.map((i) => (i.id === updated.id ? { ...i, status: updated.status } : i)) })
  }

  return (
    <MasterDetail
      hasSelection={id !== null}
      onBack={() => select(null)}
      list={<QuoteList list={list} selectedId={id} onSelect={(n) => select(n)} onHover={prefetch} filters={filters}
        onFilters={(f) => { setFilters(f); setPage(1) }} page={page} onPage={setPage} />}
      detail={id !== null && <QuoteDetail key={id} id={id} cached={cache.current.get(id) ?? null} onChanged={onChanged} />}
    />
  )
}

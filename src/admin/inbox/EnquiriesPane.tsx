import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import type { Enquiry, Page } from '../../api/types'
import { useDebounced } from '../../lib/useDebounced'
import { useFetch } from '../../lib/useFetch'
import { useIsDesktop } from '../../lib/useIsDesktop'
import EnquiryDetail from './EnquiryDetail'
import EnquiryList from './EnquiryList'
import { MasterDetail } from './MasterDetail'
import { useSelection } from './useSelection'

export default function EnquiriesPane() {
  const { id, select } = useSelection()
  const desktop = useIsDesktop()
  const [filters, setFilters] = useState({ q: '', status: '' })
  const [page, setPage] = useState(1)
  const q = useDebounced(filters.q)

  const list = useFetch(() => api.get<Page<Enquiry>>('/admin/enquiries', { q, status: filters.status, page }), [q, filters.status, page])

  const first = list.data?.items[0]?.id ?? null
  useEffect(() => { if (desktop && id === null && first !== null) select(first, true) }, [desktop, id, first, select])

  const onChanged = (updated: Enquiry) => {
    if (list.data) list.setData({ ...list.data, items: list.data.items.map((i) => (i.id === updated.id ? updated : i)) })
  }
  const selected = list.data?.items.find((e) => e.id === id)

  return (
    <MasterDetail
      hasSelection={id !== null}
      onBack={() => select(null)}
      list={<EnquiryList list={list} selectedId={id} onSelect={(n) => select(n)} filters={filters}
        onFilters={(f) => { setFilters(f); setPage(1) }} onPage={setPage} />}
      detail={selected && <EnquiryDetail key={selected.id} enquiry={selected} onChanged={onChanged} />}
    />
  )
}

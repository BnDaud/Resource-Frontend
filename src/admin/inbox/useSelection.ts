import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export type Tab = 'quotes' | 'enquiries'

/** Which tab and which row are open. Kept in the URL (?tab=enquiries&id=5) so links and the back button work. */
export function useSelection() {
  const [params, setParams] = useSearchParams()
  const tab: Tab = params.get('tab') === 'enquiries' ? 'enquiries' : 'quotes'
  const id = params.get('id')

  const setTab = useCallback((t: Tab) => setParams(t === 'enquiries' ? { tab: t } : {}), [setParams])
  const select = useCallback((next: string | null, replace = false) => {
    const p = new URLSearchParams(params)
    next === null ? p.delete('id') : p.set('id', String(next))
    setParams(p, { replace })
  }, [params, setParams])

  return { tab, id, setTab, select }
}

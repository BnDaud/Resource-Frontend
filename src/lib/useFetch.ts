import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '../api/client'

/** Small data hook: loading / error / reload, ignores stale responses when the inputs change. */
/** `initial` shows cached data immediately while the fresh copy loads in the background. */
export function useFetch<T>(fn: () => Promise<T>, deps: unknown[], initial: T | null = null) {
  const [data, setData] = useState<T | null>(initial)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const seq = useRef(0)
  const run = useCallback(() => {
    const id = ++seq.current
    setLoading(true)
    fn()
      .then((d) => { if (id === seq.current) { setData(d); setError(null) } })
      .catch((e: unknown) => { if (id === seq.current) setError(e instanceof ApiError ? e.message : 'Something went wrong') })
      .finally(() => { if (id === seq.current) setLoading(false) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  useEffect(run, [run])
  return { data, error, loading, reload: run, setData }
}

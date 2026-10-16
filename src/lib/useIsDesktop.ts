import { useEffect, useState } from 'react'

/** True at Tailwind's `lg` breakpoint and up. Decides whether the inbox shows list and detail side by side. */
export function useIsDesktop(): boolean {
  const query = '(min-width: 1024px)'
  const [match, setMatch] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return match
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { readJson, writeJson } from '../lib/storage'

/** A product on the customer's quote list. Names and images are kept so the list shows without a network call. */
export interface QuoteLine {
  productId: string; slug: string; name: string; sku: string; category: string; image: string | null; quantity: number; note: string
}

interface Ctx {
  lines: QuoteLine[]
  count: number
  has: (productId: string) => boolean
  add: (line: Omit<QuoteLine, 'quantity'>, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  remove: (productId: string) => void
  clear: () => void
}
const KEY = 'rc.quote'
const MAX_QTY = 100000
const QuoteListContext = createContext<Ctx | null>(null)

export function QuoteListProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<QuoteLine[]>(() => readJson<QuoteLine[]>(KEY, []))
  useEffect(() => writeJson(KEY, lines), [lines])

  const add = useCallback<Ctx['add']>((line, quantity = 1) => {
    setLines((cur) => {
      const found = cur.find((l) => l.productId === line.productId)
      return found
        ? cur.map((l) => (l.productId === line.productId ? { ...l, ...line, quantity: Math.min(MAX_QTY, l.quantity + quantity) } : l))
        : [...cur, { ...line, quantity }]
    })
  }, [])
  const setQuantity = useCallback((id: string, q: number) => {
    setLines((cur) => cur.map((l) => (l.productId === id ? { ...l, quantity: Math.min(MAX_QTY, Math.max(1, Math.floor(q) || 1)) } : l)))
  }, [])
  const remove = useCallback((id: string) => setLines((cur) => cur.filter((l) => l.productId !== id)), [])
  const clear = useCallback(() => setLines([]), [])

  const value = useMemo<Ctx>(() => ({
    lines, count: lines.length, has: (id) => lines.some((l) => l.productId === id), add, setQuantity, remove, clear,
  }), [lines, add, setQuantity, remove, clear])
  return <QuoteListContext.Provider value={value}>{children}</QuoteListContext.Provider>
}

export function useQuoteList() {
  const c = useContext(QuoteListContext)
  if (!c) throw new Error('useQuoteList outside QuoteListProvider')
  return c
}

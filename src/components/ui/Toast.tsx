import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type Kind = 'ok' | 'err'
type Toast = { id: number; msg: string; kind: Kind }

const ToastCtx = createContext<(msg: string, kind?: Kind) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])
  const push = useCallback((msg: string, kind: Kind = 'ok') => {
    const id = Date.now() + Math.random()
    setItems((x) => [...x, { id, msg, kind }])
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 4000)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`pointer-events-auto flex max-w-md items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-btn ${t.kind === 'ok' ? 'bg-navy' : 'bg-red-700'}`}>
            {t.kind === 'ok' ? <CheckCircle2 className="h-4 w-4 text-gold" /> : <AlertCircle className="h-4 w-4" />} {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

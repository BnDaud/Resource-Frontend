import { useEffect, useState, type ReactNode } from 'react'

/** Two-step button so destructive actions need a deliberate second click. */
export function ConfirmButton({ children, confirm = 'Confirm?', onConfirm, className = 'btn-danger btn-sm' }: { children: ReactNode; confirm?: string; onConfirm: () => void; className?: string }) {
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 4000)
    return () => clearTimeout(t)
  }, [armed])
  return armed
    ? <button className="btn btn-sm bg-red-700 text-white" onClick={() => { setArmed(false); onConfirm() }}>{confirm}</button>
    : <button className={className} onClick={() => setArmed(true)}>{children}</button>
}

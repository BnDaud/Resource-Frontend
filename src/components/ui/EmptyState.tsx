import type { ReactNode } from 'react'

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-line bg-white/60 px-6 py-12 text-center">
      <p className="font-bold">{title}</p>
      {children && <div className="mt-1 text-sm text-mute">{children}</div>}
    </div>
  )
}

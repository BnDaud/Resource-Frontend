import type { ReactNode } from 'react'

/** List on the left, detail on the right. Below the `lg` breakpoint only one of them shows at a time. */
export function MasterDetail({ list, detail, hasSelection, onBack }: { list: ReactNode; detail: ReactNode; hasSelection: boolean; onBack: () => void }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-5 lg:grid-cols-[minmax(19rem,25rem)_minmax(0,1fr)]">
      <div className={hasSelection ? 'hidden lg:block' : ''}>{list}</div>
      <div className={hasSelection ? '' : 'hidden lg:block'}>
        {hasSelection
          ? <><button className="btn-ghost btn-sm mb-3 lg:hidden" onClick={onBack}>← Back to list</button>{detail}</>
          : <div className="rounded-3xl border-2 border-dashed border-line bg-white/60 p-10 text-center text-sm text-mute">Select an item to see its details.</div>}
      </div>
    </div>
  )
}

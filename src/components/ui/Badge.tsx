import type { ReactNode } from 'react'
import type { Tone } from '../../lib/status'

const TONES: Record<Tone, string> = {
  green: 'bg-emerald-100 text-emerald-900', red: 'bg-red-100 text-red-900', amber: 'bg-amber-100 text-amber-900',
  blue: 'bg-sky-100 text-sky-900', grey: 'bg-slate-200 text-slate-800', navy: 'bg-navy text-white',
}

export function Badge({ tone = 'grey', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${TONES[tone]}`}>{children}</span>
}

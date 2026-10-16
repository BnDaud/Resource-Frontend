import { dateTime } from '../../../lib/format'
import { QUOTE_STEPS, statusHelp, statusLabel } from '../../lib/customerStatus'
import type { TrackResult } from '../../types'

function Steps({ status }: { status: string }) {
  const current = QUOTE_STEPS.findIndex((s) => s.status === status)
  if (current < 0) return null // rejected / closed are shown as plain text instead of a progress bar
  return (
    <ol className="mt-5 grid grid-cols-4 gap-2" aria-label="Progress">
      {QUOTE_STEPS.map((s, i) => (
        <li key={s.status} className="text-center" aria-current={i === current ? 'step' : undefined}>
          <div className={`mx-auto grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${i <= current ? 'bg-gold text-ink' : 'bg-ice-deep text-mute'}`}>{i + 1}</div>
          <div className={`mt-1 text-xs ${i === current ? 'font-bold' : 'text-mute'}`}>{s.label}</div>
        </li>
      ))}
    </ol>
  )
}

/** What the customer may see: status, dates and the items they asked for. Nothing internal. */
export function TrackResultCard({ r }: { r: TrackResult }) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-card sm:p-8" aria-label="Request status">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><div className="text-xs font-semibold text-mute">{r.kind === 'quote' ? 'Quote request' : 'Enquiry'}</div><h2 className="font-display text-2xl font-bold">{r.reference}</h2><div className="text-xs text-mute">Sent {dateTime(r.created_at)}</div></div>
        <span className="rounded-full bg-navy px-4 py-1.5 text-sm font-bold text-white">{statusLabel(r.status)}</span>
      </div>
      {r.kind === 'quote' && <Steps status={r.status} />}
      <p className="mt-4 rounded-2xl bg-ice p-4 text-sm leading-relaxed">{statusHelp(r.status)}</p>
      {r.kind === 'enquiry' && r.subject && <p className="mt-4 text-sm"><span className="text-mute">Subject: </span><strong>{r.subject}</strong></p>}
      {r.items.length > 0 && (
        <table className="mt-5 w-full text-left text-sm">
          <thead className="text-xs text-mute"><tr><th className="pb-2 font-bold">Product</th><th className="pb-2 font-bold">Qty</th></tr></thead>
          <tbody>{r.items.map((i) => <tr key={`${i.sku}`} className="border-t border-slate-100"><td className="py-2.5 font-semibold">{i.name}<div className="text-xs font-normal text-mute">SKU {i.sku}{i.note && ` · ${i.note}`}</div></td><td className="py-2.5 font-bold">{i.quantity}</td></tr>)}</tbody>
        </table>
      )}
    </section>
  )
}

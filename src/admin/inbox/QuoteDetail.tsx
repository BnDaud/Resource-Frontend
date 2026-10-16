import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../../api/client'
import type { Quote, QuoteStatus } from '../../api/types'
import { ContactButtons } from '../../components/ContactButtons'
import { Badge, ErrorNote, Spinner, useToast } from '../../components/ui'
import { dateTime } from '../../lib/format'
import { options, QUOTE_STATUS } from '../../lib/status'
import { useFetch } from '../../lib/useFetch'
import { InternalNotes } from './InternalNotes'
import { quoteTemplates } from './messageTemplates'

/** Right-hand panel: customer, requested items (as submitted), and staff notes. */
export default function QuoteDetail({ id, cached, onChanged }: { id: string; cached: Quote | null; onChanged: (q: Quote) => void }) {
  const toast = useToast()
  const { data, error, loading, reload, setData } = useFetch(() => api.get<Quote>(`/admin/quotes/${id}`), [id], cached)
  const [status, setStatus] = useState<QuoteStatus>('new')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => { if (data) { setStatus(data.status); setNotes(data.internal_notes) } }, [data])

  if (loading && !data) return <Spinner />
  if (error || !data) return <ErrorNote message={error ?? 'Not found'} onRetry={reload} />

  const save = async () => {
    setSaving(true)
    try {
      const saved = await api.patch<Quote>(`/admin/quotes/${id}`, { status, internal_notes: notes })
      setData(saved); onChanged(saved); toast('Saved')
    } catch (e) { toast(e instanceof ApiError ? e.message : 'Could not save', 'err') }
    setSaving(false)
  }
  const fields: [string, string][] = [
    ['Customer', data.full_name], ['Type', data.customer_type], ['Phone', data.phone], ['Email', data.email || '—'],
    ['Company', data.company || '—'], ['Preferred contact', data.preferred_contact || '—'],
  ]

  return (
    <div className="space-y-4">
      <section className="card">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-mute">Reference</div>
            <h2 className="text-2xl font-bold tracking-tight">{data.reference}</h2>
            <div className="text-xs text-mute">Submitted {dateTime(data.created_at)}</div>
          </div>
          <div>
            <label htmlFor="quote-status" className="mb-1 block text-xs font-bold">Status</label>
            <select id="quote-status" className="input font-bold ring-2 ring-navy" value={status} onChange={(e) => setStatus(e.target.value as QuoteStatus)}>
              {options(QUOTE_STATUS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          {fields.map(([k, v]) => <div key={k}><dt className="text-xs text-mute">{k}</dt><dd className="break-words font-bold">{v}</dd></div>)}
        </dl>
        <div className="mt-4">
          <ContactButtons phone={data.phone} email={data.email} emailSubject={`Your quote request ${data.reference}`} templates={quoteTemplates(data)} />
        </div>
        {data.message && (
          <div className="mt-4 rounded-2xl bg-ice p-4 text-sm leading-relaxed">
            <div className="mb-1 text-xs font-semibold text-mute">Customer message</div>
            <p className="whitespace-pre-wrap break-words">{data.message}</p>
          </div>
        )}
      </section>

      <section className="card !p-0 overflow-hidden">
        <div className="px-5 pb-2 pt-4"><h3 className="text-base font-bold">Requested items</h3><p className="hint !mt-1">Name and SKU are saved as submitted, so they stay correct if a product is renamed or archived.</p></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[26rem] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-mute"><tr><th className="px-5 py-2.5 font-bold">Product</th><th className="font-bold">SKU</th><th className="font-bold">Qty</th><th className="px-5 font-bold">Catalogue</th></tr></thead>
            <tbody>
              {data.items.map((i) => (
                <tr key={i.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-bold">{i.product_name}{i.spec_note && <div className="text-xs font-normal text-mute">{i.spec_note}</div>}</td>
                  <td className="text-mute">{i.product_sku}</td><td className="font-bold">{i.quantity}</td>
                  <td className="px-5">{i.product_id ? <Link className="font-bold text-gold-deep" to={`/admin/products/${i.product_id}`}>View</Link> : <Badge>Removed</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <InternalNotes value={notes} onChange={setNotes} onSave={save} saving={saving} dirty={status !== data.status || notes !== data.internal_notes} label="Save note and status" />
    </div>
  )
}

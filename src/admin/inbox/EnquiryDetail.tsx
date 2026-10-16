import { useState } from 'react'
import { api, ApiError } from '../../api/client'
import type { Enquiry, EnquiryStatus } from '../../api/types'
import { ContactButtons } from '../../components/ContactButtons'
import { useToast } from '../../components/ui'
import { dateTime } from '../../lib/format'
import { ENQUIRY_STATUS, options } from '../../lib/status'
import { InternalNotes } from './InternalNotes'
import { enquiryTemplates } from './messageTemplates'

/** Right-hand panel for one general enquiry. Keyed by id upstream, so local state resets per enquiry. */
export default function EnquiryDetail({ enquiry, onChanged }: { enquiry: Enquiry; onChanged: (e: Enquiry) => void }) {
  const toast = useToast()
  const [status, setStatus] = useState<EnquiryStatus>(enquiry.status)
  const [notes, setNotes] = useState(enquiry.internal_notes)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try { onChanged(await api.patch<Enquiry>(`/admin/enquiries/${enquiry.id}`, { status, internal_notes: notes })); toast('Saved') }
    catch (e) { toast(e instanceof ApiError ? e.message : 'Could not save', 'err') }
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <section className="card">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-mute">Subject · {enquiry.reference}</div>
            <h2 className="text-2xl font-bold tracking-tight">{enquiry.subject}</h2>
            <div className="text-xs text-mute">Received {dateTime(enquiry.created_at)}</div>
          </div>
          <div>
            <label htmlFor="enquiry-status" className="mb-1 block text-xs font-bold">Status</label>
            <select id="enquiry-status" className="input font-bold ring-2 ring-navy" value={status} onChange={(e) => setStatus(e.target.value as EnquiryStatus)}>
              {options(ENQUIRY_STATUS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
          {([['From', enquiry.name], ['Phone', enquiry.phone], ['Email', enquiry.email || '—']] as const).map(([k, v]) => (
            <div key={k}><dt className="text-xs text-mute">{k}</dt><dd className="break-words font-bold">{v}</dd></div>
          ))}
        </dl>
        <div className="mt-4"><ContactButtons phone={enquiry.phone} email={enquiry.email} emailSubject={`Re: ${enquiry.subject}`} templates={enquiryTemplates(enquiry)} /></div>
        <div className="mt-4 rounded-2xl bg-ice p-4 text-sm leading-relaxed">
          <div className="mb-1 text-xs font-semibold text-mute">Message</div>
          <p className="whitespace-pre-wrap break-words">{enquiry.message}</p>
        </div>
      </section>
      <InternalNotes value={notes} onChange={setNotes} onSave={save} saving={saving} dirty={status !== enquiry.status || notes !== enquiry.internal_notes} label="Save note and status" />
    </div>
  )
}

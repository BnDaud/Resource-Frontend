import { Mail, Phone } from 'lucide-react'
import { useState } from 'react'
import { waDigits } from '../lib/format'
import { WhatsAppIcon } from './WhatsAppIcon'

export interface MessageTemplate { label: string; text: string }

interface Props {
  phone: string
  email?: string
  emailSubject?: string
  /** Ready-made WhatsApp messages staff can pick from (the first is used by default). */
  templates: MessageTemplate[]
}

/** WhatsApp / call / email shortcuts for a customer. WhatsApp opens a chat with the chosen message typed in; staff press Send. */
export function ContactButtons({ phone, email, emailSubject, templates }: Props) {
  const [index, setIndex] = useState(0)
  const text = templates[index]?.text
  const wa = `https://wa.me/${waDigits(phone)}${text ? `?text=${encodeURIComponent(text)}` : ''}`
  return (
    <div className="space-y-3">
      {templates.length > 1 && (
        <div>
          <label htmlFor="wa-template" className="mb-1 block text-xs font-bold">WhatsApp message</label>
          <select id="wa-template" className="input" value={index} onChange={(e) => setIndex(Number(e.target.value))}>
            {templates.map((t, i) => <option key={t.label} value={i}>{t.label}</option>)}
          </select>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <a className="btn btn-sm bg-emerald-700 text-white shadow-btn" href={wa} target="_blank" rel="noreferrer"><WhatsAppIcon className="h-4 w-4" /> WhatsApp customer</a>
        <a className="btn-ghost btn-sm" href={`tel:${phone}`}><Phone className="h-4 w-4" /> Call</a>
        {email && <a className="btn-ghost btn-sm" href={`mailto:${email}${emailSubject ? `?subject=${encodeURIComponent(emailSubject)}` : ''}`}><Mail className="h-4 w-4" /> Email</a>}
      </div>
    </div>
  )
}

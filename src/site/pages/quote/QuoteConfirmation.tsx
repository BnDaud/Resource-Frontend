import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WhatsAppButton } from '../../components/WhatsAppButton'
import type { QuoteLine } from '../../context/QuoteListContext'
import { useSettings } from '../../context/SettingsContext'

export function QuoteConfirmation({ reference, lines }: { reference: string; lines: QuoteLine[] }) {
  const { settings } = useSettings()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(reference); setCopied(true); setTimeout(() => setCopied(false), 2500) } catch { /* the reference is also shown on screen */ }
  }
  const text = `Hello ${settings.business_name}, I've sent a quote request. Reference ${reference}.\n${lines.map((l) => `- ${l.name} x ${l.quantity}`).join('\n')}`
  return (
    <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-card sm:p-10" role="status">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-800"><Check className="h-7 w-7" aria-hidden /></div>
      <h1 className="mt-4 text-2xl font-bold">Request received</h1>
      <p className="mt-2 text-slate-600">Our team will review availability and contact you. Keep your reference number.</p>
      <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-ice p-4">
        <strong className="font-display text-2xl tracking-wide">{reference}</strong>
        <button onClick={copy} className="btn-ghost btn-sm" aria-label="Copy reference number"><Copy className="h-4 w-4" aria-hidden />{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <p className="mt-4 text-sm text-slate-600">Message us on WhatsApp with your reference so we can reach you faster.</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <WhatsAppButton text={text} className="btn bg-emerald-700 text-white shadow-btn hover:bg-emerald-800">Send reference on WhatsApp</WhatsAppButton>
        <Link to="/track" className="btn-ghost">Track this request</Link>
        <Link to="/products" className="btn-ghost">Continue browsing</Link>
      </div>
    </div>
  )
}

import { useState, type FormEvent } from 'react'
import { api, ApiError } from '../../../api/client'
import { Field, Spinner } from '../../../components/ui'
import { Container } from '../../components/Container'
import { WhatsAppButton } from '../../components/WhatsAppButton'
import { getSavedRequests } from '../../lib/savedRequests'
import { usePageMeta } from '../../lib/usePageMeta'
import type { TrackResult } from '../../types'
import { PHONE_RE } from '../quote/QuoteForm'
import { TrackResultCard } from './TrackResult'

export default function TrackPage() {
  usePageMeta({ title: 'Track a request', description: 'Check the status of your quote request or enquiry with your reference number.' })
  const [reference, setReference] = useState('')
  const [phone, setPhone] = useState('')
  const [result, setResult] = useState<TrackResult | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const saved = getSavedRequests()

  const lookup = async (ref: string, ph: string) => {
    setError(''); setResult(null)
    if (ref.trim().length < 6) return setError('Enter the reference number you were given, for example RC-261012-F3LE.')
    if (!PHONE_RE.test(ph.trim())) return setError('Enter the phone number you used when you sent the request.')
    setBusy(true)
    try { setResult(await api.post<TrackResult>('/track', { reference: ref.trim(), phone: ph.trim() })) }
    catch (e) { setError(e instanceof ApiError ? (e.status === 429 ? 'Too many lookups. Please wait a while and try again.' : e.message) : 'Something went wrong. Please try again.') }
    setBusy(false)
  }
  const submit = (e: FormEvent) => { e.preventDefault(); void lookup(reference, phone) }

  return (
    <Container className="max-w-3xl py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Track a request</h1>
      <p className="mb-8 mt-2 text-slate-600">Enter your reference number and the phone number you used. No account needed.</p>
      <form onSubmit={submit} noValidate className="space-y-4 rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Reference number" htmlFor="t-ref"><input id="t-ref" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="RC-261012-F3LE" autoCapitalize="characters" className="input uppercase" /></Field>
          <Field label="Phone number" htmlFor="t-phone"><input id="t-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className="input" /></Field>
        </div>
        {error && <div role="alert" className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</div>}
        <button className="btn-gold !min-h-[3rem]" disabled={busy}>{busy ? 'Looking up…' : 'Check status'}</button>
      </form>

      {busy && <Spinner label="Looking up your request" />}
      {result && <div className="mt-6"><TrackResultCard r={result} /><p className="mt-4 text-center text-sm text-mute">Questions? <WhatsAppButton className="font-bold text-emerald-800 underline">Message us on WhatsApp</WhatsAppButton></p></div>}

      {saved.length > 0 && (
        <section className="mt-10" aria-label="Requests sent from this device">
          <h2 className="mb-3 text-lg font-bold">Sent from this device</h2>
          <ul className="space-y-2">
            {saved.map((s) => (
              <li key={s.reference} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3 shadow-card">
                <div><div className="font-bold">{s.reference}</div><div className="text-xs text-mute">{s.kind === 'quote' ? 'Quote request' : 'Enquiry'}</div></div>
                <button className="btn-ghost btn-sm" onClick={() => { setReference(s.reference); setPhone(s.phone); void lookup(s.reference, s.phone) }}>View status</button>
              </li>
            ))}
          </ul>
          <p className="hint">Only references from this browser are listed. They are not stored anywhere else.</p>
        </section>
      )}
    </Container>
  )
}

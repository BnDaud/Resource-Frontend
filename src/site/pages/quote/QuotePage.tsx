import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../../components/ui'
import { Container } from '../../components/Container'
import { WhatsAppButton } from '../../components/WhatsAppButton'
import { useQuoteList, type QuoteLine } from '../../context/QuoteListContext'
import { saveRequest } from '../../lib/savedRequests'
import { usePageMeta } from '../../lib/usePageMeta'
import { QuoteConfirmation } from './QuoteConfirmation'
import { QuoteForm } from './QuoteForm'
import { QuoteLines } from './QuoteLines'

export default function QuotePage() {
  const { lines, clear } = useQuoteList()
  const [sent, setSent] = useState<{ reference: string; lines: QuoteLine[] } | null>(null)
  usePageMeta({ title: 'Your quote list', description: 'Review the products you want priced and send one quotation request.' })

  if (sent) return <Container className="py-12"><QuoteConfirmation reference={sent.reference} lines={sent.lines} /></Container>

  const listText = `Hello, I'd like a quote for:\n${lines.map((l) => `- ${l.name}${l.note ? ` (${l.note})` : ''} x ${l.quantity}`).join('\n')}`
  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Request a quotation</h1>
      <p className="mb-8 mt-2 max-w-2xl text-slate-600">Review your list, then tell us how to reach you. No account and no payment. Prices are confirmed in your quotation.</p>
      {lines.length === 0 ? (
        <EmptyState title="Your quote list is empty"><Link to="/products" className="btn-gold mt-4">Browse products</Link></EmptyState>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
          <section aria-label="Products in your quote list">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">Your products ({lines.length})</h2><Link to="/products" className="text-sm font-bold text-gold-deep">+ Add more</Link></div>
            <QuoteLines />
            <WhatsAppButton text={listText} className="btn-ghost mt-4 !text-emerald-800">Send this list on WhatsApp instead</WhatsAppButton>
          </section>
          <QuoteForm onSent={(r) => {
            saveRequest({ reference: r.reference, kind: 'quote', phone: r.phone })
            setSent({ reference: r.reference, lines })
            clear()
          }} />
        </div>
      )}
    </Container>
  )
}

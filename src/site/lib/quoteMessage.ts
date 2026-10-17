import type { QuoteLine } from '../context/QuoteListContext'

/** The WhatsApp message that carries a customer's quote list, one product per line. */
export function quoteListMessage(lines: QuoteLine[]): string {
  return `Hello, I'd like a quote for:\n${lines.map((l) => `- ${l.name}${l.note ? ` (${l.note})` : ''} x ${l.quantity}`).join('\n')}`
}

import type { Enquiry, Quote } from '../../api/types'
import type { MessageTemplate } from '../../components/ContactButtons'

const FROM = 'Resources Components'

/** WhatsApp messages staff can send from the CMS. Each includes the customer's name and reference. */
export const quoteTemplates = (q: Quote): MessageTemplate[] => [
  { label: 'First contact', text: `Hello ${q.full_name}, this is ${FROM} about your quote request ${q.reference}.` },
  { label: 'Quote is ready', text: `Hello ${q.full_name}, your quotation for request ${q.reference} from ${FROM} is ready. ` },
  { label: 'Need more details', text: `Hello ${q.full_name}, this is ${FROM}. To prepare your quote ${q.reference} we need a few more details: ` },
  { label: 'Order confirmed', text: `Hello ${q.full_name}, thank you. ${FROM} confirms your order for request ${q.reference}.` },
]

export const enquiryTemplates = (e: Enquiry): MessageTemplate[] => [
  { label: 'Reply', text: `Hello ${e.name}, this is ${FROM} replying to your message "${e.subject}" (${e.reference}). ` },
  { label: 'Need more details', text: `Hello ${e.name}, thanks for contacting ${FROM} (${e.reference}). Could you tell us more about: ` },
]

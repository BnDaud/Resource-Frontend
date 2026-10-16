import type { Availability, EnquiryStatus, QuoteStatus } from '../api/types'

export type Tone = 'green' | 'red' | 'amber' | 'blue' | 'grey' | 'navy'

export const AVAILABILITY: Record<Availability, { label: string; tone: Tone }> = {
  available: { label: 'Available', tone: 'green' },
  out_of_stock: { label: 'Out of stock', tone: 'red' },
  on_request: { label: 'On request', tone: 'amber' },
  discontinued: { label: 'Discontinued', tone: 'grey' },
}

export const QUOTE_STATUS: Record<QuoteStatus, { label: string; tone: Tone }> = {
  new: { label: 'New', tone: 'blue' },
  under_review: { label: 'Under review', tone: 'amber' },
  quoted: { label: 'Quoted', tone: 'green' },
  accepted: { label: 'Accepted', tone: 'green' },
  rejected: { label: 'Rejected', tone: 'red' },
  closed: { label: 'Closed', tone: 'grey' },
}

export const ENQUIRY_STATUS: Record<EnquiryStatus, { label: string; tone: Tone }> = {
  new: { label: 'New', tone: 'blue' },
  read: { label: 'Read', tone: 'grey' },
  replied: { label: 'Replied', tone: 'green' },
  archived: { label: 'Archived', tone: 'grey' },
}

/** `<option>` pairs for a status record. */
export const options = (map: Record<string, { label: string }>) =>
  Object.entries(map).map(([value, { label }]) => ({ value, label }))

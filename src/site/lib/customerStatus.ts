/** Customer-facing wording for the statuses staff set in the CMS. */
export const QUOTE_STEPS = [
  { status: 'new', label: 'Received' },
  { status: 'under_review', label: 'Being reviewed' },
  { status: 'quoted', label: 'Quote ready' },
  { status: 'accepted', label: 'Accepted' },
] as const

const LABELS: Record<string, string> = {
  new: 'Received', under_review: 'Being reviewed', quoted: 'Quote ready', accepted: 'Accepted',
  rejected: 'Not proceeding', closed: 'Closed', read: 'Seen by our team', replied: 'Replied', archived: 'Closed',
}

const HELP: Record<string, string> = {
  new: 'We have your request and will review it shortly.',
  under_review: 'Our team is checking availability and preparing your quotation.',
  quoted: 'Your quotation is ready. We will contact you, or message us on WhatsApp.',
  accepted: 'Thank you. We will be in touch to arrange the next steps.',
  rejected: 'We could not proceed with this request. Contact us if you would like to discuss it.',
  closed: 'This request is closed. Send a new request any time.',
  read: 'Our team has read your message.',
  replied: 'We have replied. Check your phone for our message.',
  archived: 'This enquiry is closed. Send a new message any time.',
}

export const statusLabel = (s: string) => LABELS[s] ?? s
export const statusHelp = (s: string) => HELP[s] ?? ''

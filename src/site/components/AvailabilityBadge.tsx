import { Badge } from '../../components/ui'
import { AVAILABILITY } from '../../lib/status'
import type { Availability } from '../types'

export function AvailabilityBadge({ value }: { value: Availability }) {
  return <Badge tone={AVAILABILITY[value].tone}>{AVAILABILITY[value].label}</Badge>
}

/** A public price when the admin set one, otherwise "Request price". Never a made-up number. */
export function PriceLine({ mode, price, className = '' }: { mode: 'request' | 'public'; price: string | null; className?: string }) {
  const shown = mode === 'public' && price ? `₦${Number(price).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` : 'Request price'
  return <span className={className}>{shown}</span>
}

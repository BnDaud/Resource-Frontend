import type { ReactNode } from 'react'
import { WhatsAppIcon } from '../../components/WhatsAppIcon'
import { useSettings } from '../context/SettingsContext'

/** Renders nothing when no WhatsApp number is configured, so there is never a dead link. */
export function WhatsAppButton({ text, children, className = 'btn bg-emerald-700 text-white shadow-btn hover:bg-emerald-800' }: { text?: string; children?: ReactNode; className?: string }) {
  const { whatsappUrl } = useSettings()
  const href = whatsappUrl(text)
  if (!href) return null
  return <a href={href} target="_blank" rel="noreferrer" className={className}><WhatsAppIcon className="h-4 w-4" />{children ?? 'Chat on WhatsApp'}</a>
}

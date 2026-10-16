import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { api } from '../../api/client'
import { useFetch } from '../../lib/useFetch'
import type { SiteSettings } from '../types'

const DEFAULTS: SiteSettings = {
  business_name: 'Resources Components', address: '13 Amu Street, Off Palm Avenue, Mushin, Lagos State, Nigeria', opening_hours: '',
  phone: '', email: '', whatsapp_number: '', whatsapp_message: "Hello Resources Components, I'm interested in your products and would like to make an enquiry.",
  instagram_url: '', tiktok_url: '', seo_title: '', seo_description: '',
}

interface Ctx {
  settings: SiteSettings
  /** wa.me link to the business, or null when no WhatsApp number is configured. Never an invented number. */
  whatsappUrl: (text?: string) => string | null
  directionsUrl: string
}
const SettingsContext = createContext<Ctx | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { data } = useFetch(() => api.get<SiteSettings>('/settings'), [])
  const value = useMemo<Ctx>(() => {
    const settings = { ...DEFAULTS, ...(data ?? {}) }
    return {
      settings,
      whatsappUrl: (text) => (settings.whatsapp_number ? `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(text ?? settings.whatsapp_message)}` : null),
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.address)}`,
    }
  }, [data])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const c = useContext(SettingsContext)
  if (!c) throw new Error('useSettings outside SettingsProvider')
  return c
}

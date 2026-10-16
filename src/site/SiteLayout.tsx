import { MessageCircle } from 'lucide-react'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { useSettings } from './context/SettingsContext'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function SiteLayout() {
  const { whatsappUrl } = useSettings()
  const wa = whatsappUrl()
  return (
    <div className="flex min-h-screen flex-col bg-ice">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <ScrollToTop />
      <Header />
      <main id="main" className="flex-1"><Outlet /></main>
      <Footer />
      {wa && (
        <a href={wa} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
          className="fixed bottom-4 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-emerald-700 text-white shadow-btn transition hover:-translate-y-1 hover:bg-emerald-800 sm:hidden">
          <MessageCircle className="h-6 w-6" aria-hidden />
        </a>
      )}
    </div>
  )
}

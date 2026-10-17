import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { WhatsAppIcon } from '../components/WhatsAppIcon'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { useQuoteList } from './context/QuoteListContext'
import { useSettings } from './context/SettingsContext'
import { quoteListMessage } from './lib/quoteMessage'

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
  const { lines } = useQuoteList()
  const wa = whatsappUrl(lines.length ? quoteListMessage(lines) : undefined)  // the customer's quote list goes into the chat when they have one
  return (
    <div className="flex min-h-screen flex-col bg-ice">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <ScrollToTop />
      <Header />
      <main id="main" className="flex-1"><Outlet /></main>
      <Footer />
      {wa && (
        <a href={wa} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
          className="fixed bottom-[max(2rem,calc(env(safe-area-inset-bottom)+1rem))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_6px_18px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:bg-[#1ebe5a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C7E] sm:h-11 sm:w-11">
          <WhatsAppIcon className="h-[1.375rem] w-[1.375rem] sm:h-6 sm:w-6" />
        </a>
      )}
    </div>
  )
}

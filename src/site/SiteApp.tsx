import { Route, Routes } from 'react-router-dom'
import { QuoteListProvider } from './context/QuoteListContext'
import { SettingsProvider } from './context/SettingsContext'
import CataloguePage from './pages/catalogue/CataloguePage'
import ContactPage from './pages/contact/ContactPage'
import HomePage from './pages/home/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ProductPage from './pages/product/ProductPage'
import QuotePage from './pages/quote/QuotePage'
import TrackPage from './pages/track/TrackPage'
import SiteLayout from './SiteLayout'

/** The customer website. */
export default function SiteApp() {
  return (
    <SettingsProvider>
      <QuoteListProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<CataloguePage />} />
            <Route path="products/:slug" element={<ProductPage />} />
            <Route path="quote" element={<QuotePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="track" element={<TrackPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </QuoteListProvider>
    </SettingsProvider>
  )
}

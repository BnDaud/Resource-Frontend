import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Spinner } from './components/ui'
import SiteApp from './site/SiteApp'

// The CMS is a separate chunk: customers browsing the website never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'))

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Suspense fallback={<Spinner />}><AdminApp /></Suspense>} />
      <Route path="*" element={<SiteApp />} />
    </Routes>
  )
}

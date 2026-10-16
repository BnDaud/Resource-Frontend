import { Navigate, Route, Routes } from 'react-router-dom'
import AccountPage from './account/AccountPage'
import { AuthProvider, useAuth } from './auth/AuthContext'
import LoginPage from './auth/LoginPage'
import { RequireAuth } from './auth/RequireAuth'
import CategoriesPage from './categories/CategoriesPage'
import DashboardPage from './dashboard/DashboardPage'
import InboxPage from './inbox/InboxPage'
import AdminLayout from './layout/AdminLayout'
import ProductFormPage from './products/form/ProductFormPage'
import ProductsPage from './products/ProductsPage'
import SettingsPage from './settings/SettingsPage'
import StaffPage from './staff/StaffPage'
import TestimonialsPage from './testimonials/TestimonialsPage'

function AdminRoutes() {
  const { staff, ready } = useAuth()
  return (
    <Routes>
      <Route path="login" element={ready && staff ? <Navigate to="/admin" replace /> : <LoginPage />} />
      <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id" element={<ProductFormPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="quotes" element={<InboxPage />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="settings" element={<RequireAuth admin><SettingsPage /></RequireAuth>} />
        <Route path="staff" element={<RequireAuth admin><StaffPage /></RequireAuth>} />
        <Route path="account" element={<AccountPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

/** The whole CMS. Loaded on demand, so customers never download it, and the session check only runs here. */
export default function AdminApp() {
  return <AuthProvider><AdminRoutes /></AuthProvider>
}

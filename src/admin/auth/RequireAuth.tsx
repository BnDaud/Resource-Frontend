import { Navigate } from 'react-router-dom'
import { Spinner } from '../../components/ui'
import { useAuth } from './AuthContext'

/** Redirects are a convenience only: every API call is re-checked by the server. */
export function RequireAuth({ admin, children }: { admin?: boolean; children: JSX.Element }) {
  const { staff, ready } = useAuth()
  if (!ready) return <Spinner label="Checking session" />
  if (!staff) return <Navigate to="/admin/login" replace />
  if (admin && staff.role !== 'admin') return <Navigate to="/admin" replace />
  return children
}

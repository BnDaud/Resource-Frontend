import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, setUnauthorizedHandler } from '../../api/client'
import type { Staff } from '../../api/types'

interface Ctx {
  staff: Staff | null
  ready: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
const AuthContext = createContext<Ctx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<Staff | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setUnauthorizedHandler(() => setStaff(null))
    api.get<Staff>('/admin/auth/me').then(setStaff).catch(() => setStaff(null)).finally(() => setReady(true))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setStaff(await api.post<Staff>('/admin/auth/login', { email, password }))
  }, [])
  const logout = useCallback(async () => {
    await api.post('/admin/auth/logout').catch(() => {})
    setStaff(null)
  }, [])

  const value = useMemo(() => ({ staff, ready, login, logout }), [staff, ready, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const c = useContext(AuthContext)
  if (!c) throw new Error('useAuth outside AuthProvider')
  return c
}

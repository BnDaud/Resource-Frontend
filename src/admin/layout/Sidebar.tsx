import { KeyRound, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { api } from '../../api/client'
import type { Dashboard } from '../../api/types'
import { useAuth } from '../auth/AuthContext'
import { NAV } from './nav'

/** Count of things needing attention in the inbox: open quotes plus unread enquiries. */
function useInboxCount(): number {
  const [n, setN] = useState(0)
  const { pathname } = useLocation()
  useEffect(() => {
    api.get<Dashboard>('/admin/dashboard').then((d) => setN(d.outstanding_quotes + d.new_enquiries)).catch(() => {})
  }, [pathname])
  return n
}

export function Sidebar() {
  const { staff, logout } = useAuth()
  const inbox = useInboxCount()
  const items = NAV.filter((n) => !n.adminOnly || staff?.role === 'admin')

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 pb-5 pt-1">
        <img src="/brand/logo-64.png" alt="" className="h-9 w-9" />
        <div className="leading-tight"><div className="font-display text-sm font-bold">Resources</div><div className="text-xs font-semibold text-mute">Components CMS</div></div>
      </div>
      <nav aria-label="Admin" className="flex-1 space-y-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `flex min-h-[2.75rem] items-center gap-3 rounded-full px-4 text-sm font-semibold transition ${isActive ? 'bg-navy text-white' : 'text-slate-700 hover:bg-ice'}`}>
            <Icon className="h-4 w-4" aria-hidden /> <span className="flex-1">{label}</span>
            {badge === 'inbox' && inbox > 0 && <span className="grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-gold px-1 text-[0.7rem] font-bold text-ink">{inbox}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="mt-4 rounded-2xl bg-ice p-3 text-xs">
        <div className="font-bold">{staff?.name}</div>
        <div className="break-all text-mute">{staff?.email}</div>
        <div className="mb-2 font-semibold capitalize text-mute">{staff?.role}</div>
        <div className="flex flex-wrap gap-2">
          <NavLink to="/admin/account" className="btn-ghost btn-sm"><KeyRound className="h-3.5 w-3.5" /> Password</NavLink>
          <button className="btn-ghost btn-sm" onClick={logout}><LogOut className="h-3.5 w-3.5" /> Sign out</button>
        </div>
      </div>
    </div>
  )
}

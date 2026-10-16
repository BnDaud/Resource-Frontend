import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  return (
    <div className="min-h-screen lg:flex">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 rounded-r-[2rem] bg-white p-4 shadow-card lg:block"><Sidebar /></aside>

      <header className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-2.5 shadow-card lg:hidden">
        <div className="flex items-center gap-2 font-display text-sm font-bold"><img src="/brand/logo-64.png" alt="" className="h-8 w-8" /> RC CMS</div>
        <button aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ice"><Menu className="h-6 w-6" /></button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="absolute inset-0 bg-ink/50" aria-hidden />
          <div className="relative h-full w-72 max-w-[85%] overflow-y-auto bg-white p-4 shadow-card">
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full hover:bg-ice"><X className="h-5 w-5" /></button>
            <Sidebar />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6"><Outlet /></main>
    </div>
  )
}

import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, vi } from 'vitest'
import App from '../App'
import { ToastProvider } from '../components/ui'

export type Reply = { status: number; body?: unknown }
export type Handler = (url: string, init?: RequestInit) => Reply

export const calls: { url: string; init?: RequestInit }[] = []
let handler: Handler = () => ({ status: 500 })

/** Replace `fetch` with a scripted handler for the duration of each test. */
export function useMockApi() {
  beforeEach(() => {
    calls.length = 0
    vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, init })
      const r = handler(url, init)
      return { ok: r.status < 400, status: r.status, json: async () => r.body ?? null } as Response
    }))
    // jsdom has no matchMedia; the inbox uses it to decide between split and single-column layout.
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: desktop, media: q, addEventListener() {}, removeEventListener() {} }))
  })
  afterEach(() => vi.unstubAllGlobals())
  return (h: Handler) => { handler = h }
}

let desktop = true
export const setDesktop = (v: boolean) => { desktop = v }

export const mount = (path: string) => render(
  <MemoryRouter initialEntries={[path]}><ToastProvider><App /></ToastProvider></MemoryRouter>,
)

export const staff = (role: 'admin' | 'editor') => ({ id: 1, email: 'a@b.com', name: 'Ada', role, is_active: true })
export const emptyDashboard = { total_products: 0, total_categories: 0, new_enquiries: 0, outstanding_quotes: 0, out_of_stock: 0, published_testimonials: 0, recent_quotes: [], recent_enquiries: [] }
export const paged = <T,>(items: T[]) => ({ items, total: items.length, page: 1, page_size: 20, pages: 1 })

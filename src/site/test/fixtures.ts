import type { Handler, Reply } from '../../test/utils'

export const U1 = '11111111-1111-4111-8111-111111111111'
const U2 = '22222222-2222-4222-8222-222222222222'

export const product = (id: string, name: string, extra: Record<string, unknown> = {}) => ({
  id, name, slug: name.toLowerCase().replace(/\s+/g, '-'), sku: `SKU-${name.length}`, category_id: 1, category_name: 'Flush Doors', brand: '',
  short_description: `${name} short`, availability: 'available', price_mode: 'request', public_price: null, is_featured: false, is_new: false,
  main_image: null, created_at: '2026-10-01T00:00:00Z', ...extra,
})
const detail = (p: ReturnType<typeof product>) => ({ ...p, description: 'Full description', sizes: ['2100x900'], colours: ['Oak'], specs: [{ name: 'Thickness', value: '40 mm' }], images: [], category_slug: 'flush-doors' })
export const page = (items: unknown[]) => ({ items, total: items.length, page: 1, page_size: 12, pages: 1 })
const category = (id: number, name: string, slug: string) => ({ id, name, slug, description: '', product_count: 2, cover_image: null, image_url: null, sort_order: id })

const settings = (over: Record<string, string> = {}) => ({
  business_name: 'Resources Components', address: '13 Amu Street, Mushin', opening_hours: '', phone: '', email: '', whatsapp_number: '',
  whatsapp_message: 'Hello', instagram_url: '', tiktok_url: '', seo_title: '', seo_description: '', ...over,
})

export const DOOR = product(U1, 'Oak Door')
const TAPE = product(U2, 'Edge Tape', { category_name: 'Edges Tape', availability: 'on_request' })

/** Public API served from memory. `extra` can answer or override any route; return undefined to fall through. */
export function siteHandler(extra: (url: string, init?: RequestInit) => Reply | undefined = () => undefined, over: Record<string, string> = {}): Handler {
  return (url, init) => {
    const e = extra(url, init)
    if (e) return e
    if (url.includes('/api/v1/settings')) return { status: 200, body: settings(over) }
    if (url.includes('/api/v1/categories')) return { status: 200, body: [category(1, 'Flush Doors', 'flush-doors'), category(2, 'Edges Tape', 'edges-tape')] }
    if (url.includes('/api/v1/testimonials')) return { status: 200, body: [] }
    if (/\/products\/[^/?]+\/related/.test(url)) return { status: 200, body: [] }
    if (url.includes('/products/oak-door')) return { status: 200, body: detail(DOOR) }
    if (url.includes('/api/v1/products')) return { status: 200, body: page([DOOR, TAPE]) }
    return { status: 404, body: { detail: 'Not found' } }
  }
}

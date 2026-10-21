import type { Handler, Reply } from '../../test/utils'

export const U1 = '11111111-1111-4111-8111-111111111111'
const U2 = '22222222-2222-4222-8222-222222222222'

export const product = (id: string, name: string, extra: Record<string, unknown> = {}) => ({
  id, name, slug: name.toLowerCase().replace(/\s+/g, '-'), sku: `SKU-${name.length}`, category_id: 1, category_name: 'HDF', brand: '',
  short_description: `${name} short`, availability: 'available', price_mode: 'request', public_price: null, is_featured: false, is_new: false,
  main_image: null, created_at: '2026-10-01T00:00:00Z', ...extra,
})
const FINISH = { id: 1, name: 'Finish', options: [{ id: 1, label: 'Matte', color: null }, { id: 2, label: 'Glossy', color: null }] }
const COLOUR = { id: 2, name: 'Colour', options: [{ id: 3, label: 'Red', color: '#c0392b' }, { id: 4, label: 'White', color: '#ffffff' }] }
const detail = (p: ReturnType<typeof product>) => ({ ...p, description: 'Full description', attributes: [{ ...FINISH, customer_picks: true }, { ...COLOUR, customer_picks: true }, { id: 3, name: 'Pattern', customer_picks: false, options: [{ id: 5, label: 'Synthetic', color: null }] }], specs: [{ name: 'Thickness', value: '40 mm' }], images: [], category_slug: 'hdf' })
export const page = (items: unknown[]) => ({ items, total: items.length, page: 1, page_size: 12, pages: 1 })
const category = (id: number, name: string, slug: string, section: string) => ({ id, name, slug, description: '', section, product_count: 2, cover_image: null, sort_order: id })

const settings = (over: Record<string, string> = {}) => ({
  business_name: 'Resources Components', address: '13 Amu Street, Mushin', opening_hours: '', phone: '', email: '', whatsapp_number: '',
  whatsapp_message: 'Hello', instagram_url: '', tiktok_url: '', seo_title: '', seo_description: '', ...over,
})

export const DOOR = product(U1, 'Oak Door')
export const doorWith = (attributes: unknown[]) => ({ ...detail(DOOR), attributes })
/** A long colour sheet: `count` options with RAL-style codes. */
export const colourSheet = (count: number) => Array.from({ length: count }, (_, i) => ({ id: 100 + i, label: `Shade ${i}`, code: `RAL ${3000 + i}`, color: '#c0392b', image_url: null }))
const TAPE = product(U2, 'Edge Tape', { category_name: 'Edges Tape', availability: 'on_request' })

/** Public API served from memory. `extra` can answer or override any route; return undefined to fall through. */
export function siteHandler(extra: (url: string, init?: RequestInit) => Reply | undefined = () => undefined, over: Record<string, string> = {}): Handler {
  return (url, init) => {
    const e = extra(url, init)
    if (e) return e
    if (url.includes('/api/v1/settings')) return { status: 200, body: settings(over) }
    if (url.includes('/api/v1/categories')) return { status: 200, body: [category(1, 'HDF', 'hdf', 'boards'), category(2, 'MDF', 'mdf', 'boards'), category(3, 'Edges Tape', 'edges-tape', 'accessories')] }
    if (url.includes('/api/v1/attributes')) return { status: 200, body: [FINISH, COLOUR].map((a) => ({ ...a, filterable: true, customer_picks: true, section: null, category_id: null })) }
    if (url.includes('/api/v1/testimonials')) return { status: 200, body: [] }
    if (/\/products\/[^/?]+\/related/.test(url)) return { status: 200, body: [] }
    if (url.includes('/products/oak-door')) return { status: 200, body: detail(DOOR) }
    if (url.includes('/api/v1/products')) return { status: 200, body: page([DOOR, TAPE]) }
    return { status: 404, body: { detail: 'Not found' } }
  }
}

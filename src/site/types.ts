import type { Section } from '../lib/sections'

export type Availability = 'available' | 'out_of_stock' | 'on_request' | 'discontinued'

export interface Category { id: number; name: string; slug: string; description: string; section: Section; product_count: number; cover_image: string | null }
export interface ProductImage { id: number; url: string; alt: string; is_main: boolean }
interface Spec { name: string; value: string }

/** What the public API returns for a product card. Staff-only fields are never present. */
export interface Product {
  id: string; name: string; slug: string; sku: string; category_id: number; category_name: string; brand: string
  short_description: string; availability: Availability; price_mode: 'request' | 'public'; public_price: string | null
  is_featured: boolean; is_new: boolean; main_image: string | null
}
export interface ProductDetail extends Product {
  description: string; sizes: string[]; colours: string[]; specs: Spec[]; images: ProductImage[]; category_slug: string
}
export interface ProductPage { items: Product[]; total: number; page: number; page_size: number; pages: number }

export interface Testimonial { id: number; display_name: string; company: string; text: string; image_url: string | null }

export interface SiteSettings {
  business_name: string; address: string; opening_hours: string; phone: string; email: string; whatsapp_number: string
  whatsapp_message: string; instagram_url: string; tiktok_url: string; seo_title: string; seo_description: string
}

export interface TrackResult {
  reference: string; kind: 'quote' | 'enquiry'; status: string; created_at: string; subject: string
  items: { name: string; sku: string; quantity: number; note: string }[]
}

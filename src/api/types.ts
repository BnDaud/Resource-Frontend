export type Role = 'admin' | 'editor'
export type Availability = 'available' | 'out_of_stock' | 'on_request' | 'discontinued'
type PriceMode = 'request' | 'public'
export type QuoteStatus = 'new' | 'under_review' | 'quoted' | 'accepted' | 'rejected' | 'closed'
export type EnquiryStatus = 'new' | 'read' | 'replied' | 'archived'

export interface Staff { id: number; email: string; name: string; role: Role; is_active: boolean }
export interface Category { id: number; name: string; slug: string; description: string; image_url: string | null; sort_order: number }
export interface ProductImage { id: number; url: string; alt: string; is_main: boolean; sort_order: number }
interface Spec { name: string; value: string }
export interface Product {
  id: string; name: string; slug: string; sku: string; category_id: number; category_name: string; category_slug: string
  brand: string; short_description: string; description: string; sizes: string[]; colours: string[]; specs: Spec[]
  availability: Availability; price_mode: PriceMode; public_price: string | null
  wholesale_note: string; stock_qty: number | null; is_featured: boolean; is_new: boolean; is_archived: boolean
  main_image: string | null; images: ProductImage[]; created_at: string; updated_at: string
}
export interface Page<T> { items: T[]; total: number; page: number; page_size: number; pages: number }
interface QuoteItem { id: number; product_id: string | null; product_name: string; product_sku: string; spec_note: string; quantity: number }
export interface QuoteListItem { id: string; reference: string; full_name: string; customer_type: 'wholesale' | 'retail'; phone: string; status: QuoteStatus; created_at: string; item_count: number }
export interface Quote extends Omit<QuoteListItem, 'item_count'> { email: string; company: string; message: string; preferred_contact: string; internal_notes: string; items: QuoteItem[] }
export interface Enquiry { id: string; reference: string; name: string; email: string; phone: string; subject: string; message: string; status: EnquiryStatus; internal_notes: string; created_at: string }
export interface Testimonial { id: number; display_name: string; company: string; text: string; image_url: string | null; is_published: boolean; created_at: string }
export interface SiteSettings {
  business_name: string; address: string; opening_hours: string; phone: string; email: string; whatsapp_number: string
  whatsapp_message: string; instagram_url: string; tiktok_url: string; seo_title: string; seo_description: string
}
export interface Dashboard {
  total_products: number; total_categories: number; new_enquiries: number; outstanding_quotes: number
  out_of_stock: number; published_testimonials: number; recent_quotes: QuoteListItem[]; recent_enquiries: Enquiry[]
}

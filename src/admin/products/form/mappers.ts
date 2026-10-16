import type { Product } from '../../../api/types'
import type { ProductFormValues } from './schema'

export const blankProduct: ProductFormValues = {
  name: '', sku: '', category_id: '', brand: '', short_description: '', description: '', sizes: [], colours: [], specs: [],
  availability: 'on_request', price_mode: 'request', public_price: '', wholesale_note: '', stock_qty: '', is_featured: false, is_new: false,
}

/** API product → form values (everything is a string/boolean the inputs can bind to). */
export const toFormValues = (p: Product): ProductFormValues => ({
  name: p.name, sku: p.sku, category_id: String(p.category_id), brand: p.brand, short_description: p.short_description,
  description: p.description, sizes: p.sizes, colours: p.colours, specs: p.specs, availability: p.availability,
  price_mode: p.price_mode, public_price: p.public_price ?? '', wholesale_note: p.wholesale_note,
  stock_qty: p.stock_qty?.toString() ?? '', is_featured: p.is_featured, is_new: p.is_new,
})

/** Form values → API payload. */
export const toPayload = (v: ProductFormValues) => ({
  ...v,
  category_id: Number(v.category_id),
  sku: v.sku.trim().toUpperCase(),
  public_price: v.price_mode === 'public' ? v.public_price : null,
  stock_qty: v.stock_qty.trim() === '' ? null : Number(v.stock_qty),
})

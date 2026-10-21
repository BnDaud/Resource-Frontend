import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Enter a product name').max(200),
  sku: z.string().trim().min(1, 'Enter a SKU').max(64).regex(/^[A-Za-z0-9][A-Za-z0-9._\-/]*$/, 'Letters, numbers and . _ - / only'),
  category_id: z.string().min(1, 'Choose a category'),
  brand: z.string().max(120),
  short_description: z.string().max(300),
  description: z.string().max(10000),
  option_ids: z.array(z.number()),
  specs: z.array(z.object({ name: z.string().trim().min(1, 'Name'), value: z.string().trim().min(1, 'Value') })),
  availability: z.enum(['available', 'out_of_stock', 'on_request', 'discontinued']),
  price_mode: z.enum(['request', 'public']),
  public_price: z.string(),
  wholesale_note: z.string().max(300),
  stock_qty: z.string(),
  is_featured: z.boolean(),
  is_new: z.boolean(),
}).superRefine((v, ctx) => {
  if (v.price_mode === 'public' && !(v.public_price.trim() !== '' && Number(v.public_price) >= 0)) {
    ctx.addIssue({ code: 'custom', path: ['public_price'], message: 'Enter a price, or choose "Request price"' })
  }
  if (v.stock_qty.trim() !== '' && !(Number.isInteger(Number(v.stock_qty)) && Number(v.stock_qty) >= 0)) {
    ctx.addIssue({ code: 'custom', path: ['stock_qty'], message: 'Whole number, 0 or more' })
  }
})

export type ProductFormValues = z.infer<typeof productSchema>

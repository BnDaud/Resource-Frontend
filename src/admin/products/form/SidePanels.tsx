import { useFormContext } from 'react-hook-form'
import { Field } from '../../../components/ui'
import { AVAILABILITY, options } from '../../../lib/status'
import type { ProductFormValues } from './schema'

export function AvailabilityPanel() {
  const { register } = useFormContext<ProductFormValues>()
  return (
    <section className="card">
      <h2 className="mb-3 text-sm font-bold">Availability</h2>
      <select aria-label="Availability" className="input" {...register('availability')}>{options(AVAILABILITY).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      <label className="mt-3 flex min-h-[2.5rem] items-center gap-3 text-sm font-semibold"><input type="checkbox" className="h-4 w-4 accent-navy" {...register('is_featured')} /> Featured on homepage</label>
      <label className="flex min-h-[2.5rem] items-center gap-3 text-sm font-semibold"><input type="checkbox" className="h-4 w-4 accent-navy" {...register('is_new')} /> New arrival</label>
    </section>
  )
}

export function PricingPanel() {
  const { register, watch, formState: { errors } } = useFormContext<ProductFormValues>()
  const mode = watch('price_mode')
  return (
    <section className="card">
      <h2 className="mb-3 text-sm font-bold">Pricing</h2>
      <div className="mb-3 grid grid-cols-2 gap-1 rounded-full bg-ice p-1">
        {([['request', 'Request price'], ['public', 'Show price']] as const).map(([v, l]) => (
          <label key={v} className={`flex min-h-[2.25rem] cursor-pointer items-center justify-center rounded-full text-xs font-bold ${mode === v ? 'bg-navy text-white' : ''}`}>
            <input type="radio" value={v} className="sr-only" {...register('price_mode')} />{l}
          </label>
        ))}
      </div>
      <Field label="Public price (₦)" htmlFor="price" error={errors.public_price?.message}>
        <input id="price" inputMode="decimal" className="input" disabled={mode !== 'public'} placeholder={mode === 'public' ? '0.00' : 'Customers see "Request price"'} {...register('public_price')} />
      </Field>
    </section>
  )
}

export function StaffOnlyPanel() {
  const { register, formState: { errors } } = useFormContext<ProductFormValues>()
  return (
    <section className="rounded-3xl bg-navy p-5 text-white shadow-card">
      <h2 className="text-sm font-bold">Staff only</h2>
      <p className="mb-3 mt-1 text-xs text-slate-300">Encrypted in the database. Never sent to the public website.</p>
      <div className="space-y-3">
        <Field label="Wholesale pricing note" htmlFor="wn"><input id="wn" className="input !bg-white text-ink" {...register('wholesale_note')} /></Field>
        <Field label="Stock quantity" htmlFor="sq" error={errors.stock_qty?.message}><input id="sq" inputMode="numeric" className="input !bg-white text-ink" {...register('stock_qty')} /></Field>
      </div>
    </section>
  )
}

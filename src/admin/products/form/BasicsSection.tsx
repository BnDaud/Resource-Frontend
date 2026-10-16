import { useFormContext } from 'react-hook-form'
import type { Category } from '../../../api/types'
import { Field } from '../../../components/ui'
import type { ProductFormValues } from './schema'

export function BasicsSection({ categories }: { categories: Category[] }) {
  const { register, formState: { errors } } = useFormContext<ProductFormValues>()
  return (
    <section className="card">
      <h2 className="mb-4 text-base font-bold">Basics</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Field label="Product name *" htmlFor="name" error={errors.name?.message}><input id="name" className="input" {...register('name')} /></Field></div>
        <Field label="SKU *" htmlFor="sku" hint="Unique. Saved in capitals." error={errors.sku?.message}><input id="sku" className="input uppercase" {...register('sku')} /></Field>
        <Field label="Category *" htmlFor="cat" error={errors.category_id?.message}>
          <select id="cat" className="input" {...register('category_id')}><option value="">Choose…</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        </Field>
        <Field label="Brand (optional)" htmlFor="brand"><input id="brand" className="input" {...register('brand')} /></Field>
        <Field label="Short description" htmlFor="sd" hint="Shown on product cards." error={errors.short_description?.message}><input id="sd" className="input" {...register('short_description')} /></Field>
        <div className="sm:col-span-2"><Field label="Full description" htmlFor="desc" error={errors.description?.message}><textarea id="desc" rows={5} className="input py-3" {...register('description')} /></Field></div>
      </div>
    </section>
  )
}

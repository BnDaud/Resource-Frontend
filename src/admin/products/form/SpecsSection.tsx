import { useFieldArray, useFormContext } from 'react-hook-form'
import type { ProductFormValues } from './schema'

/** Extra details that are not filters, shown as a table on the product page (for example "Core: timber strips"). */
export function SpecsSection() {
  const { register, control, formState: { errors } } = useFormContext<ProductFormValues>()
  const specs = useFieldArray({ control, name: 'specs' })
  return (
    <section className="card">
      <h2 className="mb-1 text-base font-bold">More details</h2>
      <p className="mb-3 text-sm text-mute">Anything else worth showing that is not one of the choices above.</p>
      <div>
        <div className="space-y-2">
          {specs.fields.map((f, i) => (
            <div key={f.id} className="flex flex-wrap gap-2 sm:flex-nowrap">
              <input aria-label={`Detail ${i + 1} name`} placeholder="Name" className="input sm:w-2/5" {...register(`specs.${i}.name`)} />
              <input aria-label={`Detail ${i + 1} value`} placeholder="Value" className="input flex-1" {...register(`specs.${i}.value`)} />
              <button type="button" aria-label="Remove row" onClick={() => specs.remove(i)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-50 text-xl text-red-800">×</button>
            </div>
          ))}
        </div>
        {errors.specs && <p className="err">Fill in both the name and value of each detail.</p>}
        <button type="button" className="btn-ghost btn-sm mt-3" onClick={() => specs.append({ name: '', value: '' })}>+ Add row</button>
      </div>
    </section>
  )
}

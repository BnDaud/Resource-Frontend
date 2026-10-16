import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { TagInput } from '../../../components/TagInput'
import { Field } from '../../../components/ui'
import type { ProductFormValues } from './schema'

/** Sizes, colours/finishes and the specification table. */
export function VariantsSection() {
  const { register, control, formState: { errors } } = useFormContext<ProductFormValues>()
  const specs = useFieldArray({ control, name: 'specs' })
  return (
    <section className="card">
      <h2 className="mb-4 text-base font-bold">Sizes, colours and specifications</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sizes" htmlFor="sizes" hint="Type a size, press Enter.">
          <Controller control={control} name="sizes" render={({ field }) => <TagInput id="sizes" value={field.value} onChange={field.onChange} placeholder="e.g. 8x4 ft" />} />
        </Field>
        <Field label="Colours / finishes" htmlFor="cols" hint="Type a colour, press Enter.">
          <Controller control={control} name="colours" render={({ field }) => <TagInput id="cols" value={field.value} onChange={field.onChange} placeholder="e.g. Oak" />} />
        </Field>
      </div>
      <div className="mt-5">
        <div className="label">Specifications</div>
        <div className="space-y-2">
          {specs.fields.map((f, i) => (
            <div key={f.id} className="flex flex-wrap gap-2 sm:flex-nowrap">
              <input aria-label={`Specification ${i + 1} name`} placeholder="Name" className="input sm:w-2/5" {...register(`specs.${i}.name`)} />
              <input aria-label={`Specification ${i + 1} value`} placeholder="Value" className="input flex-1" {...register(`specs.${i}.value`)} />
              <button type="button" aria-label="Remove row" onClick={() => specs.remove(i)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-50 text-xl text-red-800">×</button>
            </div>
          ))}
        </div>
        {errors.specs && <p className="err">Fill in both the name and value of each specification.</p>}
        <button type="button" className="btn-ghost btn-sm mt-3" onClick={() => specs.append({ name: '', value: '' })}>+ Add row</button>
      </div>
    </section>
  )
}

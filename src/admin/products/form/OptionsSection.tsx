import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { api } from '../../../api/client'
import type { CategoryAttribute } from '../../../api/types'
import { PickerButton } from '../../../components/OptionPicker'
import { Swatch } from '../../../components/Swatch'
import { MANY, optionName } from '../../../lib/options'
import { useFetch } from '../../../lib/useFetch'
import type { ProductFormValues } from './schema'

/** The choices this product has (finish, colour, size, ...), taken from what its category offers. */
export function OptionsSection() {
  const { control, watch, setValue, getValues } = useFormContext<ProductFormValues>()
  const categoryId = watch('category_id')
  const { data, loading } = useFetch(() => (categoryId ? api.get<CategoryAttribute[]>(`/admin/categories/${categoryId}/attributes`) : Promise.resolve([])), [categoryId])

  // Moving to another category: drop the options that category does not offer.
  useEffect(() => {
    if (!data) return
    const allowed = new Set(data.flatMap((a) => a.options.map((o) => o.id)))
    const kept = getValues('option_ids').filter((id) => allowed.has(id))
    if (kept.length !== getValues('option_ids').length) setValue('option_ids', kept, { shouldDirty: true })
  }, [data, getValues, setValue])

  return (
    <section className="card">
      <h2 className="mb-1 text-base font-bold">Finish, colour, size and other choices</h2>
      <p className="mb-4 text-sm text-mute">Tick what this product comes in. Customers can filter by these, and choose between them when they ask for a quote. The list comes from the category; change it on the Categories page.</p>
      {!categoryId ? <p className="text-sm text-mute">Choose a category first.</p>
        : loading && !data ? <p className="text-sm text-mute">Loading…</p>
        : data && data.length === 0 ? <p className="text-sm text-mute">This category has no choices yet. Add them on the Categories page (Filters and options).</p> : (
          <Controller control={control} name="option_ids" render={({ field }) => (
            <div className="space-y-4">
              {data?.map((a) => (
                <fieldset key={a.id}>
                  <legend className="mb-2 text-sm font-bold">{a.name}</legend>
                  <div className="flex flex-wrap gap-2">
                    {a.options.length > MANY
                      ? <PickerButton name={a.name} options={a.options} multi selected={field.value} onChange={(ids) => field.onChange([...field.value.filter((x) => !a.options.some((o) => o.id === x)), ...ids])} />
                      : a.options.map((o) => {
                        const on = field.value.includes(o.id)
                        return (
                          <button key={o.id} type="button" aria-pressed={on} onClick={() => field.onChange(on ? field.value.filter((x) => x !== o.id) : [...field.value, o.id])}
                            className={`btn btn-sm gap-2 ${on ? 'bg-navy text-white shadow-btn' : 'bg-white text-ink ring-1 ring-inset ring-line hover:ring-navy'}`}><Swatch color={o.color} image={o.image_url} />{optionName(o)}</button>
                        )
                      })}
                    {a.options.length === 0 && <span className="text-sm text-mute">No options yet.</span>}
                  </div>
                </fieldset>
              ))}
            </div>
          )} />
        )}
    </section>
  )
}

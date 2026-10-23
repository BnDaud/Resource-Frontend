import { PickerButton } from '../../../components/OptionPicker'
import { Swatch } from '../../../components/Swatch'
import { MANY, optionName } from '../../../lib/options'
import type { Attribute } from '../../types'

/** Filter chips for finish, colour, size and so on: one choice per row (choosing another replaces it, choosing it again clears it), and every row that has a choice applies. */
export function AttributeFilters({ groups, selected, onChange }: { groups: Attribute[]; selected: number[]; onChange: (ids: number[]) => void }) {
  if (groups.length === 0) return null
  const choose = (g: Attribute, id: number) => {
    const others = selected.filter((x) => !g.options.some((o) => o.id === x))
    onChange(selected.includes(id) || id < 0 ? others : [...others, id])
  }
  return (
    <div className="grid gap-x-6 gap-y-2 rounded-3xl bg-white p-3 shadow-card lg:grid-cols-2 sm:p-4" role="group" aria-label="Filters">
      {groups.map((g) => (
        <fieldset key={g.id} className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">{g.name}</legend>
          <span className="w-20 shrink-0 text-xs font-bold uppercase tracking-wide text-mute" aria-hidden>{g.name}</span>
          {g.options.length > MANY
            ? <PickerButton name={g.name} options={g.options} selected={selected.filter((x) => g.options.some((o) => o.id === x))} onChange={(ids) => choose(g, ids[0] ?? -1)} />
            : g.options.map((o) => {
              const on = selected.includes(o.id)
              return (
                <button key={o.id} type="button" aria-pressed={on} onClick={() => choose(g, o.id)}
                  className={`btn btn-sm gap-2 ${on ? 'bg-navy text-white shadow-btn' : 'bg-white text-ink ring-1 ring-inset ring-line hover:ring-navy'}`}>
                  <Swatch color={o.color} image={o.image_url} />{optionName(o)}
                </button>
              )
            })}
        </fieldset>
      ))}
      {selected.length > 0 && <button type="button" className="text-sm font-bold text-gold-deep lg:col-span-2 lg:justify-self-start" onClick={() => onChange([])}>Clear filters</button>}
    </div>
  )
}

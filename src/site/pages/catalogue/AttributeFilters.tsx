import { Swatch } from '../../../components/Swatch'
import type { Attribute } from '../../types'

/** Filter chips for finish, colour, size and so on. Options of one attribute are alternatives, different attributes all apply. */
export function AttributeFilters({ groups, selected, onChange }: { groups: Attribute[]; selected: number[]; onChange: (ids: number[]) => void }) {
  if (groups.length === 0) return null
  const toggle = (id: number) => onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  return (
    <div className="space-y-3 rounded-3xl bg-white p-4 shadow-card" role="group" aria-label="Filters">
      {groups.map((g) => (
        <fieldset key={g.id} className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">{g.name}</legend>
          <span className="w-24 shrink-0 text-xs font-bold uppercase tracking-wide text-mute" aria-hidden>{g.name}</span>
          {g.options.map((o) => {
            const on = selected.includes(o.id)
            return (
              <button key={o.id} type="button" aria-pressed={on} onClick={() => toggle(o.id)}
                className={`btn btn-sm gap-2 ${on ? 'bg-navy text-white shadow-btn' : 'bg-white text-ink ring-1 ring-inset ring-line hover:ring-navy'}`}>
                <Swatch color={o.color} />{o.label}
              </button>
            )
          })}
        </fieldset>
      ))}
      {selected.length > 0 && <button type="button" className="text-sm font-bold text-gold-deep" onClick={() => onChange([])}>Clear filters</button>}
    </div>
  )
}

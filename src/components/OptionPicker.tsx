import { Check, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { optionName, type Option } from '../lib/options'
import { Swatch } from './Swatch'
import { Modal } from './ui'

/** A searchable grid of swatches with code and name, for choices that have many options (a colour sheet). */
function OptionPicker({ title, options, selected, multi, onChange, onClose }: {
  title: string; options: Option[]; selected: number[]; multi?: boolean; onChange: (ids: number[]) => void; onClose: () => void
}) {
  const [q, setQ] = useState('')
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase()
    return t ? options.filter((o) => `${o.code ?? ''} ${o.label}`.toLowerCase().includes(t)) : options
  }, [options, q])
  const toggle = (id: number) => {
    if (!multi) { onChange(selected.includes(id) ? [] : [id]); onClose(); return }
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  }
  return (
    <Modal title={title} onClose={onClose} wide>
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
        <input aria-label="Search" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by code or name" className="input pl-11" />
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {shown.map((o) => {
          const on = selected.includes(o.id)
          return (
            <li key={o.id} className="[content-visibility:auto] [contain-intrinsic-size:auto_9rem]">
              <button type="button" aria-pressed={on} onClick={() => toggle(o.id)} className={`relative block w-full overflow-hidden rounded-2xl bg-white text-left ring-1 ring-inset transition ${on ? 'ring-2 ring-navy' : 'ring-line hover:ring-navy'}`}>
                <span className="block h-20 w-full" style={o.image_url ? undefined : { background: o.color ?? '#e5e7eb' }}>
                  {o.image_url && <img src={o.image_url} alt="" loading="lazy" className="h-full w-full object-cover" />}
                </span>
                <span className="block p-2 text-xs"><span className="block font-bold">{o.code ?? o.label}</span>{o.code && <span className="block text-mute">{o.label}</span>}</span>
                {on && <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-navy text-white"><Check className="h-4 w-4" aria-hidden /></span>}
              </button>
            </li>
          )
        })}
      </ul>
      {shown.length === 0 && <p className="py-6 text-center text-sm text-mute">Nothing matches “{q}”.</p>}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-mute">{multi ? `${selected.length} selected` : `${shown.length} of ${options.length}`}</span>
        <div className="flex gap-2">
          {multi && <button type="button" className="btn-ghost btn-sm" onClick={() => onChange([...new Set([...selected, ...shown.map((o) => o.id)])])}>Select all shown</button>}
          {selected.length > 0 && <button type="button" className="btn-ghost btn-sm" onClick={() => onChange(multi && q ? selected.filter((id) => !shown.some((o) => o.id === id)) : [])}>Clear{multi && q ? ' shown' : ''}</button>}
          {multi && <button type="button" className="btn-gold btn-sm" onClick={onClose}>Done</button>}
        </div>
      </div>
    </Modal>
  )
}

/** The button that opens the picker, showing what is chosen. */
export function PickerButton({ name, options, selected, multi, onChange }: { name: string; options: Option[]; selected: number[]; multi?: boolean; onChange: (ids: number[]) => void }) {
  const [open, setOpen] = useState(false)
  const chosen = options.filter((o) => selected.includes(o.id))
  return (
    <>
      <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}
        className={`btn btn-sm gap-2 ${chosen.length ? 'bg-navy text-white shadow-btn' : 'bg-white text-ink ring-1 ring-inset ring-line hover:ring-navy'}`}>
        {chosen.length === 0 ? `Choose ${name.toLowerCase()} (${options.length})…`
          : multi ? `${chosen.length} of ${options.length} selected · change` : <><Swatch color={chosen[0].color} image={chosen[0].image_url} />{optionName(chosen[0])}</>}
      </button>
      {!multi && chosen.length > 0 && <button type="button" aria-label={`Clear ${name}`} onClick={() => onChange([])} className="grid h-8 w-8 place-items-center rounded-full bg-white text-lg text-slate-600 ring-1 ring-inset ring-line">×</button>}
      {open && <OptionPicker title={name} options={options} selected={selected} multi={multi} onChange={onChange} onClose={() => setOpen(false)} />}
    </>
  )
}

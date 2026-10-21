import { useState } from 'react'
import { api, ApiError } from '../../api/client'
import type { AttributeDef, OptionDef } from '../../api/types'
import { Modal, Spinner } from '../../components/ui'
import { useFetch } from '../../lib/useFetch'

const blankAttribute = (): AttributeDef => ({ name: '', filterable: true, customer_picks: true, options: [{ label: '', color: null }] })

/** Edit the filters and choices (finish, colour, size, ...) of one division or one category. */
export default function AttributesModal({ scope, title, note, onClose, onSaved }: { scope: string; title: string; note: string; onClose: () => void; onSaved: () => void }) {
  const loaded = useFetch(() => api.get<AttributeDef[]>('/admin/attributes', { scope }), [scope])
  const [edited, setEdited] = useState<AttributeDef[] | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const items = edited ?? loaded.data
  const change = (next: AttributeDef[]) => setEdited(next)
  const patch = (i: number, p: Partial<AttributeDef>) => change(items!.map((a, k) => (k === i ? { ...a, ...p } : a)))
  const patchOption = (i: number, j: number, p: Partial<OptionDef>) => patch(i, { options: items![i].options.map((o, k) => (k === j ? { ...o, ...p } : o)) })

  const save = async () => {
    setSaving(true); setError('')
    const body = items!.map((a) => ({ ...a, options: a.options.filter((o) => o.label.trim()) })).filter((a) => a.name.trim())
    try { await api.put('/admin/attributes?scope=' + scope, body); onSaved() }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Could not save'); setSaving(false) }
  }

  return (
    <Modal title={title} onClose={onClose} wide>
      <p className="mb-4 text-sm text-mute">{note}</p>
      {loaded.error && <p className="err">{loaded.error}</p>}
      {!items ? <Spinner /> : (
        <div className="space-y-4">
          {items.map((a, i) => (
            <fieldset key={a.id ?? `new-${i}`} className="rounded-2xl bg-ice p-4">
              <div className="flex flex-wrap items-center gap-3">
                <input aria-label="Name of the choice" placeholder="Name, for example Finish" className="input min-w-[12rem] flex-1 bg-white font-bold" value={a.name} onChange={(e) => patch(i, { name: e.target.value })} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={a.filterable} onChange={(e) => patch(i, { filterable: e.target.checked })} />Show as a filter</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={a.customer_picks} onChange={(e) => patch(i, { customer_picks: e.target.checked })} />Customer chooses when quoting</label>
                <button type="button" className="text-sm font-bold text-red-800" onClick={() => change(items.filter((_, k) => k !== i))}>Remove</button>
              </div>
              <ul className="mt-3 space-y-2">
                {a.options.map((o, j) => (
                  <li key={o.id ?? `new-${j}`} className="flex items-center gap-2">
                    <input aria-label={`${a.name || 'Choice'} option ${j + 1}`} placeholder="Option, for example Matte" className="input flex-1 bg-white" value={o.label} onChange={(e) => patchOption(i, j, { label: e.target.value })}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); patch(i, { options: [...a.options, { label: '', color: null }] }) } }} />
                    {o.color === null
                      ? <button type="button" className="btn-ghost btn-sm" onClick={() => patchOption(i, j, { color: '#c0c3c7' })}>+ Swatch</button>
                      : <><input type="color" aria-label="Swatch colour" className="h-11 w-12 cursor-pointer rounded-lg bg-white p-1" value={o.color} onChange={(e) => patchOption(i, j, { color: e.target.value })} />
                        <button type="button" className="btn-ghost btn-sm" onClick={() => patchOption(i, j, { color: null })}>No swatch</button></>}
                    <button type="button" aria-label="Remove option" onClick={() => patch(i, { options: a.options.filter((_, k) => k !== j) })} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-50 text-xl text-red-800">×</button>
                  </li>
                ))}
              </ul>
              <button type="button" className="btn-ghost btn-sm mt-3" onClick={() => patch(i, { options: [...a.options, { label: '', color: null }] })}>+ Add option</button>
            </fieldset>
          ))}
          <button type="button" className="btn-ghost" onClick={() => change([...items, blankAttribute()])}>+ Add a choice</button>
          <p className="text-xs text-mute">Removing an option, or a whole choice, also removes it from the products that have it.</p>
          {error && <p className="err" role="alert">{error}</p>}
          <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-gold" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save'}</button></div>
        </div>
      )}
    </Modal>
  )
}

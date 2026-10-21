import { useState } from 'react'
import { api, ApiError } from '../../api/client'
import type { AttributeDef, OptionDef } from '../../api/types'
import { Modal, Spinner, useToast } from '../../components/ui'
import { parseOptionList } from '../../lib/options'
import { useFetch } from '../../lib/useFetch'

const blankAttribute = (): AttributeDef => ({ name: '', filterable: true, customer_picks: true, options: [{ label: '', code: null, color: null }] })

/** Edit the filters and choices (finish, colour, size, ...) of one division or one category. */
export default function AttributesModal({ scope, title, note, onClose, onSaved }: { scope: string; title: string; note: string; onClose: () => void; onSaved: () => void }) {
  const loaded = useFetch(() => api.get<AttributeDef[]>('/admin/attributes', { scope }), [scope])
  const [edited, setEdited] = useState<AttributeDef[] | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [pasting, setPasting] = useState<{ attr: number; text: string } | null>(null)
  const toast = useToast()
  const items = edited ?? loaded.data
  const change = (next: AttributeDef[]) => setEdited(next)
  const patch = (i: number, p: Partial<AttributeDef>) => change(items!.map((a, k) => (k === i ? { ...a, ...p } : a)))
  const patchOption = (i: number, j: number, p: Partial<OptionDef>) => patch(i, { options: items![i].options.map((o, k) => (k === j ? { ...o, ...p } : o)) })

  const addPasted = (i: number) => {
    const found = parseOptionList(pasting?.text ?? '')
    const have = new Set(items![i].options.map((o) => (o.code || o.label).toLowerCase()))
    const fresh = found.filter((o) => { const key = (o.code || o.label).toLowerCase(); return !have.has(key) && have.add(key) })  // also skips repeats inside the pasted text
    patch(i, { options: [...items![i].options.filter((o) => o.label.trim()), ...fresh] })
    toast(`${fresh.length} added${found.length > fresh.length ? `, ${found.length - fresh.length} already there` : ''}. Press Save to keep them.`)
    setPasting(null)
  }
  const photo = async (i: number, j: number, file: File | undefined) => {
    const id = items![i].options[j].id
    if (!file || !id) return
    try { patchOption(i, j, { image_url: (await api.upload<{ image_url: string }>(`/admin/attribute-options/${id}/image`, file)).image_url }) }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Could not upload the photo') }
  }
  const dropPhoto = async (i: number, j: number) => {
    try { await api.del(`/admin/attribute-options/${items![i].options[j].id}/image`); patchOption(i, j, { image_url: null }) }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Could not remove the photo') }
  }

  const save = async () => {
    setSaving(true); setError('')
    const body = items!.map((a) => ({ id: a.id, name: a.name, filterable: a.filterable, customer_picks: a.customer_picks,
      options: a.options.filter((o) => o.label.trim()).map((o) => ({ id: o.id, label: o.label, code: o.code || null, color: o.color })) })).filter((a) => a.name.trim())
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
                  <li key={o.id ?? `new-${j}`} className="flex flex-wrap items-center gap-2 [content-visibility:auto] [contain-intrinsic-size:auto_3rem] sm:flex-nowrap">
                    <input aria-label={`${a.name || 'Choice'} option ${j + 1} code`} placeholder="Code (optional)" className="input w-32 shrink-0 bg-white" value={o.code ?? ''} onChange={(e) => patchOption(i, j, { code: e.target.value })} />
                    <input aria-label={`${a.name || 'Choice'} option ${j + 1}`} placeholder="Option, for example Matte" className="input min-w-0 flex-1 bg-white" value={o.label} onChange={(e) => patchOption(i, j, { label: e.target.value })}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); patch(i, { options: [...a.options, { label: '', code: null, color: null }] }) } }} />
                    {o.color === null
                      ? <button type="button" className="btn-ghost btn-sm" onClick={() => patchOption(i, j, { color: '#c0c3c7' })}>+ Swatch</button>
                      : <><input type="color" aria-label="Swatch colour" className="h-11 w-12 cursor-pointer rounded-lg bg-white p-1" value={o.color} onChange={(e) => patchOption(i, j, { color: e.target.value })} />
                        <button type="button" className="btn-ghost btn-sm" onClick={() => patchOption(i, j, { color: null })}>No swatch</button></>}
                    {o.id && (o.image_url
                      ? <><img src={o.image_url} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" /><button type="button" className="btn-ghost btn-sm" onClick={() => dropPhoto(i, j)}>No photo</button></>
                      : <label className="btn-ghost btn-sm cursor-pointer">+ Photo<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label={`Photo for ${o.label || 'option'}`} onChange={(e) => photo(i, j, e.target.files?.[0])} /></label>)}
                    <button type="button" aria-label="Remove option" onClick={() => patch(i, { options: a.options.filter((_, k) => k !== j) })} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-50 text-xl text-red-800">×</button>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="btn-ghost btn-sm" onClick={() => patch(i, { options: [...a.options, { label: '', code: null, color: null }] })}>+ Add option</button>
                <button type="button" className="btn-ghost btn-sm" onClick={() => setPasting(pasting?.attr === i ? null : { attr: i, text: '' })}>Paste a list</button>
              </div>
              {pasting?.attr === i && (
                <div className="mt-3 rounded-xl bg-white p-3">
                  <label className="label" htmlFor={`paste-${i}`}>One option per line: code, name, colour. Code and colour are optional, for example <code>RAL 3020, Traffic red, #cc0605</code>. You can paste straight from Excel.</label>
                  <textarea id={`paste-${i}`} rows={6} className="input py-3 font-mono text-xs" value={pasting.text} onChange={(e) => setPasting({ attr: i, text: e.target.value })} />
                  <div className="mt-2 flex justify-end gap-2"><button type="button" className="btn-ghost btn-sm" onClick={() => setPasting(null)}>Cancel</button><button type="button" className="btn-gold btn-sm" onClick={() => addPasted(i)}>Add these</button></div>
                </div>
              )}
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

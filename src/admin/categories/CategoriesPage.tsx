import { useState } from 'react'
import { api, ApiError } from '../../api/client'
import type { Category } from '../../api/types'
import { ConfirmButton, EmptyState, ErrorNote, PageHeader, Spinner, useToast } from '../../components/ui'
import { SECTIONS } from '../../lib/sections'
import { useFetch } from '../../lib/useFetch'
import AttributesModal from './AttributesModal'
import CategoryModal from './CategoryModal'

export default function CategoriesPage() {
  const toast = useToast()
  const { data, error, loading, reload } = useFetch(() => api.get<Category[]>('/admin/categories'), [])
  const [editing, setEditing] = useState<Category | 'new' | null>(null)
  const [options, setOptions] = useState<{ scope: string; title: string; note: string } | null>(null)

  const remove = async (c: Category) => {
    try { await api.del(`/admin/categories/${c.id}`); toast('Category deleted'); reload() }
    catch (e) { toast(e instanceof ApiError ? e.message : 'Could not delete', 'err') }
  }

  return (
    <>
      <PageHeader title="Categories" sub="Add or rename categories any time. No code change needed."
        actions={<button className="btn-gold" onClick={() => setEditing('new')}>+ New category</button>} />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data ? <Spinner /> : data && data.length === 0 ? <EmptyState title="No categories yet" /> : (
        <div className="space-y-5">
          {SECTIONS.map((s) => (
            <section key={s.id} aria-label={s.label}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
                <h2 className="text-sm font-bold uppercase tracking-wide text-mute">{s.label}</h2>
                <button className="btn-ghost btn-sm" onClick={() => setOptions({ scope: `section:${s.id}`, title: `${s.label}: filters and options`, note: `These apply to every ${s.label.toLowerCase()} category, so you set them once.` })}>Filters for all {s.label.toLowerCase()}</button>
              </div>
              <ul className="card divide-y divide-slate-100 !p-2">
                {data?.filter((c) => c.section === s.id).map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5">
                    <div className="min-w-0"><div className="font-bold">{c.name}</div><div className="truncate text-xs text-mute">/{c.slug}{c.description ? ` · ${c.description}` : ''}</div></div>
                    <div className="flex gap-2"><button className="btn-ghost btn-sm" onClick={() => setOptions({ scope: `category:${c.id}`, title: `${c.name}: filters and options`, note: `These apply to ${c.name} only, on top of what is set for all ${s.label.toLowerCase()}.` })}>Filters and options</button><button className="btn-ghost btn-sm" onClick={() => setEditing(c)}>Edit</button><ConfirmButton onConfirm={() => remove(c)}>Delete</ConfirmButton></div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      {options && <AttributesModal {...options} onClose={() => setOptions(null)} onSaved={() => { setOptions(null); toast('Saved') }} />}
      {editing && <CategoryModal cat={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); toast('Category saved') }} />}
    </>
  )
}

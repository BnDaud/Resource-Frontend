import { useState } from 'react'
import { api, ApiError } from '../../api/client'
import type { Category } from '../../api/types'
import { ConfirmButton, EmptyState, ErrorNote, PageHeader, Spinner, useToast } from '../../components/ui'
import { useFetch } from '../../lib/useFetch'
import CategoryModal from './CategoryModal'

export default function CategoriesPage() {
  const toast = useToast()
  const { data, error, loading, reload } = useFetch(() => api.get<Category[]>('/admin/categories'), [])
  const [editing, setEditing] = useState<Category | 'new' | null>(null)

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
        <ul className="card divide-y divide-slate-100 !p-2">
          {data?.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5">
              <div className="min-w-0"><div className="font-bold">{c.name}</div><div className="truncate text-xs text-mute">/{c.slug}{c.description ? ` · ${c.description}` : ''}</div></div>
              <div className="flex gap-2"><button className="btn-ghost btn-sm" onClick={() => setEditing(c)}>Edit</button><ConfirmButton onConfirm={() => remove(c)}>Delete</ConfirmButton></div>
            </li>
          ))}
        </ul>
      )}
      {editing && <CategoryModal cat={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); toast('Category saved') }} />}
    </>
  )
}

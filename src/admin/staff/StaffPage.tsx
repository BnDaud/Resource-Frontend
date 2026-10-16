import { useState } from 'react'
import { api, ApiError } from '../../api/client'
import type { Role, Staff } from '../../api/types'
import { Badge, ErrorNote, PageHeader, Spinner, useToast } from '../../components/ui'
import { useFetch } from '../../lib/useFetch'
import { useAuth } from '../auth/AuthContext'
import AddStaffModal from './AddStaffModal'

export default function StaffPage() {
  const toast = useToast()
  const { staff: me } = useAuth()
  const { data, error, loading, reload } = useFetch(() => api.get<Staff[]>('/admin/staff'), [])
  const [adding, setAdding] = useState(false)

  const patch = async (s: Staff, body: Partial<{ role: Role; is_active: boolean }>) => {
    try { await api.patch(`/admin/staff/${s.id}`, body); toast('Updated'); reload() }
    catch (e) { toast(e instanceof ApiError ? e.message : 'Could not update', 'err') }
  }

  return (
    <>
      <PageHeader title="Staff" sub="Admins manage everything. Editors manage products, quotes, enquiries and testimonials."
        actions={<button className="btn-gold" onClick={() => setAdding(true)}>+ Add staff</button>} />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data ? <Spinner /> : (
        <ul className="card divide-y divide-slate-100 !p-2">
          {data?.map((s) => {
            const self = s.id === me?.id
            return (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5">
                <div className="min-w-0"><div className="font-bold">{s.name} {self && <span className="text-xs font-semibold text-mute">(you)</span>}</div><div className="break-all text-xs text-mute">{s.email}</div></div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={s.is_active ? 'green' : 'grey'}>{s.is_active ? 'Active' : 'Disabled'}</Badge>
                  <label className="sr-only" htmlFor={`role-${s.id}`}>Role</label>
                  <select id={`role-${s.id}`} className="input !min-h-[2.25rem] !w-auto !py-1 text-sm" value={s.role} disabled={self} onChange={(e) => patch(s, { role: e.target.value as Role })}>
                    <option value="admin">Admin</option><option value="editor">Editor</option>
                  </select>
                  {!self && <button className="btn-ghost btn-sm" onClick={() => patch(s, { is_active: !s.is_active })}>{s.is_active ? 'Disable' : 'Enable'}</button>}
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {adding && <AddStaffModal onClose={() => setAdding(false)} onSaved={() => { setAdding(false); reload(); toast('Staff account created') }} />}
    </>
  )
}

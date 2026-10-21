import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api, ApiError } from '../../api/client'
import type { Category } from '../../api/types'
import { Field, Modal } from '../../components/ui'
import { SECTIONS } from '../../lib/sections'

const schema = z.object({
  name: z.string().trim().min(1, 'Enter a name').max(120),
  section: z.enum(['boards', 'accessories']),
  description: z.string().max(1000),
  sort_order: z.string().regex(/^\d+$/, 'Whole number, 0 or more'),
})
type Form = z.infer<typeof schema>

export default function CategoryModal({ cat, onClose, onSaved }: { cat: Category | null; onClose: () => void; onSaved: () => void }) {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: cat?.name ?? '', section: cat?.section ?? 'accessories', description: cat?.description ?? '', sort_order: String(cat?.sort_order ?? 0) },
  })
  const submit = handleSubmit(async (v) => {
    const body = { ...v, sort_order: Number(v.sort_order) }
    try { cat ? await api.put(`/admin/categories/${cat.id}`, body) : await api.post('/admin/categories', body); onSaved() }
    catch (e) { setError('name', { message: e instanceof ApiError ? e.message : 'Could not save' }) }
  })
  return (
    <Modal title={cat ? 'Edit category' : 'New category'} onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="Name" htmlFor="cn" error={errors.name?.message}><input id="cn" className="input" autoFocus {...register('name')} /></Field>
        <Field label="Division" htmlFor="cs" hint="Where customers find it: Boards or Accessories." error={errors.section?.message}>
          <select id="cs" className="input" {...register('section')}>{SECTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
        </Field>
        <Field label="Description (optional)" htmlFor="cd" error={errors.description?.message}><textarea id="cd" rows={3} className="input py-3" {...register('description')} /></Field>
        <Field label="Display order" htmlFor="co" hint="Lower numbers show first." error={errors.sort_order?.message}><input id="co" inputMode="numeric" className="input" {...register('sort_order')} /></Field>
        <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-gold" disabled={isSubmitting}>Save</button></div>
      </form>
    </Modal>
  )
}

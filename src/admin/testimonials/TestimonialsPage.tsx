import { useState } from 'react'
import { api } from '../../api/client'
import type { Testimonial } from '../../api/types'
import { Badge, ConfirmButton, EmptyState, ErrorNote, PageHeader, Spinner, useToast } from '../../components/ui'
import { useFetch } from '../../lib/useFetch'
import TestimonialModal from './TestimonialModal'

export default function TestimonialsPage() {
  const toast = useToast()
  const { data, error, loading, reload } = useFetch(() => api.get<Testimonial[]>('/admin/testimonials'), [])
  const [editing, setEditing] = useState<Testimonial | 'new' | null>(null)

  const togglePublished = async (t: Testimonial) => {
    try {
      await api.put(`/admin/testimonials/${t.id}`, { display_name: t.display_name, company: t.company, text: t.text, is_published: !t.is_published })
      toast(t.is_published ? 'Unpublished' : 'Published'); reload()
    } catch { toast('Could not update', 'err') }
  }
  const remove = async (t: Testimonial) => { try { await api.del(`/admin/testimonials/${t.id}`); toast('Removed'); reload() } catch { toast('Could not remove', 'err') } }

  return (
    <>
      <PageHeader title="Testimonials" sub="Only published testimonials appear on the website. Add genuine ones the customer has approved."
        actions={<button className="btn-gold" onClick={() => setEditing('new')}>+ Add testimonial</button>} />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data ? <Spinner /> : data && data.length === 0 ? <EmptyState title="No testimonials yet" /> : (
        <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {data?.map((t) => (
            <li key={t.id} className="card flex flex-col">
              <div className="flex items-start gap-3">
                {t.image_url ? <img src={t.image_url} alt="" className="h-11 w-11 rounded-full object-cover" /> : <div className="grid h-11 w-11 place-items-center rounded-full bg-gold-tint font-bold text-gold-deep">{t.display_name[0]}</div>}
                <div className="min-w-0 flex-1"><div className="font-bold">{t.display_name}</div><div className="text-xs text-mute">{t.company || 'No company'}</div></div>
                <Badge tone={t.is_published ? 'green' : 'grey'}>{t.is_published ? 'Published' : 'Draft'}</Badge>
              </div>
              <p className="my-3 flex-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">{t.text}</p>
              <div className="flex flex-wrap gap-2">
                <button className="btn-ghost btn-sm" onClick={() => togglePublished(t)}>{t.is_published ? 'Unpublish' : 'Publish'}</button>
                <button className="btn-ghost btn-sm" onClick={() => setEditing(t)}>Edit</button>
                <ConfirmButton onConfirm={() => remove(t)}>Remove</ConfirmButton>
              </div>
            </li>
          ))}
        </ul>
      )}
      {editing && <TestimonialModal t={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); toast('Saved') }} />}
    </>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api, ApiError } from '../../api/client'
import type { Testimonial } from '../../api/types'
import { Field, Modal, useToast } from '../../components/ui'

const schema = z.object({
  display_name: z.string().trim().min(1, 'Enter a name').max(160),
  company: z.string().max(160),
  text: z.string().trim().min(5, 'Enter the testimonial').max(2000),
  is_published: z.boolean(),
})
type Form = z.infer<typeof schema>

export default function TestimonialModal({ t, onClose, onSaved }: { t: Testimonial | null; onClose: () => void; onSaved: () => void }) {
  const toast = useToast()
  const file = useRef<HTMLInputElement>(null)
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { display_name: t?.display_name ?? '', company: t?.company ?? '', text: t?.text ?? '', is_published: t?.is_published ?? false },
  })
  const submit = handleSubmit(async (v) => {
    try {
      const saved = t ? await api.put<Testimonial>(`/admin/testimonials/${t.id}`, v) : await api.post<Testimonial>('/admin/testimonials', v)
      const f = file.current?.files?.[0]
      if (f) await api.upload(`/admin/testimonials/${saved.id}/image`, f)
      onSaved()
    } catch (e) { const m = e instanceof ApiError ? e.message : 'Could not save'; setError('text', { message: m }); toast(m, 'err') }
  })
  return (
    <Modal title={t ? 'Edit testimonial' : 'Add testimonial'} onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="Customer name or approved display name *" htmlFor="tn" error={errors.display_name?.message}><input id="tn" className="input" {...register('display_name')} /></Field>
        <Field label="Company or customer category (optional)" htmlFor="tc"><input id="tc" className="input" placeholder="e.g. Contractor" {...register('company')} /></Field>
        <Field label="Testimonial *" htmlFor="tt" error={errors.text?.message}><textarea id="tt" rows={5} className="input py-3" {...register('text')} /></Field>
        <Field label="Profile image (optional)" htmlFor="ti" hint="JPG, PNG or WebP."><input id="ti" ref={file} type="file" accept="image/jpeg,image/png,image/webp" className="input py-2" /></Field>
        <label className="flex min-h-[2.75rem] items-center gap-3 text-sm font-semibold"><input type="checkbox" className="h-4 w-4 accent-navy" {...register('is_published')} /> Publish on the website</label>
        <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-gold" disabled={isSubmitting}>Save</button></div>
      </form>
    </Modal>
  )
}

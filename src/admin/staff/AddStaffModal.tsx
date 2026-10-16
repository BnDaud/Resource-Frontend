import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api, ApiError } from '../../api/client'
import { PasswordInput } from '../../components/PasswordInput'
import { Field, Modal } from '../../components/ui'

const schema = z.object({
  name: z.string().trim().min(1, 'Enter a name'),
  email: z.string().min(1, 'Enter an email').email('Enter a valid email'),
  password: z.string().min(10, 'Use at least 10 characters'),
  role: z.enum(['admin', 'editor']),
})

export default function AddStaffModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { role: 'editor' } })
  const submit = handleSubmit(async (v) => {
    try { await api.post('/admin/staff', v); onSaved() } catch (e) { setError('email', { message: e instanceof ApiError ? e.message : 'Could not create' }) }
  })
  return (
    <Modal title="Add staff account" onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="Name" htmlFor="sn" error={errors.name?.message}><input id="sn" className="input" {...register('name')} /></Field>
        <Field label="Email" htmlFor="se" error={errors.email?.message}><input id="se" type="email" autoComplete="off" className="input" {...register('email')} /></Field>
        <Field label="Temporary password" htmlFor="sp" hint="At least 10 characters. Ask them to change it after first sign-in." error={errors.password?.message}><PasswordInput id="sp" autoComplete="new-password" {...register('password')} /></Field>
        <Field label="Role" htmlFor="sr"><select id="sr" className="input" {...register('role')}><option value="editor">Editor</option><option value="admin">Admin</option></select></Field>
        <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-gold" disabled={isSubmitting}>Create</button></div>
      </form>
    </Modal>
  )
}

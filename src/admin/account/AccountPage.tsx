import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api, ApiError } from '../../api/client'
import { PasswordInput } from '../../components/PasswordInput'
import { Field, PageHeader, useToast } from '../../components/ui'

const schema = z.object({
  current_password: z.string().min(1, 'Enter your current password'),
  new_password: z.string().min(10, 'Use at least 10 characters'),
  confirm: z.string(),
}).refine((v) => v.new_password === v.confirm, { path: ['confirm'], message: 'Passwords do not match' })

export default function AccountPage() {
  const toast = useToast()
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  const submit = handleSubmit(async (v) => {
    try {
      await api.post('/admin/auth/change-password', { current_password: v.current_password, new_password: v.new_password })
      toast('Password changed'); reset()
    } catch (e) { setError('current_password', { message: e instanceof ApiError ? e.message : 'Failed' }) }
  })
  return (
    <>
      <PageHeader title="Change password" />
      <form onSubmit={submit} noValidate className="card max-w-md space-y-4">
        <Field label="Current password" htmlFor="cp" error={errors.current_password?.message}><PasswordInput id="cp" autoComplete="current-password" {...register('current_password')} /></Field>
        <Field label="New password" htmlFor="np" hint="At least 10 characters." error={errors.new_password?.message}><PasswordInput id="np" autoComplete="new-password" {...register('new_password')} /></Field>
        <Field label="Repeat new password" htmlFor="cf" error={errors.confirm?.message}><PasswordInput id="cf" autoComplete="new-password" {...register('confirm')} /></Field>
        <button className="btn-gold" disabled={isSubmitting}>Save password</button>
      </form>
    </>
  )
}

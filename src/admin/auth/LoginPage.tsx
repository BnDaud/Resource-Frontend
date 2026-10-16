import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ApiError } from '../../api/client'
import { PasswordInput } from '../../components/PasswordInput'
import { Field } from '../../components/ui'
import { useAuth } from './AuthContext'

const schema = z.object({
  email: z.string().min(1, 'Enter your email').email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
})
type Form = z.infer<typeof schema>

export default function LoginPage() {
  const { login } = useAuth()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) })

  const submit = handleSubmit(async (v) => {
    setError('')
    try { await login(v.email, v.password) }
    catch (e) { setError(e instanceof ApiError && e.status === 429 ? 'Too many attempts. Wait a minute and try again.' : e instanceof ApiError ? e.message : 'Could not sign in') }
  })

  return (
    <div className="grid min-h-screen place-items-center bg-navy px-4 py-10">
      <form onSubmit={submit} noValidate className="w-full max-w-sm rounded-[1.75rem] bg-white p-7 shadow-card">
        <img src="/brand/logo-192.png" alt="Resources Components" className="mx-auto h-20 w-20" />
        <h1 className="mt-3 text-center text-xl font-bold">Staff sign in</h1>
        <p className="mb-5 mt-1 text-center text-sm text-mute">Resources Components CMS</p>
        {error && <div role="alert" className="mb-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</div>}
        <div className="space-y-4">
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <input id="email" type="email" autoComplete="username" className="input" {...register('email')} />
          </Field>
          <Field label="Password" htmlFor="password" error={errors.password?.message}>
            <PasswordInput id="password" autoComplete="current-password" {...register('password')} />
          </Field>
          <button className="btn-gold w-full" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
        </div>
      </form>
    </div>
  )
}

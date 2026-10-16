import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { calls, emptyDashboard, mount, staff, useMockApi } from '../../test/utils'

const api = useMockApi()

test('signed-out visitors are sent to the login page for any admin route', async () => {
  api(() => ({ status: 401, body: { detail: 'Not signed in' } }))
  mount('/admin/products')
  expect(await screen.findByRole('heading', { name: /staff sign in/i })).toBeInTheDocument()
})

test('login shows validation errors without calling the API', async () => {
  api((url) => (url.includes('/auth/me') ? { status: 401 } : { status: 500 }))
  mount('/admin/login')
  await userEvent.click(await screen.findByRole('button', { name: /sign in/i }))
  expect(await screen.findByText('Enter your email')).toBeInTheDocument()
  expect(screen.getByText('Enter your password')).toBeInTheDocument()
  expect(calls.some((c) => c.url.includes('/auth/login'))).toBe(false)
})

test('wrong password shows the server message', async () => {
  api((url) => (url.includes('/auth/me') ? { status: 401 } : { status: 401, body: { detail: 'Incorrect email or password' } }))
  mount('/admin/login')
  await userEvent.type(await screen.findByLabelText('Email'), 'a@b.com')
  await userEvent.type(screen.getByLabelText('Password'), 'nope')
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect email or password')
})

test('successful login sends the CSRF header and opens the dashboard', async () => {
  let signedIn = false
  api((url) => {
    if (url.includes('/auth/me')) return signedIn ? { status: 200, body: staff('admin') } : { status: 401 }
    if (url.includes('/auth/login')) { signedIn = true; return { status: 200, body: staff('admin') } }
    return { status: 200, body: emptyDashboard }
  })
  mount('/admin/login')
  await userEvent.type(await screen.findByLabelText('Email'), 'a@b.com')
  await userEvent.type(screen.getByLabelText('Password'), 'correct-horse-1')
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
  expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  const login = calls.find((c) => c.url.includes('/auth/login'))!
  expect((login.init?.headers as Record<string, string>)['X-Requested-With']).toBe('rc-cms')
  expect(login.init?.credentials).toBe('include')
})

test('editors do not see admin-only links and are redirected from /settings', async () => {
  api((url) => (url.includes('/auth/me') ? { status: 200, body: staff('editor') } : { status: 200, body: emptyDashboard }))
  mount('/admin/settings')
  expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Staff' })).not.toBeInTheDocument()
})

test('side nav has Settings and Testimonials as separate pages and no Enquiries entry', async () => {
  api((url) => (url.includes('/auth/me') ? { status: 200, body: staff('admin') } : { status: 200, body: emptyDashboard }))
  mount('/admin')
  expect(await screen.findByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/admin/settings')
  expect(screen.getByRole('link', { name: 'Testimonials' })).toHaveAttribute('href', '/admin/testimonials')
  expect(screen.queryByRole('link', { name: /^Enquiries$/ })).not.toBeInTheDocument()
})

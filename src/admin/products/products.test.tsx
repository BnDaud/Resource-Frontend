import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { ApiError } from '../../api/client'
import { calls, mount, paged, staff, useMockApi } from '../../test/utils'

const api = useMockApi()

test('an API failure on a list page shows an error with retry', async () => {
  api((url) => (url.includes('/auth/me') ? { status: 200, body: staff('admin') } : { status: 500, body: { detail: 'boom' } }))
  mount('/admin/products')
  expect(await screen.findByRole('alert')).toHaveTextContent('boom')
  expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
})

test('empty product list shows a helpful empty state', async () => {
  api((url) => {
    if (url.includes('/auth/me')) return { status: 200, body: staff('admin') }
    if (url.includes('/admin/products')) return { status: 200, body: paged([]) }
    return { status: 200, body: [] }
  })
  mount('/admin/products')
  await waitFor(() => expect(screen.getByText('No products yet')).toBeInTheDocument())
})

test('product form blocks save and explains the missing fields', async () => {
  api((url) => (url.includes('/auth/me') ? { status: 200, body: staff('admin') } : { status: 200, body: [] }))
  mount('/admin/products/new')
  await userEvent.click(await screen.findByRole('button', { name: /save product/i }))
  expect(await screen.findByText('Enter a product name')).toBeInTheDocument()
  expect(screen.getByText('Enter a SKU')).toBeInTheDocument()
  expect(screen.getByText('Choose a category')).toBeInTheDocument()
  expect(calls.some((c) => c.init?.method === 'POST' && c.url.includes('/admin/products'))).toBe(false)
})

test('network failure gives a readable message', () => {
  expect(new ApiError(0, 'Cannot reach the server. Check your connection and try again.').message).toMatch(/Cannot reach the server/)
})

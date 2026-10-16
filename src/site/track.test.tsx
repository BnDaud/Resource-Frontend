import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import { calls, mount, useMockApi } from '../test/utils'
import { siteHandler } from './test/fixtures'

const api = useMockApi()
beforeEach(() => window.localStorage.clear())

const found = { reference: 'RC-261012-F3LE', kind: 'quote', status: 'quoted', created_at: '2026-10-12T10:00:00Z', subject: '', items: [{ name: 'Oak Door', sku: 'FD-1', quantity: 5, note: '' }] }

test('a customer sees status and items for a matching reference and phone', async () => {
  api(siteHandler((url, init) => (url.endsWith('/track') && init?.method === 'POST' ? { status: 200, body: found } : undefined)))
  mount('/track')
  await userEvent.type(await screen.findByLabelText('Reference number'), 'rc-261012-f3le')
  await userEvent.type(screen.getByLabelText('Phone number'), '08031234567')
  await userEvent.click(screen.getByRole('button', { name: /check status/i }))
  expect((await screen.findAllByText('Quote ready')).length).toBeGreaterThan(0)
  expect(screen.getByText('Oak Door')).toBeInTheDocument()
  expect(JSON.parse(String(calls.find((c) => c.url.endsWith('/track'))!.init!.body))).toEqual({ reference: 'rc-261012-f3le', phone: '08031234567' })
})

test('a wrong reference or phone shows the same neutral message', async () => {
  api(siteHandler((url) => (url.endsWith('/track') ? { status: 404, body: { detail: 'We could not find a request with those details. Check the reference and phone number.' } } : undefined)))
  mount('/track')
  await userEvent.type(await screen.findByLabelText('Reference number'), 'RC-000000-ZZZZ')
  await userEvent.type(screen.getByLabelText('Phone number'), '08031234567')
  await userEvent.click(screen.getByRole('button', { name: /check status/i }))
  expect(await screen.findByRole('alert')).toHaveTextContent('could not find a request')
})

test('missing details are explained before any lookup is made', async () => {
  api(siteHandler())
  mount('/track')
  await userEvent.click(await screen.findByRole('button', { name: /check status/i }))
  expect(await screen.findByRole('alert')).toHaveTextContent(/reference number/i)
  expect(calls.some((c) => c.url.endsWith('/track'))).toBe(false)
})

test('requests sent from this device are offered again, with the phone remembered', async () => {
  window.localStorage.setItem('rc.requests', JSON.stringify([{ reference: 'RC-261012-F3LE', kind: 'quote', phone: '08031234567', savedAt: '2026-10-12' }]))
  api(siteHandler((url, init) => (url.endsWith('/track') && init?.method === 'POST' ? { status: 200, body: found } : undefined)))
  mount('/track')
  await userEvent.click(await screen.findByRole('button', { name: /view status/i }))
  expect((await screen.findAllByText('Quote ready')).length).toBeGreaterThan(0)
})

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import { calls, mount, useMockApi } from '../test/utils'
import { DOOR, siteHandler, U1 } from './test/fixtures'

const api = useMockApi()
beforeEach(() => window.localStorage.clear())

const listWithDoor = () => window.localStorage.setItem('rc.quote', JSON.stringify([{ productId: U1, slug: 'oak-door', name: 'Oak Door', sku: 'SKU-8', category: 'Flush Doors', image: null, quantity: 2, note: '' }]))

test('adding a product from the catalogue updates the quote list count and persists it', async () => {
  api(siteHandler())
  mount('/products')
  await userEvent.click((await screen.findAllByRole('button', { name: /add to quote/i }))[0])
  expect(await screen.findByRole('link', { name: /quote list, 1 item/i })).toBeInTheDocument()
  expect(JSON.parse(window.localStorage.getItem('rc.quote')!)).toMatchObject([{ productId: DOOR.id, quantity: 1 }])
})

test('the list survives navigating between pages and a reload', async () => {
  listWithDoor(); api(siteHandler())
  mount('/quote')
  expect(await screen.findByText('Your products (1)')).toBeInTheDocument()
  expect(screen.getByLabelText('Quantity')).toHaveValue('2')
})

test('quantities can be changed and products removed', async () => {
  listWithDoor(); api(siteHandler())
  mount('/quote')
  await userEvent.click(await screen.findByRole('button', { name: 'Increase quantity' }))
  expect(screen.getByLabelText('Quantity')).toHaveValue('3')
  await userEvent.click(screen.getByRole('button', { name: 'Decrease quantity' }))
  await userEvent.click(screen.getByRole('button', { name: 'Remove Oak Door' }))
  expect(await screen.findByText('Your quote list is empty')).toBeInTheDocument()
})

test('the form blocks submission and shows what is wrong, without calling the API', async () => {
  listWithDoor(); api(siteHandler())
  mount('/quote')
  await userEvent.click(await screen.findByRole('button', { name: /submit quote request/i }))
  expect(await screen.findByText('Enter your full name')).toBeInTheDocument()
  expect(screen.getByText('Enter a phone number we can reach you on')).toBeInTheDocument()
  expect(calls.some((c) => c.init?.method === 'POST')).toBe(false)
})

test('a valid request is sent with product ids and quantities, shows the reference and clears the list', async () => {
  listWithDoor()
  api(siteHandler((url, init) => (url.endsWith('/quotes') && init?.method === 'POST' ? { status: 201, body: { reference: 'RC-261012-F3LE' } } : undefined), { whatsapp_number: '2348012345678' }))
  mount('/quote')
  await userEvent.type(await screen.findByLabelText('Full name *'), 'Chinedu Okafor')
  await userEvent.type(screen.getByLabelText('Phone number *'), '08031234567')
  await userEvent.click(screen.getByRole('button', { name: /submit quote request/i }))
  expect(await screen.findByText('RC-261012-F3LE')).toBeInTheDocument()
  const post = calls.find((c) => c.init?.method === 'POST' && c.url.endsWith('/quotes'))!
  expect(JSON.parse(String(post.init!.body))).toMatchObject({ full_name: 'Chinedu Okafor', phone: '08031234567', customer_type: 'retail', email: null, items: [{ product_id: U1, quantity: 2 }] })
  expect(JSON.parse(window.localStorage.getItem('rc.quote')!)).toEqual([])
  expect(JSON.parse(window.localStorage.getItem('rc.requests')!)[0]).toMatchObject({ reference: 'RC-261012-F3LE', kind: 'quote' })
  expect(screen.getByRole('link', { name: /send reference on whatsapp/i })).toHaveAttribute('href', expect.stringContaining('wa.me/2348012345678'))
})

test('server rejection is shown to the customer and the list is kept', async () => {
  listWithDoor()
  api(siteHandler((url, init) => (url.endsWith('/quotes') && init?.method === 'POST' ? { status: 422, body: { detail: 'Some products are no longer available. Remove them from your list and try again.' } } : undefined)))
  mount('/quote')
  await userEvent.type(await screen.findByLabelText('Full name *'), 'Chinedu Okafor')
  await userEvent.type(screen.getByLabelText('Phone number *'), '08031234567')
  await userEvent.click(screen.getByRole('button', { name: /submit quote request/i }))
  expect(await screen.findByRole('alert')).toHaveTextContent('no longer available')
  expect(JSON.parse(window.localStorage.getItem('rc.quote')!)).toHaveLength(1)
})

test('rate limiting gets a friendly message', async () => {
  listWithDoor()
  api(siteHandler((url, init) => (url.endsWith('/quotes') && init?.method === 'POST' ? { status: 429, body: { detail: 'limit' } } : undefined)))
  mount('/quote')
  await userEvent.type(await screen.findByLabelText('Full name *'), 'Chinedu Okafor')
  await userEvent.type(screen.getByLabelText('Phone number *'), '08031234567')
  await userEvent.click(screen.getByRole('button', { name: /submit quote request/i }))
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/too many requests/i))
})

test('the WhatsApp buttons are hidden when no business number is configured', async () => {
  listWithDoor(); api(siteHandler())
  mount('/quote')
  await screen.findByText('Your products (1)')
  expect(screen.queryByRole('link', { name: /whatsapp/i })).not.toBeInTheDocument()
})

test('the floating WhatsApp button carries the quote list, or the normal greeting when the list is empty', async () => {
  const cfg = { whatsapp_number: '2348000000000' }
  listWithDoor(); api(siteHandler(undefined, cfg))
  const { unmount } = mount('/products')
  await screen.findAllByRole('button', { name: /add to quote/i })
  const href = decodeURIComponent(screen.getAllByRole('link', { name: /chat on whatsapp/i }).slice(-1)[0].getAttribute('href')!)
  expect(href).toContain('wa.me/2348000000000')
  expect(href).toContain("I'd like a quote for:\n- Oak Door x 2")
  unmount()

  window.localStorage.clear(); api(siteHandler(undefined, cfg))
  mount('/products')
  await screen.findAllByRole('button', { name: /add to quote/i })
  expect(decodeURIComponent(screen.getAllByRole('link', { name: /chat on whatsapp/i }).slice(-1)[0].getAttribute('href')!)).not.toContain('like a quote for')
})

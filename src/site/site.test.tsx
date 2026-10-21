import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import { calls, mount, useMockApi } from '../test/utils'
import { siteHandler } from './test/fixtures'

const api = useMockApi()
beforeEach(() => window.localStorage.clear())

test('the homepage shows the headline and calls to action, and has a staff login link at the bottom', async () => {
  api(siteHandler())
  mount('/')
  expect(await screen.findByRole('heading', { level: 1, name: /Quality Boards & Accessories/ })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Explore Products' })).toHaveAttribute('href', '/products')
  expect(screen.getByRole('link', { name: 'Staff login' })).toHaveAttribute('href', '/admin')
  expect(screen.getAllByRole('link', { name: 'Request a Quote' })[0]).toHaveAttribute('href', '/quote')
})

test('featured products show an empty state when none are chosen; no testimonials section without approved ones', async () => {
  api(siteHandler((url) => (url.includes('featured=true') ? { status: 200, body: { items: [], total: 0, page: 1, page_size: 4, pages: 1 } } : undefined)))
  mount('/')
  expect(await screen.findByText('Featured products will appear here')).toBeInTheDocument()
  expect(screen.queryByText('What customers say')).not.toBeInTheDocument()
})

test('contact details appear only when configured, and WhatsApp uses the configured number', async () => {
  api(siteHandler(undefined, { phone: '+234 800 000 0000', whatsapp_number: '2348000000000' }))
  mount('/contact')
  expect((await screen.findAllByRole('link', { name: '+234 800 000 0000' }))[0]).toHaveAttribute('href', 'tel:+234 800 000 0000')
  expect(screen.getAllByRole('link', { name: /chat on whatsapp/i })[0]).toHaveAttribute('href', expect.stringContaining('wa.me/2348000000000'))
  expect(screen.queryByText('Instagram')).not.toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: /get directions/i })[0]).toHaveAttribute('href', expect.stringContaining('google.com/maps/dir'))
})

test('the enquiry form validates, submits and shows a reference', async () => {
  api(siteHandler((url, init) => (url.endsWith('/enquiries') && init?.method === 'POST' ? { status: 201, body: { reference: 'EN-261012-AB2C' } } : undefined)))
  mount('/contact')
  await userEvent.click(await screen.findByRole('button', { name: 'Send message' }))
  expect(await screen.findByText('Enter your name')).toBeInTheDocument()
  expect(calls.some((c) => c.init?.method === 'POST')).toBe(false)
  await userEvent.type(screen.getByLabelText('Name *'), 'Funke Adeyemi')
  await userEvent.type(screen.getByLabelText('Phone number *'), '08066778899')
  await userEvent.type(screen.getByLabelText('Subject *'), 'Opening hours')
  await userEvent.type(screen.getByLabelText('Message *'), 'Are you open on Saturdays?')
  await userEvent.click(screen.getByRole('button', { name: 'Send message' }))
  expect(await screen.findByText('EN-261012-AB2C')).toBeInTheDocument()
})

test('the public website never calls the admin API or the session check', async () => {
  api(siteHandler())
  mount('/')
  await screen.findByRole('heading', { level: 1 })
  expect(calls.some((c) => c.url.includes('/admin/'))).toBe(false)
})

test('the Categories menu groups categories under Boards and Accessories, and each link keeps its division', async () => {
  api(siteHandler())
  mount('/')
  const button = await screen.findByRole('button', { name: /categories/i })
  await userEvent.click(button)
  const menu = within(button.parentElement!)
  expect(menu.getByRole('link', { name: 'Boards' })).toHaveAttribute('href', '/products?section=boards')
  expect(menu.getByRole('link', { name: 'Accessories' })).toHaveAttribute('href', '/products?section=accessories')
  expect(menu.getByRole('link', { name: /^HDF/ })).toHaveAttribute('href', '/products?section=boards&category=hdf')
  expect(menu.getByRole('link', { name: /^Edges Tape/ })).toHaveAttribute('href', '/products?section=accessories&category=edges-tape')
})

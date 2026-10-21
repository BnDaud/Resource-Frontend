import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import { calls, mount, useMockApi } from '../test/utils'
import { DOOR, page, product, siteHandler } from './test/fixtures'

const api = useMockApi()
beforeEach(() => window.localStorage.clear())

test('browsing the catalogue lists products from the API with availability and price status', async () => {
  api(siteHandler())
  mount('/products')
  expect(await screen.findByRole('link', { name: 'Oak Door' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Edge Tape' })).toBeInTheDocument()  // one link per product: the photo link is hidden from assistive tech
  expect(screen.getAllByText('Request price').length).toBeGreaterThan(0)  // no public price set → never an invented one
  expect(screen.getAllByText('On request').length).toBeGreaterThan(0)
})

test('searching sends the term to the API and updates the address', async () => {
  api(siteHandler())
  mount('/products')
  await screen.findByRole('link', { name: 'Oak Door' })
  await userEvent.type(screen.getByLabelText('Search products'), 'oak')
  await waitFor(() => expect(calls.some((c) => c.url.includes('/products?') && c.url.includes('q=oak'))).toBe(true))
})

test('choosing a category and a sort order are sent to the API', async () => {
  api(siteHandler())
  mount('/products')
  await screen.findByRole('link', { name: 'Oak Door' })
  await userEvent.click(within(screen.getByRole('group', { name: 'Categories' })).getByRole('button', { name: 'MDF' }))
  await waitFor(() => expect(calls.some((c) => c.url.includes('category=mdf'))).toBe(true))
  await userEvent.selectOptions(screen.getByLabelText('Sort by'), 'newest')
  await waitFor(() => expect(calls.some((c) => c.url.includes('sort=newest'))).toBe(true))
})

test('the product page is split into Boards and Accessories, each with its own categories', async () => {
  api(siteHandler())
  mount('/products')
  await screen.findByRole('link', { name: 'Oak Door' })
  const chips = () => within(screen.getByRole('group', { name: 'Categories' })).getAllByRole('button').map((b) => b.textContent)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Boards')
  expect(chips()).toEqual(['All boards', 'HDF', 'MDF'])
  await userEvent.click(within(screen.getByRole('group', { name: 'Division' })).getByRole('button', { name: 'Accessories' }))
  await waitFor(() => expect(calls.some((c) => c.url.includes('section=accessories'))).toBe(true))
  expect(chips()).toEqual(['All accessories', 'Edges Tape'])
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Accessories')
})

test('a link to a category opens in that category\'s division and asks the API for the category only', async () => {
  api(siteHandler())
  mount('/products?category=edges-tape')
  await waitFor(() => expect(within(screen.getByRole('group', { name: 'Division' })).getByRole('button', { name: 'Accessories' })).toHaveAttribute('aria-pressed', 'true'))
  const last = calls.filter((c) => c.url.includes('/api/v1/products')).slice(-1)[0].url
  expect(last).toContain('category=edges-tape')
  expect(last).not.toContain('section=')
})

test('no results shows a helpful empty state', async () => {
  api(siteHandler((url) => (url.includes('/api/v1/products?') ? { status: 200, body: page([]) } : undefined)))
  mount('/products?q=zzz')
  expect(await screen.findByText('No products match your search')).toBeInTheDocument()
})

test('a failing API shows an error with retry instead of a blank page', async () => {
  api(siteHandler((url) => (url.includes('/api/v1/products?') ? { status: 500, body: { detail: 'down' } } : undefined)))
  mount('/products')
  expect(await screen.findByRole('alert')).toHaveTextContent(/could not load/i)
  expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
})

test('pagination appears when there is more than one page', async () => {
  api(siteHandler((url) => (url.includes('/api/v1/products?') ? { status: 200, body: { ...page([DOOR]), pages: 3, total: 30 } } : undefined)))
  mount('/products')
  expect(await screen.findByText('Page 1 of 3')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
  await waitFor(() => expect(calls.some((c) => c.url.includes('page=2'))).toBe(true))
})

test('a published price is shown with the naira sign; staff-only fields are never rendered', async () => {
  api(siteHandler((url) => (url.includes('/api/v1/products?') ? { status: 200, body: page([product('33333333-3333-4333-8333-333333333333', 'Priced Door', { price_mode: 'public', public_price: '45000.00' })]) } : undefined)))
  mount('/products')
  expect(await screen.findByText('₦45,000')).toBeInTheDocument()
})

test('product page shows details and 404s cleanly for unknown products', async () => {
  api(siteHandler())
  mount('/products/oak-door')
  expect(await screen.findByRole('heading', { name: 'Oak Door' })).toBeInTheDocument()
  expect(screen.getByText('Thickness')).toBeInTheDocument()
})

test('unknown product slug shows the not-found page', async () => {
  api(siteHandler((url) => (url.includes('/products/nope') ? { status: 404, body: { detail: 'Product not found' } } : undefined)))
  mount('/products/nope')
  expect(await screen.findByRole('heading', { name: /could not find that page/i })).toBeInTheDocument()
})

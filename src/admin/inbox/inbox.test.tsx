import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { emptyDashboard, mount, paged, setDesktop, staff, useMockApi } from '../../test/utils'

const api = useMockApi()
const U1 = '11111111-1111-4111-8111-111111111111'
const U2 = '22222222-2222-4222-8222-222222222222'
const E1 = '33333333-3333-4333-8333-333333333333'
const E2 = '44444444-4444-4444-8444-444444444444'

const quoteRow = (id: string, name: string, status = 'new') => ({ id, reference: `RC-0000${id === U1 ? 1 : 2}`, full_name: name, customer_type: 'wholesale', phone: '08000000000', status, created_at: '2026-10-01T10:00:00Z', item_count: 2 })
const quoteFull = (id: string, name: string) => ({
  ...quoteRow(id, name), email: '', company: '', message: `Message from ${name}`, preferred_contact: 'whatsapp', internal_notes: '',
  items: [{ id: 1, product_id: 9, product_name: 'Oak Door', product_sku: 'FD-1', spec_note: '', quantity: 5 }],
})
const enquiry = (id: string, subject: string) => ({ id, reference: 'EN-261001-AAAA', name: 'Funke', email: '', phone: '08011112222', subject, message: `About ${subject}`, status: 'new', internal_notes: '', created_at: '2026-10-01T10:00:00Z' })

function scriptedApi() {
  const patches: unknown[] = []
  api((url, init) => {
    if (url.includes('/auth/me')) return { status: 200, body: staff('admin') }
    if (url.includes('/admin/dashboard')) return { status: 200, body: emptyDashboard }
    if (init?.method === 'PATCH') { patches.push(JSON.parse(String(init.body))); return { status: 200, body: { ...quoteFull(U2, 'Ngozi'), status: 'quoted' } } }
    if (new RegExp(`/admin/quotes/${U1}$`).test(url)) return { status: 200, body: quoteFull(U1, 'Chinedu') }
    if (new RegExp(`/admin/quotes/${U2}$`).test(url)) return { status: 200, body: quoteFull(U2, 'Ngozi') }
    if (url.includes('/admin/quotes')) return { status: 200, body: paged([quoteRow(U1, 'Chinedu'), quoteRow(U2, 'Ngozi')]) }
    if (url.includes('/admin/enquiries')) return { status: 200, body: paged([enquiry(E1, 'Opening hours'), enquiry(E2, 'Delivery')]) }
    return { status: 200, body: [] }
  })
  return patches
}

test('desktop: list on the left, the first request is open by default on the right', async () => {
  setDesktop(true); scriptedApi()
  mount('/admin/quotes')
  expect(await screen.findByRole('heading', { name: 'RC-00001' })).toBeInTheDocument()
  expect(screen.getByText('Message from Chinedu')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Open RC-00002' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Open RC-00001' })).toHaveAttribute('aria-current', 'true')
})

test('clicking another request shows it on the right without leaving the page', async () => {
  setDesktop(true); scriptedApi()
  mount('/admin/quotes')
  await screen.findByRole('heading', { name: 'RC-00001' })
  await userEvent.click(screen.getByRole('button', { name: 'Open RC-00002' }))
  expect(await screen.findByRole('heading', { name: 'RC-00002' })).toBeInTheDocument()
  expect(screen.getByText('Message from Ngozi')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Open RC-00002' })).toHaveAttribute('aria-current', 'true')
  expect(screen.getByRole('button', { name: 'Open RC-00001' })).toHaveAttribute('aria-current', 'false')
})

test('saving status and notes sends one PATCH and updates the list badge', async () => {
  setDesktop(true); const patches = scriptedApi()
  mount(`/admin/quotes?id=${U2}`)
  await screen.findByRole('heading', { name: 'RC-00002' })
  await userEvent.selectOptions(screen.getByLabelText('Status'), 'quoted')
  await userEvent.type(screen.getByLabelText('Internal notes'), 'Sent price')
  await userEvent.click(screen.getByRole('button', { name: /save note and status/i }))
  await waitFor(() => expect(patches).toEqual([{ status: 'quoted', internal_notes: 'Sent price' }]))
  const row = screen.getByRole('button', { name: 'Open RC-00002' })
  await waitFor(() => expect(within(row).getByText('Quoted')).toBeInTheDocument())
})

test('the General enquiries tab shows enquiries in the same split layout, first one open', async () => {
  setDesktop(true); scriptedApi()
  mount('/admin/quotes')
  await screen.findByRole('heading', { name: 'RC-00001' })
  await userEvent.click(screen.getByRole('tab', { name: 'General enquiries' }))
  expect(await screen.findByRole('heading', { name: 'Opening hours' })).toBeInTheDocument()
  expect(screen.getByText('About Opening hours')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Open enquiry Delivery' }))
  expect(await screen.findByRole('heading', { name: 'Delivery' })).toBeInTheDocument()
})

test('phone: shows the list first, opens a request on tap, and has a back button', async () => {
  setDesktop(false); scriptedApi()
  mount('/admin/quotes')
  expect(await screen.findByRole('button', { name: 'Open RC-00001' })).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'RC-00001' })).not.toBeInTheDocument() // nothing auto-selected on small screens
  await userEvent.click(screen.getByRole('button', { name: 'Open RC-00001' }))
  expect(await screen.findByRole('heading', { name: 'RC-00001' })).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /back to list/i }))
  await waitFor(() => expect(screen.queryByRole('heading', { name: 'RC-00001' })).not.toBeInTheDocument())
})

test('staff can pick a WhatsApp message template; the link carries the name and reference', async () => {
  setDesktop(true); scriptedApi()
  mount(`/admin/quotes?id=${U1}`)
  await screen.findByRole('heading', { name: 'RC-00001' })
  const link = () => screen.getByRole('link', { name: /whatsapp customer/i })
  expect(decodeURIComponent(link().getAttribute('href')!)).toContain('about your quote request RC-00001')
  await userEvent.selectOptions(screen.getByLabelText('WhatsApp message'), 'Quote is ready')
  expect(decodeURIComponent(link().getAttribute('href')!)).toContain('your quotation for request RC-00001')
  expect(link().getAttribute('href')).toContain('wa.me/2348000000000') // local 0800… becomes international
})

import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { calls, mount, staff, useMockApi } from '../../test/utils'

const api = useMockApi()

const cats = [
  { id: 1, name: 'HDF', slug: 'hdf', description: '', sort_order: 0, section: 'boards' },
  { id: 2, name: 'Microwave', slug: 'microwave', description: '', sort_order: 1, section: 'accessories' },
]
const finish = { id: 7, name: 'Finish', filterable: true, customer_picks: true, section: 'boards', category_id: null, options: [{ id: 1, label: 'Matte', color: null }, { id: 2, label: 'Glossy', color: '#ffffff' }] }

test('the Categories page is grouped by division and staff can edit the filters and options of a category', async () => {
  api((url) => {
    if (url.includes('/auth/me')) return { status: 200, body: staff('admin') }
    if (url.includes('/admin/attributes')) return { status: 200, body: [finish] }
    if (url.includes('/admin/categories')) return { status: 200, body: cats }
    return { status: 404 }
  })
  mount('/admin/categories')
  const boards = await screen.findByRole('region', { name: 'Boards' })
  expect(within(boards).getByText('HDF')).toBeInTheDocument()
  expect(within(screen.getByRole('region', { name: 'Accessories' })).getByText('Microwave')).toBeInTheDocument()

  await userEvent.click(within(boards).getByRole('button', { name: 'Filters and options' }))
  const option = await screen.findByLabelText('Finish option 2')
  await userEvent.clear(option)
  await userEvent.type(option, 'High gloss')
  await userEvent.click(screen.getByRole('button', { name: '+ Add a choice' }))
  await userEvent.type(screen.getAllByLabelText('Name of the choice')[1], 'Thickness')
  await userEvent.type(screen.getByLabelText('Thickness option 1'), '18 mm')
  await userEvent.click(screen.getByRole('button', { name: 'Save' }))

  await waitFor(() => expect(calls.some((c) => c.init?.method === 'PUT' && c.url.includes('/admin/attributes?scope=category:1'))).toBe(true))
  const put = calls.find((c) => c.init?.method === 'PUT')!
  const sent = JSON.parse(put.init!.body as string)
  expect(sent[0]).toMatchObject({ id: 7, name: 'Finish', options: [{ id: 1, label: 'Matte' }, { id: 2, label: 'High gloss', color: '#ffffff' }] })  // ids kept, so products keep their choices
  expect(sent[1]).toMatchObject({ name: 'Thickness', filterable: true, customer_picks: true, options: [{ label: '18 mm', color: null }] })
  expect(sent[1].id).toBeUndefined()
})

test('the product form offers the choices of the selected category and sends the ticked ones', async () => {
  api((url) => {
    if (url.includes('/auth/me')) return { status: 200, body: staff('admin') }
    if (url.includes('/admin/categories/1/attributes')) return { status: 200, body: [finish] }
    if (url.includes('/admin/categories')) return { status: 200, body: cats }
    if (url.includes('/admin/products')) return { status: 201, body: { id: '11111111-1111-4111-8111-111111111111', category_id: 1, option_ids: [2], specs: [], images: [], is_archived: false } }
    return { status: 404 }
  })
  mount('/admin/products/new')
  expect(await screen.findByText('Choose a category first.')).toBeInTheDocument()
  await userEvent.selectOptions(await screen.findByLabelText(/category/i), '1')
  await userEvent.click(await screen.findByRole('button', { name: 'Glossy' }))
  await userEvent.type(screen.getByLabelText(/product name/i), 'Glossy board')
  await userEvent.type(screen.getByLabelText(/sku/i), 'g-1')
  await userEvent.click(screen.getByRole('button', { name: /save product/i }))
  await waitFor(() => expect(calls.some((c) => c.init?.method === 'POST' && c.url.endsWith('/admin/products'))).toBe(true))
  const body = JSON.parse(calls.find((c) => c.init?.method === 'POST')!.init!.body as string)
  expect(body).toMatchObject({ category_id: 1, option_ids: [2] })
  expect(body).not.toHaveProperty('sizes')
})

test('staff can paste a colour sheet into a choice, with codes and swatches, and save it', async () => {
  api((url) => {
    if (url.includes('/auth/me')) return { status: 200, body: staff('admin') }
    if (url.includes('/admin/attributes')) return { status: 200, body: [{ ...finish, name: 'Special colour', options: [] }] }
    if (url.includes('/admin/categories')) return { status: 200, body: cats }
    return { status: 404 }
  })
  mount('/admin/categories')
  await userEvent.click(await screen.findByRole('button', { name: 'Filters for all boards' }))
  await userEvent.click(await screen.findByRole('button', { name: 'Paste a list' }))
  await userEvent.click(screen.getByLabelText(/One option per line/))
  await userEvent.paste('RAL 3020, Traffic red, #cc0605\nRAL 9010, Pure white, #f4f4f4\nRAL 3020, Traffic red again')
  await userEvent.click(screen.getByRole('button', { name: 'Add these' }))
  expect(screen.getByLabelText('Special colour option 2 code')).toHaveValue('RAL 9010')  // the repeated code was skipped
  await userEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(calls.some((c) => c.init?.method === 'PUT')).toBe(true))
  const sent = JSON.parse(calls.find((c) => c.init?.method === 'PUT')!.init!.body as string)
  expect(sent[0].options).toEqual([{ label: 'Traffic red', code: 'RAL 3020', color: '#cc0605' }, { label: 'Pure white', code: 'RAL 9010', color: '#f4f4f4' }])
})

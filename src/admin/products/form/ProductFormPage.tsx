import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, ApiError } from '../../../api/client'
import type { Category, Product, ProductImage } from '../../../api/types'
import { ConfirmButton, ErrorNote, PageHeader, Spinner, useToast } from '../../../components/ui'
import { useFetch } from '../../../lib/useFetch'
import { BasicsSection } from './BasicsSection'
import { ImageManager } from './ImageManager'
import { OptionsSection } from './OptionsSection'
import { blankProduct, toFormValues, toPayload } from './mappers'
import { productSchema, type ProductFormValues } from './schema'
import { AvailabilityPanel, PricingPanel, StaffOnlyPanel } from './SidePanels'
import { SpecsSection } from './SpecsSection'

/** Keyed by id so moving from /new to /:id after saving mounts a fresh form instead of reusing stale state. */
export default function ProductFormPage() {
  const { id } = useParams()
  return <ProductForm key={id ?? 'new'} id={id} />
}

function ProductForm({ id }: { id?: string }) {
  const isNew = !id
  const nav = useNavigate()
  const toast = useToast()
  const cats = useFetch(() => api.get<Category[]>('/admin/categories'), [])
  const prod = useFetch(() => (isNew ? Promise.resolve(null) : api.get<Product>(`/admin/products/${id}`)), [id])
  const [images, setImages] = useState<ProductImage[]>([])
  const [archived, setArchived] = useState(false)

  const form = useForm<ProductFormValues>({ resolver: zodResolver(productSchema), defaultValues: blankProduct })
  const { handleSubmit, reset, setError, formState: { isSubmitting, isDirty } } = form

  useEffect(() => {
    if (prod.data) { reset(toFormValues(prod.data)); setImages(prod.data.images); setArchived(prod.data.is_archived) }
  }, [prod.data, reset])

  const submit = handleSubmit(async (v) => {
    try {
      if (isNew) {
        const created = await api.post<Product>('/admin/products', toPayload(v))
        toast('Product created. Now add images.')
        nav(`/admin/products/${created.id}`, { replace: true })
      } else {
        reset(toFormValues(await api.put<Product>(`/admin/products/${id}`, toPayload(v))))
        toast('Product saved')
      }
    } catch (e) {
      if (e instanceof ApiError && e.fields) Object.entries(e.fields).forEach(([k, m]) => setError(k as keyof ProductFormValues, { message: m }))
      else if (e instanceof ApiError && e.status === 409) setError('sku', { message: e.message })
      toast(e instanceof ApiError ? e.message : 'Could not save', 'err')
    }
  })

  const setArchive = async (flag: boolean) => {
    try {
      await api.patch(`/admin/products/${id}/archive?archived=${flag}`)
      setArchived(flag); toast(flag ? 'Product archived' : 'Product restored')
      if (flag) nav('/admin/products')
    } catch { toast('Could not update', 'err') }
  }

  if (prod.error) return <ErrorNote message={prod.error} onRetry={prod.reload} />
  if (!isNew && !prod.data) return <Spinner />

  return (
    <FormProvider {...form}>
      <form onSubmit={submit} noValidate>
        <PageHeader title={isNew ? 'New product' : 'Edit product'} sub={!isNew && archived ? 'This product is archived and hidden from the website.' : undefined}
          actions={<><Link to="/admin/products" className="btn-ghost">Cancel</Link><button className="btn-gold" disabled={isSubmitting || (!isNew && !isDirty)}>{isSubmitting ? 'Saving…' : 'Save product'}</button></>} />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-4">
            <BasicsSection categories={cats.data ?? []} />
            <section className="card">
              <h2 className="mb-1 text-base font-bold">Images</h2>
              {isNew ? <p className="text-sm text-mute">Save the product first, then you can upload images.</p> : <ImageManager productId={id!} images={images} onChange={setImages} />}
            </section>
            <OptionsSection />
            <SpecsSection />
          </div>
          <aside className="space-y-4">
            <AvailabilityPanel />
            <PricingPanel />
            <StaffOnlyPanel />
            {!isNew && (archived
              ? <button type="button" className="btn-ghost w-full" onClick={() => setArchive(false)}>Restore product</button>
              : <ConfirmButton className="btn-danger w-full" confirm="Archive this product?" onConfirm={() => setArchive(true)}>Archive product</ConfirmButton>)}
            {!isNew && <p className="hint">Archiving hides the product from the website. Past quote requests keep its name and SKU.</p>}
          </aside>
        </div>
      </form>
    </FormProvider>
  )
}

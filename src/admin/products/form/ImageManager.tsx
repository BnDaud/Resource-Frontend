import { ImagePlus, Star, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { api, ApiError } from '../../../api/client'
import type { ProductImage } from '../../../api/types'
import { useToast } from '../../../components/ui'

const MAX_MB = 5
const MAX_IMAGES = 12
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']

export function ImageManager({ productId, images, onChange }: { productId: string; images: ProductImage[]; onChange: (i: ProductImage[]) => void }) {
  const toast = useToast()
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    setBusy(true)
    let list = images
    for (const f of Array.from(files)) {
      if (!ACCEPTED.includes(f.type)) { toast(`${f.name}: use JPG, PNG or WebP`, 'err'); continue }
      if (f.size > MAX_MB * 1024 * 1024) { toast(`${f.name}: larger than ${MAX_MB} MB`, 'err'); continue }
      try { list = [...list, await api.upload<ProductImage>(`/admin/products/${productId}/images`, f)]; onChange(list) }
      catch (e) { toast(e instanceof ApiError ? e.message : 'Upload failed', 'err') }
    }
    setBusy(false)
    if (input.current) input.current.value = ''
  }
  const setMain = async (id: number) => {
    try { onChange(await api.patch<ProductImage[]>(`/admin/products/${productId}/images/${id}/main`)) } catch { toast('Could not change main image', 'err') }
  }
  const remove = async (img: ProductImage) => {
    try {
      await api.del(`/admin/products/${productId}/images/${img.id}`)
      const rest = images.filter((i) => i.id !== img.id)
      onChange(img.is_main && rest.length ? rest.map((i, n) => ({ ...i, is_main: n === 0 })) : rest) // server promotes the next image too
    } catch { toast('Could not remove image', 'err') }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className={`rounded-2xl bg-ice p-2 ${img.is_main ? 'ring-2 ring-gold' : ''}`}>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-200">
              <img src={img.url} alt={img.alt} loading="lazy" className="h-full w-full object-cover" />
              {img.is_main && <span className="absolute left-2 top-2 rounded-full bg-navy px-2.5 py-1 text-[0.65rem] font-bold text-gold">Main</span>}
            </div>
            <div className="mt-1 flex justify-between">
              <button type="button" className="inline-flex min-h-[2.5rem] items-center gap-1 rounded-full px-2 text-xs font-bold text-gold-deep hover:bg-white disabled:opacity-40" disabled={img.is_main} onClick={() => setMain(img.id)}><Star className="h-4 w-4" /> Main</button>
              <button type="button" aria-label="Remove image" className="grid h-10 w-10 place-items-center rounded-full text-red-700 hover:bg-white" onClick={() => remove(img)}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => input.current?.click()} disabled={busy || images.length >= MAX_IMAGES}
          className="grid min-h-[9rem] place-items-center rounded-2xl border-2 border-dashed border-slate-400 bg-slate-50 text-sm font-bold text-slate-700 transition hover:bg-white disabled:opacity-50">
          <span className="flex flex-col items-center gap-1"><ImagePlus className="h-6 w-6" />{busy ? 'Uploading…' : 'Upload images'}</span>
        </button>
      </div>
      <input ref={input} type="file" accept={ACCEPTED.join(',')} multiple hidden onChange={(e) => upload(e.target.files)} />
      <p className="hint">JPG, PNG or WebP, up to {MAX_MB} MB each, up to {MAX_IMAGES} images. They are resized and optimised automatically.</p>
    </div>
  )
}

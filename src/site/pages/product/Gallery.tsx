import { useState } from 'react'
import type { ProductImage } from '../../types'

export function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0)
  if (images.length === 0) return <div className="grid aspect-square place-items-center rounded-[2rem] bg-white text-sm font-semibold text-mute shadow-card">No photo yet</div>
  const main = images[Math.min(active, images.length - 1)]
  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse">
      <div className="aspect-square flex-1 overflow-hidden rounded-[2rem] bg-white shadow-card"><img src={main.url} alt={main.alt || name} className="h-full w-full object-cover" /></div>
      {images.length > 1 && (
        <div className="flex gap-2 sm:flex-col" role="group" aria-label="Product photos">
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} aria-pressed={i === active}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white ${i === active ? 'ring-2 ring-gold ring-offset-2' : 'opacity-80 hover:opacity-100'}`}>
              <img src={img.url} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

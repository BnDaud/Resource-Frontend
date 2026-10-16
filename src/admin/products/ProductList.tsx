import { Link } from 'react-router-dom'
import type { Product } from '../../api/types'
import { Badge } from '../../components/ui'
import { AVAILABILITY } from '../../lib/status'

interface Props { items: Product[]; showRestore: boolean; onRestore: (p: Product) => void }

function Thumb({ src, small }: { src: string | null; small?: boolean }) {
  const size = small ? 'h-10 w-10' : 'h-16 w-16'
  return src
    ? <img src={src} alt="" loading="lazy" className={`${size} shrink-0 rounded-xl bg-slate-100 object-cover`} />
    : <div className={`${size} grid shrink-0 place-items-center rounded-xl bg-slate-100 text-[0.6rem] font-bold text-mute`}>No image</div>
}

function Flags({ p }: { p: Product }) {
  return <>{p.is_featured && <Badge tone="navy">Featured</Badge>}{p.is_new && <Badge tone="blue">New</Badge>}</>
}

/** Cards on phones, a table from `md` up. */
export default function ProductList({ items, showRestore, onRestore }: Props) {
  const restore = (p: Product) => showRestore && <button className="btn-ghost btn-sm" onClick={() => onRestore(p)}>Restore</button>
  return (
    <>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 md:hidden">
        {items.map((p) => (
          <li key={p.id} className="card flex gap-3 !p-3">
            <Thumb src={p.main_image} />
            <div className="min-w-0 flex-1">
              <Link to={`/admin/products/${p.id}`} className="block truncate font-bold">{p.name}</Link>
              <div className="text-xs text-mute">{p.sku} · {p.category_name}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2"><Badge tone={AVAILABILITY[p.availability].tone}>{AVAILABILITY[p.availability].label}</Badge><Flags p={p} /></div>
              <div className="mt-2 flex gap-2"><Link to={`/admin/products/${p.id}`} className="btn-ghost btn-sm">Edit</Link>{restore(p)}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="card hidden overflow-x-auto !p-0 md:block">
        <table className="w-full min-w-[45rem] text-left text-sm">
          <thead className="bg-slate-50 text-xs text-mute">
            <tr><th className="p-3 font-bold">Product</th><th className="font-bold">SKU</th><th className="font-bold">Category</th><th className="font-bold">Availability</th><th className="font-bold">Flags</th><th className="p-3 text-right font-bold">Actions</th></tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-slate-100 hover:bg-ice/60">
                <td className="p-2.5"><div className="flex items-center gap-3"><Thumb src={p.main_image} small /><Link to={`/admin/products/${p.id}`} className="font-bold hover:underline">{p.name}</Link></div></td>
                <td className="text-mute">{p.sku}</td><td>{p.category_name}</td>
                <td><Badge tone={AVAILABILITY[p.availability].tone}>{AVAILABILITY[p.availability].label}</Badge></td>
                <td><div className="flex gap-1"><Flags p={p} /></div></td>
                <td className="p-2.5 text-right"><Link to={`/admin/products/${p.id}`} className="btn-ghost btn-sm">Edit</Link>{showRestore && <span className="ml-2">{restore(p)}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

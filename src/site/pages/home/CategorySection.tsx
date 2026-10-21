import { Link } from 'react-router-dom'
import { SECTIONS, type Section } from '../../../lib/sections'
import { Container, SectionHeading } from '../../components/Container'
import type { Category } from '../../types'

const IMAGE: Record<Section, string> = { boards: '/site/boards.jpg', accessories: '/site/hob.jpg' }

/** The two divisions of the shop, each with its categories. */
export function CategorySection({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null
  return (
    <section className="pt-10">
      <Container>
        <SectionHeading eyebrow="Catalogue" title="Shop by division" action={<Link to="/products" className="text-sm font-bold text-gold-deep">View all products →</Link>} />
        <div className="grid gap-5 lg:grid-cols-2">
          {SECTIONS.map((s) => (
            <div key={s.id} className="overflow-hidden rounded-3xl bg-white shadow-card">
              <Link to={`/products?section=${s.id}`} className="group relative block h-52 overflow-hidden bg-ice-deep">
                <img src={IMAGE[s.id]} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white px-5 py-2 text-base font-bold shadow-card">{s.label}</span>
              </Link>
              <div className="p-5">
                <p className="text-sm text-slate-600">{s.blurb}</p>
                <ul className="mt-4 flex flex-wrap gap-2">{categories.filter((c) => c.section === s.id).map((c) => (
                  <li key={c.id}><Link to={`/products?section=${s.id}&category=${c.slug}`} className="btn-ghost btn-sm">{c.name}</Link></li>
                ))}</ul>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

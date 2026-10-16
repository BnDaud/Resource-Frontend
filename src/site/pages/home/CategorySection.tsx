import { Link } from 'react-router-dom'
import { Container, SectionHeading } from '../../components/Container'
import type { Category } from '../../types'

const FALLBACK = ['/site/plywood-stack.jpg', '/site/range-hood.jpg', '/site/gas-hob.jpg', '/site/handles.jpg', '/site/oven-microwave.jpg', '/site/veneer-rolls.jpg', '/site/drawer-organiser.jpg']
const SPAN = ['sm:col-span-2 sm:row-span-2', '', '', '', '', 'sm:col-span-2', 'sm:col-span-2']

/** Chips for every category, then image tiles for the first seven (real product photos when available). */
export function CategorySection({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null
  return (
    <>
      <section className="py-4">
        <Container><ul className="flex flex-wrap gap-2">{categories.map((c) => (
          <li key={c.id}><Link to={`/products?category=${c.slug}`} className="btn-ghost btn-sm">{c.name}</Link></li>
        ))}</ul></Container>
      </section>
      <section className="pt-10">
        <Container>
          <SectionHeading eyebrow="Catalogue" title="Shop by category" action={<Link to="/products" className="text-sm font-bold text-gold-deep">View all products →</Link>} />
          <ul className="grid auto-rows-[11rem] gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 7).map((c, i) => (
              <li key={c.id} className={SPAN[i]}>
                <Link to={`/products?category=${c.slug}`} className="group relative block h-full overflow-hidden rounded-3xl bg-ice-deep shadow-card">
                  <img src={c.cover_image ?? FALLBACK[i]} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-card">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}

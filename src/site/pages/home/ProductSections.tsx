import { Link } from 'react-router-dom'
import { api } from '../../../api/client'
import { EmptyState } from '../../../components/ui'
import { useFetch } from '../../../lib/useFetch'
import { Container, SectionHeading } from '../../components/Container'
import { ProductGrid, ProductGridSkeleton } from '../../components/ProductCard'
import type { ProductPage } from '../../types'

/** Featured products are chosen in the CMS. With none chosen we say so instead of showing made-up items. */
export function FeaturedProducts() {
  const { data, loading } = useFetch(() => api.get<ProductPage>('/products', { featured: true, page_size: 4 }), [])
  return (
    <section className="pt-16">
      <Container>
        <SectionHeading eyebrow="Featured" title="Featured products" />
        {loading && !data ? <ProductGridSkeleton count={4} />
          : data && data.items.length > 0 ? <ProductGrid products={data.items} />
          : <EmptyState title="Featured products will appear here">Browse the full <Link to="/products" className="font-bold text-gold-deep">catalogue</Link> in the meantime.</EmptyState>}
      </Container>
    </section>
  )
}

/** Hidden entirely when nothing is marked as a new arrival. */
export function NewArrivals() {
  const { data } = useFetch(() => api.get<ProductPage>('/products', { new: true, sort: 'newest', page_size: 4 }), [])
  if (!data || data.items.length === 0) return null
  return (
    <section className="pt-16">
      <Container>
        <SectionHeading eyebrow="Just in" title="New arrivals" action={<Link to="/products?sort=newest" className="text-sm font-bold text-gold-deep">See newest →</Link>} />
        <ProductGrid products={data.items} />
      </Container>
    </section>
  )
}

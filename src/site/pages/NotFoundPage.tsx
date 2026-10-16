import { Link } from 'react-router-dom'
import { Container } from '../components/Container'
import { usePageMeta } from '../lib/usePageMeta'

export default function NotFoundPage() {
  usePageMeta({ title: 'Page not found' })
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-gold-deep">404</p>
      <h1 className="mt-2 text-3xl font-bold">We could not find that page</h1>
      <p className="mt-2 text-mute">It may have moved, or the product is no longer listed.</p>
      <div className="mt-6 flex justify-center gap-3"><Link to="/" className="btn-gold">Go home</Link><Link to="/products" className="btn-ghost">Browse products</Link></div>
    </Container>
  )
}

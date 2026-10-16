import { api } from '../../../api/client'
import { useFetch } from '../../../lib/useFetch'
import { useSettings } from '../../context/SettingsContext'
import { usePageMeta } from '../../lib/usePageMeta'
import type { Category, Testimonial } from '../../types'
import { Hero } from './Hero'
import { CategorySection } from './CategorySection'
import { CtaBand, HowItWorks, Intro, Location, Testimonials } from './InfoSections'
import { FeaturedProducts, NewArrivals } from './ProductSections'

export default function HomePage() {
  const { settings } = useSettings()
  const categories = useFetch(() => api.get<Category[]>('/categories'), [])
  const testimonials = useFetch(() => api.get<Testimonial[]>('/testimonials'), [])
  usePageMeta({
    title: 'Resources Components',
    description: settings.seo_description || 'Quality components for kitchens, furniture and building projects. Browse the catalogue and request a wholesale or retail quotation.',
    image: '/site/glass-partition.jpg',
  })
  return (
    <>
      <Hero />
      <CategorySection categories={categories.data ?? []} />
      <FeaturedProducts />
      <NewArrivals />
      <Intro />
      <HowItWorks />
      <Testimonials items={testimonials.data ?? []} />
      <CtaBand />
      <Location />
    </>
  )
}

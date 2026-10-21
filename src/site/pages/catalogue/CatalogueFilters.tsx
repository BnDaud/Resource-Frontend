import { Search } from 'lucide-react'
import { SECTIONS, type Section } from '../../../lib/sections'
import type { Category } from '../../types'

export interface Filters { q: string; section: Section; category: string; availability: string; sort: string }

const AVAILABILITY = [['', 'Any availability'], ['available', 'Available'], ['on_request', 'On request'], ['out_of_stock', 'Out of stock']]
const SORTS = [['relevance', 'Relevance'], ['newest', 'Newest'], ['alpha', 'A to Z']]

export function CatalogueFilters({ filters, categories, onChange }: { filters: Filters; categories: Category[]; onChange: (patch: Partial<Filters>) => void }) {
  const inSection = categories.filter((c) => c.section === filters.section)
  return (
    <div className="space-y-4">
      <div role="group" aria-label="Division" className="inline-flex rounded-full bg-white p-1 shadow-card ring-1 ring-line">
        {SECTIONS.map((s) => (
          <button key={s.id} aria-pressed={filters.section === s.id} onClick={() => onChange({ section: s.id, category: '' })}
            className={`rounded-full px-6 py-2.5 text-sm font-bold transition ${filters.section === s.id ? 'bg-navy text-white shadow-btn' : 'text-slate-700 hover:text-ink'}`}>{s.label}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <form role="search" className="relative min-w-[16rem] flex-1" onSubmit={(e) => e.preventDefault()}>
          <label className="sr-only" htmlFor="catalogue-search">Search products</label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
          <input id="catalogue-search" value={filters.q} onChange={(e) => onChange({ q: e.target.value })} placeholder="Search by name, SKU or description" className="input rounded-full pl-11" />
        </form>
        <select aria-label="Availability" className="input !w-auto rounded-full" value={filters.availability} onChange={(e) => onChange({ availability: e.target.value })}>
          {AVAILABILITY.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select aria-label="Sort by" className="input !w-auto rounded-full" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })}>
          {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Categories">
        {[{ slug: '', name: `All ${SECTIONS.find((s) => s.id === filters.section)?.label.toLowerCase()}` }, ...inSection].map((c) => {
          const on = filters.category === c.slug
          return <button key={c.slug} aria-pressed={on} onClick={() => onChange({ category: c.slug })} className={`btn btn-sm ${on ? 'bg-navy text-white shadow-btn' : 'bg-white text-ink ring-1 ring-inset ring-line hover:ring-navy'}`}>{c.name}</button>
        })}
      </div>
    </div>
  )
}

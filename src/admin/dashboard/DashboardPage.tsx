import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import type { Dashboard } from '../../api/types'
import { Badge, EmptyState, ErrorNote, PageHeader, Spinner } from '../../components/ui'
import { dateTime } from '../../lib/format'
import { ENQUIRY_STATUS, QUOTE_STATUS } from '../../lib/status'
import { useFetch } from '../../lib/useFetch'

type Tile = { label: string; value: number; to: string; tone?: 'navy' | 'gold' }

const toneClass = (t?: Tile['tone']) => t === 'navy' ? 'bg-navy text-white' : t === 'gold' ? 'bg-gold text-ink' : 'bg-white'
const subClass = (t?: Tile['tone']) => t === 'navy' ? 'text-slate-300' : t === 'gold' ? 'text-ink/70' : 'text-mute'

export default function DashboardPage() {
  const { data, error, loading, reload } = useFetch(() => api.get<Dashboard>('/admin/dashboard'), [])
  if (loading && !data) return <Spinner />
  if (error || !data) return <ErrorNote message={error ?? 'Could not load'} onRetry={reload} />

  const tiles: Tile[] = [
    { label: 'Products', value: data.total_products, to: '/admin/products' },
    { label: 'Categories', value: data.total_categories, to: '/admin/categories' },
    { label: 'New enquiries', value: data.new_enquiries, to: '/admin/quotes?tab=enquiries', tone: 'navy' },
    { label: 'Outstanding quotes', value: data.outstanding_quotes, to: '/admin/quotes', tone: 'gold' },
    { label: 'Out of stock', value: data.out_of_stock, to: '/admin/products' },
    { label: 'Published testimonials', value: data.published_testimonials, to: '/admin/testimonials' },
  ]

  return (
    <>
      <PageHeader title="Dashboard" actions={<Link to="/admin/products/new" className="btn-gold">+ New product</Link>} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to} className={`rounded-3xl p-4 shadow-card transition hover:-translate-y-0.5 ${toneClass(t.tone)}`}>
            <div className={`text-xs font-semibold ${subClass(t.tone)}`}>{t.label}</div>
            <div className="mt-1 font-display text-3xl font-bold">{t.value}</div>
          </Link>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-5">
        <section className="card lg:col-span-3">
          <div className="mb-2 flex items-center justify-between"><h2 className="text-base font-bold">Recent quote requests</h2><Link to="/admin/quotes" className="text-xs font-bold text-gold-deep">View all →</Link></div>
          {data.recent_quotes.length === 0 ? <EmptyState title="No quote requests yet" /> : (
            <ul className="divide-y divide-slate-100">
              {data.recent_quotes.map((q) => (
                <li key={q.id}>
                  <Link to={`/admin/quotes?id=${q.id}`} className="flex flex-wrap items-center justify-between gap-2 py-3 hover:bg-ice/60">
                    <div><div className="font-bold">{q.reference}</div><div className="text-sm text-mute">{q.full_name} · {q.customer_type} · {q.item_count} item{q.item_count === 1 ? '' : 's'}</div></div>
                    <Badge tone={QUOTE_STATUS[q.status].tone}>{QUOTE_STATUS[q.status].label}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card lg:col-span-2">
          <div className="mb-2 flex items-center justify-between"><h2 className="text-base font-bold">Latest enquiries</h2><Link to="/admin/quotes?tab=enquiries" className="text-xs font-bold text-gold-deep">View all →</Link></div>
          {data.recent_enquiries.length === 0 ? <EmptyState title="No enquiries yet" /> : (
            <ul className="divide-y divide-slate-100">
              {data.recent_enquiries.map((e) => (
                <li key={e.id}>
                  <Link to={`/admin/quotes?tab=enquiries&id=${e.id}`} className="block py-3 text-sm hover:bg-ice/60">
                    <div className="flex items-center justify-between gap-2"><span className="font-bold">{e.subject}</span><Badge tone={ENQUIRY_STATUS[e.status].tone}>{ENQUIRY_STATUS[e.status].label}</Badge></div>
                    <div className="text-mute">{e.name} · {dateTime(e.created_at)}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}

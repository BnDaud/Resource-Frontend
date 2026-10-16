import { PageHeader } from '../../components/ui'
import EnquiriesPane from './EnquiriesPane'
import QuotesPane from './QuotesPane'
import { useSelection, type Tab } from './useSelection'

const TABS: { id: Tab; label: string }[] = [
  { id: 'quotes', label: 'Quotes' },
  { id: 'enquiries', label: 'General enquiries' },
]

/** Quote requests and general enquiries share one screen; the tab switches between them. */
export default function InboxPage() {
  const { tab, setTab } = useSelection()
  return (
    <>
      <PageHeader
        title="Quote requests"
        actions={
          <div role="tablist" aria-label="Inbox" className="flex rounded-full bg-white p-1 ring-1 ring-inset ring-line">
            {TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                className={`min-h-[2.25rem] rounded-full px-4 text-sm font-bold transition ${tab === t.id ? 'bg-navy text-white' : 'text-slate-700 hover:bg-ice'}`}>
                {t.label}
              </button>
            ))}
          </div>
        }
      />
      {tab === 'quotes' ? <QuotesPane /> : <EnquiriesPane />}
    </>
  )
}

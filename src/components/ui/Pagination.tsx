import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null
  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-center gap-3">
      <button className="btn-ghost btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
      <span className="text-sm font-semibold">Page {page} of {pages}</span>
      <button className="btn-ghost btn-sm" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
    </nav>
  )
}

import { AlertCircle } from 'lucide-react'

export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">
      <AlertCircle className="h-5 w-5 shrink-0" aria-hidden /> <span className="flex-1">{message}</span>
      {onRetry && <button className="btn-ghost btn-sm" onClick={onRetry}>Try again</button>}
    </div>
  )
}

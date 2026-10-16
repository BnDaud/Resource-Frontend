import { X } from 'lucide-react'
import { useState } from 'react'

/** Add values with Enter or comma. Used for sizes and colours. */
export function TagInput({ id, value, onChange, placeholder }: { id: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [text, setText] = useState('')
  const add = () => {
    const t = text.trim()
    if (t && !value.includes(t) && value.length < 50) onChange([...value, t])
    setText('')
  }
  return (
    <div className="rounded-xl bg-ice p-2 ring-1 ring-inset ring-line focus-within:bg-white focus-within:ring-2 focus-within:ring-navy">
      <div className="flex flex-wrap gap-1.5">
        {value.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-white py-1 pl-3 pr-1 text-sm font-semibold ring-1 ring-line">
            {t}
            <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((x) => x !== t))} className="grid h-6 w-6 place-items-center rounded-full hover:bg-slate-100"><X className="h-3.5 w-3.5" /></button>
          </span>
        ))}
        <input id={id} value={text} placeholder={value.length ? '' : placeholder} className="min-h-[2.25rem] min-w-[8ch] flex-1 bg-transparent px-2 text-sm outline-none"
          onChange={(e) => setText(e.target.value)} onBlur={add}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } else if (e.key === 'Backspace' && !text && value.length) onChange(value.slice(0, -1)) }} />
      </div>
    </div>
  )
}

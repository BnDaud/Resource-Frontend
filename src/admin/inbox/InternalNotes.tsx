/** Navy "staff only" notes card, shared by quote and enquiry panels. */
export function InternalNotes({ value, onChange, onSave, saving, dirty, label }: { value: string; onChange: (v: string) => void; onSave: () => void; saving: boolean; dirty: boolean; label: string }) {
  return (
    <section className="rounded-3xl bg-navy p-5 text-white shadow-card">
      <h3 className="text-base font-bold">Internal notes</h3>
      <p className="mb-3 mt-1 text-xs text-slate-300">Staff only. Stored encrypted. Never shown to the customer.</p>
      <label htmlFor="internal-notes" className="sr-only">Internal notes</label>
      <textarea id="internal-notes" rows={3} className="input !bg-white py-3 text-ink" placeholder="Add a note" value={value} onChange={(e) => onChange(e.target.value)} />
      <button className="btn-gold mt-3" disabled={!dirty || saving} onClick={onSave}>{saving ? 'Saving…' : label}</button>
    </section>
  )
}

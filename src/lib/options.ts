/** A choice such as Matte, Red or RAL 3020 Traffic red. */
export interface Option { id: number; label: string; code: string | null; color: string | null; image_url: string | null }

/** An option with more choices than this is picked from a searchable grid instead of a row of buttons. */
export const MANY = 12

export const optionName = (o: { label: string; code: string | null }) => (o.code ? `${o.code} · ${o.label}` : o.label)

/** "RAL 3020, Traffic red, #cc0605" lines (comma or tab separated) into options: code and name are optional, the colour is a #hex. */
export function parseOptionList(text: string): { code: string | null; label: string; color: string | null }[] {
  const out = []
  for (const line of text.split(/\r?\n/)) {
    const parts = line.split(/\t|,/).map((p) => p.trim()).filter(Boolean)
    if (parts.length === 0) continue
    const color = parts.find((p) => /^#[0-9a-fA-F]{6}$/.test(p))?.toLowerCase() ?? null
    const rest = parts.filter((p) => p.toLowerCase() !== color)
    if (rest.length === 0) continue
    const [first, second] = rest
    out.push(rest.length > 1 ? { code: first, label: second, color } : { code: null, label: first, color })
  }
  return out
}

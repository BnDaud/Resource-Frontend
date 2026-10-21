/** A small coloured dot shown beside a colour option. Renders nothing for options without a swatch. */
export function Swatch({ color }: { color: string | null }) {
  if (!color) return null
  return <span aria-hidden className="inline-block h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-black/25" style={{ background: color }} />
}

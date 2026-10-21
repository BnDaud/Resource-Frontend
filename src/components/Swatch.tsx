/** A coloured dot, or the photo of the colour or decor when there is one. Renders nothing for options without either. */
export function Swatch({ color, image }: { color: string | null; image?: string | null }) {
  if (image) return <img src={image} alt="" loading="lazy" className="h-4 w-4 shrink-0 rounded-full object-cover ring-1 ring-black/25" />
  if (!color) return null
  return <span aria-hidden className="inline-block h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-black/25" style={{ background: color }} />
}

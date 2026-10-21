/** The two divisions of the shop. Each category belongs to one of them (set in the CMS). */
export type Section = 'boards' | 'accessories'

export const SECTIONS: { id: Section; label: string; blurb: string }[] = [
  { id: 'boards', label: 'Boards', blurb: 'HDF, MDF and blockboard in matte and glossy finishes.' },
  { id: 'accessories', label: 'Accessories', blurb: 'Microwaves, heat extractors, burners and kitchen and furniture accessories.' },
]

export const isSection = (v: string | null): v is Section => SECTIONS.some((s) => s.id === v)

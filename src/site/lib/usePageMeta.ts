import { useEffect } from 'react'

interface Meta { title: string; description?: string; image?: string; jsonLd?: object }

const DEFAULT_TITLE = 'Resources Components'

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.setAttribute('content', value)
}

/** Sets the page title, description and Open Graph tags (and optional JSON-LD) for the current page. */
export function usePageMeta({ title, description, image, jsonLd }: Meta) {
  useEffect(() => {
    const full = title === DEFAULT_TITLE ? title : `${title} | ${DEFAULT_TITLE}`
    document.title = full
    setMeta('property', 'og:title', full)
    setMeta('property', 'og:type', jsonLd ? 'product' : 'website')
    setMeta('property', 'og:url', window.location.href)
    if (description) { setMeta('name', 'description', description); setMeta('property', 'og:description', description) }
    if (image) setMeta('property', 'og:image', image)
    let script: HTMLScriptElement | null = null
    if (jsonLd) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
    return () => { script?.remove() }
  }, [title, description, image, jsonLd])
}

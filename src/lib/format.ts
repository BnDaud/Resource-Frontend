export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

/** WhatsApp wants digits only, international format. Nigerian local numbers (0801…) become 234801…. */
export function waDigits(phone: string): string {
  const d = phone.replace(/\D/g, '')
  return d.startsWith('0') ? `234${d.slice(1)}` : d
}

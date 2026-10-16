import { readJson, writeJson } from './storage'

export interface SavedRequest { reference: string; kind: 'quote' | 'enquiry'; phone: string; savedAt: string }
const KEY = 'rc.requests'
const MAX = 10

/** References of requests sent from this device, so the Track page can offer them again. Stored only in this browser. */
export const getSavedRequests = (): SavedRequest[] => readJson<SavedRequest[]>(KEY, [])

export function saveRequest(r: Omit<SavedRequest, 'savedAt'>): void {
  const rest = getSavedRequests().filter((x) => x.reference !== r.reference)
  writeJson(KEY, [{ ...r, savedAt: new Date().toISOString() }, ...rest].slice(0, MAX))
}

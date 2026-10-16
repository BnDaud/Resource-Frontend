const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(public status: number, message: string, public fields?: Record<string, string>) {
    super(message)
  }
}

/** Turn FastAPI's error body into one readable message plus per-field messages. */
function parseError(status: number, body: unknown): ApiError {
  const detail = (body as { detail?: unknown })?.detail
  if (typeof detail === 'string') return new ApiError(status, detail)
  if (Array.isArray(detail)) {
    const fields: Record<string, string> = {}
    for (const d of detail as { loc: (string | number)[]; msg: string }[]) {
      const key = d.loc.filter((p) => p !== 'body').join('.')
      fields[key] = d.msg.replace(/^Value error, /, '')
    }
    return new ApiError(status, Object.values(fields)[0] ?? 'Please check the form', fields)
  }
  return new ApiError(status, status >= 500 ? 'Something went wrong. Please try again.' : 'Request failed')
}

let onUnauthorized: () => void = () => {}
export const setUnauthorizedHandler = (fn: () => void) => { onUnauthorized = fn }

async function request<T>(method: string, path: string, body?: unknown, form?: FormData): Promise<T> {
  const headers: Record<string, string> = { 'X-Requested-With': 'rc-cms' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  let res: Response
  try {
    res = await fetch(`${BASE}/api/v1${path}`, {
      method, headers, credentials: 'include',
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check your connection and try again.')
  }
  if (res.status === 204) return undefined as T
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    if (res.status === 401 && !path.startsWith('/admin/auth/login')) onUnauthorized()
    throw parseError(res.status, data)
  }
  return data as T
}

export const api = {
  get: <T>(p: string, params?: Record<string, string | number | boolean | undefined | null>) => {
    const qs = new URLSearchParams()
    Object.entries(params ?? {}).forEach(([k, v]) => v !== undefined && v !== null && v !== '' && qs.set(k, String(v)))
    const s = qs.toString()
    return request<T>('GET', s ? `${p}?${s}` : p)
  },
  post: <T>(p: string, b?: unknown) => request<T>('POST', p, b ?? {}),
  put: <T>(p: string, b: unknown) => request<T>('PUT', p, b),
  patch: <T>(p: string, b?: unknown) => request<T>('PATCH', p, b ?? {}),
  del: <T = void>(p: string) => request<T>('DELETE', p),
  upload: <T>(p: string, file: File) => {
    const f = new FormData()
    f.append('file', file)
    return request<T>('POST', p, undefined, f)
  },
}

import type {
  Invoice,
  InvoiceListResponse,
  InvoiceFormValues,
  StatsData,
} from '@/types/invoice'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

// ── Generic fetch helper ──────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.detail ?? body?.error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

// ── API client ────────────────────────────────────────────────────
export const apiClient = {
  invoices: {
    // GET /api/invoices/?search=&status=&page=
    list(params: { search?: string; status?: string; page?: number }) {
      const q = new URLSearchParams()
      if (params.search) q.set('search', params.search)
      if (params.status && params.status !== 'all') q.set('status', params.status)
      if (params.page && params.page > 1) q.set('page', String(params.page))
      return apiFetch<InvoiceListResponse>(`/api/invoices/?${q}`)
    },

    // GET /api/invoices/:id/
    get(id: string) {
      return apiFetch<Invoice>(`/api/invoices/${id}/`)
    },

    // PATCH /api/invoices/:id/
    update(id: string, data: Partial<InvoiceFormValues>) {
      return apiFetch<Invoice>(`/api/invoices/${id}/`, {
        method: 'PATCH',
        body:   JSON.stringify(data),
      })
    },

    // DELETE /api/invoices/:id/
    delete(id: string) {
      return apiFetch<void>(`/api/invoices/${id}/`, { method: 'DELETE' })
    },

    // GET /api/invoices/stats/
    stats() {
      return apiFetch<StatsData>('/api/invoices/stats/')
    },
  },
}
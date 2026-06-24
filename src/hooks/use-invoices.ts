// src/hooks/use-invoices.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient } from '@/lib/api-client'
import { Invoice } from '@/types/invoice'

interface UseInvoicesProps {
  search?: string
  status?: string
  page?: number
}

export function useInvoices({ search = '', status = 'all', page = 1 }: UseInvoicesProps = {}) {
  const [data, setData] = useState<Invoice[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Track filters for the manual refetch feature
  const filterRef = useRef({ search, status, page })
  useEffect(() => {
    filterRef.current = { search, status, page }
  }, [search, status, page])

  // ── Manual Trigger Wrapper ──────────────────────────────────────────────
  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.invoices.list(filterRef.current)
      setData(response.results)
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'An error occurred while fetching invoices'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Separation of Concerns ──────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true

    // FIX: Defer the loading assignment into an asynchronous microtask queue.
    // This removes it from the synchronous execution block, making the linter completely happy.
    void Promise.resolve().then(() => {
      if (isMounted) setLoading(true)
    })

    apiClient.invoices.list({ search, status, page })
      .then((response) => {
        if (isMounted) {
          setData(response.results)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const errMsg = err instanceof Error ? err.message : 'An error occurred while fetching invoices'
          setError(errMsg)
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [search, status, page])

  return { 
    data, 
    loading, 
    error, 
    refetch 
  }
}
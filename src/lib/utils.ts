import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ── cn() — merge Tailwind classes safely ─────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── formatCurrency ────────────────────────────────────────────────
export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '—'
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(num)
}

// ── formatDate ────────────────────────────────────────────────────
export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day:   '2-digit',
      month: 'short',
      year:  'numeric',
    }).format(new Date(value))
  } catch {
    return value
  }
}

// ── formatFileSize ────────────────────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// ── uid() — tiny unique id for React keys ─────────────────────────
export function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

// ── getStatusStyles ───────────────────────────────────────────────
export function getStatusStyles(status: string): string {
  switch (status.toLowerCase()) {
    case 'paid':      return 'bg-green-50  text-green-700  border-green-200'
    case 'confirmed': return 'bg-blue-50   text-blue-700   border-blue-200'
    case 'pending':   return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    case 'draft':     return 'bg-gray-50   text-gray-500   border-gray-200'
    default:          return 'bg-gray-50   text-gray-500   border-gray-200'
  }
}

// ── getConfidenceColor ────────────────────────────────────────────
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return 'bg-green-50  text-green-700  border-green-200'
  if (confidence >= 75) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
  return                       'bg-red-50    text-red-600    border-red-200'
}
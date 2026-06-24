'use client'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from './spinner'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'destructive'
  size?:    'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, disabled, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      default:     'bg-gray-900 text-white hover:bg-gray-700',
      ghost:       'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
      outline:     'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
    }

    const sizes = {
      sm: 'h-8  px-3 text-xs',
      md: 'h-9  px-4 text-sm',
      lg: 'h-10 px-5 text-sm',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Spinner className="w-3.5 h-3.5" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
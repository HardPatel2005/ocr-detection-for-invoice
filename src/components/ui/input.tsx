import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <input
        ref={ref}
        className={cn(
          'h-9 px-3 text-sm rounded-lg border bg-white text-gray-900 outline-none transition-colors',
          'placeholder:text-gray-400',
          'focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-gray-200',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
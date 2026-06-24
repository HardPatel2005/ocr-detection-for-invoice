'use client'
import { cn } from '@/lib/utils'

interface Breadcrumb {
  label:  string
  href?:  string
}

interface TopbarProps {
  title:        string
  breadcrumbs?: Breadcrumb[]
  actions?:     React.ReactNode
  className?:   string
}

export function Topbar({ title, breadcrumbs = [], actions, className }: TopbarProps) {
  return (
    <header className={cn(
      'shrink-0 flex items-center justify-between',
      'px-6 h-14 border-b border-gray-100 bg-white',
      className,
    )}>
      {/* Left: breadcrumbs + title */}
      <div className="flex flex-col justify-center">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 mb-0.5">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-300 text-xs">/</span>}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-xs text-gray-400">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
      </div>

      {/* Right: action buttons */}
      {actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </header>
  )
}
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, Upload, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/invoices', label: 'Invoices',  icon: LayoutDashboard },
  { href: '/upload',   label: 'Upload PDF', icon: Upload           },
]

export function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-gray-100 bg-white h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-gray-100">
        <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
          <FileText className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-900">InvoiceOCR</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-gray-900 text-white font-medium'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-300">Invoice OCR System</p>
      </div>
    </aside>
  )
}
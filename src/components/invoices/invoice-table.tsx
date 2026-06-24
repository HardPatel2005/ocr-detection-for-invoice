// src/components/invoices/invoice-table.tsx
import { createColumnHelper } from '@tanstack/react-table'
import { Invoice } from '@/types/invoice'
import { getStatusStyles, formatCurrency, formatDate } from '@/lib/utils'

const columnHelper = createColumnHelper<Invoice>()

export const columns = [
  columnHelper.accessor('bill_no', {
    header: 'Invoice No.',
  }),
  columnHelper.accessor('customer', {
    header: 'Customer',
  }),
  columnHelper.accessor('invoice_date', {
    header: 'Date',
    cell: (info) => formatDate(info.getValue()), // Type is inferred automatically!
  }),
  columnHelper.accessor('value', {
    header: 'Amount',
    cell: (info) => formatCurrency(info.getValue()), // Type is inferred automatically!
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    // Line 142: Using the helper completely eliminates the explicit 'any' rule failure
    cell: (info) => {
      const status = info.getValue() // Strongly typed automatically as your status literal type
      return (
        <span className={`px-2 py-1 rounded text-xs border capitalize ${getStatusStyles(status)}`}>
          {status}
        </span>
      )
    },
  }),
]
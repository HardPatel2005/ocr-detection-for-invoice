// src/components/billing/ocr-form.tsx
'use client'

import { useForm, useWatch } from 'react-hook-form'
import { InvoiceFormValues, Invoice } from '@/types/invoice'

interface OcrFormProps {
  invoice?: Invoice | null
}

export function OcrForm({ invoice }: OcrFormProps) {
  const { register, handleSubmit, control } = useForm<InvoiceFormValues>({
    defaultValues: {
      customer: invoice?.customer ?? "",
      bill_no: invoice?.bill_no ?? "",
      value: invoice?.value ?? "0.00",
      tax: invoice?.tax ?? "0.00",
      invoice_date: invoice?.invoice_date ?? "",
      status: invoice?.status ?? "draft"
    }
  })

  // useWatch tracks fields dynamically for the React Compiler
  const watchValues = useWatch({
    control,
    name: ['value', 'tax'] as const,
  })

  // ── FIX: Extract precise individual index values from the watched array safely ──
const [watchValue = "0", watchTax = "0"] = useWatch({
  control,
  name: ['value', 'tax'],
}) ?? []


  // Compute total safely on render frames
  const liveTotal = (parseFloat(watchValue) || 0) + (parseFloat(watchTax) || 0)

  const onSubmit = (data: InvoiceFormValues) => {
    console.log("Saving form data:", data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">Verify Extracted Data</h3>
      
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Billing Customer</label>
        <input 
          {...register('customer')} 
          className="border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-gray-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Invoice Number (Bill No)</label>
        <input 
          {...register('bill_no')} 
          className="border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-gray-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Amount (Value)</label>
          <input 
            {...register('value')} 
            placeholder="0.00"
            className="border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Tax</label>
          <input 
            {...register('tax')} 
            placeholder="0.00"
            className="border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
      </div>

      <hr className="border-gray-100 my-2" />

      <div className="bg-gray-50 p-3.5 rounded-lg flex justify-between items-center border border-gray-100">
        <span className="text-xs font-medium text-gray-500">Live Computed Total:</span>
        <span className="text-base font-bold text-gray-900">₹{liveTotal.toFixed(2)}</span>
      </div>

      <button 
        type="submit" 
        className="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Confirm & Save Details
      </button>
    </form>
  )
}
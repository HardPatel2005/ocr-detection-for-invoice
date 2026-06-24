// src/components/billing/ocr-form.tsx (Alternative Signature block)
import { useForm, useWatch } from 'react-hook-form'
import { InvoiceFormValues, Invoice } from '@/types/invoice'

// 1. Declare the incoming data schema types interface explicitly
interface OcrFormProps {
  invoice?: Invoice | null
}

export function OcrForm({ invoice }: OcrFormProps) {
  const { register, handleSubmit, control } = useForm<InvoiceFormValues>({
    // 2. Pre-populate your default form tracking values using the incoming backend context!
    defaultValues: {
      customer: invoice?.customer ?? "",
      bill_no: invoice?.bill_no ?? "",
      value: invoice?.value ?? "0.00",
      tax: invoice?.tax ?? "0.00",
      invoice_date: invoice?.invoice_date ?? "",
      status: invoice?.status ?? "draft"
    }
  })
  
  // ... rest of useWatch tracking logic stays exactly the same
}
import { Topbar }   from '@/components/layout/topbar'
import { DropZone } from '@/components/upload/drop-zone'

export default function UploadPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="Upload invoice"
        breadcrumbs={[
          { label: 'Invoices', href: '/invoices' },
          { label: 'Upload PDF' },
        ]}
      />
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center">
        <div className="w-full max-w-xl">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900">Upload a PDF invoice</h2>
            <p className="text-sm text-gray-400 mt-1">
              We&apos;ll extract customer name, bill number, value, and tax automatically using OCR.
            </p>
          </div>
          <DropZone />
        </div>
      </div>
    </div>
  )
}
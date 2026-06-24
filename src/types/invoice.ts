// ── Core invoice model ─────────────────────────────────────────────
export interface Invoice {
  id:           string
  customer:     string
  bill_no:      string
  value:        string
  tax:          string
  total:        string
  invoice_date: string | null
  status:       'draft' | 'pending' | 'confirmed' | 'paid'
  pdf_url:      string | null
  created_at:   string
  updated_at:   string
  ocr_result:   OcrResult | null
}

// ── OCR result from PaddleOCR microservice ─────────────────────────
export interface OcrResult {
  id:            string
  confidence:    number          // overall confidence 0–100
  raw_text:      string
  bounding_boxes: BoundingBox[]
  extracted:     ExtractedFields
  created_at:    string
}

export interface BoundingBox {
  text:       string
  confidence: number
  bbox:       [number, number][]
  field:      string | null     // 'customer' | 'bill_no' | 'value' | 'tax' | null
}

export interface ExtractedFields {
  customer:   string | null
  bill_no:    string | null
  value:      number | null
  tax:        number | null
  confidence: number
}

// ── API response shapes ────────────────────────────────────────────
export interface InvoiceListResponse {
  count:    number
  next:     string | null
  previous: string | null
  results:  Invoice[]
}

export interface StatsData {
  total_invoices: number
  total_value:    number
  total_tax:      number
  pending_review: number
}

export interface UploadResponse {
  invoice_id: string
  cloudinary: string
  extracted:  ExtractedFields
}

// ── Form values ────────────────────────────────────────────────────
export interface InvoiceFormValues {
  customer:     string
  bill_no:      string
  value:        string
  tax:          string
  invoice_date: string
  status:       'draft' | 'pending' | 'confirmed' | 'paid'
}

// ── File queue (upload page) ───────────────────────────────────────
export interface QueuedFile {
  file:     File
  id:       string
  status:   'idle' | 'uploading' | 'done' | 'error'
  progress: number
  error?:   string
}
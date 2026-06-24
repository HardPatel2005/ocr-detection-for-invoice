import { NextRequest, NextResponse } from 'next/server'
import { uploadPdfToCloudinary }     from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    // 1. Parse the uploaded file from multipart/form-data
    const formData = await req.formData()
    const file     = formData.get('file')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer   = Buffer.from(await file.arrayBuffer())
    const filename = file instanceof File ? file.name : 'invoice.pdf'

    // 2. Upload to Cloudinary (server-side — API secret never exposed)
    const { secure_url } = await uploadPdfToCloudinary(buffer, filename)

    // 3. Trigger Django OCR processing with the Cloudinary URL
    const djangoBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
    const ocrRes = await fetch(`${djangoBase}/api/ocr/process/`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ pdf_url: secure_url }),
    })

    if (!ocrRes.ok) {
      const errBody = await ocrRes.json().catch(() => ({})) as { error?: string }
      return NextResponse.json(
        { error: errBody?.error ?? 'OCR processing failed' },
        { status: 502 }
      )
    }

    const result = await ocrRes.json() as {
      invoice_id: string
      extracted:  Record<string, unknown>
    }

    // 4. Return invoice_id so the browser can navigate to /billing/[id]
    return NextResponse.json({
      invoice_id: result.invoice_id,
      cloudinary: secure_url,
      extracted:  result.extracted,
    })
  } catch (err: unknown) {
    console.error('[/api/upload]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
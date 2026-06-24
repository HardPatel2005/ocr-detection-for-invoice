import { v2 as cloudinary } from 'cloudinary'

// Server-side only — never import in client components
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure:     true,
})

export { cloudinary }

// Upload a buffer as a PDF to Cloudinary
export async function uploadPdfToCloudinary(
  buffer: Buffer,
  filename: string,
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder:        'invoice-ocr',
        public_id:     filename.replace(/\.pdf$/i, ''),
        format:        'pdf',
      },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error('Upload failed'))
        resolve({ secure_url: result.secure_url, public_id: result.public_id })
      },
    )
    stream.end(buffer)
  })
}
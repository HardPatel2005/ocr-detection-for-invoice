/**
 * DropZone — drag-and-drop PDF upload component.
 *
 * Responsibilities:
 *  1. Accept PDF files via drag-drop or file picker
 *  2. Show queued files with upload progress bars
 *  3. On "Run OCR & extract" → POST each file to /api/upload
 *  4. On success → redirect to /billing/[invoice_id]
 *
 * Concepts used:
 *  - react-dropzone  : handles drag events + file validation
 *  - FormData        : how the browser sends binary files to an API route
 *  - XMLHttpRequest  : used instead of fetch so we get upload progress events
 *  - uid()           : gives each queued file a stable React key
 */
'use client'
import { useCallback, useState } from 'react'
import { useDropzone }           from 'react-dropzone'
import { useRouter }             from 'next/navigation'
import { CloudUpload, FileType, X, Cpu, FolderOpen } from 'lucide-react'
import { cn, formatFileSize, uid } from '@/lib/utils'
import { Button }                from '@/components/ui/button'
import type { QueuedFile }       from '@/types/invoice'

export function DropZone() {
  const router = useRouter()
  const [queue, setQueue]     = useState<QueuedFile[]>([])
  const [running, setRunning] = useState(false)
  const [globalErr, setErr]   = useState<string | null>(null)

  // ── 1. When files are dropped / selected ────────────────────────
  const onDrop = useCallback((accepted: File[]) => {
    const newFiles: QueuedFile[] = accepted.map(f => ({
      file:     f,
      id:       uid(),
      status:   'idle',
      progress: 0,
    }))
    setQueue(prev => [...prev, ...newFiles])
    setErr(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   { 'application/pdf': ['.pdf'] },
    maxSize:  10 * 1024 * 1024,   // 10 MB
    multiple: true,
    onDropRejected: (files) => {
      setErr(files[0]?.errors[0]?.message ?? 'File rejected')
    },
  })

  // ── 2. Remove one file from the queue ───────────────────────────
  const removeFile = (id: string) =>
    setQueue(prev => prev.filter(f => f.id !== id))

  // ── 3. Upload using XHR so we get progress events ───────────────
  function uploadWithProgress(qf: QueuedFile): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('file', qf.file)

      const xhr = new XMLHttpRequest()

      // Progress: update the specific file's progress in state
      xhr.upload.addEventListener('progress', (e) => {
        if (!e.lengthComputable) return
        const pct = Math.round((e.loaded / e.total) * 100)
        setQueue(prev =>
          prev.map(f => f.id === qf.id ? { ...f, progress: pct, status: 'uploading' } : f)
        )
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText)
          setQueue(prev =>
            prev.map(f => f.id === qf.id ? { ...f, progress: 100, status: 'done' } : f)
          )
          resolve(data.invoice_id)
        } else {
          const err = JSON.parse(xhr.responseText)?.error ?? 'Upload failed'
          setQueue(prev =>
            prev.map(f => f.id === qf.id ? { ...f, status: 'error', error: err } : f)
          )
          reject(new Error(err))
        }
      })

      xhr.addEventListener('error', () => reject(new Error('Network error')))
      xhr.open('POST', '/api/upload')
      xhr.send(formData)
    })
  }

  // ── 4. Run all uploads sequentially then redirect ────────────────
  async function handleRun() {
    if (!queue.length || running) return
    setRunning(true)
    setErr(null)
    let lastId: string | null = null

    for (const qf of queue) {
      if (qf.status === 'done') continue
      try {
        lastId = await uploadWithProgress(qf)
      } catch (err: unknown) {
  const message =
    err instanceof Error
      ? err.message
      : 'Unknown error occurred'

  setErr(message)
  setRunning(false)
  return
}
    }

    if (lastId) router.push(`/billing/${lastId}`)
    setRunning(false)
  }

  const idleCount = queue.filter(f => f.status === 'idle').length

  return (
    <div className="flex flex-col gap-5">

      {/* ── Drop zone area ── */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3',
          'cursor-pointer transition-colors select-none',
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
        )}
      >
        <input {...getInputProps()} />
        <CloudUpload className={cn('w-9 h-9', isDragActive ? 'text-blue-400' : 'text-gray-300')} />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            {isDragActive ? 'Drop PDFs here…' : 'Drag & drop your PDF here'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Supports single or multiple files · Max 10 MB each</p>
        </div>
        <button
          type="button"
          className="mt-1 flex items-center gap-1.5 px-4 py-1.5 text-xs border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          Browse files
        </button>
      </div>

      {globalErr && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {globalErr}
        </p>
      )}

      {/* ── Queued files ── */}
      {queue.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Queued files</p>
          {queue.map(qf => (
            <FileCard key={qf.id} qf={qf} onRemove={() => removeFile(qf.id)} />
          ))}
        </div>
      )}

      {/* ── Actions ── */}
      {queue.length > 0 && (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={() => setQueue([])} disabled={running}>
            Clear all
          </Button>
          <Button
            size="sm"
            onClick={handleRun}
            loading={running}
            disabled={idleCount === 0}
          >
            <Cpu className="w-3.5 h-3.5" />
            {running ? 'Processing…' : 'Run OCR & extract'}
          </Button>
        </div>
      )}
    </div>
  )
}

// ── Sub-component: one file card ──────────────────────────────────
function FileCard({ qf, onRemove }: { qf: QueuedFile; onRemove: () => void }) {
  const statusColor = {
    idle:      'text-gray-400',
    uploading: 'text-blue-500',
    done:      'text-green-500',
    error:     'text-red-500',
  }[qf.status]

  const statusLabel = {
    idle:      'Ready to process',
    uploading: `Uploading… ${qf.progress}%`,
    done:      'Uploaded ✓',
    error:     qf.error ?? 'Error',
  }[qf.status]

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
      {/* PDF icon */}
      <div className="w-9 h-9 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center shrink-0">
        <FileType className="w-4 h-4 text-red-500" />
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{qf.file.name}</p>
        <p className={cn('text-xs mt-0.5', statusColor)}>
          {formatFileSize(qf.file.size)} · {statusLabel}
        </p>
        {/* Progress bar — only visible while uploading */}
        {qf.status === 'uploading' && (
          <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-200"
              style={{ width: `${qf.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="p-1 rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
        aria-label="Remove file"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

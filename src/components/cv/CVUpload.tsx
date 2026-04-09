'use client'

import { useState, useRef, DragEvent } from 'react'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface CVUploadProps {
  onUploadSuccess: (data: any) => void
}

export default function CVUpload({ onUploadSuccess }: CVUploadProps) {
  const { t } = useLanguage()
  const u = t.upload

  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStep, setUploadStep] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = (e: DragEvent) => { e.preventDefault(); setIsDragging(false) }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) validateAndSetFile(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) validateAndSetFile(file)
  }

  const validateAndSetFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type)) { toast.error(u.toast.invalidFormat); return }
    if (file.size > 10 * 1024 * 1024) { toast.error(u.toast.fileTooLarge); return }
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    setUploadStep(u.uploading)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      setUploadStep(u.parsing)

      const response = await fetch('/api/cv/upload', { method: 'POST', body: formData })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      setUploadStep(u.extracting)
      const data = await response.json()
      toast.success(u.toast.success)
      onUploadSuccess(data)
    } catch (error: any) {
      toast.error(error.message || u.toast.error)
    } finally {
      setUploading(false)
      setUploadStep('')
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer',
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : selectedFile
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileSelect} />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if (inputRef.current) inputRef.current.value = '' }}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
            >
              <X className="h-3 w-3" />
              {u.remove}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <Upload className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{isDragging ? u.dragging : u.idle}</p>
              <p className="text-sm text-gray-500 mt-1">{u.browse}</p>
            </div>
          </div>
        )}
      </div>

      {selectedFile && (
        <Button onClick={handleUpload} loading={uploading} className="w-full" size="lg">
          {uploading ? uploadStep || u.processing : u.button}
        </Button>
      )}
    </div>
  )
}

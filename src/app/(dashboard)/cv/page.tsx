'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, Trash2, FileText } from 'lucide-react'
import CVUpload from '@/components/cv/CVUpload'
import CVPreview from '@/components/cv/CVPreview'
import { ParsedProfile } from '@/lib/ai/types'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Modal from '@/components/ui/Modal'
import toast from 'react-hot-toast'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface MasterCVData {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  parsedData: ParsedProfile
  updatedAt: string
}

export default function CVPage() {
  const { t } = useLanguage()
  const p = t.cvPage

  const [cvData, setCvData] = useState<MasterCVData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReplaceModal, setShowReplaceModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { fetchCV() }, [])

  const fetchCV = async () => {
    try {
      const res = await fetch('/api/cv')
      const data = await res.json()
      setCvData(data.cv)
    } catch (error) {
      toast.error(p.toast.loadError)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = (data: any) => {
    setCvData(data)
    setShowReplaceModal(false)
    toast.success(p.toast.updateSuccess)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch('/api/cv', { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setCvData(null)
      setShowDeleteModal(false)
      toast.success(p.toast.deleteSuccess)
    } catch {
      toast.error(p.toast.deleteError)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text={p.loading} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{p.title}</h1>
          <p className="text-gray-600 mt-1">
            {cvData ? p.subtitle : p.uploadSubtitle}
          </p>
        </div>

        {cvData && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowReplaceModal(true)} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              {p.replaceCV}
            </Button>
            <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)} className="gap-1.5">
              <Trash2 className="h-3.5 w-3.5" />
              {p.delete}
            </Button>
          </div>
        )}
      </div>

      {cvData ? (
        <CVPreview parsedData={cvData.parsedData} fileName={cvData.fileName} updatedAt={cvData.updatedAt} />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{p.uploadTitle}</h2>
              <p className="text-sm text-gray-500">{p.supportedFormats}</p>
            </div>
          </div>
          <CVUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      )}

      {/* Replace Modal */}
      <Modal isOpen={showReplaceModal} onClose={() => setShowReplaceModal(false)} title={p.replaceModal.title} size="lg">
        <p className="text-sm text-gray-600 mb-4">{p.replaceModal.description}</p>
        <CVUpload onUploadSuccess={handleUploadSuccess} />
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title={p.deleteModal.title} size="sm">
        <p className="text-sm text-gray-600 mb-6">{p.deleteModal.description}</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete} loading={deleting} className="flex-1">
            {p.deleteModal.confirm}
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="flex-1">
            {p.deleteModal.cancel}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

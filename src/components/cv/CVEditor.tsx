'use client'

import { useState } from 'react'
import { Edit2, Check, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import toast from 'react-hot-toast'

interface CVEditorProps {
  field: string
  value: string
  onSave: (value: string) => Promise<void>
  multiline?: boolean
}

export default function CVEditor({ field, value, onSave, multiline = true }: CVEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(editValue)
      setIsEditing(false)
      toast.success(`${field} updated`)
    } catch (error) {
      toast.error('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className="group flex items-start gap-2">
        <p className="text-sm text-gray-600 flex-1 leading-relaxed">{value || `No ${field.toLowerCase()} added`}</p>
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all flex-shrink-0"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        rows={multiline ? 4 : 2}
        className="text-sm"
        autoFocus
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleSave}
          loading={saving}
          className="gap-1"
        >
          <Check className="h-3 w-3" />
          Save
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleCancel}
          className="gap-1"
        >
          <X className="h-3 w-3" />
          Cancel
        </Button>
      </div>
    </div>
  )
}

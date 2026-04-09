'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import toast from 'react-hot-toast'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function AnalyzePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const a = t.analyze

  const [hasCV, setHasCV] = useState<boolean | null>(null)
  const [jobPostText, setJobPostText] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/cv').then((r) => r.json()).then((d) => setHasCV(!!d.cv))
  }, [])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!jobPostText.trim()) errs.jobPostText = a.validationRequired
    else if (jobPostText.trim().length < 100) errs.jobPostText = a.validationTooShort
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    if (!hasCV) {
      toast.error(a.toast.noCv)
      router.push('/cv')
      return
    }

    setLoading(true)
    setStepIndex(0)

    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, a.steps.length - 1))
    }, 3000)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobPostText: jobPostText.trim(),
          jobTitle: jobTitle.trim() || undefined,
          company: company.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')

      clearInterval(interval)
      toast.success(a.toast.success)
      router.push(`/analysis/${data.analysisId}/gaps`)
    } catch (error: any) {
      clearInterval(interval)
      toast.error(error.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{a.title}</h1>
        <p className="text-gray-600 mt-1">{a.subtitle}</p>
      </div>

      {hasCV === false && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">{a.noCvTitle}</p>
            <p className="text-sm text-amber-700 mt-1">
              {a.noCvMessage}{' '}
              <a href="/cv" className="underline font-medium">{a.noCvLink}</a>{' '}
              {a.noCvAfter}
            </p>
          </div>
        </div>
      )}

      {hasCV && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800">{a.cvReady}</p>
        </div>
      )}

      <Card className="p-6">
        {loading ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{a.analyzingTitle}</p>
              <p className="text-sm text-gray-500 mt-2 min-h-5 transition-all">
                {a.steps[stepIndex]}
              </p>
            </div>
            <div className="flex gap-1 justify-center mt-4">
              {a.steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-8 rounded-full transition-all duration-500 ${
                    i <= stepIndex ? 'bg-indigo-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400">{a.takesTime}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={a.jobTitle}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder={a.jobTitlePlaceholder}
              />
              <Input
                label={a.company}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={a.companyPlaceholder}
              />
            </div>

            <Textarea
              label={a.jobDescription}
              value={jobPostText}
              onChange={(e) => setJobPostText(e.target.value)}
              error={errors.jobPostText}
              placeholder={a.jobDescPlaceholder}
              rows={12}
              hint={jobPostText.length > 0 ? `${jobPostText.length} ${a.characters}` : a.jobDescHint}
            />

            <Button type="submit" size="lg" className="w-full gap-2" disabled={!hasCV || loading}>
              <Search className="h-4 w-4" />
              {a.submit}
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}

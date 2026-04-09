'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, ChevronRight, Search, FileCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { formatDate, getMatchScoreBg } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Analysis {
  id: string
  jobTitle?: string
  company?: string
  matchScore?: number
  status: string
  createdAt: string
  _count: { gaps: number }
}

export default function HistoryPage() {
  const { t } = useLanguage()
  const h = t.history

  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analyze')
      .then((r) => r.json())
      .then((d) => setAnalyses(d.analyses || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text={h.loading} />
      </div>
    )
  }

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      analyzing: t.status.analyzing,
      gaps_review: t.status.gaps_review,
      generating: t.status.generating,
      complete: t.status.complete,
    }
    return map[status] || status
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{h.title}</h1>
          <p className="text-gray-600 mt-1">{h.subtitle}</p>
        </div>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Search className="h-4 w-4" />
          {h.newAnalysis}
        </Link>
      </div>

      {analyses.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{h.emptyTitle}</h3>
          <p className="text-gray-500 mb-6">{h.emptyMessage}</p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Search className="h-4 w-4" />
            {h.emptyButton}
          </Link>
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  {[h.colJob, h.colDate, h.colMatch, h.colStatus, h.colActions].map((col) => (
                    <th key={col} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {analyses.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{analysis.jobTitle || h.untitledJob}</p>
                      {analysis.company && <p className="text-sm text-gray-500">{analysis.company}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(analysis.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {analysis.matchScore != null ? (
                        <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${getMatchScoreBg(analysis.matchScore)}`}>
                          {analysis.matchScore}%
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          analysis.status === 'complete' ? 'success'
                            : analysis.status === 'gaps_review' ? 'warning'
                            : 'default'
                        }
                      >
                        {getStatusLabel(analysis.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/analysis/${analysis.id}/gaps`} className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                          {h.gaps}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                        {analysis.status === 'complete' && (
                          <Link href={`/analysis/${analysis.id}/cv`} className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium">
                            <FileCheck className="h-3.5 w-3.5" />
                            {h.cv}
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

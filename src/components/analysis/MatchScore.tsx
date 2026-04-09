'use client'

import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface MatchScoreProps {
  score: number
  summary?: string
  breakdown?: {
    clearlyPresent: number
    partiallyPresent: number
    probablyPresent: number
    missing: number
    total: number
  }
}

export default function MatchScore({ score, summary, breakdown }: MatchScoreProps) {
  const { t } = useLanguage()
  const m = t.matchScore

  const getScoreLabel = () => {
    if (score >= 80) return m.excellent
    if (score >= 65) return m.good
    if (score >= 50) return m.fair
    return m.poor
  }

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600'
    if (score >= 65) return 'text-indigo-600'
    if (score >= 50) return 'text-amber-600'
    return 'text-red-600'
  }

  const getRingColor = () => {
    if (score >= 80) return 'text-green-500'
    if (score >= 65) return 'text-indigo-500'
    if (score >= 50) return 'text-amber-500'
    return 'text-red-500'
  }

  const circumference = 2 * Math.PI * 40
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="10" fill="none" />
            <circle
              cx="50" cy="50" r="40"
              stroke="currentColor" strokeWidth="10" fill="none"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round"
              className={cn('transition-all duration-700', getRingColor())}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-2xl font-bold', getScoreColor())}>{score}%</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={cn('text-lg font-bold', getScoreColor())}>{getScoreLabel()}</h3>
          {summary && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{summary}</p>}
        </div>
      </div>

      {breakdown && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between gap-2 bg-green-50 rounded-lg px-3 py-2">
            <span className="text-green-700">{m.strongMatches}</span>
            <span className="font-bold text-green-700">{breakdown.clearlyPresent}</span>
          </div>
          <div className="flex items-center justify-between gap-2 bg-amber-50 rounded-lg px-3 py-2">
            <span className="text-amber-700">{m.partialMatches}</span>
            <span className="font-bold text-amber-700">{breakdown.partiallyPresent}</span>
          </div>
          <div className="flex items-center justify-between gap-2 bg-blue-50 rounded-lg px-3 py-2">
            <span className="text-blue-700">{m.probableMatches}</span>
            <span className="font-bold text-blue-700">{breakdown.probablyPresent}</span>
          </div>
          <div className="flex items-center justify-between gap-2 bg-red-50 rounded-lg px-3 py-2">
            <span className="text-red-700">{m.missing}</span>
            <span className="font-bold text-red-700">{breakdown.missing}</span>
          </div>
        </div>
      )}
    </div>
  )
}

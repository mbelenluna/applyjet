'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react'
import { RequirementGapWithId, UserDecision } from '@/types'
import GapCard from './GapCard'
import MatchScore from './MatchScore'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { Language } from '@/lib/i18n/translations'

interface GapAnalysisReviewProps {
  analysisId: string
  jobTitle?: string
  company?: string
  matchScore: number
  matchSummary?: string
  gaps: RequirementGapWithId[]
}

export default function GapAnalysisReview({
  analysisId,
  jobTitle,
  company,
  matchScore,
  matchSummary,
  gaps: initialGaps,
}: GapAnalysisReviewProps) {
  const router = useRouter()
  const { t, language } = useLanguage()
  const g = t.gaps

  const [gaps, setGaps] = useState(initialGaps)
  const [decisions, setDecisions] = useState<Record<string, { decision: UserDecision; text?: string }>>({})
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const initial: typeof decisions = {}
    initialGaps.forEach((gap) => {
      if (gap.status === 'clearly_present') {
        initial[gap.id] = { decision: 'keep' }
      } else if (gap.userDecision) {
        initial[gap.id] = { decision: gap.userDecision, text: gap.userAddedText }
      }
    })
    setDecisions(initial)
  }, [initialGaps])

  const handleDecisionChange = (gapId: string, decision: UserDecision, text?: string) => {
    setDecisions((prev) => ({ ...prev, [gapId]: { decision, text } }))
  }

  const actionableGaps  = gaps.filter((g) =>
    g.status === 'partially_present' ||
    g.status === 'probably_present'  ||
    g.status === 'missing'
  )
  const reviewedCount   = actionableGaps.filter((g) => decisions[g.id]?.decision).length
  const allReviewed     = reviewedCount === actionableGaps.length

  const breakdown = {
    clearlyPresent:   gaps.filter((g) => g.status === 'clearly_present').length,
    partiallyPresent: gaps.filter((g) => g.status === 'partially_present').length,
    probablyPresent:  gaps.filter((g) => g.status === 'probably_present').length,
    missing:          gaps.filter((g) => g.status === 'missing').length,
    total: gaps.length,
  }

  const handleGenerate = async () => {
    if (!allReviewed) { toast.error(g.toast.reviewFirst); return }

    setGenerating(true)
    try {
      const decisionsPayload = Object.entries(decisions).map(([id, { decision, text }]) => ({
        id, userDecision: decision, userAddedText: text,
      }))

      const saveRes = await fetch(`/api/analyze/${analysisId}/gaps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisions: decisionsPayload }),
      })
      if (!saveRes.ok) throw new Error(g.toast.saveError)

      const genRes = await fetch(`/api/analyze/${analysisId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
      })
      if (!genRes.ok) throw new Error(g.toast.generateError)

      toast.success(g.toast.generated)
      router.push(`/analysis/${analysisId}/cv`)
    } catch (error: any) {
      toast.error(error.message || g.toast.generateError)
    } finally {
      setGenerating(false)
    }
  }

  const strongMatches = gaps.filter((g) => g.status === 'clearly_present')
  const partialGaps   = gaps.filter((g) => g.status === 'partially_present' || g.status === 'probably_present')
  const missingGaps   = gaps.filter((g) => g.status === 'missing')

  const remaining = actionableGaps.length - reviewedCount
  const progressMsg = allReviewed
    ? g.allReviewed
    : remaining === 1
    ? g.reviewMore.replace('{n}', String(remaining))
    : g.reviewMorePlural.replace('{n}', String(remaining))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{g.title}</h1>
        <p className="text-gray-600 mt-1">
          {jobTitle ? (
            <>
              <span className="font-medium">{jobTitle}</span>
              {company && <span> {g.at} {company}</span>}
            </>
          ) : (
            g.reviewSubtitle
          )}
        </p>
      </div>

      <MatchScore score={matchScore} summary={matchSummary} breakdown={breakdown} />

      {matchScore < 50 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">{g.lowMatchWarningTitle}</p>
            <p className="text-sm text-red-700 mt-1">{g.lowMatchWarningBody}</p>
          </div>
        </div>
      )}

      {actionableGaps.length > 0 && (
        <div className="bg-indigo-50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-900">
              {g.progressLabel} {reviewedCount} / {actionableGaps.length} {g.progressUnit}
            </p>
            <div className="mt-2 h-2 bg-indigo-200 rounded-full overflow-hidden w-64">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${(reviewedCount / actionableGaps.length) * 100}%` }}
              />
            </div>
          </div>
          {allReviewed && <CheckCircle className="h-6 w-6 text-green-500" />}
        </div>
      )}

      {strongMatches.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full inline-block" />
            {g.strongMatches} ({strongMatches.length})
          </h2>
          <div className="space-y-2">
            {strongMatches.map((gap) => (
              <GapCard key={gap.id} gap={gap} onDecisionChange={handleDecisionChange} />
            ))}
          </div>
        </div>
      )}

      {partialGaps.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-500 rounded-full inline-block" />
            {g.moderateGaps} ({partialGaps.length})
          </h2>
          <div className="space-y-2">
            {partialGaps.map((gap) => (
              <GapCard key={gap.id} gap={gap} onDecisionChange={handleDecisionChange} />
            ))}
          </div>
        </div>
      )}

      {missingGaps.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full inline-block" />
            {g.missingRequirements} ({missingGaps.length})
          </h2>
          <div className="space-y-2">
            {missingGaps.map((gap) => (
              <GapCard key={gap.id} gap={gap} onDecisionChange={handleDecisionChange} />
            ))}
          </div>
        </div>
      )}

      {/* Generate bar */}
      <div className="sticky bottom-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-gray-900">{progressMsg}</p>
          <Button
            onClick={handleGenerate}
            loading={generating}
            disabled={!allReviewed}
            size="lg"
            className="gap-2 flex-shrink-0"
          >
            {g.generateButton}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

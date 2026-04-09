export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import GapAnalysisReview from '@/components/analysis/GapAnalysisReview'
import { RequirementGapWithId } from '@/types'
import AnalyzingState from '@/components/analysis/AnalyzingState'

export default async function GapsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const analysis = await prisma.jobAnalysis.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { gaps: { orderBy: { order: 'asc' } } },
  })

  if (!analysis) notFound()

  if (analysis.status === 'analyzing') {
    return <AnalyzingState />
  }

  const gaps: RequirementGapWithId[] = analysis.gaps.map((gap) => ({
    id: gap.id,
    analysisId: gap.analysisId,
    requirement: gap.requirement,
    category: gap.category as any,
    status: gap.status as any,
    explanation: gap.explanation,
    currentCVContent: gap.currentCVContent || undefined,
    suggestedAction: gap.suggestedAction || undefined,
    reframeSuggestion: gap.reframeSuggestion || undefined,
    learningSuggestion: gap.learningSuggestion || undefined,
    importance: gap.importance as any,
    order: gap.order,
    userDecision: gap.userDecision as any,
    userAddedText: gap.userAddedText || undefined,
  }))

  return (
    <GapAnalysisReview
      analysisId={params.id}
      jobTitle={analysis.jobTitle || undefined}
      company={analysis.company || undefined}
      matchScore={analysis.matchScore || 0}
      matchSummary={analysis.matchSummary || undefined}
      gaps={gaps}
    />
  )
}

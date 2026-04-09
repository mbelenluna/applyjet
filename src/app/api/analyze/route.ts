import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { analyzeJobPost, generateGapAnalysis } from '@/lib/ai/openai'
import { ParsedProfile } from '@/lib/ai/types'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { jobPostText, jobTitle, company } = body

    if (!jobPostText || jobPostText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide a job description with at least 50 characters' },
        { status: 400 }
      )
    }

    // Check user has a master CV
    const masterCV = await prisma.masterCV.findUnique({
      where: { userId: session.user.id },
    })

    if (!masterCV) {
      return NextResponse.json(
        { error: 'Please upload your master CV first' },
        { status: 400 }
      )
    }

    const parsedProfile: ParsedProfile = JSON.parse(masterCV.parsedData)

    // Create initial analysis record
    const analysis = await prisma.jobAnalysis.create({
      data: {
        userId: session.user.id,
        jobTitle: jobTitle?.trim() || null,
        company: company?.trim() || null,
        jobPostText,
        status: 'analyzing',
      },
    })

    // Extract job requirements
    const jobRequirements = await analyzeJobPost(jobPostText)

    // Update job title/company from AI extraction if not provided
    if (!jobTitle && jobRequirements.jobTitle) {
      await prisma.jobAnalysis.update({
        where: { id: analysis.id },
        data: { jobTitle: jobRequirements.jobTitle },
      })
    }
    if (!company && jobRequirements.company) {
      await prisma.jobAnalysis.update({
        where: { id: analysis.id },
        data: { company: jobRequirements.company },
      })
    }

    // Run gap analysis
    const gapResult = await generateGapAnalysis(parsedProfile, jobRequirements)

    // Save gaps to database
    const gapsToCreate = gapResult.gaps.map((gap, index) => ({
      analysisId: analysis.id,
      requirement: gap.requirement,
      category: gap.category,
      status: gap.status,
      explanation: gap.explanation,
      currentCVContent: gap.currentCVContent || null,
      suggestedAction: gap.suggestedAction || null,
      reframeSuggestion: gap.reframeSuggestion || null,
      learningSuggestion: gap.learningSuggestion || null,
      importance: gap.importance,
      order: index,
    }))

    await prisma.requirementGap.createMany({ data: gapsToCreate })

    // Update analysis with results
    await prisma.jobAnalysis.update({
      where: { id: analysis.id },
      data: {
        matchScore: gapResult.matchScore,
        matchSummary: gapResult.matchSummary,
        status: 'gaps_review',
        jobTitle: jobTitle?.trim() || jobRequirements.jobTitle || null,
        company: company?.trim() || jobRequirements.company || null,
      },
    })

    return NextResponse.json({ analysisId: analysis.id })
  } catch (error: any) {
    console.error('Analyze error:', error)
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const analyses = await prisma.jobAnalysis.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        _count: { select: { gaps: true } },
      },
    })

    return NextResponse.json({ analyses })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch analyses' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { generateTailoredCV, analyzeJobPost } from '@/lib/ai/openai'
import { generateCVHTML } from '@/lib/generators/cv-pdf'
import { ParsedProfile } from '@/lib/ai/types'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Optional language preference sent from the client
    let language: 'en' | 'es' = 'en'
    try {
      const body = await request.json()
      if (body?.language === 'es') language = 'es'
    } catch {}


    // Get analysis with gaps
    const analysis = await prisma.jobAnalysis.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: {
        gaps: { orderBy: { order: 'asc' } },
      },
    })

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }

    // Get master CV
    const masterCV = await prisma.masterCV.findUnique({
      where: { userId: session.user.id },
    })

    if (!masterCV) {
      return NextResponse.json({ error: 'Master CV not found' }, { status: 400 })
    }

    const parsedProfile: ParsedProfile = JSON.parse(masterCV.parsedData)

    // Get job requirements from AI (or re-extract)
    const jobRequirements = await analyzeJobPost(analysis.jobPostText)

    // Prepare gap decisions for AI
    const gapDecisions = analysis.gaps.map((gap) => ({
      requirement: gap.requirement,
      status: gap.status,
      userDecision: gap.userDecision || 'keep',
      userAddedText: gap.userAddedText || undefined,
      reframeSuggestion: gap.reframeSuggestion || undefined,
      learningSuggestion: gap.learningSuggestion || undefined,
    }))

    // Generate tailored CV
    const tailoredContent = await generateTailoredCV(parsedProfile, jobRequirements, gapDecisions, language)

    // Generate HTML version
    const htmlContent = generateCVHTML(tailoredContent)

    // Update analysis status
    await prisma.jobAnalysis.update({
      where: { id: params.id },
      data: { status: 'complete' },
    })

    // Save tailored CV
    const tailoredCV = await prisma.tailoredCV.create({
      data: {
        analysisId: params.id,
        content: tailoredContent,
        htmlContent,
      },
    })

    return NextResponse.json({
      id: tailoredCV.id,
      content: tailoredContent,
      htmlContent,
    })
  } catch (error: any) {
    console.error('Generate CV error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate CV' },
      { status: 500 }
    )
  }
}

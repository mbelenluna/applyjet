import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const analysis = await prisma.jobAnalysis.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: {
        gaps: { orderBy: { order: 'asc' } },
        tailoredCVs: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    })

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gaps' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const analysis = await prisma.jobAnalysis.findFirst({
      where: { id: params.id, userId: session.user.id },
    })

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }

    const body = await request.json()
    const { decisions } = body as {
      decisions: Array<{ id: string; userDecision: string; userAddedText?: string }>
    }

    // Update each gap decision
    await Promise.all(
      decisions.map((d) =>
        prisma.requirementGap.update({
          where: { id: d.id },
          data: {
            userDecision: d.userDecision,
            userAddedText: d.userAddedText || null,
          },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save gaps error:', error)
    return NextResponse.json({ error: 'Failed to save decisions' }, { status: 500 })
  }
}

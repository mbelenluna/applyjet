export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { generateCVHTML } from '@/lib/generators/cv-pdf'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the tailored CV
    const tailoredCV = await prisma.tailoredCV.findFirst({
      where: { id: params.id },
      include: { analysis: true },
    })

    if (!tailoredCV) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    if (tailoredCV.analysis.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const format = request.nextUrl.searchParams.get('format') || 'html'

    // Check plan for format restrictions
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { planType: true },
    })

    if (user?.planType === 'free' && format === 'txt') {
      return NextResponse.json(
        { error: 'Upgrade required for this format' },
        { status: 403 }
      )
    }

    if (format === 'txt') {
      return new NextResponse(tailoredCV.content, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="tailored-cv-${params.id}.txt"`,
        },
      })
    }

    // Return the styled HTML so the client can render → canvas → PDF
    const html = tailoredCV.htmlContent || generateCVHTML(tailoredCV.content)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // inline so the client-side fetch can read it as text without a download prompt
        'Content-Disposition': `inline`,
      },
    })
  } catch (error: any) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}

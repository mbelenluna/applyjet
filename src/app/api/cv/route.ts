export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const masterCV = await prisma.masterCV.findUnique({
      where: { userId: session.user.id },
    })

    if (!masterCV) {
      return NextResponse.json({ cv: null })
    }

    return NextResponse.json({
      cv: {
        id: masterCV.id,
        fileName: masterCV.fileName,
        fileUrl: masterCV.fileUrl,
        fileType: masterCV.fileType,
        parsedData: JSON.parse(masterCV.parsedData),
        createdAt: masterCV.createdAt,
        updatedAt: masterCV.updatedAt,
      },
    })
  } catch (error: any) {
    console.error('Get CV error:', error)
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.masterCV.delete({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete CV error:', error)
    return NextResponse.json({ error: 'Failed to delete CV' }, { status: 500 })
  }
}

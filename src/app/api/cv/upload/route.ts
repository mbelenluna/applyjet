export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { parseCVText } from '@/lib/ai/openai'
import { parsePDF } from '@/lib/parsers/pdf'
import { parseDOCX } from '@/lib/parsers/docx'
import path from 'path'
import fs from 'fs/promises'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload PDF or DOCX.' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 10MB' }, { status: 400 })
    }

    // Save file to disk
    const uploadDir = process.env.UPLOAD_DIR || './public/uploads'
    await fs.mkdir(uploadDir, { recursive: true })

    const ext = file.type === 'application/pdf' ? '.pdf' : '.docx'
    const fileName = `${session.user.id}-${Date.now()}${ext}`
    const filePath = path.join(uploadDir, fileName)
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    await fs.writeFile(filePath, fileBuffer)

    // Parse the file
    let rawText: string
    if (file.type === 'application/pdf') {
      rawText = await parsePDF(fileBuffer)
    } else {
      rawText = await parseDOCX(fileBuffer)
    }

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from file. Please ensure it is not a scanned image.' },
        { status: 400 }
      )
    }

    // Parse with AI
    const parsedData = await parseCVText(rawText)

    // Safety net: remove any certification entries that are duplicated in education.
    // The prompt instructs the model never to do this, but this ensures it never
    // reaches the database even if the model slips.
    if (parsedData.education && parsedData.certifications) {
      // Build a set of "degree" identifiers from education entries
      const educationKeys = new Set(
        parsedData.education.map((e) =>
          `${e.institution?.toLowerCase().trim()}|${e.field?.toLowerCase().trim()}`
        )
      )
      // Keep a certification only if it does NOT match an education entry
      parsedData.certifications = parsedData.certifications.filter((cert) => {
        const certKey = `${cert.issuer?.toLowerCase().trim()}|${cert.name?.toLowerCase().trim()}`
        // Also check the reverse: issuer+name vs institution+field
        const isDuplicateOfEducation = parsedData.education!.some((edu) => {
          const sameInstitution =
            cert.issuer?.toLowerCase().includes(edu.institution?.toLowerCase() ?? '') ||
            edu.institution?.toLowerCase().includes(cert.issuer?.toLowerCase() ?? '')
          const sameTopic =
            cert.name?.toLowerCase().includes(edu.field?.toLowerCase() ?? '') ||
            edu.field?.toLowerCase().includes(cert.name?.toLowerCase() ?? '') ||
            cert.name?.toLowerCase().includes(edu.degree?.toLowerCase() ?? '')
          return sameInstitution && sameTopic
        })
        return !isDuplicateOfEducation
      })
    }

    // Save to database
    const masterCV = await prisma.masterCV.upsert({
      where: { userId: session.user.id },
      update: {
        fileName: file.name,
        fileUrl: `/uploads/${fileName}`,
        fileType: file.type,
        rawText,
        parsedData: JSON.stringify(parsedData),
      },
      create: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl: `/uploads/${fileName}`,
        fileType: file.type,
        rawText,
        parsedData: JSON.stringify(parsedData),
      },
    })

    return NextResponse.json({
      id: masterCV.id,
      fileName: masterCV.fileName,
      parsedData,
      createdAt: masterCV.createdAt,
      updatedAt: masterCV.updatedAt,
    })
  } catch (error: any) {
    console.error('CV upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process CV' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { translateCV } from '@/lib/ai/openai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, targetLanguage } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    if (targetLanguage !== 'en' && targetLanguage !== 'es') {
      return NextResponse.json({ error: 'targetLanguage must be "en" or "es"' }, { status: 400 })
    }

    const translated = await translateCV(content, targetLanguage)
    return NextResponse.json({ content: translated })
  } catch (error: any) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    )
  }
}

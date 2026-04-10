export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/db'

const TIER_CREDITS: Record<string, number> = {
  starter: 20,
  pro: 50,
}

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  const buf = Buffer.from(await request.arrayBuffer())

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.userId
    const tier = session.metadata?.tier
    const sessionId = session.id

    if (!userId || !tier || !TIER_CREDITS[tier]) {
      console.error('Missing metadata in checkout session:', { userId, tier, sessionId })
      return NextResponse.json({ error: 'Invalid metadata' }, { status: 400 })
    }

    // Fetch user for idempotency check
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripePaymentIds: true },
    })

    if (!user) {
      console.error('User not found:', userId)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Idempotency: skip if session already processed
    if (user.stripePaymentIds.includes(sessionId)) {
      console.log('Session already processed, skipping:', sessionId)
      return NextResponse.json({ received: true })
    }

    const creditsToAdd = TIER_CREDITS[tier]

    await prisma.user.update({
      where: { id: userId },
      data: {
        analysisCredits: { increment: creditsToAdd },
        planType: tier,
        stripePaymentIds: { push: sessionId },
      },
    })

    console.log(`Granted ${creditsToAdd} credits (${tier}) to user ${userId}`)
  }

  return NextResponse.json({ received: true })
}

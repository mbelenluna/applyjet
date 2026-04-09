export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'

const PRICES = {
  starter: { amount: 699, credits: 20, label: 'Starter — 20 Analyses' },
  pro: { amount: 1599, credits: 50, label: 'Pro — 50 Analyses' },
} as const

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { tier } = body as { tier: 'starter' | 'pro' }

  if (!tier || !PRICES[tier]) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
  const price = PRICES[tier]

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: price.amount,
          product_data: { name: price.label },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: session.user.id,
      tier,
    },
    success_url: `${baseUrl}/dashboard/billing/success`,
    cancel_url: `${baseUrl}/pricing`,
  })

  return NextResponse.json({ url: checkoutSession.url })
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, Zap, Loader2 } from 'lucide-react'

const PLANS = [
  {
    id: 'free' as const,
    name: 'Free',
    price: '$0',
    description: 'Try it out',
    highlight: '1 job application',
    badge: null,
    features: [
      '1 analysis & tailored CV',
      'PDF download',
      'Gap analysis',
      'AI-powered matching',
    ],
    cta: 'Get started free',
    href: '/signup',
  },
  {
    id: 'starter' as const,
    name: 'Starter',
    price: '$6.99',
    description: 'One-time payment',
    highlight: 'Up to 20 job applications',
    badge: 'Most Popular',
    features: [
      '20 analyses & tailored CVs',
      'PDF + TXT download',
      'Gap analysis',
      'AI-powered matching',
      'Multi-language support',
    ],
    cta: 'Get Starter',
    href: null,
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: '$15.99',
    description: 'One-time payment',
    highlight: 'Up to 50 job applications',
    badge: null,
    features: [
      '50 analyses & tailored CVs',
      'PDF + TXT download',
      'Gap analysis',
      'AI-powered matching',
      'Multi-language support',
      'Priority processing',
    ],
    cta: 'Get Pro',
    href: null,
  },
]

export default function Pricing() {
  const router = useRouter()
  const [loadingTier, setLoadingTier] = useState<'starter' | 'pro' | null>(null)

  const handlePurchase = async (tier: 'starter' | 'pro') => {
    setLoadingTier(tier)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })
      const data = await res.json()
      if (res.status === 401) {
        // Not logged in — send to signup first
        router.push('/signup')
        return
      }
      if (!res.ok || !data.url) throw new Error(data.error || 'Failed to create checkout')
      window.location.href = data.url
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setLoadingTier(null)
    }
  }

  return (
    <section className="py-24 bg-slate-950" id="pricing">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Simple, one-time pricing
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            No subscriptions. Pay once, use it for your job search. Credits never expire.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => {
            const isPopular = plan.badge === 'Most Popular'
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  isPopular
                    ? 'bg-indigo-600 ring-2 ring-indigo-400 shadow-2xl scale-105'
                    : 'bg-slate-800 ring-1 ring-slate-700'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${isPopular ? 'text-white' : 'text-white'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-4xl font-extrabold ${isPopular ? 'text-white' : 'text-white'}`}>
                      {plan.price}
                    </span>
                  </div>
                  <p className={`text-sm ${isPopular ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {plan.description}
                  </p>
                  <p className={`text-sm font-semibold mt-2 ${isPopular ? 'text-white' : 'text-slate-300'}`}>
                    {plan.highlight}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          isPopular ? 'text-indigo-200' : 'text-indigo-400'
                        }`}
                      />
                      <span className={`text-sm ${isPopular ? 'text-indigo-100' : 'text-slate-300'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.href ? (
                  <Link
                    href={plan.href}
                    className={`w-full text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      isPopular
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    onClick={() => handlePurchase(plan.id as 'starter' | 'pro')}
                    disabled={loadingTier === plan.id}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                      isPopular
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {loadingTier === plan.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        {plan.cta}
                      </>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-center text-slate-500 text-sm mt-10">
          All payments are securely processed by Stripe. Credits never expire.
        </p>
      </div>
    </section>
  )
}

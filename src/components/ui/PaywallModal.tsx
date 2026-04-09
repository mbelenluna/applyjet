'use client'

import { useState } from 'react'
import { X, Zap, Loader2, Check } from 'lucide-react'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
}

const PLANS = [
  {
    id: 'starter' as const,
    name: 'Starter',
    price: '$6.99',
    description: 'One-time payment',
    credits: 20,
    features: ['20 analyses & tailored CVs', 'PDF + TXT download', 'Credits never expire'],
    badge: 'Most Popular',
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: '$15.99',
    description: 'One-time payment',
    credits: 50,
    features: ['50 analyses & tailored CVs', 'PDF + TXT download', 'Priority processing'],
    badge: null,
  },
]

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const [loadingTier, setLoadingTier] = useState<'starter' | 'pro' | null>(null)

  if (!isOpen) return null

  const handlePurchase = async (tier: 'starter' | 'pro') => {
    setLoadingTier(tier)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'Failed to create checkout')
      window.location.href = data.url
    } catch (err) {
      console.error('Checkout error:', err)
      setLoadingTier(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700 z-10">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">You're out of analyses</h2>
            <p className="text-slate-400 text-sm mt-1">
              Upgrade to continue tailoring your CV for new jobs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors ml-4 flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Plans */}
        <div className="p-6 space-y-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl p-5 border ${
                plan.badge
                  ? 'bg-indigo-600 border-indigo-500'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-lg">{plan.name}</span>
                    {plan.badge && (
                      <span className="bg-amber-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${plan.badge ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {plan.credits} analyses · {plan.description}
                  </p>
                </div>
                <span className="text-2xl font-extrabold text-white">{plan.price}</span>
              </div>

              <ul className="space-y-1.5 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check
                      className={`h-3.5 w-3.5 flex-shrink-0 ${
                        plan.badge ? 'text-indigo-200' : 'text-indigo-400'
                      }`}
                    />
                    <span className={`text-xs ${plan.badge ? 'text-indigo-100' : 'text-slate-300'}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan.id)}
                disabled={loadingTier === plan.id}
                className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                  plan.badge
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
                    Get {plan.name} — {plan.price}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="px-6 pb-5 text-center">
          <p className="text-xs text-slate-500">
            Secure payment via Stripe. Credits never expire.
          </p>
        </div>
      </div>
    </div>
  )
}

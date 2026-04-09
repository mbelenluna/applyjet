'use client'

import Link from 'next/link'
import { CheckCircle, ArrowRight, Zap } from 'lucide-react'

export default function BillingSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Checkmark */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Payment successful!</h1>
        <p className="text-gray-500 text-lg mb-2">
          Your analyses have been added to your account.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          It may take a moment for your credits to appear. Refresh if needed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Zap className="h-4 w-4" />
            Start analyzing
          </Link>
        </div>
      </div>
    </div>
  )
}

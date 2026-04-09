'use client'

import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
  const h = t.landing.hero

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-100/40 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-indigo-100">
          <Zap className="h-3.5 w-3.5" />
          {h.badge}
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          {h.headline1}
          <br />
          <span className="text-gradient">{h.headline2}</span>
          <br />
          {h.headline3}
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          {h.subtitle}
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              {h.getStarted}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg">
              {h.signIn}
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">{h.noCreditCard}</p>

        {/* Mock UI Preview */}
        <div className="mt-16 relative mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 bg-white rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-400">
                app.applyjet.io/analyze
              </div>
            </div>
            <div className="p-6 grid grid-cols-3 gap-4 text-left">
              <div className="col-span-2 space-y-3">
                <div className="h-6 bg-gray-200 rounded-lg w-48 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-green-100 rounded w-full flex items-center px-3">
                    <span className="text-xs text-green-700 font-medium">React ✓ Clearly Present</span>
                  </div>
                  <div className="h-4 bg-amber-100 rounded w-full flex items-center px-3">
                    <span className="text-xs text-amber-700 font-medium">TypeScript ~ Partially Present</span>
                  </div>
                  <div className="h-4 bg-red-100 rounded w-full flex items-center px-3">
                    <span className="text-xs text-red-700 font-medium">GraphQL ✗ Missing</span>
                  </div>
                  <div className="h-4 bg-green-100 rounded w-3/4 flex items-center px-3">
                    <span className="text-xs text-green-700 font-medium">Node.js ✓ Clearly Present</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-indigo-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-indigo-600">78%</div>
                  <div className="text-xs text-gray-500 mt-1">{h.matchScore}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-green-700 font-medium">5 {h.strongMatches}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-red-700 font-medium">2 {h.gapsFound}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function HowItWorks() {
  const { t } = useLanguage()
  const h = t.landing.howItWorks

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{h.heading}</h2>
          <p className="text-xl text-gray-600">{h.subheading}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {h.steps.map((step, index) => (
              <div key={index} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  {index < h.steps.length - 1 && (
                    <div className="w-px flex-1 mt-2 bg-gradient-to-b from-indigo-300 to-transparent min-h-8" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                {h.startFree}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

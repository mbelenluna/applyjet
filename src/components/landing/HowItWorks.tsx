'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function HowItWorks() {
  const { t } = useLanguage()
  const h = t.landing.howItWorks

  return (
    <section className="py-28 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-xl mb-20">
          <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">{h.heading}</h2>
          <p className="text-lg text-slate-400">{h.subheading}</p>
        </div>

        {/* Steps — horizontal on desktop, vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 mb-16">
          {h.steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < h.steps.length - 1 && (
                <div className="hidden md:block absolute top-5 left-[calc(50%+24px)] right-[-50%] h-px bg-slate-700" />
              )}

              <div className="flex md:flex-col gap-5 md:gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold relative z-10">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/signup">
          <Button size="lg" className="gap-2">
            {h.startFree}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>

      </div>
    </section>
  )
}

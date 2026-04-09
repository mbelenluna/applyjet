'use client'

import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Pricing from '@/components/landing/Pricing'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function LandingPage() {
  const { t } = useLanguage()
  const cta = t.landing.cta
  const footer = t.landing.footer

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />

        {/* CTA Section */}
        <section className="py-28 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-4">Get started free</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
              {cta.heading}
            </h2>
            <p className="text-xl text-gray-500 mb-10">{cta.subheading}</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg text-base"
            >
              <Zap className="h-5 w-5" />
              {cta.button}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-white">ApplyJet</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} ApplyJet. {footer.tagline}
          </p>
        </div>
      </footer>
    </div>
  )
}

'use client'

import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Link from 'next/link'
import { Zap } from 'lucide-react'
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

        {/* CTA Section */}
        <section className="py-24 gradient-primary">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">{cta.heading}</h2>
            <p className="text-xl text-indigo-100 mb-8">{cta.subheading}</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg text-lg"
            >
              <Zap className="h-5 w-5" />
              {cta.button}
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-white">ApplyJet</span>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} ApplyJet. {footer.tagline}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

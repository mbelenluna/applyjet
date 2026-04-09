'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle, Zap } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
  const h = t.landing.hero

  return (
    <section className="bg-slate-900 min-h-[92vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 text-sm font-medium px-4 py-2 rounded-full mb-8 border border-indigo-500/20">
              <Zap className="h-3.5 w-3.5" />
              {h.badge}
            </div>

            <h1 className="text-5xl lg:text-[3.75rem] font-extrabold text-white tracking-tight leading-[1.08] mb-6">
              {h.headline1}
              <br />
              <span className="text-indigo-400">{h.headline2}</span>
              <br />
              {h.headline3}
            </h1>

            <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-lg">
              {h.subtitle}
            </p>

            <div className="flex items-center gap-6 flex-wrap mb-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  {h.getStarted}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors underline underline-offset-4">
                {h.signIn}
              </Link>
            </div>

            <p className="text-sm text-slate-500 mb-12">{h.noCreditCard}</p>

            {/* Stats row */}
            <div className="pt-8 border-t border-slate-800 grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-white">3×</div>
                <div className="text-xs text-slate-400 mt-1 leading-tight">More interview callbacks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">&lt;2 min</div>
                <div className="text-xs text-slate-400 mt-1 leading-tight">To tailor your CV</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-slate-400 mt-1 leading-tight">ATS optimized output</div>
              </div>
            </div>
          </div>

          {/* Right — photo */}
          <div className="relative hidden lg:block">
            <div className="relative h-[580px] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
              <Image
                src="/hero-image.jpg"
                alt="Professional tailoring her CV with ApplyJet"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
            </div>

            {/* Floating: match score */}
            <div className="absolute -bottom-5 -left-6 bg-white rounded-xl p-4 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">CV tailored successfully</div>
                <div className="text-xs text-gray-500">Match score jumped to 91%</div>
              </div>
            </div>

            {/* Floating: gaps badge */}
            <div className="absolute top-6 -right-4 bg-white rounded-xl px-4 py-3 shadow-xl">
              <div className="text-xs text-gray-500 mb-0.5">Gaps identified</div>
              <div className="text-lg font-bold text-slate-900">
                4 <span className="text-sm font-normal text-indigo-500">→ all handled</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

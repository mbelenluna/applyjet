'use client'

import { Target, Lightbulb, FileCheck, Shield, BarChart2, Download } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const icons = [Target, Lightbulb, FileCheck, Shield, BarChart2, Download]

export default function Features() {
  const { t } = useLanguage()
  const f = t.landing.features

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-xl mb-16">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">{f.heading}</h2>
          <p className="text-lg text-gray-500">{f.subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {f.items.map((feature, idx) => {
            const Icon = icons[idx]
            const isDark = idx === 0

            return (
              <div
                key={feature.title}
                className={`rounded-2xl p-7 flex flex-col gap-4 transition-all duration-200 ${
                  isDark
                    ? 'bg-slate-900 text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-indigo-500/20' : 'bg-white shadow-sm border border-gray-100'
                }`}>
                  <Icon className={`h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                </div>
                <div>
                  <h3 className={`text-base font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

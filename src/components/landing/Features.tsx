'use client'

import { Target, Lightbulb, FileCheck, Shield, BarChart2, Download } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const icons = [Target, Lightbulb, FileCheck, Shield, BarChart2, Download]
const colors = [
  { color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { color: 'text-purple-600', bg: 'bg-purple-50' },
  { color: 'text-green-600',  bg: 'bg-green-50'  },
  { color: 'text-blue-600',   bg: 'bg-blue-50'   },
  { color: 'text-amber-600',  bg: 'bg-amber-50'  },
  { color: 'text-rose-600',   bg: 'bg-rose-50'   },
]

export default function Features() {
  const { t } = useLanguage()
  const f = t.landing.features

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{f.heading}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{f.subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {f.items.map((feature, idx) => {
            const Icon = icons[idx]
            const { color, bg } = colors[idx]
            return (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 group"
              >
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

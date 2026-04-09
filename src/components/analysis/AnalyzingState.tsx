'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function AnalyzingState() {
  const { t } = useLanguage()
  const { title, body } = t.gaps.analyzing

  return (
    <div className="max-w-4xl mx-auto text-center py-20">
      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="h-8 w-8 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-500 mt-2">{body}</p>
    </div>
  )
}

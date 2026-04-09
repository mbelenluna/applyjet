'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { cn } from '@/lib/utils'

interface LanguageToggleProps {
  className?: string
  /** 'sidebar' renders a wider pill with a label; 'navbar' renders a compact chip */
  variant?: 'sidebar' | 'navbar'
}

export default function LanguageToggle({ className, variant = 'navbar' }: LanguageToggleProps) {
  const { language, toggleLanguage } = useLanguage()

  if (variant === 'sidebar') {
    return (
      <button
        onClick={toggleLanguage}
        title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
        className={cn(
          'flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium',
          'text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200',
          className
        )}
      >
        {/* Flag-style indicator */}
        <span className="text-base leading-none">{language === 'en' ? '🇺🇸' : '🇦🇷'}</span>
        <span className="flex-1 text-left">
          {language === 'en' ? 'English' : 'Español'}
        </span>
        {/* Toggle pill */}
        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
          {language === 'en' ? 'ES' : 'EN'}
        </span>
      </button>
    )
  }

  // navbar variant — compact chip
  return (
    <button
      onClick={toggleLanguage}
      title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold',
        'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300',
        'transition-all duration-200 select-none',
        className
      )}
    >
      <span className="leading-none">{language === 'en' ? '🇺🇸' : '🇦🇷'}</span>
      <span>{language === 'en' ? 'ES' : 'EN'}</span>
    </button>
  )
}

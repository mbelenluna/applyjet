'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, Translations, en, es } from './translations'

interface LanguageContextValue {
  language: Language
  t: Translations
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  t: en,
  setLanguage: () => {},
  toggleLanguage: () => {},
})

const STORAGE_KEY = 'applyjet-language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  // Language toggle is currently disabled — always use English
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, 'en') } catch {}
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {}
  }

  const toggleLanguage = () => setLanguage(language === 'en' ? 'es' : 'en')

  const t = language === 'es' ? es : en

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

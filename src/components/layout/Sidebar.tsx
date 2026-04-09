'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  FileText,
  Search,
  History,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function Sidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t.nav.dashboard },
    { href: '/cv',        icon: FileText,         label: t.nav.myCv },
    { href: '/analyze',  icon: Search,            label: t.nav.analyzeJob },
    { href: '/history',  icon: History,           label: t.nav.history },
    { href: '/settings', icon: Settings,          label: t.nav.settings },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">ApplyJet</span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'h-4 w-4 flex-shrink-0',
                  isActive ? 'text-indigo-600' : 'text-gray-400'
                )}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: language toggle + sign out */}
      <div className="p-4 border-t border-gray-100 space-y-1">
<button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full"
        >
          <LogOut className="h-4 w-4" />
          {t.nav.signOut}
        </button>
      </div>
    </aside>
  )
}

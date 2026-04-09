'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Search, History, ArrowRight, Clock, TrendingUp, Upload } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { formatDate, getMatchScoreBg } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface RecentAnalysis {
  id: string
  jobTitle?: string
  company?: string
  matchScore?: number
  status: string
  createdAt: string
}

interface DashboardData {
  hasCV: boolean
  totalAnalyses: number
  recentAnalyses: RecentAnalysis[]
  avgMatchScore?: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const { t } = useLanguage()
  const d = t.dashboard
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cvRes, analysesRes] = await Promise.all([
          fetch('/api/cv'),
          fetch('/api/analyze'),
        ])
        const cvData = await cvRes.json()
        const analysesData = await analysesRes.json()

        const analyses = analysesData.analyses || []
        const scoredAnalyses = analyses.filter((a: RecentAnalysis) => a.matchScore != null)
        const avgScore =
          scoredAnalyses.length > 0
            ? Math.round(
                scoredAnalyses.reduce((sum: number, a: RecentAnalysis) => sum + (a.matchScore || 0), 0) /
                  scoredAnalyses.length
              )
            : undefined

        setData({
          hasCV: !!cvData.cv,
          totalAnalyses: analyses.length,
          recentAnalyses: analyses.slice(0, 5),
          avgMatchScore: avgScore,
        })
      } catch (error) {
        console.error('Dashboard data error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text={d.loading} />
      </div>
    )
  }

  const firstName = session?.user?.name?.split(' ')[0] || 'there'

  const quickActions = [
    {
      href: '/cv',
      icon: Upload,
      title: data?.hasCV ? d.quickActions.updateCv : d.quickActions.uploadCv,
      description: data?.hasCV ? d.quickActions.updateCvDesc : d.quickActions.uploadCvDesc,
      color: 'bg-indigo-50 text-indigo-600',
      urgent: !data?.hasCV,
    },
    {
      href: '/analyze',
      icon: Search,
      title: d.quickActions.analyzeJob,
      description: d.quickActions.analyzeJobDesc,
      color: 'bg-purple-50 text-purple-600',
      urgent: false,
    },
    {
      href: '/history',
      icon: History,
      title: d.quickActions.viewHistory,
      description: d.quickActions.viewHistoryDesc,
      color: 'bg-green-50 text-green-600',
      urgent: false,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {d.welcome.replace('{name}', firstName)} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          {data?.hasCV ? d.readyToTailor : d.uploadFirst}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${data?.hasCV ? 'bg-green-100' : 'bg-gray-100'}`}>
              <FileText className={`h-5 w-5 ${data?.hasCV ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data?.hasCV ? '1' : '0'}</p>
              <p className="text-sm text-gray-500">
                {d.stats.masterCv}{data?.hasCV ? '' : ` ${d.stats.uploadOne}`}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Search className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data?.totalAnalyses || 0}</p>
              <p className="text-sm text-gray-500">{d.stats.jobAnalyses}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.avgMatchScore ? `${data.avgMatchScore}%` : 'N/A'}
              </p>
              <p className="text-sm text-gray-500">{d.stats.avgMatchScore}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{d.quickActions.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className={`p-5 hover:shadow-md transition-all duration-200 cursor-pointer group ${action.urgent ? 'border-indigo-200 ring-1 ring-indigo-200' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                <div className="flex items-center gap-1 mt-3 text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.quickActions.goNow} <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Analyses */}
      {data?.recentAnalyses && data.recentAnalyses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{d.recentAnalyses.title}</h2>
            <Link href="/history" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              {d.recentAnalyses.viewAll}
            </Link>
          </div>
          <Card>
            <div className="divide-y divide-gray-100">
              {data.recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {analysis.jobTitle || d.recentAnalyses.untitledJob}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(analysis.createdAt)}
                      {analysis.company && ` · ${analysis.company}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {analysis.matchScore != null && (
                      <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${getMatchScoreBg(analysis.matchScore)}`}>
                        {analysis.matchScore}%
                      </span>
                    )}
                    <Link
                      href={analysis.status === 'complete' ? `/analysis/${analysis.id}/cv` : `/analysis/${analysis.id}/gaps`}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      {analysis.status === 'complete' ? d.recentAnalyses.viewCv : d.recentAnalyses.continue}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

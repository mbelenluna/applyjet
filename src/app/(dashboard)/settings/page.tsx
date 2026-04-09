'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { User, Lock, FileText, AlertTriangle, CreditCard, Zap, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const { t } = useLanguage()
  const s = t.settings

  const [name, setName] = useState(session?.user?.name || '')
  const [savingProfile, setSavingProfile] = useState(false)

  const [analysisCredits, setAnalysisCredits] = useState<number | null>(null)
  const [planType, setPlanType] = useState<string>('free')
  const [upgradeLoading, setUpgradeLoading] = useState<'starter' | 'pro' | null>(null)

  useEffect(() => {
    fetch('/api/user/credits')
      .then((r) => r.json())
      .then((d) => {
        if (d.analysisCredits !== undefined) {
          setAnalysisCredits(d.analysisCredits)
          setPlanType(d.planType || 'free')
        }
      })
      .catch(() => {})
  }, [])

  const handleUpgrade = async (tier: 'starter' | 'pro') => {
    setUpgradeLoading(tier)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'Failed to create checkout')
      window.location.href = data.url
    } catch {
      toast.error('Failed to start checkout. Please try again.')
    } finally {
      setUpgradeLoading(null)
    }
  }

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSavingProfile(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (!res.ok) throw new Error()
      await update({ name: name.trim() })
      toast.success(s.toast.profileUpdated)
    } catch {
      toast.error(s.toast.profileError)
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!currentPassword) errs.currentPassword = s.security.errors.currentRequired
    if (!newPassword) errs.newPassword = s.security.errors.newRequired
    else if (newPassword.length < 8) errs.newPassword = s.security.errors.minLength
    if (newPassword !== confirmPassword) errs.confirmPassword = s.security.errors.noMatch
    setPasswordErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSavingPassword(true)
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (!res.ok) {
        const data = await res.json()
        setPasswordErrors({ currentPassword: data.error || s.toast.passwordError })
        return
      }
      toast.success(s.toast.passwordUpdated)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      toast.error(s.toast.passwordError)
    } finally {
      setSavingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return
    setDeleting(true)
    try {
      const res = await fetch('/api/user', { method: 'DELETE' })
      if (!res.ok) throw new Error()
      await signOut({ callbackUrl: '/' })
    } catch {
      toast.error(s.toast.deleteError)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{s.title}</h1>
        <p className="text-gray-600 mt-1">{s.subtitle}</p>
      </div>

      {/* Plan & Billing */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-indigo-600" />
            Plan &amp; Billing
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-gray-900 capitalize">{planType} Plan</p>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <Zap className="h-3.5 w-3.5 text-indigo-500" />
                {analysisCredits !== null
                  ? `${analysisCredits} ${analysisCredits === 1 ? 'analysis' : 'analyses'} remaining`
                  : 'Loading...'}
              </p>
            </div>
          </div>
          {planType === 'free' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Upgrade for more analyses and additional download formats.</p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => handleUpgrade('starter')}
                  disabled={upgradeLoading === 'starter'}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {upgradeLoading === 'starter' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Zap className="h-3.5 w-3.5" />
                  )}
                  Starter — $6.99 (20 analyses)
                </button>
                <button
                  onClick={() => handleUpgrade('pro')}
                  disabled={upgradeLoading === 'pro'}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {upgradeLoading === 'pro' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Zap className="h-3.5 w-3.5" />
                  )}
                  Pro — $15.99 (50 analyses)
                </button>
              </div>
            </div>
          )}
          {planType !== 'free' && (
            <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 inline-block">
              You are on the {planType} plan. Thank you for your support!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Profile */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-600" />
            {s.profile.title}
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input label={s.profile.fullName} value={name} onChange={(e) => setName(e.target.value)} placeholder={s.profile.namePlaceholder} />
            <Input label={s.profile.emailAddress} value={session?.user?.email || ''} disabled hint={s.profile.emailHint} />
            <Button type="submit" loading={savingProfile} size="sm">{s.profile.save}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Lock className="h-4 w-4 text-indigo-600" />
            {s.security.title}
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input label={s.security.currentPassword} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} error={passwordErrors.currentPassword} placeholder={s.security.currentPlaceholder} />
            <Input label={s.security.newPassword} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} error={passwordErrors.newPassword} placeholder={s.security.newPlaceholder} />
            <Input label={s.security.confirmPassword} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={passwordErrors.confirmPassword} placeholder={s.security.confirmPlaceholder} />
            <Button type="submit" loading={savingPassword} size="sm">{s.security.update}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Master CV */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-600" />
            {s.masterCv.title}
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">{s.masterCv.description}</p>
          <Link href="/cv">
            <Button variant="secondary" size="sm">{s.masterCv.manage}</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader className="border-red-100">
          <h2 className="font-semibold text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {s.dangerZone.title}
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">{s.dangerZone.description}</p>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
            {s.dangerZone.deleteButton}
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title={s.dangerZone.modalTitle} size="sm">
        <div className="space-y-4">
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-sm text-red-800">
              {s.dangerZone.modalWarning}{' '}
              <strong>{s.dangerZone.cannotBeUndone}</strong>.
            </p>
          </div>
          <Input
            label={s.dangerZone.typeDelete}
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="DELETE"
          />
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDeleteAccount} loading={deleting} disabled={deleteConfirm !== 'DELETE'} className="flex-1">
              {s.dangerZone.confirm}
            </Button>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="flex-1">
              {s.dangerZone.cancel}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

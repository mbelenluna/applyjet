'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Eye, EyeOff, Check } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function SignupPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const s = t.auth.signup

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const passwordStrength = {
    hasLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  }

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = t.settings.profile.fullName + ' is required'
    if (!email) errs.email = s.emailAddress + ' is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email address'
    if (!password) errs.password = s.password + ' is required'
    else if (password.length < 8) errs.password = t.settings.security.errors.minLength
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: email.toLowerCase(), password }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setErrors({ email: data.error })
        } else {
          toast.error(data.error || 'Registration failed')
        }
        return
      }

      const signInResult = await signIn('credentials', {
        email: email.toLowerCase(),
        password,
        redirect: false,
      })

      if (signInResult?.ok) {
        toast.success('Account created! Welcome to ApplyJet.')
        router.push('/dashboard')
      } else {
        toast.success('Account created! Please sign in.')
        router.push('/login')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const passwordRules = [
    { label: s.passwordRules.length,    key: 'hasLength' },
    { label: s.passwordRules.uppercase, key: 'hasUpper'  },
    { label: s.passwordRules.lowercase, key: 'hasLower'  },
    { label: s.passwordRules.number,    key: 'hasNumber' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-xl">ApplyJet</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{s.title}</h1>
          <p className="text-gray-600 text-sm mb-6">{s.subtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={s.fullName}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              placeholder="Alex Johnson"
              autoComplete="name"
            />

            <Input
              label={s.emailAddress}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <div className="space-y-2">
              <div className="relative">
                <Input
                  label={s.password}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= strengthScore
                            ? strengthScore <= 2
                              ? 'bg-red-400'
                              : strengthScore === 3
                              ? 'bg-amber-400'
                              : 'bg-green-400'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {passwordRules.map((rule) => (
                      <div key={rule.key} className="flex items-center gap-1">
                        <Check
                          className={`h-3 w-3 ${
                            passwordStrength[rule.key as keyof typeof passwordStrength]
                              ? 'text-green-500'
                              : 'text-gray-300'
                          }`}
                        />
                        <span className="text-xs text-gray-500">{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {s.createAccount}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {s.alreadyHaveAccount}{' '}
            <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
              {s.signIn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getMatchScoreColor(score: number): string {
  if (score >= 75) return 'text-green-600'
  if (score >= 50) return 'text-amber-600'
  return 'text-red-600'
}

export function getMatchScoreBg(score: number): string {
  if (score >= 75) return 'bg-green-100 text-green-800'
  if (score >= 50) return 'bg-amber-100 text-amber-800'
  return 'bg-red-100 text-red-800'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    analyzing: 'Analyzing',
    gaps_review: 'Review Gaps',
    generating: 'Generating CV',
    complete: 'Complete',
  }
  return labels[status] || status
}

export function getGapStatusColor(status: string): string {
  const colors: Record<string, string> = {
    clearly_present: 'bg-green-100 text-green-800',
    partially_present: 'bg-amber-100 text-amber-800',
    probably_present: 'bg-blue-100 text-blue-800',
    missing: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getImportanceColor(importance: string): string {
  const colors: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-gray-100 text-gray-600',
  }
  return colors[importance] || 'bg-gray-100 text-gray-600'
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

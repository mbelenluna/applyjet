'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Info, Lightbulb } from 'lucide-react'
import { cn, getGapStatusColor, getImportanceColor } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Textarea from '@/components/ui/Textarea'
import { RequirementGapWithId, UserDecision } from '@/types'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface GapCardProps {
  gap: RequirementGapWithId
  onDecisionChange: (gapId: string, decision: UserDecision, userText?: string) => void
}

export default function GapCard({ gap, onDecisionChange }: GapCardProps) {
  const { t } = useLanguage()
  const g = t.gapCard

  const [expanded, setExpanded] = useState(gap.status !== 'clearly_present')
  const [selectedDecision, setSelectedDecision] = useState<UserDecision | undefined>(gap.userDecision)
  const [userText, setUserText] = useState(gap.userAddedText || '')

  const statusCfg = {
    clearly_present:  { label: g.status.clearly_present,  color: 'bg-green-100 text-green-800 border-green-200'  },
    partially_present:{ label: g.status.partially_present, color: 'bg-amber-100 text-amber-800 border-amber-200'  },
    probably_present: { label: g.status.probably_present,  color: 'bg-blue-100 text-blue-800 border-blue-200'     },
    missing:          { label: g.status.missing,           color: 'bg-red-100 text-red-800 border-red-200'        },
  }[gap.status]

  const decisionOptions = [
    { value: 'keep' as UserDecision,               ...g.decisions.keep },
    { value: 'add_real' as UserDecision,           ...g.decisions.add_real },
    { value: 'reframe' as UserDecision,            ...g.decisions.reframe },
    { value: 'learning_statement' as UserDecision, ...g.decisions.learning_statement },
    { value: 'skip' as UserDecision,               ...g.decisions.skip },
  ]

  const handleDecisionChange = (decision: UserDecision) => {
    setSelectedDecision(decision)
    onDecisionChange(gap.id, decision, userText)
  }

  const handleTextChange = (text: string) => {
    setUserText(text)
    if (selectedDecision) onDecisionChange(gap.id, selectedDecision, text)
  }

  const effectiveDecision = gap.status === 'clearly_present' && !selectedDecision ? 'keep' : selectedDecision

  return (
    <div className={cn(
      'rounded-xl border overflow-hidden transition-all duration-200',
      gap.status === 'clearly_present'  ? 'border-green-200 bg-green-50/30'  :
      gap.status === 'partially_present'? 'border-amber-200 bg-amber-50/20'  :
      gap.status === 'probably_present' ? 'border-blue-200 bg-blue-50/20'    :
      'border-red-200 bg-red-50/20'
    )}>
      {/* Header */}
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900">{gap.requirement}</span>
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', statusCfg?.color)}>
              {statusCfg?.label}
            </span>
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getImportanceColor(gap.importance))}>
              {gap.importance} {g.importance}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {effectiveDecision && (
            <span className="text-xs text-gray-500 hidden sm:block">
              {decisionOptions.find((d) => d.value === effectiveDecision)?.label}
            </span>
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="default">{gap.category.replace('_', ' ')}</Badge>
          </div>

          <div className="bg-white/70 rounded-lg p-3 space-y-2">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{g.analysisLabel}</p>
                <p className="text-sm text-gray-700 mt-0.5">{gap.explanation}</p>
              </div>
            </div>
            {gap.currentCVContent && (
              <div className="border-t border-gray-100 pt-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{g.inYourCv}</p>
                <p className="text-sm text-gray-600 mt-0.5 italic">"{gap.currentCVContent}"</p>
              </div>
            )}
          </div>

          {gap.status !== 'clearly_present' && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">{g.howToHandle}</p>
              <div className="space-y-2">
                {decisionOptions.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150',
                      selectedDecision === option.value
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <input
                      type="radio"
                      name={`decision-${gap.id}`}
                      value={option.value}
                      checked={selectedDecision === option.value}
                      onChange={() => handleDecisionChange(option.value)}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{option.label}</p>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {selectedDecision === 'add_real' && (
            <Textarea
              label={g.addRealLabel}
              placeholder={g.addRealPlaceholder}
              value={userText}
              onChange={(e) => handleTextChange(e.target.value)}
              rows={3}
            />
          )}

          {selectedDecision === 'reframe' && gap.reframeSuggestion && (
            <div className="bg-indigo-50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-indigo-700 uppercase tracking-wide mb-1">{g.aiSuggestion}</p>
                  <p className="text-sm text-indigo-900">{gap.reframeSuggestion}</p>
                </div>
              </div>
              <div className="mt-2">
                <Textarea
                  placeholder={g.reframePlaceholder}
                  value={userText || gap.reframeSuggestion}
                  onChange={(e) => handleTextChange(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}

          {selectedDecision === 'learning_statement' && gap.learningSuggestion && (
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-purple-700 uppercase tracking-wide mb-1">{g.suggestedStatement}</p>
                  <p className="text-sm text-purple-900">{gap.learningSuggestion}</p>
                </div>
              </div>
              <div className="mt-2">
                <Textarea
                  placeholder={g.learningPlaceholder}
                  value={userText || gap.learningSuggestion}
                  onChange={(e) => handleTextChange(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

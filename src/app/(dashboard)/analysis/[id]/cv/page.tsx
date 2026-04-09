'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, Plus, Loader2, Languages } from 'lucide-react'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import MatchScore from '@/components/analysis/MatchScore'
import toast from 'react-hot-toast'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { Language } from '@/lib/i18n/translations'

interface TailoredCVData {
  id: string
  content: string
  htmlContent?: string
  createdAt: string
  analysis: {
    id: string
    jobTitle?: string
    company?: string
    matchScore?: number
    matchSummary?: string
    gaps: Array<{ status: string; userDecision?: string; requirement: string }>
  }
}

export default function TailoredCVPage() {
  const params = useParams()
  const router = useRouter()
  const { t, language } = useLanguage()
  const tc = t.tailoredCv

  const [data, setData] = useState<TailoredCVData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [downloadingTxt, setDownloadingTxt] = useState(false)

  // ── Translation state ───────────────────────────────────────────────────
  // Cache translated versions so switching back is instant (no re-API call).
  const translationCache = useRef<Partial<Record<Language, string>>>({})
  const [translating, setTranslating] = useState(false)
  // The content currently shown — may be a translated version
  const [displayContent, setDisplayContent] = useState<string | null>(null)

  useEffect(() => { fetchCV() }, [])

  // Trigger translation (or switch back to English) whenever language or loaded CV changes.
  useEffect(() => {
    if (!data?.content) return
    applyLanguage(language, data.content)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, data?.id])

  /**
   * Determine which content to display for the given language.
   * - If we already have a cached translation, use it instantly.
   * - If the language matches the stored content (assumed English by default),
   *   use the raw stored content.
   * - Otherwise call the translate API and cache the result.
   */
  const applyLanguage = async (lang: Language, rawContent: string) => {
    // If requesting English, just show the cached English source
    if (lang === 'en') {
      setDisplayContent(translationCache.current['en'] ?? rawContent)
      return
    }

    // Cache English as the source of truth
    if (!translationCache.current['en']) {
      translationCache.current['en'] = rawContent
    }

    // Use cached Spanish if we already translated
    if (translationCache.current['es']) {
      setDisplayContent(translationCache.current['es'])
      return
    }

    // Need to call the translation API
    setTranslating(true)
    const toastId = toast.loading('Traduciendo CV...')
    try {
      const englishContent = translationCache.current['en']!
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: englishContent, targetLanguage: 'es' }),
      })
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody?.error ?? `HTTP ${res.status}`)
      }
      const json = await res.json()
      const translated: string = json.content

      // Guard against silent no-op (API key not set → returns original unchanged)
      if (!translated || translated.trim() === englishContent.trim()) {
        throw new Error('Translation returned unchanged content — check ANTHROPIC_API_KEY')
      }

      translationCache.current['es'] = translated
      setDisplayContent(translated)
      toast.success('CV traducido al español', { id: toastId })
    } catch (err: any) {
      console.error('[CV Translation]', err)
      toast.error(`No se pudo traducir el CV: ${err?.message ?? 'error desconocido'}`, {
        id: toastId,
        duration: 6000,
      })
      // Stay on English content
      setDisplayContent(translationCache.current['en'] ?? rawContent)
    } finally {
      setTranslating(false)
    }
  }

  const fetchCV = async () => {
    try {
      const analysisRes = await fetch(`/api/analyze/${params.id}/gaps`)
      const analysisData = await analysisRes.json()
      if (!analysisRes.ok) throw new Error(analysisData.error)

      const analysis = analysisData.analysis
      if (!analysis.tailoredCVs || analysis.tailoredCVs.length === 0) {
        router.push(`/analysis/${params.id}/gaps`)
        return
      }

      const rawContent = analysis.tailoredCVs[0].content
      setData({
        id: analysis.tailoredCVs[0].id,
        content: rawContent,
        htmlContent: analysis.tailoredCVs[0].htmlContent,
        createdAt: analysis.tailoredCVs[0].createdAt,
        analysis: {
          id: analysis.id,
          jobTitle: analysis.jobTitle,
          company: analysis.company,
          matchScore: analysis.matchScore,
          matchSummary: analysis.matchSummary,
          gaps: analysis.gaps,
        },
      })
      // Seed the English cache — the language useEffect will handle display
      translationCache.current = { en: rawContent }
      setDisplayContent(rawContent) // show English immediately while any translation loads
    } catch (error: any) {
      toast.error(tc.toast.loadError)
    } finally {
      setLoading(false)
    }
  }

  // -------------------------------------------------------------------------
  // PDF download — generates a REAL TEXT-BASED PDF using jsPDF's text API.
  //
  // Why not html2canvas?  That approach rasterises the CV to a PNG image,
  // which is completely invisible to Applicant Tracking Systems (ATS).
  // ATS parsers need real selectable Unicode text embedded in the PDF.
  //
  // This renderer parses the markdown CV content line-by-line and places
  // each element with jsPDF's text/line primitives, producing a PDF that:
  //   • contains fully selectable, copy-pasteable text
  //   • passes every ATS keyword scan
  //   • uses only Helvetica (standard, always available, no embedding needed)
  //   • uses only black and dark-grey — no colour
  //   • handles automatic page breaks with section headers kept with content
  // -------------------------------------------------------------------------
  const handleDownloadPDF = async () => {
    if (!data || downloadingPDF) return
    setDownloadingPDF(true)
    const toastId = toast.loading(tc.toast.generating)

    // Use the currently displayed (possibly translated) content
    const contentToRender = displayContent ?? data.content

    try {
      const { default: jsPDF } = await import('jspdf')

      // ── Page geometry ────────────────────────────────────────────────────
      const PW   = 210   // A4 width  mm
      const PH   = 297   // A4 height mm
      const MX   = 20    // horizontal margin mm
      const MY   = 18    // vertical margin mm
      const TW   = PW - MX * 2   // usable text width (170 mm)

      const pdf  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      let y      = MY

      // ── Helpers ──────────────────────────────────────────────────────────

      /** Advance to next page if `needed` mm won't fit.
       *  `keepBuffer` adds extra space so section headers are never orphaned. */
      const room = (needed: number, keepBuffer = 0) => {
        if (y + needed + keepBuffer > PH - MY) { pdf.addPage(); y = MY }
      }

      /** Draw a full-width horizontal rule. */
      const rule = (gray: number, thickness: number) => {
        pdf.setDrawColor(gray, gray, gray)
        pdf.setLineWidth(thickness)
        pdf.line(MX, y, PW - MX, y)
      }

      /** Strip all markdown bold/italic markers from a string. */
      const strip = (s: string) =>
        s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')

      /**
       * Render wrapped text and advance y.
       * Returns the number of mm consumed.
       */
      const write = (
        text:   string,
        size:   number,
        style:  string,
        rgb:    [number, number, number],
        indent  = 0,
        gap     = 1.2,      // mm gap added after the block
        leading = 1.45,     // line-height multiplier
      ): number => {
        pdf.setFont('helvetica', style)
        pdf.setFontSize(size)
        pdf.setTextColor(...rgb)
        const lines  = pdf.splitTextToSize(text, TW - indent)
        const lineH  = size * 0.353 * leading   // 1 pt = 0.353 mm
        room(lines.length * lineH + gap)
        pdf.text(lines, MX + indent, y)
        const used = lines.length * lineH + gap
        y += used
        return used
      }

      // ── Parse markdown and render ─────────────────────────────────────────
      const lines       = contentToRender.split('\n')
      let firstHeading  = true   // first ## becomes the candidate name
      let inHeaderBlock = true   // true until the first --- divider (contact area)

      for (const raw of lines) {
        const line = raw.trim()

        // blank line
        if (!line) { y += inHeaderBlock ? 0.6 : 1.2; continue }

        // ── horizontal rule  ---
        if (line === '---') {
          y += 1.5
          rule(170, 0.25)
          y += 2.5
          inHeaderBlock = false
          continue
        }

        // ── ## heading  (name on first encounter, section header afterwards)
        if (line.startsWith('## ')) {
          const text = strip(line.slice(3))

          // A line is a SECTION HEADER (not the name) if it is all-uppercase
          // OR matches a known CV section keyword — guards against the AI
          // accidentally skipping the ## name line and hitting a section first.
          const KNOWN_SECTIONS = [
            'PROFESSIONAL SUMMARY','SUMMARY','CORE COMPETENCIES','COMPETENCIES',
            'SKILLS','WORK EXPERIENCE','EXPERIENCE','EDUCATION','CERTIFICATIONS',
            'LANGUAGES','AWARDS','ACHIEVEMENTS','PROFILE','OBJECTIVE',
          ]
          const looksLikeSection =
            text === text.toUpperCase() ||
            KNOWN_SECTIONS.includes(text.toUpperCase().trim())

          if (firstHeading && !looksLikeSection) {
            // Candidate name
            room(12)
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(20)
            pdf.setTextColor(10, 10, 10)
            pdf.text(text, MX, y)
            y += 9
            firstHeading   = false
            inHeaderBlock  = true
          } else {
            // Section header — ensure at least 12 mm below for first content line
            firstHeading = false   // in case name was rendered via bold-line path
            room(8, 12)
            y += 3.5
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(10)
            pdf.setTextColor(25, 25, 25)
            pdf.text(text.toUpperCase(), MX, y)
            y += 1.5
            rule(70, 0.4)
            y += 4
          }
          continue
        }

        // ── # heading  (alternate name format)
        if (line.startsWith('# ')) {
          const text = strip(line.slice(2))
          room(12)
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(20)
          pdf.setTextColor(10, 10, 10)
          pdf.text(text, MX, y)
          y += 9
          firstHeading  = false
          inHeaderBlock = true
          continue
        }

        // ── bullet point  - or *
        if (line.startsWith('- ') || line.startsWith('* ')) {
          const text    = strip(line.slice(2))
          const INDENT  = 4.5
          const SIZE    = 10
          const lineH   = SIZE * 0.353 * 1.42
          const wrapped = pdf.splitTextToSize(text, TW - INDENT)
          room(wrapped.length * lineH + 1)
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(SIZE)
          pdf.setTextColor(30, 30, 30)
          pdf.text('-', MX, y)                          // plain hyphen = ATS safe
          pdf.text(wrapped, MX + INDENT, y)
          y += wrapped.length * lineH + 1
          continue
        }

        // ── all-italic line  *dates / company / location*
        const isAllItalic = (
          line.startsWith('*') && line.endsWith('*') &&
          !line.startsWith('**') && line.length > 2
        )
        if (isAllItalic) {
          write(strip(line.slice(1, -1)), 9.5, 'italic', [90, 90, 90], 0, 1.0)
          continue
        }

        // ── bold-leading line  **Job Title** | Company …
        // Special case: if this is the very first bold line and firstHeading is
        // still true, treat it as the candidate's name (the AI skipped ## prefix).
        if (line.startsWith('**')) {
          if (firstHeading) {
            const text = strip(line)
            room(12)
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(20)
            pdf.setTextColor(10, 10, 10)
            pdf.text(text, MX, y)
            y += 9
            firstHeading  = false
            inHeaderBlock = true
          } else {
            write(strip(line), 10.5, 'bold', [15, 15, 15], 0, 1.0)
          }
          continue
        }

        // ── contact / tagline lines (between name and first ---)
        if (inHeaderBlock) {
          write(strip(line), 9.5, 'normal', [75, 75, 75], 0, 0.6)
          continue
        }

        // ── regular paragraph
        write(strip(line), 10, 'normal', [30, 30, 30])
      }

      // ── Save ─────────────────────────────────────────────────────────────
      const safeName = (data.analysis.jobTitle ?? 'cv')
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase()
      pdf.save(`tailored-cv-${safeName}.pdf`)
      toast.success(tc.toast.pdfSuccess, { id: toastId })

    } catch (err: any) {
      console.error('PDF generation error:', err)
      toast.error(tc.toast.pdfError, { id: toastId })
    } finally {
      setDownloadingPDF(false)
    }
  }

  // -------------------------------------------------------------------------
  // Plain-text download (unchanged)
  // -------------------------------------------------------------------------
  const handleDownloadTxt = async () => {
    if (!data || downloadingTxt) return
    setDownloadingTxt(true)
    try {
      // Use displayed (translated) content for the TXT file
      const textContent = displayContent ?? data.content
      const blob = new Blob([textContent], { type: 'text/plain' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `tailored-cv-${language}-${data.id}.txt`
      a.click()
      URL.revokeObjectURL(a.href)
      toast.success(tc.toast.txtSuccess)
    } catch {
      toast.error(tc.toast.txtError)
    } finally {
      setDownloadingTxt(false)
    }
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text={tc.loading} />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">{tc.notFound}</p>
        <Link href="/history" className="text-indigo-600 mt-2 block">
          {tc.goToHistory}
        </Link>
      </div>
    )
  }

  const changesCount = data.analysis.gaps.filter(
    (g) => g.userDecision && g.userDecision !== 'keep' && g.userDecision !== 'skip'
  ).length

  const renderContent = (content: string) => {
    const strip = (s: string) => s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')
    const lines = content.split('\n')
    let firstHeading = true
    return lines.map((line, i) => {
      if (line.startsWith('## ')) {
        const text = strip(line.slice(3))
        if (firstHeading) {
          firstHeading = false
          return <h1 key={i} className="text-2xl font-bold text-gray-900 mb-0.5">{text}</h1>
        }
        return (
          <h2 key={i} className="text-[11px] font-bold text-gray-800 uppercase tracking-wide mt-5 mb-1 border-b border-gray-400 pb-0.5">
            {text}
          </h2>
        )
      }
      if (line.startsWith('# ')) {
        firstHeading = false
        return <h1 key={i} className="text-2xl font-bold text-gray-900 mb-0.5">{strip(line.slice(2))}</h1>
      }
      if (line === '---') return <hr key={i} className="my-3 border-gray-300" />
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={i} className="flex gap-2 text-gray-700 text-sm leading-snug mb-0.5">
            <span className="mt-0.5 shrink-0">-</span>
            <span>{strip(line.slice(2))}</span>
          </div>
        )
      }
      if (!line.trim()) return <div key={i} className="h-1.5" />
      const isItalic = line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')
      if (isItalic) {
        return <p key={i} className="text-gray-500 text-xs leading-snug italic mb-0.5">{strip(line.slice(1,-1))}</p>
      }
      if (line.startsWith('**')) {
        return <p key={i} className="text-gray-900 text-sm font-semibold leading-snug mb-0.5">{strip(line)}</p>
      }
      return (
        <p key={i} className="text-gray-700 text-sm leading-snug mb-0.5">
          {strip(line)}
        </p>
      )
    })
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href={`/analysis/${data.analysis.id}/gaps`}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {tc.backToGaps}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{tc.title}</h1>
          {data.analysis.jobTitle && (
            <p className="text-gray-600 mt-1">
              {tc.tailoredFor} <span className="font-medium">{data.analysis.jobTitle}</span>
              {data.analysis.company && <span> {tc.at} {data.analysis.company}</span>}
            </p>
          )}
        </div>
        <Link href="/analyze">
          <Button variant="secondary" size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            {tc.newAnalysis}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CV Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
              <FileText className="h-4 w-4" />
              {tc.preview}
            </div>
            <div className="relative p-8 space-y-1 max-h-[800px] overflow-y-auto">
              {translating && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-b-2xl gap-3">
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                  <p className="text-sm font-medium text-gray-600">
                    {language === 'es' ? 'Traduciendo CV...' : 'Translating CV...'}
                  </p>
                </div>
              )}
              {renderContent(displayContent ?? data.content)}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {data.analysis.matchScore && (
            <MatchScore
              score={data.analysis.matchScore}
              summary={data.analysis.matchSummary}
            />
          )}

          {/* Download buttons */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-semibold text-gray-900">{tc.downloadTitle}</h3>

            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              {downloadingPDF ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {tc.generatingPdf}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {tc.downloadPdf}
                </>
              )}
            </button>

            <button
              onClick={handleDownloadTxt}
              disabled={downloadingTxt}
              className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg border border-gray-200 transition-colors"
            >
              {downloadingTxt ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {tc.downloading}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {tc.downloadTxt}
                </>
              )}
            </button>
          </div>

          {/* Changes summary */}
          {changesCount > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">{tc.changesTitle}</h3>
              <p className="text-sm text-gray-600">
                <span className="font-bold text-indigo-600">
                  {tc.enhancements.replace('{n}', String(changesCount))}
                </span>{' '}
                {tc.incorporated}
              </p>
              <div className="mt-3 space-y-2">
                {data.analysis.gaps
                  .filter((g) => g.userDecision && g.userDecision !== 'keep' && g.userDecision !== 'skip')
                  .slice(0, 5)
                  .map((gap, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0 mt-1.5" />
                      <span>{gap.requirement}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

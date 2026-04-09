/**
 * CV HTML generator
 *
 * Converts the markdown-style CV text produced by the AI into a clean,
 * print-ready HTML document.  The HTML is fetched client-side, rendered
 * off-screen, captured by html2canvas, and paginated into a PDF by jsPDF.
 *
 * Design goals:
 *  - No body padding/margin  →  jsPDF supplies the page margins itself
 *  - Tight vertical rhythm   →  keeps the CV on as few pages as possible
 *  - Clean ATS layout        →  no tables, columns, or graphics
 */
export function generateCVHTML(content: string): string {
  const lines = content.split('\n')

  let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10.5pt;
    line-height: 1.4;
    color: #1a1a1a;
    background: #fff;
    width: 100%;
    /* Bottom padding ensures the last line of the CV is never clipped by
       html2canvas — the canvas captures to the bottom of the rendered content
       but without padding the final row of pixels can be cut off. */
    padding-bottom: 32px;
  }

  /* ── Name heading ────────────────────────────────── */
  h1 {
    font-size: 20pt;
    font-weight: 700;
    color: #111;
    margin-bottom: 2px;
  }

  /* ── Section headers ─────────────────────────────── */
  .section-header {
    font-size: 9.5pt;
    font-weight: 700;
    color: #333333;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 1.5px solid #333333;
    padding-bottom: 2px;
    margin-top: 10px;
    margin-bottom: 5px;
  }

  /* ── Contact / tagline line ──────────────────────── */
  .contact-line {
    font-size: 9.5pt;
    color: #444;
    margin-bottom: 2px;
  }

  .tagline {
    font-size: 10pt;
    font-weight: 600;
    color: #333;
    margin-bottom: 3px;
  }

  /* ── Divider ─────────────────────────────────────── */
  .divider {
    border: none;
    border-top: 1.5px solid #333333;
    margin: 6px 0 8px;
  }

  /* ── Body text ───────────────────────────────────── */
  p {
    margin-bottom: 3px;
    font-size: 10.5pt;
  }

  em {
    font-style: italic;
    color: #555;
    font-size: 9.5pt;
  }

  strong {
    font-weight: 700;
    color: #111;
  }

  /* ── Bullet lists ────────────────────────────────── */
  ul {
    list-style-type: disc;
    padding-left: 16px;
    margin-bottom: 4px;
    margin-top: 2px;
  }

  li {
    margin-bottom: 1px;
    font-size: 10pt;
    line-height: 1.35;
  }

  /* ── Page-break hints ────────────────────────────── */
  /* Keep a section header glued to the content that follows it */
  .section-header {
    page-break-after: avoid;
    break-after: avoid;
  }
  /* Never break inside a paragraph or a list item */
  p, li {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  /* Never orphan a single bullet at the bottom of a page */
  ul {
    page-break-inside: avoid;
    break-inside: avoid;
  }
</style>
</head>
<body>
`

  let inList = false
  let isFirstLine = true
  // Track consecutive blank lines to collapse them
  let blankCount = 0

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const trimmed = line.trim()

    // ── Blank line ──────────────────────────────────────────────────────────
    if (!trimmed) {
      blankCount++
      if (inList) {
        html += '</ul>\n'
        inList = false
      }
      // Allow at most one collapsed blank (renders as small gap via margin)
      // Don't emit multiple <br> in a row
      if (blankCount === 1) {
        html += '<div style="height:3px"></div>\n'
      }
      continue
    }

    blankCount = 0

    // ── Horizontal rule  (--- in markdown) ─────────────────────────────────
    if (trimmed === '---') {
      if (inList) { html += '</ul>\n'; inList = false }
      html += '<hr class="divider">\n'
      continue
    }

    // ── H1 — candidate name ─────────────────────────────────────────────────
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
      if (inList) { html += '</ul>\n'; inList = false }
      html += `<h1>${esc(trimmed.slice(2))}</h1>\n`
      isFirstLine = false
      continue
    }

    // ── H2 — section headers ────────────────────────────────────────────────
    if (trimmed.startsWith('## ')) {
      if (inList) { html += '</ul>\n'; inList = false }
      const text = trimmed.slice(3)
      if (isFirstLine) {
        // First ## is the name if no # was found
        html += `<h1>${esc(text)}</h1>\n`
        isFirstLine = false
      } else {
        html += `<div class="section-header">${esc(text)}</div>\n`
      }
      continue
    }

    isFirstLine = false

    // ── Bullet point ────────────────────────────────────────────────────────
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) { html += '<ul>\n'; inList = true }
      html += `<li>${inlineMarkdown(trimmed.slice(2))}</li>\n`
      continue
    }

    // Close list before any non-bullet paragraph
    if (inList) { html += '</ul>\n'; inList = false }

    // ── Italic-only line (dates / company info) ─────────────────────────────
    if (trimmed.startsWith('*') && trimmed.endsWith('*') && trimmed.length > 2) {
      html += `<p><em>${esc(trimmed.slice(1, -1))}</em></p>\n`
      continue
    }

    // ── Regular paragraph ────────────────────────────────────────────────────
    html += `<p>${inlineMarkdown(trimmed)}</p>\n`
  }

  if (inList) html += '</ul>\n'
  html += '</body></html>'
  return html
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inlineMarkdown(text: string): string {
  return esc(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,     '<em>$1</em>')
    .replace(/`(.*?)`/g,       '<code>$1</code>')
}

export function cvContentToPlainText(content: string): string {
  return content
    .replace(/^## /gm, '')
    .replace(/^# /gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^- /gm, '• ')
    .replace(/^---$/gm, '─'.repeat(50))
}

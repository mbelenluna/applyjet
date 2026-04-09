/**
 * AI Integration Layer — powered by Anthropic Claude
 *
 * Uses claude-opus-4-5 for all AI tasks: CV parsing, gap analysis,
 * reframe suggestions, and full CV generation.
 *
 * Falls back to rich mock data when ANTHROPIC_API_KEY is not set,
 * so the full UI flow is testable without an API key.
 */

import Anthropic from '@anthropic-ai/sdk'
import {
  ParsedProfile,
  JobRequirements,
  GapAnalysisResult,
  GapAnalysisItem,
} from './types'
import {
  CV_PARSING_PROMPT,
  JOB_REQUIREMENTS_PROMPT,
  GAP_ANALYSIS_PROMPT,
  REFRAME_SUGGESTION_PROMPT,
  CV_GENERATION_PROMPT,
  CV_TRANSLATION_PROMPT,
} from './prompts'

// ---------------------------------------------------------------------------
// Client singleton
// ---------------------------------------------------------------------------

let anthropicClient: Anthropic | null = null

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key || key === 'sk-ant-your-anthropic-api-key-here') return null
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: key })
  }
  return anthropicClient
}

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/** Call Claude and expect a JSON response (uses system prompt). */
async function callClaude(
  systemPrompt: string,
  userContent: string,
  retries = 2
): Promise<string> {
  const client = getClient()
  if (!client) throw new Error('Anthropic client not available')

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }],
      })

      const block = message.content[0]
      if (block.type !== 'text') throw new Error('Unexpected response type')

      // Strip any markdown code fences Claude might add around JSON
      const text = block.text.trim()
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
      return jsonMatch ? jsonMatch[1].trim() : text
    } catch (error) {
      if (attempt === retries) throw error
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
    }
  }
  throw new Error('Failed after retries')
}

/** Call Claude for free-text (non-JSON) responses. */
async function callClaudeText(
  systemPrompt: string,
  userContent: string,
  retries = 2
): Promise<string> {
  const client = getClient()
  if (!client) throw new Error('Anthropic client not available')

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 8192,   // CV generation can be long
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }],
      })

      const block = message.content[0]
      if (block.type !== 'text') throw new Error('Unexpected response type')
      return block.text
    } catch (error) {
      if (attempt === retries) throw error
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
    }
  }
  throw new Error('Failed after retries')
}

// ---------------------------------------------------------------------------
// Mock data (used when no API key is configured)
// ---------------------------------------------------------------------------

function getMockParsedProfile(): ParsedProfile {
  return {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson',
    summary:
      'Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code, user experience, and continuous learning.',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'Agile'],
    technicalSkills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    softSkills: ['Problem-solving', 'Team collaboration', 'Communication', 'Mentoring'],
    workExperience: [
      {
        company: 'TechCorp Inc.',
        title: 'Senior Software Engineer',
        startDate: 'Jan 2021',
        endDate: 'Present',
        location: 'San Francisco, CA',
        description: [
          'Led development of customer-facing React applications serving 100K+ users',
          'Architected microservices backend using Node.js and PostgreSQL',
          'Mentored 3 junior developers and conducted code reviews',
          'Reduced page load time by 40% through performance optimisation',
        ],
        achievements: [
          'Delivered critical payment integration 2 weeks ahead of schedule',
          'Reduced bug count by 60% by introducing automated testing',
        ],
      },
      {
        company: 'StartupXYZ',
        title: 'Software Engineer',
        startDate: 'Jun 2019',
        endDate: 'Dec 2020',
        location: 'Remote',
        description: [
          'Built and maintained full-stack web applications using React and Express',
          'Collaborated with design team to implement responsive UI components',
          'Integrated third-party APIs including payment and analytics services',
        ],
      },
    ],
    education: [
      {
        institution: 'University of California, Berkeley',
        degree: "Bachelor's",
        field: 'Computer Science',
        startDate: '2015',
        endDate: '2019',
        gpa: '3.7',
      },
    ],
    certifications: [
      {
        name: 'AWS Certified Developer Associate',
        issuer: 'Amazon Web Services',
        date: '2022',
      },
    ],
    languages: ['English (Native)', 'Spanish (Conversational)'],
  }
}

function getMockJobRequirements(): JobRequirements {
  return {
    jobTitle: 'Full Stack Engineer',
    company: 'InnovateTech',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'RESTful APIs', 'Git'],
    niceToHaveSkills: ['GraphQL', 'Kubernetes', 'Redis', 'Machine Learning'],
    experienceLevel: 'Senior',
    yearsOfExperience: 5,
    educationRequirements: ["Bachelor's in Computer Science or related field"],
    responsibilities: [
      'Design and build scalable web applications',
      'Collaborate with product and design teams',
      'Write clean, testable code',
      'Participate in code reviews',
      'Mentor junior developers',
    ],
    industryKeywords: ['microservices', 'cloud-native', 'agile', 'CI/CD', 'DevOps'],
    certifications: ['AWS or GCP certification preferred'],
    softSkills: ['Communication', 'Problem-solving', 'Team player', 'Self-motivated'],
  }
}

function getMockGapAnalysis(): GapAnalysisResult {
  return {
    matchScore: 78,
    matchSummary:
      'Strong overall match with solid React, Node.js, and PostgreSQL experience. The candidate meets most core requirements. Main gaps are around GraphQL and Kubernetes which are nice-to-have skills. TypeScript experience could be highlighted more explicitly.',
    gaps: [
      {
        requirement: 'React',
        category: 'skill',
        status: 'clearly_present',
        explanation: 'Explicitly mentioned with significant project experience building customer-facing applications.',
        currentCVContent: 'Led development of customer-facing React applications serving 100K+ users',
        suggestedAction: 'Highlight React version experience and specific features used',
        importance: 'high',
        order: 0,
      },
      {
        requirement: 'TypeScript',
        category: 'skill',
        status: 'partially_present',
        explanation: 'TypeScript is listed as a skill but not explicitly called out in work experience descriptions.',
        currentCVContent: 'TypeScript listed in skills section',
        suggestedAction: 'Add TypeScript to work experience bullet points',
        reframeSuggestion:
          'Leveraged TypeScript throughout full-stack development to ensure type safety and improved code maintainability across large codebases.',
        importance: 'high',
        order: 1,
      },
      {
        requirement: 'Node.js',
        category: 'skill',
        status: 'clearly_present',
        explanation: 'Clearly demonstrated through microservices backend architecture work.',
        currentCVContent: 'Architected microservices backend using Node.js and PostgreSQL',
        importance: 'high',
        order: 2,
      },
      {
        requirement: 'GraphQL',
        category: 'skill',
        status: 'missing',
        explanation: 'GraphQL not mentioned anywhere in the CV.',
        suggestedAction: 'If you have any experience, add it. Otherwise consider a learning statement.',
        learningSuggestion:
          'Currently expanding expertise in GraphQL through hands-on projects and the official GraphQL documentation to complement existing REST API experience.',
        importance: 'medium',
        order: 3,
      },
      {
        requirement: 'Kubernetes',
        category: 'skill',
        status: 'probably_present',
        explanation: 'Docker and AWS experience strongly implies container orchestration familiarity.',
        currentCVContent: 'Docker, AWS listed in technical skills',
        suggestedAction: 'Mention Kubernetes exposure if applicable, or relate Docker Compose experience',
        reframeSuggestion:
          'Managed containerised applications using Docker with AWS ECS, with exposure to container orchestration principles applicable to Kubernetes environments.',
        importance: 'medium',
        order: 4,
      },
      {
        requirement: 'Mentoring junior developers',
        category: 'experience',
        status: 'clearly_present',
        explanation: 'Explicitly mentioned mentoring 3 junior developers.',
        currentCVContent: 'Mentored 3 junior developers and conducted code reviews',
        importance: 'medium',
        order: 5,
      },
      {
        requirement: "Bachelor's in Computer Science",
        category: 'education',
        status: 'clearly_present',
        explanation: "Bachelor's in Computer Science from UC Berkeley.",
        currentCVContent: "Bachelor's in Computer Science, UC Berkeley, 2019",
        importance: 'medium',
        order: 6,
      },
      {
        requirement: 'AWS certification',
        category: 'certification',
        status: 'clearly_present',
        explanation: 'AWS Certified Developer Associate certification present.',
        currentCVContent: 'AWS Certified Developer Associate, 2022',
        importance: 'low',
        order: 7,
      },
    ],
  }
}

function getMockTailoredCV(): string {
  return `## Alex Johnson
alex.johnson@email.com | +1 (555) 123-4567 | San Francisco, CA
linkedin.com/in/alexjohnson

---

## Professional Summary

Senior Full Stack Engineer with 5+ years of experience building scalable web applications using React, TypeScript, and Node.js. Proven track record of delivering high-impact features, mentoring development teams, and optimising application performance. AWS Certified Developer with strong expertise in microservices architecture and cloud-native development.

---

## Core Skills

**Frontend:** React, TypeScript, JavaScript (ES6+), Next.js, HTML5, CSS3
**Backend:** Node.js, Express, RESTful APIs, PostgreSQL, SQL
**DevOps & Cloud:** AWS, Docker, CI/CD, Git
**Methodologies:** Agile, Scrum, Code Review, TDD

---

## Work Experience

**Senior Software Engineer** | TechCorp Inc. | San Francisco, CA
*January 2021 – Present*

- Led development of customer-facing React and TypeScript applications serving 100,000+ users, ensuring type-safe, maintainable codebases
- Architected microservices backend using Node.js and PostgreSQL, improving system scalability and reliability
- Mentored 3 junior developers through pair programming, code reviews, and technical guidance
- Reduced page load time by 40% through performance optimisation including lazy loading and caching strategies
- Delivered critical payment integration 2 weeks ahead of schedule, increasing revenue by 15%
- Reduced bug count by 60% by introducing automated testing with Jest and Cypress
- Currently expanding expertise in GraphQL to complement existing RESTful API experience

**Software Engineer** | StartupXYZ | Remote
*June 2019 – December 2020*

- Built and maintained full-stack web applications using React, TypeScript, and Node.js/Express
- Collaborated with design team to implement responsive, accessible UI components
- Integrated third-party APIs including payment (Stripe) and analytics (Segment) services
- Contributed to Agile development process including sprint planning and retrospectives

---

## Education

**Bachelor of Science in Computer Science**
University of California, Berkeley | 2015 – 2019 | GPA: 3.7

---

## Certifications

- AWS Certified Developer – Associate (2022)

---

## Languages

- English (Native)
- Spanish (Conversational)`
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function parseCVText(rawText: string): Promise<ParsedProfile> {
  const client = getClient()
  if (!client) {
    console.log('[AI] No Anthropic API key — returning mock parsed profile')
    return getMockParsedProfile()
  }

  const result = await callClaude(
    CV_PARSING_PROMPT,
    `Parse this CV and return structured JSON:\n\n${rawText}`
  )
  return JSON.parse(result) as ParsedProfile
}

export async function analyzeJobPost(jobPostText: string): Promise<JobRequirements> {
  const client = getClient()
  if (!client) {
    console.log('[AI] No Anthropic API key — returning mock job requirements')
    return getMockJobRequirements()
  }

  const result = await callClaude(
    JOB_REQUIREMENTS_PROMPT,
    `Extract all requirements from this job posting and return structured JSON:\n\n${jobPostText}`
  )
  return JSON.parse(result) as JobRequirements
}

export async function generateGapAnalysis(
  parsedProfile: ParsedProfile,
  jobRequirements: JobRequirements
): Promise<GapAnalysisResult> {
  const client = getClient()
  if (!client) {
    console.log('[AI] No Anthropic API key — returning mock gap analysis')
    return getMockGapAnalysis()
  }

  const userContent = `
CANDIDATE CV DATA:
${JSON.stringify(parsedProfile, null, 2)}

JOB REQUIREMENTS:
${JSON.stringify(jobRequirements, null, 2)}

Perform a thorough gap analysis comparing the candidate's profile against these job requirements. Return structured JSON.`

  const result = await callClaude(GAP_ANALYSIS_PROMPT, userContent)
  return JSON.parse(result) as GapAnalysisResult
}

export async function generateReframeSuggestion(
  requirement: string,
  cvContent: string
): Promise<string> {
  const client = getClient()
  if (!client) {
    return `Leveraged experience with ${cvContent} to develop skills directly applicable to ${requirement} requirements.`
  }

  const userContent = `
Job Requirement: ${requirement}
Candidate's Related CV Experience: ${cvContent}

Provide a concise, honest reframing suggestion (1–2 sentences).`

  return callClaudeText(REFRAME_SUGGESTION_PROMPT, userContent)
}

export async function generateTailoredCV(
  parsedProfile: ParsedProfile,
  jobRequirements: JobRequirements,
  gapDecisions: Array<{
    requirement: string
    status: string
    userDecision: string
    userAddedText?: string
    reframeSuggestion?: string
    learningSuggestion?: string
  }>,
  language: 'en' | 'es' = 'en'
): Promise<string> {
  const client = getClient()
  if (!client) {
    console.log('[AI] No Anthropic API key — returning mock tailored CV')
    return getMockTailoredCV()
  }

  const languageInstruction = language === 'es'
    ? '\n\nOUTPUT LANGUAGE: Write the entire CV in Spanish. Translate all content naturally. Do NOT translate proper nouns (company names, person names, technology names, certification names, city names).'
    : ''

  const userContent = `
MASTER CV DATA:
${JSON.stringify(parsedProfile, null, 2)}

TARGET JOB REQUIREMENTS:
${JSON.stringify(jobRequirements, null, 2)}

GAP DECISIONS (what the candidate chose to do about each gap):
${JSON.stringify(gapDecisions, null, 2)}

Generate a complete, ATS-optimised tailored CV that incorporates all the gap decisions above. Be thorough and produce a polished, professional document.${languageInstruction}`

  return callClaudeText(CV_GENERATION_PROMPT, userContent)
}

export async function translateCV(
  content: string,
  targetLanguage: 'en' | 'es'
): Promise<string> {
  const client = getClient()
  if (!client) {
    // No API key — return content unchanged
    return content
  }

  const langName = targetLanguage === 'es' ? 'Spanish' : 'English'

  return callClaudeText(
    CV_TRANSLATION_PROMPT,
    `TARGET LANGUAGE: ${langName}\n\nCV TO TRANSLATE:\n${content}`
  )
}

export interface ParsedProfile {
  name?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  website?: string
  summary?: string
  skills: string[]
  technicalSkills?: string[]
  softSkills?: string[]
  workExperience: WorkExperience[]
  education: Education[]
  certifications?: Certification[]
  achievements?: string[]
  languages?: string[]
}

export interface WorkExperience {
  company: string
  title: string
  startDate: string
  endDate: string
  location?: string
  description: string[]
  achievements?: string[]
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate?: string
  endDate?: string
  gpa?: string
  honors?: string[]
}

export interface Certification {
  name: string
  issuer?: string
  date?: string
  expiry?: string
}

export interface JobRequirements {
  jobTitle?: string
  company?: string
  requiredSkills: string[]
  niceToHaveSkills: string[]
  experienceLevel?: string
  yearsOfExperience?: number
  educationRequirements?: string[]
  responsibilities: string[]
  industryKeywords: string[]
  certifications?: string[]
  softSkills?: string[]
}

export interface GapAnalysisItem {
  requirement: string
  category: 'skill' | 'experience' | 'education' | 'certification' | 'soft_skill'
  status: 'clearly_present' | 'partially_present' | 'probably_present' | 'missing'
  explanation: string
  currentCVContent?: string
  suggestedAction?: string
  reframeSuggestion?: string
  learningSuggestion?: string
  importance: 'high' | 'medium' | 'low'
  order: number
}

export interface GapAnalysisResult {
  matchScore: number
  matchSummary: string
  gaps: GapAnalysisItem[]
}

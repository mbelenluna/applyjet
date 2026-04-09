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

export type GapStatus = 'clearly_present' | 'partially_present' | 'probably_present' | 'missing'
export type GapCategory = 'skill' | 'experience' | 'education' | 'certification' | 'soft_skill'
export type UserDecision = 'keep' | 'add_real' | 'reframe' | 'learning_statement' | 'skip'
export type GapImportance = 'high' | 'medium' | 'low'

export interface GapAnalysisItem {
  requirement: string
  category: GapCategory
  status: GapStatus
  explanation: string
  currentCVContent?: string
  suggestedAction?: string
  reframeSuggestion?: string
  learningSuggestion?: string
  importance: GapImportance
  order: number
}

export interface GapDecision {
  id: string
  userDecision: UserDecision
  userAddedText?: string
}

export interface AnalysisResult {
  id: string
  jobTitle?: string
  company?: string
  matchScore: number
  matchSummary: string
  status: string
  createdAt: string
  gaps: RequirementGapWithId[]
}

export interface RequirementGapWithId extends GapAnalysisItem {
  id: string
  analysisId: string
  userDecision?: UserDecision
  userAddedText?: string
}

export interface TailoredCVData {
  id: string
  content: string
  htmlContent?: string
  fileUrl?: string
  createdAt: string
}

export interface DashboardStats {
  hasCV: boolean
  totalAnalyses: number
  lastAnalysisDate?: string
  avgMatchScore?: number
}

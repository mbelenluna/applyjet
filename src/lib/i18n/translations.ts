export type Language = 'en' | 'es'

export interface Translations {
  // ── Navigation ──────────────────────────────────────────────────────────
  nav: {
    dashboard: string
    myCv: string
    analyzeJob: string
    history: string
    settings: string
    signOut: string
    logIn: string
    getStartedFree: string
    language: string
  }

  // ── Landing ──────────────────────────────────────────────────────────────
  landing: {
    hero: {
      badge: string
      headline1: string
      headline2: string
      headline3: string
      subtitle: string
      getStarted: string
      signIn: string
      noCreditCard: string
      matchScore: string
      strongMatches: string
      gapsFound: string
    }
    features: {
      heading: string
      subheading: string
      items: Array<{ title: string; description: string }>
    }
    howItWorks: {
      heading: string
      subheading: string
      startFree: string
      steps: Array<{ title: string; description: string }>
    }
    cta: {
      heading: string
      subheading: string
      button: string
    }
    footer: {
      tagline: string
    }
  }

  // ── Auth ─────────────────────────────────────────────────────────────────
  auth: {
    signup: {
      title: string
      subtitle: string
      fullName: string
      emailAddress: string
      password: string
      createAccount: string
      alreadyHaveAccount: string
      signIn: string
      passwordRules: {
        length: string
        uppercase: string
        lowercase: string
        number: string
      }
    }
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  dashboard: {
    loading: string
    welcome: string
    readyToTailor: string
    uploadFirst: string
    stats: {
      masterCv: string
      uploadOne: string
      jobAnalyses: string
      avgMatchScore: string
    }
    quickActions: {
      title: string
      updateCv: string
      uploadCv: string
      updateCvDesc: string
      uploadCvDesc: string
      analyzeJob: string
      analyzeJobDesc: string
      viewHistory: string
      viewHistoryDesc: string
      goNow: string
    }
    recentAnalyses: {
      title: string
      viewAll: string
      untitledJob: string
      viewCv: string
      continue: string
    }
  }

  // ── My CV page ────────────────────────────────────────────────────────────
  cvPage: {
    loading: string
    title: string
    subtitle: string
    uploadSubtitle: string
    replaceCV: string
    delete: string
    uploadTitle: string
    supportedFormats: string
    replaceModal: { title: string; description: string }
    deleteModal: {
      title: string
      description: string
      confirm: string
      cancel: string
    }
    toast: {
      updateSuccess: string
      loadError: string
      deleteSuccess: string
      deleteError: string
    }
  }

  // ── CV Upload component ───────────────────────────────────────────────────
  upload: {
    dragging: string
    idle: string
    browse: string
    remove: string
    button: string
    processing: string
    uploading: string
    parsing: string
    extracting: string
    toast: {
      invalidFormat: string
      fileTooLarge: string
      success: string
      error: string
    }
  }

  // ── CV Preview component ──────────────────────────────────────────────────
  cvPreview: {
    yourName: string
    skills: string
    workExperience: string
    education: string
    certifications: string
    morePoints: string
    parsedFrom: string
    lastUpdated: string
    degreeIn: string
    gpa: string
  }

  // ── Analyze page ──────────────────────────────────────────────────────────
  analyze: {
    title: string
    subtitle: string
    noCvTitle: string
    noCvMessage: string
    noCvLink: string
    noCvAfter: string
    cvReady: string
    jobTitle: string
    jobTitlePlaceholder: string
    company: string
    companyPlaceholder: string
    jobDescription: string
    jobDescPlaceholder: string
    jobDescHint: string
    characters: string
    submit: string
    analyzingTitle: string
    takesTime: string
    steps: string[]
    validationRequired: string
    validationTooShort: string
    toast: { noCv: string; success: string }
  }

  // ── History page ──────────────────────────────────────────────────────────
  history: {
    loading: string
    title: string
    subtitle: string
    newAnalysis: string
    emptyTitle: string
    emptyMessage: string
    emptyButton: string
    colJob: string
    colDate: string
    colMatch: string
    colStatus: string
    colActions: string
    untitledJob: string
    gaps: string
    cv: string
  }

  // ── Settings page ─────────────────────────────────────────────────────────
  settings: {
    title: string
    subtitle: string
    profile: {
      title: string
      fullName: string
      namePlaceholder: string
      emailAddress: string
      emailHint: string
      save: string
    }
    security: {
      title: string
      currentPassword: string
      currentPlaceholder: string
      newPassword: string
      newPlaceholder: string
      confirmPassword: string
      confirmPlaceholder: string
      update: string
      errors: {
        currentRequired: string
        newRequired: string
        minLength: string
        noMatch: string
      }
    }
    masterCv: {
      title: string
      description: string
      manage: string
    }
    dangerZone: {
      title: string
      description: string
      deleteButton: string
      modalTitle: string
      modalWarning: string
      cannotBeUndone: string
      typeDelete: string
      confirm: string
      cancel: string
    }
    toast: {
      profileUpdated: string
      profileError: string
      passwordUpdated: string
      passwordError: string
      deleteError: string
    }
  }

  // ── Gap Analysis ──────────────────────────────────────────────────────────
  gaps: {
    title: string
    reviewSubtitle: string
    lowMatchWarningTitle: string
    lowMatchWarningBody: string
    progressLabel: string
    progressUnit: string
    strongMatches: string
    moderateGaps: string
    missingRequirements: string
    allReviewed: string
    reviewMore: string
    reviewMorePlural: string
    generateButton: string
    at: string
    toast: {
      reviewFirst: string
      generated: string
      saveError: string
      generateError: string
    }
    analyzing: {
      title: string
      body: string
    }
  }

  // ── Gap Card ──────────────────────────────────────────────────────────────
  gapCard: {
    status: {
      clearly_present: string
      partially_present: string
      probably_present: string
      missing: string
    }
    importance: string
    analysisLabel: string
    inYourCv: string
    howToHandle: string
    decisions: {
      keep: { label: string; description: string }
      add_real: { label: string; description: string }
      reframe: { label: string; description: string }
      learning_statement: { label: string; description: string }
      skip: { label: string; description: string }
    }
    addRealLabel: string
    addRealPlaceholder: string
    aiSuggestion: string
    suggestedStatement: string
    reframePlaceholder: string
    learningPlaceholder: string
  }

  // ── Match Score component ─────────────────────────────────────────────────
  matchScore: {
    excellent: string
    good: string
    fair: string
    poor: string
    strongMatches: string
    partialMatches: string
    probableMatches: string
    missing: string
  }

  // ── Tailored CV page ──────────────────────────────────────────────────────
  tailoredCv: {
    loading: string
    backToGaps: string
    title: string
    tailoredFor: string
    at: string
    newAnalysis: string
    preview: string
    downloadTitle: string
    downloadPdf: string
    downloadTxt: string
    generatingPdf: string
    downloading: string
    changesTitle: string
    enhancements: string
    incorporated: string
    notFound: string
    goToHistory: string
    toast: {
      loadError: string
      pdfSuccess: string
      pdfError: string
      txtSuccess: string
      txtError: string
      generating: string
    }
  }

  // ── Utils (getStatusLabel) ────────────────────────────────────────────────
  status: {
    analyzing: string
    gaps_review: string
    generating: string
    complete: string
  }

  // ── Common ────────────────────────────────────────────────────────────────
  common: {
    loading: string
    cancel: string
    save: string
    delete: string
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ENGLISH
// ─────────────────────────────────────────────────────────────────────────────
export const en: Translations = {
  nav: {
    dashboard: 'Dashboard',
    myCv: 'My CV',
    analyzeJob: 'Analyze Job',
    history: 'History',
    settings: 'Settings',
    signOut: 'Sign out',
    logIn: 'Log in',
    getStartedFree: 'Get Started Free',
    language: 'ES',
  },
  landing: {
    hero: {
      badge: 'AI-Powered CV Optimization',
      headline1: 'Upload your CV once.',
      headline2: 'Tailor it to every job',
      headline3: 'faster.',
      subtitle:
        'ApplyJet analyzes your CV against job postings, identifies skill gaps, and generates ATS-optimized tailored CVs — all while keeping everything 100% truthful.',
      getStarted: 'Get Started Free',
      signIn: 'Sign in',
      noCreditCard: 'No credit card required. Free to get started.',
      matchScore: 'Match Score',
      strongMatches: 'Strong Matches',
      gapsFound: 'Gaps Found',
    },
    features: {
      heading: 'Everything you need to land the job',
      subheading:
        'Stop sending the same CV to every employer. Tailor it intelligently with AI that understands what hiring managers are looking for.',
      items: [
        {
          title: 'Gap Analysis',
          description:
            "AI compares your CV against job requirements and identifies exactly what's missing, partial, or present.",
        },
        {
          title: 'Smart Suggestions',
          description:
            'Get AI-powered suggestions to reframe existing experience, add real accomplishments, or add honest learning statements.',
        },
        {
          title: 'ATS-Friendly Output',
          description:
            'Generated CVs are optimized for Applicant Tracking Systems with proper keywords and clean formatting.',
        },
        {
          title: '100% Truthful',
          description:
            'We never fabricate. Every suggestion is based on your real experience. Your integrity is protected.',
        },
        {
          title: 'Match Score',
          description:
            'See your compatibility score instantly. Understand at a glance if a role is a good fit before applying.',
        },
        {
          title: 'Instant Download',
          description:
            'Download your tailored CV as a professional PDF immediately. Ready to submit in seconds.',
        },
      ],
    },
    howItWorks: {
      heading: 'How it works',
      subheading: 'From CV upload to tailored application in under 5 minutes.',
      startFree: 'Start for free',
      steps: [
        {
          title: 'Upload Your Master CV',
          description:
            'Upload your CV once as PDF or DOCX. Our AI parses and stores your full professional profile.',
        },
        {
          title: 'Paste a Job Posting',
          description:
            'Copy and paste any job description. We extract all requirements and responsibilities automatically.',
        },
        {
          title: 'Review Gap Analysis',
          description:
            'See exactly which requirements you meet, partially meet, or are missing. Get a compatibility score.',
        },
        {
          title: 'Handle Each Gap',
          description:
            'For each gap, choose: ignore it, add real experience, reframe existing skills, or add a learning statement.',
        },
        {
          title: 'Download Your Tailored CV',
          description:
            'Get a polished, ATS-optimized CV tailored to that specific role. Download as PDF instantly.',
        },
      ],
    },
    cta: {
      heading: 'Ready to land your dream job?',
      subheading:
        'Join thousands of job seekers who use ApplyJet to stand out from the crowd.',
      button: 'Get Started Free',
    },
    footer: {
      tagline: 'Built to help you succeed.',
    },
  },
  auth: {
    signup: {
      title: 'Create your account',
      subtitle: 'Start tailoring your CV to every job',
      fullName: 'Full name',
      emailAddress: 'Email address',
      password: 'Password',
      createAccount: 'Create account',
      alreadyHaveAccount: 'Already have an account?',
      signIn: 'Sign in',
      passwordRules: {
        length: '8+ characters',
        uppercase: 'Uppercase letter',
        lowercase: 'Lowercase letter',
        number: 'Number',
      },
    },
  },
  dashboard: {
    loading: 'Loading dashboard...',
    welcome: 'Welcome back, {name}!',
    readyToTailor: 'Ready to tailor your CV to a new job?',
    uploadFirst: 'Start by uploading your master CV.',
    stats: {
      masterCv: 'Master CV',
      uploadOne: '(upload one)',
      jobAnalyses: 'Job analyses',
      avgMatchScore: 'Avg. match score',
    },
    quickActions: {
      title: 'Quick actions',
      updateCv: 'Update My CV',
      uploadCv: 'Upload Your CV',
      updateCvDesc: 'Replace or update your master CV',
      uploadCvDesc: 'Upload your CV to get started',
      analyzeJob: 'Analyze New Job',
      analyzeJobDesc: 'Paste a job description to get gap analysis',
      viewHistory: 'View History',
      viewHistoryDesc: 'See all your past analyses and CVs',
      goNow: 'Go now',
    },
    recentAnalyses: {
      title: 'Recent analyses',
      viewAll: 'View all',
      untitledJob: 'Untitled Job',
      viewCv: 'View CV',
      continue: 'Continue',
    },
  },
  cvPage: {
    loading: 'Loading your CV...',
    title: 'My Master CV',
    subtitle: 'Your stored CV profile. This is used for all job analyses.',
    uploadSubtitle: 'Upload your CV to start tailoring it to job postings.',
    replaceCV: 'Replace CV',
    delete: 'Delete',
    uploadTitle: 'Upload Your Master CV',
    supportedFormats: 'Supported formats: PDF, DOCX (up to 10MB)',
    replaceModal: {
      title: 'Replace Master CV',
      description:
        'Uploading a new CV will replace your current one. Your past analyses will not be affected.',
    },
    deleteModal: {
      title: 'Delete Master CV',
      description:
        "Are you sure you want to delete your master CV? You won't be able to run new analyses without uploading a new one. Your past analyses will not be affected.",
      confirm: 'Delete CV',
      cancel: 'Cancel',
    },
    toast: {
      updateSuccess: 'CV updated successfully!',
      loadError: 'Failed to load CV',
      deleteSuccess: 'CV deleted',
      deleteError: 'Failed to delete CV',
    },
  },
  upload: {
    dragging: 'Drop your CV here',
    idle: 'Drag & drop your CV',
    browse: 'or click to browse — PDF or DOCX, up to 10MB',
    remove: 'Remove',
    button: 'Upload & Parse CV',
    processing: 'Processing...',
    uploading: 'Uploading file...',
    parsing: 'Parsing your CV...',
    extracting: 'Extracting profile data...',
    toast: {
      invalidFormat: 'Please upload a PDF or DOCX file',
      fileTooLarge: 'File size must be under 10MB',
      success: 'CV uploaded and parsed successfully!',
      error: 'Failed to upload CV',
    },
  },
  cvPreview: {
    yourName: 'Your Name',
    skills: 'Skills',
    workExperience: 'Work Experience',
    education: 'Education',
    certifications: 'Certifications',
    morePoints: '+{n} more points',
    parsedFrom: 'Parsed from:',
    lastUpdated: 'Last updated',
    degreeIn: 'in',
    gpa: 'GPA:',
  },
  analyze: {
    title: 'Analyze a Job Posting',
    subtitle: 'Paste a job description below to get a gap analysis against your master CV.',
    noCvTitle: 'No master CV found',
    noCvMessage: 'You need to',
    noCvLink: 'upload your CV',
    noCvAfter: 'before running an analysis.',
    cvReady: 'Your master CV is ready for analysis',
    jobTitle: 'Job title (optional)',
    jobTitlePlaceholder: 'e.g. Senior Engineer',
    company: 'Company (optional)',
    companyPlaceholder: 'e.g. Google',
    jobDescription: 'Job description *',
    jobDescPlaceholder:
      'Paste the full job description here, including requirements, responsibilities, and qualifications...',
    jobDescHint: 'Paste the complete job posting for best results',
    characters: 'characters',
    submit: 'Analyze My CV Against This Job',
    analyzingTitle: 'Analyzing your profile...',
    takesTime: 'This may take 30-60 seconds',
    steps: [
      'Extracting job requirements...',
      'Analyzing your CV against requirements...',
      'Calculating match score...',
      'Generating gap analysis...',
      'Almost done...',
    ],
    validationRequired: 'Please paste a job description',
    validationTooShort: 'Job description seems too short. Please paste the full posting.',
    toast: {
      noCv: 'Please upload your master CV first',
      success: 'Analysis complete!',
    },
  },
  history: {
    loading: 'Loading history...',
    title: 'Analysis History',
    subtitle: 'All your past job analyses and tailored CVs.',
    newAnalysis: 'New Analysis',
    emptyTitle: 'No analyses yet',
    emptyMessage: 'Start by analyzing a job posting against your CV.',
    emptyButton: 'Analyze Your First Job',
    colJob: 'Job',
    colDate: 'Date',
    colMatch: 'Match',
    colStatus: 'Status',
    colActions: 'Actions',
    untitledJob: 'Untitled Job',
    gaps: 'Gaps',
    cv: 'CV',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Manage your account settings and preferences.',
    profile: {
      title: 'Profile',
      fullName: 'Full name',
      namePlaceholder: 'Your name',
      emailAddress: 'Email address',
      emailHint: 'Email cannot be changed',
      save: 'Save changes',
    },
    security: {
      title: 'Security',
      currentPassword: 'Current password',
      currentPlaceholder: 'Enter current password',
      newPassword: 'New password',
      newPlaceholder: 'Min. 8 characters',
      confirmPassword: 'Confirm new password',
      confirmPlaceholder: 'Repeat new password',
      update: 'Update password',
      errors: {
        currentRequired: 'Current password required',
        newRequired: 'New password required',
        minLength: 'Must be at least 8 characters',
        noMatch: 'Passwords do not match',
      },
    },
    masterCv: {
      title: 'Master CV',
      description: 'Manage your master CV used for all job analyses.',
      manage: 'Manage CV',
    },
    dangerZone: {
      title: 'Danger Zone',
      description:
        'Permanently delete your account and all your data. This action cannot be undone.',
      deleteButton: 'Delete account',
      modalTitle: 'Delete Account',
      modalWarning:
        'This will permanently delete your account, all your CVs, and all analysis history. This action',
      cannotBeUndone: 'cannot be undone',
      typeDelete: 'Type "DELETE" to confirm',
      confirm: 'Delete my account',
      cancel: 'Cancel',
    },
    toast: {
      profileUpdated: 'Profile updated',
      profileError: 'Failed to update profile',
      passwordUpdated: 'Password updated',
      passwordError: 'Failed to update password',
      deleteError: 'Failed to delete account',
    },
  },
  gaps: {
    title: 'Gap Analysis',
    reviewSubtitle: 'Review your CV gaps against the job requirements',
    lowMatchWarningTitle: 'Poor fit warning',
    lowMatchWarningBody:
      "Your CV matches less than 50% of this job's requirements. Consider whether this role is a good fit, or focus on the gaps below to improve your chances.",
    progressLabel: 'Review Progress:',
    progressUnit: 'gaps handled',
    strongMatches: 'Strong Matches',
    moderateGaps: 'Moderate Gaps',
    missingRequirements: 'Missing Requirements',
    allReviewed: 'All gaps reviewed! Ready to generate your tailored CV.',
    reviewMore: 'Review {n} more gap to continue',
    reviewMorePlural: 'Review {n} more gaps to continue',
    generateButton: 'Generate My Tailored CV',
    at: 'at',
    toast: {
      reviewFirst: 'Please review all gaps before generating',
      generated: 'Tailored CV generated!',
      saveError: 'Failed to save decisions',
      generateError: 'Failed to generate CV',
    },
    analyzing: {
      title: 'Analysis in progress...',
      body: 'Please wait while we analyze your CV against this job.',
    },
  },
  gapCard: {
    status: {
      clearly_present: 'Strong Match',
      partially_present: 'Partial Match',
      probably_present: 'Probable Match',
      missing: 'Missing',
    },
    importance: 'importance',
    analysisLabel: 'Analysis',
    inYourCv: 'In your CV',
    howToHandle: 'How would you like to handle this?',
    decisions: {
      keep: { label: 'Keep as is', description: 'CV already shows this well' },
      add_real: { label: 'Add real experience', description: 'I have relevant experience to add' },
      reframe: { label: 'Reframe existing', description: 'Highlight adjacent skills differently' },
      learning_statement: {
        label: 'Add learning statement',
        description: 'Mention active skill development',
      },
      skip: { label: 'Skip this', description: 'This requirement is not relevant to me' },
    },
    addRealLabel: 'Describe your relevant experience',
    addRealPlaceholder:
      'Describe your actual experience with this requirement in detail. This will be incorporated into your tailored CV.',
    aiSuggestion: 'AI Suggestion',
    suggestedStatement: 'Suggested Statement',
    reframePlaceholder: 'Edit the suggestion above or write your own reframing...',
    learningPlaceholder: 'Edit the statement above to make it more specific to you...',
  },
  matchScore: {
    excellent: 'Excellent Match',
    good: 'Good Match',
    fair: 'Fair Match',
    poor: 'Poor Match',
    strongMatches: 'Strong matches',
    partialMatches: 'Partial matches',
    probableMatches: 'Probable matches',
    missing: 'Missing',
  },
  tailoredCv: {
    loading: 'Loading tailored CV...',
    backToGaps: 'Back to gap analysis',
    title: 'Your Tailored CV',
    tailoredFor: 'Tailored for:',
    at: 'at',
    newAnalysis: 'New Analysis',
    preview: 'Tailored CV Preview',
    downloadTitle: 'Download',
    downloadPdf: 'Download as PDF',
    downloadTxt: 'Download as TXT',
    generatingPdf: 'Generating PDF…',
    downloading: 'Downloading…',
    changesTitle: 'Changes made',
    enhancements: '{n} enhancements',
    incorporated: 'incorporated based on your gap decisions.',
    notFound: 'CV not found.',
    goToHistory: 'Go to history',
    toast: {
      loadError: 'Failed to load tailored CV',
      pdfSuccess: 'PDF downloaded!',
      pdfError: 'Failed to generate PDF. Please try again.',
      txtSuccess: 'TXT downloaded!',
      txtError: 'Download failed. Please try again.',
      generating: 'Generating PDF…',
    },
  },
  status: {
    analyzing: 'Analyzing',
    gaps_review: 'Review Gaps',
    generating: 'Generating CV',
    complete: 'Complete',
  },
  common: {
    loading: 'Loading...',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// SPANISH
// ─────────────────────────────────────────────────────────────────────────────
export const es: Translations = {
  nav: {
    dashboard: 'Inicio',
    myCv: 'Mi CV',
    analyzeJob: 'Analizar Trabajo',
    history: 'Historial',
    settings: 'Configuración',
    signOut: 'Cerrar sesión',
    logIn: 'Iniciar sesión',
    getStartedFree: 'Comenzar gratis',
    language: 'EN',
  },
  landing: {
    hero: {
      badge: 'Optimización de CV con IA',
      headline1: 'Sube tu CV una vez.',
      headline2: 'Adáptalo a cada trabajo',
      headline3: 'más rápido.',
      subtitle:
        'ApplyJet analiza tu CV frente a las ofertas de trabajo, identifica brechas de habilidades y genera CVs optimizados para ATS, manteniendo todo 100% veraz.',
      getStarted: 'Comenzar gratis',
      signIn: 'Iniciar sesión',
      noCreditCard: 'Sin tarjeta de crédito. Gratis para comenzar.',
      matchScore: 'Puntaje de coincidencia',
      strongMatches: 'Coincidencias fuertes',
      gapsFound: 'Brechas encontradas',
    },
    features: {
      heading: 'Todo lo que necesitas para conseguir el trabajo',
      subheading:
        'Deja de enviar el mismo CV a todos. Adáptalo inteligentemente con IA que entiende lo que buscan los reclutadores.',
      items: [
        {
          title: 'Análisis de brechas',
          description:
            'La IA compara tu CV con los requisitos del trabajo e identifica exactamente qué falta, qué es parcial y qué está presente.',
        },
        {
          title: 'Sugerencias inteligentes',
          description:
            'Obtén sugerencias de IA para reformular experiencias existentes, agregar logros reales o añadir declaraciones de aprendizaje honestas.',
        },
        {
          title: 'Salida compatible con ATS',
          description:
            'Los CVs generados están optimizados para los sistemas de seguimiento de candidatos con palabras clave adecuadas y formato limpio.',
        },
        {
          title: '100% veraz',
          description:
            'Nunca fabricamos información. Cada sugerencia se basa en tu experiencia real. Tu integridad está protegida.',
        },
        {
          title: 'Puntaje de compatibilidad',
          description:
            'Ve tu puntaje de compatibilidad al instante. Entiende de un vistazo si un puesto es una buena opción antes de postularte.',
        },
        {
          title: 'Descarga inmediata',
          description:
            'Descarga tu CV personalizado como PDF profesional de inmediato. Listo para enviar en segundos.',
        },
      ],
    },
    howItWorks: {
      heading: 'Cómo funciona',
      subheading: 'Desde la carga del CV hasta la postulación personalizada en menos de 5 minutos.',
      startFree: 'Empezar gratis',
      steps: [
        {
          title: 'Sube tu CV maestro',
          description:
            'Sube tu CV una vez en formato PDF o DOCX. Nuestra IA lo analiza y almacena tu perfil profesional completo.',
        },
        {
          title: 'Pega una oferta de trabajo',
          description:
            'Copia y pega cualquier descripción de trabajo. Extraemos todos los requisitos y responsabilidades automáticamente.',
        },
        {
          title: 'Revisa el análisis de brechas',
          description:
            'Ve exactamente qué requisitos cumples, cuáles cumples parcialmente y cuáles te faltan. Obtén un puntaje de compatibilidad.',
        },
        {
          title: 'Gestiona cada brecha',
          description:
            'Para cada brecha, elige: ignorarla, agregar experiencia real, reformular habilidades existentes o añadir una declaración de aprendizaje.',
        },
        {
          title: 'Descarga tu CV personalizado',
          description:
            'Obtén un CV pulido y optimizado para ATS adaptado a ese puesto específico. Descárgalo como PDF al instante.',
        },
      ],
    },
    cta: {
      heading: '¿Listo para conseguir el trabajo de tus sueños?',
      subheading:
        'Únete a miles de candidatos que usan ApplyJet para destacar entre la multitud.',
      button: 'Comenzar gratis',
    },
    footer: {
      tagline: 'Creado para ayudarte a triunfar.',
    },
  },
  auth: {
    signup: {
      title: 'Crea tu cuenta',
      subtitle: 'Empieza a adaptar tu CV a cada trabajo',
      fullName: 'Nombre completo',
      emailAddress: 'Correo electrónico',
      password: 'Contraseña',
      createAccount: 'Crear cuenta',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
      signIn: 'Iniciar sesión',
      passwordRules: {
        length: '8+ caracteres',
        uppercase: 'Letra mayúscula',
        lowercase: 'Letra minúscula',
        number: 'Número',
      },
    },
  },
  dashboard: {
    loading: 'Cargando panel...',
    welcome: '¡Bienvenido/a de nuevo, {name}!',
    readyToTailor: '¿Listo/a para adaptar tu CV a un nuevo trabajo?',
    uploadFirst: 'Comienza subiendo tu CV maestro.',
    stats: {
      masterCv: 'CV Maestro',
      uploadOne: '(sube uno)',
      jobAnalyses: 'Análisis de trabajos',
      avgMatchScore: 'Puntaje promedio',
    },
    quickActions: {
      title: 'Acciones rápidas',
      updateCv: 'Actualizar mi CV',
      uploadCv: 'Subir tu CV',
      updateCvDesc: 'Reemplaza o actualiza tu CV maestro',
      uploadCvDesc: 'Sube tu CV para comenzar',
      analyzeJob: 'Analizar nuevo trabajo',
      analyzeJobDesc: 'Pega una descripción de trabajo para el análisis de brechas',
      viewHistory: 'Ver historial',
      viewHistoryDesc: 'Consulta todos tus análisis y CVs anteriores',
      goNow: 'Ir ahora',
    },
    recentAnalyses: {
      title: 'Análisis recientes',
      viewAll: 'Ver todos',
      untitledJob: 'Trabajo sin título',
      viewCv: 'Ver CV',
      continue: 'Continuar',
    },
  },
  cvPage: {
    loading: 'Cargando tu CV...',
    title: 'Mi CV Maestro',
    subtitle: 'Tu perfil de CV almacenado. Se utiliza para todos los análisis de trabajo.',
    uploadSubtitle: 'Sube tu CV para comenzar a adaptarlo a las ofertas de trabajo.',
    replaceCV: 'Reemplazar CV',
    delete: 'Eliminar',
    uploadTitle: 'Sube tu CV Maestro',
    supportedFormats: 'Formatos admitidos: PDF, DOCX (hasta 10 MB)',
    replaceModal: {
      title: 'Reemplazar CV Maestro',
      description:
        'Subir un nuevo CV reemplazará el actual. Tus análisis anteriores no se verán afectados.',
    },
    deleteModal: {
      title: 'Eliminar CV Maestro',
      description:
        '¿Estás seguro/a de que deseas eliminar tu CV maestro? No podrás realizar nuevos análisis sin subir uno nuevo. Tus análisis anteriores no se verán afectados.',
      confirm: 'Eliminar CV',
      cancel: 'Cancelar',
    },
    toast: {
      updateSuccess: '¡CV actualizado con éxito!',
      loadError: 'Error al cargar el CV',
      deleteSuccess: 'CV eliminado',
      deleteError: 'Error al eliminar el CV',
    },
  },
  upload: {
    dragging: 'Suelta tu CV aquí',
    idle: 'Arrastra y suelta tu CV',
    browse: 'o haz clic para buscar — PDF o DOCX, hasta 10 MB',
    remove: 'Eliminar',
    button: 'Subir y analizar CV',
    processing: 'Procesando...',
    uploading: 'Subiendo archivo...',
    parsing: 'Analizando tu CV...',
    extracting: 'Extrayendo datos del perfil...',
    toast: {
      invalidFormat: 'Por favor sube un archivo PDF o DOCX',
      fileTooLarge: 'El archivo debe pesar menos de 10 MB',
      success: '¡CV subido y analizado con éxito!',
      error: 'Error al subir el CV',
    },
  },
  cvPreview: {
    yourName: 'Tu nombre',
    skills: 'Habilidades',
    workExperience: 'Experiencia laboral',
    education: 'Educación',
    certifications: 'Certificaciones',
    morePoints: '+{n} puntos más',
    parsedFrom: 'Extraído de:',
    lastUpdated: 'Última actualización',
    degreeIn: 'en',
    gpa: 'Promedio:',
  },
  analyze: {
    title: 'Analizar una oferta de trabajo',
    subtitle:
      'Pega una descripción de trabajo a continuación para obtener un análisis de brechas frente a tu CV maestro.',
    noCvTitle: 'No se encontró un CV maestro',
    noCvMessage: 'Necesitas',
    noCvLink: 'subir tu CV',
    noCvAfter: 'antes de realizar un análisis.',
    cvReady: 'Tu CV maestro está listo para el análisis',
    jobTitle: 'Título del trabajo (opcional)',
    jobTitlePlaceholder: 'ej. Ingeniero/a Senior',
    company: 'Empresa (opcional)',
    companyPlaceholder: 'ej. Google',
    jobDescription: 'Descripción del trabajo *',
    jobDescPlaceholder:
      'Pega la descripción completa del trabajo aquí, incluyendo requisitos, responsabilidades y calificaciones...',
    jobDescHint: 'Pega la oferta completa para mejores resultados',
    characters: 'caracteres',
    submit: 'Analizar mi CV frente a este trabajo',
    analyzingTitle: 'Analizando tu perfil...',
    takesTime: 'Esto puede tardar 30-60 segundos',
    steps: [
      'Extrayendo requisitos del trabajo...',
      'Analizando tu CV frente a los requisitos...',
      'Calculando puntaje de compatibilidad...',
      'Generando análisis de brechas...',
      'Casi listo...',
    ],
    validationRequired: 'Por favor pega una descripción de trabajo',
    validationTooShort:
      'La descripción del trabajo parece demasiado corta. Por favor pega la oferta completa.',
    toast: {
      noCv: 'Por favor sube tu CV maestro primero',
      success: '¡Análisis completado!',
    },
  },
  history: {
    loading: 'Cargando historial...',
    title: 'Historial de análisis',
    subtitle: 'Todos tus análisis de trabajo y CVs personalizados anteriores.',
    newAnalysis: 'Nuevo análisis',
    emptyTitle: 'Aún no hay análisis',
    emptyMessage: 'Comienza analizando una oferta de trabajo frente a tu CV.',
    emptyButton: 'Analizar tu primer trabajo',
    colJob: 'Trabajo',
    colDate: 'Fecha',
    colMatch: 'Coincidencia',
    colStatus: 'Estado',
    colActions: 'Acciones',
    untitledJob: 'Trabajo sin título',
    gaps: 'Brechas',
    cv: 'CV',
  },
  settings: {
    title: 'Configuración',
    subtitle: 'Administra la configuración y preferencias de tu cuenta.',
    profile: {
      title: 'Perfil',
      fullName: 'Nombre completo',
      namePlaceholder: 'Tu nombre',
      emailAddress: 'Correo electrónico',
      emailHint: 'El correo no puede cambiarse',
      save: 'Guardar cambios',
    },
    security: {
      title: 'Seguridad',
      currentPassword: 'Contraseña actual',
      currentPlaceholder: 'Ingresa tu contraseña actual',
      newPassword: 'Nueva contraseña',
      newPlaceholder: 'Mín. 8 caracteres',
      confirmPassword: 'Confirmar nueva contraseña',
      confirmPlaceholder: 'Repite la nueva contraseña',
      update: 'Actualizar contraseña',
      errors: {
        currentRequired: 'La contraseña actual es obligatoria',
        newRequired: 'La nueva contraseña es obligatoria',
        minLength: 'Debe tener al menos 8 caracteres',
        noMatch: 'Las contraseñas no coinciden',
      },
    },
    masterCv: {
      title: 'CV Maestro',
      description: 'Administra tu CV maestro utilizado para todos los análisis de trabajo.',
      manage: 'Gestionar CV',
    },
    dangerZone: {
      title: 'Zona de peligro',
      description:
        'Elimina permanentemente tu cuenta y todos tus datos. Esta acción no se puede deshacer.',
      deleteButton: 'Eliminar cuenta',
      modalTitle: 'Eliminar cuenta',
      modalWarning:
        'Esto eliminará permanentemente tu cuenta, todos tus CVs y todo el historial de análisis. Esta acción',
      cannotBeUndone: 'no se puede deshacer',
      typeDelete: 'Escribe "DELETE" para confirmar',
      confirm: 'Eliminar mi cuenta',
      cancel: 'Cancelar',
    },
    toast: {
      profileUpdated: 'Perfil actualizado',
      profileError: 'Error al actualizar el perfil',
      passwordUpdated: 'Contraseña actualizada',
      passwordError: 'Error al actualizar la contraseña',
      deleteError: 'Error al eliminar la cuenta',
    },
  },
  gaps: {
    title: 'Análisis de brechas',
    reviewSubtitle: 'Revisa las brechas de tu CV frente a los requisitos del trabajo',
    lowMatchWarningTitle: 'Advertencia de baja compatibilidad',
    lowMatchWarningBody:
      'Tu CV cumple menos del 50% de los requisitos de este trabajo. Considera si este puesto es adecuado para ti, o enfócate en las brechas a continuación para mejorar tus posibilidades.',
    progressLabel: 'Progreso de revisión:',
    progressUnit: 'brechas gestionadas',
    strongMatches: 'Coincidencias fuertes',
    moderateGaps: 'Brechas moderadas',
    missingRequirements: 'Requisitos faltantes',
    allReviewed: '¡Todas las brechas revisadas! Listo/a para generar tu CV personalizado.',
    reviewMore: 'Revisa {n} brecha más para continuar',
    reviewMorePlural: 'Revisa {n} brechas más para continuar',
    generateButton: 'Generar mi CV personalizado',
    at: 'en',
    toast: {
      reviewFirst: 'Por favor revisa todas las brechas antes de generar',
      generated: '¡CV personalizado generado!',
      saveError: 'Error al guardar las decisiones',
      generateError: 'Error al generar el CV',
    },
    analyzing: {
      title: 'Análisis en curso...',
      body: 'Por favor espera mientras analizamos tu CV frente a este trabajo.',
    },
  },
  gapCard: {
    status: {
      clearly_present: 'Coincidencia fuerte',
      partially_present: 'Coincidencia parcial',
      probably_present: 'Coincidencia probable',
      missing: 'Faltante',
    },
    importance: 'importancia',
    analysisLabel: 'Análisis',
    inYourCv: 'En tu CV',
    howToHandle: '¿Cómo deseas gestionar esto?',
    decisions: {
      keep: { label: 'Mantener como está', description: 'El CV ya lo muestra bien' },
      add_real: {
        label: 'Agregar experiencia real',
        description: 'Tengo experiencia relevante para agregar',
      },
      reframe: {
        label: 'Reformular existente',
        description: 'Destacar habilidades adyacentes de otra manera',
      },
      learning_statement: {
        label: 'Agregar declaración de aprendizaje',
        description: 'Mencionar el desarrollo activo de habilidades',
      },
      skip: { label: 'Omitir esto', description: 'Este requisito no es relevante para mí' },
    },
    addRealLabel: 'Describe tu experiencia relevante',
    addRealPlaceholder:
      'Describe tu experiencia real con este requisito en detalle. Esto se incorporará a tu CV personalizado.',
    aiSuggestion: 'Sugerencia de IA',
    suggestedStatement: 'Declaración sugerida',
    reframePlaceholder: 'Edita la sugerencia anterior o escribe tu propio enfoque...',
    learningPlaceholder: 'Edita la declaración anterior para hacerla más específica a ti...',
  },
  matchScore: {
    excellent: 'Excelente coincidencia',
    good: 'Buena coincidencia',
    fair: 'Coincidencia regular',
    poor: 'Baja coincidencia',
    strongMatches: 'Coincidencias fuertes',
    partialMatches: 'Coincidencias parciales',
    probableMatches: 'Coincidencias probables',
    missing: 'Faltantes',
  },
  tailoredCv: {
    loading: 'Cargando CV personalizado...',
    backToGaps: 'Volver al análisis de brechas',
    title: 'Tu CV personalizado',
    tailoredFor: 'Personalizado para:',
    at: 'en',
    newAnalysis: 'Nuevo análisis',
    preview: 'Vista previa del CV personalizado',
    downloadTitle: 'Descargar',
    downloadPdf: 'Descargar como PDF',
    downloadTxt: 'Descargar como TXT',
    generatingPdf: 'Generando PDF…',
    downloading: 'Descargando…',
    changesTitle: 'Cambios realizados',
    enhancements: '{n} mejoras',
    incorporated: 'incorporadas según tus decisiones sobre las brechas.',
    notFound: 'CV no encontrado.',
    goToHistory: 'Ir al historial',
    toast: {
      loadError: 'Error al cargar el CV personalizado',
      pdfSuccess: '¡PDF descargado!',
      pdfError: 'Error al generar el PDF. Por favor intenta de nuevo.',
      txtSuccess: '¡TXT descargado!',
      txtError: 'Error al descargar. Por favor intenta de nuevo.',
      generating: 'Generando PDF…',
    },
  },
  status: {
    analyzing: 'Analizando',
    gaps_review: 'Revisar brechas',
    generating: 'Generando CV',
    complete: 'Completado',
  },
  common: {
    loading: 'Cargando...',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
  },
}

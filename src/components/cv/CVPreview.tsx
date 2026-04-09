'use client'

import { ParsedProfile } from '@/lib/ai/types'
import { Briefcase, GraduationCap, Award, Star, MapPin, Mail, Phone, Globe } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface CVPreviewProps {
  parsedData: ParsedProfile
  fileName: string
  updatedAt?: string
}

export default function CVPreview({ parsedData, fileName, updatedAt }: CVPreviewProps) {
  const { t } = useLanguage()
  const p = t.cvPreview

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">{parsedData.name || p.yourName}</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-indigo-100">
          {parsedData.email && (
            <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{parsedData.email}</span>
          )}
          {parsedData.phone && (
            <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{parsedData.phone}</span>
          )}
          {parsedData.location && (
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{parsedData.location}</span>
          )}
          {parsedData.linkedin && (
            <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{parsedData.linkedin}</span>
          )}
        </div>
        {parsedData.summary && (
          <p className="mt-3 text-sm text-indigo-100 leading-relaxed">{parsedData.summary}</p>
        )}
      </div>

      {/* Skills */}
      {parsedData.skills && parsedData.skills.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-indigo-600" />{p.skills}
          </h3>
          <div className="flex flex-wrap gap-2">
            {parsedData.skills.map((skill) => (
              <Badge key={skill} variant="info">{skill}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {parsedData.workExperience && parsedData.workExperience.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Briefcase className="h-4 w-4 text-indigo-600" />{p.workExperience}
          </h3>
          <div className="space-y-5">
            {parsedData.workExperience.map((exp, i) => (
              <div key={i} className="border-l-2 border-indigo-100 pl-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900">{exp.title}</p>
                    <p className="text-sm text-indigo-600">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                {exp.description && exp.description.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.description.slice(0, 3).map((desc, j) => (
                      <li key={j} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-indigo-400 flex-shrink-0">•</span>
                        {desc}
                      </li>
                    ))}
                    {exp.description.length > 3 && (
                      <li className="text-xs text-gray-400">
                        {p.morePoints.replace('{n}', String(exp.description.length - 3))}
                      </li>
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {parsedData.education && parsedData.education.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <GraduationCap className="h-4 w-4 text-indigo-600" />{p.education}
          </h3>
          <div className="space-y-3">
            {parsedData.education.map((edu, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">
                    {edu.degree} {p.degreeIn} {edu.field}
                  </p>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-xs text-gray-400">{p.gpa} {edu.gpa}</p>}
                </div>
                {edu.endDate && <span className="text-xs text-gray-500 whitespace-nowrap">{edu.endDate}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {parsedData.certifications && parsedData.certifications.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Award className="h-4 w-4 text-indigo-600" />{p.certifications}
          </h3>
          <div className="space-y-2">
            {parsedData.certifications.map((cert, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                  {cert.issuer && <p className="text-xs text-gray-500">{cert.issuer}</p>}
                </div>
                {cert.date && <span className="text-xs text-gray-500">{cert.date}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        {p.parsedFrom} {fileName}
        {updatedAt && ` · ${p.lastUpdated} ${new Date(updatedAt).toLocaleDateString()}`}
      </p>
    </div>
  )
}

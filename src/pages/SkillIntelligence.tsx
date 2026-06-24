import { useState, useEffect, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ChevronDown, ChevronUp } from 'lucide-react'
import { CompanyLogo } from '@/components/CompanyLogo'
import { useCompany } from '@/context/CompanyContext'
import { SEED_COMPANIES } from '@/data/seedCompanies'
import { SKILL_ROADMAPS } from '@/data/skillTopics'
import { normalizeDashboardSkills, type DashboardSkill } from '@/lib/companyData'

// ── Bloom taxonomy config ────────────────────────────────────────────────────

const BLOOM_CONFIG = {
  CU: { label: 'Create / Understand', short: 'CU', color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  AP: { label: 'Apply', short: 'AP', color: '#22c55e', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  AS: { label: 'Analyse / Synthesise', short: 'AS', color: '#eab308', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  EV: { label: 'Evaluate', short: 'EV', color: '#ef4444', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  CR: { label: 'Create (Expert)', short: 'CR', color: '#a855f7', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
} as const

const CRITICALITY_CONFIG = {
  Critical: { color: 'bg-red-500', label: 'Critical', desc: 'Must have for selection' },
  Important: { color: 'bg-amber-500', label: 'Important', desc: 'Strongly preferred' },
  Baseline: { color: 'bg-green-500', label: 'Baseline', desc: 'Good to have' },
} as const

// ── Progress bar with bloom color ─────────────────────────────────────────────

function SkillProgressBar({ score, bloomLevel }: { score: number; bloomLevel: DashboardSkill['bloom_level'] }) {
  const pct = (score / 10) * 100
  const color = BLOOM_CONFIG[bloomLevel].color
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

// ── Roadmap row ───────────────────────────────────────────────────────────────

function RoadmapRow({
  levelNum,
  topic,
  isTarget,
  isLocked,
}: {
  levelNum: number
  topic: string
  isTarget: boolean
  isLocked: boolean
}) {
  return (
    <div
      className={`flex items-start gap-3 px-3 py-2 rounded-md transition-colors ${
        isTarget
          ? 'bg-blue-50 border border-blue-200'
          : isLocked
          ? 'opacity-40'
          : 'bg-secondary/30'
      }`}
    >
      {isLocked ? (
        <Lock className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
      ) : (
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white mt-0.5 ${
            isTarget ? 'bg-blue-600' : 'bg-muted-foreground'
          }`}
        >
          {levelNum}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs leading-snug text-foreground truncate">{topic}</p>
        {isLocked && (
          <p className="text-[10px] text-muted-foreground mt-0.5">Beyond scope</p>
        )}
        {isTarget && (
          <p className="text-[10px] text-blue-600 font-medium mt-0.5">Target Level</p>
        )}
      </div>
    </div>
  )
}

// ── Skill card ────────────────────────────────────────────────────────────────

const SkillCard = memo(function SkillCard({ skill }: { skill: DashboardSkill }) {
  const [expanded, setExpanded] = useState(false)
  const bloom = BLOOM_CONFIG[skill.bloom_level]
  const criticality = CRITICALITY_CONFIG[skill.criticality]
  const roadmap = SKILL_ROADMAPS.find((r) => r.skill_set_id === skill.skill_set_id)

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold text-sm text-foreground leading-tight flex-1">
            {skill.skill_set_name}
          </h3>
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-bold ${bloom.bg} ${bloom.text} ${bloom.border}`}
          >
            {bloom.short}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{skill.score}/10</span>
          <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${criticality.color}`} />
            <span>{criticality.label}</span>
          </div>
        </div>

        <SkillProgressBar score={skill.score} bloomLevel={skill.bloom_level} />
      </div>

      {/* Expand toggle */}
      {roadmap && (
        <div className="border-t">
          <button
            className="flex w-full items-center justify-between px-4 py-2 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors"
            onClick={() => setExpanded((p) => !p)}
          >
            <span>10-Level Roadmap</span>
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {expanded && (
            <div className="flex flex-col gap-1 px-3 pb-3">
              {roadmap.levels.map((lvl) => (
                <RoadmapRow
                  key={lvl.level_number}
                  levelNum={lvl.level_number}
                  topic={lvl.topic}
                  isTarget={lvl.level_number === skill.required_level}
                  isLocked={lvl.level_number > skill.required_level}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
})

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SkillIntelligence() {
  const { selected } = useCompany()
  const navigate = useNavigate()

  useEffect(() => {
    if (!selected) navigate('/')
  }, [selected, navigate])

  if (!selected) return null

  const seedEntry = SEED_COMPANIES.find((c) => c.company_id === selected.companyId)
  const skills: DashboardSkill[] = seedEntry
    ? normalizeDashboardSkills(seedEntry.skill_levels)
    : []

  const domain = seedEntry
    ? (() => {
        try { return new URL(seedEntry.short_json.website_url).hostname.replace(/^www\./, '') }
        catch { return undefined }
      })()
    : undefined

  return (
    <div className="min-h-full pb-16">
      {/* Header */}
      <div className="border-b bg-white px-4 py-4 flex items-center gap-3">
        <CompanyLogo
          name={selected.companyName}
          logoUrl={selected.logoUrl}
          domain={domain}
          size="md"
        />
        <div>
          <h1 className="font-heading font-bold text-base sm:text-lg text-foreground leading-tight">
            {selected.companyName} — Skill Intelligence
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {skills.length} skills · Required proficiency roadmap
          </p>
        </div>
      </div>

      {/* Legends */}
      <div className="px-4 py-4 max-w-5xl mx-auto space-y-4">
        {/* Bloom legend */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Bloom Taxonomy Levels
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.entries(BLOOM_CONFIG) as [DashboardSkill['bloom_level'], typeof BLOOM_CONFIG[keyof typeof BLOOM_CONFIG]][]).map(([key, cfg]) => (
              <div
                key={key}
                className={`rounded-md border px-2.5 py-1.5 ${cfg.bg} ${cfg.border}`}
              >
                <p className={`text-xs font-bold ${cfg.text}`}>{cfg.short}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{cfg.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Criticality legend */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Criticality Levels
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(CRITICALITY_CONFIG) as [DashboardSkill['criticality'], typeof CRITICALITY_CONFIG[keyof typeof CRITICALITY_CONFIG]][]).map(([key, cfg]) => (
              <div key={key} className="rounded-md border bg-card px-2.5 py-1.5 flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${cfg.color}`} />
                <div>
                  <p className="text-xs font-semibold text-foreground">{cfg.label}</p>
                  <p className="text-[10px] text-muted-foreground">{cfg.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills grid */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Required Skills ({skills.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((s) => (
              <SkillCard key={s.skill_set_id} skill={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
import { CompanyLogo } from '@/components/CompanyLogo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCompany } from '@/context/CompanyContext'
import { SEED_COMPANIES } from '@/data/seedCompanies'
import { buildIntelligenceSections } from '@/data/intelligenceData'
import { normalizeCompanyProfile } from '@/lib/companyData'
import type { CompanyProfile } from '@/lib/companyData'

// ── Null-value detection ─────────────────────────────────────────────────────

function isNullish(v: unknown): boolean {
  if (v === null || v === undefined) return true
  const s = String(v).trim().toLowerCase()
  return ['na', 'n/a', 'none', '-', 'null', 'undefined', ''].includes(s)
}

// ── URL / type detection ──────────────────────────────────────────────────────

function isUrl(s: string): boolean {
  return /^https?:\/\//.test(s.trim())
}

function isVideoUrl(s: string): boolean {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(s)
}

function isRatingValue(label: string): boolean {
  return /rating|score|nps/i.test(label)
}

// ── Value renderer ────────────────────────────────────────────────────────────

function renderValue(rawValue: string, label: string): React.ReactNode {
  if (isNullish(rawValue)) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground italic">
        Not Available
      </span>
    )
  }

  const v = String(rawValue).trim()

  if (isVideoUrl(v)) {
    return (
      <a
        href={v}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
      >
        <ExternalLink className="h-3 w-3" />
        Watch video
      </a>
    )
  }

  if (isUrl(v)) {
    return (
      <a
        href={v}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm break-all"
      >
        <ExternalLink className="h-3 w-3 shrink-0" />
        {v.replace(/^https?:\/\//, '').slice(0, 60)}
      </a>
    )
  }

  if (isRatingValue(label) && /\d/.test(v)) {
    return <span className="font-semibold text-sm">{v}</span>
  }

  // Split on semicolons, newlines, bullets
  const parts = v
    .split(/[;\n•]+/)
    .map((s) => s.trim())
    .filter(Boolean)

  if (parts.length > 1) {
    return (
      <ul className="flex flex-wrap gap-1.5">
        {parts.map((p, i) => (
          <li key={i} className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {p}
          </li>
        ))}
      </ul>
    )
  }

  // Long text → paragraph
  if (v.length > 120) {
    return <p className="text-sm text-foreground leading-relaxed">{v}</p>
  }

  return <span className="text-sm text-foreground">{v}</span>
}

// ── Field row ─────────────────────────────────────────────────────────────────

const FieldRow = memo(function FieldRow({ label, value }: { label: string; value: unknown }) {
  const rendered = renderValue(String(value ?? ''), label)
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-3 border-b border-border last:border-0">
      <dt className="w-full sm:w-1/3 shrink-0 text-xs font-medium text-muted-foreground uppercase tracking-wide pt-0.5 pb-1 sm:pb-0">
        {label}
      </dt>
      <dd className="sm:w-2/3">{rendered}</dd>
    </div>
  )
})

// ── Section card ──────────────────────────────────────────────────────────────

interface SectionCardProps {
  id: string
  title: string
  icon: React.ReactNode
  fields: Array<{ key: string; label: string }>
  profile: CompanyProfile
  sectionRef: React.RefCallback<HTMLDivElement>
}

const SectionCard = memo(function SectionCard({
  id,
  title,
  icon,
  fields,
  profile,
  sectionRef,
}: SectionCardProps) {
  const nonNullCount = fields.filter(
    (f) => !isNullish(String(profile[f.key as keyof CompanyProfile] ?? '')),
  ).length

  return (
    <div id={id} ref={sectionRef} className="scroll-mt-32">
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-secondary/30">
          <span className="text-muted-foreground">{icon}</span>
          <h2 className="font-heading font-semibold text-sm text-foreground">{title}</h2>
          <span className="ml-auto text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            {nonNullCount}/{fields.length}
          </span>
        </div>
        <dl className="px-4 divide-y-0">
          {fields.map((f) => (
            <FieldRow
              key={f.key}
              label={f.label}
              value={profile[f.key as keyof CompanyProfile] ?? ''}
            />
          ))}
        </dl>
      </div>
    </div>
  )
})

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CompanyIntelligence() {
  const { selected } = useCompany()
  const navigate = useNavigate()
  const [activeIdx, setActiveIdx] = useState(0)
  const tabBarRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const isScrollingRef = useRef(false)

  useEffect(() => {
    if (!selected) navigate('/')
  }, [selected, navigate])

  const sections = buildIntelligenceSections()

  // Resolve company data
  const seedEntry = SEED_COMPANIES.find((c) => c.company_id === selected?.companyId)
  const profile: CompanyProfile | null = seedEntry
    ? normalizeCompanyProfile(seedEntry.full_json as Record<string, unknown>)
    : null

  // Scroll-spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return
        let best: IntersectionObserverEntry | null = null
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > (best?.intersectionRatio ?? 0)) {
              best = entry
            }
          }
        }
        if (best) {
          const idx = sectionRefs.current.findIndex((el) => el === best!.target)
          if (idx !== -1) setActiveIdx(idx)
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.1, 0.5] },
    )

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections.length])

  // Auto-center active tab
  useEffect(() => {
    const bar = tabBarRef.current
    if (!bar) return
    const activeTab = bar.children[activeIdx] as HTMLElement | undefined
    if (!activeTab) return
    const barRect = bar.getBoundingClientRect()
    const tabRect = activeTab.getBoundingClientRect()
    const scrollLeft = bar.scrollLeft + (tabRect.left - barRect.left) - barRect.width / 2 + tabRect.width / 2
    bar.scrollTo({ left: scrollLeft, behavior: 'smooth' })
  }, [activeIdx])

  const scrollToSection = useCallback((idx: number) => {
    const el = sectionRefs.current[idx]
    if (!el) return
    isScrollingRef.current = true
    setActiveIdx(idx)
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => { isScrollingRef.current = false }, 800)
  }, [])

  if (!selected || !profile) return null

  const domain = profile.website_url
    ? new URL(profile.website_url).hostname.replace(/^www\./, '')
    : undefined

  return (
    <div className="flex flex-col min-h-full">
      {/* Sticky company info bar */}
      <div className="sticky top-0 z-20 border-b bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <CompanyLogo
            name={selected.companyName}
            logoUrl={selected.logoUrl}
            domain={domain}
            size="md"
          />
          <div className="min-w-0">
            <h1 className="font-heading font-bold text-base text-foreground truncate leading-tight">
              {profile.name}
            </h1>
            <Badge variant="outline" className="mt-0.5 text-xs">
              {profile.category || profile.nature_of_company}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {profile.website_url && !['na', 'n/a'].includes(profile.website_url.toLowerCase()) && (
            <Button variant="outline" size="sm" asChild>
              <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Website
              </a>
            </Button>
          )}
          {profile.linkedin_url && !['na', 'n/a'].includes(profile.linkedin_url.toLowerCase()) && (
            <Button variant="outline" size="sm" asChild>
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="h-3.5 w-3.5 mr-1" />
                LinkedIn
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Sticky tab bar */}
      <div
        ref={tabBarRef}
        className="sticky top-[calc(var(--sticky-offset,57px))] z-10 flex gap-0.5 overflow-x-auto scrollbar-hide border-b bg-white px-2 py-1.5"
        style={{ ['--sticky-offset' as string]: '57px' }}
      >
        {sections.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => scrollToSection(idx)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors shrink-0 ${
              activeIdx === idx
                ? 'bg-[#EFF6FF] text-[#2563EB]'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <span className={activeIdx === idx ? 'text-[#2563EB]' : 'text-muted-foreground'}>
              {s.icon}
            </span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className="flex flex-col gap-4 p-4 max-w-5xl mx-auto w-full pb-16">
        {sections.map((s, idx) => (
          <SectionCard
            key={s.id}
            id={s.id}
            title={s.title}
            icon={s.icon}
            fields={s.fields}
            profile={profile}
            sectionRef={(el) => { sectionRefs.current[idx] = el }}
          />
        ))}
      </div>
    </div>
  )
}

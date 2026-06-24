import { memo } from 'react'
import { MapPin, Users, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CompanyLogo } from '@/components/CompanyLogo'
import { useCompany } from '@/context/CompanyContext'
import type { CompanySummary } from '@/lib/companyData'

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'Super Dream': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Dream: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Standard: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  Regular: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
}

function isNullish(v: string): boolean {
  return !v || ['na', 'n/a', 'none', '-', 'null', 'undefined'].includes(v.trim().toLowerCase())
}

interface CompanyCardProps {
  company: CompanySummary
}

export const CompanyCard = memo(function CompanyCard({ company }: CompanyCardProps) {
  const navigate = useNavigate()
  const { setSelected } = useCompany()

  const style = CATEGORY_STYLES[company.company_type] ?? CATEGORY_STYLES['Regular']
  const isNegativeGrowth = company.yoy_growth_rate.startsWith('-')

  function handleClick() {
    setSelected({
      companyId: company.id,
      companyName: company.name,
      logoUrl: company.logo_url,
    })
    navigate('/company/intelligence')
  }

  const domain = company.website_url
    ? new URL(company.website_url).hostname.replace(/^www\./, '')
    : undefined

  return (
    <button
      onClick={handleClick}
      className="group relative flex flex-col gap-3 rounded-lg border bg-card p-4 text-left shadow-sm transition-all hover:shadow-md hover:border-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <CompanyLogo
          name={company.short_name || company.name}
          logoUrl={company.logo_url}
          domain={domain}
          size="md"
        />
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}
        >
          {company.company_type}
        </span>
      </div>

      {/* Name */}
      <div>
        <p className="font-heading font-semibold text-sm leading-tight text-foreground line-clamp-2">
          {company.name}
        </p>
        {company.short_name && company.short_name !== company.name && (
          <p className="mt-0.5 text-xs text-muted-foreground">{company.short_name}</p>
        )}
      </div>

      {/* Meta rows */}
      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3 shrink-0" />
          {isNullish(company.headquarters_address) ? (
            <span className="italic">not publicly available</span>
          ) : (
            <span className="truncate">{company.headquarters_address}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-3 w-3 shrink-0" />
          {isNullish(company.employee_size) ? (
            <span className="italic">not publicly available</span>
          ) : (
            <span className="truncate">{company.employee_size}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {isNegativeGrowth ? (
            <TrendingDown className="h-3 w-3 shrink-0 text-red-500" />
          ) : (
            <TrendingUp className="h-3 w-3 shrink-0 text-green-600" />
          )}
          {isNullish(company.yoy_growth_rate) ? (
            <span className="italic">not publicly available</span>
          ) : (
            <span className={isNegativeGrowth ? 'text-red-500' : ''}>{company.yoy_growth_rate} YoY</span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="h-4 w-4 text-blue-500" />
      </div>
    </button>
  )
})

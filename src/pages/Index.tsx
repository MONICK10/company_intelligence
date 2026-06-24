import { useState, useMemo, useCallback, memo } from 'react'
import { Search, X } from 'lucide-react'
import { CompanyCard } from '@/components/CompanyCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SEED_COMPANIES } from '@/data/seedCompanies'
import { normalizeCompanySummary, type CompanySummary } from '@/lib/companyData'
import { useDebounce } from '@/hooks/useDebounce'

const ALL_COMPANIES: CompanySummary[] = SEED_COMPANIES.map((c) =>
  normalizeCompanySummary(c.short_json as Record<string, unknown>, c.company_id),
)

const CATEGORY_FILTERS = ['All', 'Super Dream', 'Dream', 'Standard', 'Regular'] as const
type CategoryFilter = (typeof CATEGORY_FILTERS)[number]

const CATEGORY_COLORS: Record<string, string> = {
  All: 'bg-slate-100 text-slate-700 border-slate-200 data-[active=true]:bg-slate-800 data-[active=true]:text-white data-[active=true]:border-slate-800',
  'Super Dream':
    'bg-purple-50 text-purple-700 border-purple-200 data-[active=true]:bg-[#7c3aed] data-[active=true]:text-white data-[active=true]:border-[#7c3aed]',
  Dream:
    'bg-blue-50 text-blue-700 border-blue-200 data-[active=true]:bg-[#2563eb] data-[active=true]:text-white data-[active=true]:border-[#2563eb]',
  Standard:
    'bg-green-50 text-green-700 border-green-200 data-[active=true]:bg-[#16a34a] data-[active=true]:text-white data-[active=true]:border-[#16a34a]',
  Regular:
    'bg-amber-50 text-amber-700 border-amber-200 data-[active=true]:bg-[#d97706] data-[active=true]:text-white data-[active=true]:border-[#d97706]',
}

function countByCategory(companies: CompanySummary[]) {
  const counts: Record<string, number> = { All: companies.length }
  for (const c of companies) {
    counts[c.company_type] = (counts[c.company_type] ?? 0) + 1
  }
  return counts
}

// 8-card skeleton
const SkeletonGrid = memo(function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-4 animate-pulse">
          <div className="h-10 w-10 rounded bg-muted mb-3" />
          <div className="h-4 w-3/4 rounded bg-muted mb-2" />
          <div className="h-3 w-1/2 rounded bg-muted mb-4" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-2/3 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
})

export default function Index() {
  const [rawSearch, setRawSearch] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('All')
  const search = useDebounce(rawSearch, 200)

  const counts = useMemo(() => countByCategory(ALL_COMPANIES), [])

  const filtered = useMemo(() => {
    return ALL_COMPANIES.filter((c) => {
      const matchesCategory = category === 'All' || c.company_type === category
      if (!matchesCategory) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        c.short_name.toLowerCase().includes(q) ||
        c.headquarters_address.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      )
    })
  }, [search, category])

  const handleClear = useCallback(() => {
    setRawSearch('')
    setCategory('All')
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Wordmark */}
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 tracking-wide">
              KITS · INTELLIGENCE PLATFORM
            </span>
          </div>

          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl leading-tight">
            Karunya Institute of Technology and Sciences
            <br />
            <span className="text-muted-foreground font-medium text-xl sm:text-2xl lg:text-3xl">
              Companies Research &amp; Placement Analytics Portal
            </span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Your strategic edge for campus placements
          </p>

          {/* Search */}
          <div className="mt-5 relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9 pr-9 h-10"
              placeholder="Search companies, locations, categories..."
              value={rawSearch}
              onChange={(e) => setRawSearch(e.target.value)}
            />
            {rawSearch && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setRawSearch('')}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter pills + grid */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              data-active={category === cat}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${CATEGORY_COLORS[cat]}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
              <span className="ml-1.5 opacity-70">({counts[cat] ?? 0})</span>
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="mb-4 text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'company' : 'companies'} found
        </p>

        {/* Grid */}
        {ALL_COMPANIES.length === 0 ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-muted-foreground text-sm">No companies match your search.</p>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

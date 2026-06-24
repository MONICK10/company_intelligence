# Karunya Institute of Technology and Sciences — Placement Intelligence Hub

**KITS Companies Research & Placement Analytics Portal**

A mobile-first React + Vite + TypeScript + Tailwind v3 + shadcn/ui SPA for campus placement research and analytics.

---

## Phase 1 — UI Only (Current)

This is a **Phase 1 build**. All data comes from a single hardcoded TypeScript seed file:
`src/data/seedCompanies.ts`

- **No database.** No Supabase, no migrations, no RLS policies.
- **No login.** Every route is publicly accessible with no authentication.
- The portal renders fully from the Accenture seed record included in the seed file.

---

## College

**Karunya Institute of Technology and Sciences (KITS)**

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Company grid with search + category filters |
| `/company` | Redirects → `/company/intelligence` |
| `/company/intelligence` | 22-section company deep-dive with scroll-spy tabs |
| `/company/skills` | Skill intelligence with Bloom taxonomy + 10-level roadmaps |
| `*` | 404 Not Found |

No `/login`, no `/dashboard`.

---

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
npm run test      # Vitest smoke tests
```

---

## Environment Variables

Only one optional env var in Phase 1:

```env
VITE_LOGO_DEV_PUBLISHABLE_KEY=your_key_here
```

If unset, company logos fall back to the seed `logo_url`, then to an initial-letter circle.

**Do NOT add `VITE_SUPABASE_*` — Phase 1 has no Supabase.**

---

## Phase 2 — Supabase Integration (Future)

Phase 2 will swap the data layer from hardcoded seed → Supabase. The normalizers in
`src/lib/companyData.ts` accept the same JSON shapes as the future database tables:

- `normalizeCompanySummary(short_json, id)` → `CompanySummary`
- `normalizeCompanyProfile(full_json, short_json?)` → `CompanyProfile`
- `normalizeDashboardSkills(skill_levels[])` → `DashboardSkill[]`

Swapping seed → Supabase is a **one-file change**: pipe Supabase row results into these
normalizers instead of the seed data. No page or component changes required.

---

## Architecture

```
src/
├── data/
│   ├── seedCompanies.ts      # Phase 1 hardcoded data (Accenture)
│   ├── skillTopics.ts        # 10-level roadmaps for all 12 skills
│   └── intelligenceData.tsx  # 22-section schema with icons
├── lib/
│   ├── utils.ts              # cn() utility
│   └── companyData.ts        # Pure normalizers + TS interfaces
├── context/
│   └── CompanyContext.tsx    # localStorage-persisted company selection
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── CompanyLogo.tsx       # Logo.dev → seed URL → initial fallback
│   ├── CompanyCard.tsx       # Memoized card for the grid
│   ├── AppSidebar.tsx        # Collapsible sidebar with nav
│   └── AppLayout.tsx         # Shell with sidebar + breadcrumbs
├── pages/
│   ├── Index.tsx             # Company grid with search + filter
│   ├── CompanyIntelligence.tsx  # 22-section intelligence view
│   ├── SkillIntelligence.tsx    # Skill cards + roadmap
│   └── NotFound.tsx          # 404 page
└── hooks/
    └── useDebounce.ts        # 200ms search debounce
```

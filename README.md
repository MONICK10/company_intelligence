# Karunya Institute of Technology and Sciences — Placement Intelligence Hub

**KITS Companies Research & Placement Analytics Portal**

A mobile-first React + Vite + TypeScript + Tailwind v3 + shadcn/ui SPA for campus placement research and analytics.

---

## Phase 2 — Supabase (Current)

All company and skill data is loaded live from Supabase. No login required — every route is publicly accessible.

### The only manual step: fill in `.env`

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Copy `.env.example` to `.env` and paste your project URL and anon key from the Supabase dashboard (Settings → API). Then restart the dev server. That's it.

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

No `/login`, no `/dashboard`, no auth of any kind.

---

## Getting Started

```bash
cp .env.example .env          # then fill in VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm install
npm run dev                   # http://localhost:5173
npm run build                 # production build
npm run test                  # Vitest smoke tests
```

---

## Data Sources

| Data | Table(s) |
|------|----------|
| Company grid | `company_json.short_json` |
| 22-section intelligence | `company_json.full_json` |
| Skill cards + criticality | `company_skill_levels`, `skill_set_master`, `proficiency_levels` |
| 10-level roadmaps | `skill_set_topics` |

Only the `company_json` table is used for company data — no joins to the 90+ normalised company tables.

---

## Architecture

```
src/
├── data/
│   ├── seedCompanies.ts         # Phase 1 fallback (Accenture) — not used in live path
│   ├── skillTopics.ts           # Phase 1 fallback roadmaps — not used in live path
│   └── intelligenceData.tsx     # 22-section schema with icons
├── lib/
│   ├── supabaseClient.ts        # Supabase JS client (env-var validated)
│   ├── companyApi.ts            # React Query hooks: useCompanies, useCompanyProfile, useCompanySkills
│   ├── companyData.ts           # Pure normalizers + TS interfaces
│   └── utils.ts                 # cn() utility
├── context/
│   └── CompanyContext.tsx       # localStorage-persisted company selection
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── CompanyLogo.tsx          # Logo.dev → seed URL → initial fallback
│   ├── CompanyCard.tsx          # Memoized card for the grid
│   ├── AppSidebar.tsx           # Collapsible sidebar with nav
│   └── AppLayout.tsx            # Shell with sidebar + breadcrumbs
├── pages/
│   ├── Index.tsx                # Company grid — useCompanies()
│   ├── CompanyIntelligence.tsx  # 22-section view — useCompanyProfile()
│   ├── SkillIntelligence.tsx    # Skill cards — useCompanySkills()
│   └── NotFound.tsx             # 404 page
└── hooks/
    └── useDebounce.ts           # 200ms search debounce
```

---

## Hard Constraints (permanent)

- **No login.** No AuthContext, no ProtectedRoute, no Supabase Auth. Every route is open.
- **No CTC / Stipend / Selection Ratio** displayed anywhere.
- **Read-only.** No inserts, updates, or deletes against Supabase.
- **No college logo** in the UI.

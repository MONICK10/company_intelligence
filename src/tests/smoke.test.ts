import { describe, it, expect } from 'vitest'
import { SEED_COMPANIES } from '../data/seedCompanies'
import { normalizeCompanySummary, normalizeCompanyProfile, normalizeDashboardSkills } from '../lib/companyData'
import { buildIntelligenceSections } from '../data/intelligenceData'
import { SKILL_ROADMAPS } from '../data/skillTopics'

describe('Seed data smoke tests', () => {
  it('SEED_COMPANIES has at least one entry', () => {
    expect(SEED_COMPANIES.length).toBeGreaterThanOrEqual(1)
  })

  it('normalizeCompanySummary produces correct shape for Accenture', () => {
    const entry = SEED_COMPANIES[0]
    const summary = normalizeCompanySummary(entry.short_json as Record<string, unknown>, entry.company_id)
    expect(summary.name).toBe('Accenture plc')
    expect(summary.company_type).toBe('Dream')
    expect(summary.id).toBe(1)
  })

  it('normalizeCompanyProfile maps all key fields', () => {
    const entry = SEED_COMPANIES[0]
    const profile = normalizeCompanyProfile(entry.full_json as Record<string, unknown>)
    expect(profile.name).toBe('Accenture plc')
    expect(profile.website_url).toBe('https://www.accenture.com')
    expect(profile.ceo_name).toBe('Julie Sweet')
  })

  it('buildIntelligenceSections returns exactly 22 sections', () => {
    const sections = buildIntelligenceSections()
    expect(sections).toHaveLength(22)
  })

  it('normalizeDashboardSkills sorts by score descending', () => {
    const entry = SEED_COMPANIES[0]
    const skills = normalizeDashboardSkills(entry.skill_levels)
    expect(skills.length).toBe(12)
    for (let i = 0; i < skills.length - 1; i++) {
      expect(skills[i].score).toBeGreaterThanOrEqual(skills[i + 1].score)
    }
  })

  it('SKILL_ROADMAPS has 10 levels for each of the 12 skills', () => {
    expect(SKILL_ROADMAPS).toHaveLength(12)
    for (const roadmap of SKILL_ROADMAPS) {
      expect(roadmap.levels).toHaveLength(10)
    }
  })

  it('no CTC/Stipend/SelectionRatio fields appear in intelligence sections', () => {
    const sections = buildIntelligenceSections()
    const forbidden = ['ctc', 'stipend', 'selection_ratio']
    for (const section of sections) {
      for (const field of section.fields) {
        const key = field.key.toLowerCase()
        const label = field.label.toLowerCase()
        for (const term of forbidden) {
          expect(key).not.toContain(term)
          expect(label).not.toContain(term)
        }
      }
    }
  })
})

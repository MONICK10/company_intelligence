import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import {
  normalizeCompanySummary,
  normalizeCompanyProfile,
  normalizeDashboardSkills,
  type CompanySummary,
  type CompanyProfile,
  type DashboardSkill,
} from '@/lib/companyData'

// ── Roadmap types (live path uses these; skillTopics.ts stays as documented fallback) ──

export interface SkillTopicLevel {
  level_number: number
  topic: string
}

export interface SkillRoadmap {
  skill_set_id: number
  levels: SkillTopicLevel[]
}

export interface CompanySkillsResult {
  skills: DashboardSkill[]
  roadmaps: SkillRoadmap[]
}

// ── useCompanies ──────────────────────────────────────────────────────────────
// SELECT company_id, short_json FROM company_json
// Maps each row through normalizeCompanySummary (same shape as seed short_json).

export function useCompanies() {
  return useQuery<CompanySummary[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_json')
        .select('company_id, short_json')

      if (error) throw error

      return (data ?? []).map((row: { company_id: number; short_json: unknown }) =>
        normalizeCompanySummary(
          row.short_json as Record<string, unknown>,
          row.company_id,
        ),
      )
    },
  })
}

// ── useCompanyProfile ─────────────────────────────────────────────────────────
// SELECT company_id, short_json, full_json FROM company_json WHERE company_id = id
// Maps through normalizeCompanyProfile (same shapes as seed full_json / short_json).

export function useCompanyProfile(id: number | null) {
  return useQuery<CompanyProfile>({
    queryKey: ['company-profile', id],
    enabled: id !== null,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_json')
        .select('company_id, short_json, full_json')
        .eq('company_id', id!)
        .single()

      if (error) throw error

      return normalizeCompanyProfile(
        data.full_json as Record<string, unknown>,
        data.short_json as Record<string, unknown>,
      )
    },
  })
}

// ── useCompanySkills ──────────────────────────────────────────────────────────
// Queries 4 skill tables and assembles DashboardSkill[] + SkillRoadmap[].
// Tables used: company_skill_levels, skill_set_master, proficiency_levels, skill_set_topics

export function useCompanySkills(id: number | null) {
  return useQuery<CompanySkillsResult>({
    queryKey: ['company-skills', id],
    enabled: id !== null,
    queryFn: async () => {
      // 1 — Skill levels for this company
      const { data: skillLevels, error: slErr } = await supabase
        .from('company_skill_levels')
        .select('skill_set_id, required_level, required_proficiency_level_id')
        .eq('company_id', id!)

      if (slErr) throw slErr
      if (!skillLevels?.length) return { skills: [], roadmaps: [] }

      const skillSetIds = skillLevels.map((s: { skill_set_id: number }) => s.skill_set_id)
      const profIds = [
        ...new Set(
          skillLevels.map(
            (s: { required_proficiency_level_id: number }) => s.required_proficiency_level_id,
          ),
        ),
      ]

      // 2 — Skill names
      const { data: masters, error: smErr } = await supabase
        .from('skill_set_master')
        .select('skill_set_id, skill_set_name, short_name')
        .in('skill_set_id', skillSetIds)

      if (smErr) throw smErr

      // 3 — Proficiency labels
      const { data: proficiencies, error: pfErr } = await supabase
        .from('proficiency_levels')
        .select('proficiency_level_id, proficiency_name, proficiency_code')
        .in('proficiency_level_id', profIds)

      if (pfErr) throw pfErr

      // 4 — Topic ladders
      const { data: topics, error: tpErr } = await supabase
        .from('skill_set_topics')
        .select('skill_set_id, level_number, topics')
        .in('skill_set_id', skillSetIds)
        .order('level_number', { ascending: true })

      if (tpErr) throw tpErr

      // Build lookup maps
      const masterMap = new Map(
        (masters ?? []).map(
          (m: { skill_set_id: number; skill_set_name: string; short_name: string }) => [
            m.skill_set_id,
            m,
          ],
        ),
      )
      const profMap = new Map(
        (proficiencies ?? []).map(
          (p: { proficiency_level_id: number; proficiency_name: string; proficiency_code: string }) => [
            p.proficiency_level_id,
            p,
          ],
        ),
      )

      // Assemble skill input for the existing normalizer
      const skillInput = skillLevels.map(
        (s: { skill_set_id: number; required_level: number; required_proficiency_level_id: number }) => ({
          skill_set_id: s.skill_set_id,
          skill_set_name:
            masterMap.get(s.skill_set_id)?.skill_set_name ?? `Skill ${s.skill_set_id}`,
          required_level: s.required_level,
          required_proficiency:
            profMap.get(s.required_proficiency_level_id)?.proficiency_name ?? '',
        }),
      )

      // Build roadmaps from topics
      const roadmapMap = new Map<number, SkillRoadmap>()
      for (const t of topics ?? []) {
        const row = t as { skill_set_id: number; level_number: number; topics: unknown }
        if (!roadmapMap.has(row.skill_set_id)) {
          roadmapMap.set(row.skill_set_id, { skill_set_id: row.skill_set_id, levels: [] })
        }
        roadmapMap.get(row.skill_set_id)!.levels.push({
          level_number: row.level_number,
          topic: typeof row.topics === 'string' ? row.topics : String(row.topics ?? ''),
        })
      }

      return {
        skills: normalizeDashboardSkills(skillInput),
        roadmaps: Array.from(roadmapMap.values()),
      }
    },
  })
}

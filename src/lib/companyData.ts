// Pure normalizers — inputs mirror the raw JSON shapes from seed / future Supabase rows.
// Swapping seed → Supabase is a one-file change: pipe Supabase rows into these functions.

export interface CompanySummary {
  id: number
  name: string
  short_name: string
  logo_url: string
  category: string
  company_type: string
  incorporation_year: number | null
  employee_size: string
  headquarters_address: string
  operating_countries: string[]
  office_locations: string[]
  yoy_growth_rate: string
  website_url: string
}

export interface CompanyProfile {
  // Identity
  name: string
  short_name: string
  category: string
  incorporation_year: number | null
  nature_of_company: string
  overview_text: string
  headquarters_address: string
  operating_countries: string
  office_count: string
  office_locations: string
  employee_size: string
  vision_statement: string
  mission_statement: string
  core_values: string
  history_timeline: string
  recent_news: string
  // Digital presence
  website_url: string
  linkedin_url: string
  twitter_handle: string
  facebook_url: string
  instagram_url: string
  primary_contact_email: string
  primary_phone_number: string
  // Risk & compliance
  regulatory_status: string
  legal_issues: string
  esg_ratings: string
  supply_chain_dependencies: string
  geopolitical_risks: string
  macro_risks: string
  carbon_footprint: string
  ethical_sourcing: string
  // Brand & ratings
  marketing_video_url: string
  customer_testimonials: string
  website_quality: string
  website_rating: string
  website_traffic_rank: string
  social_media_followers: string
  glassdoor_rating: string
  indeed_rating: string
  google_rating: string
  awards_recognitions: string
  brand_sentiment_score: string
  event_participation: string
  // Products & services
  pain_points_addressed: string
  focus_sectors: string
  offerings_description: string
  top_customers: string
  core_value_proposition: string
  unique_differentiators: string
  competitive_advantages: string
  weaknesses_gaps: string
  key_challenges_needs: string
  key_competitors: string
  market_share_percentage: string
  sales_motion: string
  customer_concentration_risk: string
  exit_strategy_history: string
  benchmark_vs_peers: string
  future_projections: string
  strategic_priorities: string
  industry_associations: string
  case_studies: string
  go_to_market_strategy: string
  innovation_roadmap: string
  product_pipeline: string
  tam: string
  sam: string
  som: string
  // Culture & benefits
  leave_policy: string
  health_support: string
  fixed_vs_variable_pay: string
  bonus_predictability: string
  esops_incentives: string
  family_health_insurance: string
  relocation_support: string
  lifestyle_benefits: string
  hiring_velocity: string
  employee_turnover: string
  avg_retention_tenure: string
  diversity_metrics: string
  work_culture_summary: string
  manager_quality: string
  psychological_safety: string
  feedback_culture: string
  diversity_inclusion_score: string
  ethical_standards: string
  burnout_risk: string
  layoff_history: string
  mission_clarity: string
  sustainability_csr: string
  crisis_behavior: string
  // Funding & financials
  annual_revenue: string
  annual_profit: string
  revenue_mix: string
  valuation: string
  yoy_growth_rate: string
  profitability_status: string
  key_investors: string
  recent_funding_rounds: string
  total_capital_raised: string
  customer_acquisition_cost: string
  customer_lifetime_value: string
  cac_ltv_ratio: string
  churn_rate: string
  net_promoter_score: string
  burn_rate: string
  runway_months: string
  burn_multiplier: string
  // Work location
  remote_policy_details: string
  typical_hours: string
  overtime_expectations: string
  weekend_work: string
  flexibility_level: string
  location_centrality: string
  public_transport_access: string
  cab_policy: string
  airport_commute_time: string
  office_zone_type: string
  area_safety: string
  safety_policies: string
  infrastructure_safety: string
  emergency_preparedness: string
  // Leadership
  ceo_name: string
  ceo_linkedin_url: string
  key_leaders: string
  warm_intro_pathways: string
  decision_maker_access: string
  contact_person_name: string
  contact_person_title: string
  contact_person_email: string
  contact_person_phone: string
  board_members: string
  // Career growth
  training_spend: string
  onboarding_quality: string
  learning_culture: string
  exposure_quality: string
  mentorship_availability: string
  internal_mobility: string
  promotion_clarity: string
  tools_access: string
  role_clarity: string
  early_ownership: string
  work_impact: string
  execution_thinking_balance: string
  automation_level: string
  cross_functional_exposure: string
  company_maturity: string
  brand_value: string
  client_quality: string
  exit_opportunities: string
  skill_relevance: string
  external_recognition: string
  network_strength: string
  global_exposure: string
  // Tech
  technology_partners: string
  intellectual_property: string
  r_and_d_investment: string
  ai_ml_adoption_level: string
  tech_stack: string
  cybersecurity_posture: string
  partnership_ecosystem: string
  tech_adoption_rating: string
}

export interface DashboardSkill {
  skill_set_id: number
  skill_set_name: string
  required_level: number
  required_proficiency: string
  bloom_level: 'CU' | 'AP' | 'AS' | 'EV' | 'CR'
  criticality: 'Critical' | 'Important' | 'Baseline'
  score: number
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function asString(v: unknown): string {
  if (v === null || v === undefined) return ''
  return String(v)
}

export function asRecord(v: unknown): Record<string, unknown> {
  if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>
  return {}
}

export function splitItems(v: string): string[] {
  if (!v) return []
  return v
    .split(/[;\n•]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function titleCaseFromCode(code: string): string {
  return code
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function scoreToDifficulty(score: number): string {
  if (score >= 8) return 'EXPERT'
  if (score >= 6) return 'ADVANCED'
  if (score >= 4) return 'PRO'
  return 'BEGINNER'
}

export function proficiencyToBloom(level: number): DashboardSkill['bloom_level'] {
  if (level <= 2) return 'CU'
  if (level <= 4) return 'AP'
  if (level <= 6) return 'AS'
  if (level <= 8) return 'EV'
  return 'CR'
}

export function scoreToCriticality(score: number): DashboardSkill['criticality'] {
  if (score >= 7) return 'Critical'
  if (score >= 5) return 'Important'
  return 'Baseline'
}

// ── Normalizers ───────────────────────────────────────────────────────────────

export function normalizeCompanySummary(
  short_json: Record<string, unknown>,
  id: number,
): CompanySummary {
  return {
    id,
    name: asString(short_json.name),
    short_name: asString(short_json.short_name),
    logo_url: asString(short_json.logo_url),
    category: asString(short_json.category),
    company_type: asString(short_json.company_type),
    incorporation_year: short_json.incorporation_year ? Number(short_json.incorporation_year) : null,
    employee_size: asString(short_json.employee_size),
    headquarters_address: asString(short_json.headquarters_address),
    operating_countries: splitItems(asString(short_json.operating_countries)),
    office_locations: splitItems(asString(short_json.office_locations)),
    yoy_growth_rate: asString(short_json.yoy_growth_rate),
    website_url: asString(short_json.website_url),
  }
}

export function normalizeCompanyProfile(
  full_json: Record<string, unknown>,
  _short_json?: Record<string, unknown>,
): CompanyProfile {
  const s = (key: string) => asString(full_json[key])
  return {
    name: s('name'),
    short_name: s('short_name'),
    category: s('category'),
    incorporation_year: full_json.incorporation_year ? Number(full_json.incorporation_year) : null,
    nature_of_company: s('nature_of_company'),
    overview_text: s('overview_text'),
    headquarters_address: s('headquarters_address'),
    operating_countries: s('operating_countries'),
    office_count: s('office_count'),
    office_locations: s('office_locations'),
    employee_size: s('employee_size'),
    vision_statement: s('vision_statement'),
    mission_statement: s('mission_statement'),
    core_values: s('core_values'),
    history_timeline: s('history_timeline'),
    recent_news: s('recent_news'),
    website_url: s('website_url'),
    linkedin_url: s('linkedin_url'),
    twitter_handle: s('twitter_handle'),
    facebook_url: s('facebook_url'),
    instagram_url: s('instagram_url'),
    primary_contact_email: s('primary_contact_email'),
    primary_phone_number: s('primary_phone_number'),
    regulatory_status: s('regulatory_status'),
    legal_issues: s('legal_issues'),
    esg_ratings: s('esg_ratings'),
    supply_chain_dependencies: s('supply_chain_dependencies'),
    geopolitical_risks: s('geopolitical_risks'),
    macro_risks: s('macro_risks'),
    carbon_footprint: s('carbon_footprint'),
    ethical_sourcing: s('ethical_sourcing'),
    marketing_video_url: s('marketing_video_url'),
    customer_testimonials: s('customer_testimonials'),
    website_quality: s('website_quality'),
    website_rating: s('website_rating'),
    website_traffic_rank: s('website_traffic_rank'),
    social_media_followers: s('social_media_followers'),
    glassdoor_rating: s('glassdoor_rating'),
    indeed_rating: s('indeed_rating'),
    google_rating: s('google_rating'),
    awards_recognitions: s('awards_recognitions'),
    brand_sentiment_score: s('brand_sentiment_score'),
    event_participation: s('event_participation'),
    pain_points_addressed: s('pain_points_addressed'),
    focus_sectors: s('focus_sectors'),
    offerings_description: s('offerings_description'),
    top_customers: s('top_customers'),
    core_value_proposition: s('core_value_proposition'),
    unique_differentiators: s('unique_differentiators'),
    competitive_advantages: s('competitive_advantages'),
    weaknesses_gaps: s('weaknesses_gaps'),
    key_challenges_needs: s('key_challenges_needs'),
    key_competitors: s('key_competitors'),
    market_share_percentage: s('market_share_percentage'),
    sales_motion: s('sales_motion'),
    customer_concentration_risk: s('customer_concentration_risk'),
    exit_strategy_history: s('exit_strategy_history'),
    benchmark_vs_peers: s('benchmark_vs_peers'),
    future_projections: s('future_projections'),
    strategic_priorities: s('strategic_priorities'),
    industry_associations: s('industry_associations'),
    case_studies: s('case_studies'),
    go_to_market_strategy: s('go_to_market_strategy'),
    innovation_roadmap: s('innovation_roadmap'),
    product_pipeline: s('product_pipeline'),
    tam: s('tam'),
    sam: s('sam'),
    som: s('som'),
    leave_policy: s('leave_policy'),
    health_support: s('health_support'),
    fixed_vs_variable_pay: s('fixed_vs_variable_pay'),
    bonus_predictability: s('bonus_predictability'),
    esops_incentives: s('esops_incentives'),
    family_health_insurance: s('family_health_insurance'),
    relocation_support: s('relocation_support'),
    lifestyle_benefits: s('lifestyle_benefits'),
    hiring_velocity: s('hiring_velocity'),
    employee_turnover: s('employee_turnover'),
    avg_retention_tenure: s('avg_retention_tenure'),
    diversity_metrics: s('diversity_metrics'),
    work_culture_summary: s('work_culture_summary'),
    manager_quality: s('manager_quality'),
    psychological_safety: s('psychological_safety'),
    feedback_culture: s('feedback_culture'),
    diversity_inclusion_score: s('diversity_inclusion_score'),
    ethical_standards: s('ethical_standards'),
    burnout_risk: s('burnout_risk'),
    layoff_history: s('layoff_history'),
    mission_clarity: s('mission_clarity'),
    sustainability_csr: s('sustainability_csr'),
    crisis_behavior: s('crisis_behavior'),
    annual_revenue: s('annual_revenue'),
    annual_profit: s('annual_profit'),
    revenue_mix: s('revenue_mix'),
    valuation: s('valuation'),
    yoy_growth_rate: s('yoy_growth_rate'),
    profitability_status: s('profitability_status'),
    key_investors: s('key_investors'),
    recent_funding_rounds: s('recent_funding_rounds'),
    total_capital_raised: s('total_capital_raised'),
    customer_acquisition_cost: s('customer_acquisition_cost'),
    customer_lifetime_value: s('customer_lifetime_value'),
    cac_ltv_ratio: s('cac_ltv_ratio'),
    churn_rate: s('churn_rate'),
    net_promoter_score: s('net_promoter_score'),
    burn_rate: s('burn_rate'),
    runway_months: s('runway_months'),
    burn_multiplier: s('burn_multiplier'),
    remote_policy_details: s('remote_policy_details'),
    typical_hours: s('typical_hours'),
    overtime_expectations: s('overtime_expectations'),
    weekend_work: s('weekend_work'),
    flexibility_level: s('flexibility_level'),
    location_centrality: s('location_centrality'),
    public_transport_access: s('public_transport_access'),
    cab_policy: s('cab_policy'),
    airport_commute_time: s('airport_commute_time'),
    office_zone_type: s('office_zone_type'),
    area_safety: s('area_safety'),
    safety_policies: s('safety_policies'),
    infrastructure_safety: s('infrastructure_safety'),
    emergency_preparedness: s('emergency_preparedness'),
    ceo_name: s('ceo_name'),
    ceo_linkedin_url: s('ceo_linkedin_url'),
    key_leaders: s('key_leaders'),
    warm_intro_pathways: s('warm_intro_pathways'),
    decision_maker_access: s('decision_maker_access'),
    contact_person_name: s('contact_person_name'),
    contact_person_title: s('contact_person_title'),
    contact_person_email: s('contact_person_email'),
    contact_person_phone: s('contact_person_phone'),
    board_members: s('board_members'),
    training_spend: s('training_spend'),
    onboarding_quality: s('onboarding_quality'),
    learning_culture: s('learning_culture'),
    exposure_quality: s('exposure_quality'),
    mentorship_availability: s('mentorship_availability'),
    internal_mobility: s('internal_mobility'),
    promotion_clarity: s('promotion_clarity'),
    tools_access: s('tools_access'),
    role_clarity: s('role_clarity'),
    early_ownership: s('early_ownership'),
    work_impact: s('work_impact'),
    execution_thinking_balance: s('execution_thinking_balance'),
    automation_level: s('automation_level'),
    cross_functional_exposure: s('cross_functional_exposure'),
    company_maturity: s('company_maturity'),
    brand_value: s('brand_value'),
    client_quality: s('client_quality'),
    exit_opportunities: s('exit_opportunities'),
    skill_relevance: s('skill_relevance'),
    external_recognition: s('external_recognition'),
    network_strength: s('network_strength'),
    global_exposure: s('global_exposure'),
    technology_partners: s('technology_partners'),
    intellectual_property: s('intellectual_property'),
    r_and_d_investment: s('r_and_d_investment'),
    ai_ml_adoption_level: s('ai_ml_adoption_level'),
    tech_stack: s('tech_stack'),
    cybersecurity_posture: s('cybersecurity_posture'),
    partnership_ecosystem: s('partnership_ecosystem'),
    tech_adoption_rating: s('tech_adoption_rating'),
  }
}

export function normalizeDashboardSkills(
  skillLevels: Array<{
    skill_set_id: number
    skill_set_name: string
    required_level: number
    required_proficiency: string
  }>,
): DashboardSkill[] {
  return skillLevels
    .map((s) => ({
      skill_set_id: s.skill_set_id,
      skill_set_name: s.skill_set_name,
      required_level: s.required_level,
      required_proficiency: s.required_proficiency,
      bloom_level: proficiencyToBloom(s.required_level),
      criticality: scoreToCriticality(s.required_level),
      score: s.required_level,
    }))
    .sort((a, b) => b.score - a.score)
}

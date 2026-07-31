export const CAMPAIGNS = ["Engagement", "Awareness", "Retailer Support"] as const
export type Campaign = (typeof CAMPAIGNS)[number]

export interface KPIData {
  totalSpend: number
  followerGrowth: number
  followerGrowthExclGiveaway?: number
  giveawayFollows?: number
  startFollowers: number
  endFollowers: number
  blendedCPF: number
  // CPF using only the Engagement campaign spend ÷ its follows (the campaign
  // actually built to drive follows). Excludes Awareness/Retailer spend.
  engagementCPF: number
  totalReach: number
  paidFollows: number
  totalImpressions: number
  engagementCTR: number
  messagingContacts: number
  unfollows: number
}

export interface AdData {
  name: string
  spend: number
  impressions: number
  clicks: number
  follows: number
  cpf: number | null
  ctr: number
  campaign: Campaign
}

export interface SpendByCampaign {
  name: string
  value: number
  color: string
}

export interface WeeklyFollows {
  week: string
  paid: number
  total: number
  note?: string
}

// Daily follower growth from IG Insights (organic + paid combined).
export interface IgDailyFollow {
  date: string
  follows: number
}

// Audience demographics from IG Insights.
export interface AudienceDemographics {
  // Date the snapshot covers, e.g. "Jun 1–22, 2026".
  asOf: string
  topCountries: { name: string; pct: number }[]
  ageGender: { range: string; women: number; men: number }[]
  topCities: { name: string; pct: number }[]
}

export interface AudienceTestResult {
  name: string
  dateRange: string
  audience: string
  size: string
  spend: number
  impressions: number
  reach: number
  clicks: number
  cpm: number
  ctr: number
  cpc: number
  winningCreative: string
  winningCreativeCtr: number
  winningCreativeCpc?: number
  status: "complete" | "in-progress"
}

export interface AudienceTest {
  baseline: {
    name: string
    cpm: number
    description: string
  }
  tests: AudienceTestResult[]
  winner: string
  winnerReason: string
}

// A single arm of a head-to-head test (challenger vs. control).
export interface TestArm {
  name: string
  note: string
  spend: number
  impressions: number
  clicks: number
  follows: number
  profileVisits: number
  cpf: number | null
  ctr: number // link click-through rate (clicks ÷ impressions)
  followRate: number // IG follow rate (follows ÷ profile visits) — distinct from CTR
  cpc: number
}

// Testing context for a month: one featured head-to-head test plus shorter
// context notes explaining short-lived / carryover / promo test runs.
export interface TestingContext {
  featured: {
    name: string
    dateRange: string
    hypothesis: string
    kpiFocus: string
    // Two-arm tests use challenger/control. Multi-arm tests (3+) provide `arms`
    // instead, ordered as they should appear left-to-right in the comparison.
    challenger?: TestArm
    control?: TestArm
    arms?: TestArm[]
    verdict: string
  }
  notes: {
    title: string
    dateRange: string
    spend: number
    status: string
    detail: string
  }[]
}

// Q1 2026 baseline (no paid ads) - for comparison
export const Q1_BASELINE = {
  january: { follows: 350, messagingContacts: 180 },
  february: { follows: 350, messagingContacts: 180 },
  march: { follows: 331, messagingContacts: 155 },
  avgMonthlyFollows: 341, // Jan-Mar average with no ads
}

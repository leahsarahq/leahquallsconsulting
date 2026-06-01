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

// Q1 2026 baseline (no paid ads) - for comparison
export const Q1_BASELINE = {
  january: { follows: 350, messagingContacts: 180 },
  february: { follows: 350, messagingContacts: 180 },
  march: { follows: 331, messagingContacts: 155 },
  avgMonthlyFollows: 341, // Jan-Mar average with no ads
}

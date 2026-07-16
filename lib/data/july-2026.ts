import type { Campaign, KPIData } from "./types"

// July 2026 data — IN PROGRESS (Jul 1–16).
// Source: Meta Ads Manager "Campaigns" exports covering all three campaigns for
// every day Jul 1–16 (the Jul 9–16 pull includes the full day 9).
// This month is intentionally scoped to weekly pace tracking vs. June — the full
// set of dashboard sections (creative, insights, testing, demographics) will be
// added once the month completes and the IG Insights exports are available.

// Daily spend + ad-attributed follows per campaign (keys match the Progress tab's
// weekly bucketing). Follows are attributed to the Engagement campaign only.
export const JULY_DAILY_DATA: Record<string, Record<string, { spend: number; follows: number }>> = {
  "2026-07-01": { "Awareness Campaign": { spend: 72.11, follows: 0 }, "Engagement Campaign": { spend: 85.4, follows: 56 }, "Retailer Support": { spend: 117.39, follows: 0 } },
  "2026-07-02": { "Awareness Campaign": { spend: 38.62, follows: 0 }, "Engagement Campaign": { spend: 88.88, follows: 70 }, "Retailer Support": { spend: 122.72, follows: 0 } },
  "2026-07-03": { "Awareness Campaign": { spend: 41.47, follows: 0 }, "Engagement Campaign": { spend: 101.51, follows: 54 }, "Retailer Support": { spend: 102.41, follows: 0 } },
  "2026-07-04": { "Awareness Campaign": { spend: 40.57, follows: 0 }, "Engagement Campaign": { spend: 99.6, follows: 53 }, "Retailer Support": { spend: 102.74, follows: 0 } },
  "2026-07-05": { "Awareness Campaign": { spend: 73.33, follows: 0 }, "Engagement Campaign": { spend: 115.44, follows: 74 }, "Retailer Support": { spend: 131.3, follows: 0 } },
  "2026-07-06": { "Awareness Campaign": { spend: 45.04, follows: 0 }, "Engagement Campaign": { spend: 100, follows: 52 }, "Retailer Support": { spend: 100.45, follows: 0 } },
  "2026-07-07": { "Awareness Campaign": { spend: 46.05, follows: 0 }, "Engagement Campaign": { spend: 92.72, follows: 69 }, "Retailer Support": { spend: 92.55, follows: 0 } },
  "2026-07-08": { "Awareness Campaign": { spend: 49.33, follows: 0 }, "Engagement Campaign": { spend: 94.61, follows: 71 }, "Retailer Support": { spend: 91.51, follows: 0 } },
  // Jul 9 now reflects the full day (the earlier pull was an early-morning partial).
  "2026-07-09": { "Awareness Campaign": { spend: 42.42, follows: 0 }, "Engagement Campaign": { spend: 106.86, follows: 70 }, "Retailer Support": { spend: 90.45, follows: 0 } },
  "2026-07-10": { "Awareness Campaign": { spend: 44.76, follows: 0 }, "Engagement Campaign": { spend: 147.1, follows: 62 }, "Retailer Support": { spend: 92.11, follows: 0 } },
  "2026-07-11": { "Awareness Campaign": { spend: 49.05, follows: 0 }, "Engagement Campaign": { spend: 155.35, follows: 85 }, "Retailer Support": { spend: 101.59, follows: 0 } },
  "2026-07-12": { "Awareness Campaign": { spend: 51.27, follows: 0 }, "Engagement Campaign": { spend: 176.74, follows: 107 }, "Retailer Support": { spend: 119.03, follows: 0 } },
  "2026-07-13": { "Awareness Campaign": { spend: 53.01, follows: 0 }, "Engagement Campaign": { spend: 149.4, follows: 77 }, "Retailer Support": { spend: 102.08, follows: 0 } },
  "2026-07-14": { "Awareness Campaign": { spend: 81.36, follows: 0 }, "Engagement Campaign": { spend: 140.81, follows: 64 }, "Retailer Support": { spend: 155.44, follows: 0 } },
  "2026-07-15": { "Awareness Campaign": { spend: 43.61, follows: 0 }, "Engagement Campaign": { spend: 91.47, follows: 53 }, "Retailer Support": { spend: 92.27, follows: 0 } },
  "2026-07-16": { "Awareness Campaign": { spend: 11.77, follows: 0 }, "Engagement Campaign": { spend: 28.01, follows: 10 }, "Retailer Support": { spend: 30.31, follows: 0 } },
}

// MTD campaign spend totals (Jul 1–16) — full campaign-level data for all three
// campaigns across all 16 days.
const engagementSpend = 1773.9 // 778.16 (Jul 1–8) + 995.74 (Jul 9–16)
const awarenessSpend = 783.77 // 406.52 (Jul 1–8) + 377.25 (Jul 9–16)
const retailerSpend = 1644.35 // 861.07 (Jul 1–8) + 783.28 (Jul 9–16)
const totalSpend = Math.round(engagementSpend + awarenessSpend + retailerSpend) // 4202
const attributedFollows = 1027 // all from the Engagement campaign (499 Jul 1–8 + 528 Jul 9–16)

// Month-to-date KPIs (ad-attributed; no IG Insights export for July yet).
export const JULY_KPI_DATA: KPIData = {
  totalSpend,
  followerGrowth: attributedFollows, // ad-attributed MTD (organic/IG not yet imported)
  paidFollows: attributedFollows,
  startFollowers: 11531, // end of June (9,677 + 1,854)
  endFollowers: 11531 + attributedFollows,
  blendedCPF: totalSpend / attributedFollows, // ad-attributed MTD (~$4.09)
  engagementCPF: engagementSpend / attributedFollows, // ~$1.73
  totalReach: 1400000, // estimate; Jul 9–16 measured, Jul 1–8 approximated (not deduped)
  totalImpressions: 1483565, // Jul 9–16 measured (703,565) + Jul 1–8 estimate (~780,000)
  engagementCTR: 5.35, // avg engagement link CTR across Jul 9–16
  messagingContacts: 0, // not imported for July yet
  unfollows: 0,
}

export const JULY_SPEND_BY_CAMPAIGN = [
  { name: "Engagement", value: Math.round(engagementSpend), color: "#D93732" },
  { name: "Awareness", value: Math.round(awarenessSpend), color: "#660033" },
  { name: "Retailer Support", value: Math.round(retailerSpend), color: "#E8853A" },
]

// Weekly ad-attributed follows (Progress tab recomputes these from daily data;
// included for shape consistency with other months).
export const JULY_WEEKLY_FOLLOWS = [
  { week: "Jul 1–7", paid: 428, total: 428 },
  { week: "Jul 8–14", paid: 536, total: 536 },
  { week: "Jul 15–21", paid: 63, total: 63, note: "In progress — data through Jul 16" },
]

// Full creative-level data is not broken out while the month is in progress.
export const JULY_ADS_DATA: {
  name: string
  spend: number
  impressions: number
  clicks: number
  follows: number
  cpf: number | null
  ctr: number
  campaign: Campaign
}[] = []

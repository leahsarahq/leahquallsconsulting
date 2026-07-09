import type { Campaign, KPIData } from "./types"

// July 2026 data — IN PROGRESS (Jul 1–9 only).
// Source: Meta Ads Manager "Campaigns" export, Jul 1–9, 2026.
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
  "2026-07-09": { "Awareness Campaign": { spend: 11.18, follows: 0 }, "Engagement Campaign": { spend: 19.66, follows: 21 }, "Retailer Support": { spend: 30.38, follows: 0 } },
}

// MTD campaign spend totals (Jul 1–9)
const engagementSpend = 797.82
const awarenessSpend = 417.7
const retailerSpend = 891.45
const totalSpend = Math.round(engagementSpend + awarenessSpend + retailerSpend) // 2107
const attributedFollows = 520 // all from the Engagement campaign

// Month-to-date KPIs (ad-attributed; no IG Insights export for July yet).
export const JULY_KPI_DATA: KPIData = {
  totalSpend,
  followerGrowth: attributedFollows, // ad-attributed MTD (organic/IG not yet imported)
  paidFollows: attributedFollows,
  startFollowers: 11531, // end of June (9,677 + 1,854)
  endFollowers: 11531 + attributedFollows,
  blendedCPF: totalSpend / attributedFollows, // ad-attributed MTD
  engagementCPF: engagementSpend / attributedFollows, // ~$1.53
  totalReach: 752959, // sum of daily reach (upper bound; not deduped)
  totalImpressions: 794729,
  engagementCTR: 6.12,
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
  { week: "Jul 8–14", paid: 92, total: 92, note: "In progress — data through Jul 9" },
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

import type { Campaign, KPIData } from "./types"

// July 2026 data — IN PROGRESS (Jul 1–23).
// Source: Meta Ads Manager "Campaigns" exports covering all three campaigns for
// every day Jul 1–23 (later pulls include the full days 9 and 16).
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
  // Jul 16 now reflects the full day (the earlier pull was an early-morning partial).
  "2026-07-16": { "Awareness Campaign": { spend: 37.37, follows: 0 }, "Engagement Campaign": { spend: 100.81, follows: 52 }, "Retailer Support": { spend: 104.5, follows: 0 } },
  "2026-07-17": { "Awareness Campaign": { spend: 44.81, follows: 0 }, "Engagement Campaign": { spend: 102.36, follows: 38 }, "Retailer Support": { spend: 87.53, follows: 0 } },
  "2026-07-18": { "Awareness Campaign": { spend: 38.52, follows: 0 }, "Engagement Campaign": { spend: 104.63, follows: 52 }, "Retailer Support": { spend: 39.1, follows: 0 } },
  "2026-07-19": { "Awareness Campaign": { spend: 56.43, follows: 0 }, "Engagement Campaign": { spend: 115.26, follows: 50 }, "Retailer Support": { spend: 100.48, follows: 0 } },
  "2026-07-20": { "Awareness Campaign": { spend: 74.46, follows: 0 }, "Engagement Campaign": { spend: 104.94, follows: 61 }, "Retailer Support": { spend: 95.75, follows: 0 } },
  "2026-07-21": { "Awareness Campaign": { spend: 71.24, follows: 0 }, "Engagement Campaign": { spend: 97.97, follows: 49 }, "Retailer Support": { spend: 99.18, follows: 0 } },
  "2026-07-22": { "Awareness Campaign": { spend: 57.58, follows: 0 }, "Engagement Campaign": { spend: 96.87, follows: 55 }, "Retailer Support": { spend: 84.17, follows: 0 } },
  "2026-07-23": { "Awareness Campaign": { spend: 19.93, follows: 0 }, "Engagement Campaign": { spend: 32.17, follows: 17 }, "Retailer Support": { spend: 31.68, follows: 0 } },
}

// MTD campaign spend totals (Jul 1–23) — full campaign-level data for all three
// campaigns across all 23 days.
const engagementSpend = 2500.9 // 778.16 (Jul 1–8) + 967.73 (Jul 9–15) + 755.01 (Jul 16–23)
const awarenessSpend = 1172.34 // 406.52 (Jul 1–8) + 365.48 (Jul 9–15) + 400.34 (Jul 16–23)
const retailerSpend = 2256.43 // 861.07 (Jul 1–8) + 752.97 (Jul 9–15) + 642.39 (Jul 16–23)
const totalSpend = Math.round(engagementSpend + awarenessSpend + retailerSpend) // 5930
const attributedFollows = 1391 // all from the Engagement campaign (499 + 518 + 374)

// Month-to-date KPIs (ad-attributed; no IG Insights export for July yet).
export const JULY_KPI_DATA: KPIData = {
  totalSpend,
  followerGrowth: attributedFollows, // ad-attributed MTD (organic/IG not yet imported)
  paidFollows: attributedFollows,
  startFollowers: 11531, // end of June (9,677 + 1,854)
  endFollowers: 11531 + attributedFollows,
  blendedCPF: totalSpend / attributedFollows, // ad-attributed MTD (~$4.26)
  engagementCPF: engagementSpend / attributedFollows, // ~$1.80
  totalReach: 1880000, // rough estimate through Jul 23 (not deduped)
  totalImpressions: 2000000, // rough estimate through Jul 23
  engagementCTR: 4.3, // avg engagement link CTR across Jul 16–23
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
  { week: "Jul 15–21", paid: 355, total: 355 },
  { week: "Jul 22–28", paid: 72, total: 72, note: "In progress — data through Jul 23" },
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

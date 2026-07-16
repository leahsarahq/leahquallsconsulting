import type { Campaign, KPIData } from "./types"

// July 2026 data — IN PROGRESS (Jul 1–16).
// Sources: Meta Ads Manager "Campaigns" export (Jul 1–9, all campaigns) +
// "Ads" export (Jul 10–16, Engagement creatives only).
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
  // Jul 10–16: Ads export included only the two Engagement creatives (Frozen Pasta
  // Can't Be That Good + new "Imagine Hating On Me"). No Awareness/Retailer rows
  // were in this export, so only Engagement spend/follows are recorded for these days.
  "2026-07-10": { "Engagement Campaign": { spend: 42.79, follows: 35 } },
  "2026-07-11": { "Engagement Campaign": { spend: 53.17, follows: 51 } },
  "2026-07-12": { "Engagement Campaign": { spend: 58.4, follows: 75 } },
  "2026-07-13": { "Engagement Campaign": { spend: 49.87, follows: 41 } },
  "2026-07-14": { "Engagement Campaign": { spend: 47.85, follows: 45 } },
  "2026-07-15": { "Engagement Campaign": { spend: 48.06, follows: 44 } },
  "2026-07-16": { "Engagement Campaign": { spend: 13.82, follows: 6 } },
}

// MTD campaign spend totals (Jul 1–16)
// Engagement covers all 16 days. Awareness/Retailer only have Jul 1–9 data — the
// Jul 10–16 Ads export contained only the two Engagement creatives, so those
// campaigns' week-2 spend isn't yet reflected here.
const engagementSpend = 1111.78 // 797.82 (wk1) + 313.96 (wk2)
const awarenessSpend = 417.7 // Jul 1–9 only
const retailerSpend = 891.45 // Jul 1–9 only
const totalSpend = Math.round(engagementSpend + awarenessSpend + retailerSpend) // 2421
const attributedFollows = 817 // all from the Engagement campaign (520 wk1 + 297 wk2)

// Month-to-date KPIs (ad-attributed; no IG Insights export for July yet).
export const JULY_KPI_DATA: KPIData = {
  totalSpend,
  followerGrowth: attributedFollows, // ad-attributed MTD (organic/IG not yet imported)
  paidFollows: attributedFollows,
  startFollowers: 11531, // end of June (9,677 + 1,854)
  endFollowers: 11531 + attributedFollows,
  blendedCPF: totalSpend / attributedFollows, // ad-attributed MTD
  engagementCPF: engagementSpend / attributedFollows, // ~$1.36
  totalReach: 772248, // Jul 1–9 all campaigns + Jul 10–16 Engagement only (upper bound; not deduped)
  totalImpressions: 814694,
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
  { week: "Jul 8–14", paid: 339, total: 339 },
  { week: "Jul 15–21", paid: 50, total: 50, note: "In progress — data through Jul 16" },
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

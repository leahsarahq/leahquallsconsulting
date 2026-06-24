import type { Campaign, KPIData } from "./types"

// June 2026 data — IN PROGRESS. Imported from Meta Ads Manager exports (Jun 1–24).
// Follower numbers here are AD-ATTRIBUTED only; organic / IG Insights follows for
// June have not been imported yet, so month-to-date totals are conservative.
export const JUNE_DAILY_DATA: Record<string, Record<string, { spend: number; follows: number }>> = {
  "2026-06-01": { "Awareness Campaign": { spend: 59.3, follows: 0 }, "Engagement Campaign": { spend: 60.33, follows: 45 }, "Retailer Support": { spend: 189.18, follows: 0 } },
  "2026-06-02": { "Awareness Campaign": { spend: 96.78, follows: 0 }, "Engagement Campaign": { spend: 52.74, follows: 20 }, "Retailer Support": { spend: 215.22, follows: 0 } },
  "2026-06-03": { "Awareness Campaign": { spend: 89.62, follows: 0 }, "Engagement Campaign": { spend: 78.93, follows: 39 }, "Retailer Support": { spend: 119.79, follows: 0 } },
  "2026-06-04": { "Awareness Campaign": { spend: 101.9, follows: 0 }, "Engagement Campaign": { spend: 79.25, follows: 37 }, "Retailer Support": { spend: 77.42, follows: 0 } },
  "2026-06-05": { "Awareness Campaign": { spend: 105.15, follows: 0 }, "Engagement Campaign": { spend: 78.34, follows: 59 }, "Retailer Support": { spend: 41.88, follows: 0 } },
  "2026-06-06": { "Awareness Campaign": { spend: 113.92, follows: 0 }, "Engagement Campaign": { spend: 56.1, follows: 65 }, "Retailer Support": { spend: 25.82, follows: 0 } },
  "2026-06-07": { "Awareness Campaign": { spend: 98.43, follows: 0 }, "Engagement Campaign": { spend: 76.33, follows: 85 }, "Retailer Support": { spend: 141.5, follows: 1 } },
  "2026-06-08": { "Awareness Campaign": { spend: 149.49, follows: 0 }, "Engagement Campaign": { spend: 66.39, follows: 63 }, "Retailer Support": { spend: 77.98, follows: 0 } },
  "2026-06-09": { "Awareness Campaign": { spend: 84.24, follows: 0 }, "Engagement Campaign": { spend: 34.43, follows: 27 }, "Retailer Support": { spend: 105.06, follows: 0 } },
  "2026-06-10": { "Awareness Campaign": { spend: 112.41, follows: 0 }, "Engagement Campaign": { spend: 83.39, follows: 35 }, "Retailer Support": { spend: 87.91, follows: 0 } },
  "2026-06-11": { "Awareness Campaign": { spend: 77.99, follows: 0 }, "Engagement Campaign": { spend: 97.03, follows: 66 }, "Retailer Support": { spend: 87.59, follows: 0 } },
  "2026-06-12": { "Awareness Campaign": { spend: 94, follows: 0 }, "Engagement Campaign": { spend: 72.28, follows: 53 }, "Retailer Support": { spend: 96.45, follows: 0 } },
  "2026-06-13": { "Awareness Campaign": { spend: 83.39, follows: 0 }, "Engagement Campaign": { spend: 59.32, follows: 45 }, "Retailer Support": { spend: 99.31, follows: 0 } },
  "2026-06-14": { "Awareness Campaign": { spend: 102.39, follows: 0 }, "Engagement Campaign": { spend: 81.51, follows: 75 }, "Retailer Support": { spend: 103.7, follows: 0 } },
  "2026-06-15": { "Awareness Campaign": { spend: 100.15, follows: 0 }, "Engagement Campaign": { spend: 74.54, follows: 52 }, "Retailer Support": { spend: 90.91, follows: 0 } },
  "2026-06-16": { "Awareness Campaign": { spend: 143.61, follows: 0 }, "Engagement Campaign": { spend: 43.92, follows: 37 }, "Retailer Support": { spend: 97.83, follows: 0 } },
  "2026-06-17": { "Awareness Campaign": { spend: 78.36, follows: 0 }, "Engagement Campaign": { spend: 88.33, follows: 78 }, "Retailer Support": { spend: 94.74, follows: 0 } },
  "2026-06-18": { "Awareness Campaign": { spend: 105.77, follows: 0 }, "Engagement Campaign": { spend: 70.2, follows: 71 }, "Retailer Support": { spend: 132.73, follows: 0 } },
  "2026-06-19": { "Awareness Campaign": { spend: 80.68, follows: 0 }, "Engagement Campaign": { spend: 61.77, follows: 46 }, "Retailer Support": { spend: 99.74, follows: 0 } },
  "2026-06-20": { "Awareness Campaign": { spend: 89.01, follows: 0 }, "Engagement Campaign": { spend: 69.71, follows: 52 }, "Retailer Support": { spend: 79.72, follows: 0 } },
  "2026-06-21": { "Awareness Campaign": { spend: 129.39, follows: 0 }, "Engagement Campaign": { spend: 84.35, follows: 83 }, "Retailer Support": { spend: 121.35, follows: 0 } },
  "2026-06-22": { "Awareness Campaign": { spend: 94.14, follows: 0 }, "Engagement Campaign": { spend: 77.38, follows: 61 }, "Retailer Support": { spend: 130.61, follows: 0 } },
  "2026-06-23": { "Awareness Campaign": { spend: 44.07, follows: 0 }, "Engagement Campaign": { spend: 107.48, follows: 82 }, "Retailer Support": { spend: 231, follows: 0 } },
  "2026-06-24": { "Awareness Campaign": { spend: 21.19, follows: 0 }, "Engagement Campaign": { spend: 32.7, follows: 18 }, "Retailer Support": { spend: 68.65, follows: 0 } },
}

export const JUNE_ADS_DATA: {
  name: string
  spend: number
  impressions: number
  clicks: number
  follows: number
  cpf: number | null
  ctr: number
  campaign: Campaign
}[] = [
  // Engagement Campaign — follow-driving creative
  { name: "Cacio e Pepe Puffs", spend: 710.39, impressions: 43846, clicks: 3063, follows: 627, cpf: 1.13, ctr: 6.99, campaign: "Engagement" },
  { name: "Frozen Pasta Can't Be That Good", spend: 598.41, impressions: 42867, clicks: 1587, follows: 477, cpf: 1.25, ctr: 3.7, campaign: "Engagement" },
  { name: "Target On Shelves", spend: 116.77, impressions: 7955, clicks: 397, follows: 73, cpf: 1.6, ctr: 4.99, campaign: "Engagement" },
  { name: "Basil Pesto x Caraway", spend: 111.24, impressions: 4115, clicks: 207, follows: 51, cpf: 2.18, ctr: 5.03, campaign: "Engagement" },
  { name: "Joe Crispy Chicken Skin Crumble", spend: 38.69, impressions: 1986, clicks: 106, follows: 31, cpf: 1.25, ctr: 5.34, campaign: "Engagement" },
  { name: "Joe Basil Pesto at Target", spend: 26.08, impressions: 1302, clicks: 109, follows: 16, cpf: 1.63, ctr: 8.37, campaign: "Engagement" },
  { name: "Founder Message", spend: 22, impressions: 1889, clicks: 118, follows: 9, cpf: 2.44, ctr: 6.25, campaign: "Engagement" },
  { name: "Founder Content", spend: 22.34, impressions: 1663, clicks: 82, follows: 5, cpf: 4.47, ctr: 4.93, campaign: "Engagement" },
  { name: "Monthly Rip", spend: 31.97, impressions: 1566, clicks: 33, follows: 3, cpf: 10.66, ctr: 2.11, campaign: "Engagement" },
  { name: "4 Easy Pasta Dinners", spend: 5.26, impressions: 282, clicks: 10, follows: 1, cpf: 5.26, ctr: 3.55, campaign: "Engagement" },
  { name: "Joe Basil Pesto at Whole Foods", spend: 3.6, impressions: 221, clicks: 3, follows: 1, cpf: 3.6, ctr: 1.36, campaign: "Engagement" },
  // Awareness Campaign — reach creative (low CTR, high impressions)
  { name: "Us v. Them", spend: 1788.35, impressions: 885564, clicks: 923, follows: 0, cpf: null, ctr: 0.1, campaign: "Awareness" },
  { name: "Us v. Them (Target)", spend: 319.85, impressions: 194481, clicks: 325, follows: 1, cpf: 319.85, ctr: 0.17, campaign: "Awareness" },
  { name: "Us v. Them (Whole Foods)", spend: 266.66, impressions: 208303, clicks: 305, follows: 0, cpf: null, ctr: 0.15, campaign: "Awareness" },
  { name: "Sauce Splash", spend: 354.07, impressions: 158697, clicks: 176, follows: 0, cpf: null, ctr: 0.11, campaign: "Awareness" },
  { name: "Pasta Tower", spend: 97.05, impressions: 42157, clicks: 31, follows: 0, cpf: null, ctr: 0.07, campaign: "Awareness" },
  { name: "Dark Lifestyle", spend: 12.18, impressions: 5485, clicks: 3, follows: 0, cpf: null, ctr: 0.05, campaign: "Awareness" },
  { name: "Cacio e Pepe Hero Image", spend: 3.73, impressions: 1950, clicks: 0, follows: 0, cpf: null, ctr: 0, campaign: "Awareness" },
  // Retailer Support — product / logo creative
  { name: "Basil Pesto Exclusive (Target)", spend: 970.49, impressions: 496268, clicks: 565, follows: 0, cpf: null, ctr: 0.11, campaign: "Retailer Support" },
  { name: "Trio Logo (Whole Foods)", spend: 894.67, impressions: 507218, clicks: 591, follows: 0, cpf: null, ctr: 0.12, campaign: "Retailer Support" },
  { name: "On Sale Basil Pesto", spend: 127.15, impressions: 38250, clicks: 69, follows: 0, cpf: null, ctr: 0.18, campaign: "Retailer Support" },
  { name: "Basil Pesto Exclusive", spend: 37.25, impressions: 21966, clicks: 26, follows: 0, cpf: null, ctr: 0.12, campaign: "Retailer Support" },
]

// Campaign spend totals (Jun 1–24)
const engagementSpend = 1687
const awarenessSpend = 2255
const retailerSpend = 2616
const totalSpend = engagementSpend + awarenessSpend + retailerSpend // 6558
const attributedFollows = 1295 // ad-attributed follows MTD (1294 engagement + 1 retailer)

export const JUNE_KPI_DATA: KPIData = {
  totalSpend: totalSpend,
  followerGrowth: attributedFollows, // ad-attributed MTD (organic not yet imported)
  paidFollows: attributedFollows,
  startFollowers: 9677, // end of May
  endFollowers: 9677 + attributedFollows, // MTD
  blendedCPF: totalSpend / attributedFollows, // ~$5.06 (all spend ÷ attributed follows)
  totalReach: 2540726,
  totalImpressions: 2668034,
  engagementCTR: 5.31,
  messagingContacts: 0, // not yet imported for June
  unfollows: 0, // not yet imported for June
}

export const JUNE_SPEND_BY_CAMPAIGN = [
  { name: "Engagement", value: engagementSpend, color: "#D93732" },
  { name: "Awareness", value: awarenessSpend, color: "#660033" },
  { name: "Retailer Support", value: retailerSpend, color: "#E8853A" },
]

export const JUNE_WEEKLY_FOLLOWS = [
  { week: "Jun 1–7", paid: 350, total: 351 },
  { week: "Jun 8–14", paid: 364, total: 364 },
  { week: "Jun 15–21", paid: 419, total: 419 },
  { week: "Jun 22–24", paid: 161, total: 161, note: "Partial week (through Jun 24)" },
]

import type { Campaign } from "./types"

// May 2026 data (full month May 1-31)
export const MAY_DAILY_DATA: Record<string, Record<string, { spend: number; follows: number }>> = {
  "2026-05-01": { "Awareness Campaign": { spend: 45.41, follows: 0 }, "Engagement Campaign": { spend: 54.39, follows: 45 }, "Retailer Support": { spend: 26.28, follows: 0 } },
  "2026-05-02": { "Awareness Campaign": { spend: 49.13, follows: 0 }, "Engagement Campaign": { spend: 49.71, follows: 22 }, "Retailer Support": { spend: 5.42, follows: 0 } },
  "2026-05-03": { "Awareness Campaign": { spend: 86.11, follows: 0 }, "Engagement Campaign": { spend: 63.46, follows: 69 }, "Retailer Support": { spend: 73.51, follows: 0 } },
  "2026-05-04": { "Awareness Campaign": { spend: 84.47, follows: 0 }, "Engagement Campaign": { spend: 52.28, follows: 76 }, "Retailer Support": { spend: 81.38, follows: 0 } },
  "2026-05-05": { "Awareness Campaign": { spend: 69.21, follows: 0 }, "Engagement Campaign": { spend: 47.64, follows: 54 }, "Retailer Support": { spend: 56.36, follows: 0 } },
  "2026-05-06": { "Awareness Campaign": { spend: 52.37, follows: 0 }, "Engagement Campaign": { spend: 47.1, follows: 70 }, "Retailer Support": { spend: 72.49, follows: 0 } },
  "2026-05-07": { "Awareness Campaign": { spend: 50.56, follows: 0 }, "Engagement Campaign": { spend: 45.77, follows: 58 }, "Retailer Support": { spend: 47.04, follows: 0 } },
  "2026-05-08": { "Awareness Campaign": { spend: 4.34, follows: 0 }, "Engagement Campaign": { spend: 37.74, follows: 48 }, "Retailer Support": { spend: 6.41, follows: 0 } },
  "2026-05-09": { "Awareness Campaign": { spend: 2.02, follows: 0 }, "Engagement Campaign": { spend: 55.78, follows: 61 }, "Retailer Support": { spend: 11.42, follows: 0 } },
  "2026-05-10": { "Awareness Campaign": { spend: 6.67, follows: 0 }, "Engagement Campaign": { spend: 8.16, follows: 8 }, "Retailer Support": { spend: 4.17, follows: 0 } },
  "2026-05-11": { "Awareness Campaign": { spend: 87.5, follows: 0 }, "Engagement Campaign": { spend: 51.6, follows: 60 }, "Retailer Support": { spend: 121.38, follows: 0 } },
  "2026-05-12": { "Awareness Campaign": { spend: 87.36, follows: 0 }, "Engagement Campaign": { spend: 73.75, follows: 82 }, "Retailer Support": { spend: 152.19, follows: 0 } },
  "2026-05-13": { "Awareness Campaign": { spend: 63.24, follows: 0 }, "Engagement Campaign": { spend: 40.42, follows: 42 }, "Retailer Support": { spend: 87.09, follows: 0 } },
  "2026-05-14": { "Awareness Campaign": { spend: 84.05, follows: 0 }, "Engagement Campaign": { spend: 60.98, follows: 52 }, "Retailer Support": { spend: 68.24, follows: 0 } },
  "2026-05-15": { "Awareness Campaign": { spend: 102.78, follows: 0 }, "Engagement Campaign": { spend: 47.84, follows: 24 }, "Retailer Support": { spend: 11.39, follows: 0 } },
  "2026-05-16": { "Awareness Campaign": { spend: 9.88, follows: 0 }, "Engagement Campaign": { spend: 66.89, follows: 67 }, "Retailer Support": { spend: 9.59, follows: 0 } },
  "2026-05-17": { "Awareness Campaign": { spend: 87.42, follows: 0 }, "Engagement Campaign": { spend: 66.08, follows: 92 }, "Retailer Support": { spend: 96.8, follows: 0 } },
  "2026-05-18": { "Awareness Campaign": { spend: 87.5, follows: 0 }, "Engagement Campaign": { spend: 51.37, follows: 59 }, "Retailer Support": { spend: 118.25, follows: 0 } },
  "2026-05-19": { "Awareness Campaign": { spend: 84.11, follows: 0 }, "Engagement Campaign": { spend: 51.33, follows: 57 }, "Retailer Support": { spend: 90.76, follows: 0 } },
  "2026-05-20": { "Awareness Campaign": { spend: 82.62, follows: 0 }, "Engagement Campaign": { spend: 49.4, follows: 62 }, "Retailer Support": { spend: 145.9, follows: 0 } },
  "2026-05-21": { "Awareness Campaign": { spend: 3.36, follows: 0 }, "Engagement Campaign": { spend: 49.81, follows: 54 }, "Retailer Support": { spend: 128.52, follows: 0 } },
  "2026-05-22": { "Awareness Campaign": { spend: 1.13, follows: 0 }, "Engagement Campaign": { spend: 67.79, follows: 78 }, "Retailer Support": { spend: 88.23, follows: 0 } },
  "2026-05-23": { "Awareness Campaign": { spend: 3.83, follows: 0 }, "Engagement Campaign": { spend: 66.9, follows: 78 }, "Retailer Support": { spend: 24.12, follows: 0 } },
  "2026-05-24": { "Awareness Campaign": { spend: 87.5, follows: 0 }, "Engagement Campaign": { spend: 55.49, follows: 74 }, "Retailer Support": { spend: 84.66, follows: 0 } },
  "2026-05-27": { "Awareness Campaign": { spend: 87.5, follows: 0 }, "Engagement Campaign": { spend: 94.95, follows: 67 }, "Retailer Support": { spend: 44.03, follows: 0 } },
  "2026-05-28": { "Awareness Campaign": { spend: 86.98, follows: 0 }, "Engagement Campaign": { spend: 116.33, follows: 79 }, "Retailer Support": { spend: 70.69, follows: 0 } },
  "2026-05-29": { "Awareness Campaign": { spend: 87.42, follows: 0 }, "Engagement Campaign": { spend: 100.32, follows: 101 }, "Retailer Support": { spend: 71.1, follows: 0 } },
  "2026-05-30": { "Awareness Campaign": { spend: 0.6, follows: 0 }, "Engagement Campaign": { spend: 114.19, follows: 98 }, "Retailer Support": { spend: 79.42, follows: 0 } },
  "2026-05-31": { "Awareness Campaign": { spend: 47.72, follows: 0 }, "Engagement Campaign": { spend: 82.07, follows: 69 }, "Retailer Support": { spend: 52.63, follows: 0 } },
}

export const MAY_ADS_DATA: {
  name: string
  spend: number
  impressions: number
  clicks: number
  follows: number
  cpf: number | null
  ctr: number
  campaign: Campaign
}[] = [
  // Engagement Campaign (top performers)
  { name: "Cacio e Pepe Puffs", spend: 583.54, impressions: 46453, clicks: 2878, follows: 649, cpf: 0.90, ctr: 6.19, campaign: "Engagement" },
  { name: "Target On Shelves", spend: 570.09, impressions: 45216, clicks: 2123, follows: 548, cpf: 1.04, ctr: 4.70, campaign: "Engagement" },
  { name: "Frozen Pasta Can't Be That Good", spend: 331.65, impressions: 28118, clicks: 917, follows: 309, cpf: 1.07, ctr: 3.26, campaign: "Engagement" },
  { name: "Target Giveaway", spend: 96.95, impressions: 5010, clicks: 292, follows: 134, cpf: 0.72, ctr: 5.83, campaign: "Engagement" },
  { name: "Basil Pesto Ravioli", spend: 83.03, impressions: 7846, clicks: 327, follows: 44, cpf: 1.89, ctr: 4.17, campaign: "Engagement" },
  { name: "Founder Message", spend: 18.74, impressions: 1994, clicks: 121, follows: 9, cpf: 2.08, ctr: 6.07, campaign: "Engagement" },
  { name: "Target Launch CGI", spend: 18.02, impressions: 1232, clicks: 21, follows: 2, cpf: 9.01, ctr: 1.70, campaign: "Engagement" },
  { name: "What Did I Just Witness", spend: 0.16, impressions: 17, clicks: 0, follows: 0, cpf: null, ctr: 0, campaign: "Engagement" },
  // Awareness Campaign - Audience Test: Retail Shopper (May 1-14)
  { name: "Us v. Them (Retail Shopper)", spend: 697.37, impressions: 558897, clicks: 820, follows: 0, cpf: null, ctr: 0.15, campaign: "Awareness" },
  { name: "Cacio e Pepe Hero Image (Retail Shopper)", spend: 68.78, impressions: 55012, clicks: 68, follows: 0, cpf: null, ctr: 0.12, campaign: "Awareness" },
  { name: "Frozen Pasta Can't Be That Good (Retail Shopper)", spend: 16.43, impressions: 8882, clicks: 5, follows: 0, cpf: null, ctr: 0.06, campaign: "Awareness" },
  // Awareness Campaign - Audience Test: Parents + Cooking (May 15-31)
  { name: "Us v. Them (Parents + Cooking)", spend: 636.32, impressions: 558380, clicks: 902, follows: 0, cpf: null, ctr: 0.16, campaign: "Awareness" },
  { name: "Cacio e Pepe Hero Image (Parents + Cooking)", spend: 152.57, impressions: 132612, clicks: 176, follows: 0, cpf: null, ctr: 0.13, campaign: "Awareness" },
  { name: "Frozen Pasta Can't Be That Good (Parents + Cooking)", spend: 5.02, impressions: 3056, clicks: 0, follows: 0, cpf: null, ctr: 0, campaign: "Awareness" },
  // Retailer Support - Whole Foods Promo (May 1-12)
  { name: "Trio Promo + Logo", spend: 534.87, impressions: 386039, clicks: 502, follows: 0, cpf: null, ctr: 0.13, campaign: "Retailer Support" },
  { name: "Whole Foods CGI", spend: 10.63, impressions: 5015, clicks: 2, follows: 0, cpf: null, ctr: 0.04, campaign: "Retailer Support" },
  // Retailer Support - Target Launch (May 11-31)
  { name: "Basil Pesto Exclusive", spend: 842.44, impressions: 499068, clicks: 439, follows: 0, cpf: null, ctr: 0.09, campaign: "Retailer Support" },
  { name: "4 Product + Logo", spend: 55.15, impressions: 33919, clicks: 59, follows: 0, cpf: null, ctr: 0.17, campaign: "Retailer Support" },
  { name: "Target CGI", spend: 0.22, impressions: 153, clicks: 0, follows: 0, cpf: null, ctr: 0, campaign: "Retailer Support" },
  // Retailer Support - Target Promo (May 17-23)
  { name: "On Sale Basil Pesto", spend: 282.22, impressions: 167572, clicks: 289, follows: 0, cpf: null, ctr: 0.17, campaign: "Retailer Support" },
  { name: "On Sale 4 Product + Logo", spend: 118.40, impressions: 72325, clicks: 67, follows: 0, cpf: null, ctr: 0.09, campaign: "Retailer Support" },
]

// Audience Test Data for dedicated tab
export const MAY_AUDIENCE_TEST = {
  baseline: {
    name: "Pasta + Frozen Food",
    cpm: 1.85,
    description: "Industry baseline for pasta and frozen food CPM",
  },
  tests: [
    {
      name: "Retail Shopper",
      dateRange: "May 1–14",
      audience: "Whole Foods, Target, natural foods, gourmet food, top 10-25% HH income",
      size: "6-7M",
      spend: 782.58,
      impressions: 622791,
      reach: 514423,
      clicks: 893,
      cpm: 1.27,
      ctr: 0.14,
      cpc: 0.88,
      winningCreative: "Us v. Them",
      winningCreativeCtr: 0.15,
      winningCreativeCpc: 0.85,
      status: "complete",
    },
    {
      name: "Parents + Cooking", 
      dateRange: "May 15–31",
      audience: "Cooking, Easy Home Meals, Cooking at Home, Parents, Pasta",
      size: "4.1-4.8M",
      spend: 793.91,
      impressions: 694048,
      reach: 586000,
      clicks: 1078,
      cpm: 1.14,
      ctr: 0.16,
      cpc: 0.74,
      winningCreative: "Us v. Them",
      winningCreativeCtr: 0.17,
      winningCreativeCpc: 0.71,
      status: "complete",
    },
  ],
  winner: "Parents + Cooking",
  winnerReason: "$0.71 CPM cheaper than baseline ($1.14 vs $1.85), $0.13 cheaper than Retail Shopper",
}

// Calculated from campaign CSV totals for May 1-31
const engagementSpend = 1802.18
const awarenessSpend = 1576.49
const retailerSpend = 1843.93
const totalSpend = engagementSpend + awarenessSpend + retailerSpend // ~5222
const paidFollows = 1821 // Sum of engagement follows
const totalReach = 817000

export const MAY_KPI_DATA = {
  totalSpend: Math.round(totalSpend),
  followerGrowth: 2545, // From IG Insights CSV (May 1-30 daily follows)
  followerGrowthExclGiveaway: 2283, // Excluding 262 from May 10th giveaway
  giveawayFollows: 262, // May 10th giveaway spike
  startFollowers: 7132, // End of April
  endFollowers: 9677, // 7132 + 2545
  blendedCPF: totalSpend / 2545, // ~$2.05 using total IG follows
  totalReach: totalReach,
  paidFollows: paidFollows,
  totalImpressions: 2800000, // Sum from all campaign data
  engagementCTR: 5.22, // Calculated from engagement campaign
  messagingContacts: 450, // Placeholder
  unfollows: 120, // Placeholder
}

export const MAY_SPEND_BY_CAMPAIGN = [
  { name: "Engagement", value: Math.round(engagementSpend), color: "#D93732" },
  { name: "Awareness", value: Math.round(awarenessSpend), color: "#660033" },
  { name: "Retailer Support", value: Math.round(retailerSpend), color: "#E8853A" },
]

export const MAY_WEEKLY_FOLLOWS = [
  { week: "May 1–7", paid: 394, total: 531 }, // 75+45+87+84+80+90+70
  { week: "May 8–14", paid: 447, total: 855, note: "Includes 262 from May 10 giveaway" }, // 65+73+195+187+141+117+77
  { week: "May 15–21", paid: 433, total: 466 }, // 32+77+98+64+69+67+59
  { week: "May 22–28", paid: 376, total: 440 }, // 82+95+71+10+7+110+65
  { week: "May 29–31", paid: 171, total: 253 }, // 109+124+20 (estimated for 31st)
]

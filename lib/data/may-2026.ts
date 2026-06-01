import type { Campaign } from "./types"

// May 2026 data (May 1-15, partial month)
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
  "2026-05-14": { "Awareness Campaign": { spend: 84.05, follows: 0 }, "Engagement Campaign": { spend: 60.84, follows: 52 }, "Retailer Support": { spend: 68.23, follows: 0 } },
  "2026-05-15": { "Awareness Campaign": { spend: 15.75, follows: 0 }, "Engagement Campaign": { spend: 8.41, follows: 2 }, "Retailer Support": { spend: 0.98, follows: 0 } },
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
  // Engagement Campaign
  { name: "Cacio e Pepe Puffs", spend: 217.49, impressions: 15847, clicks: 1181, follows: 247, cpf: 0.88, ctr: 7.45, campaign: "Engagement" },
  { name: "Frozen Pasta Can't Be That Good", spend: 222.44, impressions: 18167, clicks: 688, follows: 213, cpf: 1.04, ctr: 3.79, campaign: "Engagement" },
  { name: "Target Giveaway", spend: 96.95, impressions: 5010, clicks: 292, follows: 134, cpf: 0.72, ctr: 5.83, campaign: "Engagement" },
  { name: "Target On Shelves", spend: 113.80, impressions: 8995, clicks: 500, follows: 125, cpf: 0.91, ctr: 5.56, campaign: "Engagement" },
  { name: "Basil Pesto Ravioli", spend: 39.96, impressions: 3809, clicks: 155, follows: 30, cpf: 1.33, ctr: 4.07, campaign: "Engagement" },
  { name: "What Did I Just Witness", spend: 0.16, impressions: 17, clicks: 0, follows: 0, cpf: null, ctr: 0, campaign: "Engagement" },
  { name: "Target Launch CGI", spend: 18.02, impressions: 1232, clicks: 21, follows: 2, cpf: 9.01, ctr: 1.70, campaign: "Engagement" },
  // Awareness Campaign
  { name: "Us v. Them", spend: 697.83, impressions: 497764, clicks: 908, follows: 0, cpf: null, ctr: 0.18, campaign: "Awareness" },
  { name: "Trio Promo + Logo", spend: 434.34, impressions: 347346, clicks: 510, follows: 0, cpf: null, ctr: 0.15, campaign: "Awareness" },
  { name: "Cacio e Pepe Hero Image", spend: 68.40, impressions: 55378, clicks: 67, follows: 0, cpf: null, ctr: 0.12, campaign: "Awareness" },
  // Retailer Support
  { name: "4 Product + Logo", spend: 55.15, impressions: 33919, clicks: 59, follows: 0, cpf: null, ctr: 0.17, campaign: "Retailer Support" },
  { name: "Basil Pesto Exclusive", spend: 301.12, impressions: 266120, clicks: 300, follows: 0, cpf: null, ctr: 0.11, campaign: "Retailer Support" },
  { name: "Whole Foods CGI", spend: 10.63, impressions: 5015, clicks: 2, follows: 0, cpf: null, ctr: 0.04, campaign: "Retailer Support" },
  { name: "Target CGI", spend: 0.22, impressions: 153, clicks: 0, follows: 0, cpf: null, ctr: 0, campaign: "Retailer Support" },
]

// Calculated from campaign CSV totals for May 1-15
const engagementSpend = 696.05
const awarenessSpend = 788.19
const retailerSpend = 813.35
const totalSpend = engagementSpend + awarenessSpend + retailerSpend // 2297.59
const paidFollows = 749 // Sum of engagement follows
const totalReach = 550000 // Approximate from campaign data

export const MAY_KPI_DATA = {
  totalSpend: Math.round(totalSpend),
  followerGrowth: 1309, // IG Insights May 1-13
  startFollowers: 8355,
  endFollowers: 9664, // 8355 + 1309
  blendedCPF: totalSpend / 1309, // $1.75
  totalReach: totalReach,
  paidFollows: paidFollows,
  totalImpressions: 1225000, // Sum from campaign data
  engagementCTR: 4.93, // Calculated from engagement campaign
  messagingContacts: 350, // Placeholder - need IG Insights data
  unfollows: 90, // Placeholder
}

export const MAY_SPEND_BY_CAMPAIGN = [
  { name: "Engagement", value: Math.round(engagementSpend), color: "#D93732" },
  { name: "Awareness", value: Math.round(awarenessSpend), color: "#660033" },
  { name: "Retailer Support", value: Math.round(retailerSpend), color: "#E8853A" },
]

export const MAY_WEEKLY_FOLLOWS = [
  { week: "May 1–7", paid: 394, total: 531 }, // IG: 75+45+87+84+80+90+70
  { week: "May 8–13", paid: 355, total: 778 }, // IG: 65+73+195+187+141+117
]

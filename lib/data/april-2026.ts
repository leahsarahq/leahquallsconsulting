import type { Campaign, KPIData } from "./types"

export const APRIL_DAILY_DATA: Record<string, Record<string, { spend: number; follows: number }>> = {
  "2026-04-09": { "Awareness Campaign": { spend: 5.84, follows: 0 }, "Engagement Campaign": { spend: 21.74, follows: 1 } },
  "2026-04-10": { "Awareness Campaign": { spend: 48.14, follows: 0 }, "Engagement Campaign": { spend: 75.89, follows: 19 } },
  "2026-04-11": { "Awareness Campaign": { spend: 50.3, follows: 1 }, "Engagement Campaign": { spend: 6.31, follows: 5 } },
  "2026-04-12": { "Awareness Campaign": { spend: 51.17, follows: 0 }, "Engagement Campaign": { spend: 57.13, follows: 44 } },
  "2026-04-13": { "Awareness Campaign": { spend: 41.35, follows: 0 }, "Engagement Campaign": { spend: 85.97, follows: 66 } },
  "2026-04-14": { "Awareness Campaign": { spend: 46.99, follows: 1 }, "Engagement Campaign": { spend: 36.79, follows: 41 } },
  "2026-04-15": { "Awareness Campaign": { spend: 49.6, follows: 0 }, "Engagement Campaign": { spend: 36.13, follows: 40 } },
  "2026-04-16": { "Awareness Campaign": { spend: 52.19, follows: 1 }, "Engagement Campaign": { spend: 39.56, follows: 59 } },
  "2026-04-17": { "Awareness Campaign": { spend: 52.11, follows: 0 }, "Engagement Campaign": { spend: 36.05, follows: 42 } },
  "2026-04-18": { "Awareness Campaign": { spend: 56.26, follows: 0 }, "Engagement Campaign": { spend: 58.08, follows: 16 } },
  "2026-04-19": { "Awareness Campaign": { spend: 55.24, follows: 0 }, "Engagement Campaign": { spend: 62.45, follows: 46 } },
  "2026-04-20": { "Awareness Campaign": { spend: 66.97, follows: 0 }, "Engagement Campaign": { spend: 55.64, follows: 69 } },
  "2026-04-21": { "Awareness Campaign": { spend: 46.84, follows: 0 }, "Engagement Campaign": { spend: 46.73, follows: 71 } },
  "2026-04-22": { "Awareness Campaign": { spend: 48.26, follows: 0 }, "Engagement Campaign": { spend: 43.85, follows: 49 } },
  "2026-04-23": { "Awareness Campaign": { spend: 53.11, follows: 0 }, "Engagement Campaign": { spend: 41.14, follows: 40 } },
  "2026-04-24": { "Awareness Campaign": { spend: 40.9, follows: 0 }, "Engagement Campaign": { spend: 46.32, follows: 48 }, "Retailer Support": { spend: 36.59, follows: 0 } },
  "2026-04-25": { "Awareness Campaign": { spend: 37.32, follows: 0 }, "Engagement Campaign": { spend: 53.39, follows: 69 }, "Retailer Support": { spend: 37.03, follows: 0 } },
  "2026-04-26": { "Awareness Campaign": { spend: 40.06, follows: 0 }, "Engagement Campaign": { spend: 55.44, follows: 80 }, "Retailer Support": { spend: 77.36, follows: 0 } },
  "2026-04-27": { "Awareness Campaign": { spend: 44.13, follows: 0 }, "Engagement Campaign": { spend: 56.34, follows: 94 }, "Retailer Support": { spend: 85.89, follows: 0 } },
  "2026-04-28": { "Awareness Campaign": { spend: 87.5, follows: 0 }, "Engagement Campaign": { spend: 40.28, follows: 64 }, "Retailer Support": { spend: 64.53, follows: 0 } },
  "2026-04-29": { "Awareness Campaign": { spend: 164.22, follows: 0 }, "Engagement Campaign": { spend: 53.96, follows: 108 }, "Retailer Support": { spend: 65.82, follows: 0 } },
  "2026-04-30": { "Awareness Campaign": { spend: 38.12, follows: 0 }, "Engagement Campaign": { spend: 39.76, follows: 63 }, "Retailer Support": { spend: 24.7, follows: 0 } },
}

export const APRIL_ADS_DATA = [
  // Engagement Campaign ads
  { name: "Cacio e Pepe Puffs", spend: 680.27, impressions: 44319, clicks: 2787, follows: 765, cpf: 0.89, ctr: 6.29, campaign: "Engagement" as Campaign },
  { name: "Frozen Pasta Can't Be That Good", spend: 193.46, impressions: 24158, clicks: 708, follows: 300, cpf: 0.64, ctr: 2.93, campaign: "Engagement" as Campaign },
  { name: "Cacio e Pepe Ice Cream", spend: 61.08, impressions: 2948, clicks: 129, follows: 32, cpf: 1.91, ctr: 4.38, campaign: "Engagement" as Campaign },
  { name: "What Did I Just Witness", spend: 78.47, impressions: 5405, clicks: 363, follows: 19, cpf: 4.13, ctr: 6.72, campaign: "Engagement" as Campaign },
  { name: "7 Minute Meal", spend: 23.57, impressions: 1045, clicks: 33, follows: 10, cpf: 2.36, ctr: 3.16, campaign: "Engagement" as Campaign },
  { name: "Chicken Nugget Style", spend: 27.60, impressions: 2486, clicks: 35, follows: 4, cpf: 6.90, ctr: 1.41, campaign: "Engagement" as Campaign },
  { name: "Ravioli Fortune", spend: 9.21, impressions: 585, clicks: 38, follows: 3, cpf: 3.07, ctr: 6.50, campaign: "Engagement" as Campaign },
  { name: "OnKatie'sPlate", spend: 4.90, impressions: 1141, clicks: 1, follows: 0, cpf: null, ctr: 0.09, campaign: "Engagement" as Campaign },
  { name: "Target Launch CGI", spend: 0.24, impressions: 33, clicks: 2, follows: 1, cpf: 0.24, ctr: 6.06, campaign: "Engagement" as Campaign },
  // Awareness Campaign ads
  { name: "Cacio e Pepe Hero Image", spend: 602.14, impressions: 378559, clicks: 643, follows: 0, cpf: null, ctr: 0.17, campaign: "Awareness" as Campaign },
  { name: "Allow Us to Reintroduce Ourselves", spend: 140.09, impressions: 67748, clicks: 75, follows: 1, cpf: 140.09, ctr: 0.11, campaign: "Awareness" as Campaign },
  { name: "Us v. Them", spend: 204.92, impressions: 87494, clicks: 79, follows: 1, cpf: 204.92, ctr: 0.09, campaign: "Awareness" as Campaign },
  { name: "Trio Flatlay", spend: 72.17, impressions: 28160, clicks: 20, follows: 1, cpf: 72.17, ctr: 0.07, campaign: "Awareness" as Campaign },
  { name: "Whole Foods CGI (Awareness)", spend: 117.86, impressions: 64757, clicks: 54, follows: 0, cpf: null, ctr: 0.08, campaign: "Awareness" as Campaign },
  // Retailer Support Campaign ads
  { name: "Trio Promo + Logo", spend: 273.75, impressions: 170962, clicks: 247, follows: 0, cpf: null, ctr: 0.14, campaign: "Retailer Support" as Campaign },
  { name: "Whole Foods CGI (Retailer)", spend: 117.86, impressions: 64757, clicks: 54, follows: 0, cpf: null, ctr: 0.08, campaign: "Retailer Support" as Campaign },
]

export const APRIL_KPI_DATA: KPIData = {
  totalSpend: 2617,
  followerGrowth: 2200,
  startFollowers: 5136,
  endFollowers: 8355,
  blendedCPF: 1.19,
  engagementCPF: 0.92, // Engagement spend $1,049 ÷ 1,137 follows
  totalReach: 817000,
  paidFollows: 1137,
  totalImpressions: 939000,
  engagementCTR: 5.78,
  messagingContacts: 310,
  unfollows: 80,
}

export const APRIL_SPEND_BY_CAMPAIGN = [
  { name: "Engagement", value: 1049, color: "#D93732" },
  { name: "Awareness", value: 1177, color: "#660033" },
  { name: "Retailer Support", value: 392, color: "#E8853A" },
]

export const APRIL_WEEKLY_FOLLOWS = [
  { week: "Apr 1–8", paid: 0, total: 45 },
  { week: "Apr 9–15", paid: 217, total: 350 },
  { week: "Apr 16–22", paid: 392, total: 680 },
  { week: "Apr 23–30", paid: 528, total: 1125 },
]

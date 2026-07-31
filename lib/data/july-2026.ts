import type { Campaign, KPIData, AudienceDemographics, TestingContext, IgDailyFollow } from "./types"

// July 2026 data — FULL MONTH (Jul 1–31).
// - Ad metrics (spend, reach, impressions, clicks, ad-attributed follows): Meta Ads
//   Manager exports, Jul 1–31 (Campaigns / Ad sets / Ads).
// - Demographics: IG Insights "Audience" export (snapshot as of Jul 31).
// - Total follower growth: IG Insights daily "Follows" export (organic + paid),
//   Jul 1–29. Days 30–31 weren't in the export, so those two days fall back to
//   ad-attributed follows — making followerGrowth a slight floor.
export const JULY_DAILY_DATA: Record<string, Record<string, { spend: number; follows: number }>> = {
  "2026-07-01": { "Awareness Campaign": { spend: 72.11, follows: 0 }, "Engagement Campaign": { spend: 85.4, follows: 56 }, "Retailer Support": { spend: 117.39, follows: 0 } },
  "2026-07-02": { "Awareness Campaign": { spend: 38.62, follows: 0 }, "Engagement Campaign": { spend: 88.88, follows: 70 }, "Retailer Support": { spend: 122.72, follows: 0 } },
  "2026-07-03": { "Awareness Campaign": { spend: 41.47, follows: 0 }, "Engagement Campaign": { spend: 101.51, follows: 54 }, "Retailer Support": { spend: 102.41, follows: 0 } },
  "2026-07-04": { "Awareness Campaign": { spend: 40.57, follows: 0 }, "Engagement Campaign": { spend: 99.6, follows: 53 }, "Retailer Support": { spend: 102.74, follows: 0 } },
  "2026-07-05": { "Awareness Campaign": { spend: 73.33, follows: 0 }, "Engagement Campaign": { spend: 115.44, follows: 74 }, "Retailer Support": { spend: 131.3, follows: 0 } },
  "2026-07-06": { "Awareness Campaign": { spend: 45.04, follows: 0 }, "Engagement Campaign": { spend: 100, follows: 52 }, "Retailer Support": { spend: 100.45, follows: 0 } },
  "2026-07-07": { "Awareness Campaign": { spend: 46.05, follows: 0 }, "Engagement Campaign": { spend: 92.72, follows: 69 }, "Retailer Support": { spend: 92.55, follows: 0 } },
  "2026-07-08": { "Awareness Campaign": { spend: 49.33, follows: 0 }, "Engagement Campaign": { spend: 94.63, follows: 71 }, "Retailer Support": { spend: 91.51, follows: 0 } },
  "2026-07-09": { "Awareness Campaign": { spend: 42.42, follows: 0 }, "Engagement Campaign": { spend: 106.86, follows: 70 }, "Retailer Support": { spend: 90.45, follows: 0 } },
  "2026-07-10": { "Awareness Campaign": { spend: 44.76, follows: 0 }, "Engagement Campaign": { spend: 147.1, follows: 62 }, "Retailer Support": { spend: 92.11, follows: 0 } },
  "2026-07-11": { "Awareness Campaign": { spend: 49.05, follows: 0 }, "Engagement Campaign": { spend: 155.35, follows: 85 }, "Retailer Support": { spend: 101.59, follows: 0 } },
  "2026-07-12": { "Awareness Campaign": { spend: 51.27, follows: 0 }, "Engagement Campaign": { spend: 176.74, follows: 107 }, "Retailer Support": { spend: 119.03, follows: 0 } },
  "2026-07-13": { "Awareness Campaign": { spend: 53.01, follows: 0 }, "Engagement Campaign": { spend: 149.4, follows: 77 }, "Retailer Support": { spend: 102.08, follows: 0 } },
  "2026-07-14": { "Awareness Campaign": { spend: 81.36, follows: 0 }, "Engagement Campaign": { spend: 140.81, follows: 64 }, "Retailer Support": { spend: 155.44, follows: 0 } },
  "2026-07-15": { "Awareness Campaign": { spend: 43.64, follows: 0 }, "Engagement Campaign": { spend: 91.5, follows: 53 }, "Retailer Support": { spend: 92.28, follows: 0 } },
  "2026-07-16": { "Awareness Campaign": { spend: 37.37, follows: 0 }, "Engagement Campaign": { spend: 100.81, follows: 52 }, "Retailer Support": { spend: 104.5, follows: 0 } },
  "2026-07-17": { "Awareness Campaign": { spend: 44.81, follows: 0 }, "Engagement Campaign": { spend: 102.36, follows: 38 }, "Retailer Support": { spend: 87.53, follows: 0 } },
  "2026-07-18": { "Awareness Campaign": { spend: 38.52, follows: 0 }, "Engagement Campaign": { spend: 104.63, follows: 52 }, "Retailer Support": { spend: 39.1, follows: 0 } },
  "2026-07-19": { "Awareness Campaign": { spend: 56.43, follows: 0 }, "Engagement Campaign": { spend: 115.26, follows: 50 }, "Retailer Support": { spend: 100.48, follows: 0 } },
  "2026-07-20": { "Awareness Campaign": { spend: 74.46, follows: 0 }, "Engagement Campaign": { spend: 104.94, follows: 61 }, "Retailer Support": { spend: 95.75, follows: 0 } },
  "2026-07-21": { "Awareness Campaign": { spend: 71.24, follows: 0 }, "Engagement Campaign": { spend: 97.97, follows: 49 }, "Retailer Support": { spend: 99.18, follows: 0 } },
  "2026-07-22": { "Awareness Campaign": { spend: 57.58, follows: 0 }, "Engagement Campaign": { spend: 96.87, follows: 55 }, "Retailer Support": { spend: 84.19, follows: 0 } },
  "2026-07-23": { "Awareness Campaign": { spend: 58.96, follows: 0 }, "Engagement Campaign": { spend: 75.98, follows: 49 }, "Retailer Support": { spend: 111, follows: 0 } },
  "2026-07-24": { "Awareness Campaign": { spend: 55.27, follows: 0 }, "Engagement Campaign": { spend: 67.02, follows: 37 }, "Retailer Support": { spend: 99.42, follows: 0 } },
  "2026-07-25": { "Awareness Campaign": { spend: 63.25, follows: 0 }, "Engagement Campaign": { spend: 72.54, follows: 52 }, "Retailer Support": { spend: 109.98, follows: 0 } },
  "2026-07-26": { "Awareness Campaign": { spend: 53.01, follows: 0 }, "Engagement Campaign": { spend: 81.92, follows: 42 }, "Retailer Support": { spend: 104.32, follows: 0 } },
  "2026-07-27": { "Awareness Campaign": { spend: 51.72, follows: 0 }, "Engagement Campaign": { spend: 79.15, follows: 43 }, "Retailer Support": { spend: 100.45, follows: 0 } },
  "2026-07-28": { "Awareness Campaign": { spend: 47.84, follows: 0 }, "Engagement Campaign": { spend: 67.74, follows: 41 }, "Retailer Support": { spend: 134.25, follows: 0 } },
  "2026-07-29": { "Awareness Campaign": { spend: 47.74, follows: 0 }, "Engagement Campaign": { spend: 75.29, follows: 49 }, "Retailer Support": { spend: 117.27, follows: 0 } },
  "2026-07-30": { "Awareness Campaign": { spend: 46.96, follows: 0 }, "Engagement Campaign": { spend: 69.99, follows: 31 }, "Retailer Support": { spend: 100.14, follows: 0 } },
  "2026-07-31": { "Awareness Campaign": { spend: 19.85, follows: 0 }, "Engagement Campaign": { spend: 32.42, follows: 20 }, "Retailer Support": { spend: 51.54, follows: 0 } },
}

export const JULY_ADS_DATA: {
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
  { name: "Frozen Pasta Can't Be That Good", spend: 1493.47, impressions: 108101, clicks: 4249, follows: 1194, cpf: 1.25, ctr: 3.93, campaign: "Engagement" },
  { name: "Joe Make it Fancy Kevin Lee", spend: 360.66, impressions: 34524, clicks: 2528, follows: 169, cpf: 2.13, ctr: 7.32, campaign: "Engagement" },
  { name: "Joe Crispy Chicken Skin Crumble", spend: 332.07, impressions: 19556, clicks: 1135, follows: 132, cpf: 2.52, ctr: 5.8, campaign: "Engagement" },
  { name: "Ravioli Croutons", spend: 264.22, impressions: 30563, clicks: 1704, follows: 45, cpf: 5.87, ctr: 5.58, campaign: "Engagement" },
  { name: "Sunday Sauce", spend: 233.77, impressions: 14742, clicks: 654, follows: 64, cpf: 3.65, ctr: 4.44, campaign: "Engagement" },
  { name: "Beef Short Rib", spend: 189.26, impressions: 11051, clicks: 486, follows: 43, cpf: 4.4, ctr: 4.4, campaign: "Engagement" },
  { name: "Imagine Hating On Me", spend: 126.81, impressions: 4820, clicks: 274, follows: 46, cpf: 2.76, ctr: 5.68, campaign: "Engagement" },
  { name: "Target On Shelves", spend: 81.67, impressions: 6995, clicks: 396, follows: 43, cpf: 1.9, ctr: 5.66, campaign: "Engagement" },
  { name: "Joe Basil Pesto at Target", spend: 14.4, impressions: 1669, clicks: 161, follows: 1, cpf: 14.4, ctr: 9.65, campaign: "Engagement" },
  { name: "Capture It", spend: 2.22, impressions: 100, clicks: 8, follows: 1, cpf: 2.22, ctr: 8, campaign: "Engagement" },
  { name: "Corn Season", spend: 2.26, impressions: 135, clicks: 4, follows: 0, cpf: null, ctr: 2.96, campaign: "Engagement" },
  // Awareness Campaign — reach creative (low CTR, high impressions)
  { name: "Us v. Them", spend: 1427.26, impressions: 740434, clicks: 828, follows: 0, cpf: null, ctr: 0.11, campaign: "Awareness" },
  { name: "Cacio e Pepe Hero Image", spend: 159.65, impressions: 97596, clicks: 100, follows: 0, cpf: null, ctr: 0.1, campaign: "Awareness" },
  // Retailer Support — product / logo creative
  { name: "Basil Pesto Exclusive (Target)", spend: 1696.4, impressions: 887212, clicks: 1038, follows: 0, cpf: null, ctr: 0.12, campaign: "Retailer Support" },
  { name: "Trio Logo (Whole Foods)", spend: 1456.83, impressions: 757114, clicks: 764, follows: 0, cpf: null, ctr: 0.1, campaign: "Retailer Support" },
]

// Campaign spend totals (Jul 1–31, from Ads Manager)
const engagementSpend = 3091 // $3,090.83
const awarenessSpend = 1597 // $1,597.04
const retailerSpend = 3153 // $3,153.15
const totalSpend = engagementSpend + awarenessSpend + retailerSpend // 7841
const attributedFollows = 1738 // ad-attributed follows (all from the Engagement campaign)
const engagementFollows = 1738

// Daily follower growth from IG Insights (organic + paid combined). Real values
// are available for Jul 1–29; days 30–31 were not in the provided export.
export const JULY_IG_DAILY_FOLLOWS: IgDailyFollow[] = [
  { date: "2026-07-01", follows: 49 },
  { date: "2026-07-02", follows: 73 },
  { date: "2026-07-03", follows: 50 },
  { date: "2026-07-04", follows: 54 },
  { date: "2026-07-05", follows: 82 },
  { date: "2026-07-06", follows: 43 },
  { date: "2026-07-07", follows: 67 },
  { date: "2026-07-08", follows: 68 },
  { date: "2026-07-09", follows: 78 },
  { date: "2026-07-10", follows: 70 },
  { date: "2026-07-11", follows: 100 },
  { date: "2026-07-12", follows: 97 },
  { date: "2026-07-13", follows: 79 },
  { date: "2026-07-14", follows: 63 },
  { date: "2026-07-15", follows: 56 },
  { date: "2026-07-16", follows: 65 },
  { date: "2026-07-17", follows: 54 },
  { date: "2026-07-18", follows: 67 },
  { date: "2026-07-19", follows: 58 },
  { date: "2026-07-20", follows: 70 },
  { date: "2026-07-21", follows: 67 },
  { date: "2026-07-22", follows: 59 },
  { date: "2026-07-23", follows: 58 },
  { date: "2026-07-24", follows: 375 },
  { date: "2026-07-25", follows: 158 },
  { date: "2026-07-26", follows: 119 },
  { date: "2026-07-27", follows: 125 },
  { date: "2026-07-28", follows: 159 },
  { date: "2026-07-29", follows: 74 },
]

// Total IG follower growth (organic + paid). Real IG total for Jul 1–29 (2,537)
// plus ad-attributed follows for Jul 30–31 (51). This is a slight floor because
// organic lift is only counted through Jul 29.
const igThrough29 = JULY_IG_DAILY_FOLLOWS.reduce((s, d) => s + d.follows, 0) // 2537
const attributed30to31 = 51 // Engagement follows on Jul 30 (31) + Jul 31 (20)
const followerGrowthFloor = igThrough29 + attributed30to31 // 2588

// Full-month KPIs. followerGrowth = total IG growth (organic + paid); paidFollows =
// ad-attributed follows.
export const JULY_KPI_DATA: KPIData = {
  totalSpend,
  followerGrowth: followerGrowthFloor, // IG total (Jul 1–29) + ad follows (Jul 30–31); floor
  paidFollows: attributedFollows, // ad-attributed, full month
  startFollowers: 11531, // end of June (9,677 + 1,854)
  endFollowers: 11531 + followerGrowthFloor,
  blendedCPF: totalSpend / followerGrowthFloor, // ~$3.03 (all spend ÷ total follows)
  engagementCPF: engagementSpend / engagementFollows, // ~$1.78 ($3,091 ÷ 1,738 follows)
  totalReach: 2600114, // sum of campaign reach (upper bound; not deduped)
  totalImpressions: 2714573,
  engagementCTR: 5.11, // Engagement campaign link CTR (11,601 clicks ÷ 227,056 impressions)
  messagingContacts: 0, // not imported for July
  unfollows: 0,
}

// Audience demographics from IG Insights "Audience" export (snapshot as of Jul 31).
// Values are % of audience.
export const JULY_DEMOGRAPHICS: AudienceDemographics = {
  asOf: "as of Jul 31, 2026",
  topCountries: [
    { name: "United States", pct: 88.3 },
    { name: "Turkey", pct: 3.5 },
    { name: "Canada", pct: 1 },
    { name: "India", pct: 0.7 },
    { name: "Brazil", pct: 0.6 },
    { name: "United Kingdom", pct: 0.3 },
    { name: "Mexico", pct: 0.3 },
    { name: "Argentina", pct: 0.3 },
    { name: "Australia", pct: 0.2 },
    { name: "Indonesia", pct: 0.2 },
  ],
  ageGender: [
    { range: "18–24", women: 2.4, men: 1.5 },
    { range: "25–34", women: 13.8, men: 8.2 },
    { range: "35–44", women: 20.2, men: 11.6 },
    { range: "45–54", women: 13.5, men: 5.7 },
    { range: "55–64", women: 11.5, men: 3.7 },
    { range: "65+", women: 6.4, men: 1.5 },
  ],
  topCities: [
    { name: "New York, NY", pct: 5.5 },
    { name: "Istanbul, Turkey", pct: 3.3 },
    { name: "Los Angeles, CA", pct: 1.7 },
    { name: "Chicago, IL", pct: 1.6 },
    { name: "Philadelphia, PA", pct: 1.1 },
    { name: "Houston, TX", pct: 0.6 },
    { name: "San Diego, CA", pct: 0.6 },
    { name: "Phoenix, AZ", pct: 0.6 },
    { name: "San Francisco, CA", pct: 0.5 },
    { name: "Austin, TX", pct: 0.4 },
  ],
}

export const JULY_SPEND_BY_CAMPAIGN = [
  { name: "Engagement", value: engagementSpend, color: "#D93732" },
  { name: "Awareness", value: awarenessSpend, color: "#660033" },
  { name: "Retailer Support", value: retailerSpend, color: "#E8853A" },
]

// Bucketed by calendar week (Mon–Sun). July 1, 2026 is a Wednesday, so the first
// week is a partial Wed–Sun. paid = ad-attributed follows; total = IG Insights daily
// follows (organic + paid). The Jul 20–26 total spikes well above paid — a late-month
// organic surge (peaking Jul 24 at +375/day). The final week (Jul 27–31) counts IG
// through Jul 29 plus ad-attributed follows for Jul 30–31 (not yet in the IG export).
export const JULY_WEEKLY_FOLLOWS = [
  { week: "Jul 1–5", paid: 307, total: 308 },
  { week: "Jul 6–12", paid: 516, total: 523 },
  { week: "Jul 13–19", paid: 386, total: 442 },
  { week: "Jul 20–26", paid: 345, total: 906 },
  { week: "Jul 27–31", paid: 184, total: 409 },
]

// Testing context for July — surfaced on the Testing tab.
export const JULY_TESTING: TestingContext = {
  featured: {
    name: "OnKatiesPlate Creative Test",
    dateRange: "Jul 9–23",
    hypothesis:
      "Run a new creator's content (@OnKatiesPlate) to a creator-lookalike audience to see if fresh creator creative drives follows more efficiently than our always-on engagement ad set (Existing Posts).",
    kpiFocus: "Cost per follow (CPF) & IG follow rate",
    challenger: {
      name: "OnKatiesPlate Creative Test",
      note: "New creator → creator lookalike",
      spend: 689.51,
      impressions: 56491,
      clicks: 2848,
      follows: 152,
      profileVisits: 2852,
      cpf: 4.54,
      ctr: 5.04,
      followRate: 5.33, // 152 follows ÷ 2,852 profile visits
      cpc: 0.24,
    },
    control: {
      name: "Existing Posts",
      note: "Current engagement ad set",
      spend: 1694.19,
      impressions: 114816,
      clicks: 4929,
      follows: 1284,
      profileVisits: 3758,
      cpf: 1.32,
      ctr: 4.29,
      followRate: 34.17, // 1,284 follows ÷ 3,758 profile visits
      cpc: 0.34,
    },
    verdict:
      "Same pattern as June's creator test. OnKatiesPlate pulled a higher click rate (5.04% vs. 4.29% CTR) but far fewer of those visitors followed — a 5.3% follow rate vs. 34.2% — so its cost per follow landed well above the control ($4.54 vs. $1.32). Great at driving traffic, not yet at converting it to follows. Keep Existing Posts as the follow engine and give creator creative a clearer reason to follow before scaling it.",
  },
  notes: [
    {
      title: "Joe Audience Test",
      dateRange: "Jul 1–15",
      spend: 707,
      status: "June carryover",
      detail:
        "Creator → creator-lookalike test carried over from June. Efficiency improved (CPF $2.34, 8.0% follow rate) but still ran above Existing Posts, so it was wound down mid-month.",
    },
    {
      title: "Imagine Hating On Me",
      dateRange: "Jul 12–31",
      spend: 127,
      status: "New creative",
      detail:
        "New hook creative inside the engagement ad set. Solid 5.7% CTR and a workable $2.76 CPF on a small budget — a cheap, promising read worth more test spend.",
    },
    {
      title: "Audience Test (Young Millennials)",
      dateRange: "Jul 20–31",
      spend: 587,
      status: "New audience",
      detail:
        "New awareness audience test (18–34). Pure reach play — 277K impressions at a 0.07% CTR and no follows. Read it on reach efficiency, not follows.",
    },
    {
      title: "Audience Test (Parents + Cooking)",
      dateRange: "Jul 1–21",
      spend: 1010,
      status: "Paused Jul 21",
      detail:
        "Awareness audience test paused mid-month at standard awareness CTR (~0.13%). Budget reallocated to the Young Millennials test.",
    },
  ],
}

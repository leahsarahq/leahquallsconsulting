import type { Campaign, KPIData, IgDailyFollow, AudienceDemographics, TestingContext } from "./types"

// June 2026 data — FULL MONTH (Jun 1–30).
// - Ad metrics (spend, reach, impressions, clicks, ad-attributed follows): Meta Ads
//   Manager exports, Jun 1–30 (Campaigns / Ad sets / Ads).
// - Demographics: IG Insights "Audience" export (snapshot as of Jun 30).
// - Total follower growth: IG Insights daily follows are real through Jun 22; for
//   Jun 23–30 only ad-attributed follows are available, so the total is a
//   conservative floor (organic counted through Jun 22 only). Send the IG Insights
//   daily "Follows" export for Jun 23–30 to layer the remaining organic lift back in.
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
  "2026-06-23": { "Awareness Campaign": { spend: 44.07, follows: 0 }, "Engagement Campaign": { spend: 107.48, follows: 82 }, "Retailer Support": { spend: 231.04, follows: 0 } },
  "2026-06-24": { "Awareness Campaign": { spend: 46.58, follows: 0 }, "Engagement Campaign": { spend: 106.59, follows: 70 }, "Retailer Support": { spend: 201.58, follows: 0 } },
  "2026-06-25": { "Awareness Campaign": { spend: 43.45, follows: 0 }, "Engagement Campaign": { spend: 91.51, follows: 59 }, "Retailer Support": { spend: 156.89, follows: 0 } },
  "2026-06-26": { "Awareness Campaign": { spend: 51.37, follows: 0 }, "Engagement Campaign": { spend: 94.09, follows: 36 }, "Retailer Support": { spend: 120.46, follows: 0 } },
  "2026-06-27": { "Awareness Campaign": { spend: 44.47, follows: 0 }, "Engagement Campaign": { spend: 90.58, follows: 52 }, "Retailer Support": { spend: 47.43, follows: 0 } },
  "2026-06-28": { "Awareness Campaign": { spend: 49.73, follows: 0 }, "Engagement Campaign": { spend: 110.34, follows: 47 }, "Retailer Support": { spend: 90.26, follows: 0 } },
  "2026-06-29": { "Awareness Campaign": { spend: 49.05, follows: 0 }, "Engagement Campaign": { spend: 107.7, follows: 56 }, "Retailer Support": { spend: 75.12, follows: 0 } },
  "2026-06-30": { "Awareness Campaign": { spend: 57.25, follows: 0 }, "Engagement Campaign": { spend: 104.39, follows: 40 }, "Retailer Support": { spend: 89.34, follows: 0 } },
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
  { name: "Frozen Pasta Can't Be That Good", spend: 885.83, impressions: 60703, clicks: 2311, follows: 699, cpf: 1.27, ctr: 3.81, campaign: "Engagement" },
  { name: "Cacio e Pepe Puffs", spend: 710.65, impressions: 43849, clicks: 3064, follows: 628, cpf: 1.13, ctr: 6.99, campaign: "Engagement" },
  { name: "Joe Basil Pesto at Target", spend: 361.14, impressions: 33199, clicks: 3332, follows: 103, cpf: 3.51, ctr: 10.04, campaign: "Engagement" },
  { name: "Target On Shelves", spend: 161.92, impressions: 10873, clicks: 549, follows: 98, cpf: 1.65, ctr: 5.05, campaign: "Engagement" },
  { name: "Basil Pesto x Caraway", spend: 111.24, impressions: 4115, clicks: 207, follows: 51, cpf: 2.18, ctr: 5.03, campaign: "Engagement" },
  { name: "Joe Crispy Chicken Skin Crumble", spend: 42.36, impressions: 2220, clicks: 115, follows: 37, cpf: 1.14, ctr: 5.18, campaign: "Engagement" },
  { name: "Monthly Rip", spend: 32.36, impressions: 1587, clicks: 34, follows: 3, cpf: 10.79, ctr: 2.14, campaign: "Engagement" },
  { name: "Founder Content", spend: 22.34, impressions: 1663, clicks: 82, follows: 5, cpf: 4.47, ctr: 4.93, campaign: "Engagement" },
  { name: "Founder Message", spend: 22, impressions: 1889, clicks: 118, follows: 9, cpf: 2.44, ctr: 6.25, campaign: "Engagement" },
  { name: "4 Easy Pasta Dinners", spend: 5.74, impressions: 294, clicks: 13, follows: 2, cpf: 2.87, ctr: 4.42, campaign: "Engagement" },
  { name: "Joe Basil Pesto at Whole Foods", spend: 3.67, impressions: 229, clicks: 3, follows: 1, cpf: 3.67, ctr: 1.31, campaign: "Engagement" },
  // Awareness Campaign — reach creative (low CTR, high impressions)
  { name: "Us v. Them", spend: 2109.06, impressions: 1014051, clicks: 1055, follows: 0, cpf: null, ctr: 0.1, campaign: "Awareness" },
  { name: "Sauce Splash", spend: 354.07, impressions: 158697, clicks: 176, follows: 0, cpf: null, ctr: 0.11, campaign: "Awareness" },
  { name: "Pasta Tower", spend: 97.05, impressions: 42157, clicks: 31, follows: 0, cpf: null, ctr: 0.07, campaign: "Awareness" },
  { name: "Dark Lifestyle", spend: 12.18, impressions: 5485, clicks: 3, follows: 0, cpf: null, ctr: 0.05, campaign: "Awareness" },
  { name: "Cacio e Pepe Hero Image", spend: 3.73, impressions: 1950, clicks: 0, follows: 0, cpf: null, ctr: 0, campaign: "Awareness" },
  // Retailer Support — product / logo creative
  { name: "Basil Pesto Exclusive (Target)", spend: 1256.36, impressions: 621019, clicks: 665, follows: 0, cpf: null, ctr: 0.11, campaign: "Retailer Support" },
  { name: "Trio Logo (Whole Foods)", spend: 1178.5, impressions: 633851, clicks: 673, follows: 0, cpf: null, ctr: 0.11, campaign: "Retailer Support" },
  { name: "Us v. Them (Target)", spend: 319.85, impressions: 194481, clicks: 325, follows: 1, cpf: 319.85, ctr: 0.17, campaign: "Retailer Support" },
  { name: "On Sale Basil Pesto", spend: 269.94, impressions: 95926, clicks: 102, follows: 0, cpf: null, ctr: 0.11, campaign: "Retailer Support" },
  { name: "Us v. Them (Whole Foods)", spend: 266.66, impressions: 208303, clicks: 305, follows: 0, cpf: null, ctr: 0.15, campaign: "Retailer Support" },
  { name: "Basil Pesto Exclusive", spend: 37.25, impressions: 21966, clicks: 26, follows: 0, cpf: null, ctr: 0.12, campaign: "Retailer Support" },
]

// Campaign spend totals (Jun 1–30, from Ads Manager)
const engagementSpend = 2359 // $2,359.25
const awarenessSpend = 2576 // $2,576.09
const retailerSpend = 3328 // $3,328.56
const totalSpend = engagementSpend + awarenessSpend + retailerSpend // 8263
const attributedFollows = 1637 // ad-attributed follows (1636 engagement + 1 retailer)
const engagementFollows = 1636 // ad-attributed follows from the Engagement campaign

// Daily follower growth from IG Insights (organic + paid combined). Real values
// are available only through Jun 22; days 23–30 are not in the provided export.
export const JUNE_IG_DAILY_FOLLOWS: IgDailyFollow[] = [
  { date: "2026-06-01", follows: 42 },
  { date: "2026-06-02", follows: 32 },
  { date: "2026-06-03", follows: 48 },
  { date: "2026-06-04", follows: 63 },
  { date: "2026-06-05", follows: 67 },
  { date: "2026-06-06", follows: 70 },
  { date: "2026-06-07", follows: 85 },
  { date: "2026-06-08", follows: 75 },
  { date: "2026-06-09", follows: 47 },
  { date: "2026-06-10", follows: 53 },
  { date: "2026-06-11", follows: 74 },
  { date: "2026-06-12", follows: 64 },
  { date: "2026-06-13", follows: 56 },
  { date: "2026-06-14", follows: 81 },
  { date: "2026-06-15", follows: 60 },
  { date: "2026-06-16", follows: 42 },
  { date: "2026-06-17", follows: 100 },
  { date: "2026-06-18", follows: 68 },
  { date: "2026-06-19", follows: 51 },
  { date: "2026-06-20", follows: 75 },
  { date: "2026-06-21", follows: 78 },
  { date: "2026-06-22", follows: 81 },
]

// Total IG follower growth (organic + paid). Real IG total for Jun 1–22 (1,412)
// plus ad-attributed follows for Jun 23–30 (442). This is a conservative floor
// because organic lift is only counted through Jun 22.
const igThrough22 = JUNE_IG_DAILY_FOLLOWS.reduce((s, d) => s + d.follows, 0) // 1412
const attributed23to30 = 442
const followerGrowthFloor = igThrough22 + attributed23to30 // 1854

export const JUNE_KPI_DATA: KPIData = {
  totalSpend: totalSpend,
  followerGrowth: followerGrowthFloor, // IG total (Jun 1–22) + ad follows (Jun 23–30); floor
  paidFollows: attributedFollows, // ad-attributed, full month
  startFollowers: 9677, // end of May
  endFollowers: 9677 + followerGrowthFloor,
  blendedCPF: totalSpend / followerGrowthFloor, // ~$4.46 (all spend ÷ total follows)
  engagementCPF: engagementSpend / engagementFollows, // ~$1.44 ($2,359 ÷ 1,636 follows)
  totalReach: 3013494,
  totalImpressions: 3158507,
  engagementCTR: 6.12,
  messagingContacts: 0, // not imported for June
  unfollows: 0, // not imported for June
}

// Audience demographics from IG Insights "Audience" export (snapshot as of Jun 30).
// Values are % of audience.
export const JUNE_DEMOGRAPHICS: AudienceDemographics = {
  asOf: "as of Jun 30, 2026",
  topCountries: [
    { name: "United States", pct: 86.7 },
    { name: "Turkey", pct: 4.2 },
    { name: "Canada", pct: 1.2 },
    { name: "India", pct: 0.8 },
    { name: "Brazil", pct: 0.7 },
    { name: "United Kingdom", pct: 0.3 },
    { name: "Mexico", pct: 0.3 },
    { name: "Argentina", pct: 0.3 },
    { name: "Australia", pct: 0.3 },
    { name: "Indonesia", pct: 0.2 },
  ],
  ageGender: [
    { range: "18–24", women: 2.3, men: 1.7 },
    { range: "25–34", women: 14.3, men: 8.8 },
    { range: "35–44", women: 20.8, men: 12 },
    { range: "45–54", women: 13.2, men: 5.1 },
    { range: "55–64", women: 11.1, men: 3.4 },
    { range: "65+", women: 6, men: 1.3 },
  ],
  topCities: [
    { name: "New York, NY", pct: 6 },
    { name: "Istanbul, Turkey", pct: 4 },
    { name: "Los Angeles, CA", pct: 1.8 },
    { name: "Chicago, IL", pct: 1.7 },
    { name: "Philadelphia, PA", pct: 1 },
    { name: "San Diego, CA", pct: 0.6 },
    { name: "Houston, TX", pct: 0.6 },
    { name: "Phoenix, AZ", pct: 0.6 },
    { name: "San Francisco, CA", pct: 0.5 },
    { name: "Austin, TX", pct: 0.5 },
  ],
}

export const JUNE_SPEND_BY_CAMPAIGN = [
  { name: "Engagement", value: engagementSpend, color: "#D93732" },
  { name: "Awareness", value: awarenessSpend, color: "#660033" },
  { name: "Retailer Support", value: retailerSpend, color: "#E8853A" },
]

// paid = ad-attributed follows (full month); total = IG Insights total.
// Jun 22–30 total uses IG data through Jun 22 + ad follows after, so it is a floor.
export const JUNE_WEEKLY_FOLLOWS = [
  { week: "Jun 1–7", paid: 351, total: 407 },
  { week: "Jun 8–14", paid: 364, total: 450 },
  { week: "Jun 15–21", paid: 419, total: 474 },
  { week: "Jun 22–30", paid: 503, total: 523, note: "Total counts organic through Jun 22 only; Jun 23–30 is ad-attributed" },
]

// Testing context for June — surfaced on the Testing tab.
export const JUNE_TESTING: TestingContext = {
  featured: {
    name: "Joe Audience Test",
    dateRange: "Jun 22–30",
    hypothesis:
      "Run new creator-led creative to a lookalike audience built from the creator, and see if it drives follows more efficiently than our current engagement ad set (Existing Posts).",
    kpiFocus: "Cost per follow (CPF) & IG follow rate",
    challenger: {
      name: "Joe Audience Test",
      note: "New creator → creator lookalike",
      spend: 407.17,
      impressions: 35648,
      clicks: 3450,
      follows: 141,
      profileVisits: 3438,
      cpf: 2.89,
      ctr: 9.68,
      followRate: 4.1, // IG follow rate: 141 follows ÷ 3,438 profile visits
      cpc: 0.12,
    },
    control: {
      name: "Existing Posts",
      note: "Current engagement ad set",
      spend: 1952.08,
      impressions: 124973,
      clicks: 6378,
      follows: 1495,
      profileVisits: 5741,
      cpf: 1.31,
      ctr: 5.1,
      followRate: 26.04, // IG follow rate: 1,495 follows ÷ 5,741 profile visits
      cpc: 0.31,
    },
    verdict:
      "Key learning: click-through rate and follow rate are two different things. The creator lookalike won decisively on clicks — 9.68% CTR vs. 5.10% and a $0.12 CPC vs. $0.31 — pulling a heavy volume of profile visits. But once people landed on the profile, far fewer actually followed: a 4.1% IG follow rate vs. 26.0% for Existing Posts, which pushed CPF higher ($2.89 vs. $1.31). So the creative is great at driving traffic but not yet at converting that traffic into follows. The takeaway is continued testing to find creator creative that encourages people to follow after the click — a stronger follow CTA and clearer reason-to-follow — while keeping Existing Posts as the primary follow driver.",
  },
  notes: [
    {
      title: "May Target Launch (carryover)",
      dateRange: "Jun 1–2",
      spend: 37,
      status: "Finished from May",
      detail:
        "The Basil Pesto Exclusive launch ad set finished spending out from the end of May over the first 2 days of June. Not a June initiative — treat its $37 as May carryover.",
    },
    {
      title: "Target Promo (in-store sale)",
      dateRange: "Jun 23–27",
      spend: 270,
      status: "Short burst",
      detail:
        "\"On Sale Basil Pesto\" supported a short in-store Target sale — only ~5 days of delivery. The goal was to put the promo in front of as many people as possible and drive clicks during the sale window, so read it on impressions and clicks: ~95.9K impressions and 102 link clicks in 5 days. It was never meant to drive follows, so CPF doesn't apply.",
    },
    {
      title: "[Parents + Cooking] Creative Test",
      dateRange: "Jun 1–23",
      spend: 1069,
      status: "Ended Jun 23",
      detail:
        "Awareness creative test inside the Parents + Cooking audience. Ran the first three weeks then paused; standard awareness CTR (~0.10%).",
    },
    {
      title: "Dark Lifestyle (creative test)",
      dateRange: "Jun 2–14",
      spend: 12,
      status: "Cut early",
      detail:
        "Lifestyle creative test on the awareness objective. Minimal spend and a weak 0.05% CTR, so it was cut quickly — a fast, cheap read on a creative direction that didn't land.",
    },
  ],
}

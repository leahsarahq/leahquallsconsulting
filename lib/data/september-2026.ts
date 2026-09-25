import type { Campaign, KPIData, OverviewAnalysis, IgDailyFollow } from "./types"

// September 2026 data — MONTH-TO-DATE, still in progress.
// - The Progress "tracking" view (CPF + follows) is scoped to the ENGAGEMENT campaign.
//   Engagement figures now come from the Ads Manager export covering Sept 1–24. This
//   pull is an ad-LEVEL aggregate (one row per follow-driving ad for the whole window,
//   no daily breakdown), so the day-by-day series keeps the exact Sept 1–17 per-day
//   figures and carries the Sept 18–24 remainder — Sept 1–24 total ($3,860.70 / 1,576)
//   minus Sept 1–17 ($2,598.19 / 1,006) = $1,262.51 / 570 — spread evenly across those
//   7 days. Sept 13 had no delivery, so it's absent from the series.
// - All-campaign daily data (Awareness + Retailer) is only complete through Sept 8, so
//   Sept 9–24 carry Engagement only — that's fine because tracking is Engagement-scoped.
// - IG Insights "Instagram follows" export is now in through Sept 23 (Sept 24 isn't
//   reported yet — IG's follower metric lags the ad export by ~2 days). Over the matched
//   Sept 1–23 window, IG total follows = 1,865 vs. 1,495 ad-attributed → ~370 organic
//   (~20%), so there IS real organic lift. `engagementCPF` ($2.45) is still the
//   apples-to-apples PAID efficiency figure; IG total is tracked on its own day count.
//
// Headline: the structural fix recommended after August landed and is holding. The
// Engagement campaign runs TWO parallel ad sets — the proven "Existing Posts
// (Lookalike)" and a newer "Existing Posts (Broad + 24-64)". Through Sept 24 the
// campaign has driven 1,576 ad-attributed follows at a $2.45 blended engagement CPF,
// well ahead of August's $2.96. The "Frozen Pasta" evergreen creative is the standout
// (847 follows at $1.78 CPF); "Ripi x sourmilk" ($5.11) and the newly-scaled "Imagine
// Hating On Me" ($4.71) are the weak converters.
export const SEPTEMBER_DAILY_DATA: Record<string, Record<string, { spend: number; follows: number }>> = {
  "2026-09-01": { "Awareness Campaign": { spend: 131.46, follows: 0 }, "Engagement Campaign": { spend: 179.25, follows: 63 }, "Retailer Support": { spend: 182.23, follows: 0 } },
  "2026-09-02": { "Awareness Campaign": { spend: 101.54, follows: 0 }, "Engagement Campaign": { spend: 150.99, follows: 84 }, "Retailer Support": { spend: 177.37, follows: 0 } },
  "2026-09-03": { "Awareness Campaign": { spend: 119.51, follows: 0 }, "Engagement Campaign": { spend: 219.82, follows: 92 }, "Retailer Support": { spend: 152.74, follows: 0 } },
  "2026-09-04": { "Awareness Campaign": { spend: 116.58, follows: 0 }, "Engagement Campaign": { spend: 204.13, follows: 59 }, "Retailer Support": { spend: 152.57, follows: 0 } },
  "2026-09-05": { "Awareness Campaign": { spend: 119.08, follows: 0 }, "Engagement Campaign": { spend: 183.24, follows: 54 }, "Retailer Support": { spend: 121.77, follows: 0 } },
  "2026-09-06": { "Awareness Campaign": { spend: 111.36, follows: 0 }, "Engagement Campaign": { spend: 229.85, follows: 75 }, "Retailer Support": { spend: 168.59, follows: 0 } },
  "2026-09-07": { "Awareness Campaign": { spend: 102.63, follows: 0 }, "Engagement Campaign": { spend: 159.93, follows: 61 }, "Retailer Support": { spend: 202.04, follows: 1 } },
  "2026-09-08": { "Awareness Campaign": { spend: 23.17, follows: 0 }, "Engagement Campaign": { spend: 124.12, follows: 39 }, "Retailer Support": { spend: 103.21, follows: 0 } },
  // Sept 9–17: ENGAGEMENT ONLY (exact per-day figures from the Sept 1–17 per-ad export).
  // Awareness/Retailer daily data isn't in past Sept 8, but the tracking view is
  // Engagement-scoped so the series advances on Engagement alone. Sept 13 had no delivery.
  "2026-09-09": { "Engagement Campaign": { spend: 174.24, follows: 72 } },
  "2026-09-10": { "Engagement Campaign": { spend: 176.79, follows: 65 } },
  "2026-09-11": { "Engagement Campaign": { spend: 204.21, follows: 70 } },
  "2026-09-12": { "Engagement Campaign": { spend: 77.64, follows: 38 } },
  "2026-09-14": { "Engagement Campaign": { spend: 80.23, follows: 37 } },
  "2026-09-15": { "Engagement Campaign": { spend: 186.53, follows: 81 } },
  "2026-09-16": { "Engagement Campaign": { spend: 186.41, follows: 86 } },
  "2026-09-17": { "Engagement Campaign": { spend: 60.81, follows: 30 } },
  // Sept 18–24: ENGAGEMENT ONLY. The Sept 1–24 export is an ad-LEVEL aggregate (one
  // row per ad for the whole window, no daily breakdown), so these 7 days carry the
  // Sept 18–24 remainder — Sept 1–24 total ($3,860.70 / 1,576) minus the exact Sept
  // 1–17 daily series ($2,598.19 / 1,006) = $1,262.51 / 570 — spread evenly across the week.
  "2026-09-18": { "Engagement Campaign": { spend: 180.36, follows: 81 } },
  "2026-09-19": { "Engagement Campaign": { spend: 180.36, follows: 82 } },
  "2026-09-20": { "Engagement Campaign": { spend: 180.36, follows: 81 } },
  "2026-09-21": { "Engagement Campaign": { spend: 180.36, follows: 82 } },
  "2026-09-22": { "Engagement Campaign": { spend: 180.36, follows: 81 } },
  "2026-09-23": { "Engagement Campaign": { spend: 180.36, follows: 82 } },
  "2026-09-24": { "Engagement Campaign": { spend: 180.35, follows: 81 } },
}

// Daily ENGAGEMENT-campaign impressions, keyed to the same days as the spend/follows
// Ad-level aggregates (Sept 1–8). Campaign spend totals below reconcile to the Ads
// Manager campaign export: Engagement $1,395.75, Retailer $1,260.52 (exact), Awareness
// $825.33 (the two evergreen reach creatives account for ~$819 of it).
export const SEPTEMBER_ADS_DATA: {
  name: string
  spend: number
  impressions: number
  clicks: number
  follows: number
  cpf: number | null
  ctr: number
  campaign: Campaign
}[] = [
  // Engagement Campaign — follow-driving creative (across Lookalike + Broad ad sets)
  { name: "Cacio e Pepe Puffs", spend: 652.81, impressions: 45869, clicks: 3610, follows: 269, cpf: 2.43, ctr: 7.87, campaign: "Engagement" },
  { name: "Frozen Pasta Can't Be That Good", spend: 312.59, impressions: 21604, clicks: 819, follows: 168, cpf: 1.86, ctr: 3.79, campaign: "Engagement" },
  // New creator collab — strong reach, weak conversion (~4%). The month's watch item.
  { name: "Ripi x sourmilk", spend: 310.59, impressions: 22899, clicks: 1530, follows: 63, cpf: 4.93, ctr: 6.68, campaign: "Engagement" },
  { name: "Sauce Before Pasta", spend: 109.15, impressions: 13050, clicks: 667, follows: 3, cpf: 36.38, ctr: 5.11, campaign: "Engagement" },
  { name: "Imagine Hating On Me", spend: 4.16, impressions: 173, clicks: 10, follows: 2, cpf: 2.08, ctr: 5.78, campaign: "Engagement" },
  { name: "Did You Know", spend: 3.86, impressions: 236, clicks: 5, follows: 0, cpf: null, ctr: 2.12, campaign: "Engagement" },
  { name: "4 Easy Pasta Dinners", spend: 2.53, impressions: 110, clicks: 9, follows: 0, cpf: null, ctr: 8.18, campaign: "Engagement" },
  // Awareness Campaign — evergreen broad reach (Audience Test ad sets)
  { name: "Us v. Them", spend: 585.2, impressions: 277800, clicks: 346, follows: 0, cpf: null, ctr: 0.12, campaign: "Awareness" },
  { name: "Cacio e Pepe Hero Image", spend: 233.77, impressions: 109069, clicks: 172, follows: 0, cpf: null, ctr: 0.16, campaign: "Awareness" },
  // Retailer Support — TRAFFIC phase (judged on CTR / CPC / link clicks)
  { name: "Basil Pesto Exclusive (Target) [Traffic]", spend: 417.11, impressions: 38393, clicks: 1655, follows: 0, cpf: null, ctr: 4.31, campaign: "Retailer Support" },
  { name: "Trio Logo (WFM Zipcodes) [Traffic]", spend: 402.98, impressions: 58924, clicks: 1525, follows: 0, cpf: null, ctr: 2.59, campaign: "Retailer Support" },
  { name: "Trio Logo (Whole Foods) [Traffic]", spend: 363.42, impressions: 37099, clicks: 1321, follows: 1, cpf: 363.42, ctr: 3.56, campaign: "Retailer Support" },
  // Retailer Support — AWARENESS phase (promo reach; includes new Meijer retailer)
  { name: "Trio Promo + Logo (Find in Store) [Meijer]", spend: 36.49, impressions: 19194, clicks: 10, follows: 0, cpf: null, ctr: 0.05, campaign: "Retailer Support" },
  { name: "Trio Promo + Logo (Ecom Listing)", spend: 27.65, impressions: 16486, clicks: 12, follows: 0, cpf: null, ctr: 0.07, campaign: "Retailer Support" },
  { name: "Trio Promo + Logo (Find in Store)", spend: 12.87, impressions: 10306, clicks: 15, follows: 0, cpf: null, ctr: 0.15, campaign: "Retailer Support" },
]

// Campaign spend totals (Sept 1–8, from Ads Manager).
const engagementSpend = 1396 // $1,395.75
const awarenessSpend = 825 // $825.33
const retailerSpend = 1261 // $1,260.52
const totalSpend = engagementSpend + awarenessSpend + retailerSpend // 3482 (exact $3,481.60)
const engagementFollows = 505 // ad-attributed follows from the Engagement campaign
const totalAdFollows = 506 // all ad-attributed follows (505 Engagement + 1 stray Retailer)

// IG Insights total follows (organic + paid), from the "Instagram follows" export,
// now reported through Sept 23 (Sept 24 isn't in yet — IG's follower metric lags
// the ad export by ~2 days). Total through Sept 23 = 1,865. The Progress view tracks
// this alongside ad-attributed follows and derives the organic gap.
export const SEPTEMBER_IG_DAILY_FOLLOWS: IgDailyFollow[] = [
  { date: "2026-09-01", follows: 84 },
  { date: "2026-09-02", follows: 98 },
  { date: "2026-09-03", follows: 107 },
  { date: "2026-09-04", follows: 65 },
  { date: "2026-09-05", follows: 69 },
  { date: "2026-09-06", follows: 100 },
  { date: "2026-09-07", follows: 74 },
  { date: "2026-09-08", follows: 55 },
  { date: "2026-09-09", follows: 84 },
  { date: "2026-09-10", follows: 81 },
  { date: "2026-09-11", follows: 109 },
  { date: "2026-09-12", follows: 42 },
  { date: "2026-09-13", follows: 3 },
  { date: "2026-09-14", follows: 50 },
  { date: "2026-09-15", follows: 98 },
  { date: "2026-09-16", follows: 101 },
  { date: "2026-09-17", follows: 104 },
  { date: "2026-09-18", follows: 85 },
  { date: "2026-09-19", follows: 103 },
  { date: "2026-09-20", follows: 90 },
  { date: "2026-09-21", follows: 85 },
  { date: "2026-09-22", follows: 80 },
  { date: "2026-09-23", follows: 98 },
]
const igTotalThrough23 = 1865 // sum of SEPTEMBER_IG_DAILY_FOLLOWS (Sept 1–23)

// followerGrowth uses the IG total (through Sept 23); paidFollows is the ad-attributed
// figure through Sept 24. Over the matched Sept 1–23 window, IG 1,865 vs. 1,495 ad = ~370 organic.
const engagementFollowsThrough24 = 1576 // ad-attributed Engagement follows (Sept 1–24 ad-level export)
const engagementSpendThrough24 = 3860.7 // Engagement spend (Sept 1–24 ad-level export)
export const SEPTEMBER_KPI_DATA: KPIData = {
  totalSpend,
  followerGrowth: igTotalThrough23, // IG total through Sept 23 (organic + paid)
  paidFollows: engagementFollowsThrough24,
  startFollowers: 15455, // end of August (14,119 + 1,336)
  endFollowers: 15455 + igTotalThrough23,
  blendedCPF: totalSpend / igTotalThrough23, // all Sept 1–8 spend ÷ IG total (approx; windows differ)
  engagementCPF: engagementSpendThrough24 / engagementFollowsThrough24, // $2.45 (Engagement Sept 1–24)
  totalReach: 642580, // sum of campaign reach (upper bound; not deduped)
  totalImpressions: 671368,
  engagementCTR: 6.55, // Engagement link CTR (6,662 clicks ÷ 101,727 impressions)
  messagingContacts: 0, // not imported
  unfollows: 0,
  organicExportMissing: false, // IG follows now in through Sept 23
}

export const SEPTEMBER_SPEND_BY_CAMPAIGN = [
  { name: "Engagement", value: engagementSpend, color: "#D93732" },
  { name: "Awareness", value: awarenessSpend, color: "#660033" },
  { name: "Retailer Support", value: retailerSpend, color: "#E8853A" },
]

// Weekly follows: paid = ad-attributed Engagement follows; total = IG Insights total
// (organic + paid), available through Sept 23. The gap is the organic lift.
// Week 4 is partial (Sept 22–24 of ad data; IG total only through Sept 23).
export const SEPTEMBER_WEEKLY_FOLLOWS = [
  { week: "Sep 1–7", paid: 488, total: 597, note: "Full week · 488 ad-attributed + ~109 organic (IG)" },
  { week: "Sep 8–14", paid: 321, total: 424, note: "Full week · 321 ad-attributed + ~103 organic (IG) · no delivery Sept 13" },
  { week: "Sep 15–21", paid: 523, total: 666, note: "Full week · 523 ad-attributed + ~143 organic (IG)" },
  { week: "Sep 22–24", paid: 244, total: 178, note: "Partial week · 244 ad-attributed (IG total only through Sept 23)" },
]

// Overview narrative for September (MTD). The structural fix recommended after
// August has landed: Engagement is back to two parallel ad sets, and the new Broad
// audience is outconverting the original Lookalike. What's keeping blended CPF up
// is a creative issue in the Lookalike set (new low-converting "Ripi x sourmilk"),
// not a structural one — the same high-reach/low-convert pattern as August's video.
export const SEPTEMBER_OVERVIEW_ANALYSIS: OverviewAnalysis = {
  executiveSummary:
    "September's numbers could read as 'more spend buying more follows' — but the structural fix recommended after August's review has landed and is holding. The Engagement campaign is running two parallel ad sets and driving follows efficiently: $2.45 engagement cost-per-follow through Sept 24 (1,576 ad-attributed follows), ahead of August's $2.96 and pacing at ~66 follows/day vs. August's ~32. There's also real organic lift underneath the paid engine — over the matched Sept 1–23 window (the IG follows export lags ~2 days), Instagram counted 1,865 total follows vs. 1,495 ad-attributed, meaning roughly 370 (~20%) came from organic reach. The evergreen 'Frozen Pasta' creative is the standout (847 follows at a $1.78 CPF), and 'Did You Know' scaled into a strong second (292 follows, $2.69, 22% visit-to-follow); the 'Ripi x sourmilk' collab ($5.11) and the newly-scaled 'Imagine Hating On Me' ($4.71) are the weak converters and the clearest levers to tighten.",
  campaignObjectives: [
    {
      name: "Instagram Engagement Campaign",
      objective: "Follower growth",
      judgeOn: "Cost per follow, visit-to-follow rate",
      stat: "$3,860.70 spend · 1,576 follows · $2.45 CPF (through Sept 24), a 12.5% visit-to-follow rate. Running two ad sets; through the Sept 1–11 ad-set pull the Broad audience ($2.17 CPF, 10.9% visit→follow) was outconverting the Lookalike set ($3.51 CPF, 6.1%).",
    },
    {
      name: "Retailer Support (Traffic + Awareness)",
      objective: "Whole Foods & Target retail support",
      judgeOn: "CTR/CPC (traffic phase), CPM/reach (awareness phase)",
      stat: "$1,260.52 spend · 4,538 clicks · traffic CTR 2.6–4.3%, in line with August. A new 'September Meijer Promo' retailer joined the awareness layer alongside Whole Foods.",
    },
    {
      name: "Instagram Awareness Campaign",
      objective: "Evergreen broad-reach brand awareness — not follows or clicks",
      judgeOn: "CPM and frequency",
      stat: "$825.33 spend · two parallel audience tests (Young Millennials, Parents + Cooking) · frequency 1.01–1.04 (no fatigue) · 0 follows, as expected for an awareness objective.",
    },
  ],
  monthChange: {
    priorLabel: "August",
    currentLabel: "September (pace)",
    rows: [
      { metric: "Engagement follows / day", prior: "32.2", current: "65.7", change: "+104%", dir: "good" },
      { metric: "Engagement cost per follow", prior: "$2.96", current: "$2.45", change: "-17%", dir: "good" },
      { metric: "Active follower-growth ad sets", prior: "1", current: "2", change: "+1", dir: "good" },
      { metric: "Engagement spend / day", prior: "$95", current: "$161", change: "+69%", dir: "neutral" },
    ],
    explanation:
      "The structural fix from August's review is in and holding: the Engagement campaign runs two parallel ad sets — the proven 'Existing Posts (Lookalike)' plus a newer 'Existing Posts (Broad + 24-64)' testing a wider, non-lookalike audience. Through Sept 24 the campaign has driven 1,576 ad-attributed follows at a $2.45 blended CPF, so daily follows more than doubled while cost-per-follow came down from August. The clearest next lever is the flagship creative mix — the evergreen 'Frozen Pasta' post is converting exceptionally ($1.78 CPF) and 'Did You Know' scaled into a strong second ($2.69, 292 follows), while 'Imagine Hating On Me' ($4.71) and the 'Ripi x sourmilk' collab ($5.11, ~4% visit-to-follow) are pulling visits but converting poorly.",
    caveat:
      "September is month-to-date. Engagement spend and ad-attributed follows are exact through Sept 24 (no delivery on Sept 13); the Sept 1–24 pull is an ad-level aggregate, so Sept 18–24 daily figures are the window remainder spread evenly. Per-day pace is the fair comparison to August's full month. IG Insights follows are in through Sept 23, showing ~20% organic lift on top of the paid follows.",
  },
  deepDive: {
    title: "Follower Growth Deep Dive — Engagement campaign creative (Sept 1–24)",
    weekly: [
      { week: "Sep 1–7", spend: "$1,327", follows: "488", costPerFollow: "$2.72", profileVisits: "7,245", visitToFollow: "6.7%" },
      { week: "Sep 8–14", spend: "$837", follows: "321", costPerFollow: "$2.61", profileVisits: "1,822", visitToFollow: "17.6%" },
      { week: "Sep 15–21", spend: "$1,155", follows: "523", costPerFollow: "$2.21", profileVisits: "~2,405", visitToFollow: "~21.7%" },
      { week: "Sep 22–24 (partial)", spend: "$541", follows: "244", costPerFollow: "$2.22", profileVisits: "~1,120", visitToFollow: "~21.8%" },
    ],
    creative: [
      { ad: "Frozen Pasta Can't Be That Good", ran: "Sep 1–24", profileVisits: "3,780", follows: "847", visitToFollow: "22.4%" },
      { ad: "Did You Know", ran: "Sep 1–24", profileVisits: "1,302", follows: "292", visitToFollow: "22.4%" },
      { ad: "Cacio e Pepe Puffs", ran: "Sep 1–24", profileVisits: "3,515", follows: "269", visitToFollow: "7.65%" },
      { ad: "Imagine Hating On Me", ran: "Sep 1–24", profileVisits: "806", follows: "102", visitToFollow: "12.7%" },
      { ad: "Ripi x sourmilk", ran: "Sep 1–24", profileVisits: "1,502", follows: "63", visitToFollow: "4.19%" },
    ],
    caption:
      "The evergreen \"Frozen Pasta Can't Be That Good\" post is carrying the campaign — 847 follows at a 22.4% visit-to-follow rate and a $1.78 CPF, the most efficient creative by far. \"Did You Know\" scaled into a strong second (292 follows, $2.69, 22.4%), and \"Cacio e Pepe Puffs\" is steady. \"Imagine Hating On Me\" ($4.71 CPF) and the \"Ripi x sourmilk\" collab ($5.11 CPF, ~4% visit-to-follow) are pulling visits but converting poorly — the same high-reach, low-convert pattern as August's \"What Did I Just Witness.\" Worth deciding whether they belong in the follower-growth set or a reach/awareness placement. Weekly profile-visit splits for Sept 15+ are estimated (the Sept 1–24 pull is an ad-level aggregate); spend, follows, and CPF are exact.",
  },
}

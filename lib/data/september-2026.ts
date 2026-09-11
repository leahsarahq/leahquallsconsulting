import type { Campaign, KPIData, OverviewAnalysis, IgDailyFollow } from "./types"

// September 2026 data — MONTH-TO-DATE, still in progress.
// - Day-by-day campaign data (spend + ad-attributed follows) is complete through
//   Sept 8; Sept 8 is a PARTIAL reporting day (below the daily run rate).
// - A fresher Ad sets export (Sept 1–11) refreshes the Engagement Broad-vs-Lookalike
//   read — those ad-set figures are labeled "through Sept 11" where they appear.
// - IG Insights "Instagram follows" export is now in through Sept 8 (Sept 9–11 aren't
//   reported yet — IG's follower metric lags the ad export by ~2–3 days). Over the
//   matched Sept 1–8 window, IG total follows = 652 vs. 506 ad-attributed → ~146 organic
//   (~22%), so there IS real organic lift. `engagementCPF` (~$2.7) is still the
//   apples-to-apples PAID efficiency figure; IG total is tracked on its own day count.
//
// Headline: the structural fix recommended after August landed. The Engagement
// campaign is back to TWO parallel ad sets — the proven "Existing Posts (Lookalike)"
// and a new "Existing Posts (Broad + 24-64)" testing a wider audience. Through Sept 11
// the gap has widened in Broad's favor ($2.17 CPF, 10.9% visit→follow) over Lookalike
// ($3.51, 6.1%). What's holding blended cost-per-follow above July's level now looks
// like a creative issue in the Lookalike set specifically (new low-converting
// "Ripi x sourmilk" collab), not a structural or budget one.
export const SEPTEMBER_DAILY_DATA: Record<string, Record<string, { spend: number; follows: number }>> = {
  "2026-09-01": { "Awareness Campaign": { spend: 131.46, follows: 0 }, "Engagement Campaign": { spend: 185.67, follows: 63 }, "Retailer Support": { spend: 182.23, follows: 0 } },
  "2026-09-02": { "Awareness Campaign": { spend: 101.54, follows: 0 }, "Engagement Campaign": { spend: 150.99, follows: 84 }, "Retailer Support": { spend: 177.37, follows: 0 } },
  "2026-09-03": { "Awareness Campaign": { spend: 119.51, follows: 0 }, "Engagement Campaign": { spend: 219.82, follows: 92 }, "Retailer Support": { spend: 152.74, follows: 0 } },
  "2026-09-04": { "Awareness Campaign": { spend: 116.58, follows: 0 }, "Engagement Campaign": { spend: 204.13, follows: 59 }, "Retailer Support": { spend: 152.57, follows: 0 } },
  "2026-09-05": { "Awareness Campaign": { spend: 119.08, follows: 0 }, "Engagement Campaign": { spend: 183.24, follows: 54 }, "Retailer Support": { spend: 121.77, follows: 0 } },
  "2026-09-06": { "Awareness Campaign": { spend: 111.36, follows: 0 }, "Engagement Campaign": { spend: 229.85, follows: 75 }, "Retailer Support": { spend: 168.59, follows: 0 } },
  "2026-09-07": { "Awareness Campaign": { spend: 102.63, follows: 0 }, "Engagement Campaign": { spend: 159.93, follows: 61 }, "Retailer Support": { spend: 202.04, follows: 1 } },
  "2026-09-08": { "Awareness Campaign": { spend: 23.17, follows: 0 }, "Engagement Campaign": { spend: 62.12, follows: 17 }, "Retailer Support": { spend: 103.21, follows: 0 } },
}

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
// now reported through Sept 8 (Sept 9–11 aren't in yet — IG's follower metric lags
// the ad export by ~2–3 days). Total through Sept 8 = 652. The Progress view tracks
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
]
const igTotalThrough8 = 652 // sum of SEPTEMBER_IG_DAILY_FOLLOWS (Sept 1–8)

// followerGrowth uses the IG total (through Sept 8); paidFollows is the ad-attributed
// figure through Sept 8. Over the matched Sept 1–8 window, IG 652 vs. 506 ad = ~146 organic.
export const SEPTEMBER_KPI_DATA: KPIData = {
  totalSpend,
  followerGrowth: igTotalThrough8, // IG total through Sept 8 (organic + paid)
  paidFollows: totalAdFollows,
  startFollowers: 15455, // end of August (14,119 + 1,336)
  endFollowers: 15455 + igTotalThrough8,
  blendedCPF: totalSpend / igTotalThrough8, // now window-matched (all spend ÷ IG total, both through Sept 8)
  engagementCPF: 1395.75 / engagementFollows, // ~$2.76 ($1,395.75 ÷ 505 follows, Sept 1–8 daily)
  totalReach: 642580, // sum of campaign reach (upper bound; not deduped)
  totalImpressions: 671368,
  engagementCTR: 6.55, // Engagement link CTR (6,662 clicks ÷ 101,727 impressions)
  messagingContacts: 0, // not imported
  unfollows: 0,
  organicExportMissing: false, // IG follows now in through Sept 6
}

export const SEPTEMBER_SPEND_BY_CAMPAIGN = [
  { name: "Engagement", value: engagementSpend, color: "#D93732" },
  { name: "Awareness", value: awarenessSpend, color: "#660033" },
  { name: "Retailer Support", value: retailerSpend, color: "#E8853A" },
]

// Weekly follows: paid = ad-attributed Engagement follows; total = IG Insights total
// (organic + paid), now available through Sept 8. The gap is the organic lift.
// Sept 8 is a partial reporting day.
export const SEPTEMBER_WEEKLY_FOLLOWS = [
  { week: "Sep 1–7", paid: 488, total: 597, note: "Full week · 488 ad-attributed + ~109 organic (IG) · Broad audience outconverting Lookalike" },
  { week: "Sep 8", paid: 17, total: 55, note: "Partial reporting day — not a full day of data" },
]

// Overview narrative for September (MTD). The structural fix recommended after
// August has landed: Engagement is back to two parallel ad sets, and the new Broad
// audience is outconverting the original Lookalike. What's keeping blended CPF up
// is a creative issue in the Lookalike set (new low-converting "Ripi x sourmilk"),
// not a structural one — the same high-reach/low-convert pattern as August's video.
export const SEPTEMBER_OVERVIEW_ANALYSIS: OverviewAnalysis = {
  executiveSummary:
    "September's numbers could read as 'more spend buying more follows' — but the structural fix recommended after August's review has actually landed. The Engagement campaign is back to two parallel ad sets, and the new broader-audience set is converting better than the original: $2.73 engagement cost-per-follow through Sept 11, ahead of August's $2.96 and pacing at ~64 follows/day vs. August's ~32. There's also real organic lift underneath the paid engine — over the matched Sept 1–8 window (the IG follows export lags ~2–3 days), Instagram counted 652 total follows vs. 506 ad-attributed, meaning roughly 146 (~22%) came from organic reach. What's holding overall cost-per-follow above July's level now looks like a creative issue in the flagship Lookalike ad set specifically (a new, low-converting collab post), not a structural or budget one.",
  campaignObjectives: [
    {
      name: "Instagram Engagement Campaign",
      objective: "Follower growth",
      judgeOn: "Cost per follow, visit-to-follow rate",
      stat: "$1,927.96 spend · 707 follows · $2.73 CPF (through Sept 11). Restructured to two ad sets — the new Broad audience ($2.17 CPF, 10.9% visit→follow) is outconverting the Lookalike set ($3.51 CPF, 6.1%).",
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
      { metric: "Engagement follows / day", prior: "32.2", current: "64.3", change: "+100%", dir: "good" },
      { metric: "Engagement cost per follow", prior: "$2.96", current: "$2.73", change: "-8%", dir: "good" },
      { metric: "Active follower-growth ad sets", prior: "1", current: "2", change: "+1", dir: "good" },
      { metric: "Total spend / day", prior: "$254", current: "$435", change: "+71%", dir: "neutral" },
    ],
    explanation:
      "The structural fix from August's review is in: the Engagement campaign now runs two parallel ad sets — the proven 'Existing Posts (Lookalike)' plus a new 'Existing Posts (Broad + 24-64)' testing a wider, non-lookalike audience. Through Sept 11 the new audience is pulling further ahead (Broad $2.17 CPF and 10.9% visit-to-follow vs. Lookalike's $3.51 and 6.1%), so daily follows roughly doubled while cost-per-follow came down from August. The clear next lever is the Lookalike set's creative mix — if the Broad gap holds, shifting more budget toward it is worth testing.",
    caveat:
      "September is month-to-date. Day-by-day spend and ad-attributed follows are complete through Sept 8 (the 8th is a partial reporting day), while the Engagement ad-set breakdown reflects a fresher Sept 1–11 pull — per-day pace is the fair comparison to August's full month. IG Insights follows are now in through Sept 8, showing ~22% organic lift on top of the paid follows.",
  },
  deepDive: {
    title: "Follower Growth Deep Dive — Engagement campaign, Broad vs. Lookalike",
    weekly: [
      { week: "Sep 1–7", spend: "$1,334", follows: "488", costPerFollow: "$2.73", profileVisits: "7,244", visitToFollow: "6.7%" },
      { week: "Sep 8 (partial)", spend: "$62", follows: "17", costPerFollow: "$3.65", profileVisits: "217", visitToFollow: "7.8%" },
    ],
    creative: [
      { ad: "Existing Posts — Broad + 24-64 (ad set)", ran: "Sep 1–11", profileVisits: "3,789", follows: "413", visitToFollow: "10.90%" },
      { ad: "Existing Posts — Lookalike 1% (ad set)", ran: "Sep 1–11", profileVisits: "4,794", follows: "294", visitToFollow: "6.13%" },
      { ad: "Frozen Pasta Can't Be That Good", ran: "Sep 1–8", profileVisits: "800", follows: "168", visitToFollow: "21.0%" },
      { ad: "Cacio e Pepe Puffs", ran: "Sep 1–8", profileVisits: "3,515", follows: "269", visitToFollow: "7.65%" },
      { ad: "Ripi x sourmilk", ran: "Sep 1–8 (new)", profileVisits: "1,444", follows: "63", visitToFollow: "4.36%" },
    ],
    caption:
      "The new Broad audience is outconverting the Lookalike set (10.9% vs. 6.1% visit-to-follow through Sept 11) — a plausible result of it running the proven Frozen Pasta / Cacio e Pepe Puffs combo. Inside the Lookalike set, the new \"Ripi x sourmilk\" collab is pulling strong visit volume but converting at only ~4% — the same high-reach, low-convert pattern as August's \"What Did I Just Witness.\" Worth deciding whether it belongs in the follower-growth set or a reach/awareness placement.",
  },
}

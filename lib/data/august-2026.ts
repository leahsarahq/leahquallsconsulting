import type { Campaign, KPIData, TestingContext } from "./types"

// August 2026 data — FULL MONTH (Aug 1–31).
// - All metrics (spend, reach, impressions, clicks, ad-attributed follows, profile
//   visits) come from Meta Ads Manager exports, Aug 1–31 (Campaigns / Ad sets / Ads).
// - NOTE: No IG Insights "Follows" (organic + paid) export was provided this month,
//   so `followerGrowth` falls back to ad-attributed Engagement follows — i.e. it is
//   a FLOOR that omits organic lift. Prior months (Apr–Jul) layered an IG total on
//   top, so the month-over-month followerGrowth comparison understates August. The
//   apples-to-apples numbers this month are `paidFollows` and `engagementCPF`.
//
// Campaign structure note: "Retailer Support" combines two phases that share one
// objective (supporting Whole Foods + Target placement). Aug 1–13 ran an
// AWARENESS-optimized version (cheap broad reach, CPM ~$2); Aug 13–31 switched to a
// TRAFFIC-optimized version (CTR ~3–4%, CPC ~$0.24). Both retailers stayed covered.
export const AUGUST_DAILY_DATA: Record<string, Record<string, { spend: number; follows: number }>> = {
  "2026-08-01": { "Awareness Campaign": { spend: 52.81, follows: 0 }, "Engagement Campaign": { spend: 89.65, follows: 19 }, "Retailer Support": { spend: 51.44, follows: 0 } },
  "2026-08-02": { "Awareness Campaign": { spend: 56.13, follows: 0 }, "Engagement Campaign": { spend: 86.33, follows: 23 }, "Retailer Support": { spend: 135.14, follows: 0 } },
  "2026-08-03": { "Awareness Campaign": { spend: 71.68, follows: 0 }, "Engagement Campaign": { spend: 72.64, follows: 15 }, "Retailer Support": { spend: 162.99, follows: 0 } },
  "2026-08-04": { "Awareness Campaign": { spend: 54.41, follows: 0 }, "Engagement Campaign": { spend: 60.3, follows: 14 }, "Retailer Support": { spend: 86.67, follows: 0 } },
  "2026-08-05": { "Awareness Campaign": { spend: 38.02, follows: 0 }, "Engagement Campaign": { spend: 66.84, follows: 19 }, "Retailer Support": { spend: 39.58, follows: 0 } },
  "2026-08-06": { "Awareness Campaign": { spend: 42.96, follows: 0 }, "Engagement Campaign": { spend: 82.78, follows: 28 }, "Retailer Support": { spend: 97.06, follows: 0 } },
  "2026-08-07": { "Awareness Campaign": { spend: 56.36, follows: 0 }, "Engagement Campaign": { spend: 88.58, follows: 27 }, "Retailer Support": { spend: 136.44, follows: 0 } },
  "2026-08-08": { "Awareness Campaign": { spend: 30.39, follows: 0 }, "Engagement Campaign": { spend: 96.21, follows: 42 }, "Retailer Support": { spend: 164.71, follows: 0 } },
  "2026-08-09": { "Awareness Campaign": { spend: 55.96, follows: 0 }, "Engagement Campaign": { spend: 85.98, follows: 18 }, "Retailer Support": { spend: 133.64, follows: 0 } },
  "2026-08-10": { "Awareness Campaign": { spend: 47.22, follows: 0 }, "Engagement Campaign": { spend: 78.07, follows: 31 }, "Retailer Support": { spend: 136.94, follows: 0 } },
  "2026-08-11": { "Awareness Campaign": { spend: 49.47, follows: 0 }, "Engagement Campaign": { spend: 110.23, follows: 29 }, "Retailer Support": { spend: 142.57, follows: 0 } },
  "2026-08-12": { "Awareness Campaign": { spend: 46.72, follows: 0 }, "Engagement Campaign": { spend: 122.75, follows: 33 }, "Retailer Support": { spend: 136.82, follows: 0 } },
  "2026-08-13": { "Awareness Campaign": { spend: 48.37, follows: 0 }, "Engagement Campaign": { spend: 60.71, follows: 16 }, "Retailer Support": { spend: 147.28, follows: 0 } },
  "2026-08-14": { "Awareness Campaign": { spend: 47.1, follows: 0 }, "Engagement Campaign": { spend: 127.76, follows: 29 }, "Retailer Support": { spend: 97.25, follows: 0 } },
  "2026-08-15": { "Awareness Campaign": { spend: 54.97, follows: 0 }, "Engagement Campaign": { spend: 112.13, follows: 26 }, "Retailer Support": { spend: 80.5, follows: 0 } },
  "2026-08-16": { "Awareness Campaign": { spend: 56.18, follows: 0 }, "Engagement Campaign": { spend: 111.43, follows: 24 }, "Retailer Support": { spend: 106.94, follows: 0 } },
  "2026-08-17": { "Awareness Campaign": { spend: 41.55, follows: 0 }, "Engagement Campaign": { spend: 133.61, follows: 37 }, "Retailer Support": { spend: 97.56, follows: 0 } },
  "2026-08-18": { "Awareness Campaign": { spend: 49.14, follows: 0 }, "Engagement Campaign": { spend: 116.12, follows: 55 }, "Retailer Support": { spend: 98.2, follows: 0 } },
  "2026-08-19": { "Awareness Campaign": { spend: 48.68, follows: 0 }, "Engagement Campaign": { spend: 78.27, follows: 58 }, "Retailer Support": { spend: 99.81, follows: 0 } },
  "2026-08-20": { "Awareness Campaign": { spend: 49.83, follows: 0 }, "Engagement Campaign": { spend: 105.9, follows: 53 }, "Retailer Support": { spend: 97.46, follows: 0 } },
  "2026-08-21": { "Awareness Campaign": { spend: 53.17, follows: 0 }, "Engagement Campaign": { spend: 77.51, follows: 46 }, "Retailer Support": { spend: 89.22, follows: 0 } },
  "2026-08-22": { "Awareness Campaign": { spend: 51.35, follows: 0 }, "Engagement Campaign": { spend: 75.71, follows: 40 }, "Retailer Support": { spend: 110.58, follows: 0 } },
  "2026-08-23": { "Awareness Campaign": { spend: 57.04, follows: 0 }, "Engagement Campaign": { spend: 119.74, follows: 99 }, "Retailer Support": { spend: 98.24, follows: 0 } },
  "2026-08-24": { "Awareness Campaign": { spend: 46.94, follows: 0 }, "Engagement Campaign": { spend: 103.69, follows: 28 }, "Retailer Support": { spend: 97.27, follows: 0 } },
  "2026-08-25": { "Awareness Campaign": { spend: 49.76, follows: 0 }, "Engagement Campaign": { spend: 92.34, follows: 31 }, "Retailer Support": { spend: 97.24, follows: 0 } },
  "2026-08-26": { "Awareness Campaign": { spend: 45.47, follows: 0 }, "Engagement Campaign": { spend: 92.78, follows: 43 }, "Retailer Support": { spend: 94.82, follows: 0 } },
  "2026-08-27": { "Awareness Campaign": { spend: 82.76, follows: 0 }, "Engagement Campaign": { spend: 97.69, follows: 27 }, "Retailer Support": { spend: 95.84, follows: 0 } },
  "2026-08-28": { "Awareness Campaign": { spend: 31.84, follows: 0 }, "Engagement Campaign": { spend: 98.29, follows: 20 }, "Retailer Support": { spend: 97.89, follows: 0 } },
  "2026-08-29": { "Awareness Campaign": { spend: 36.14, follows: 0 }, "Engagement Campaign": { spend: 94.62, follows: 21 }, "Retailer Support": { spend: 117.93, follows: 0 } },
  "2026-08-30": { "Awareness Campaign": { spend: 58.59, follows: 0 }, "Engagement Campaign": { spend: 125.09, follows: 27 }, "Retailer Support": { spend: 106.69, follows: 0 } },
  "2026-08-31": { "Awareness Campaign": { spend: 53.16, follows: 0 }, "Engagement Campaign": { spend: 83.97, follows: 19 }, "Retailer Support": { spend: 112.82, follows: 0 } },
}

// Ad-level monthly aggregates (Aug 1–31). Campaign totals below reconcile exactly
// to the Ads Manager campaign export. Two creatives share a base name across
// campaigns; the Awareness reach cut is suffixed "(Awareness)" to disambiguate.
export const AUGUST_ADS_DATA: {
  name: string
  spend: number
  impressions: number
  clicks: number
  follows: number
  cpf: number | null
  ctr: number
  campaign: Campaign
}[] = [
  // Engagement Campaign — follow-driving creative (ad set: Existing Posts Lookalike)
  { name: "Cacio e Pepe Puffs", spend: 624.18, impressions: 44079, clicks: 4092, follows: 395, cpf: 1.58, ctr: 9.28, campaign: "Engagement" },
  { name: "Imagine Hating On Me", spend: 821.02, impressions: 22154, clicks: 1265, follows: 226, cpf: 3.63, ctr: 5.71, campaign: "Engagement" },
  { name: "Frozen Pasta Can't Be That Good", spend: 311.77, impressions: 20734, clicks: 690, follows: 178, cpf: 1.75, ctr: 3.33, campaign: "Engagement" },
  { name: "4 Easy Pasta Dinners", spend: 343.93, impressions: 9666, clicks: 496, follows: 87, cpf: 3.95, ctr: 5.13, campaign: "Engagement" },
  { name: "Multi Post", spend: 270.49, impressions: 19071, clicks: 1246, follows: 88, cpf: 3.07, ctr: 6.53, campaign: "Engagement" },
  { name: "Let Me Wipe My Camera", spend: 107.92, impressions: 2828, clicks: 250, follows: 16, cpf: 6.75, ctr: 8.84, campaign: "Engagement" },
  // Big spender, high CTR, almost no follows — the month's creative-rotation problem.
  { name: "What Did I Just Witness", spend: 467.46, impressions: 31987, clicks: 5292, follows: 7, cpf: 66.78, ctr: 16.54, campaign: "Engagement" },
  // Awareness Campaign — evergreen broad reach (ad set: Audience Test Young Millennials)
  { name: "Us v. Them", spend: 1165.85, impressions: 533994, clicks: 413, follows: 0, cpf: null, ctr: 0.08, campaign: "Awareness" },
  { name: "Cacio e Pepe Hero Image", spend: 254.88, impressions: 127029, clicks: 132, follows: 0, cpf: null, ctr: 0.1, campaign: "Awareness" },
  { name: "Frozen Pasta Can't Be That Good (Awareness)", spend: 143.44, impressions: 54275, clicks: 25, follows: 0, cpf: null, ctr: 0.05, campaign: "Awareness" },
  // Retailer Support — TRAFFIC phase (Aug 13–31): judged on CTR / CPC / link clicks
  { name: "Trio Logo (Whole Foods) [Traffic]", spend: 1066.69, impressions: 115282, clicks: 4839, follows: 0, cpf: null, ctr: 4.2, campaign: "Retailer Support" },
  { name: "Basil Pesto Exclusive (Target) [Traffic]", spend: 760.7, impressions: 98298, clicks: 2998, follows: 0, cpf: null, ctr: 3.05, campaign: "Retailer Support" },
  // Retailer Support — AWARENESS phase (Aug 1–13): judged on CPM / reach / frequency
  { name: "Basil Pesto Exclusive (Target)", spend: 760.49, impressions: 393622, clicks: 448, follows: 0, cpf: null, ctr: 0.11, campaign: "Retailer Support" },
  { name: "Trio Logo (Whole Foods)", spend: 738.85, impressions: 362463, clicks: 423, follows: 0, cpf: null, ctr: 0.12, campaign: "Retailer Support" },
]

// Campaign spend totals (Aug 1–31, from Ads Manager). Retailer = awareness phase
// ($1,499) + traffic phase ($1,868).
const engagementSpend = 2948 // $2,947.72
const awarenessSpend = 1564 // $1,564.17
const retailerSpend = 3368 // $3,367.54 ($1,499.34 awareness + $1,868.20 traffic)
const totalSpend = engagementSpend + awarenessSpend + retailerSpend // 7880
const engagementFollows = 997 // ad-attributed follows, all from the Engagement campaign

// followerGrowth = ad-attributed follows only (FLOOR). No IG Insights organic export
// was provided for August, so organic lift is not counted this month.
export const AUGUST_KPI_DATA: KPIData = {
  totalSpend,
  followerGrowth: engagementFollows, // FLOOR — ad-attributed only (no IG export)
  paidFollows: engagementFollows, // ad-attributed, full month
  startFollowers: 14119, // end of July (11,531 + 2,588)
  endFollowers: 14119 + engagementFollows, // floor; organic not counted this month
  blendedCPF: totalSpend / engagementFollows, // ~$7.90 (all spend ÷ ad follows) — inflated w/o organic
  engagementCPF: engagementSpend / engagementFollows, // ~$2.96 ($2,948 ÷ 997 follows)
  totalReach: 1782800, // sum of campaign reach (upper bound; not deduped)
  totalImpressions: 1848317,
  engagementCTR: 8.74, // Engagement link CTR (13,333 clicks ÷ 152,541 impressions) — inflated by "What Did I Just Witness"
  messagingContacts: 0, // not imported for August
  unfollows: 0,
}

export const AUGUST_SPEND_BY_CAMPAIGN = [
  { name: "Engagement", value: engagementSpend, color: "#D93732" },
  { name: "Awareness", value: awarenessSpend, color: "#660033" },
  { name: "Retailer Support", value: retailerSpend, color: "#E8853A" },
]

// Weekly ad-attributed Engagement follows (Mon–Sun buckets). No IG organic export
// this month, so total = paid. The story is in the visit-to-follow RATE, not the
// follow count: profile visits climbed hard in weeks 4–5 while follows fell as the
// non-converting "What Did I Just Witness" video absorbed volume (see Testing tab).
export const AUGUST_WEEKLY_FOLLOWS = [
  { week: "Aug 1–7", paid: 145, total: 145, note: "Visit→follow ~33% — proven converters (Imagine Hating On Me)" },
  { week: "Aug 8–14", paid: 198, total: 198, note: "Visit→follow ~12% — Multi Post absorbs visits" },
  { week: "Aug 15–21", paid: 299, total: 299, note: "Best week — visit→follow ~17%, CPF ~$2.46" },
  { week: "Aug 22–28", paid: 288, total: 288, note: "Visits surge (~5.7K), follow rate ~5% — new video launches" },
  { week: "Aug 29–31", paid: 67, total: 67, note: "Visit→follow ~2% — rotation problem at its peak" },
]

// Testing context for August — the headline story lives here. A 3-way read of the
// Engagement creative shows the classic "rising profile visits, falling follow rate"
// creative-rotation problem: the highest-CTR video converts the worst.
export const AUGUST_TESTING: TestingContext = {
  featured: {
    name: "Engagement Creative: What Did I Just Witness vs. Cacio e Pepe Puffs vs. Frozen Pasta",
    dateRange: "Aug 1–31",
    hypothesis:
      "Three creatives ran inside the always-on engagement ad set. The question for follower growth isn't who gets the most clicks — it's who turns profile visits into follows. We read each on IG follow rate (follows ÷ profile visits), not CTR.",
    kpiFocus: "IG follow rate (follows ÷ profile visits) & cost per follow",
    arms: [
      {
        name: "What Did I Just Witness",
        note: "New video · launched Aug 24",
        spend: 467.46,
        impressions: 31987,
        clicks: 5292,
        follows: 7,
        profileVisits: 5717,
        cpf: 66.78, // 467.46 ÷ 7 follows
        ctr: 16.54, // 5,292 clicks ÷ 31,987 impressions
        followRate: 0.12, // 7 follows ÷ 5,717 profile visits
        cpc: 0.09, // 467.46 ÷ 5,292 clicks
      },
      {
        name: "Cacio e Pepe Puffs",
        note: "Volume + conversion · Aug 20–31",
        spend: 624.18,
        impressions: 44079,
        clicks: 4092,
        follows: 395,
        profileVisits: 3956,
        cpf: 1.58, // 624.18 ÷ 395 follows
        ctr: 9.28,
        followRate: 9.99, // 395 follows ÷ 3,956 profile visits
        cpc: 0.15,
      },
      {
        name: "Frozen Pasta Can't Be That Good",
        note: "Best follow rate · peaked Aug 18–19",
        spend: 311.77,
        impressions: 20734,
        clicks: 690,
        follows: 178,
        profileVisits: 528,
        cpf: 1.75, // 311.77 ÷ 178 follows
        ctr: 3.33,
        followRate: 33.71, // 178 follows ÷ 528 profile visits
        cpc: 0.45,
      },
    ],
    verdict:
      "The highest-CTR creative is the worst follower engine. \"What Did I Just Witness\" launched Aug 24 and dominated attention — a 16.5% CTR and 5,717 profile visits — but converted just 7 follows (0.12% follow rate, ~$67 CPF). It single-handedly dragged the account's visit-to-follow rate from ~33% early in the month to ~2% by Aug 31. Meanwhile the proven converters held: \"Frozen Pasta Can't Be That Good\" turned 34% of its visits into follows at $1.75, and \"Cacio e Pepe Puffs\" balanced real volume with a 10% follow rate at $1.58. The fix is not more budget — it's creative rotation: retire or re-cut \"What Did I Just Witness\" (or bolt a hard follow CTA onto it), and push spend back toward Puffs and Frozen Pasta, the two ads actually building the audience.",
  },
  notes: [
    {
      title: "Retailer Support: awareness → traffic switch",
      dateRange: "Aug 13",
      spend: 3368,
      status: "Phase change",
      detail:
        "Retailer support flipped from an awareness-optimized build (Aug 1–13, CPM ~$2, ~750K impressions) to a traffic-optimized one (Aug 13–31). Traffic phase is healthy — 3–4% CTR and ~$0.23 CPC across both Whole Foods and Target. Watch item: traffic-phase CPM drifted up from ~$6 to ~$10 late in the month (possible early saturation), though CTR held.",
    },
    {
      title: "Instagram Awareness Campaign",
      dateRange: "Aug 1–31",
      spend: 1564,
      status: "Evergreen — healthy",
      detail:
        "Always-on broad reach. Frequency stayed at ~1.0 all month (continually reaching new people, not fatiguing) and CPM held in a stable ~$1.5–2.9 band. Low CTR and near-zero follows are expected here — this layer's only job is cheap fresh reach, and it did it.",
    },
    {
      title: "Largest single ad: Us v. Them",
      dateRange: "Aug 1–31",
      spend: 1166,
      status: "Working as intended",
      detail:
        "The month's biggest ad-level spend (~$1,166) is the \"Us v. Them\" reach ad inside IG Awareness. Judged on its own objective it's fine: ~534K impressions at a ~$2 CPM. It should not be read against a follow or CTR standard.",
    },
  ],
}

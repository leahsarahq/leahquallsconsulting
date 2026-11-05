import raw from "./meta/oct-2026.generated.json"
import septemberRaw from "./meta/exports.generated.json"
import { campaignForAdSet, SEPTEMBER_KPI_DATA } from "./september-2026"
import type { AdData, Campaign, KPIData, OverviewAnalysis, TestArm, TestingContext, WeeklyFollows } from "./types"

// October 2026 — FULL MONTH (Oct 1–31). Computed from the Meta Ads Manager
// exports in data/meta/oct-2026/ (parsed by scripts/build-meta-data.mjs), using the
// same metric definitions as September:
//   Engagement CPF  = Engagement spend ÷ Engagement Instagram follows
//   Blended CPF     = total spend ÷ total follows (Instagram Insights), same window
//   Visit-to-follow = Instagram follows ÷ Instagram profile visits
// No Awareness campaign ran in October. The Instagram Insights "Follows" export
// covers the full month (Oct 1–31).
// The Oct 1–31 ads export omits "Did You Know" and "Corn Ravioli", so their Oct 1–22
// rows come from the earlier export, and "Did You Know" Oct 23–31 uses the Lookalike
// ad set rows (it was the only ad delivering in that ad set after Oct 19).

interface Row {
  start: string
  name: string
  dim: string | null
  budget: number
  spend: number
  impressions: number
  clicks: number
  reach: number
  visits: number
  follows: number
}
const EXPORTS = raw as unknown as Record<"adsetDaily" | "adDaily", Row[]>
const SEPTEMBER_EXPORTS = septemberRaw as unknown as Record<"adsetDaily", Row[]>

interface Totals {
  spend: number
  impressions: number
  clicks: number
  reach: number
  visits: number
  follows: number
}
const sum = (rows: Row[]): Totals =>
  rows.reduce(
    (t, r) => ({
      spend: t.spend + r.spend,
      impressions: t.impressions + r.impressions,
      clicks: t.clicks + r.clicks,
      reach: t.reach + r.reach,
      visits: t.visits + r.visits,
      follows: t.follows + r.follows,
    }),
    { spend: 0, impressions: 0, clicks: 0, reach: 0, visits: 0, follows: 0 },
  )
const round2 = (v: number) => Math.round(v * 100) / 100
const money = (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const money0 = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`
const int = (v: number) => Math.round(v).toLocaleString("en-US")
const pct1 = (v: number) => `${(v * 100).toFixed(1)}%`
const day = (iso: string) => Number(iso.slice(8, 10))
const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
const change = (cur: number, prior: number) => {
  const v = ((cur - prior) / prior) * 100
  return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`
}

export const OCTOBER_LAST_AD_DAY = 31
const IG_LAST_DAY = 31

// ── Campaign mapping ─────────────────────────────────────────────────────────
// The ads export has no ad set column; these are the follower-growth creatives.
const ENGAGEMENT_AD_NAMES = [
  "Frozen Pasta Can't Be That Good",
  "Did You Know",
  "Corn Ravioli",
  "Cacio e Pepe Puffs",
  "4 Easy Pasta Dinners",
]
const campaignForAd = (r: Row): Campaign => (ENGAGEMENT_AD_NAMES.includes(r.name) ? "Engagement" : "Retailer Support")

const engagementRows = EXPORTS.adsetDaily.filter((r) => campaignForAdSet(r.name) === "Engagement")
const engagement = sum(engagementRows)
const retailer = sum(EXPORTS.adsetDaily.filter((r) => campaignForAdSet(r.name) === "Retailer Support"))
const all = sum(EXPORTS.adsetDaily)

// ── Daily data ───────────────────────────────────────────────────────────────
const CAMPAIGN_KEY: Record<Campaign, string> = {
  Engagement: "Engagement Campaign",
  Awareness: "Awareness Campaign",
  "Retailer Support": "Retailer Support",
}
export const OCTOBER_DAILY_DATA: Record<string, Record<string, { spend: number; follows: number }>> = {}
for (const r of EXPORTS.adsetDaily) {
  const d = (OCTOBER_DAILY_DATA[r.start] ??= {})
  const cell = (d[CAMPAIGN_KEY[campaignForAdSet(r.name)]] ??= { spend: 0, follows: 0 })
  cell.spend = round2(cell.spend + r.spend)
  cell.follows += r.follows
}

// ── Instagram Insights daily follows (Oct 1–31) ──────────────────────────────
export const OCTOBER_IG_DAILY_FOLLOWS = [
  64, 69, 92, 78, 53, 57, 52, 41, 39, 39, 35, 33, 42, 25, 54, 39, 149, 157, 101, 83,
  106, 80, 41, 61, 62, 56, 62, 49, 49, 55, 57,
].map((follows, i) => ({ date: `2026-10-${String(i + 1).padStart(2, "0")}`, follows }))
const igTotal = OCTOBER_IG_DAILY_FOLLOWS.reduce((s, d) => s + d.follows, 0)
const igBetween = (from: number, to: number) =>
  OCTOBER_IG_DAILY_FOLLOWS.filter((d) => day(d.date) >= from && day(d.date) <= to).reduce((s, d) => s + d.follows, 0)

// Same-window ad figures so blended CPF and organic lift line up with IG Insights.
const allThroughIg = sum(EXPORTS.adsetDaily.filter((r) => day(r.start) <= IG_LAST_DAY))
const organicFollows = igTotal - allThroughIg.follows

// ── Ad-level data ────────────────────────────────────────────────────────────
interface AdAgg extends Totals {
  name: string
  campaign: Campaign
  first: string
  last: string
}
const adAggs: AdAgg[] = (() => {
  const map = new Map<string, AdAgg>()
  for (const r of EXPORTS.adDaily) {
    const campaign = campaignForAd(r)
    const key = `${campaign}|${r.name}`
    const a = map.get(key) ?? { name: r.name, campaign, first: "", last: "", ...sum([]) }
    Object.assign(a, sum([a as unknown as Row, r]))
    // Ignore trickle spend on paused ads when dating a creative's run.
    if (r.spend >= 1) {
      if (!a.first || r.start < a.first) a.first = r.start
      if (!a.last || r.start > a.last) a.last = r.start
    }
    map.set(key, a)
  }
  return [...map.values()].filter((a) => a.spend > 0 || a.impressions > 0)
})()

export const OCTOBER_ADS_DATA: AdData[] = adAggs
  .map((a) => ({
    name: a.name,
    spend: round2(a.spend),
    impressions: a.impressions,
    clicks: a.clicks,
    follows: a.follows,
    cpf: a.follows > 0 ? round2(a.spend / a.follows) : null,
    ctr: a.impressions > 0 ? round2((a.clicks / a.impressions) * 100) : 0,
    campaign: a.campaign,
    pct18to34: null,
    pct45plus: null,
  }))
  .sort((a, b) => b.follows - a.follows || b.spend - a.spend)

// ── KPIs ─────────────────────────────────────────────────────────────────────
const engagementCPF = engagement.spend / engagement.follows

export const OCTOBER_KPI_DATA: KPIData = {
  totalSpend: Math.round(all.spend),
  followerGrowth: igTotal,
  paidFollows: allThroughIg.follows,
  startFollowers: SEPTEMBER_KPI_DATA.endFollowers,
  endFollowers: SEPTEMBER_KPI_DATA.endFollowers + igTotal,
  blendedCPF: allThroughIg.spend / igTotal,
  engagementCPF,
  totalReach: all.reach,
  totalImpressions: all.impressions,
  engagementCTR: round2((engagement.clicks / engagement.impressions) * 100),
  messagingContacts: 0,
  unfollows: 0,
  organicExportMissing: false,
  igInsightsMissing: false,
  reachNotDeduplicated: true,
  weeklyTotalsApproximate: true,
}

// ── Spend-adjusted view vs September ─────────────────────────────────────────
export type SpendAdjustedTile = {
  label: string
  october: string
  september: string
  better: boolean
  note: string
}

export const OCTOBER_SPEND_ADJUSTED: {
  title: string
  summary: string
  groups: { label: string; tiles: SpendAdjustedTile[] }[]
  footnote: string
  footnoteTip: string
} = {
  title: "October vs. September, adjusted for spend",
  summary: "October's budget was an overcorrection after September's increase, so totals are smaller. Per dollar, follower growth improved.",
  groups: [
    {
      label: "Efficiency",
      tiles: [
        { label: "Follows per $100", october: "39", september: "25", better: true, note: "all follows ÷ all ad spend; includes the Oct 17–19 IG giveaway" },
        { label: "Engagement CPF", october: "$2.50", september: "$2.49", better: false, note: "flat on ad-attributed follows" },
        { label: "Daily ad spend", october: "$164", september: "$291", better: false, note: "$5,085 total, Oct 1–31" },
        { label: "Follows per day", october: "64", september: "73", better: false, note: "on 44% less daily spend" },
      ],
    },
    {
      label: "Where follows came from",
      tiles: [
        { label: "Total follows", october: "1,980", september: "2,200", better: false, note: "Instagram Insights, all sources" },
        { label: "From ads", october: "1,390", september: "1,824", better: false, note: "attributed in Ads Manager" },
        { label: "Not from ads", october: "590", september: "376", better: false, note: "organic + giveaway, no direct ad click" },
        { label: "Non-ad share", october: "30%", september: "17%", better: true, note: "lifted by the Oct 17–19 IG giveaway" },
      ],
    },
  ],
  footnote: "Impressions: 346K vs. 1,322K, from campaign mix, not efficiency.",
  footnoteTip:
    "No Awareness spend in October and a smaller Retailer Support budget. Engagement CTR was 4.9% vs. 5.3%.",
}

// ── November plan (shown on October's Overview) ──────────────────────────────
export const NOVEMBER_PLAN = {
  title: "November Plan",
  subtitle: "What's changing for November and why.",
  takeaway: "Budget is back up: 4 ad sets at $50/day each, $200/day total.",
  adSets: [
    {
      name: "Recipes & Cooking (ages 24–64)",
      budget: "$50/day",
      role: "Volume engine",
      bullets: [
        { lead: "$2.21 per follow", text: " in October, our best" },
        { lead: "No changes,", text: " keeps its learning" },
      ],
    },
    {
      name: "Pasta + 18–34",
      budget: "$50/day",
      role: "Grow younger followers",
      bullets: [
        { lead: "Now strictly", text: " ages 18–34" },
        { lead: "Only 38%", text: " of October spend reached them" },
      ],
    },
    {
      name: "Creative Test",
      budget: "$50/day",
      role: "Find the next top ad",
      bullets: [
        { lead: "Replaces lookalike", text: " ($3.72 per follow)" },
        { lead: "Tests new ads", text: " on a broad audience" },
      ],
    },
    {
      name: "[AD SET NAME]",
      budget: "$50/day",
      role: "[ROLE]",
      bullets: [
        { lead: "[BULLET 1]", text: "" },
        { lead: "[BULLET 2]", text: "" },
      ],
    },
  ],
  timeline: [
    { dates: "Nov 4–13", label: "Test round 1" },
    { dates: "Nov 14–23", label: "Test round 2" },
    { dates: "Nov 24–30", label: "Hold steady through Thanksgiving" },
  ],
  timelineCaption: "All changes go live Nov 4. Ads are judged after ~$100 spend.",
  timelineTip:
    "Launching together means only one learning reset. Any ad under ~$1.80 per follow moves into the main ad set at the next switch.",
  targetsTitle: "What we're aiming for in November",
  targets: [
    { label: "Cost per follow", value: "$2.30–2.60", note: "October: $2.50" },
    { label: "Visit → follow rate", value: "20%+", note: "October second half: 24.2%" },
    { label: "18–34 share of new followers", value: "23%+", note: "October: 21.4%" },
  ],
  targetsCaption: "Younger followers cost more (~$3.02 each), and Black Friday week may run higher.",
  targetsTip:
    "Expect more follows than October at a similar cost per follow. The 18–34 focus keeps the blended cost from dropping much.",
}

export const OCTOBER_CAMPAIGN_TOTALS: Record<Campaign, { spend: number; impressions: number }> = {
  Engagement: { spend: engagement.spend, impressions: engagement.impressions },
  Awareness: { spend: 0, impressions: 0 },
  "Retailer Support": { spend: retailer.spend, impressions: retailer.impressions },
}

export const OCTOBER_SPEND_BY_CAMPAIGN = [
  { name: "Engagement", value: Math.round(engagement.spend), color: "#D93732" },
  { name: "Retailer Support", value: Math.round(retailer.spend), color: "#E8853A" },
]

// ── Weekly ───────────────────────────────────────────────────────────────────
const WEEKS = [
  { label: "Oct 1–7", from: 1, to: 7 },
  { label: "Oct 8–14", from: 8, to: 14 },
  { label: "Oct 15–21", from: 15, to: 21 },
  { label: "Oct 22–28", from: 22, to: 28 },
  { label: "Oct 29–31", from: 29, to: 31 },
]
const engagementWeeks = WEEKS.map((w) => ({
  ...w,
  t: sum(engagementRows.filter((r) => day(r.start) >= w.from && day(r.start) <= w.to)),
}))

export const OCTOBER_WEEKLY_FOLLOWS: WeeklyFollows[] = engagementWeeks.map((w) => ({
  week: w.label,
  paid: w.t.follows,
  total: w.from > IG_LAST_DAY ? null : igBetween(w.from, Math.min(w.to, IG_LAST_DAY)),
  note: w.to > IG_LAST_DAY && w.from <= IG_LAST_DAY ? `IG total through Oct ${IG_LAST_DAY}` : undefined,
}))

// ── Ad set comparison (the 18–34 audience test) ──────────────────────────────
const adSetNames = [...new Set(engagementRows.map((r) => r.name))]
const toArm = (name: string, note: string): TestArm => {
  const t = sum(engagementRows.filter((r) => r.name === name))
  return {
    name,
    note,
    spend: round2(t.spend),
    impressions: t.impressions,
    clicks: t.clicks,
    follows: t.follows,
    profileVisits: t.visits,
    cpf: t.follows > 0 ? round2(t.spend / t.follows) : null,
    ctr: t.impressions > 0 ? round2((t.clicks / t.impressions) * 100) : 0,
    followRate: t.visits > 0 ? round2((t.follows / t.visits) * 100) : 0,
    cpc: t.clicks > 0 ? round2(t.spend / t.clicks) : 0,
  }
}
const YOUNG_AD_SET = adSetNames.find((n) => n.includes("18-34")) ?? adSetNames[0]
const BROAD_AD_SET = adSetNames.find((n) => n.includes("Recipes")) ?? adSetNames[0]
const LOOKALIKE_AD_SET = adSetNames.find((n) => n.includes("Lookalike")) ?? adSetNames[0]
const youngArm = toArm(YOUNG_AD_SET, "Ages 18–34 only")
const broadArm = toArm(BROAD_AD_SET, "Ages 24–64, recipe and cooking interests")
const lookalikeArm = toArm(LOOKALIKE_AD_SET, "1% lookalike + retailer and cooking interests")

// The 18–34 ad set after it moved onto "Frozen Pasta Can't Be That Good".
const youngFirstDay = engagementRows.filter((r) => r.name === YOUNG_AD_SET && r.spend > 0).map((r) => r.start).sort()[0]
const YOUNG_SWITCH_DAY = 17
const youngAfterSwitch = sum(engagementRows.filter((r) => r.name === YOUNG_AD_SET && day(r.start) >= YOUNG_SWITCH_DAY))
const youngBeforeSwitch = sum(engagementRows.filter((r) => r.name === YOUNG_AD_SET && day(r.start) < YOUNG_SWITCH_DAY))

const ad = (name: string) => adAggs.find((a) => a.campaign === "Engagement" && a.name === name)
const ran = (a: AdAgg | undefined) =>
  !a ? "—" : a.first === a.last ? fmtDate(a.first) : `${fmtDate(a.first)}–${day(a.last)}`

const engagementAds = adAggs.filter((a) => a.campaign === "Engagement").sort((a, b) => b.follows - a.follows)
const topAd = engagementAds[0]
const cacio = ad("Cacio e Pepe Puffs")
const corn = ad("Corn Ravioli")
const pastaDinners = ad("4 Easy Pasta Dinners")

export const OCTOBER_TESTING: TestingContext = {
  featured: {
    name: "18–34 audience vs. broad audiences",
    dateRange: `${fmtDate(youngFirstDay)}–${OCTOBER_LAST_AD_DAY}, 2026`,
    hypothesis:
      "A follower-growth audience capped at ages 18–34 can add younger followers at a cost per follow close to the broad audiences.",
    kpiFocus: "Cost per follow and visit-to-follow rate, judged per ad set",
    arms: [youngArm, broadArm, lookalikeArm],
    verdict: {
      bullets: [
        { lead: "18–34: $2.05 per follow", text: ", lowest of the three tests" },
        { lead: "$1.72 after Oct 17", text: `, once "Frozen Pasta Can't Be That Good" went live` },
        { lead: "Recipes & Cooking:", text: " most follows (676) and best visit-to-follow rate (22.9%)" },
        { lead: "Lookalike:", text: " most expensive at $3.72" },
      ],
    },
    verdictHighlight: { label: "18–34 CPF since Oct 17", value: "$1.72", note: "Below the ~$2.00 October target" },
  },
  notes: [
    cacio && {
      title: "Cacio e Pepe Puffs",
      dateRange: ran(cacio),
      spend: round2(cacio.spend),
      status: "Paused",
      detail: {
        bullets: [
          { lead: `${pct1(cacio.follows / cacio.visits)} visit-to-follow`, text: " despite strong clicks" },
          { lead: `Paused Oct ${day(cacio.last)}`, text: ", same pattern as September" },
        ],
      },
    },
    corn && {
      title: "Corn Ravioli",
      dateRange: ran(corn),
      spend: round2(corn.spend),
      status: "Paused",
      detail: {
        bullets: [
          { lead: `${int(corn.follows)} follows`, text: ` at ${money(corn.spend / corn.follows)} each` },
          { lead: `${pct1(corn.follows / corn.visits)} visit-to-follow`, text: ", below the 20% goal" },
        ],
      },
    },
    pastaDinners && {
      title: "4 Easy Pasta Dinners",
      dateRange: ran(pastaDinners),
      spend: round2(pastaDinners.spend),
      status: "Short run",
      detail: {
        bullets: [
          { lead: `${int(pastaDinners.follows)} follows`, text: " in a two-day run" },
          { lead: "Too little spend", text: " to judge" },
        ],
      },
    },
  ].filter((n): n is NonNullable<typeof n> => !!n),
  // Follows and spend by age, summed across all follower-growth ad sets in each
  // month's Ad sets × Age export ("Unknown" age excluded).
  ageShift: {
    goal: "October goal: grow the share of new followers aged 18–34.",
    goalMet: "up 0.8 pts from September and 2.4 pts since May.",
    months: [
      { month: "May", young: 342, mid: 562, older: 901, youngSpend: 394.71, totalSpend: 1769.57 },
      { month: "Jun", young: 350, mid: 462, older: 824, youngSpend: 555.44, totalSpend: 2358.95 },
      { month: "Jul", young: 373, mid: 438, older: 920, youngSpend: 756.7, totalSpend: 3115.85 },
      { month: "Aug", young: 216, mid: 218, older: 553, youngSpend: 589.88, totalSpend: 2947.57 },
      { month: "Sep", young: 372, mid: 414, older: 1025, youngSpend: 1152.46, totalSpend: 4538.84 },
      { month: "Oct", young: 288, mid: 325, older: 735, youngSpend: 870.73, totalSpend: 3466.06 },
    ],
    callout: { label: "Pasta + 18-34 ad set", youngFollows: 101, totalFollows: 394, youngSpend: 314.88,
      totalSpend: 819.15,
    },
    read: {
      takeaway: "The 18–34 ad set is shifting the mix, even with most of its spend leaking to older ages.",
      bullets: [
        { lead: "21.4%", text: " of new followers were 18–34, up from 20.5% in September" },
        { lead: "25.6%", text: " in the 18–34 ad set vs. ~20% elsewhere" },
        { lead: "Only 38%", text: " of its spend reached 18–34; November adds a strict age limit" },
        { lead: "Younger followers cost more:", text: " $3.02 per follow in October" },
      ],
      note: "18–34 follow count dipped with total paid follows (1,811 → 1,348), not share.",
      tip: "Meta's audience expansion pushed delivery to people 35+, which is why only 38% of the 18–34 ad set's spend reached 18–34.",
    },
  },
}

// ── Overview narrative ───────────────────────────────────────────────────────
const sepEngagement = sum(SEPTEMBER_EXPORTS.adsetDaily.filter((r) => campaignForAdSet(r.name) === "Engagement"))
const sepAdDays = new Set(SEPTEMBER_EXPORTS.adsetDaily.map((r) => r.start)).size
const octAdDays = new Set(EXPORTS.adsetDaily.map((r) => r.start)).size
const sepFollowsPerDay = sepEngagement.follows / sepAdDays
const octFollowsPerDay = engagement.follows / octAdDays
const sepVtf = sepEngagement.follows / sepEngagement.visits
const octVtf = engagement.follows / engagement.visits
const sepCpf = sepEngagement.spend / sepEngagement.follows
const lateMonth = sum(engagementRows.filter((r) => day(r.start) >= 15))
const lateMonthCpf = lateMonth.spend / lateMonth.follows
const lateMonthVtf = lateMonth.follows / lateMonth.visits
const bestWeek = engagementWeeks.slice(0, 4).reduce((b, w) => (w.t.spend / w.t.follows < b.t.spend / b.t.follows ? w : b))

export const OCTOBER_OVERVIEW_ANALYSIS: OverviewAnalysis = {
  executiveSummary: {
    takeaway: "October finished strong: the second half beat both October goals.",
    bullets: [
      { lead: `${int(engagement.follows)} follows from ads`, text: ` at ${money(engagementCPF)} each; ${int(igTotal)} total including organic` },
      { lead: "Oct 15–31:", text: ` ${money(lateMonthCpf)} per follow, ${pct1(lateMonthVtf)} visit-to-follow rate` },
      { lead: "Week 2 was the weak spot", text: ` (${money(engagementWeeks[1].t.spend / engagementWeeks[1].t.follows)}): two new test ads underperformed and were paused` },
      { lead: `"${topAd.name}"`, text: ` was the top ad: ${int(topAd.follows)} follows` },
    ],
    note: `~${int(organicFollows)} follows came without a direct ad click; best week was ${bestWeek.label} (${money(bestWeek.t.spend / bestWeek.t.follows)}).`,
  },
  campaignObjectives: [
    {
      name: "Instagram Engagement Campaign",
      objective: "Follower growth",
      judgeOn: "Cost per follow, visit-to-follow rate",
      stat: `${money(engagement.spend)} spend · ${int(engagement.follows)} follows · ${money(engagementCPF)} CPF · ${pct1(octVtf)} visit-to-follow across ${adSetNames.length} ad sets, including the new 18–34 audience.`,
    },
    {
      name: "Retailer Support (Traffic)",
      objective: "Whole Foods, Target & Meijer retail support",
      judgeOn: "CTR and cost per click",
      stat: `${money(retailer.spend)} spend · ${int(retailer.clicks)} link clicks · ${money(retailer.spend / retailer.clicks)} CPC · ${pct1(retailer.clicks / retailer.impressions)} CTR.`,
    },
  ],
  weeklyChartNote: "Oct 15–21 includes a jump in follows from the Instagram giveaway (Oct 17–19), not ads.",
  deepDive: {
    title: "Follower Growth Deep Dive — Engagement campaign",
    lead: {
      takeaway: "Nearly all of the gap to September came from one week.",
      bullets: [
        { lead: "Oct 8–14:", text: ` two new test ads ('Cacio e Pepe Puffs' and 'Corn Ravioli') converted only ${pct1(((cacio?.follows ?? 0) + (corn?.follows ?? 0)) / ((cacio?.visits ?? 0) + (corn?.visits ?? 1)))} of visits` },
        { lead: `${money(lateMonthCpf)} per follow`, text: " Oct 15–31, after both were paused" },
      ],
    },
    weekly: engagementWeeks.map((w) => ({
      week: w.label,
      spend: money0(w.t.spend),
      follows: int(w.t.follows),
      costPerFollow: w.t.follows > 0 ? money(w.t.spend / w.t.follows) : "—",
      profileVisits: int(w.t.visits),
      visitToFollow: w.t.visits > 0 ? pct1(w.t.follows / w.t.visits) : "—",
    })),
    creative: engagementAds
      .filter((a) => a.follows > 0)
      .slice(0, 6)
      .map((a) => ({
        ad: a.name,
        ran: ran(a),
        profileVisits: int(a.visits),
        follows: int(a.follows),
        visitToFollow: a.visits > 0 ? pct1(a.follows / a.visits) : "—",
      })),
    caption: {
      takeaway: `"${topAd.name}" converts best: ${pct1(topAd.follows / topAd.visits)} of profile visitors.`,
      note: `"Did You Know": ${pct1((ad("Did You Know")?.follows ?? 0) / (ad("Did You Know")?.visits ?? 1))}; paused ads under 10%. Oct 29–31 is a three-day week.`,
    },
  },
}

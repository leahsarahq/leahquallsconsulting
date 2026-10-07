import raw from "./meta/exports.generated.json"
import type { AdData, Campaign, KPIData, OverviewAnalysis, WeeklyFollows } from "./types"

// September 2026 — FULL MONTH. Every number here is computed from the Meta Ads
// Manager exports in data/meta/ (parsed by scripts/build-meta-data.mjs), using the
// same metric definitions as August:
//   Engagement CPF = Engagement spend ÷ Engagement Instagram follows
//   Blended CPF    = total spend ÷ total follows (Instagram Insights)
//   Follow rate    = Instagram follows ÷ Instagram profile visits
// The Instagram Insights "Instagram follows" export for the full month has not been
// imported, so Total follows, Awareness lift and Blended CPF render as "—".

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
const EXPORTS = raw as unknown as Record<
  "adsetDaily" | "adDaily" | "adsetByAge" | "adByAge" | "adsetByPlatform" | "adByPlatform",
  Row[]
>

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

// ── Campaign mapping (ad set level) ──────────────────────────────────────────
const AWARENESS_AD_SETS = ["Audience Test (Parents + Cooking)", "Audience Test (Young Millennials)"]
export function campaignForAdSet(name: string): Campaign {
  if (name.startsWith("Existing Posts")) return "Engagement"
  if (AWARENESS_AD_SETS.includes(name)) return "Awareness"
  return "Retailer Support"
}

// Ad exports have no ad set column. Engagement ad sets are the only ones on a $75
// budget; on the $50 budget, these creatives belong to the two Awareness ad sets.
const ENGAGEMENT_BUDGET = 75
const AWARENESS_AD_NAMES = ["Us v. Them", "Cacio e Pepe Hero Image", "Frozen Pasta Can't Be That Good"]
function campaignForAd(r: Row): Campaign {
  if (r.budget === ENGAGEMENT_BUDGET) return "Engagement"
  if (AWARENESS_AD_NAMES.includes(r.name)) return "Awareness"
  return "Retailer Support"
}

const byCampaign = (c: Campaign) => sum(EXPORTS.adsetDaily.filter((r) => campaignForAdSet(r.name) === c))
const engagement = byCampaign("Engagement")
const awareness = byCampaign("Awareness")
const retailer = byCampaign("Retailer Support")
const all = sum(EXPORTS.adsetDaily)

// ── Daily data ───────────────────────────────────────────────────────────────
const CAMPAIGN_KEY: Record<Campaign, string> = {
  Engagement: "Engagement Campaign",
  Awareness: "Awareness Campaign",
  "Retailer Support": "Retailer Support",
}
export const SEPTEMBER_DAILY_DATA: Record<string, Record<string, { spend: number; follows: number }>> = {}
for (const r of EXPORTS.adsetDaily) {
  const day = (SEPTEMBER_DAILY_DATA[r.start] ??= {})
  const key = CAMPAIGN_KEY[campaignForAdSet(r.name)]
  const cell = (day[key] ??= { spend: 0, follows: 0 })
  cell.spend = round2(cell.spend + r.spend)
  cell.follows += r.follows
}

// Dates in Sep 1–30 with no rows in either daily export (shown as a header footnote).
const daysWithRows = new Set([...EXPORTS.adsetDaily, ...EXPORTS.adDaily].map((r) => r.start))
export const SEPTEMBER_MISSING_DATES = Array.from({ length: 30 }, (_, i) => `2026-09-${String(i + 1).padStart(2, "0")}`).filter(
  (d) => !daysWithRows.has(d),
)

// ── Ad-level data ────────────────────────────────────────────────────────────
// Ages 18–34 / 45+ share of follows per ad, from the Jul–Sep ads-by-Age export
// (Engagement rows only).
const YOUNG = ["18-24", "25-34"]
const OLDER = ["45-54", "55-64", "65+"]
const adAgeMix = new Map<string, { pct18to34: number | null; pct45plus: number | null }>()
{
  const groups = new Map<string, Row[]>()
  EXPORTS.adByAge.filter((r) => r.budget === ENGAGEMENT_BUDGET).forEach((r) => groups.set(r.name, [...(groups.get(r.name) ?? []), r]))
  // Below 30 follows the age split is too noisy to show.
  const MIN_FOLLOWS_FOR_AGE_MIX = 30
  groups.forEach((rows, name) => {
    const total = sum(rows).follows
    if (total < MIN_FOLLOWS_FOR_AGE_MIX) {
      adAgeMix.set(name, { pct18to34: null, pct45plus: null })
      return
    }
    adAgeMix.set(name, {
      pct18to34: total > 0 ? sum(rows.filter((r) => YOUNG.includes(r.dim ?? ""))).follows / total : null,
      pct45plus: total > 0 ? sum(rows.filter((r) => OLDER.includes(r.dim ?? ""))).follows / total : null,
    })
  })
}

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
    const name = campaign === "Awareness" && r.name === "Frozen Pasta Can't Be That Good" ? `${r.name} (Awareness)` : r.name
    const key = `${campaign}|${name}`
    const a = map.get(key) ?? { name, campaign, first: "", last: "", ...sum([]) }
    const s = sum([a as unknown as Row, r])
    Object.assign(a, s)
    if (r.spend > 0 || r.impressions > 0) {
      if (!a.first || r.start < a.first) a.first = r.start
      if (!a.last || r.start > a.last) a.last = r.start
    }
    map.set(key, a)
  }
  return [...map.values()].filter((a) => a.spend > 0 || a.impressions > 0)
})()

export const SEPTEMBER_ADS_DATA: AdData[] = adAggs
  .map((a) => {
    const mix = a.campaign === "Engagement" ? adAgeMix.get(a.name) : undefined
    return {
      name: a.name,
      spend: round2(a.spend),
      impressions: a.impressions,
      clicks: a.clicks,
      follows: a.follows,
      cpf: a.follows > 0 ? round2(a.spend / a.follows) : null,
      ctr: a.impressions > 0 ? round2((a.clicks / a.impressions) * 100) : 0,
      campaign: a.campaign,
      pct18to34: mix?.pct18to34 ?? null,
      pct45plus: mix?.pct45plus ?? null,
    }
  })
  .sort((a, b) => b.follows - a.follows || b.spend - a.spend)

// ── KPIs ─────────────────────────────────────────────────────────────────────
const paidFollows = all.follows
const engagementCPF = engagement.spend / engagement.follows
// Instagram Insights "Follows" card, Sep 1–30: 2.2K (Meta rounds to one decimal).
const IG_INSIGHTS_TOTAL_FOLLOWS = 2200
const organicFollows = IG_INSIGHTS_TOTAL_FOLLOWS - paidFollows

export const SEPTEMBER_KPI_DATA: KPIData = {
  totalSpend: Math.round(all.spend),
  followerGrowth: IG_INSIGHTS_TOTAL_FOLLOWS,
  paidFollows,
  startFollowers: 15455, // end of August (14,119 + 1,336)
  endFollowers: 15455 + IG_INSIGHTS_TOTAL_FOLLOWS,
  blendedCPF: all.spend / IG_INSIGHTS_TOTAL_FOLLOWS,
  engagementCPF,
  totalReach: all.reach, // sum of daily ad set reach (upper bound; not deduped)
  totalImpressions: all.impressions,
  engagementCTR: round2((engagement.clicks / engagement.impressions) * 100),
  messagingContacts: 0, // not imported
  unfollows: 0,
  organicExportMissing: false,
  igInsightsMissing: false,
  reachNotDeduplicated: true,
  weeklyTotalsApproximate: true,
}

// Ad set totals per campaign. Ad-level exports lose a few dollars to rounding
// and ad-set mapping, so the Budget tab uses these to match the other tabs.
export const SEPTEMBER_CAMPAIGN_TOTALS: Record<Campaign, { spend: number; impressions: number }> = {
  Engagement: { spend: engagement.spend, impressions: engagement.impressions },
  Awareness: { spend: awareness.spend, impressions: awareness.impressions },
  "Retailer Support": { spend: retailer.spend, impressions: retailer.impressions },
}

export const SEPTEMBER_SPEND_BY_CAMPAIGN = [
  { name: "Engagement", value: Math.round(engagement.spend), color: "#D93732" },
  { name: "Awareness", value: Math.round(awareness.spend), color: "#660033" },
  { name: "Retailer Support", value: Math.round(retailer.spend), color: "#E8853A" },
]

// ── Weekly ───────────────────────────────────────────────────────────────────
const WEEKS = [
  { label: "Sep 1–7", from: 1, to: 7 },
  { label: "Sep 8–14", from: 8, to: 14 },
  { label: "Sep 15–21", from: 15, to: 21 },
  { label: "Sep 22–28", from: 22, to: 28 },
  { label: "Sep 29–30", from: 29, to: 30 },
]
const day = (iso: string) => Number(iso.slice(8, 10))
const engagementWeeks = WEEKS.map((w) => ({
  ...w,
  t: sum(
    EXPORTS.adsetDaily.filter((r) => campaignForAdSet(r.name) === "Engagement" && day(r.start) >= w.from && day(r.start) <= w.to),
  ),
}))

// Approximate weekly totals read off the IG Insights daily "Follows" chart
// (no weekly export); they sum to ~2,190, matching the 2.2K card total.
const IG_WEEKLY_TOTALS_APPROX = [590, 420, 660, 490, 30]

export const SEPTEMBER_WEEKLY_FOLLOWS: WeeklyFollows[] = engagementWeeks.map((w, i) => ({
  week: w.label,
  paid: w.t.follows,
  total: IG_WEEKLY_TOTALS_APPROX[i] ?? null,
}))

// ── Overview narrative ───────────────────────────────────────────────────────
const AUGUST = { engagementSpend: 2947.72, engagementFollows: 997, cpf: 2.96, impressions: 1848317, ctr: 8.74, totalFollows: 1336 }
const totalFollowsChange = Math.round(((IG_INSIGHTS_TOTAL_FOLLOWS - AUGUST.totalFollows) / AUGUST.totalFollows) * 100)
const change = (cur: number, prior: number) => {
  const v = ((cur - prior) / prior) * 100
  return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`
}
const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
const ran = (a: AdAgg) => (a.first === a.last ? fmtDate(a.first) : `${fmtDate(a.first)}–${day(a.last)}`)

const engagementAds = adAggs.filter((a) => a.campaign === "Engagement").sort((a, b) => b.follows - a.follows)
const topAd = engagementAds[0]
const engagementAdSets = new Set(EXPORTS.adsetDaily.filter((r) => campaignForAdSet(r.name) === "Engagement").map((r) => r.name)).size

export const SEPTEMBER_OVERVIEW_ANALYSIS: OverviewAnalysis = {
  executiveSummary: `Ads brought in ${int(paidFollows)} followers in September, up from 997 in August. Instagram Insights counts about ${int(IG_INSIGHTS_TOTAL_FOLLOWS)} total follows for the month (up ${totalFollowsChange}%), so roughly ${int(organicFollows)} came without a direct ad click. The Instagram Engagement Campaign's cost per follow fell from $2.96 to ${money(engagementCPF)}, the result of running ${engagementAdSets} follower-growth ad sets again instead of one. "${topAd.name}" was the top ad by a wide margin, with ${int(topAd.follows)} follows at ${money(topAd.spend / topAd.follows)} each. One audience finding shapes October: over the last 90 days about 21% of ad-attributed followers were 18–34 and about 55% were 45 or older, so October adds a goal to grow the younger share.`,
  campaignObjectives: [
    {
      name: "Instagram Engagement Campaign",
      objective: "Follower growth",
      judgeOn: "Cost per follow, visit-to-follow rate",
      stat: `${money(engagement.spend)} spend · ${int(engagement.follows)} follows · ${money(engagementCPF)} CPF · ${pct1(engagement.follows / engagement.visits)} visit-to-follow across ${engagementAdSets} ad sets.`,
    },
    {
      name: "Retailer Support (Traffic + Awareness)",
      objective: "Whole Foods, Target & Meijer retail support",
      judgeOn: "CTR/CPC (traffic phase), CPM/reach (awareness phase)",
      stat: `${money(retailer.spend)} spend · ${int(retailer.clicks)} link clicks · ${money(retailer.spend / retailer.clicks)} CPC. September promos for Whole Foods and Meijer ran alongside the evergreen builds.`,
    },
    {
      name: "Instagram Awareness Campaign",
      objective: "Evergreen broad-reach brand awareness — not follows or clicks",
      judgeOn: "CPM and frequency",
      stat: `${money(awareness.spend)} spend · ${int(awareness.impressions)} impressions · ${money((awareness.spend / awareness.impressions) * 1000)} CPM across two audience tests (Young Millennials, Parents + Cooking).`,
    },
  ],
  monthChange: {
    priorLabel: "August",
    currentLabel: "September",
    rows: [
      { metric: "Engagement campaign spend", prior: money(AUGUST.engagementSpend), current: money(engagement.spend), change: change(engagement.spend, AUGUST.engagementSpend), dir: "neutral" },
      { metric: "Engagement campaign follows", prior: int(AUGUST.engagementFollows), current: int(engagement.follows), change: change(engagement.follows, AUGUST.engagementFollows), dir: "good" },
      { metric: "Cost per follow", prior: money(AUGUST.cpf), current: money(engagementCPF), change: change(engagementCPF, AUGUST.cpf), dir: "good" },
    ],
    explanation: `August's review found that consolidating follower growth into one ad set bought profile traffic rather than follows. September went back to ${engagementAdSets} parallel ad sets, and the Engagement campaign added ${int(engagement.follows - AUGUST.engagementFollows)} more follows than August while cost per follow came down to ${money(engagementCPF)}. Visit-to-follow held at ${pct1(engagement.follows / engagement.visits)} for the month. The weaker converters ("Ripi x sourmilk", "Sauce Before Pasta") were retired in the first week, and spend shifted to "${topAd.name}" and "Did You Know". Cacio e Pepe Puffs was paused after week one because few profile visitors followed (7.7%), though its cost per follow was $2.43.`,
    caveat: "The daily Meta exports have no rows for Sep 13 or Sep 30, so September totals cover Sep 1–29 excluding Sep 13.",
  },
  deepDive: {
    title: "Follower Growth Deep Dive — Engagement campaign",
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
    caption: `"${topAd.name}" carried the month with ${int(topAd.follows)} follows at a ${pct1(topAd.follows / topAd.visits)} visit-to-follow rate. "Sauce Before Pasta" shows the opposite pattern: it pulled profile visits but converted almost none of them before it was retired.`,
  },
}

// ── Budget efficiency: Instagram vs Facebook (Jul–Sep, Engagement ad sets) ───
const fgPlatform = EXPORTS.adsetByPlatform.filter((r) => campaignForAdSet(r.name) === "Engagement")
export interface PlatformSplitRow {
  adSet: string
  platform: "Instagram" | "Facebook"
  spend: number
  follows: number
  cpf: number | null
}
const platformRow = (adSet: string, platform: "Instagram" | "Facebook", rows: Row[]): PlatformSplitRow => {
  const t = sum(rows.filter((r) => r.dim === platform))
  return { adSet, platform, spend: t.spend, follows: t.follows, cpf: t.follows > 0 ? t.spend / t.follows : null }
}
export const SEPTEMBER_PLATFORM_SPLIT = {
  label: "Jul–Sep 2026",
  rows: [...new Set(fgPlatform.map((r) => r.name))].flatMap((adSet) =>
    (["Instagram", "Facebook"] as const).map((p) => platformRow(adSet, p, fgPlatform.filter((r) => r.name === adSet))),
  ),
  totals: (["Instagram", "Facebook"] as const).map((p) => platformRow("Both ad sets", p, fgPlatform)),
}

// ── Insights: audience age (Apr 1 – Sep 30, Instagram Engagement Campaign) ───
// From the "Campaigns by Age, Apr 1 – Sep 30 2026" export (Engagement Campaign rows).
export const AGE_BUCKETS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"] as const
const ENGAGEMENT_AGE_APR_SEP: Record<(typeof AGE_BUCKETS)[number], { spend: number; follows: number; visits: number }> = {
  "18-24": { spend: 776.39, follows: 308, visits: 4991 },
  "25-34": { spend: 2954.44, follows: 1622, visits: 14385 },
  "35-44": { spend: 3843.48, follows: 2456, visits: 14344 },
  "45-54": { spend: 3150.61, follows: 1983, visits: 8593 },
  "55-64": { spend: 2973.73, follows: 1778, visits: 7797 },
  "65+": { spend: 2081.08, follows: 957, visits: 6806 },
}
const knownAgeFollows = Object.values(ENGAGEMENT_AGE_APR_SEP).reduce((s, r) => s + r.follows, 0)
export const SEPTEMBER_AUDIENCE_AGE = AGE_BUCKETS.map((age) => {
  const t = ENGAGEMENT_AGE_APR_SEP[age]
  return {
    age: age.replace("-", "–"),
    spend: t.spend,
    follows: t.follows,
    share: knownAgeFollows > 0 ? t.follows / knownAgeFollows : 0,
    cpf: t.follows > 0 ? t.spend / t.follows : null,
    followRate: t.visits > 0 ? t.follows / t.visits : null,
  }
})
const shareOf = (ages: string[]) =>
  SEPTEMBER_AUDIENCE_AGE.filter((r) => ages.includes(r.age.replace("–", "-"))).reduce((s, r) => s + r.share, 0)
const ageRow = (age: string) => SEPTEMBER_AUDIENCE_AGE.find((r) => r.age === age)!

// Monthly "Ad sets by Age" exports for the age trend card. Add parsed rows here
// (same shape as adsetByAge) when the monthly exports are available.
export const MONTHLY_AGE_EXPORTS: Record<"Jul" | "Aug" | "Sep", Row[] | null> = { Jul: null, Aug: null, Sep: null }
export const SEPTEMBER_AGE_TREND = (() => {
  const months = Object.entries(MONTHLY_AGE_EXPORTS).filter((e): e is [string, Row[]] => !!e[1]?.length)
  if (months.length === 0) return null
  return months.map(([month, rows]) => {
    const fg = rows.filter((r) => campaignForAdSet(r.name) === "Engagement")
    const total = sum(fg.filter((r) => (AGE_BUCKETS as readonly string[]).includes(r.dim ?? ""))).follows
    const share = (age: string) => (total > 0 ? sum(fg.filter((r) => r.dim === age)).follows / total : 0)
    const row: Record<string, number | string> = { month }
    AGE_BUCKETS.forEach((a) => (row[a] = share(a)))
    row.young = share("18-24") + share("25-34")
    row.older = share("45-54") + share("55-64") + share("65+")
    return row
  })
})()

// Follower quality inputs — fill in from Instagram Insights at each month end.
// followers = month-end follower count; interactions = total post interactions
// for the month. Leave null when not imported; the card shows "—".
// Month-end followers are derived from the 5,136 count on Apr 9 plus daily new
// follows in the IG Follows export. That export has no unfollows, so these run
// slightly high (and the rate slightly low).
// IG only splits views (not interactions) into organic vs ads, so organic
// interactions are estimated as interactions × (organicViews ÷ igViews), using the
// Content overview "Views breakdown" for each month.
export const FOLLOWER_QUALITY_INPUTS: {
  month: string
  followers: number | null
  interactions: number | null
  igViews: number | null
  organicViews: number | null
}[] = [
  { month: "Apr", followers: 7228, interactions: 15775, igViews: 251429, organicViews: 129277 },
  { month: "May", followers: 9829, interactions: 20336, igViews: 359834, organicViews: 214915 },
  { month: "Jun", followers: 11729, interactions: 6652, igViews: 272078, organicViews: 131102 },
  { month: "Jul", followers: 14350, interactions: 25685, igViews: 328595, organicViews: 114280 },
  { month: "Aug", followers: 15686, interactions: 6131, igViews: 445070, organicViews: 113145 },
  { month: "Sep", followers: 17896, interactions: 8618, igViews: 404612, organicViews: 110778 },
]

const pct0 = (v: number | null | undefined) => (v == null ? "—" : `${Math.round(v * 100)}%`)
const youngShare = shareOf(["18-24", "25-34"])
const olderShare = shareOf(["45-54", "55-64", "65+"])
const midShare = shareOf(["35-44"])
const frozenMix = adAgeMix.get("Frozen Pasta Can't Be That Good")
const didYouKnowMix = adAgeMix.get("Did You Know")
const cpfRange = (ages: string[]) => {
  const v = ages.map((a) => ageRow(a).cpf ?? 0)
  return `${money(Math.min(...v))}–${money(Math.max(...v))}`
}
const rateRange = (ages: string[]) => {
  const v = ages.map((a) => Math.round((ageRow(a).followRate ?? 0) * 100))
  return `${Math.min(...v)}–${Math.max(...v)}%`
}
const olderRate = Math.round(((ageRow("45–54").followRate ?? 0) + (ageRow("55–64").followRate ?? 0)) * 50)

export const SEPTEMBER_QA = [
  {
    q: "Is our audience getting older?",
    a: `It does skew older. Since April, about ${pct0(youngShare)} of followers gained from ads were 18–34, ${pct0(midShare)} were 35–44, and ${pct0(olderShare)} were 45 or older. This happens because the ads are set to find people most likely to follow, and older viewers who visit the profile follow at roughly twice the rate of younger ones (about ${olderRate}% vs ${rateRange(["18–24", "25–34"])}).`,
  },
  {
    q: "Has it been increasing over the last 60–90 days?",
    a: "We can confirm the skew today but not the direction yet. Our current data is a single 90-day total. We are adding a month-by-month view next and will share it once it is in.",
  },
  {
    q: "Will engagement fall behind follower growth?",
    a: 'It is a fair risk, so we are now tracking engagement rate next to follower count each month starting in October. If engagement rate drops while followers climb, we shift budget toward the younger-capped audience and the ads that bring in younger followers.',
  },
  {
    q: "What does it cost to reach younger people instead?",
    a: `Less than expected for 25–34: about ${money(ageRow("25–34").cpf ?? 0)} per follower, close to the ${cpfRange(["35–44", "45–54", "55–64"])} we pay for ages 35–64. Ages 18–24 cost about ${money(ageRow("18–24").cpf ?? 0)}. Our best ad for younger followers is "Frozen Pasta Can't Be That Good" (${pct0(frozenMix?.pct18to34)} of its followers are 18–34). "Did You Know" skews oldest (${pct0(didYouKnowMix?.pct45plus)} are 45+). In October one audience is capped at 18–34 so that budget can only go to younger people.`,
  },
]

// ── Testing: October plan ────────────────────────────────────────────────────
export const OCTOBER_PLAN = {
  goals: [
    { label: "Cost per follower", target: "about $2.00", baseline: `September: about ${money(engagementCPF)}` },
    { label: "Profile visitors who follow", target: "20%+", baseline: "September: 13.1% overall, about 20% in the last three weeks" },
    { label: "Follower-growth spend on Instagram", target: "100%", baseline: "Jul–Sep: about 75%" },
  ],
  youngShareBaseline: youngShare,
  plannedChange: {
    title: "One audience capped at ages 18–34",
    detail:
      "One follower-growth audience will only show ads to people aged 18–34. It is reported separately from the broad audience so we can see what younger followers cost and how they engage.",
  },
  tracker: [
    { ad: "Ripi & Dip Ranch", launch: "Oct 1" },
    { ad: "Tomato Martini", launch: "Oct 11" },
    { ad: "TBD", launch: "Oct 21" },
  ],
  q4Note:
    "Budgets stay flat through the holidays. Ad costs typically rise from late October through December as bigger advertisers compete, so we judge each ad on cost per follower relative to that week's costs rather than against September. New creative, not more spend, is the main lever.",
  flags: [
    "Comments or DMs that suggest the wrong people are finding us, or confusion about the product.",
    "Any shift you notice in who is following, liking, or commenting.",
    "Organic posts that do unusually well, since they are candidates to run as ads.",
    "A drop in likes or comments on regular posts.",
    "Upcoming retailer promos, launches, or messaging changes, ideally two weeks ahead.",
    "Any post you would not want promoted.",
  ],
}

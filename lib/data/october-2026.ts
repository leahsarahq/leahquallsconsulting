import raw from "./meta/oct-2026.generated.json"
import septemberRaw from "./meta/exports.generated.json"
import { campaignForAdSet, SEPTEMBER_KPI_DATA } from "./september-2026"
import type { AdData, Campaign, KPIData, OverviewAnalysis, TestArm, TestingContext, WeeklyFollows } from "./types"

// October 2026 — MONTH TO DATE (Oct 1–22). Computed from the Meta Ads Manager
// exports in data/meta/oct-2026/ (parsed by scripts/build-meta-data.mjs), using the
// same metric definitions as September:
//   Engagement CPF  = Engagement spend ÷ Engagement Instagram follows
//   Blended CPF     = total spend ÷ total follows (Instagram Insights), same window
//   Visit-to-follow = Instagram follows ÷ Instagram profile visits
// No Awareness campaign ran in October. The Instagram Insights "Follows" export
// covers Oct 1–20, two days behind the ad exports.

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

export const OCTOBER_LAST_AD_DAY = 22
const IG_LAST_DAY = 20

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

// ── Instagram Insights daily follows (Oct 1–20) ──────────────────────────────
export const OCTOBER_IG_DAILY_FOLLOWS = [
  64, 69, 92, 78, 53, 57, 52, 41, 39, 39, 35, 33, 42, 25, 54, 39, 149, 157, 101, 83,
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
// October runs on much less daily spend, so totals understate it. These rates
// normalise for spend and days elapsed. Each IG-based rate uses the IG window.
export interface SpendAdjustedMetric {
  label: string
  october: string
  september: string
  better: boolean
  note: string
}

const SEPTEMBER_DAYS = 30
const septSpendPerDay = SEPTEMBER_KPI_DATA.totalSpend / SEPTEMBER_DAYS
const octSpendPerDay = all.spend / OCTOBER_LAST_AD_DAY
const septFollowsPer100 = (SEPTEMBER_KPI_DATA.followerGrowth / SEPTEMBER_KPI_DATA.totalSpend) * 100
const octFollowsPer100 = (igTotal / allThroughIg.spend) * 100
const septOrganicShare =
  (SEPTEMBER_KPI_DATA.followerGrowth - SEPTEMBER_KPI_DATA.paidFollows) / SEPTEMBER_KPI_DATA.followerGrowth
const octOrganicShare = organicFollows / igTotal
const adjSeptFollowsPerDay = SEPTEMBER_KPI_DATA.followerGrowth / SEPTEMBER_DAYS
const adjOctFollowsPerDay = igTotal / IG_LAST_DAY

export const OCTOBER_SPEND_ADJUSTED: {
  summary: string
  metrics: SpendAdjustedMetric[]
  reachNote: string
} = {
  summary: `October is spending ${money0(octSpendPerDay)}/day against September's ${money0(septSpendPerDay)}/day (${Math.round((1 - octSpendPerDay / septSpendPerDay) * 100)}% less), so totals look smaller by design. Adjusted for spend, follower acquisition is more efficient.`,
  metrics: [
    {
      label: "Follows per $100",
      october: octFollowsPer100.toFixed(0),
      september: septFollowsPer100.toFixed(0),
      better: octFollowsPer100 > septFollowsPer100,
      note: "all follows ÷ all ad spend",
    },
    {
      label: "Daily ad spend",
      october: money0(octSpendPerDay),
      september: money0(septSpendPerDay),
      better: octSpendPerDay < septSpendPerDay,
      note: `Oct 1–${OCTOBER_LAST_AD_DAY} vs full September`,
    },
    {
      label: "Non-ad share of follows",
      october: `${Math.round(octOrganicShare * 100)}%`,
      september: `${Math.round(septOrganicShare * 100)}%`,
      better: octOrganicShare > septOrganicShare,
      note: "follows with no direct ad attribution",
    },
    {
      label: "Follows per day",
      october: adjOctFollowsPerDay.toFixed(0),
      september: adjSeptFollowsPerDay.toFixed(0),
      better: adjOctFollowsPerDay > adjSeptFollowsPerDay,
      note: `on ${Math.round((1 - octSpendPerDay / septSpendPerDay) * 100)}% less daily spend`,
    },
  ],
  reachNote:
    "Reach and impressions aren't spend-adjusted here: the drop comes from campaign mix (no Awareness spend, smaller Retailer Support), not efficiency. Engagement CPF is also excluded, since it rose despite lower Engagement spend.",
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
  { label: "Oct 22", from: 22, to: 22 },
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
    verdict: `The recipe and cooking audience is the most efficient so far at ${money(broadArm.cpf ?? 0)} per follow and ${pct1(broadArm.followRate / 100)} visit-to-follow. The 18–34 audience lands at ${money(youngArm.cpf ?? 0)}, but that blends a weak start with a strong finish: before Oct ${YOUNG_SWITCH_DAY} it ran ${money(youngBeforeSwitch.spend / youngBeforeSwitch.follows)} per follow, and since moving onto "Frozen Pasta Can't Be That Good" it has run ${money(youngAfterSwitch.spend / youngAfterSwitch.follows)}. The lookalike audience is the costliest at ${money(lookalikeArm.cpf ?? 0)}.`,
  },
  notes: [
    cacio && {
      title: "Cacio e Pepe Puffs",
      dateRange: ran(cacio),
      spend: round2(cacio.spend),
      status: "Paused",
      detail: `Strong clicks but few profile visitors followed (${pct1(cacio.follows / cacio.visits)}), the same pattern as its September run. Paused on Oct ${day(cacio.last)}.`,
    },
    corn && {
      title: "Corn Ravioli",
      dateRange: ran(corn),
      spend: round2(corn.spend),
      status: "Paused",
      detail: `${int(corn.follows)} follows at ${money(corn.spend / corn.follows)} each and a ${pct1(corn.follows / corn.visits)} visit-to-follow rate, below the 20% goal.`,
    },
    pastaDinners && {
      title: "4 Easy Pasta Dinners",
      dateRange: ran(pastaDinners),
      spend: round2(pastaDinners.spend),
      status: "Short run",
      detail: `Two-day run with ${int(pastaDinners.follows)} follows. Too little spend to judge.`,
    },
  ].filter((n): n is NonNullable<typeof n> => !!n),
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
const latestWeek = engagementWeeks[2]
const latestWeekCpf = latestWeek.t.spend / latestWeek.t.follows
const latestWeekVtf = latestWeek.t.follows / latestWeek.t.visits
const projectedPaidFollows = (engagement.follows / OCTOBER_LAST_AD_DAY) * 31

export const OCTOBER_OVERVIEW_ANALYSIS: OverviewAnalysis = {
  executiveSummary: `Through Oct ${OCTOBER_LAST_AD_DAY}, the Engagement campaign has added ${int(engagement.follows)} followers at ${money(engagementCPF)} each, on pace for about ${int(Math.round(projectedPaidFollows / 50) * 50)} ad-attributed follows by month end. Instagram Insights counts ${int(igTotal)} total follows through Oct ${IG_LAST_DAY}, against ${int(allThroughIg.follows)} from ads over the same days, so about ${int(organicFollows)} came without a direct ad click, with a large jump on Oct 17–19. Week two was the weak spot (${money(engagementWeeks[1].t.spend / engagementWeeks[1].t.follows)} per follow) while "Cacio e Pepe Puffs" and "Corn Ravioli" were in rotation. After they were paused, the Oct 15–21 week hit ${money(latestWeekCpf)} per follow and ${pct1(latestWeekVtf)} visit-to-follow, right at both October goals. "${topAd.name}" remains the top ad with ${int(topAd.follows)} follows.`,
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
  monthChange: {
    priorLabel: "September",
    currentLabel: `Oct 1–${OCTOBER_LAST_AD_DAY}`,
    rows: [
      { metric: "Cost per follow (goal: about $2.00)", prior: money(sepCpf), current: money(engagementCPF), change: change(engagementCPF, sepCpf), dir: engagementCPF <= sepCpf ? "good" : "bad" },
      { metric: "Visit-to-follow (goal: 20%+)", prior: pct1(sepVtf), current: pct1(octVtf), change: change(octVtf, sepVtf), dir: octVtf >= sepVtf ? "good" : "bad" },
      { metric: "Ad follows per day", prior: sepFollowsPerDay.toFixed(1), current: octFollowsPerDay.toFixed(1), change: change(octFollowsPerDay, sepFollowsPerDay), dir: octFollowsPerDay >= sepFollowsPerDay ? "good" : "bad" },
      { metric: "Engagement CTR", prior: `${SEPTEMBER_KPI_DATA.engagementCTR.toFixed(2)}%`, current: `${OCTOBER_KPI_DATA.engagementCTR.toFixed(2)}%`, change: change(OCTOBER_KPI_DATA.engagementCTR, SEPTEMBER_KPI_DATA.engagementCTR), dir: "neutral" },
    ],
    explanation: `October is compared on rates rather than totals because the month is ${OCTOBER_LAST_AD_DAY} days in. Month to date, cost per follow and visit-to-follow are both a little behind September, and almost all of the gap comes from Oct 8–14. That week spent heavily on "Cacio e Pepe Puffs" and "Corn Ravioli", which drew profile visits but converted only ${pct1(((cacio?.follows ?? 0) + (corn?.follows ?? 0)) / ((cacio?.visits ?? 0) + (corn?.visits ?? 1)))} of them. With both paused and spend back on "${topAd.name}", the latest full week is the best of the month.`,
    caveat: `Instagram Insights follows run through Oct ${IG_LAST_DAY}; ad data runs through Oct ${OCTOBER_LAST_AD_DAY}. Total follows, blended CPF and organic lift use Oct 1–${IG_LAST_DAY} for both.`,
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
    caption: `"${topAd.name}" converts ${pct1(topAd.follows / topAd.visits)} of profile visitors, about double "Did You Know" and three to five times the paused creatives. Oct 22 is a single day of data.`,
  },
}

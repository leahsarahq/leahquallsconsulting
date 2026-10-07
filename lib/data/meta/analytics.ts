// Every September and Jul–Sep number shown on the dashboard is computed here from
// the parsed Meta exports (see scripts/build-meta-data.mjs). Nothing is hardcoded.
import raw from "./exports.generated.json"

export interface ExportRow {
  start: string
  end: string
  name: string
  dim: string | null
  delivery: string
  budget: number
  spend: number
  impressions: number
  visits: number
  follows: number
}

interface MetaExports {
  adsetDaily: ExportRow[]
  adDaily: ExportRow[]
  adsetByAge: ExportRow[]
  adByAge: ExportRow[]
  adsetByPlatform: ExportRow[]
  adByPlatform: ExportRow[]
}

const EXPORTS = raw as MetaExports

export interface Totals {
  spend: number
  impressions: number
  visits: number
  follows: number
}

const empty = (): Totals => ({ spend: 0, impressions: 0, visits: 0, follows: 0 })

function add(t: Totals, r: Totals) {
  t.spend += r.spend
  t.impressions += r.impressions
  t.visits += r.visits
  t.follows += r.follows
}

function sum(rows: Totals[]): Totals {
  const t = empty()
  rows.forEach((r) => add(t, r))
  return t
}

/** Spend ÷ Instagram follows. Null when there are no follows (render as "—"). */
export const cpf = (t: Totals) => (t.follows > 0 ? t.spend / t.follows : null)
/** Instagram follows ÷ Instagram profile visits. */
export const followRate = (t: Totals) => (t.visits > 0 ? t.follows / t.visits : null)
export const cpm = (t: Totals) => (t.impressions > 0 ? (t.spend / t.impressions) * 1000 : null)

/** The follower-growth campaign is the two ad sets whose names start with "Existing Posts". */
export const isFollowerGrowthAdSet = (name: string) => name.startsWith("Existing Posts")

// The ad-level exports have no ad set column, so ads are tied to the follower-growth
// campaign through the ad set budget value that only follower-growth ad sets use.
const FOLLOWER_GROWTH_BUDGETS = (() => {
  const all = [...EXPORTS.adsetByPlatform, ...EXPORTS.adsetByAge, ...EXPORTS.adsetDaily]
  const fg = new Set(all.filter((r) => isFollowerGrowthAdSet(r.name)).map((r) => r.budget))
  all.filter((r) => !isFollowerGrowthAdSet(r.name)).forEach((r) => fg.delete(r.budget))
  return fg
})()

export const isFollowerGrowthAd = (row: ExportRow) => FOLLOWER_GROWTH_BUDGETS.has(row.budget)

function groupBy(rows: ExportRow[], key: (r: ExportRow) => string) {
  const map = new Map<string, ExportRow[]>()
  rows.forEach((r) => {
    const k = key(r)
    const list = map.get(k)
    if (list) list.push(r)
    else map.set(k, [r])
  })
  return map
}

const isActive = (r: ExportRow) => r.spend > 0 || r.impressions > 0
const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}
const dayOfMonth = (iso: string) => Number(iso.slice(8, 10))

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })

// ── September close-out ──────────────────────────────────────────────────────

export interface AdSetRow extends Totals {
  name: string
  followerGrowth: boolean
}

export interface AdRow extends Totals {
  name: string
  followerGrowth: boolean
  firstActive: string | null
  lastActive: string | null
  retired: boolean
}

function buildSeptemberCloseout() {
  const dates = [...new Set(EXPORTS.adsetDaily.map((r) => r.start))].sort()
  const firstDate = dates[0]
  const lastDate = dates[dates.length - 1]
  const present = new Set(dates)
  const missingDates: string[] = []
  for (let d = firstDate; d < lastDate; d = addDays(d, 1)) if (!present.has(d)) missingDates.push(d)

  const fgRows = EXPORTS.adsetDaily.filter((r) => isFollowerGrowthAdSet(r.name))
  const retailRows = EXPORTS.adsetDaily.filter((r) => !isFollowerGrowthAdSet(r.name))

  // Fed into the shared Progress-tab logic. Retail & awareness spend is kept as a
  // separate campaign key with zero follows so it never enters follower metrics.
  const progressDaily: Record<string, Record<string, { spend: number; follows: number }>> = {}
  dates.forEach((d) => {
    const fg = sum(fgRows.filter((r) => r.start === d))
    const rt = sum(retailRows.filter((r) => r.start === d))
    progressDaily[d] = {
      "Engagement Campaign": { spend: fg.spend, follows: fg.follows },
      "Retail & Awareness": { spend: rt.spend, follows: 0 },
    }
  })

  const adSets: AdSetRow[] = [...groupBy(EXPORTS.adsetDaily, (r) => r.name)]
    .map(([name, rows]) => ({ name, followerGrowth: isFollowerGrowthAdSet(name), ...sum(rows) }))
    .sort((a, b) => Number(b.followerGrowth) - Number(a.followerGrowth) || b.follows - a.follows || b.spend - a.spend)

  const ads: AdRow[] = [...groupBy(EXPORTS.adDaily, (r) => r.name)]
    .map(([name, rows]) => {
      const active = rows.filter(isActive).map((r) => r.start).sort()
      const lastActive = active.length ? active[active.length - 1] : null
      return {
        name,
        followerGrowth: rows.some(isFollowerGrowthAd),
        ...sum(rows),
        firstActive: active[0] ?? null,
        lastActive,
        retired: lastActive != null && lastActive < lastDate,
      }
    })
    .sort((a, b) => b.follows - a.follows || b.spend - a.spend)

  return {
    firstDate,
    lastDate,
    lastDay: dayOfMonth(lastDate),
    missingDates,
    progressDaily,
    followerGrowth: sum(fgRows),
    retail: sum(retailRows),
    adSets,
    ads,
  }
}

export type SeptemberCloseout = ReturnType<typeof buildSeptemberCloseout>
export const SEPTEMBER_CLOSEOUT: SeptemberCloseout = buildSeptemberCloseout()

// ── Who we're reaching (Jul 1 – Sep 30, 90-day totals) ───────────────────────

export const AGE_BUCKETS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"] as const
export type AgeBucket = (typeof AGE_BUCKETS)[number]
const YOUNG: AgeBucket[] = ["18-24", "25-34"]
const OLDER: AgeBucket[] = ["45-54", "55-64", "65+"]

export interface AgeRow extends Totals {
  age: AgeBucket
  followShare: number
  spendShare: number
}

export interface CreativeAgeRow {
  name: string
  follows: number
  spend: number
  cpf: number | null
  pct18to34: number | null
  pct45plus: number | null
  costPer18to34Follow: number | null
  topThree: boolean
}

export interface PlatformRow extends Totals {
  adSet: string
  platform: "Instagram" | "Facebook"
}

function buildAudienceReach() {
  const fgAge = EXPORTS.adsetByAge.filter((r) => isFollowerGrowthAdSet(r.name))
  const known = fgAge.filter((r) => (AGE_BUCKETS as readonly string[]).includes(r.dim ?? ""))
  const unknown = sum(fgAge.filter((r) => !(AGE_BUCKETS as readonly string[]).includes(r.dim ?? "")))
  const knownTotals = sum(known)

  const ageRows: AgeRow[] = AGE_BUCKETS.map((age) => {
    const t = sum(known.filter((r) => r.dim === age))
    return {
      age,
      ...t,
      followShare: knownTotals.follows > 0 ? t.follows / knownTotals.follows : 0,
      spendShare: knownTotals.spend > 0 ? t.spend / knownTotals.spend : 0,
    }
  })
  const shareOf = (ages: AgeBucket[]) =>
    ageRows.filter((r) => ages.includes(r.age)).reduce((s, r) => s + r.followShare, 0)
  const headline = { young: shareOf(YOUNG), mid: shareOf(["35-44"]), older: shareOf(OLDER) }

  const fgAds = EXPORTS.adByAge.filter(isFollowerGrowthAd)
  const creative = [...groupBy(fgAds, (r) => r.name)]
    .map(([name, rows]) => {
      const total = sum(rows)
      const young = sum(rows.filter((r) => YOUNG.includes(r.dim as AgeBucket)))
      const older = sum(rows.filter((r) => OLDER.includes(r.dim as AgeBucket)))
      return {
        name,
        follows: total.follows,
        spend: total.spend,
        cpf: cpf(total),
        pct18to34: total.follows > 0 ? young.follows / total.follows : null,
        pct45plus: total.follows > 0 ? older.follows / total.follows : null,
        costPer18to34Follow: cpf(young),
        topThree: false,
      }
    })
    .sort((a, b) => b.follows - a.follows)
    .slice(0, 10)
    .sort((a, b) => (b.pct18to34 ?? -1) - (a.pct18to34 ?? -1))
  creative.slice(0, 3).forEach((c) => (c.topThree = true))

  const fgPlatform = EXPORTS.adsetByPlatform.filter((r) => isFollowerGrowthAdSet(r.name))
  const platforms: PlatformRow[] = [...new Set(fgPlatform.map((r) => r.name))].flatMap((adSet) =>
    (["Instagram", "Facebook"] as const).map((platform) => ({
      adSet,
      platform,
      ...sum(fgPlatform.filter((r) => r.name === adSet && r.dim === platform)),
    })),
  )
  const fgPlatformTotal = sum(fgPlatform)
  const instagramSpendShare =
    fgPlatformTotal.spend > 0
      ? sum(fgPlatform.filter((r) => r.dim === "Instagram")).spend / fgPlatformTotal.spend
      : null

  const groups = [
    { label: "18–34", share: headline.young },
    { label: "35–44", share: headline.mid },
    { label: "45+", share: headline.older },
  ].sort((a, b) => b.share - a.share)
  const youngest = creative.find((c) => c.topThree)
  const pct = (v: number) => `${Math.round(v * 100)}%`
  const summary = [
    `${groups[0].label} year-olds make up the largest share of ad-attributed follows (${pct(groups[0].share)}), followed by ${groups[1].label} (${pct(groups[1].share)}) and ${groups[2].label} (${pct(groups[2].share)}).`,
    youngest && youngest.pct18to34 != null
      ? `Of our top ten ads, \u201C${youngest.name}\u201D brings in the youngest followers: ${pct(youngest.pct18to34)} of its follows are 18–34${youngest.costPer18to34Follow != null ? `, at $${youngest.costPer18to34Follow.toFixed(2)} per 18–34 follow` : ""}.`
      : "",
  ].join(" ")

  return { ageRows, unknown, headline, creative, platforms, instagramSpendShare, summary }
}

export type AudienceReach = ReturnType<typeof buildAudienceReach>
export const AUDIENCE_REACH: AudienceReach = buildAudienceReach()

// ── Age trend by month (future) ──────────────────────────────────────────────
// Drop monthly "Ad sets by Age" exports in here (parsed rows, same shape as
// adsetByAge) and the "Age trend by month" card renders a month-by-month view.
export const MONTHLY_AGE_EXPORTS: Record<"Jul" | "Aug" | "Sep", ExportRow[] | null> = {
  Jul: null,
  Aug: null,
  Sep: null,
}

export function getAgeTrend() {
  const months = Object.entries(MONTHLY_AGE_EXPORTS).filter(([, rows]) => rows && rows.length) as [
    string,
    ExportRow[],
  ][]
  if (!months.length) return null
  return months.map(([month, rows]) => {
    const fg = rows.filter((r) => isFollowerGrowthAdSet(r.name))
    const total = sum(fg.filter((r) => (AGE_BUCKETS as readonly string[]).includes(r.dim ?? ""))).follows
    return {
      month,
      shares: AGE_BUCKETS.map((age) => ({
        age,
        share: total > 0 ? sum(fg.filter((r) => r.dim === age)).follows / total : 0,
      })),
    }
  })
}

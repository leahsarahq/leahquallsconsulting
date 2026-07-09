// Week-by-week progress tracking for an in-progress month.
// Builds weekly buckets and a cumulative day-by-day series so the current month
// can be compared against the previous month's pace at the same point in time.

export type DailyData = Record<string, Record<string, { spend: number; follows: number }>>
type IgDaily = { date: string; follows: number }[]

const ENGAGEMENT = "Engagement Campaign"

export interface WeekProgress {
  label: string
  /** Inclusive day-of-month range, e.g. "1–7". */
  range: string
  startDay: number
  endDay: number
  totalSpend: number
  engagementSpend: number
  paidFollows: number
  /** Engagement-campaign cost per follow (spend that drove follows ÷ follows). */
  cpf: number | null
  /** True when the week extends past the last day of imported data. */
  partial: boolean
}

export interface PacePoint {
  day: number
  /** Cumulative ad-attributed follows for the current month at this day. */
  current: number | null
  /** Cumulative follows for the previous month at the same day-of-month. */
  previous: number | null
  /** Average cumulative follows across all prior months at the same day-of-month. */
  average: number | null
  currentSpend: number | null
  previousSpend: number | null
  /** Cumulative total follower growth (IG Insights) at this day, if available. */
  igTotal: number | null
}

export interface MonthProgress {
  daysElapsed: number
  daysInMonth: number
  pctElapsed: number
  // Month-to-date totals
  mtdSpend: number
  mtdFollows: number
  mtdEngagementSpend: number
  engagementCPF: number | null
  // Run-rate projections to end of month (ad-attributed)
  projectedFollows: number
  projectedSpend: number
  // Total follower growth from IG Insights (organic + paid), if available.
  igAvailable: boolean
  igMtdFollows: number | null
  igDaysElapsed: number
  igProjectedFollows: number | null
  // Pace vs previous month
  prevLabel: string
  prevAtSameDayFollows: number | null
  prevFinalFollows: number | null
  /** % current MTD follows are ahead/behind previous month at the same day. */
  paceDeltaPct: number | null
  // Pace vs the average of all prior months
  /** Number of prior months included in the average. */
  avgMonthCount: number
  /** Average cumulative follows across prior months at the current day-of-month. */
  avgAtSameDayFollows: number | null
  /** Average of prior months' full-month final follow totals. */
  avgFinalFollows: number | null
  /** % current MTD follows are ahead/behind the average month at the same day. */
  avgPaceDeltaPct: number | null
  weeks: WeekProgress[]
  series: PacePoint[]
}

function dayOfMonth(dateKey: string): number {
  return parseInt(dateKey.slice(8), 10)
}

/** Sum a single day's follows / spend across all campaigns. */
function dayTotals(day: Record<string, { spend: number; follows: number }>) {
  let follows = 0
  let spend = 0
  for (const c of Object.keys(day)) {
    follows += day[c].follows
    spend += day[c].spend
  }
  return { follows, spend }
}

/** Cumulative follows/spend keyed by day-of-month for an entire month. */
function cumulativeSeries(daily: DailyData) {
  const dates = Object.keys(daily).sort()
  const points: { day: number; follows: number; spend: number }[] = []
  let cf = 0
  let cs = 0
  for (const date of dates) {
    const { follows, spend } = dayTotals(daily[date])
    cf += follows
    cs += spend
    points.push({ day: dayOfMonth(date), follows: cf, spend: cs })
  }
  return points
}

/** Cumulative value at-or-before a given day-of-month (handles missing days). */
function valueAtDay(points: { day: number; follows: number; spend: number }[], day: number) {
  let match: { day: number; follows: number; spend: number } | null = null
  for (const p of points) {
    if (p.day <= day) match = p
    else break
  }
  return match
}

export function getMonthProgress(
  daily: DailyData,
  prevDaily: DailyData | undefined,
  daysInMonth: number,
  prevLabel: string,
  igDaily?: IgDaily | null,
  priorDailyList?: DailyData[],
): MonthProgress {
  const dates = Object.keys(daily).sort()
  const daysElapsed = dates.length ? dayOfMonth(dates[dates.length - 1]) : 0
  const pctElapsed = daysInMonth > 0 ? Math.round((daysElapsed / daysInMonth) * 100) : 0

  // MTD totals
  let mtdSpend = 0
  let mtdFollows = 0
  let mtdEngagementSpend = 0
  let mtdEngagementFollows = 0
  for (const date of dates) {
    const { follows, spend } = dayTotals(daily[date])
    mtdSpend += spend
    mtdFollows += follows
    const eng = daily[date][ENGAGEMENT]
    if (eng) {
      mtdEngagementSpend += eng.spend
      mtdEngagementFollows += eng.follows
    }
  }
  const engagementCPF = mtdEngagementFollows > 0 ? mtdEngagementSpend / mtdEngagementFollows : null

  // Run-rate projections
  const factor = daysElapsed > 0 ? daysInMonth / daysElapsed : 0
  const projectedFollows = Math.round(mtdFollows * factor)
  const projectedSpend = Math.round(mtdSpend * factor)

  // Total follower growth from IG Insights (organic + paid). Tracked on its own
  // day count because the IG export can lag the ad export by a day or two.
  const igAvailable = !!(igDaily && igDaily.length)
  let igMtdFollows: number | null = null
  let igDaysElapsed = 0
  let igProjectedFollows: number | null = null
  const igCumByDay = new Map<number, number>()
  if (igAvailable && igDaily) {
    const sorted = [...igDaily].sort((a, b) => a.date.localeCompare(b.date))
    let cum = 0
    for (const d of sorted) {
      cum += d.follows
      igCumByDay.set(dayOfMonth(d.date), cum)
    }
    igMtdFollows = cum
    igDaysElapsed = dayOfMonth(sorted[sorted.length - 1].date)
    const igFactor = igDaysElapsed > 0 ? daysInMonth / igDaysElapsed : 0
    igProjectedFollows = Math.round(cum * igFactor)
  }
  // Carry-forward lookup for IG cumulative at-or-before a given day.
  const igAtDay = (day: number): number | null => {
    if (!igAvailable) return null
    let val: number | null = null
    for (let d = 1; d <= day; d++) {
      if (igCumByDay.has(d)) val = igCumByDay.get(d)!
    }
    return val
  }

  // Weekly buckets: 1–7, 8–14, 15–21, 22–end
  const weekDefs: [number, number][] = [
    [1, 7],
    [8, 14],
    [15, 21],
    [22, daysInMonth],
  ]
  const weeks: WeekProgress[] = weekDefs.map(([startDay, endDay]) => {
    let totalSpend = 0
    let engagementSpend = 0
    let paidFollows = 0
    for (const date of dates) {
      const dom = dayOfMonth(date)
      if (dom < startDay || dom > endDay) continue
      const { spend } = dayTotals(daily[date])
      totalSpend += spend
      const eng = daily[date][ENGAGEMENT]
      if (eng) {
        engagementSpend += eng.spend
        paidFollows += eng.follows
      }
    }
    return {
      label: `Week ${weekDefs.findIndex((w) => w[0] === startDay) + 1}`,
      range: `${startDay}–${endDay}`,
      startDay,
      endDay,
      totalSpend: Math.round(totalSpend),
      engagementSpend: Math.round(engagementSpend),
      paidFollows,
      cpf: paidFollows > 0 ? engagementSpend / paidFollows : null,
      partial: endDay > daysElapsed,
    }
  })

  // Cumulative pace series — align current vs previous month by day-of-month
  const currentSeries = cumulativeSeries(daily)
  const prevSeries = prevDaily ? cumulativeSeries(prevDaily) : []

  // Prior-months average: cumulative series for each prior month, averaged by
  // day-of-month across the months that have data at that day.
  const priorSeriesList = (priorDailyList ?? []).map(cumulativeSeries).filter((s) => s.length)
  const avgMonthCount = priorSeriesList.length
  const avgFollowsAtDay = (day: number): number | null => {
    if (!avgMonthCount) return null
    const vals: number[] = []
    for (const s of priorSeriesList) {
      const m = valueAtDay(s, day)
      if (m) vals.push(m.follows)
    }
    if (!vals.length) return null
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  }

  const series: PacePoint[] = []
  for (let day = 1; day <= daysElapsed; day++) {
    const cur = valueAtDay(currentSeries, day)
    const prev = valueAtDay(prevSeries, day)
    series.push({
      day,
      current: cur ? cur.follows : null,
      previous: prev ? prev.follows : null,
      average: avgFollowsAtDay(day),
      currentSpend: cur ? Math.round(cur.spend) : null,
      previousSpend: prev ? Math.round(prev.spend) : null,
      igTotal: day <= igDaysElapsed ? igAtDay(day) : null,
    })
  }

  const prevAtSameDay = prevSeries.length ? valueAtDay(prevSeries, daysElapsed) : null
  const prevAtSameDayFollows = prevAtSameDay ? prevAtSameDay.follows : null
  const prevFinalFollows = prevSeries.length ? prevSeries[prevSeries.length - 1].follows : null
  const paceDeltaPct =
    prevAtSameDayFollows && prevAtSameDayFollows > 0
      ? Math.round(((mtdFollows - prevAtSameDayFollows) / prevAtSameDayFollows) * 100)
      : null

  // Average-month pace: compare MTD follows to the prior-month average at the same day.
  const avgAtSameDayFollows = avgFollowsAtDay(daysElapsed)
  const avgFinalFollows = avgMonthCount
    ? Math.round(
        priorSeriesList.reduce((sum, s) => sum + s[s.length - 1].follows, 0) / avgMonthCount,
      )
    : null
  const avgPaceDeltaPct =
    avgAtSameDayFollows && avgAtSameDayFollows > 0
      ? Math.round(((mtdFollows - avgAtSameDayFollows) / avgAtSameDayFollows) * 100)
      : null

  return {
    daysElapsed,
    daysInMonth,
    pctElapsed,
    mtdSpend: Math.round(mtdSpend),
    mtdFollows,
    mtdEngagementSpend: Math.round(mtdEngagementSpend),
    engagementCPF,
    projectedFollows,
    projectedSpend,
    igAvailable,
    igMtdFollows,
    igDaysElapsed,
    igProjectedFollows,
    prevLabel,
    prevAtSameDayFollows,
    prevFinalFollows,
    paceDeltaPct,
    avgMonthCount,
    avgAtSameDayFollows,
    avgFinalFollows,
    avgPaceDeltaPct,
    weeks,
    series,
  }
}

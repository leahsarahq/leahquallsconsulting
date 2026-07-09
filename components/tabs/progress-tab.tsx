"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { ChartSection } from "@/components/chart-section"
import { getDataForMonth } from "@/lib/data"
import { getMonthProgress } from "@/lib/data/progress"
import { useMonth } from "@/lib/month-context"

type ViewMode = "trend" | "pace" | "avgPace"

const CURRENT_COLOR = "#D93732"
const PREVIOUS_COLOR = "#660033"
const ACCENT_COLOR = "#E8853A"
const AVERAGE_COLOR = "#8A8175"

function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: React.ReactNode
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  )
}

// Horizontal percentage bar for ranked lists (countries, cities).
function PercentBar({ label, pct, max }: { label: string; pct: number; max: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-28 shrink-0 truncate text-muted-foreground" title={label}>
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${max > 0 ? (pct / max) * 100 : 0}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right tabular-nums text-foreground">{pct}%</span>
    </div>
  )
}

export function ProgressTab() {
  const { selectedMonth, monthInfo } = useMonth()
  const { dailyData, previousMonth, priorMonthsDaily, igDailyFollows, demographics } = getDataForMonth(selectedMonth)
  const [view, setView] = useState<ViewMode>("trend")

  const prevLabel = previousMonth?.label ?? "last month"
  const progress = getMonthProgress(
    dailyData,
    previousMonth?.dailyData,
    monthInfo.daysInMonth,
    prevLabel,
    igDailyFollows,
    priorMonthsDaily,
  )

  const pace = view === "pace" || view === "avgPace"
  const isAvg = view === "avgPace"
  const {
    daysElapsed,
    daysInMonth,
    pctElapsed,
    mtdSpend,
    mtdFollows,
    engagementCPF,
    projectedFollows,
    projectedSpend,
    igAvailable,
    igMtdFollows,
    igDaysElapsed,
    igProjectedFollows,
    prevAtSameDayFollows,
    prevFinalFollows,
    paceDeltaPct,
    avgMonthCount,
    avgAtSameDayFollows,
    avgFinalFollows,
    avgPaceDeltaPct,
    weeks,
    series,
  } = progress

  // Comparison values depend on which pace view is active (previous month vs. average).
  const compLabel = isAvg ? "the average month" : `${prevLabel}`
  const compAtSameDay = isAvg ? avgAtSameDayFollows : prevAtSameDayFollows
  const compFinal = isAvg ? avgFinalFollows : prevFinalFollows
  const compDelta = isAvg ? avgPaceDeltaPct : paceDeltaPct

  // Cumulative chart data
  const cumulativeData = series.map((p) => ({
    day: `${monthInfo.label.slice(0, 3)} ${p.day}`,
    current: p.current,
    previous: p.previous,
    average: p.average,
    igTotal: p.igTotal,
  }))

  // Weekly bar chart data (only weeks with activity)
  const weekChartData = weeks
    .filter((w) => w.startDay <= daysElapsed)
    .map((w) => ({
      name: w.label,
      follows: w.paidFollows,
      spend: w.totalSpend,
    }))

  const aheadOfPace = compDelta != null && compDelta >= 0

  return (
    <div className="space-y-4">
      {/* In-progress header */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <h3 className="text-sm font-semibold text-foreground">{monthInfo.label} — in progress</h3>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Day {daysElapsed} of {daysInMonth} · {pctElapsed}% elapsed
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${pctElapsed}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 italic">
          {igAvailable
            ? `Follower growth from IG Insights (organic + paid) through day ${igDaysElapsed}; ad spend & ad-attributed follows through day ${daysElapsed}.`
            : `Month-to-date, ad-attributed follows only — organic / IG Insights follows for ${monthInfo.label} not yet imported.`}
        </p>
      </div>

      {/* MTD stat row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          label="Follower growth"
          value={igAvailable && igMtdFollows != null ? `+${igMtdFollows.toLocaleString()}` : `+${mtdFollows.toLocaleString()}`}
          sub={igAvailable ? `IG total · ${mtdFollows.toLocaleString()} ad-attributed` : "ad-attributed"}
        />
        <StatCard label="MTD spend" value={`$${mtdSpend.toLocaleString()}`} sub={`through day ${daysElapsed}`} />
        <StatCard
          label="Engagement CPF"
          value={engagementCPF != null ? `$${engagementCPF.toFixed(2)}` : "—"}
          sub="follow-driving campaign"
        />
        <StatCard
          label="Blended CPF"
          value={igAvailable && igMtdFollows ? `$${(mtdSpend / igMtdFollows).toFixed(2)}` : "—"}
          sub="all spend ÷ total follows"
        />
        <StatCard
          label={`Projected ${monthInfo.label.slice(0, 3)} total`}
          value={`~${(igAvailable && igProjectedFollows != null ? igProjectedFollows : projectedFollows).toLocaleString()}`}
          sub={`follows · ~$${projectedSpend.toLocaleString()} spend (run-rate)`}
        />
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setView("trend")}
          className={`text-[13px] px-4 py-1.5 rounded-lg border transition-colors ${
            view === "trend"
              ? "bg-primary text-primary-foreground border-primary font-medium"
              : "bg-card text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
          }`}
        >
          Weekly trend
        </button>
        <button
          onClick={() => setView("pace")}
          className={`text-[13px] px-4 py-1.5 rounded-lg border transition-colors ${
            view === "pace"
              ? "bg-primary text-primary-foreground border-primary font-medium"
              : "bg-card text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
          }`}
        >
          vs. {prevLabel}&apos;s pace
        </button>
        {avgMonthCount >= 2 && (
          <button
            onClick={() => setView("avgPace")}
            className={`text-[13px] px-4 py-1.5 rounded-lg border transition-colors ${
              view === "avgPace"
                ? "bg-primary text-primary-foreground border-primary font-medium"
                : "bg-card text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
            }`}
          >
            vs. average pace
          </button>
        )}
      </div>

      {/* Pace callout */}
      {pace && (
        <div
          className={`rounded-xl border p-4 ${
            aheadOfPace ? "border-green-600/30 bg-green-50" : "border-red-600/30 bg-red-50"
          }`}
        >
          {compDelta != null && compAtSameDay != null ? (
            <>
              <p className="text-sm font-medium text-foreground">
                {aheadOfPace ? "Ahead of" : "Behind"} {compLabel}&apos;s pace by{" "}
                <span className={aheadOfPace ? "text-green-700" : "text-red-700"}>
                  {Math.abs(compDelta)}%
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {mtdFollows.toLocaleString()} follows so far vs. {compAtSameDay.toLocaleString()}{" "}
                {isAvg
                  ? `the average of the last ${avgMonthCount} months had by day ${daysElapsed}`
                  : `that ${prevLabel} had by day ${daysElapsed}`}
                .
                {compFinal != null && (
                  <>
                    {" "}
                    {isAvg ? "Those months averaged" : `${prevLabel} finished with`}{" "}
                    {compFinal.toLocaleString()} attributed follows{isAvg ? " per month" : ""}.
                  </>
                )}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No comparable data available for this point in the month.
            </p>
          )}
        </div>
      )}

      {/* Cumulative chart */}
      <ChartSection
        title="Cumulative follows"
        subtitle={
          pace
            ? isAvg
              ? `${monthInfo.label} month-to-date vs. the ${avgMonthCount}-month average at the same day-of-month (ad-attributed)`
              : `${monthInfo.label} month-to-date vs. ${prevLabel} at the same day-of-month (ad-attributed)`
            : igAvailable
              ? `${monthInfo.label} building day by day — total IG growth vs. ad-attributed`
              : `${monthInfo.label} building day by day (ad-attributed follows)`
        }
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeData} margin={{ top: 5, right: 8, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e4da" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 9, fill: "#888" }}
                axisLine={false}
                tickLine={false}
                interval={2}
                angle={-45}
                textAnchor="end"
                height={48}
              />
              <YAxis tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fbf9f4",
                  border: "1px solid #e0ddd4",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              {pace && (
                <Line
                  type="monotone"
                  dataKey={isAvg ? "average" : "previous"}
                  name={isAvg ? `${avgMonthCount}-mo average` : prevLabel}
                  stroke={isAvg ? AVERAGE_COLOR : PREVIOUS_COLOR}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                />
              )}
              {!pace && igAvailable && (
                <Line
                  type="monotone"
                  dataKey="igTotal"
                  name="Total (IG)"
                  stroke={ACCENT_COLOR}
                  strokeWidth={2.5}
                  dot={false}
                  connectNulls
                />
              )}
              <Line
                type="monotone"
                dataKey="current"
                name={pace ? monthInfo.label : "Ad-attributed"}
                stroke={CURRENT_COLOR}
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-3">
          {!pace && igAvailable && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: ACCENT_COLOR }} />
              Total follower growth (IG)
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CURRENT_COLOR }} />
            {pace ? `${monthInfo.label} (MTD)` : "Ad-attributed"}
          </span>
          {pace && (
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: isAvg ? AVERAGE_COLOR : PREVIOUS_COLOR }}
              />
              {isAvg ? `${avgMonthCount}-month average` : prevLabel} (same day-of-month)
            </span>
          )}
        </div>
      </ChartSection>

      {/* Weekly breakdown cards */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Week-by-week breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {weeks.map((w) => {
            const reached = w.startDay <= daysElapsed
            return (
              <div
                key={w.label}
                className={`rounded-xl border p-3 ${
                  reached ? "bg-card border-border" : "bg-muted/30 border-border/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{w.label}</p>
                  {w.partial && reached && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      In progress
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {monthInfo.label.slice(0, 3)} {w.range}
                </p>
                {reached ? (
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-muted-foreground">Follows</span>
                      <span className="text-sm font-semibold">{w.paidFollows.toLocaleString()}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-muted-foreground">Spend</span>
                      <span className="text-sm">${w.totalSpend.toLocaleString()}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-muted-foreground">CPF</span>
                      <span className="text-sm">{w.cpf != null ? `$${w.cpf.toFixed(2)}` : "—"}</span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-[11px] text-muted-foreground italic">Not started</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Weekly follows + spend bar chart */}
      <ChartSection title="Weekly follows & spend" subtitle={`${monthInfo.label} · paid follows and total spend per week`}>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekChartData} margin={{ top: 5, right: 8, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e4da" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fbf9f4",
                  border: "1px solid #e0ddd4",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="follows" name="Paid follows" fill={CURRENT_COLOR} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          Follows are engagement-campaign attributed. Spend shown per week:{" "}
          {weekChartData.map((w, i) => (
            <span key={w.name}>
              {i > 0 && " · "}
              {w.name} ${w.spend.toLocaleString()}
            </span>
          ))}
        </p>
      </ChartSection>

      {/* Audience demographics */}
      {demographics && (
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <h3 className="text-sm font-semibold text-foreground">Who you&apos;re reaching</h3>
            <span className="text-[11px] text-muted-foreground">IG Insights · {demographics.asOf}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Age & gender */}
            <div className="bg-card border border-border rounded-xl p-4 lg:col-span-1">
              {(() => {
                const women = demographics.ageGender.reduce((s, a) => s + a.women, 0)
                const men = demographics.ageGender.reduce((s, a) => s + a.men, 0)
                return (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-foreground">Age &amp; gender</p>
                      <p className="text-[11px] text-muted-foreground">
                        <span style={{ color: CURRENT_COLOR }}>{Math.round(women)}% women</span>
                        {" · "}
                        <span style={{ color: ACCENT_COLOR }}>{Math.round(men)}% men</span>
                      </p>
                    </div>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={demographics.ageGender}
                          layout="vertical"
                          margin={{ top: 0, right: 8, left: -8, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e8e4da" horizontal={false} />
                          <XAxis
                            type="number"
                            tick={{ fontSize: 9, fill: "#888" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${v}%`}
                          />
                          <YAxis
                            type="category"
                            dataKey="range"
                            tick={{ fontSize: 10, fill: "#888" }}
                            axisLine={false}
                            tickLine={false}
                            width={44}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fbf9f4",
                              border: "1px solid #e0ddd4",
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                            formatter={(value: number, name: string) => [`${value}%`, name]}
                          />
                          <Bar dataKey="women" name="Women" fill={CURRENT_COLOR} radius={[0, 3, 3, 0]} />
                          <Bar dataKey="men" name="Men" fill={ACCENT_COLOR} radius={[0, 3, 3, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Core audience is women 35–44 — your single largest segment.
                    </p>
                  </>
                )
              })()}
            </div>

            {/* Top countries */}
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs font-medium text-foreground mb-3">Top countries</p>
              <div className="space-y-2">
                {demographics.topCountries.slice(0, 6).map((c) => (
                  <PercentBar
                    key={c.name}
                    label={c.name}
                    pct={c.pct}
                    max={demographics.topCountries[0].pct}
                  />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">
                {demographics.topCountries[0].pct}% U.S. — spend is reaching the right market.
              </p>
            </div>

            {/* Top cities */}
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs font-medium text-foreground mb-3">Top cities</p>
              <div className="space-y-2">
                {demographics.topCities.slice(0, 6).map((c) => (
                  <PercentBar key={c.name} label={c.name} pct={c.pct} max={demographics.topCities[0].pct} />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">
                Concentrated in major metros — NY, LA, Chicago lead domestically.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

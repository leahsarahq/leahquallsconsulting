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

type ViewMode = "trend" | "pace"

const CURRENT_COLOR = "#D93732"
const PREVIOUS_COLOR = "#660033"

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

export function ProgressTab() {
  const { selectedMonth, monthInfo } = useMonth()
  const { dailyData, previousMonth } = getDataForMonth(selectedMonth)
  const [view, setView] = useState<ViewMode>("trend")

  const prevLabel = previousMonth?.label ?? "last month"
  const progress = getMonthProgress(
    dailyData,
    previousMonth?.dailyData,
    monthInfo.daysInMonth,
    prevLabel,
  )

  const pace = view === "pace"
  const {
    daysElapsed,
    daysInMonth,
    pctElapsed,
    mtdSpend,
    mtdFollows,
    engagementCPF,
    projectedFollows,
    projectedSpend,
    prevAtSameDayFollows,
    prevFinalFollows,
    paceDeltaPct,
    weeks,
    series,
  } = progress

  // Cumulative chart data
  const cumulativeData = series.map((p) => ({
    day: `${monthInfo.label.slice(0, 3)} ${p.day}`,
    current: p.current,
    previous: p.previous,
  }))

  // Weekly bar chart data (only weeks with activity)
  const weekChartData = weeks
    .filter((w) => w.startDay <= daysElapsed)
    .map((w) => ({
      name: w.label,
      follows: w.paidFollows,
      spend: w.totalSpend,
    }))

  const aheadOfPace = paceDeltaPct != null && paceDeltaPct >= 0

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
          Month-to-date, ad-attributed follows only — organic / IG Insights follows for {monthInfo.label} not yet imported.
        </p>
      </div>

      {/* MTD stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="MTD spend" value={`$${mtdSpend.toLocaleString()}`} sub={`through day ${daysElapsed}`} />
        <StatCard label="MTD follows" value={mtdFollows.toLocaleString()} sub="ad-attributed" />
        <StatCard
          label="Engagement CPF"
          value={engagementCPF != null ? `$${engagementCPF.toFixed(2)}` : "—"}
          sub="follow-driving campaign"
        />
        <StatCard
          label={`Projected ${monthInfo.label.slice(0, 3)} total`}
          value={`~${projectedFollows.toLocaleString()}`}
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
      </div>

      {/* Pace callout */}
      {pace && (
        <div
          className={`rounded-xl border p-4 ${
            aheadOfPace ? "border-green-600/30 bg-green-50" : "border-red-600/30 bg-red-50"
          }`}
        >
          {paceDeltaPct != null && prevAtSameDayFollows != null ? (
            <>
              <p className="text-sm font-medium text-foreground">
                {aheadOfPace ? "Ahead of" : "Behind"} {prevLabel}&apos;s pace by{" "}
                <span className={aheadOfPace ? "text-green-700" : "text-red-700"}>
                  {Math.abs(paceDeltaPct)}%
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {mtdFollows.toLocaleString()} follows so far vs. {prevAtSameDayFollows.toLocaleString()} that{" "}
                {prevLabel} had by day {daysElapsed}.
                {prevFinalFollows != null && (
                  <> {prevLabel} finished with {prevFinalFollows.toLocaleString()} attributed follows.</>
                )}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No comparable {prevLabel} data available for this point in the month.
            </p>
          )}
        </div>
      )}

      {/* Cumulative chart */}
      <ChartSection
        title="Cumulative follows"
        subtitle={
          pace
            ? `${monthInfo.label} month-to-date vs. ${prevLabel} at the same day-of-month`
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
                  dataKey="previous"
                  name={prevLabel}
                  stroke={PREVIOUS_COLOR}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                />
              )}
              <Line
                type="monotone"
                dataKey="current"
                name={monthInfo.label}
                stroke={CURRENT_COLOR}
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CURRENT_COLOR }} />
            {monthInfo.label} (MTD)
          </span>
          {pace && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PREVIOUS_COLOR }} />
              {prevLabel} (same day-of-month)
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
    </div>
  )
}

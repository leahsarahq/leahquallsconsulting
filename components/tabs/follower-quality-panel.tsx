"use client"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { AGE_BUCKETS, AUDIENCE_REACH, type AgeBucket } from "@/lib/data/meta/analytics"
import { pct } from "@/lib/data/meta/format"

interface FollowerQualityInput {
  totalFollowers: number | null
  /** Share of all account followers per age bucket, as fractions (0.12 = 12%). */
  ageDistribution: Record<AgeBucket, number> | null
  accountsEngaged: number | null
  totalInteractions: number | null
}

// Fill these in from Instagram Insights at each month-end.
export const FOLLOWER_QUALITY_INPUTS: Record<string, FollowerQualityInput> = {
  Apr: { totalFollowers: null, ageDistribution: null, accountsEngaged: null, totalInteractions: null },
  May: { totalFollowers: null, ageDistribution: null, accountsEngaged: null, totalInteractions: null },
  Jun: { totalFollowers: null, ageDistribution: null, accountsEngaged: null, totalInteractions: null },
  Jul: { totalFollowers: null, ageDistribution: null, accountsEngaged: null, totalInteractions: null },
  Aug: { totalFollowers: null, ageDistribution: null, accountsEngaged: null, totalInteractions: null },
  Sep: { totalFollowers: null, ageDistribution: null, accountsEngaged: null, totalInteractions: null },
}

function AgeBars({ title, shares }: { title: string; shares: Record<AgeBucket, number> | null }) {
  const max = shares ? Math.max(...AGE_BUCKETS.map((a) => shares[a])) : 0
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-[11px] font-medium text-foreground">{title}</p>
      {shares ? (
        <div className="mt-2 space-y-1.5">
          {AGE_BUCKETS.map((a) => (
            <div key={a} className="flex items-center gap-2 text-xs">
              <span className="w-12 shrink-0 text-muted-foreground">{a}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${max > 0 ? (shares[a] / max) * 100 : 0}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right tabular-nums">{pct(shares[a])}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-muted-foreground">Add the Instagram Insights age split to see this.</p>
      )}
    </div>
  )
}

export function FollowerQualityPanel() {
  const months = Object.entries(FOLLOWER_QUALITY_INPUTS)
  const series = months.map(([month, v]) => ({
    month,
    followers: v.totalFollowers,
    engagementRate:
      v.totalFollowers && v.totalInteractions != null
        ? Math.round((v.totalInteractions / v.totalFollowers) * 1000) / 10
        : null,
  }))
  const hasSeries = series.some((s) => s.followers != null || s.engagementRate != null)
  const latestAge = [...months].reverse().find(([, v]) => v.ageDistribution)?.[1].ageDistribution ?? null
  const adAttributed = Object.fromEntries(AUDIENCE_REACH.ageRows.map((a) => [a.age, a.followShare])) as Record<
    AgeBucket,
    number
  >

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">Follower quality</h3>
      <p className="text-[11px] text-muted-foreground">
        Engagement rate (interactions ÷ followers) and follower count by month, from Instagram Insights.
      </p>

      <div className="mt-3 h-48">
        {hasSeries ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 5, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e4da" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="rate" tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis yAxisId="followers" orientation="right" tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#fbf9f4", border: "1px solid #e0ddd4", borderRadius: "8px", fontSize: "12px" }} />
              <Line yAxisId="rate" dataKey="engagementRate" name="Engagement rate (%)" stroke="#D93732" strokeWidth={2.5} connectNulls />
              <Line yAxisId="followers" dataKey="followers" name="Followers" stroke="#660033" strokeWidth={2} strokeDasharray="5 4" connectNulls />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-4 text-center">
            <p className="text-[11px] text-muted-foreground">
              No Instagram Insights numbers added yet. Fill in total followers and interactions for each month to see
              this chart.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AgeBars title="All account followers" shares={latestAge} />
        <AgeBars title="Ad-attributed follows (Jul–Sep)" shares={adAttributed} />
      </div>

      <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
        If ad-attributed follows skew older than our overall followers, the ads are adding to the older end of the
        audience. Instagram Insights data is still needed to make this comparison.
      </p>
    </section>
  )
}

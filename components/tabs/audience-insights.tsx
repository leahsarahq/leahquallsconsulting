"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartSection } from "@/components/chart-section"
import { int, money } from "@/lib/data/meta/format"
import type { getDataForMonth } from "@/lib/data"

type AudienceInsights = NonNullable<ReturnType<typeof getDataForMonth>["audienceInsights"]>

const AGE_KEYS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"] as const
const AGE_COLORS = ["#F3B3A8", "#E8853A", "#D93732", "#A8263A", "#660033", "#3D0020"]
const pct = (v: number | null | undefined, digits = 0) => (v == null ? "—" : `${(v * 100).toFixed(digits)}%`)

function EmptyNote({ note }: { note: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center">
      <p className="text-xl font-semibold text-foreground">—</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{note}</p>
    </div>
  )
}

function QACard({ qa }: { qa: AudienceInsights["qa"] }) {
  return (
    <ChartSection title="Your questions, answered">
      <dl className="divide-y divide-border/60">
        {qa.map((item) => (
          <div key={item.q} className="py-3 first:pt-1 last:pb-0">
            <dt className="text-sm font-semibold text-foreground text-pretty">{item.q}</dt>
            <dd className="mt-1 text-xs text-muted-foreground leading-relaxed text-pretty">{item.a}</dd>
          </div>
        ))}
      </dl>
    </ChartSection>
  )
}

function AudienceAgeCard({ age }: { age: AudienceInsights["age"] }) {
  const chartData = age.map((r) => ({ age: r.age, share: Math.round(r.share * 1000) / 10 }))
  return (
    <ChartSection
      title="Audience age (Jul–Sep 2026)"
      subtitle="Follower-growth ad sets · 90-day total, not a monthly view"
    >
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="age" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip formatter={(v: number) => [`${v}%`, "Share of follows"]} cursor={{ fill: "hsl(var(--muted))" }} />
            <Bar dataKey="share" fill="#D93732" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] text-muted-foreground uppercase tracking-wide border-b border-border">
              <th className="font-medium py-2 pr-3">Age</th>
              <th className="font-medium py-2 px-3 text-right">Spend</th>
              <th className="font-medium py-2 px-3 text-right">Follows</th>
              <th className="font-medium py-2 px-3 text-right">Cost/Follow</th>
              <th className="font-medium py-2 pl-3 text-right">Follow rate</th>
            </tr>
          </thead>
          <tbody>
            {age.map((r) => (
              <tr key={r.age} className="border-b border-border/60 last:border-0">
                <td className="py-2 pr-3 text-foreground">{r.age}</td>
                <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">{money(r.spend)}</td>
                <td className="py-2 px-3 text-right tabular-nums text-foreground">{int(r.follows)}</td>
                <td className="py-2 px-3 text-right tabular-nums text-foreground font-medium">{money(r.cpf)}</td>
                <td className="py-2 pl-3 text-right tabular-nums text-muted-foreground">{pct(r.followRate, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartSection>
  )
}

function AgeTrendCard({ trend }: { trend: AudienceInsights["ageTrend"] }) {
  return (
    <ChartSection title="Age trend by month" subtitle="Share of follows by age · follower-growth ad sets">
      {!trend ? (
        <EmptyNote note="monthly age data not imported yet" />
      ) : (
        <>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trend.map((row) => ({
                  ...row,
                  ...Object.fromEntries(AGE_KEYS.map((k) => [k, Math.round(Number(row[k]) * 1000) / 10])),
                }))}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
                <Tooltip formatter={(v: number, name: string) => [`${v}%`, name.replace("-", "–")]} />
                <Legend wrapperStyle={{ fontSize: 11 }} formatter={(v: string) => v.replace("-", "–")} />
                {AGE_KEYS.map((k, i) => (
                  <Bar key={k} dataKey={k} stackId="age" fill={AGE_COLORS[i]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {trend.map((row) => (
              <div key={String(row.month)} className="rounded-lg bg-secondary/50 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{row.month}</p>
                <p className="mt-1 text-xs text-foreground">
                  18–34: <span className="font-semibold tabular-nums">{pct(Number(row.young))}</span>
                </p>
                <p className="text-xs text-foreground">
                  45+: <span className="font-semibold tabular-nums">{pct(Number(row.older))}</span>
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </ChartSection>
  )
}

function FollowerQualityCard({ inputs }: { inputs: AudienceInsights["followerQuality"] }) {
  const rows = inputs.map((m) => ({
    month: m.month,
    followers: m.followers,
    engagementRate:
      m.followers && m.interactions != null ? Math.round((m.interactions / m.followers) * 1000) / 10 : null,
  }))
  const hasAny = rows.some((r) => r.followers != null || r.engagementRate != null)

  return (
    <ChartSection
      title="Follower quality"
      subtitle="Engagement rate (post interactions ÷ followers) next to follower count · Apr–Sep"
    >
      {hasAny && (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="rate" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
              <YAxis yAxisId="followers" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="rate" dataKey="engagementRate" name="Engagement rate" stroke="#D93732" strokeWidth={2} />
              <Line yAxisId="followers" dataKey="followers" name="Followers" stroke="#660033" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className={`grid grid-cols-3 gap-2 sm:grid-cols-6 ${hasAny ? "mt-3" : ""}`}>
        {rows.map((r) => (
          <div key={r.month} className="rounded-lg bg-secondary/50 p-2.5">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{r.month}</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground tabular-nums">
              {r.engagementRate != null ? `${r.engagementRate}%` : "—"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {r.followers != null ? `${int(r.followers)} followers` : "not imported this month"}
            </p>
          </div>
        ))}
      </div>
    </ChartSection>
  )
}

export function AudienceInsights({ insights }: { insights: AudienceInsights }) {
  return (
    <>
      <QACard qa={insights.qa} />
      <AudienceAgeCard age={insights.age} />
      <AgeTrendCard trend={insights.ageTrend} />
      <FollowerQualityCard inputs={insights.followerQuality} />
    </>
  )
}

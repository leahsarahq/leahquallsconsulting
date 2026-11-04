"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartSection } from "@/components/chart-section"
import type { AgeShift } from "@/lib/data/types"

const SEGMENTS = [
  { key: "young", label: "18–34", color: "#D93732" },
  { key: "mid", label: "35–44", color: "#F3B3A8" },
  { key: "older", label: "45+", color: "#660033" },
] as const

const share = (part: number, whole: number) => (whole > 0 ? (part / whole) * 100 : 0)
const pct = (v: number) => `${v.toFixed(1)}%`

export function AgeShiftCard({ ageShift }: { ageShift: AgeShift }) {
  const rows = ageShift.months.map((m) => {
    const total = m.young + m.mid + m.older
    return {
      ...m,
      total,
      youngShare: share(m.young, total),
      youngSpendShare: share(m.youngSpend, m.totalSpend),
      youngCpf: m.young > 0 ? m.youngSpend / m.young : 0,
      chart: {
        month: m.month,
        young: Math.round(share(m.young, total) * 10) / 10,
        mid: Math.round(share(m.mid, total) * 10) / 10,
        older: Math.round(share(m.older, total) * 10) / 10,
      },
    }
  })
  const first = rows[0]
  const prev = rows[rows.length - 2]
  const last = rows[rows.length - 1]
  const vsPrev = last.youngShare - prev.youngShare
  const vsFirst = last.youngShare - first.youngShare
  const { callout } = ageShift

  return (
    <ChartSection
      title={`Age mix of new followers since ${first.month}`}
      subtitle={
        <>
          {ageShift.goal}
          {ageShift.goalMet && (
            <>
              {" "}
              <span className="font-semibold text-green-600">Met:</span> {ageShift.goalMet}
            </>
          )}
        </>
      }
    >
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label={`18–34 share · ${last.month}`} value={pct(last.youngShare)} />
        <Stat label={`vs ${prev.month}`} value={`${vsPrev >= 0 ? "+" : ""}${vsPrev.toFixed(1)} pts`} />
        <Stat label={`vs ${first.month}`} value={`${vsFirst >= 0 ? "+" : ""}${vsFirst.toFixed(1)} pts`} />
      </div>

      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows.map((r) => r.chart)} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {SEGMENTS.map((s) => (
              <Bar key={s.key} dataKey={s.key} name={s.label} stackId="age" fill={s.color} activeBar={false} isAnimationActive={false} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Month</th>
              <th className="px-3 py-2 text-right font-medium">Paid follows</th>
              <th className="px-3 py-2 text-right font-medium">18–34 follows</th>
              <th className="px-3 py-2 text-right font-medium">18–34 share</th>
              <th className="px-3 py-2 text-right font-medium">Spend on 18–34</th>
              <th className="py-2 pl-3 text-right font-medium">18–34 CPF</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.month} className="border-b border-border/60 last:border-0">
                <td className="py-2 pr-3 text-foreground">{r.month}</td>
                <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{r.total.toLocaleString()}</td>
                <td className="px-3 py-2 text-right tabular-nums text-foreground">{r.young.toLocaleString()}</td>
                <td className="px-3 py-2 text-right font-medium tabular-nums text-foreground">{pct(r.youngShare)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{pct(r.youngSpendShare)}</td>
                <td className="py-2 pl-3 text-right tabular-nums text-foreground">${r.youngCpf.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-lg bg-secondary/40 p-3">
        <p className="text-sm font-medium text-foreground">{callout.label}</p>
        <p className="mt-1 text-xs leading-relaxed text-foreground/80">
          {callout.detail ?? (
            <>
              {pct(share(callout.youngFollows, callout.totalFollows))} of its follows were 18–34 ({callout.youngFollows} of{" "}
              {callout.totalFollows}) · {pct(share(callout.youngSpend, callout.totalSpend))} of its spend reached 18–34
            </>
          )}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{ageShift.read}</p>
    </ChartSection>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  )
}

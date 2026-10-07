"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { AUDIENCE_REACH, cpf, cpm, followRate, getAgeTrend } from "@/lib/data/meta/analytics"
import { int, money, pct } from "@/lib/data/meta/format"

const BAR_COLOR = "#D93732"
const TH = "px-3 py-2 text-right font-medium whitespace-nowrap"
const TD = "px-3 py-2 text-right tabular-nums whitespace-nowrap"

type ShareMode = "follows" | "spend"

function HeadlineStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  )
}

function AgeTrendCard() {
  const trend = getAgeTrend()
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-4">
      <p className="text-xs font-semibold text-foreground">Age trend by month</p>
      {trend ? (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Month</th>
                {trend[0].shares.map((s) => (
                  <th key={s.age} className={TH}>
                    {s.age}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trend.map((m) => (
                <tr key={m.month} className="border-t border-border/50">
                  <td className="px-3 py-2">{m.month}</td>
                  {m.shares.map((s) => (
                    <td key={s.age} className={TD}>
                      {pct(s.share)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-1 text-[11px] text-muted-foreground">
          Monthly age exports for July, August, and September aren&apos;t loaded yet. Once they&apos;re added, this
          shows whether our audience is getting younger month over month.
        </p>
      )}
    </div>
  )
}

export function AudienceReachSection() {
  const r = AUDIENCE_REACH
  const [mode, setMode] = useState<ShareMode>("follows")
  const chartData = r.ageRows.map((a) => ({
    age: a.age,
    share: Math.round((mode === "follows" ? a.followShare : a.spendShare) * 1000) / 10,
  }))

  return (
    <section className="space-y-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Who we&apos;re reaching (Jul–Sep 2026)</h3>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            90-day view
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Follower-growth campaign, Jul 1 – Sep 30 combined. These are 90-day totals, not a trend over time.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-[12px] leading-relaxed text-foreground/80">{r.summary}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <HeadlineStat label="Follows from ages 18–34" value={pct(r.headline.young)} />
        <HeadlineStat label="Follows from ages 35–44" value={pct(r.headline.mid)} />
        <HeadlineStat label="Follows from ages 45+" value={pct(r.headline.older)} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-foreground">
            Share of {mode === "follows" ? "follows" : "spend"} by age
          </p>
          <div className="flex gap-1" role="group" aria-label="Chart metric">
            {(["follows", "spend"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`rounded-lg border px-3 py-1 text-[12px] transition-colors ${
                  mode === m
                    ? "border-primary bg-primary font-medium text-primary-foreground"
                    : "border-border/60 bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                Share of {m}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e4da" vertical={false} />
              <XAxis dataKey="age" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 10, fill: "#888" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(v: number) => [`${v}%`, mode === "follows" ? "Share of follows" : "Share of spend"]}
                contentStyle={{ backgroundColor: "#fbf9f4", border: "1px solid #e0ddd4", borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="share" fill={BAR_COLOR} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-xs">
            <thead className="text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Age</th>
                <th className={TH}>Spend</th>
                <th className={TH}>Follows</th>
                <th className={TH}>Cost per follow</th>
                <th className={TH}>Profile visits</th>
                <th className={TH}>Follow rate</th>
                <th className={TH}>Cost per 1,000 views</th>
              </tr>
            </thead>
            <tbody>
              {r.ageRows.map((a) => (
                <tr key={a.age} className="border-t border-border/50">
                  <td className="px-3 py-2">{a.age}</td>
                  <td className={TD}>{money(a.spend)}</td>
                  <td className={TD}>{int(a.follows)}</td>
                  <td className={TD}>{money(cpf(a))}</td>
                  <td className={TD}>{int(a.visits)}</td>
                  <td className={TD}>{pct(followRate(a), 1)}</td>
                  <td className={TD}>{money(cpm(a))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          {int(r.unknown.follows)} follows ({money(r.unknown.spend)} spend) had no age reported and are left out of the
          shares above.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold text-foreground">Creative by age</p>
        <p className="text-[11px] text-muted-foreground">
          Our ten ads with the most follows, sorted by share of follows from ages 18–34. The top three are highlighted.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-xs">
            <thead className="text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Ad</th>
                <th className={TH}>Follows</th>
                <th className={TH}>Cost per follow</th>
                <th className={TH}>% from 18–34</th>
                <th className={TH}>% from 45+</th>
                <th className={TH}>Cost per 18–34 follow</th>
              </tr>
            </thead>
            <tbody>
              {r.creative.map((c) => (
                <tr key={c.name} className={`border-t border-border/50 ${c.topThree ? "bg-primary/5" : ""}`}>
                  <td className={`px-3 py-2 ${c.topThree ? "font-semibold text-foreground" : ""}`}>{c.name}</td>
                  <td className={TD}>{int(c.follows)}</td>
                  <td className={TD}>{money(c.cpf)}</td>
                  <td className={`${TD} ${c.topThree ? "font-semibold text-primary" : ""}`}>{pct(c.pct18to34)}</td>
                  <td className={TD}>{pct(c.pct45plus)}</td>
                  <td className={TD}>{money(c.costPer18to34Follow)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold text-foreground">Instagram vs. Facebook</p>
        <p className="text-[11px] text-muted-foreground">Both follower-growth ad sets, Jul 1 – Sep 30.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-xs">
            <thead className="text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Ad set</th>
                <th className="px-3 py-2 text-left font-medium">Platform</th>
                <th className={TH}>Spend</th>
                <th className={TH}>Follows</th>
                <th className={TH}>Cost per follow</th>
              </tr>
            </thead>
            <tbody>
              {r.platforms.map((p) => (
                <tr key={`${p.adSet}-${p.platform}`} className="border-t border-border/50">
                  <td className="px-3 py-2">{p.adSet}</td>
                  <td className="px-3 py-2">{p.platform}</td>
                  <td className={TD}>{money(p.spend)}</td>
                  <td className={TD}>{int(p.follows)}</td>
                  <td className={TD}>{money(cpf(p))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AgeTrendCard />
    </section>
  )
}

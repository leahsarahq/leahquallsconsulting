"use client"

import { useState } from "react"
import { ChartSection } from "@/components/chart-section"
import type { getDataForMonth } from "@/lib/data"

type OctoberPlanData = NonNullable<ReturnType<typeof getDataForMonth>["octoberPlan"]>
type Status = "Live" | "Testing" | "Winner" | "Retired"
const STATUSES: Status[] = ["Live", "Testing", "Winner", "Retired"]
const STATUS_STYLE: Record<Status, string> = {
  Live: "bg-blue-100 text-blue-800",
  Testing: "bg-yellow-100 text-yellow-800",
  Winner: "bg-green-100 text-green-800",
  Retired: "bg-muted text-muted-foreground",
}

function GoalTile({ label, target, baseline }: { label: string; target: React.ReactNode; baseline: string }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{label}</p>
      <div className="text-lg font-bold text-foreground">{target}</div>
      <p className="text-[11px] text-muted-foreground mt-1">{baseline}</p>
    </div>
  )
}

export function OctoberPlan({ plan }: { plan: OctoberPlanData }) {
  const [youngTarget, setYoungTarget] = useState("")
  const [tracker, setTracker] = useState(
    plan.tracker.map((t) => ({ ...t, angle: "", status: "Testing" as Status })),
  )
  const baseline = `${Math.round(plan.youngShareBaseline * 100)}%`
  const update = (i: number, patch: Partial<(typeof tracker)[number]>) =>
    setTracker((rows) => rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))

  return (
    <div className="space-y-4">
      <ChartSection title="October goals">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
          {plan.goals.map((g) => (
            <GoalTile key={g.label} label={g.label} target={g.target} baseline={g.baseline} />
          ))}
          <GoalTile
            label="Share of follows from 18–34"
            baseline={`Baseline (Jul–Sep): ${baseline}`}
            target={
              <label className="flex items-center gap-1">
                <span className="sr-only">Target share of follows from ages 18–34</span>
                <input
                  value={youngTarget}
                  onChange={(e) => setYoungTarget(e.target.value.replace(/[^\d.]/g, "").slice(0, 4))}
                  placeholder="Set"
                  inputMode="decimal"
                  className="w-16 rounded-md border border-border bg-card px-2 py-0.5 text-lg font-bold text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span>%</span>
              </label>
            }
          />
        </div>
      </ChartSection>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-foreground">Planned change: {plan.plannedChange.title}</h3>
          <span className="text-[11px] text-muted-foreground">Starts Oct 1</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed text-pretty">{plan.plannedChange.detail}</p>
      </div>

      <ChartSection title="Creative testing tracker" subtitle="Results fill in once October data is imported">
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border/60 text-left text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                <th className="py-2 px-2 font-medium">Ad</th>
                <th className="py-2 px-2 font-medium">Launch</th>
                <th className="py-2 px-2 font-medium">Messaging angle</th>
                <th className="py-2 px-2 font-medium">Status</th>
                <th className="py-2 px-2 font-medium">Follows</th>
                <th className="py-2 px-2 font-medium">CPF</th>
                <th className="py-2 px-2 font-medium">% 18–34</th>
              </tr>
            </thead>
            <tbody>
              {tracker.map((row, i) => (
                <tr key={row.ad + row.launch} className="border-b border-border/30 last:border-0">
                  <td className="py-2.5 px-2 font-medium text-foreground whitespace-nowrap">{row.ad}</td>
                  <td className="py-2.5 px-2 text-muted-foreground whitespace-nowrap">{row.launch}</td>
                  <td className="py-2.5 px-2 min-w-48">
                    <input
                      value={row.angle}
                      onChange={(e) => update(i, { angle: e.target.value })}
                      placeholder="Add messaging angle"
                      aria-label={`Messaging angle for ${row.ad}`}
                      className="w-full rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <select
                      value={row.status}
                      onChange={(e) => update(i, { status: e.target.value as Status })}
                      aria-label={`Status for ${row.ad}`}
                      className={`text-[11px] font-medium rounded-full px-2 py-0.5 border-0 ${STATUS_STYLE[row.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5 px-2 text-muted-foreground">—</td>
                  <td className="py-2.5 px-2 text-muted-foreground">—</td>
                  <td className="py-2.5 px-2 text-muted-foreground">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartSection>

      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="text-sm font-semibold text-foreground mb-2">Q4 spend approach</h4>
        <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{plan.q4Note}</p>
      </div>

      <ChartSection title="What to flag to us">
        <ul className="mt-1 space-y-2">
          {plan.flags.map((f) => (
            <li key={f} className="flex gap-2.5 text-sm text-foreground/80 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span className="text-pretty">{f}</span>
            </li>
          ))}
        </ul>
      </ChartSection>
    </div>
  )
}

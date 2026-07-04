"use client"

import { ChartSection } from "@/components/chart-section"
import { getDataForMonth } from "@/lib/data"
import { useMonth } from "@/lib/month-context"
import type { TestArm } from "@/lib/data/types"

// Which arm is better for a given metric (lower-is-better for cost metrics).
function betterArm(challenger: number | null, control: number | null, lowerIsBetter: boolean) {
  if (challenger == null || control == null) return null
  if (challenger === control) return "tie"
  const challengerWins = lowerIsBetter ? challenger < control : challenger > control
  return challengerWins ? "challenger" : "control"
}

function MetricRow({
  label,
  challenger,
  control,
  format,
  lowerIsBetter = false,
}: {
  label: string
  challenger: number | null
  control: number | null
  format: (v: number) => string
  lowerIsBetter?: boolean
}) {
  const winner = betterArm(challenger, control, lowerIsBetter)
  const cell = (value: number | null, side: "challenger" | "control") => {
    const isWinner = winner === side
    return (
      <div
        className={`text-sm font-semibold tabular-nums ${isWinner ? "text-green-600" : "text-foreground"}`}
      >
        {value == null ? "—" : format(value)}
        {isWinner && <span className="ml-1 text-[10px] font-medium uppercase text-green-600">best</span>}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-[1.2fr_1fr_1fr] items-center gap-2 py-2 border-b border-border/40 last:border-0">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
      {cell(challenger, "challenger")}
      {cell(control, "control")}
    </div>
  )
}

function ArmHeader({ arm, accent }: { arm: TestArm; accent: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
        <span className="text-sm font-semibold text-foreground">{arm.name}</span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-0.5">{arm.note}</p>
    </div>
  )
}

export function TestingTab() {
  const { selectedMonth, monthInfo } = useMonth()
  const { testing } = getDataForMonth(selectedMonth)

  if (!testing) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <p className="text-muted-foreground">No testing data available for this month.</p>
      </div>
    )
  }

  const { featured, notes } = testing
  const { challenger, control } = featured

  return (
    <div className="space-y-4">
      {/* Featured head-to-head test */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-foreground">{featured.name}</h3>
          <span className="text-[11px] text-muted-foreground">{featured.dateRange} · {monthInfo.label}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{featured.hypothesis}</p>
        <p className="text-[11px] text-foreground/80 mt-2">
          <span className="font-medium">Measured on:</span> {featured.kpiFocus}
        </p>
      </div>

      {/* Head-to-head metric comparison */}
      <ChartSection title="Head-to-head" subtitle="Challenger vs. control · best value highlighted">
        <div className="mt-2">
          <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-2 pb-2 border-b border-border">
            <span />
            <ArmHeader arm={challenger} accent="#D93732" />
            <ArmHeader arm={control} accent="#E8853A" />
          </div>
          <MetricRow label="Cost per follow" challenger={challenger.cpf} control={control.cpf} format={(v) => `$${v.toFixed(2)}`} lowerIsBetter />
          <MetricRow label="Follows" challenger={challenger.follows} control={control.follows} format={(v) => v.toLocaleString()} />
          <MetricRow label="Click-through rate" challenger={challenger.ctr} control={control.ctr} format={(v) => `${v.toFixed(2)}%`} />
          <MetricRow label="IG follow rate" challenger={challenger.followRate} control={control.followRate} format={(v) => `${v.toFixed(1)}%`} />
          <MetricRow label="CPC" challenger={challenger.cpc} control={control.cpc} format={(v) => `$${v.toFixed(2)}`} lowerIsBetter />
          <MetricRow label="Profile visits" challenger={challenger.profileVisits} control={control.profileVisits} format={(v) => v.toLocaleString()} />
          <MetricRow label="Spend" challenger={challenger.spend} control={control.spend} format={(v) => `$${Math.round(v).toLocaleString()}`} />
        </div>
      </ChartSection>

      {/* Verdict */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="text-sm font-semibold text-foreground mb-2">Read</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{featured.verdict}</p>
      </div>

      {/* Context notes */}
      <ChartSection title="Other tests & context" subtitle="Short-lived, carryover, and promo runs to read carefully">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {notes.map((note) => (
            <div key={note.title} className="bg-secondary/40 rounded-lg p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{note.title}</p>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground whitespace-nowrap">
                  {note.status}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {note.dateRange} · ${note.spend.toLocaleString()} spend
              </p>
              <p className="text-xs text-foreground/80 leading-relaxed mt-2">{note.detail}</p>
            </div>
          ))}
        </div>
      </ChartSection>
    </div>
  )
}

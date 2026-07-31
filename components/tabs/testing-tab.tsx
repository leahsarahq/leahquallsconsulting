"use client"

import { ChartSection } from "@/components/chart-section"
import { getDataForMonth } from "@/lib/data"
import { useMonth } from "@/lib/month-context"
import type { TestArm } from "@/lib/data/types"

// Accent colors assigned to each arm, in order.
const ARM_ACCENTS = ["#D93732", "#660033", "#E8853A"]

// Index of the best value among the arms for a metric (lower-is-better for cost
// metrics). Returns a Set so ties can all be highlighted; null values are ignored.
function bestIndexes(values: (number | null)[], lowerIsBetter: boolean): Set<number> {
  const valid = values.filter((v): v is number => v != null)
  if (valid.length < 2) return new Set()
  const best = lowerIsBetter ? Math.min(...valid) : Math.max(...valid)
  const winners = new Set<number>()
  values.forEach((v, i) => {
    if (v === best) winners.add(i)
  })
  return winners
}

function MetricRow({
  label,
  values,
  format,
  gridTemplate,
  lowerIsBetter = false,
  neutral = false,
}: {
  label: string
  values: (number | null)[]
  format: (v: number) => string
  gridTemplate: string
  lowerIsBetter?: boolean
  // Neutral metrics (e.g. spend) are context, not a win condition — don't highlight.
  neutral?: boolean
}) {
  const winners = neutral ? new Set<number>() : bestIndexes(values, lowerIsBetter)
  return (
    <div
      className="grid items-center gap-2 py-2 border-b border-border/40 last:border-0"
      style={{ gridTemplateColumns: gridTemplate }}
    >
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
      {values.map((value, i) => {
        const isWinner = winners.has(i)
        return (
          <div
            key={i}
            className={`text-sm font-semibold tabular-nums ${isWinner ? "text-green-600" : "text-foreground"}`}
          >
            {value == null ? "—" : format(value)}
            {isWinner && <span className="ml-1 text-[10px] font-medium uppercase text-green-600">best</span>}
          </div>
        )
      })}
    </div>
  )
}

function ArmHeader({ arm, accent }: { arm: TestArm; accent: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: accent }} />
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
  // Support both two-arm (challenger/control) and multi-arm (arms) tests.
  const arms: TestArm[] = featured.arms ?? [featured.challenger, featured.control].filter(Boolean as unknown as (a: TestArm | undefined) => a is TestArm)
  // Grid: a wider label column followed by one equal column per arm.
  const gridTemplate = `1.2fr ${arms.map(() => "1fr").join(" ")}`

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
      <ChartSection
        title={arms.length > 2 ? `${arms.length}-way comparison` : "Head-to-head"}
        subtitle="Best value per metric highlighted"
      >
        <div className="mt-2">
          <div className="grid gap-2 pb-2 border-b border-border" style={{ gridTemplateColumns: gridTemplate }}>
            <span />
            {arms.map((arm, i) => (
              <ArmHeader key={arm.name} arm={arm} accent={ARM_ACCENTS[i % ARM_ACCENTS.length]} />
            ))}
          </div>
          <MetricRow label="Cost per follow" values={arms.map((a) => a.cpf)} format={(v) => `$${v.toFixed(2)}`} gridTemplate={gridTemplate} lowerIsBetter />
          <MetricRow label="Follows" values={arms.map((a) => a.follows)} format={(v) => v.toLocaleString()} gridTemplate={gridTemplate} />
          <MetricRow label="Click-through rate" values={arms.map((a) => a.ctr)} format={(v) => `${v.toFixed(2)}%`} gridTemplate={gridTemplate} />
          <MetricRow label="IG follow rate" values={arms.map((a) => a.followRate)} format={(v) => `${v.toFixed(1)}%`} gridTemplate={gridTemplate} />
          <MetricRow label="CPC" values={arms.map((a) => a.cpc)} format={(v) => `$${v.toFixed(2)}`} gridTemplate={gridTemplate} lowerIsBetter />
          <MetricRow label="Profile visits" values={arms.map((a) => a.profileVisits)} format={(v) => v.toLocaleString()} gridTemplate={gridTemplate} />
          <MetricRow label="Spend" values={arms.map((a) => a.spend)} format={(v) => `$${Math.round(v).toLocaleString()}`} gridTemplate={gridTemplate} neutral />
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

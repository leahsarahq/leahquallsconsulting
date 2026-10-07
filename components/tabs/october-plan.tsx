import { ChartSection } from "@/components/chart-section"
import type { getDataForMonth } from "@/lib/data"

type OctoberPlanData = NonNullable<ReturnType<typeof getDataForMonth>["octoberPlan"]>

const RECOMMENDED_YOUNG_SHARE = 0.3

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
  const baseline = `${Math.round(plan.youngShareBaseline * 100)}%`

  return (
    <div className="space-y-4">
      <ChartSection title="October goals">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
          {plan.goals.map((g) => (
            <GoalTile key={g.label} label={g.label} target={g.target} baseline={g.baseline} />
          ))}
          <GoalTile
            label="Share of follows from 18–34"
            target={`About ${Math.round(RECOMMENDED_YOUNG_SHARE * 100)}%`}
            baseline={`Jul–Sep: ${baseline}. New 18–34 audience should lift this.`}
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

      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="text-sm font-semibold text-foreground mb-2">Q4 spend approach</h4>
        <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{plan.q4Note}</p>
      </div>
    </div>
  )
}

import { NOVEMBER_PLAN } from "@/lib/data/october-2026"
import { BriefView, FootNote } from "@/components/brief"

export function NovemberPlanCard() {
  const plan = NOVEMBER_PLAN
  return (
    <section
      className="border border-border border-l-4 border-l-primary rounded-xl p-4 bg-primary/[0.03]"
      aria-labelledby="november-plan-title"
    >
      <h3 id="november-plan-title" className="text-sm font-semibold text-foreground">
        {plan.title}
      </h3>
      <p className="text-xs text-muted-foreground mt-0.5">{plan.subtitle}</p>

      <BriefView brief={{ takeaway: plan.takeaway }} className="mt-3" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {plan.adSets.map((set) => (
          <div key={set.name} className="bg-card border border-border/60 rounded-lg p-3">
            <p className="text-sm font-semibold text-foreground">{set.name}</p>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
              {set.budget}
            </p>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
              Role: {set.role}
            </p>
            <BriefView brief={{ bullets: set.bullets }} className="mt-2.5" />
          </div>
        ))}
      </div>

      <ol className="flex flex-col md:flex-row mt-4 rounded-lg overflow-hidden border border-border/60 bg-card divide-y md:divide-y-0 md:divide-x divide-border/60">
        {plan.timeline.map((seg) => (
          <li key={seg.dates} className="flex-1 px-3 py-2">
            <p className="text-xs font-semibold text-foreground">{seg.dates}</p>
            <p className="text-xs text-muted-foreground">{seg.label}</p>
          </li>
        ))}
      </ol>
      <FootNote text={plan.timelineCaption} tip={plan.timelineTip} className="mt-2" />

      <div className="mt-4 pt-4 border-t border-border/60">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
          {plan.targetsTitle}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {plan.targets.map((t) => (
            <div key={t.label} className="bg-card border border-border/60 rounded-lg p-3">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{t.label}</p>
              <p className="text-lg font-semibold text-foreground mt-1">{t.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.note}</p>
            </div>
          ))}
        </div>
        <FootNote text={plan.targetsCaption} tip={plan.targetsTip} className="mt-2" />
      </div>
    </section>
  )
}

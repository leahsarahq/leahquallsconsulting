type ChecklistStatus = "done" | "todo" | "watch"

type ChecklistItem = {
  status: ChecklistStatus
  action: string
  why: string
}

const STATUS_STYLES: Record<ChecklistStatus, { label: string; className: string }> = {
  done: { label: "Done", className: "bg-[#E4EEE4] text-[#3F6F3F]" },
  todo: { label: "To do", className: "bg-[#FBE6E5] text-[#B02B27]" },
  watch: { label: "Watch", className: "bg-muted text-muted-foreground" },
}

const THIS_WEEK: ChecklistItem[] = [
  {
    status: "done",
    action: "Moved the Lookalike ad set to Instagram-only placements (Sep 24).",
    why: "Facebook placements took 27% of this ad set's spend at $4.07 per follow, against $1.98 on Instagram.",
  },
  {
    status: "todo",
    action: "Pause \u201CImagine Hating On Me.\u201D",
    why: "$6.27 per follow over the last 7 days (16 follows on $100 spend).",
  },
  {
    status: "watch",
    action: "Keep the Broad ad set unchanged as the control.",
    why: "It's running our best ad at about $1.80 CPF. Leaving it alone lets us read the Lookalike placement change cleanly, and it avoids a learning reset before month-end.",
  },
  {
    status: "watch",
    action: "Check Lookalike delivery daily while it re-learns.",
    why: "If spend stays more than 20% under budget after day 3, the Instagram-only audience may be too narrow.",
  },
  {
    status: "todo",
    action: "Pull the placement breakdown by month (Jul / Aug / Sep).",
    why: "This confirms whether Facebook's share of spend grew in August and helped drive the CPF jump.",
  },
  {
    status: "todo",
    action: "Brief Kendall on 1\u20132 new creatives to launch Oct 1.",
    why: "\u201CFrozen Pasta Can't Be That Good\u201D is wearing out (visit-to-follow down from 40% to 22%). We need a successor that's cheap to show (about $15 CPM) and turns 20%+ of profile visitors into followers.",
  },
  {
    status: "todo",
    action: "Align with Ian on October budget.",
    why: "The choice is between holding $75/$75 for follower volume and trimming the Lookalike for efficiency.",
  },
]

const NEXT_WEEK: ChecklistItem[] = [
  {
    status: "todo",
    action: "Move the Broad ad set to Instagram-only placements.",
    why: "Its Facebook placements ran $2.97 per follow, against $1.81 on Instagram.",
  },
  {
    status: "todo",
    action: "Add \u201CFrozen Pasta Can't Be That Good\u201D to the Lookalike ad set.",
    why: "Broad currently runs only that ad, and Lookalike runs different ads. Putting the same ad in both gives a fair audience test.",
  },
  {
    status: "todo",
    action: "Launch the new creative in one test slot.",
    why: "At our budget we test one variable at a time.",
  },
  {
    status: "todo",
    action: "Apply the October budget decision.",
    why: "Whatever Ian and the team land on for the $75/$75 hold vs. an efficiency trim.",
  },
  {
    status: "todo",
    action: "Turn on the kill rule.",
    why: "After about $40 spend, pause any ad with a visit-to-follow rate under 10% or a CPF more than 2x target. CTR and profile visits have been misleading \u2014 \u201CWhat Did I Just Witness\u201D had a 16% CTR and got 7 follows on $467.",
  },
  {
    status: "watch",
    action: "No edits Oct 2\u20137 while Meta re-learns; read the results Oct 8.",
    why: "One clean learning window gives a readable result.",
  },
]

const TARGETS = [
  { label: "Engagement CPF", value: "$2.00\u20132.10", sub: "Sept MTD: $2.45" },
  { label: "Visit \u2192 follow rate", value: "20%+", sub: "Sept MTD: 12.5%" },
  { label: "Share of spend on Facebook", value: "0%", sub: "Jul\u2013Sep: 25%" },
]

function StatusChip({ status }: { status: ChecklistStatus }) {
  const { label, className } = STATUS_STYLES[status]
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  )
}

function Checklist({ items }: { items: ChecklistItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.action} className="flex gap-2.5">
          <StatusChip status={item.status} />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-snug text-foreground">{item.action}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{item.why}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function NextStepsSection() {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Next Steps</h3>
        <p className="text-[11px] text-muted-foreground">What&apos;s changing over the next two weeks and why.</p>
      </div>

      {/* Context card */}
      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-xs font-semibold text-foreground">Why we&apos;re making changes</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
          Engagement CPF rose from $1.34 in July to $2.96 in August on our main ad set. The rise came from which ads
          were running, not from the audience. Our best ad, &ldquo;Frozen Pasta Can&apos;t Be That Good,&rdquo; was out
          of rotation for most of August. Spend went to ads that were expensive to show or that drove profile visits
          without follows. A placement breakdown also showed Facebook placements taking 25% of spend at $3.85 per
          follow, against $1.94 on Instagram. Both ad sets optimize for profile visits across Instagram and Facebook,
          not for follows, so Meta was buying cheap visits that didn&apos;t convert.
        </p>
      </div>

      {/* Two action cards */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">This week (Sep 24&ndash;30)</p>
          <h4 className="mt-0.5 text-[13px] font-semibold text-foreground">Clean up, don&apos;t restructure</h4>
          <div className="mt-3">
            <Checklist items={THIS_WEEK} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Next week (Oct 1&ndash;7)</p>
          <h4 className="mt-0.5 text-[13px] font-semibold text-foreground">One coordinated reset, then hands off</h4>
          <p className="mt-2 rounded-lg bg-muted/50 px-2.5 py-1.5 text-[11px] leading-snug text-muted-foreground">
            All changes go live Oct 1 together, so there&apos;s only one learning reset.
          </p>
          <div className="mt-3">
            <Checklist items={NEXT_WEEK} />
          </div>
        </div>
      </div>

      {/* Target strip */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          What we&apos;re aiming for in October
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TARGETS.map((t) => (
            <div key={t.label} className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[11px] text-muted-foreground">{t.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{t.value}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{t.sub}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
          Getting below $2.00 depends on a new top-performing ad. Placement and ad cleanup alone should get us to about
          $2.00&ndash;2.10.
        </p>
      </div>
    </section>
  )
}

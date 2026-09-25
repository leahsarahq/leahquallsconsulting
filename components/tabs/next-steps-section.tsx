type ChecklistStatus = "complete" | "thisWeek" | "oct1" | "yourInput" | "ongoing" | "oct8"

type ChecklistItem = {
  status: ChecklistStatus
  action: string
  why: string
}

const STATUS_STYLES: Record<ChecklistStatus, { label: string; className: string }> = {
  complete: { label: "Complete", className: "bg-[#E4EEE4] text-[#3F6F3F]" },
  thisWeek: { label: "This week", className: "bg-[#FBE6E5] text-[#B02B27]" },
  oct1: { label: "Oct 1", className: "bg-[#FBE6E5] text-[#B02B27]" },
  yourInput: { label: "Your input", className: "bg-[#FBF0DC] text-[#8A5A00]" },
  ongoing: { label: "Ongoing", className: "bg-muted text-muted-foreground" },
  oct8: { label: "Oct 8", className: "bg-muted text-muted-foreground" },
}

const THIS_WEEK: ChecklistItem[] = [
  {
    status: "complete",
    action: "Shifted our lookalike audience to Instagram only.",
    why: "Instagram has been bringing in followers at about half the cost of Facebook.",
  },
  {
    status: "thisWeek",
    action: "Retiring one underperforming ad.",
    why: "\u201CImagine Hating On Me\u201D has run its course, so its budget moves to stronger ads.",
  },
  {
    status: "thisWeek",
    action: "Keeping our top ad steady through month-end.",
    why: "\u201CFrozen Pasta Can't Be That Good\u201D is our most efficient ad, and we'll let it run uninterrupted.",
  },
  {
    status: "yourInput",
    action: "New creative for October.",
    why: "We're looking for 1\u20132 new posts in the spirit of \u201CFrozen Pasta Can't Be That Good\u201D: a bold, witty hook that makes people want to follow, not just watch.",
  },
  {
    status: "yourInput",
    action: "October budget.",
    why: "We'll bring a recommendation on whether to keep the current level for follower volume or trim slightly for efficiency.",
  },
]

const NEXT_WEEK: ChecklistItem[] = [
  {
    status: "oct1",
    action: "Move all follower-growth spend to Instagram.",
    why: "This extends the change we made this week to our second audience.",
  },
  {
    status: "oct1",
    action: "Run our top ad across both audiences.",
    why: "It shows us which audience grows the account most efficiently, on equal footing.",
  },
  {
    status: "oct1",
    action: "Launch new creative.",
    why: "We'll introduce new posts one at a time so we can see clearly what's working.",
  },
  {
    status: "oct1",
    action: "Apply the October budget.",
    why: "",
  },
  {
    status: "ongoing",
    action: "Weekly check on every ad.",
    why: "Any ad that isn't turning visitors into followers gets paused quickly, so budget always goes to what's working.",
  },
  {
    status: "oct8",
    action: "First results readout.",
    why: "",
  },
]

const TARGETS = [
  { label: "Cost per follower", value: "about $2.00", sub: "September to date: $2.45" },
  { label: "Profile visitors who follow", value: "20%+", sub: "September to date: 12.5%" },
  { label: "Follower-growth spend on Instagram", value: "100%", sub: "" },
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
            {item.why ? (
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{item.why}</p>
            ) : null}
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
        <h3 className="text-sm font-semibold text-foreground">What&apos;s Next</h3>
        <p className="text-[11px] text-muted-foreground">
          Our plan for the next two weeks to bring cost per follower down.
        </p>
      </div>

      {/* Context card */}
      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-xs font-semibold text-foreground">Where we are</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
          Cost per follower rose in August and has been coming back down through September. It&apos;s $2.45
          month-to-date, down from $2.96 in August. Our review found two clear opportunities. First, our strongest ad,
          &ldquo;Frozen Pasta Can&apos;t Be That Good,&rdquo; drives follows more efficiently than anything else
          we&apos;re running, so we&apos;re putting more behind it and developing its successor. Second, Instagram is
          converting at roughly half the cost of Facebook for follower growth, so we&apos;re focusing spend there.
        </p>
      </div>

      {/* Two action cards */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">This week (Sep 24&ndash;30)</p>
          <h4 className="mt-0.5 text-[13px] font-semibold text-foreground">Focusing spend</h4>
          <div className="mt-3">
            <Checklist items={THIS_WEEK} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Next week (Oct 1&ndash;7)</p>
          <h4 className="mt-0.5 text-[13px] font-semibold text-foreground">October refresh</h4>
          <p className="mt-2 rounded-lg bg-muted/50 px-2.5 py-1.5 text-[11px] leading-snug text-muted-foreground">
            All updates go live together on Oct 1, then we let them settle for a week before reading results.
          </p>
          <div className="mt-3">
            <Checklist items={NEXT_WEEK} />
          </div>
        </div>
      </div>

      {/* Target strip */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">October goals</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TARGETS.map((t) => (
            <div key={t.label} className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[11px] text-muted-foreground">{t.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{t.value}</p>
              {t.sub ? <p className="mt-0.5 text-[10px] text-muted-foreground">{t.sub}</p> : null}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
          New creative is the biggest lever for getting below $2.00.
        </p>
      </div>
    </section>
  )
}

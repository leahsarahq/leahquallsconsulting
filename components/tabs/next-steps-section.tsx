import { Check } from "lucide-react"

type ChecklistItem = {
  complete?: boolean
  yourInput?: boolean
  action: string
  why?: string
}

type ChecklistGroup = {
  label: string
  items: ChecklistItem[]
}

const THIS_WEEK: ChecklistItem[] = [
  {
    complete: true,
    action: "Shifted our lookalike audience to Instagram only.",
    why: "Instagram has been bringing in followers at about half the cost of Facebook.",
  },
  {
    complete: true,
    action: "Retiring one underperforming ad.",
    why: "\u201CImagine Hating On Me\u201D has run its course, so its budget moves to stronger ads.",
  },
  {
    action: "Keeping our top ad steady through month-end.",
    why: "\u201CFrozen Pasta Can't Be That Good\u201D is our most efficient ad, and we'll let it run uninterrupted.",
  },
  {
    action: "New creative for October.",
        why: "Three new posts will be tested through October, one every 10 days: Ripi & Dip Ranch (Oct 1), Tomato Martini (Oct 11), and a third to be announced (Oct 21).",
  },
]

const NEXT_WEEK_GROUPS: ChecklistGroup[] = [
  {
    label: "Oct 1",
    items: [
      {
        action: "Move all follower-growth spend to Instagram.",
        why: "This extends the change we made this week to our second audience.",
      },
      {
        action: "Start a 10-day creative testing cycle.",
        why: "Our second audience will test one new ad at a time against a current performer. Every 10 days we keep the winner and bring in something new.",
      },
      {
        action: "First new ad goes live.",
        why: "Strong performers move into our main audience to keep results fresh.",
      },
    ],
  },
  {
    label: "Ongoing",
    items: [
      {
        action: "Weekly check on every ad.",
        why: "Any ad that isn't turning visitors into followers gets paused quickly, so budget always goes to what's working.",
      },
    ],
  },
  {
    label: "Oct 11",
    items: [
      {
        action: "First test results; Tomato Martini goes live.",
      },
    ],
  },
]

const TARGETS = [
  { label: "Cost per follower", value: "about $2.00", sub: "September to date: $2.45" },
  { label: "Profile visitors who follow", value: "20%+", sub: "September to date: 12.5%" },
  { label: "Follower-growth spend on Instagram", value: "100%", sub: "September to date: about 75%" },
  { label: "October spend", value: "about $4,200", sub: "Pending approval." },
]

function Marker({ complete }: { complete?: boolean }) {
  if (complete) {
    return (
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#3F6F3F]">
        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
      </span>
    )
  }
  return <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-[1.5px] border-muted-foreground/40" />
}

function ChecklistRow({ item }: { item: ChecklistItem }) {
  return (
    <li className="flex gap-2.5">
      <Marker complete={item.complete} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-[13px] font-semibold leading-snug text-foreground">{item.action}</p>
          {item.yourInput ? (
            <span className="inline-flex h-5 shrink-0 items-center whitespace-nowrap rounded-full bg-[#FBF0DC] px-2 text-[11px] font-semibold uppercase tracking-wide text-[#8A5A00]">
              Your input
            </span>
          ) : null}
        </div>
        {item.why ? <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{item.why}</p> : null}
      </div>
    </li>
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
        <p className="mt-1.5 text-[12px] leading-relaxed text-foreground/80">
          Cost per follower rose in August and is coming back down: $2.45 in September so far, down from $2.96. Our top
          ad, &ldquo;Frozen Pasta Can&apos;t Be That Good,&rdquo; is our most efficient driver of follows, and Instagram
          brings in followers at about half the cost of Facebook. October&apos;s plan builds on both.
        </p>
      </div>

      {/* Two action cards */}
      <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-2">
        <div className="flex flex-col rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            This week (Sep 24&ndash;30)
          </p>
          <h4 className="mt-0.5 text-[13px] font-semibold text-foreground">Focusing spend</h4>
          <ul className="mt-4 space-y-4">
            {THIS_WEEK.map((item) => (
              <ChecklistRow key={item.action} item={item} />
            ))}
          </ul>
        </div>

        <div className="flex flex-col rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Next week (Oct 1&ndash;7)
          </p>
          <h4 className="mt-0.5 text-[13px] font-semibold text-foreground">October refresh</h4>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            All updates go live together Oct 1, then settle for a week.
          </p>
          <div className="mt-4 space-y-4">
            {NEXT_WEEK_GROUPS.map((group) => (
              <div key={group.label} className="space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</p>
                <ul className="space-y-4">
                  {group.items.map((item) => (
                    <ChecklistRow key={item.action} item={item} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target strip */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">October goals</p>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
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

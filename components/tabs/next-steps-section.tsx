"use client"

import { useState } from "react"
import { AUDIENCE_REACH, SEPTEMBER_CLOSEOUT, cpf, followRate, formatDate } from "@/lib/data/meta/analytics"
import { int, money, pct } from "@/lib/data/meta/format"

type ChecklistItem = { action: string; why?: string }
type ChecklistGroup = { label: string; items: ChecklistItem[] }

const OCTOBER_PLAN: ChecklistGroup[] = [
  {
    label: "Oct 1",
    items: [
      {
        action: "Move all follower-growth spend to Instagram.",
        why: "This extends the change we made in September to our second audience.",
      },
      {
        action: "Start a 10-day creative testing cycle.",
        why: "Our second audience will test one new ad at a time against a current performer. Every 10 days we keep the winner and bring in something new.",
      },
      {
        action: "Ripi & Dip Ranch goes live.",
        why: "Ads that beat our current performers will move into our main audience.",
      },
      {
        action: "Add an ad set limited to ages 18–34.",
        why: "This gives younger audiences a dedicated share of the budget. We'll report its results separately from the broad ad set.",
      },
    ],
  },
  {
    label: "Ongoing",
    items: [
      {
        action: "Ongoing monitoring of every ad.",
        why: "We watch results daily and make changes at each 10-day checkpoint, so every new ad gets a fair test.",
      },
    ],
  },
  {
    label: "Oct 11",
    items: [{ action: "First test results; Tomato Martini goes live." }],
  },
]

type TestStatus = "" | "Live" | "Testing" | "Winner" | "Retired"
const STATUSES: TestStatus[] = ["", "Live", "Testing", "Winner", "Retired"]

const INITIAL_TESTS: { creative: string; launch: string; angle: string; status: TestStatus }[] = [
  { creative: "Ripi & Dip Ranch", launch: "Oct 1", angle: "", status: "Testing" },
  { creative: "Tomato Martini", launch: "Oct 11", angle: "", status: "" },
  { creative: "To be determined", launch: "Oct 21", angle: "", status: "" },
]

/** Set a number (e.g. 0.3 for 30%) to pre-fill the 18–34 goal; it can also be typed into the card. */
const AGE_18_34_TARGET: number | null = null

function Marker() {
  return <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-[1.5px] border-muted-foreground/40" />
}

function ChecklistRow({ item }: { item: ChecklistItem }) {
  return (
    <li className="flex gap-2.5">
      <Marker />
      <div className="min-w-0">
        <p className="text-[13px] font-semibold leading-snug text-foreground">{item.action}</p>
        {item.why ? <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{item.why}</p> : null}
      </div>
    </li>
  )
}

function GoalCard({ label, value, sub }: { label: string; value: React.ReactNode; sub: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <div className="mt-1 text-lg font-semibold tabular-nums text-foreground">{value}</div>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{sub}</p>
    </div>
  )
}

export function NextStepsSection() {
  const s = SEPTEMBER_CLOSEOUT
  const r = AUDIENCE_REACH
  const [ageTarget, setAgeTarget] = useState(AGE_18_34_TARGET != null ? String(Math.round(AGE_18_34_TARGET * 100)) : "")
  const [tests, setTests] = useState(INITIAL_TESTS)

  const fgAds = s.ads.filter((a) => a.followerGrowth)
  const topAd = fgAds[0]
  const retired = s.ads.filter((a) => a.retired && a.follows > 0)
  const fgAdSets = s.adSets.filter((a) => a.followerGrowth)
  const septCpf = cpf(s.followerGrowth)
  const ig = r.platforms.filter((p) => p.platform === "Instagram")
  const fb = r.platforms.filter((p) => p.platform === "Facebook")
  const sumCpf = (rows: typeof ig) => {
    const spend = rows.reduce((t, p) => t + p.spend, 0)
    const follows = rows.reduce((t, p) => t + p.follows, 0)
    return follows > 0 ? spend / follows : null
  }
  const igCpf = sumCpf(ig)
  const fbCpf = sumCpf(fb)
  const period = `Sep 1–${s.lastDay}`

  const updateTest = (i: number, patch: Partial<(typeof INITIAL_TESTS)[number]>) =>
    setTests((prev) => prev.map((t, j) => (j === i ? { ...t, ...patch } : t)))

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">What&apos;s Next</h3>
        <p className="text-[11px] text-muted-foreground">What September showed us and our plan for October.</p>
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-xs font-semibold text-foreground">Where we are</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-foreground/80">
          Cost per follower for {period} came to {money(septCpf)}, across {int(s.followerGrowth.follows)} follows.
          {topAd ? (
            <>
              {" "}
              Our top ad, &ldquo;{topAd.name},&rdquo; brought in {int(topAd.follows)} of them at {money(cpf(topAd))}{" "}
              each.
            </>
          ) : null}
          {igCpf != null && fbCpf != null ? (
            <>
              {" "}
              From July through September, Instagram brought in followers at {money(igCpf)} each, compared with{" "}
              {money(fbCpf)} on Facebook.
            </>
          ) : null}
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-2">
        <div className="flex flex-col rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{period}</p>
          <h4 className="mt-0.5 text-[13px] font-semibold text-foreground">What we did in September</h4>

          {topAd && (
            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Top ad</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground">&ldquo;{topAd.name}&rdquo;</p>
              <p className="text-[11px] text-muted-foreground">
                {int(topAd.follows)} follows · {money(cpf(topAd))} per follow
              </p>
            </div>
          )}

          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Cost per follow by ad set
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {fgAdSets.map((a) => (
                <div key={a.name} className="rounded-lg border border-border bg-muted/30 p-2.5">
                  <p className="text-[11px] leading-snug text-muted-foreground">{a.name.replace("Existing Posts ", "")}</p>
                  <p className="mt-1 text-base font-semibold tabular-nums">{money(cpf(a))}</p>
                  <p className="text-[10px] text-muted-foreground">{int(a.follows)} follows</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Ads retired</p>
            {retired.length ? (
              <ul className="mt-1.5 space-y-1">
                {retired.map((a) => (
                  <li key={a.name} className="flex justify-between gap-2 text-[12px]">
                    <span className="text-foreground">&ldquo;{a.name}&rdquo;</span>
                    <span className="shrink-0 text-muted-foreground">
                      last ran {a.lastActive ? formatDate(a.lastActive) : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-[12px] text-muted-foreground">None</p>
            )}
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Next two weeks (Oct 1&ndash;11)
          </p>
          <h4 className="mt-0.5 text-[13px] font-semibold text-foreground">October refresh</h4>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            Updates go live Oct 1, then each test runs a full 10 days before we review.
          </p>
          <div className="mt-4 space-y-4">
            {OCTOBER_PLAN.map((group) => (
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

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">October goals</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <GoalCard label="Cost per follower" value="about $2.00" sub={`September (${period}): ${money(septCpf)}`} />
          <GoalCard
            label="Profile visitors who follow"
            value="20%+"
            sub={`September (${period}): ${pct(followRate(s.followerGrowth), 1)}`}
          />
          <GoalCard
            label="Follower-growth spend on Instagram"
            value="100%"
            sub={`Jul–Sep: ${pct(r.instagramSpendShare)} (no platform split in the daily export)`}
          />
          <GoalCard
            label="Share of follows from 18–34"
            value={
              <label className="flex items-center gap-1">
                <span className="sr-only">Target share of follows from ages 18 to 34, in percent</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  value={ageTarget}
                  onChange={(e) => setAgeTarget(e.target.value)}
                  placeholder="Set"
                  className="w-16 rounded-md border border-border bg-card px-1.5 py-0.5 text-lg font-semibold tabular-nums"
                />
                <span>%</span>
              </label>
            }
            sub={`Jul–Sep baseline: ${pct(r.headline.young)}`}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Creative testing tracker</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Results fill in once October data is added. Messaging angle and status can be edited here.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[680px] text-xs">
            <thead className="text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Creative</th>
                <th className="px-3 py-2 text-left font-medium">Launch</th>
                <th className="px-3 py-2 text-left font-medium">Messaging angle</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Follows</th>
                <th className="px-3 py-2 text-right font-medium">Cost per follow</th>
                <th className="px-3 py-2 text-right font-medium">% from 18–34</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t, i) => (
                <tr key={t.launch} className="border-t border-border/50">
                  <td className="px-3 py-2 font-medium text-foreground">{t.creative}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{t.launch}</td>
                  <td className="px-3 py-2">
                    <input
                      value={t.angle}
                      onChange={(e) => updateTest(i, { angle: e.target.value })}
                      placeholder="Add angle"
                      aria-label={`Messaging angle for ${t.creative}`}
                      className="w-full min-w-32 rounded-md border border-border bg-card px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={t.status}
                      onChange={(e) => updateTest(i, { status: e.target.value as TestStatus })}
                      aria-label={`Status for ${t.creative}`}
                      className="rounded-md border border-border bg-card px-2 py-1"
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st || "—"}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground">—</td>
                  <td className="px-3 py-2 text-right text-muted-foreground">—</td>
                  <td className="px-3 py-2 text-right text-muted-foreground">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-xs font-semibold text-foreground">How spend works going forward</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-foreground/80">
          Starting in Q4, most of the budget backs ads that have already proven themselves, with a smaller share set
          aside for testing new creative. Proven ads keep results steady while tests find the next winner.
        </p>
      </div>
    </section>
  )
}

import { SEPTEMBER_CLOSEOUT, cpf, followRate, formatDate, type AdSetRow, type Totals } from "@/lib/data/meta/analytics"
import { int, money, pct } from "@/lib/data/meta/format"

const TH = "px-3 py-2 text-right font-medium whitespace-nowrap"
const TD = "px-3 py-2 text-right tabular-nums whitespace-nowrap"

function MetricCells({ t }: { t: Totals }) {
  return (
    <>
      <td className={TD}>{money(t.spend)}</td>
      <td className={TD}>{int(t.follows)}</td>
      <td className={TD}>{money(cpf(t))}</td>
      <td className={TD}>{int(t.visits)}</td>
      <td className={TD}>{pct(followRate(t), 1)}</td>
    </>
  )
}

function AdSetGroup({ label, rows, totals }: { label: string; rows: AdSetRow[]; totals: Totals }) {
  return (
    <tbody className="border-t border-border">
      {rows.map((r) => (
        <tr key={r.name} className="border-b border-border/50 last:border-0">
          <td className="px-3 py-2 text-left text-foreground">{r.name}</td>
          <MetricCells t={r} />
        </tr>
      ))}
      <tr className="bg-muted/40 font-semibold">
        <td className="px-3 py-2 text-left">{label} total</td>
        <MetricCells t={totals} />
      </tr>
    </tbody>
  )
}

export function SeptemberTables() {
  const s = SEPTEMBER_CLOSEOUT
  const range = `${formatDate(s.firstDate)}–${formatDate(s.lastDate)}`

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">September by ad set</h3>
        <p className="text-[11px] text-muted-foreground">
          {range}. Follower metrics count only the follower-growth campaign; retail &amp; awareness spend is shown
          separately.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-xs">
            <thead className="text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Ad set</th>
                <th className={TH}>Spend</th>
                <th className={TH}>Follows</th>
                <th className={TH}>Cost per follow</th>
                <th className={TH}>Profile visits</th>
                <th className={TH}>Follow rate</th>
              </tr>
            </thead>
            <AdSetGroup
              label="Follower growth"
              rows={s.adSets.filter((r) => r.followerGrowth)}
              totals={s.followerGrowth}
            />
            <AdSetGroup
              label="Retail & awareness"
              rows={s.adSets.filter((r) => !r.followerGrowth)}
              totals={s.retail}
            />
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">September by ad</h3>
        <p className="text-[11px] text-muted-foreground">
          {range}, sorted by follows. Retired means the ad stopped running before {formatDate(s.lastDate)}.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[820px] text-xs">
            <thead className="text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Ad</th>
                <th className={TH}>Spend</th>
                <th className={TH}>Follows</th>
                <th className={TH}>Cost per follow</th>
                <th className={TH}>Profile visits</th>
                <th className={TH}>Follow rate</th>
                <th className={TH}>First active</th>
                <th className={TH}>Last active</th>
              </tr>
            </thead>
            <tbody>
              {s.ads.map((a) => (
                <tr key={a.name} className="border-t border-border/50">
                  <td className="px-3 py-2 text-left">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-foreground">{a.name}</span>
                      {a.retired && (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          Retired
                        </span>
                      )}
                      {!a.followerGrowth && (
                        <span className="text-[10px] text-muted-foreground">Retail &amp; awareness</span>
                      )}
                    </div>
                  </td>
                  <MetricCells t={a} />
                  <td className={TD}>{a.firstActive ? formatDate(a.firstActive) : "—"}</td>
                  <td className={TD}>{a.lastActive ? formatDate(a.lastActive) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

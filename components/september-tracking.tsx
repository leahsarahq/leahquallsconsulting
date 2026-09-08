const PACE_ROWS = [
  { metric: "Total spend/day", july: "$256.02", august: "$254.18", september: "$434.55" },
  { metric: "Total follows/day", july: "56.4", august: "32.3", september: "63.3" },
  { metric: "Engagement campaign follows/day", july: "56.2", august: "32.2", september: "63.1" },
  { metric: "Engagement cost/follow", july: "$1.79", august: "$2.96", september: "$2.76" },
]

const SUMMARY =
  "September's early numbers could be read as 'more spend buying more follows' — but the structural fix recommended after August's review has actually landed: the Engagement campaign is back to two parallel ad sets, and the new broader-audience ad set is converting better than the original so far. What's holding blended cost-per-follow above July's level now looks like a creative issue in the flagship ad set specifically (a new low-converting post), not a structural or budget one."

const STRUCTURAL_FIX =
  "The Engagement campaign has been restructured back to two parallel ad sets, as recommended after August's review: 'Existing Posts (Lookalike 1%+Retailers+Cooking)' ($92.22/day) and a new 'Existing Posts (Broad + 24-64)' ($82.25/day) testing a wider, non-lookalike audience. Early results favor the new audience: Broad is converting at an 8.78% visit-to-follow rate and $2.38 cost-per-follow, ahead of Lookalike's 5.30% and $3.22. It's only 8 days of data, but if that gap holds, shifting more budget toward the Broad audience is worth testing."

const NEW_CREATIVE =
  "The Lookalike ad set is now dominated by a new post, 'Ripi x sourmilk' (creator/influencer collaboration), which is pulling solid profile-visit volume but converting at only 2.6–7.5% day to day (averaging ~4–5%) — well below the 30%+ rate that made 'Imagine Hating On Me,' '4 Easy Pasta Dinners,' and 'Frozen Pasta Can't Be That Good' the benchmark in August. This is the same pattern as August's 'What Did I Just Witness': high-reach, low-convert content sitting inside the follower-growth ad set and dragging its blended rate down. The Broad ad set, by contrast, is running the proven Frozen Pasta / Cacio e Pepe Puffs combo — which is a plausible reason it's outconverting Lookalike right now. Worth deciding whether 'Ripi x sourmilk' belongs in this ad set at all, or whether it's better suited to a reach/awareness placement, the same call made on 'What Did I Just Witness.'"

const ALSO_RESTRUCTURED =
  "Instagram Awareness Campaign now runs two parallel audience tests too — 'Audience Test (Young Millennials)' ($46.18/day) and 'Audience Test (Parents + Cooking)' ($65.12/day) — mirroring July's approach. Both are at 0 follows as expected for an awareness objective, and frequency is healthy (1.01–1.04, no fatigue). Separately, the revived Retailer Support Awareness layer turned out to include a new retailer: 'September Meijer Promo' alongside 'September Whole Foods Promo,' both only 2 days old and too early to read."

const RETAILER_TRAFFIC =
  "Retailer Support Traffic is tracking in line with August — CTR and CPM both close to August's trailing range, no material change."

export function SeptemberTracking() {
  return (
    <section
      aria-labelledby="september-tracking-heading"
      className="rounded-xl border border-dashed border-border bg-muted/40 p-4 md:p-5"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
        <h3 id="september-tracking-heading" className="text-sm font-semibold text-foreground">
          September Tracking
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
          In progress
        </span>
        <span className="text-xs text-muted-foreground">Month-to-Date (Sept 1–8)</span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed text-pretty mt-3">{SUMMARY}</p>

      {/* Pace comparison */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] text-muted-foreground uppercase tracking-wide border-b border-border">
              <th className="font-medium py-2 pr-4">Pace</th>
              <th className="font-medium py-2 px-3 text-right whitespace-nowrap">July (full)</th>
              <th className="font-medium py-2 px-3 text-right whitespace-nowrap">August (full)</th>
              <th className="font-medium py-2 pl-3 text-right whitespace-nowrap">Sept (MTD, 8d)</th>
            </tr>
          </thead>
          <tbody>
            {PACE_ROWS.map((row) => (
              <tr key={row.metric} className="border-b border-border/60 last:border-0">
                <td className="py-2 pr-4 text-foreground">{row.metric}</td>
                <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">{row.july}</td>
                <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">{row.august}</td>
                <td className="py-2 pl-3 text-right tabular-nums text-foreground font-medium">{row.september}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Structural Fix Confirmed */}
      <div className="mt-4 rounded-lg border border-border bg-background p-4">
        <p className="text-[11px] uppercase tracking-wide text-green-600 font-semibold mb-1">Structural Fix Confirmed</p>
        <p className="text-xs text-muted-foreground leading-relaxed text-pretty">{STRUCTURAL_FIX}</p>
      </div>

      {/* New Creative to Watch */}
      <div className="mt-3 rounded-lg border border-border bg-background p-4">
        <p className="text-[11px] uppercase tracking-wide text-amber-600 font-semibold mb-1">New Creative to Watch</p>
        <p className="text-xs text-muted-foreground leading-relaxed text-pretty">{NEW_CREATIVE}</p>
      </div>

      {/* Informational notes */}
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="border-l-2 border-border pl-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Also Restructured</p>
          <p className="text-xs text-muted-foreground leading-relaxed text-pretty">{ALSO_RESTRUCTURED}</p>
        </div>
        <div className="border-l-2 border-border pl-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Retailer Support Traffic</p>
          <p className="text-xs text-muted-foreground leading-relaxed text-pretty">{RETAILER_TRAFFIC}</p>
        </div>
      </div>
    </section>
  )
}

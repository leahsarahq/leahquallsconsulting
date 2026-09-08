"use client"

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { KPICard } from "@/components/kpi-card"
import { ChartSection } from "@/components/chart-section"
import { SeptemberTracking } from "@/components/september-tracking"
import { getDataForMonth } from "@/lib/data"
import { getComparison } from "@/lib/data/comparisons"
import { useMonth } from "@/lib/month-context"

function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-3">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  )
}

// % change where higher is better (growth metrics)
function pctDelta(current: number, baseline: number | null): number | null {
  if (baseline == null || baseline === 0) return null
  return Math.round(((current - baseline) / baseline) * 100)
}

// % improvement where lower is better (cost metrics like CPF)
function pctImprovement(current: number, baseline: number | null): number | null {
  if (baseline == null || baseline === 0) return null
  return Math.round(((baseline - current) / baseline) * 100)
}

// Small inline delta badge: green for good, red for bad, muted dash when N/A.
function DeltaBadge({ value, suffix = "%" }: { value: number | null; suffix?: string }) {
  if (value == null) return <span className="text-xs text-muted-foreground">—</span>
  if (value > 0) return <span className="text-xs font-medium text-green-600">+{value}{suffix}</span>
  if (value < 0) return <span className="text-xs font-medium text-red-600">{value}{suffix}</span>
  return <span className="text-xs text-muted-foreground">same</span>
}

export function OverviewTab() {
  const { selectedMonth, monthInfo, comparisonMode } = useMonth()
  const { kpiData, spendByCampaign, weeklyFollows, overviewAnalysis } = getDataForMonth(selectedMonth)
  const comparison = getComparison(selectedMonth, comparisonMode)

  const baseline = comparison.metrics
  const hasComparison = comparison.available

  // Growth metrics (higher is better)
  const followsDelta = pctDelta(kpiData.followerGrowth, baseline.followerGrowth)
  const ctrDelta = pctDelta(kpiData.engagementCTR, baseline.engagementCTR)
  const impressionsDelta = pctDelta(kpiData.totalImpressions, baseline.totalImpressions)
  const paidFollowsDelta = pctDelta(kpiData.paidFollows, baseline.paidFollows)
  const messagingDelta = pctDelta(kpiData.messagingContacts, baseline.messagingContacts)
  // Cost metric (lower is better)
  const cpfImprovement = pctImprovement(kpiData.blendedCPF, baseline.blendedCPF)
  // Engagement-only CPF for the month-vs-month comparison (Engagement campaign
  // spend ÷ its follows), lower is better.
  const engagementCpfImprovement = pctImprovement(kpiData.engagementCPF, baseline.engagementCPF)

  const followsMultiple =
    baseline.followerGrowth && baseline.followerGrowth > 0
      ? kpiData.followerGrowth / baseline.followerGrowth
      : null

  return (
    <div className="space-y-4">
      {/* Executive Summary (months with a narrative analysis, e.g. August) */}
      {overviewAnalysis && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-sm font-semibold text-foreground">Executive Summary — {monthInfo.label}</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{overviewAnalysis.executiveSummary}</p>
        </div>
      )}

      {/* Key Wins — hidden for months that carry a narrative analysis instead */}
      {!overviewAnalysis && (
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Key Wins — {monthInfo.label}</h3>
          {hasComparison && (
            <span className="text-[11px] text-muted-foreground">{comparison.label.startsWith("vs") ? comparison.label : `vs. ${comparison.label}`}</span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Follower growth win */}
          <div className="flex gap-3">
            <div className="w-1 bg-primary rounded-full flex-shrink-0" />
            <div>
              {hasComparison && followsMultiple && followsMultiple >= 2 ? (
                <>
                  <p className="text-sm font-medium text-foreground">{followsMultiple.toFixed(1)}x follower growth vs. {comparison.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {kpiData.followerGrowth.toLocaleString()} vs. ~{Math.round(baseline.followerGrowth!).toLocaleString()} follows
                  </p>
                </>
              ) : hasComparison && followsDelta != null && followsDelta > 0 ? (
                <>
                  <p className="text-sm font-medium text-foreground">+{followsDelta}% follower growth vs. {comparison.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {kpiData.followerGrowth.toLocaleString()} vs. {Math.round(baseline.followerGrowth!).toLocaleString()} follows
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-foreground">{kpiData.followerGrowth.toLocaleString()} new follows</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    in {monthInfo.label}
                    {kpiData.giveawayFollows ? ` · incl. ${kpiData.giveawayFollows} giveaway` : ""}
                  </p>
                </>
              )}
            </div>
          </div>
          {/* CPF win — lead with Engagement CPF when no organic export exists,
              since blended CPF is inflated and not an apples-to-apples figure. */}
          <div className="flex gap-3">
            <div className="w-1 bg-primary rounded-full flex-shrink-0" />
            <div>
              {kpiData.organicExportMissing ? (
                <>
                  <p className="text-sm font-medium text-foreground">Engagement CPF ${kpiData.engagementCPF.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    follow-driving campaign · within $2–5 benchmark for new CPG brands
                  </p>
                </>
              ) : hasComparison && cpfImprovement != null && cpfImprovement > 0 ? (
                <>
                  <p className="text-sm font-medium text-foreground">CPF improved {cpfImprovement}% vs. {comparison.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ${kpiData.blendedCPF.toFixed(2)} vs. ${baseline.blendedCPF!.toFixed(2)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-foreground">CPF 40–75% below industry benchmark</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ${kpiData.blendedCPF.toFixed(2)} blended CPF vs. $2–5 typical for new CPG brands
                  </p>
                </>
              )}
            </div>
          </div>
          {/* CTR win */}
          <div className="flex gap-3">
            <div className="w-1 bg-primary rounded-full flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Engagement CTR {kpiData.engagementCTR.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {(kpiData.engagementCTR / 1.6).toFixed(1)}x industry average (1.2–1.6%)
              </p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Snapshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Total follows</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-semibold">{kpiData.followerGrowth.toLocaleString()}</span>
            {hasComparison && <DeltaBadge value={followsDelta} />}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {hasComparison && baseline.followerGrowth != null
              ? `vs. ${comparison.shortLabel} (${Math.round(baseline.followerGrowth).toLocaleString()})`
              : "this month"}
            {kpiData.giveawayFollows && <span className="italic"> · incl. {kpiData.giveawayFollows} giveaway</span>}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Total impressions</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-semibold">{(kpiData.totalImpressions / 1000).toFixed(0)}K</span>
            {hasComparison && <DeltaBadge value={impressionsDelta} />}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">all campaigns</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Paid attributed</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-semibold">{kpiData.paidFollows.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">follows</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">from Ads Manager</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Awareness lift</p>
          {kpiData.organicExportMissing ? (
            <>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-semibold">n/a</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">no IG Insights export this month</p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-semibold">+{kpiData.followerGrowth - kpiData.paidFollows}</span>
                <span className="text-xs text-muted-foreground">follows</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">unattributed (organic + halo)</p>
            </>
          )}
        </div>
      </div>

      {/* Comparison detail */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          {monthInfo.label} vs. {comparison.label}
        </h3>
        {hasComparison ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Engagement CPF</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-semibold">${kpiData.engagementCPF.toFixed(2)}</span>
                {engagementCpfImprovement == null ? (
                  <span className="text-xs text-muted-foreground">—</span>
                ) : engagementCpfImprovement > 0 ? (
                  <span className="text-xs font-medium text-green-600">{engagementCpfImprovement}% better</span>
                ) : engagementCpfImprovement < 0 ? (
                  <span className="text-xs font-medium text-red-600">{Math.abs(engagementCpfImprovement)}% higher</span>
                ) : (
                  <span className="text-xs text-muted-foreground">same</span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {baseline.engagementCPF != null ? `was $${baseline.engagementCPF.toFixed(2)} · engagement spend only` : "no ad spend in period"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Engagement CTR</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-semibold">{kpiData.engagementCTR.toFixed(1)}%</span>
                <DeltaBadge value={ctrDelta} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {baseline.engagementCTR != null ? `was ${baseline.engagementCTR.toFixed(1)}%` : "no ads in period"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Impressions</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-semibold">{(kpiData.totalImpressions / 1000).toFixed(0)}K</span>
                <DeltaBadge value={impressionsDelta} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {baseline.totalImpressions != null ? `was ${(baseline.totalImpressions / 1000).toFixed(0)}K` : "no ads in period"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Paid Follows</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-semibold">{kpiData.paidFollows.toLocaleString()}</span>
                <DeltaBadge value={paidFollowsDelta} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {baseline.paidFollows != null ? `was ${Math.round(baseline.paidFollows).toLocaleString()}` : "no ads in period"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            No prior month available — {monthInfo.label} is the first month with ad data. Try
            comparing vs. last quarter or YTD.
          </p>
        )}
      </div>

      {/* Campaign Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard
          label="Total spend"
          value={`$${kpiData.totalSpend.toLocaleString()}`}
          subtext={monthInfo.dateRange}
        />
        <KPICard
          label={kpiData.organicExportMissing ? "Blended CPF (inflated)" : "Blended CPF"}
          value={`$${kpiData.blendedCPF.toFixed(2)}`}
          subtext={kpiData.organicExportMissing ? "all spend ÷ paid follows · see Engagement CPF" : "cost per follower"}
        />
        <KPICard
          label="Total reach"
          value={`${(kpiData.totalReach / 1000).toFixed(0)}K`}
          subtext="3 campaigns"
        />
        <KPICard
          label="Messaging contacts"
          value={kpiData.messagingContacts ? kpiData.messagingContacts : "—"}
          subtext={
            !kpiData.messagingContacts
              ? "not imported this month"
              : hasComparison && messagingDelta != null
                ? `${messagingDelta > 0 ? "+" : ""}${messagingDelta}% vs. ${comparison.shortLabel}`
                : "messaging contacts"
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChartSection title="Spend by campaign" subtitle={`${monthInfo.label} total: $${kpiData.totalSpend.toLocaleString()}`}>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendByCampaign}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {spendByCampaign.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value}`, "Spend"]}
                  contentStyle={{
                    backgroundColor: "#fbf9f4",
                    border: "1px solid #e0ddd4",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <Legend
            items={spendByCampaign.map((c) => ({
              color: c.color,
              label: `${c.name} $${c.value}`,
            }))}
          />
        </ChartSection>

        <ChartSection title="Follower growth by week" subtitle={kpiData.organicExportMissing ? "Ad-attributed follows only — no IG Insights export this month" : "Total follows from Instagram Insights"}>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyFollows}>
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 10, fill: "#888" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#888" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fbf9f4",
                    border: "1px solid #e0ddd4",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="total" fill="#D93732" name="Total follows" radius={[3, 3, 0, 0]} />
                <Bar dataKey="paid" fill="#660033" name="Paid attributed" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Legend
            items={[
              { color: "#D93732", label: "Total follows" },
              { color: "#660033", label: "Paid attributed" },
            ]}
          />
        </ChartSection>
      </div>

      {overviewAnalysis && (
        <>
          {/* Campaign Objectives — judge each campaign on its own goal, not a blended standard */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Campaign Objectives</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {overviewAnalysis.campaignObjectives.map((c) => (
                <div key={c.name} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
                  <p className="text-sm font-semibold text-foreground text-balance">{c.name}</p>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Objective</p>
                    <p className="text-xs text-foreground mt-0.5">{c.objective}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Judge on</p>
                    <p className="text-xs text-foreground mt-0.5">{c.judgeOn}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-auto pt-1">{c.stat}</p>
                </div>
              ))}
            </div>
          </div>

          {/* July → August: What Changed */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              {overviewAnalysis.monthChange.priorLabel} → {overviewAnalysis.monthChange.currentLabel}: What Changed
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] text-muted-foreground uppercase tracking-wide border-b border-border">
                    <th className="font-medium py-2 pr-4">Metric</th>
                    <th className="font-medium py-2 px-3 text-right">{overviewAnalysis.monthChange.priorLabel}</th>
                    <th className="font-medium py-2 px-3 text-right">{overviewAnalysis.monthChange.currentLabel}</th>
                    <th className="font-medium py-2 pl-3 text-right">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {overviewAnalysis.monthChange.rows.map((row) => (
                    <tr key={row.metric} className="border-b border-border/60 last:border-0">
                      <td className="py-2 pr-4 text-foreground">{row.metric}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">{row.prior}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-foreground font-medium">{row.current}</td>
                      <td
                        className={`py-2 pl-3 text-right tabular-nums font-medium ${
                          row.dir === "bad"
                            ? "text-red-600"
                            : row.dir === "good"
                              ? "text-green-600"
                              : "text-muted-foreground"
                        }`}
                      >
                        {row.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-3 text-pretty">
              {overviewAnalysis.monthChange.explanation}
            </p>
            {overviewAnalysis.monthChange.caveat && (
              <div className="mt-3 border-l-2 border-border pl-3">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Caveat</p>
                <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
                  {overviewAnalysis.monthChange.caveat}
                </p>
              </div>
            )}
          </div>

          {/* Follower Growth Deep Dive */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">{overviewAnalysis.deepDive.title}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] text-muted-foreground uppercase tracking-wide border-b border-border">
                    <th className="font-medium py-2 pr-3">Week</th>
                    <th className="font-medium py-2 px-3 text-right">Spend</th>
                    <th className="font-medium py-2 px-3 text-right">Follows</th>
                    <th className="font-medium py-2 px-3 text-right">Cost/Follow</th>
                    <th className="font-medium py-2 px-3 text-right">Profile Visits</th>
                    <th className="font-medium py-2 pl-3 text-right">Visit→Follow</th>
                  </tr>
                </thead>
                <tbody>
                  {overviewAnalysis.deepDive.weekly.map((w) => (
                    <tr key={w.week} className="border-b border-border/60 last:border-0">
                      <td className="py-2 pr-3 text-foreground">{w.week}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">{w.spend}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-foreground">{w.follows}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">{w.costPerFollow}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">{w.profileVisits}</td>
                      <td className="py-2 pl-3 text-right tabular-nums text-foreground font-medium">{w.visitToFollow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] text-muted-foreground uppercase tracking-wide border-b border-border">
                    <th className="font-medium py-2 pr-3">Ad</th>
                    <th className="font-medium py-2 px-3">Ran</th>
                    <th className="font-medium py-2 px-3 text-right">Profile Visits</th>
                    <th className="font-medium py-2 px-3 text-right">Follows</th>
                    <th className="font-medium py-2 pl-3 text-right">Visit→Follow</th>
                  </tr>
                </thead>
                <tbody>
                  {overviewAnalysis.deepDive.creative.map((ad) => (
                    <tr key={ad.ad} className="border-b border-border/60 last:border-0">
                      <td className="py-2 pr-3 text-foreground text-pretty">{ad.ad}</td>
                      <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">{ad.ran}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">{ad.profileVisits}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-foreground">{ad.follows}</td>
                      <td className="py-2 pl-3 text-right tabular-nums text-foreground font-medium">{ad.visitToFollow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-3 text-pretty">{overviewAnalysis.deepDive.caption}</p>
          </div>

          <SeptemberTracking />
        </>
      )}
    </div>
  )
}

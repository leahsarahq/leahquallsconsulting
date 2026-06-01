"use client"

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { KPICard } from "@/components/kpi-card"
import { ChartSection } from "@/components/chart-section"
import { getDataForMonth, Q1_BASELINE } from "@/lib/data"
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

export function OverviewTab() {
  const { selectedMonth, monthInfo } = useMonth()
  const { kpiData, spendByCampaign, weeklyFollows, previousMonth } = getDataForMonth(selectedMonth)
  
  // Calculate lifts vs Q1 baseline (avg of Jan-Mar, no ads)
  const baselineFollows = Q1_BASELINE.avgMonthlyFollows
  const baselineMessaging = Q1_BASELINE.march.messagingContacts
  const followsLift = Math.round(((kpiData.followerGrowth - baselineFollows) / baselineFollows) * 100)
  const messagingLift = Math.round(((kpiData.messagingContacts - baselineMessaging) / baselineMessaging) * 100)
  const followsMultiple = (kpiData.followerGrowth / baselineFollows).toFixed(1)
  
  // Month-over-month improvements (for May+)
  const hasPreviousMonth = previousMonth !== null
  const cpfImprovement = hasPreviousMonth 
    ? Math.round(((previousMonth.kpiData.blendedCPF - kpiData.blendedCPF) / previousMonth.kpiData.blendedCPF) * 100)
    : 0
  const ctrChange = hasPreviousMonth
    ? Math.round(((kpiData.engagementCTR - previousMonth.kpiData.engagementCTR) / previousMonth.kpiData.engagementCTR) * 100)
    : 0
  const impressionsChange = hasPreviousMonth
    ? Math.round(((kpiData.totalImpressions - previousMonth.kpiData.totalImpressions) / previousMonth.kpiData.totalImpressions) * 100)
    : 0
  const paidFollowsChange = hasPreviousMonth
    ? Math.round(((kpiData.paidFollows - previousMonth.kpiData.paidFollows) / previousMonth.kpiData.paidFollows) * 100)
    : 0

  return (
    <div className="space-y-4">
      {/* Key Wins */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Key Wins — {monthInfo.label}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-3">
            <div className="w-1 bg-primary rounded-full flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">{followsMultiple}x follower growth vs. baseline</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {kpiData.followerGrowth.toLocaleString()} follows vs. ~{baselineFollows} avg (Jan–Mar, no ads)
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-1 bg-primary rounded-full flex-shrink-0" />
            <div>
              {hasPreviousMonth && cpfImprovement > 0 ? (
                <>
                  <p className="text-sm font-medium text-foreground">CPF improved {cpfImprovement}% from {previousMonth.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ${kpiData.blendedCPF.toFixed(2)} vs. ${previousMonth.kpiData.blendedCPF.toFixed(2)} last month
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

      {/* Month-over-Month Comparison */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Total follows</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-semibold">{kpiData.followerGrowth.toLocaleString()}</span>
            <span className="text-xs font-medium text-green-600">+{followsLift}%</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">vs. ~{baselineFollows} avg (Jan–Mar)</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Total impressions</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-semibold">{(kpiData.totalImpressions / 1000).toFixed(0)}K</span>
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
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-semibold">+{kpiData.followerGrowth - kpiData.paidFollows}</span>
            <span className="text-xs text-muted-foreground">follows</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">unattributed (organic + halo)</p>
        </div>
      </div>

      {/* vs. Previous Month (only show if there's a previous month) */}
      {hasPreviousMonth && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">vs. {previousMonth.label}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">CPF</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-semibold">${kpiData.blendedCPF.toFixed(2)}</span>
                {cpfImprovement > 0 ? (
                  <span className="text-xs font-medium text-green-600">{cpfImprovement}% better</span>
                ) : cpfImprovement < 0 ? (
                  <span className="text-xs font-medium text-red-600">{Math.abs(cpfImprovement)}% higher</span>
                ) : (
                  <span className="text-xs text-muted-foreground">same</span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">was ${previousMonth.kpiData.blendedCPF.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Engagement CTR</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-semibold">{kpiData.engagementCTR.toFixed(1)}%</span>
                {ctrChange > 0 ? (
                  <span className="text-xs font-medium text-green-600">+{ctrChange}%</span>
                ) : ctrChange < 0 ? (
                  <span className="text-xs font-medium text-red-600">{ctrChange}%</span>
                ) : (
                  <span className="text-xs text-muted-foreground">same</span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">was {previousMonth.kpiData.engagementCTR.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Impressions</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-semibold">{(kpiData.totalImpressions / 1000).toFixed(0)}K</span>
                {impressionsChange > 0 ? (
                  <span className="text-xs font-medium text-green-600">+{impressionsChange}%</span>
                ) : impressionsChange < 0 ? (
                  <span className="text-xs font-medium text-red-600">{impressionsChange}%</span>
                ) : (
                  <span className="text-xs text-muted-foreground">same</span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">was {(previousMonth.kpiData.totalImpressions / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Paid Follows</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-semibold">{kpiData.paidFollows.toLocaleString()}</span>
                {paidFollowsChange > 0 ? (
                  <span className="text-xs font-medium text-green-600">+{paidFollowsChange}%</span>
                ) : paidFollowsChange < 0 ? (
                  <span className="text-xs font-medium text-red-600">{paidFollowsChange}%</span>
                ) : (
                  <span className="text-xs text-muted-foreground">same</span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">was {previousMonth.kpiData.paidFollows.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard
          label="Total spend"
          value={`$${kpiData.totalSpend.toLocaleString()}`}
          subtext={monthInfo.dateRange}
        />
        <KPICard
          label="Blended CPF"
          value={`$${kpiData.blendedCPF.toFixed(2)}`}
          subtext="cost per follower"
        />
        <KPICard
          label="Total reach"
          value={`${(kpiData.totalReach / 1000).toFixed(0)}K`}
          subtext="3 campaigns"
        />
        <KPICard
          label="Messaging contacts"
          value={kpiData.messagingContacts}
          subtext={`+${messagingLift}% vs. baseline`}
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

        <ChartSection title="Follower growth by week" subtitle="Total follows from Instagram Insights">
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

      
    </div>
  )
}

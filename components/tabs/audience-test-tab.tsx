"use client"

import { ChartSection } from "@/components/chart-section"
import { getDataForMonth } from "@/lib/data"
import { useMonth } from "@/lib/month-context"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

export function AudienceTestTab() {
  const { selectedMonth } = useMonth()
  const { audienceTest } = getDataForMonth(selectedMonth)

  if (!audienceTest) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <p className="text-muted-foreground">No audience testing data available for this month.</p>
      </div>
    )
  }

  const cpmData = [
    { name: audienceTest.baseline.name, cpm: audienceTest.baseline.cpm, fill: "#999999" },
    ...audienceTest.tests.map((test) => ({
      name: test.name,
      cpm: test.cpm,
      fill: test.name === audienceTest.winner ? "#D93732" : "#E8853A", // Brand colors: primary red for winner, orange for other
    })),
  ]

  const winnerTest = audienceTest.tests.find(t => t.name === audienceTest.winner)
  const loserTest = audienceTest.tests.find(t => t.name !== audienceTest.winner)

  return (
    <div className="space-y-4">
      {/* Key Wins */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Key Wins — Audience Testing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-3">
            <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: "#D93732" }} />
            <div>
              <p className="text-sm font-medium text-foreground">{audienceTest.winner} wins</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ${winnerTest?.cpm.toFixed(2)} CPM — ${(audienceTest.baseline.cpm - (winnerTest?.cpm || 0)).toFixed(2)} cheaper than baseline
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: "#D93732" }} />
            <div>
              <p className="text-sm font-medium text-foreground">{((1 - (winnerTest?.cpm || 0) / audienceTest.baseline.cpm) * 100).toFixed(0)}% CPM savings</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                vs. pasta + frozen food benchmark (${audienceTest.baseline.cpm})
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: "#D93732" }} />
            <div>
              <p className="text-sm font-medium text-foreground">Us v. Them top creative</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {winnerTest?.winningCreativeCtr}% CTR, ${winnerTest?.winningCreativeCpc?.toFixed(2)} CPC in winning audience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CPM Comparison Chart */}
      <ChartSection title="CPM by audience" subtitle="Lower is better · Baseline: $1.85 (pasta + frozen food)">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cpmData} layout="vertical">
              <XAxis type="number" domain={[0, 2]} tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toFixed(2)}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fbf9f4",
                  border: "1px solid #e0ddd4",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "CPM"]}
              />
              <Bar dataKey="cpm" radius={[0, 4, 4, 0]}>
                {cpmData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartSection>

      {/* Test Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {audienceTest.tests.map((test) => (
          <div 
            key={test.name} 
            className="bg-card border rounded-xl p-4"
            style={{ 
              borderColor: test.name === audienceTest.winner ? "#D93732" : undefined,
              borderWidth: test.name === audienceTest.winner ? "2px" : undefined
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-foreground">{test.name}</h4>
              {test.name === audienceTest.winner && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full uppercase" style={{ backgroundColor: "rgba(217, 55, 50, 0.1)", color: "#D93732" }}>Winner</span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mb-3">{test.dateRange} · {test.audience}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">CPM</p>
                <p className="text-lg font-semibold">${test.cpm.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground">
                  {test.cpm < audienceTest.baseline.cpm ? (
                    <span style={{ color: "#D93732" }}>${(audienceTest.baseline.cpm - test.cpm).toFixed(2)} below baseline</span>
                  ) : (
                    <span className="text-destructive">${(test.cpm - audienceTest.baseline.cpm).toFixed(2)} above baseline</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">CTR</p>
                <p className="text-lg font-semibold">{test.ctr.toFixed(2)}%</p>
                <p className="text-[10px] text-muted-foreground">link click-through</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Impressions</p>
                <p className="text-lg font-semibold">{(test.impressions / 1000).toFixed(0)}K</p>
                <p className="text-[10px] text-muted-foreground">${test.spend.toFixed(0)} spend</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">CPC</p>
                <p className="text-lg font-semibold">${test.cpc.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground">{test.clicks.toLocaleString()} clicks</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Winning Creative</p>
              <p className="text-sm font-medium">{test.winningCreative}</p>
              <p className="text-[10px] text-muted-foreground">{test.winningCreativeCtr}% CTR · ${test.winningCreativeCpc?.toFixed(2)} CPC</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="text-sm font-semibold text-foreground mb-2">Recommendation</h4>
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">{audienceTest.winner}</strong> delivered the best CPM at ${winnerTest?.cpm.toFixed(2)}, 
          which is {audienceTest.winnerReason}. Use this audience for awareness campaigns going forward. 
          Continue testing "Us v. Them" creative against new ad-native formats to beat the {winnerTest?.winningCreativeCtr}% CTR benchmark.
        </p>
      </div>
    </div>
  )
}

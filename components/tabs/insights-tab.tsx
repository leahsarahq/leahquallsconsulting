"use client"

import { ChartSection } from "@/components/chart-section"
import { getDataForMonth } from "@/lib/data"
import { useMonth } from "@/lib/month-context"

function BenchmarkCard({
  metric,
  value,
  benchmark,
  verdict,
  explanation,
}: {
  metric: string
  value: string
  benchmark: string
  verdict: "excellent" | "good" | "average" | "below"
  explanation: string
}) {
  const verdictColors = {
    excellent: "bg-green-100 text-green-800",
    good: "bg-blue-100 text-blue-800",
    average: "bg-yellow-100 text-yellow-800",
    below: "bg-red-100 text-red-800",
  }
  const verdictLabels = {
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    below: "Below avg",
  }

  return (
    <div className="bg-card rounded-xl p-4 border border-border/60">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
            {metric}
          </p>
          <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${verdictColors[verdict]}`}>
          {verdictLabels[verdict]}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">
        <span className="font-medium">Industry benchmark:</span> {benchmark}
      </p>
      <p className="text-xs text-foreground/80 leading-relaxed">{explanation}</p>
    </div>
  )
}



export function InsightsTab() {
  const { selectedMonth, monthInfo } = useMonth()
  const { kpiData, adsData } = getDataForMonth(selectedMonth)
  
  const totalCreatives = adsData.length
  const engagementCreatives = adsData.filter((ad) => ad.campaign === "Engagement").length
  const awarenessCreatives = adsData.filter((ad) => ad.campaign === "Awareness").length
  const retailerCreatives = adsData.filter((ad) => ad.campaign === "Retailer Support").length

  return (
    <div className="space-y-4">
      {/* Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <BenchmarkCard
          metric="Blended CPF (Cost per Follow)"
          value={`$${kpiData.blendedCPF.toFixed(2)}`}
          benchmark="$2–5 for new CPG brands"
          verdict="excellent"
          explanation={`$${kpiData.blendedCPF.toFixed(2)} CPF is 40-75% below industry average. This accounts for all ${kpiData.followerGrowth.toLocaleString()} followers gained in ${monthInfo.label}, including both paid-attributed and organic lift from awareness campaigns.`}
        />
        <BenchmarkCard
          metric="Total Reach"
          value={`${(kpiData.totalReach / 1000).toFixed(0)}K`}
          benchmark="Varies by spend; ~$5–8 CPM typical"
          verdict="excellent"
          explanation={`${(kpiData.totalReach / 1000).toFixed(0)}K reach on $${(kpiData.totalSpend / 1000).toFixed(1)}K spend equals ~$${((kpiData.totalSpend / kpiData.totalReach) * 1000).toFixed(2)} CPM — roughly 60% below what most CPG brands pay.`}
        />
        <BenchmarkCard
          metric="Engagement CTR"
          value={`${kpiData.engagementCTR}%`}
          benchmark="1–2% average; 3%+ is strong"
          verdict="excellent"
          explanation={`${kpiData.engagementCTR}% CTR on engagement campaigns is exceptional — 3.6x industry average. Top performers like Cacio e Pepe Puffs (6.29%) show strong creative-audience fit.`}
        />
        <BenchmarkCard
          metric="Awareness Lift"
          value={`+${kpiData.followerGrowth - kpiData.paidFollows}`}
          benchmark="Hard to measure directly"
          verdict="good"
          explanation={`${kpiData.followerGrowth - kpiData.paidFollows} followers gained beyond paid attribution — a 6x increase over the Jan–Mar baseline (~341 avg follows/month with no ads). This halo effect from awareness campaigns is a key unmeasured benefit.`}
        />
      </div>

      {/* Creative Analysis */}
      <ChartSection title="Ad creative breakdown">
        <div className="text-xs text-muted-foreground leading-relaxed space-y-3 mt-2">
          <p>
            <span className="font-medium text-foreground">{totalCreatives} total ad creatives ran in {monthInfo.label}:</span>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><span className="font-medium">{engagementCreatives} Engagement creatives</span> — optimized for follows and profile visits</li>
            <li><span className="font-medium">{awarenessCreatives} Awareness creatives</span> — optimized for reach and impressions</li>
            <li><span className="font-medium">{retailerCreatives} Retailer Support creatives</span> — optimized for link clicks to Whole Foods/Target</li>
          </ul>
          <p className="pt-2">
            <span className="font-medium text-foreground">Key learnings:</span>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              <span className="font-medium">UGC-style content wins:</span> "Cacio e Pepe Puffs" and "Frozen Pasta Can&apos;t Be That Good" — both casual, native-feeling videos — drove 93% of paid follows at CPF under $1.
            </li>
            <li>
              <span className="font-medium">Static images underperform on engagement:</span> Hero images and flatlays drove impressions but minimal follows. Save these for awareness objectives.
            </li>
            <li>
              <span className="font-medium">Quick iterations work:</span> Turning off underperformers (7 Minute Meal, Chicken Nugget Style) and adding new creative mid-flight kept efficiency high.
            </li>
            <li>
              <span className="font-medium">Retailer-specific creative is early:</span> Target/Whole Foods CGI ads just launched; too early for conclusive learnings but initial CPC looks reasonable.
            </li>
          </ul>
        </div>
      </ChartSection>

      {/* Industry Benchmarks */}
      <ChartSection title="Industry benchmarks (Better-for-You CPG)">
        <p className="text-xs text-muted-foreground mt-2 mb-4">
          Data sourced from Triple Whale, Varos, Meta, Motion, and Jetfuel Agency (March 2026) for DTC food &amp; beverage brands.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left py-2 px-2 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Metric</th>
                <th className="text-left py-2 px-2 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Industry Benchmark</th>
                <th className="text-left py-2 px-2 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Ripi ({monthInfo.label})</th>
                <th className="text-left py-2 px-2 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">vs. Benchmark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              <tr>
                <td className="py-2.5 px-2 font-medium">Meta CPM</td>
                <td className="py-2.5 px-2">$8–14</td>
                <td className="py-2.5 px-2">~$3.20</td>
                <td className="py-2.5 px-2"><span className="text-green-700 font-medium">60% below avg</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-2 font-medium">Meta CTR (F&B)</td>
                <td className="py-2.5 px-2">1.2–1.6%</td>
                <td className="py-2.5 px-2">5.78% (engagement)</td>
                <td className="py-2.5 px-2"><span className="text-green-700 font-medium">3.6x above avg</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-2 font-medium">Meta CPC (F&B)</td>
                <td className="py-2.5 px-2">$0.42–0.70</td>
                <td className="py-2.5 px-2">$0.38 (engagement)</td>
                <td className="py-2.5 px-2"><span className="text-green-700 font-medium">Below avg</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
          <p className="text-xs text-foreground font-medium mb-1">Key takeaway</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ripi is outperforming industry benchmarks across efficiency metrics (CPM, CTR, CPC). The high CTR suggests strong creative-audience fit. At current spend levels, the creative library is sufficient, but scaling to $10K+/month will require 2–3x more variants monthly.
          </p>
        </div>
      </ChartSection>

      {/* Targets Going Forward */}
      <ChartSection title="Suggested targets going forward">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">CPF Target</p>
            <p className="text-lg font-bold text-foreground">&lt; $2.00</p>
            <p className="text-[11px] text-muted-foreground mt-1">Maintain current efficiency</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Engagement CTR</p>
            <p className="text-lg font-bold text-foreground">&gt; 4%</p>
            <p className="text-[11px] text-muted-foreground mt-1">Keep creative quality high</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Monthly Reach</p>
            <p className="text-lg font-bold text-foreground">1M+</p>
            <p className="text-[11px] text-muted-foreground mt-1">Scale with similar CPM</p>
          </div>
        </div>
      </ChartSection>


    </div>
  )
}

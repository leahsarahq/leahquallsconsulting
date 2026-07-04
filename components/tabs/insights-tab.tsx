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

  // Top follow-driving creatives (keeps the learnings accurate month to month).
  const engagementAds = adsData.filter((ad) => ad.campaign === "Engagement")
  const totalPaidFollows = engagementAds.reduce((s, ad) => s + ad.follows, 0)
  const topDrivers = [...engagementAds].sort((a, b) => b.follows - a.follows).slice(0, 2)
  const topDriverShare = totalPaidFollows
    ? Math.round((topDrivers.reduce((s, ad) => s + ad.follows, 0) / totalPaidFollows) * 100)
    : 0
  const cpmReach = (kpiData.totalSpend / kpiData.totalReach) * 1000

  return (
    <div className="space-y-4">
      {/* Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <BenchmarkCard
          metric="Cost per follow (Engagement)"
          value={`$${kpiData.engagementCPF.toFixed(2)}`}
          benchmark="$2–5 for new CPG brands"
          verdict="excellent"
          explanation={`It costs ~$${kpiData.engagementCPF.toFixed(2)} to earn a follower from the follow-driving campaign — well below the $2–5 brands typically pay.`}
        />
        <BenchmarkCard
          metric="Cost to reach 1,000 people"
          value={`$${cpmReach.toFixed(2)}`}
          benchmark="$8–14 typical for CPG"
          verdict="excellent"
          explanation={`${(kpiData.totalReach / 1000000).toFixed(1)}M people reached on $${(kpiData.totalSpend / 1000).toFixed(1)}K spend — roughly 60% cheaper than the industry norm.`}
        />
        <BenchmarkCard
          metric="Engagement CTR"
          value={`${kpiData.engagementCTR}%`}
          benchmark="1–2% average; 3%+ is strong"
          verdict="excellent"
          explanation={`People click our engagement ads ~${(kpiData.engagementCTR / 1.5).toFixed(0)}x more than the industry average — a sign the creative resonates.`}
        />
        <BenchmarkCard
          metric="Followers gained"
          value={kpiData.followerGrowth.toLocaleString()}
          benchmark="~341/mo before ads (Jan–Mar)"
          verdict="excellent"
          explanation={`${kpiData.followerGrowth.toLocaleString()} new followers in ${monthInfo.label} — more than 5x the pre-ads pace.`}
        />
      </div>

      {/* Creative Analysis */}
      <ChartSection title="What the creative told us">
        <div className="text-xs text-muted-foreground leading-relaxed space-y-3 mt-2">
          <p>
            {totalCreatives} creatives ran in {monthInfo.label}: {engagementCreatives} to drive follows, {awarenessCreatives} for reach, and {retailerCreatives} for retailer support.
          </p>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">+</span>
              <span>
                <span className="font-medium text-foreground">A couple of videos do the heavy lifting.</span>{" "}
                {topDrivers.map((ad) => `"${ad.name}"`).join(" and ")} — casual, native-feeling videos — drove {topDriverShare}% of paid follows at under $1.30 each.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">+</span>
              <span>
                <span className="font-medium text-foreground">Creator ads grab attention.</span>{" "}
                The Joe creator ads earned the highest click rates (up to ~10%) — but fewer of those clicks became follows, so we&apos;re iterating the follow ask (see Testing).
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-muted-foreground font-bold">–</span>
              <span>
                <span className="font-medium text-foreground">Static images are for reach, not follows.</span>{" "}
                Hero images and product shots built big impressions but almost no follows — right for awareness and retailer support, not for growth.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">+</span>
              <span>
                <span className="font-medium text-foreground">Cutting losers fast keeps costs low.</span>{" "}
                Weak tests (e.g. Dark Lifestyle) were paused quickly and budget shifted to what worked.
              </span>
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
                <td className="py-2.5 px-2">~${((kpiData.totalSpend / kpiData.totalImpressions) * 1000).toFixed(2)}</td>
                <td className="py-2.5 px-2"><span className="text-green-700 font-medium">~75% below avg</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-2 font-medium">Meta CTR (F&B)</td>
                <td className="py-2.5 px-2">1.2–1.6%</td>
                <td className="py-2.5 px-2">{kpiData.engagementCTR}% (engagement)</td>
                <td className="py-2.5 px-2"><span className="text-green-700 font-medium">~4x above avg</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-2 font-medium">Meta CPC (F&B)</td>
                <td className="py-2.5 px-2">$0.42–0.70</td>
                <td className="py-2.5 px-2">$0.24 (engagement)</td>
                <td className="py-2.5 px-2"><span className="text-green-700 font-medium">Below avg</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
          <p className="text-xs text-foreground font-medium mb-1">Key takeaway</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ripi beats industry benchmarks on cost and engagement across the board — the ads are cheap to run and people respond to them. To scale spend from here, the main need is more fresh creative each month to keep results this strong.
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

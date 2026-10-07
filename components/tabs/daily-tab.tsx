"use client"

import { ChartSection } from "@/components/chart-section"
import { getDataForMonth } from "@/lib/data"
import { useMonth } from "@/lib/month-context"
import type { Campaign } from "@/lib/data"
import { int, money } from "@/lib/data/meta/format"

const CAMPAIGN_STYLE: Record<Campaign, { color: string; label: string; job: string }> = {
  Engagement: { color: "#D93732", label: "Engagement", job: "Grow the following" },
  Awareness: { color: "#660033", label: "Awareness", job: "Build brand awareness" },
  "Retailer Support": { color: "#E8853A", label: "Retailer support", job: "Drive traffic to retailers" },
}

const CAMPAIGN_ORDER: Campaign[] = ["Engagement", "Awareness", "Retailer Support"]

function pct(part: number, whole: number) {
  return whole > 0 ? (part / whole) * 100 : 0
}

// A single large stat showing what the budget delivered.
function BoughtStat({ value, label, sublabel }: { value: string; label: string; sublabel: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-4">
      <p className="text-2xl font-semibold text-foreground tabular-nums">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{label}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{sublabel}</p>
    </div>
  )
}

export function DailyTab() {
  const { selectedMonth, monthInfo } = useMonth()
  const { adsData, platformSplit } = getDataForMonth(selectedMonth)
  const igTotal = platformSplit?.totals.find((t) => t.platform === "Instagram")
  const fbTotal = platformSplit?.totals.find((t) => t.platform === "Facebook")

  // Aggregate spend / follows / impressions / clicks per campaign.
  const empty = () => ({ Engagement: 0, Awareness: 0, "Retailer Support": 0 }) as Record<Campaign, number>
  const spend = empty()
  const follows = empty()
  const impressions = empty()
  const clicks = empty()

  for (const ad of adsData) {
    spend[ad.campaign] += ad.spend
    follows[ad.campaign] += ad.follows
    impressions[ad.campaign] += ad.impressions
    clicks[ad.campaign] += ad.clicks
  }

  const totalSpend = CAMPAIGN_ORDER.reduce((s, c) => s + spend[c], 0)
  const totalFollows = CAMPAIGN_ORDER.reduce((s, c) => s + follows[c], 0)
  const totalImpressions = CAMPAIGN_ORDER.reduce((s, c) => s + impressions[c], 0)
  const retailerClicks = clicks["Retailer Support"]

  return (
    <div className="space-y-4">
      {/* What the budget bought */}
      <ChartSection title="What the budget bought">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {monthInfo.label}&apos;s <span className="font-semibold text-foreground">${(totalSpend / 1000).toFixed(1)}K</span>{" "}
          in spend did three jobs at once — building reach, growing the following, and sending shoppers to retail partners.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <BoughtStat
            value={`${(totalImpressions / 1000000).toFixed(1)}M`}
            label="People reached"
            sublabel={`~$${((totalSpend / totalImpressions) * 1000).toFixed(2)} per 1K reached`}
          />
          <BoughtStat
            value={totalFollows.toLocaleString()}
            label="New followers"
            sublabel={`~$${(spend.Engagement / follows.Engagement).toFixed(2)} per follow`}
          />
          <BoughtStat
            value={retailerClicks.toLocaleString()}
            label="Clicks to retailers"
            sublabel="Target & Whole Foods"
          />
        </div>
      </ChartSection>

      {/* Per-campaign role cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {CAMPAIGN_ORDER.map((c) => {
          const budgetShare = pct(spend[c], totalSpend)
          const isEngagement = c === "Engagement"
          const costPerFollow = follows[c] > 0 ? spend[c] / follows[c] : null
          const costPerKReach = impressions[c] > 0 ? (spend[c] / impressions[c]) * 1000 : null
          return (
            <div key={c} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CAMPAIGN_STYLE[c].color }} />
                <p className="text-sm font-semibold text-foreground">{CAMPAIGN_STYLE[c].label}</p>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{CAMPAIGN_STYLE[c].job}</p>

              <div className="mt-3 border-t border-border pt-3">
                <p className="text-lg font-semibold text-foreground tabular-nums">
                  ${Math.round(spend[c]).toLocaleString()}
                </p>
                <p className="text-[11px] text-muted-foreground">{budgetShare.toFixed(0)}% of budget</p>
              </div>

              <div className="mt-3 space-y-1.5 text-xs">
                {isEngagement ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">New followers</span>
                      <span className="font-medium text-foreground tabular-nums">{follows[c].toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost per follow</span>
                      <span className="font-medium text-foreground tabular-nums">
                        {costPerFollow != null ? `$${costPerFollow.toFixed(2)}` : "—"}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">People reached</span>
                      <span className="font-medium text-foreground tabular-nums">
                        {(impressions[c] / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost per 1K reached</span>
                      <span className="font-medium text-foreground tabular-nums">
                        {costPerKReach != null ? `$${costPerKReach.toFixed(2)}` : "—"}
                      </span>
                    </div>
                    {c === "Retailer Support" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Clicks to retailers</span>
                        <span className="font-medium text-foreground tabular-nums">
                          {clicks[c].toLocaleString()}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {platformSplit && (
        <ChartSection
          title="Instagram vs. Facebook"
          subtitle={`Follower-growth ad sets · ${platformSplit.label}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-muted-foreground uppercase tracking-wide border-b border-border">
                  <th className="font-medium py-2 pr-3">Ad set</th>
                  <th className="font-medium py-2 px-3">Platform</th>
                  <th className="font-medium py-2 px-3 text-right">Spend</th>
                  <th className="font-medium py-2 px-3 text-right">Follows</th>
                  <th className="font-medium py-2 pl-3 text-right">Cost/Follow</th>
                </tr>
              </thead>
              <tbody>
                {[...platformSplit.rows, ...platformSplit.totals].map((r) => {
                  const isTotal = r.adSet === "Both ad sets"
                  return (
                    <tr
                      key={`${r.adSet}-${r.platform}`}
                      className={`border-b border-border/60 last:border-0 ${isTotal ? "bg-muted/40 font-medium" : ""}`}
                    >
                      <td className="py-2 pr-3 text-foreground text-pretty">{r.adSet}</td>
                      <td className="py-2 px-3 text-muted-foreground">{r.platform}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">{money(r.spend)}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-foreground">{int(r.follows)}</td>
                      <td className="py-2 pl-3 text-right tabular-nums text-foreground font-medium">{money(r.cpf)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mt-3 text-pretty">
            Instagram brings in followers for{" "}
            <span className="font-medium text-foreground">{money(igTotal?.cpf)}</span> each vs.{" "}
            <span className="font-medium text-foreground">{money(fbTotal?.cpf)}</span> on Facebook, so October moves all
            follower-growth spend to Instagram.
          </p>
        </ChartSection>
      )}
    </div>
  )
}

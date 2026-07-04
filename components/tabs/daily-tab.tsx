"use client"

import { ChartSection } from "@/components/chart-section"
import { getDataForMonth } from "@/lib/data"
import { useMonth } from "@/lib/month-context"
import type { Campaign } from "@/lib/data"

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
  const { adsData } = getDataForMonth(selectedMonth)

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
    </div>
  )
}

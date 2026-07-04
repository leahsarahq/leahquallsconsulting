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

// A single 100%-stacked horizontal bar with segments per campaign.
function StackedBar({
  title,
  totals,
  grandTotal,
}: {
  title: string
  totals: Record<Campaign, number>
  grandTotal: number
}) {
  return (
    <div>
      <p className="text-xs font-medium text-foreground mb-1.5">{title}</p>
      <div className="flex h-7 w-full overflow-hidden rounded-md">
        {CAMPAIGN_ORDER.map((c) => {
          const share = pct(totals[c], grandTotal)
          if (share < 0.5) return null
          return (
            <div
              key={c}
              className="flex items-center justify-center text-[10px] font-semibold text-white"
              style={{ width: `${share}%`, backgroundColor: CAMPAIGN_STYLE[c].color }}
              title={`${CAMPAIGN_STYLE[c].label}: ${share.toFixed(0)}%`}
            >
              {share >= 8 ? `${share.toFixed(0)}%` : ""}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DailyTab() {
  const { selectedMonth } = useMonth()
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

  const engagementBudgetShare = pct(spend.Engagement, totalSpend)
  const engagementFollowShare = pct(follows.Engagement, totalFollows)

  const legend = CAMPAIGN_ORDER.map((c) => ({ color: CAMPAIGN_STYLE[c].color, label: CAMPAIGN_STYLE[c].label }))

  return (
    <div className="space-y-4">
      {/* Headline insight */}
      <div className="rounded-lg border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">The efficiency story</p>
        <p className="mt-1 text-lg font-semibold text-foreground text-balance">
          {engagementBudgetShare.toFixed(0)}% of the budget drove {engagementFollowShare.toFixed(0)}% of new followers.
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
          The Engagement campaign is a small slice of spend but does nearly all the follower growth. Awareness and
          Retailer Support use the majority of the budget to build reach and send traffic to Target and Whole Foods — a
          different job that isn&apos;t measured in follows.
        </p>
      </div>

      {/* Budget vs. results */}
      <ChartSection title="Where the money went vs. what it delivered">
        <div className="mb-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          {legend.map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
        <div className="space-y-4">
          <StackedBar title="Share of budget" totals={spend} grandTotal={totalSpend} />
          <StackedBar title="Share of new followers" totals={follows} grandTotal={totalFollows} />
          <StackedBar title="Share of reach (impressions)" totals={impressions} grandTotal={totalImpressions} />
        </div>
        <p className="mt-4 text-[10px] text-muted-foreground leading-relaxed">
          Read top to bottom: the follower bar is almost entirely one color because Engagement drives the follows, while
          the reach bar flips — most impressions come from the awareness and retailer campaigns.
        </p>
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

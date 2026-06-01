"use client"

import { useState, useMemo } from "react"
import { ChartSection } from "@/components/chart-section"
import { getDataForMonth, CAMPAIGNS, type Campaign } from "@/lib/data"
import { useMonth } from "@/lib/month-context"

type SortKey = "follows" | "cpf" | "spend" | "ctr" | "impressions"
type FilterKey = "all" | "follows"
type CampaignFilter = "all" | Campaign

function Badge({ type, children }: { type: "red" | "green" | "gray"; children: React.ReactNode }) {
  const colors = {
    red: "bg-red-100 text-red-800",
    green: "bg-green-100 text-green-800",
    gray: "bg-muted text-muted-foreground",
  }
  return (
    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${colors[type]}`}>
      {children}
    </span>
  )
}

function CampaignBadge({ campaign }: { campaign: Campaign }) {
  const styles: Record<Campaign, string> = {
    "Engagement": "bg-primary/10 text-primary",
    "Awareness": "bg-accent/10 text-accent",
    "Retailer Support": "bg-orange-100 text-orange-800",
  }
  return (
    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${styles[campaign]}`}>
      {campaign}
    </span>
  )
}

export function AdsTab() {
  const { selectedMonth } = useMonth()
  const { adsData } = getDataForMonth(selectedMonth)
  
  const [sortBy, setSortBy] = useState<SortKey>("follows")
  const [filter, setFilter] = useState<FilterKey>("all")
  const [campaignFilter, setCampaignFilter] = useState<CampaignFilter>("all")

  const sortedAds = useMemo(() => {
    let filtered = [...adsData]

    if (filter === "follows") {
      filtered = filtered.filter((ad) => ad.follows > 0)
    }

    if (campaignFilter !== "all") {
      filtered = filtered.filter((ad) => ad.campaign === campaignFilter)
    }

    filtered.sort((a, b) => {
      if (sortBy === "cpf") {
        const aCpf = a.cpf ?? Infinity
        const bCpf = b.cpf ?? Infinity
        return aCpf - bCpf
      }
      return (b[sortBy] ?? 0) - (a[sortBy] ?? 0)
    })

    return filtered
  }, [sortBy, filter, campaignFilter, adsData])

  const maxFollows = Math.max(...adsData.map((ad) => ad.follows))
  const maxImpressionsAwareness = Math.max(
    ...adsData.filter((ad) => ad.campaign === "Awareness").map((ad) => ad.impressions)
  )
  const lowestCpcRetailer = Math.min(
    ...adsData.filter((ad) => ad.campaign === "Retailer Support" && ad.clicks > 0).map((ad) => ad.spend / ad.clicks)
  )

  function getTag(ad: (typeof adsData)[0]) {
    // Engagement campaign: focus on follows/CPF - only show positive tags
    // Require minimum 10 follows for statistical significance
    if (ad.campaign === "Engagement") {
      if (ad.cpf !== null && ad.cpf < 2 && ad.follows >= 10) return { type: "green" as const, label: "Top performer" }
      return null
    }
    
    // Awareness campaign: focus on impressions
    if (ad.campaign === "Awareness") {
      if (ad.impressions === maxImpressionsAwareness) return { type: "green" as const, label: "Top impressions" }
      return null
    }
    
    // Retailer Support: focus on clicks/CPC
    if (ad.campaign === "Retailer Support") {
      const cpc = ad.clicks > 0 ? ad.spend / ad.clicks : null
      if (cpc !== null && cpc === lowestCpcRetailer) return { type: "green" as const, label: "Best CPC" }
      return null
    }
    
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs text-muted-foreground">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-foreground"
        >
          <option value="follows">Follows</option>
          <option value="cpf">CPF (lowest)</option>
          <option value="spend">Spend</option>
          <option value="ctr">CTR</option>
          <option value="impressions">Impressions</option>
        </select>
        <label className="text-xs text-muted-foreground ml-2">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterKey)}
          className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-foreground"
        >
          <option value="all">All ads</option>
          <option value="follows">Has follows only</option>
        </select>
        <label className="text-xs text-muted-foreground ml-2">Campaign:</label>
        <select
          value={campaignFilter}
          onChange={(e) => setCampaignFilter(e.target.value as CampaignFilter)}
          className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-foreground"
        >
          <option value="all">All campaigns</option>
          {CAMPAIGNS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <ChartSection title="Ad creative performance">
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left text-[11px] text-muted-foreground font-medium uppercase tracking-wide py-2 px-2">
                  Ad creative
                </th>
                <th className="text-left text-[11px] text-muted-foreground font-medium uppercase tracking-wide py-2 px-2">
                  Campaign
                </th>
                <th className="text-left text-[11px] text-muted-foreground font-medium uppercase tracking-wide py-2 px-2">
                  Spend
                </th>
                <th className="text-left text-[11px] text-muted-foreground font-medium uppercase tracking-wide py-2 px-2">
                  Follows
                </th>
                <th className="text-left text-[11px] text-muted-foreground font-medium uppercase tracking-wide py-2 px-2">
                  CPF
                </th>
                <th className="text-left text-[11px] text-muted-foreground font-medium uppercase tracking-wide py-2 px-2">
                  CTR
                </th>
                <th className="text-left text-[11px] text-muted-foreground font-medium uppercase tracking-wide py-2 px-2">
                  Impressions
                </th>
                <th className="text-left text-[11px] text-muted-foreground font-medium uppercase tracking-wide py-2 px-2">
                  Clicks
                </th>
                <th className="text-left text-[11px] text-muted-foreground font-medium uppercase tracking-wide py-2 px-2">
                  CPC
                </th>
                <th className="text-left text-[11px] text-muted-foreground font-medium uppercase tracking-wide py-2 px-2">
                  Tag
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAds.map((ad) => {
                const tag = getTag(ad)
                return (
                  <tr key={ad.name} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-2 font-medium">{ad.name}</td>
                    <td className="py-2.5 px-2">
                      <CampaignBadge campaign={ad.campaign} />
                    </td>
                    <td className="py-2.5 px-2">${ad.spend.toFixed(2)}</td>
                    <td className="py-2.5 px-2">
                      <div>{ad.follows}</div>
                      {ad.follows > 0 && (
                        <div className="bg-muted rounded-sm h-1.5 mt-1 w-16">
                          <div
                            className="bg-primary h-1.5 rounded-sm"
                            style={{ width: `${(ad.follows / maxFollows) * 100}%` }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-2">{ad.cpf !== null ? `$${ad.cpf.toFixed(2)}` : "—"}</td>
                    <td className="py-2.5 px-2">{ad.ctr.toFixed(2)}%</td>
                    <td className="py-2.5 px-2">{ad.impressions.toLocaleString()}</td>
                    <td className="py-2.5 px-2">{ad.clicks.toLocaleString()}</td>
                    <td className="py-2.5 px-2">
                      {ad.clicks > 0 ? `$${(ad.spend / ad.clicks).toFixed(2)}` : "—"}
                    </td>
                    <td className="py-2.5 px-2">{tag && <Badge type={tag.type}>{tag.label}</Badge>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </ChartSection>
    </div>
  )
}

"use client"

import { useState } from "react"
import { OverviewTab } from "@/components/tabs/overview-tab"
import { ProgressTab } from "@/components/tabs/progress-tab"
import { DailyTab } from "@/components/tabs/daily-tab"
import { AdsTab } from "@/components/tabs/ads-tab"
import { InsightsTab } from "@/components/tabs/insights-tab"
import { AudienceTestTab } from "@/components/tabs/audience-test-tab"
import { MonthProvider, useMonth, MONTHS, type MonthKey, type ComparisonMode } from "@/lib/month-context"
import { getDataForMonth } from "@/lib/data"
import { COMPARISON_OPTIONS } from "@/lib/data/comparisons"

const baseTabs = [
  { id: "overview", label: "Overview" },
  { id: "daily", label: "Daily spend & follows" },
  { id: "ads", label: "Ad creative" },
  { id: "insights", label: "Insights & Benchmarks" },
] as const

const audienceTestTab = { id: "audience-test", label: "Audience Testing" } as const
const progressTab = { id: "progress", label: "Progress" } as const

type TabId = (typeof baseTabs)[number]["id"] | "audience-test" | "progress"

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<TabId>("overview")
  const { selectedMonth, setSelectedMonth, monthInfo, comparisonMode, setComparisonMode } = useMonth()
  const { audienceTest, previousMonth } = getDataForMonth(selectedMonth)

  // Build tabs list: Progress sits right after Overview for any month we can track
  // week-by-week (in-progress months, or completed months with a prior month to pace against);
  // Audience Testing is appended only when data exists.
  const showProgress = monthInfo.inProgress || !!previousMonth
  const [overview, ...restBase] = baseTabs
  const tabs = [
    overview,
    ...(showProgress ? [progressTab] : []),
    ...restBase,
    ...(audienceTest ? [audienceTestTab] : []),
  ]

  // If the active tab isn't available for the selected month, fall back to Overview.
  const activeTabExists = tabs.some((t) => t.id === activeTab)
  const resolvedTab = activeTabExists ? activeTab : "overview"

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/ripi-logo.png" alt="Ripi Foods" className="h-10 w-auto" />
            <div>
              <h1 className="text-sm font-semibold text-foreground">
                Meta Ads Dashboard
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                {monthInfo.dateRange}
                {monthInfo.inProgress && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    In progress
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value as MonthKey)}
              aria-label="Select reporting month"
              className="text-sm px-3 py-1.5 rounded-lg border border-border bg-card text-foreground font-medium"
            >
              {MONTHS.map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
            <select
              value={comparisonMode}
              onChange={(e) => setComparisonMode(e.target.value as ComparisonMode)}
              aria-label="Select comparison period"
              className="text-sm px-3 py-1.5 rounded-lg border border-border bg-card text-foreground font-medium"
            >
              {COMPARISON_OPTIONS.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-1.5 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                text-[13px] px-4 py-1.5 rounded-lg border transition-colors
                ${
                  resolvedTab === tab.id
                    ? "bg-primary text-primary-foreground border-primary font-medium"
                    : "bg-card text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <main>
          {resolvedTab === "overview" && <OverviewTab />}
          {resolvedTab === "progress" && <ProgressTab />}
          {resolvedTab === "daily" && <DailyTab />}
          {resolvedTab === "ads" && <AdsTab />}
          {resolvedTab === "audience-test" && <AudienceTestTab />}
          {resolvedTab === "insights" && <InsightsTab />}
        </main>
      </div>
    </div>
  )
}

export function Dashboard() {
  return (
    <MonthProvider>
      <DashboardContent />
    </MonthProvider>
  )
}

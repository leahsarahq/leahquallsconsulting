"use client"

import { useState } from "react"
import { OverviewTab } from "@/components/tabs/overview-tab"
import { DailyTab } from "@/components/tabs/daily-tab"
import { AdsTab } from "@/components/tabs/ads-tab"
import { InsightsTab } from "@/components/tabs/insights-tab"
import { MonthProvider, useMonth, MONTHS, type MonthKey } from "@/lib/month-context"

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "daily", label: "Daily spend & follows" },
  { id: "ads", label: "Ad creative" },
  { id: "insights", label: "Insights & Benchmarks" },
] as const

type TabId = (typeof tabs)[number]["id"]

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<TabId>("overview")
  const { selectedMonth, setSelectedMonth, monthInfo } = useMonth()

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
              <p className="text-xs text-muted-foreground">
                {monthInfo.dateRange}
              </p>
            </div>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value as MonthKey)}
            className="text-sm px-3 py-1.5 rounded-lg border border-border bg-card text-foreground font-medium"
          >
            {MONTHS.map((m) => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
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
                  activeTab === tab.id
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
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "daily" && <DailyTab />}
          {activeTab === "ads" && <AdsTab />}
          {activeTab === "insights" && <InsightsTab />}
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

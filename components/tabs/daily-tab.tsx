"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartSection } from "@/components/chart-section"
import { getDataForMonth } from "@/lib/data"
import { useMonth } from "@/lib/month-context"

function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
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

const legendItems = [
  { color: "#D93732", label: "Engagement" },
  { color: "#660033", label: "Awareness" },
  { color: "#E8853A", label: "Retailer support" },
]

export function DailyTab() {
  const { selectedMonth, monthInfo } = useMonth()
  const { dailyData } = getDataForMonth(selectedMonth)
  
  const dates = Object.keys(dailyData).sort()

  const followsData = dates.map((date) => ({
    date: date.slice(5),
    engagement: dailyData[date]["Engagement Campaign"]?.follows || 0,
    awareness: dailyData[date]["Awareness Campaign"]?.follows || 0,
    retailer: dailyData[date]["Retailer Support"]?.follows || 0,
  }))

  const spendData = dates.map((date) => ({
    date: date.slice(5),
    engagement: dailyData[date]["Engagement Campaign"]?.spend || 0,
    awareness: dailyData[date]["Awareness Campaign"]?.spend || 0,
    retailer: dailyData[date]["Retailer Support"]?.spend || 0,
  }))

  return (
    <div className="space-y-4">
      <ChartSection title="Daily paid follows" subtitle={`Engagement campaign · ${monthInfo.dateRange} (99% of paid follows)`}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={followsData}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: "#888" }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={50}
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
              <Bar dataKey="engagement" fill="#D93732" name="Follows" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          Awareness and Retailer Support campaigns contributed only 4 combined follows — engagement drove all meaningful paid attribution.
        </p>
      </ChartSection>

      <ChartSection title="Daily spend" subtitle={`All campaigns · ${monthInfo.dateRange}`}>
        <Legend items={legendItems} />
        {selectedMonth === "may-2026" && (
          <p className="text-[10px] text-muted-foreground mb-2 italic">
            Note: Ads were subdued May 8–10 due to billing.
          </p>
        )}
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendData}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: "#888" }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#888" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
                contentStyle={{
                  backgroundColor: "#fbf9f4",
                  border: "1px solid #e0ddd4",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="engagement" stackId="a" fill="#D93732" radius={[0, 0, 0, 0]} />
              <Bar dataKey="awareness" stackId="a" fill="#660033" radius={[0, 0, 0, 0]} />
              <Bar dataKey="retailer" stackId="a" fill="#E8853A" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartSection>
    </div>
  )
}

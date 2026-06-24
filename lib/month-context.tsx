"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type MonthKey = "apr-2026" | "may-2026"

export type ComparisonMode = "last-month" | "last-quarter" | "ytd"

export const MONTHS: { key: MonthKey; label: string; dateRange: string }[] = [
  { key: "apr-2026", label: "April 2026", dateRange: "Apr 9–30, 2026" },
  { key: "may-2026", label: "May 2026", dateRange: "May 1–31, 2026" },
]

interface MonthContextType {
  selectedMonth: MonthKey
  setSelectedMonth: (month: MonthKey) => void
  monthInfo: (typeof MONTHS)[number]
  comparisonMode: ComparisonMode
  setComparisonMode: (mode: ComparisonMode) => void
}

const MonthContext = createContext<MonthContextType | undefined>(undefined)

export function MonthProvider({ children }: { children: ReactNode }) {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>("apr-2026")
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("last-month")

  const monthInfo = MONTHS.find((m) => m.key === selectedMonth) || MONTHS[0]

  return (
    <MonthContext.Provider
      value={{ selectedMonth, setSelectedMonth, monthInfo, comparisonMode, setComparisonMode }}
    >
      {children}
    </MonthContext.Provider>
  )
}

export function useMonth() {
  const context = useContext(MonthContext)
  if (!context) {
    throw new Error("useMonth must be used within a MonthProvider")
  }
  return context
}

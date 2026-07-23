"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type MonthKey = "apr-2026" | "may-2026" | "jun-2026" | "jul-2026"

export type ComparisonMode = "last-month" | "last-quarter" | "ytd"

export interface MonthInfo {
  key: MonthKey
  label: string
  dateRange: string
  /** Total days in the calendar month — used for pacing/projection. */
  daysInMonth: number
  /** True when the month is still in progress (partial data). */
  inProgress?: boolean
  /** Previous month key, used for pace comparisons. */
  prevMonthKey?: MonthKey
}

export const MONTHS: MonthInfo[] = [
  { key: "apr-2026", label: "April 2026", dateRange: "Apr 9–30, 2026", daysInMonth: 30 },
  { key: "may-2026", label: "May 2026", dateRange: "May 1–31, 2026", daysInMonth: 31, prevMonthKey: "apr-2026" },
  { key: "jun-2026", label: "June 2026", dateRange: "Jun 1–30, 2026", daysInMonth: 30, prevMonthKey: "may-2026" },
  { key: "jul-2026", label: "July 2026", dateRange: "Jul 1–23, 2026", daysInMonth: 31, inProgress: true, prevMonthKey: "jun-2026" },
]

interface MonthContextType {
  selectedMonth: MonthKey
  setSelectedMonth: (month: MonthKey) => void
  monthInfo: MonthInfo
  comparisonMode: ComparisonMode
  setComparisonMode: (mode: ComparisonMode) => void
}

const MonthContext = createContext<MonthContextType | undefined>(undefined)

// Pick the month matching today's date; otherwise fall back to the most recent month we have data for.
function getDefaultMonth(): MonthKey {
  const now = new Date()
  const key = `${now.toLocaleString("en-US", { month: "short" }).toLowerCase()}-${now.getFullYear()}` as MonthKey
  if (MONTHS.some((m) => m.key === key)) return key
  return MONTHS[MONTHS.length - 1].key
}

export function MonthProvider({ children }: { children: ReactNode }) {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>(getDefaultMonth)
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

import type { MonthKey, ComparisonMode } from "../month-context"
import { APRIL_KPI_DATA } from "./april-2026"
import { MAY_KPI_DATA } from "./may-2026"
import { JUNE_KPI_DATA } from "./june-2026"
import { JULY_KPI_DATA } from "./july-2026"
import { AUGUST_KPI_DATA } from "./august-2026"
import { SEPTEMBER_KPI_DATA } from "./september-2026"

export const COMPARISON_OPTIONS: { key: ComparisonMode; label: string }[] = [
  { key: "last-month", label: "vs. last month" },
  { key: "last-quarter", label: "vs. last quarter" },
  { key: "ytd", label: "vs. YTD" },
]

const METRIC_KEYS = [
  "followerGrowth",
  "blendedCPF",
  "engagementCPF",
  "engagementCTR",
  "totalImpressions",
  "paidFollows",
  "messagingContacts",
] as const

type MetricKey = (typeof METRIC_KEYS)[number]

type MetricMap = Record<MetricKey, number | null>

interface MonthlyMetrics extends MetricMap {
  key: string
  label: string
}

// Chronological series of 2026 months. Q1 (Jan–Mar) ran no paid ads, so ad
// metrics are null and excluded from averages. Apr/May come from real KPI data.
const MONTH_SERIES: MonthlyMetrics[] = [
  {
    key: "jan-2026",
    label: "January",
    followerGrowth: 350,
    blendedCPF: null,
    engagementCPF: null,
    engagementCTR: null,
    totalImpressions: null,
    paidFollows: null,
    messagingContacts: 180,
  },
  {
    key: "feb-2026",
    label: "February",
    followerGrowth: 350,
    blendedCPF: null,
    engagementCPF: null,
    engagementCTR: null,
    totalImpressions: null,
    paidFollows: null,
    messagingContacts: 180,
  },
  {
    key: "mar-2026",
    label: "March",
    followerGrowth: 331,
    blendedCPF: null,
    engagementCPF: null,
    engagementCTR: null,
    totalImpressions: null,
    paidFollows: null,
    messagingContacts: 155,
  },
  {
    key: "apr-2026",
    label: "April",
    followerGrowth: APRIL_KPI_DATA.followerGrowth,
    blendedCPF: APRIL_KPI_DATA.blendedCPF,
    engagementCPF: APRIL_KPI_DATA.engagementCPF,
    engagementCTR: APRIL_KPI_DATA.engagementCTR,
    totalImpressions: APRIL_KPI_DATA.totalImpressions,
    paidFollows: APRIL_KPI_DATA.paidFollows,
    messagingContacts: APRIL_KPI_DATA.messagingContacts,
  },
  {
    key: "may-2026",
    label: "May",
    followerGrowth: MAY_KPI_DATA.followerGrowth,
    blendedCPF: MAY_KPI_DATA.blendedCPF,
    engagementCPF: MAY_KPI_DATA.engagementCPF,
    engagementCTR: MAY_KPI_DATA.engagementCTR,
    totalImpressions: MAY_KPI_DATA.totalImpressions,
    paidFollows: MAY_KPI_DATA.paidFollows,
    messagingContacts: MAY_KPI_DATA.messagingContacts,
  },
  {
    key: "jun-2026",
    label: "June",
    followerGrowth: JUNE_KPI_DATA.followerGrowth,
    blendedCPF: JUNE_KPI_DATA.blendedCPF,
    engagementCPF: JUNE_KPI_DATA.engagementCPF,
    engagementCTR: JUNE_KPI_DATA.engagementCTR,
    totalImpressions: JUNE_KPI_DATA.totalImpressions,
    paidFollows: JUNE_KPI_DATA.paidFollows,
    // June messaging not yet imported — null so it's excluded from averages.
    messagingContacts: JUNE_KPI_DATA.messagingContacts || null,
  },
  {
    key: "jul-2026",
    label: "July",
    followerGrowth: JULY_KPI_DATA.followerGrowth,
    blendedCPF: JULY_KPI_DATA.blendedCPF,
    engagementCPF: JULY_KPI_DATA.engagementCPF,
    engagementCTR: JULY_KPI_DATA.engagementCTR,
    totalImpressions: JULY_KPI_DATA.totalImpressions,
    paidFollows: JULY_KPI_DATA.paidFollows,
    // July messaging not imported — null so it's excluded from averages.
    messagingContacts: JULY_KPI_DATA.messagingContacts || null,
  },
  {
    key: "aug-2026",
    label: "August",
    followerGrowth: AUGUST_KPI_DATA.followerGrowth,
    blendedCPF: AUGUST_KPI_DATA.blendedCPF,
    engagementCPF: AUGUST_KPI_DATA.engagementCPF,
    engagementCTR: AUGUST_KPI_DATA.engagementCTR,
    totalImpressions: AUGUST_KPI_DATA.totalImpressions,
    paidFollows: AUGUST_KPI_DATA.paidFollows,
    // August messaging not imported — null so it's excluded from averages.
    messagingContacts: AUGUST_KPI_DATA.messagingContacts || null,
  },
  {
    key: "sep-2026",
    label: "September",
    followerGrowth: SEPTEMBER_KPI_DATA.followerGrowth,
    blendedCPF: SEPTEMBER_KPI_DATA.blendedCPF,
    engagementCPF: SEPTEMBER_KPI_DATA.engagementCPF,
    engagementCTR: SEPTEMBER_KPI_DATA.engagementCTR,
    totalImpressions: SEPTEMBER_KPI_DATA.totalImpressions,
    paidFollows: SEPTEMBER_KPI_DATA.paidFollows,
    // September messaging not imported — null so it's excluded from averages.
    messagingContacts: SEPTEMBER_KPI_DATA.messagingContacts || null,
  },
]

const Q1_KEYS = ["jan-2026", "feb-2026", "mar-2026"]

export interface ComparisonBaseline {
  mode: ComparisonMode
  /** Descriptive label for the comparison period, e.g. "April", "Q1 monthly avg". */
  label: string
  /** Short label for inline / compact use. */
  shortLabel: string
  /** Whether comparison data exists for this selection. */
  available: boolean
  /** Per-month baseline values to compare the selected month against. */
  metrics: MetricMap
}

function emptyMetrics(): MetricMap {
  return {
    followerGrowth: null,
    blendedCPF: null,
    engagementCPF: null,
    engagementCTR: null,
    totalImpressions: null,
    paidFollows: null,
    messagingContacts: null,
  }
}

function pickMetrics(row: MonthlyMetrics): MetricMap {
  return {
    followerGrowth: row.followerGrowth,
    blendedCPF: row.blendedCPF,
    engagementCPF: row.engagementCPF,
    engagementCTR: row.engagementCTR,
    totalImpressions: row.totalImpressions,
    paidFollows: row.paidFollows,
    messagingContacts: row.messagingContacts,
  }
}

function averageMetrics(rows: MonthlyMetrics[]): MetricMap {
  const result = emptyMetrics()
  for (const key of METRIC_KEYS) {
    const values = rows.map((r) => r[key]).filter((v): v is number => v != null)
    result[key] = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null
  }
  return result
}

/**
 * Returns a per-month comparison baseline for the selected month and mode.
 * All baselines are expressed on a per-month basis so deltas are apples-to-apples.
 */
export function getComparison(selectedMonth: MonthKey, mode: ComparisonMode): ComparisonBaseline {
  const idx = MONTH_SERIES.findIndex((m) => m.key === selectedMonth)
  const safeIdx = idx >= 0 ? idx : MONTH_SERIES.length - 1

  if (mode === "last-month") {
    const prev = safeIdx > 0 ? MONTH_SERIES[safeIdx - 1] : null
    if (!prev) {
      return {
        mode,
        label: "previous month",
        shortLabel: "last month",
        available: false,
        metrics: emptyMetrics(),
      }
    }
    return {
      mode,
      label: prev.label,
      shortLabel: prev.label,
      available: true,
      metrics: pickMetrics(prev),
    }
  }

  if (mode === "last-quarter") {
    // Selectable months are all in Q2, so the prior quarter is Q1 (Jan–Mar).
    const q1Rows = MONTH_SERIES.filter((m) => Q1_KEYS.includes(m.key))
    return {
      mode,
      label: "Q1 monthly avg",
      shortLabel: "Q1 avg",
      available: q1Rows.length > 0,
      metrics: averageMetrics(q1Rows),
    }
  }

  // ytd: average across all months from Jan through the selected month (inclusive).
  const ytdRows = MONTH_SERIES.slice(0, safeIdx + 1)
  return {
    mode,
    label: "2026 monthly avg",
    shortLabel: "YTD avg",
    available: ytdRows.length > 0,
    metrics: averageMetrics(ytdRows),
  }
}

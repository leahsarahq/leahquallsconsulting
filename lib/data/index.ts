import type { MonthKey } from "../month-context"
import { APRIL_DAILY_DATA, APRIL_ADS_DATA, APRIL_KPI_DATA, APRIL_SPEND_BY_CAMPAIGN, APRIL_WEEKLY_FOLLOWS } from "./april-2026"
import { MAY_DAILY_DATA, MAY_ADS_DATA, MAY_KPI_DATA, MAY_SPEND_BY_CAMPAIGN, MAY_WEEKLY_FOLLOWS, MAY_AUDIENCE_TEST } from "./may-2026"
import {
  JUNE_DAILY_DATA,
  JUNE_ADS_DATA,
  JUNE_KPI_DATA,
  JUNE_SPEND_BY_CAMPAIGN,
  JUNE_WEEKLY_FOLLOWS,
  JUNE_IG_DAILY_FOLLOWS,
  JUNE_DEMOGRAPHICS,
  JUNE_TESTING,
} from "./june-2026"
import {
  JULY_DAILY_DATA,
  JULY_ADS_DATA,
  JULY_KPI_DATA,
  JULY_SPEND_BY_CAMPAIGN,
  JULY_WEEKLY_FOLLOWS,
  JULY_DEMOGRAPHICS,
  JULY_TESTING,
} from "./july-2026"
import {
  AUGUST_DAILY_DATA,
  AUGUST_ADS_DATA,
  AUGUST_KPI_DATA,
  AUGUST_SPEND_BY_CAMPAIGN,
  AUGUST_WEEKLY_FOLLOWS,
  AUGUST_TESTING,
  AUGUST_OVERVIEW_ANALYSIS,
} from "./august-2026"
import {
  SEPTEMBER_DAILY_DATA,
  SEPTEMBER_ADS_DATA,
  SEPTEMBER_KPI_DATA,
  SEPTEMBER_SPEND_BY_CAMPAIGN,
  SEPTEMBER_WEEKLY_FOLLOWS,
  SEPTEMBER_OVERVIEW_ANALYSIS,
  SEPTEMBER_IG_DAILY_FOLLOWS,
  SEPTEMBER_ENGAGEMENT_DAILY_IMPRESSIONS,
} from "./september-2026"
import type { IgDailyFollow, AudienceDemographics, OverviewAnalysis, TestingContext } from "./types"
import type { DailyData } from "./progress"
export { Q1_BASELINE, CAMPAIGNS } from "./types"
export type { Campaign, KPIData, AdData, SpendByCampaign, WeeklyFollows, IgDailyFollow, AudienceDemographics, OverviewAnalysis, TestingContext } from "./types"

export function getDataForMonth(month: MonthKey) {
  switch (month) {
    case "apr-2026":
      return {
        dailyData: APRIL_DAILY_DATA,
        adsData: APRIL_ADS_DATA,
        kpiData: APRIL_KPI_DATA,
        spendByCampaign: APRIL_SPEND_BY_CAMPAIGN,
        weeklyFollows: APRIL_WEEKLY_FOLLOWS,
        previousMonth: null,
        priorMonthsDaily: [] as DailyData[],
        audienceTest: null,
        testing: null as TestingContext | null,
        igDailyFollows: null as IgDailyFollow[] | null,
        demographics: null as AudienceDemographics | null,
        overviewAnalysis: null as OverviewAnalysis | null,
      }
    case "may-2026":
      return {
        dailyData: MAY_DAILY_DATA,
        adsData: MAY_ADS_DATA,
        kpiData: MAY_KPI_DATA,
        spendByCampaign: MAY_SPEND_BY_CAMPAIGN,
        weeklyFollows: MAY_WEEKLY_FOLLOWS,
        previousMonth: {
          kpiData: APRIL_KPI_DATA,
          label: "April",
          dailyData: APRIL_DAILY_DATA,
        },
        priorMonthsDaily: [APRIL_DAILY_DATA] as DailyData[],
        audienceTest: MAY_AUDIENCE_TEST,
        testing: null as TestingContext | null,
        igDailyFollows: null as IgDailyFollow[] | null,
        demographics: null as AudienceDemographics | null,
        overviewAnalysis: null as OverviewAnalysis | null,
      }
    case "jun-2026":
      return {
        dailyData: JUNE_DAILY_DATA,
        adsData: JUNE_ADS_DATA,
        kpiData: JUNE_KPI_DATA,
        spendByCampaign: JUNE_SPEND_BY_CAMPAIGN,
        weeklyFollows: JUNE_WEEKLY_FOLLOWS,
        previousMonth: {
          kpiData: MAY_KPI_DATA,
          label: "May",
          dailyData: MAY_DAILY_DATA,
        },
        priorMonthsDaily: [APRIL_DAILY_DATA, MAY_DAILY_DATA] as DailyData[],
        audienceTest: null,
        testing: JUNE_TESTING as TestingContext | null,
        igDailyFollows: JUNE_IG_DAILY_FOLLOWS as IgDailyFollow[] | null,
        demographics: JUNE_DEMOGRAPHICS as AudienceDemographics | null,
        overviewAnalysis: null as OverviewAnalysis | null,
      }
    case "jul-2026":
      return {
        dailyData: JULY_DAILY_DATA,
        adsData: JULY_ADS_DATA,
        kpiData: JULY_KPI_DATA,
        spendByCampaign: JULY_SPEND_BY_CAMPAIGN,
        weeklyFollows: JULY_WEEKLY_FOLLOWS,
        previousMonth: {
          kpiData: JUNE_KPI_DATA,
          label: "June",
          dailyData: JUNE_DAILY_DATA,
        },
        priorMonthsDaily: [APRIL_DAILY_DATA, MAY_DAILY_DATA, JUNE_DAILY_DATA] as DailyData[],
        audienceTest: null,
        testing: JULY_TESTING as TestingContext | null,
        igDailyFollows: null as IgDailyFollow[] | null,
        demographics: JULY_DEMOGRAPHICS as AudienceDemographics | null,
        overviewAnalysis: null as OverviewAnalysis | null,
      }
    case "aug-2026":
      return {
        dailyData: AUGUST_DAILY_DATA,
        adsData: AUGUST_ADS_DATA,
        kpiData: AUGUST_KPI_DATA,
        spendByCampaign: AUGUST_SPEND_BY_CAMPAIGN,
        weeklyFollows: AUGUST_WEEKLY_FOLLOWS,
        previousMonth: {
          kpiData: JULY_KPI_DATA,
          label: "July",
          dailyData: JULY_DAILY_DATA,
        },
        priorMonthsDaily: [APRIL_DAILY_DATA, MAY_DAILY_DATA, JUNE_DAILY_DATA, JULY_DAILY_DATA] as DailyData[],
        audienceTest: null,
        testing: AUGUST_TESTING as TestingContext | null,
        igDailyFollows: null as IgDailyFollow[] | null,
        demographics: null as AudienceDemographics | null,
        overviewAnalysis: AUGUST_OVERVIEW_ANALYSIS as OverviewAnalysis | null,
      }
    case "sep-2026":
      return {
        dailyData: SEPTEMBER_DAILY_DATA,
        adsData: SEPTEMBER_ADS_DATA,
        kpiData: SEPTEMBER_KPI_DATA,
        spendByCampaign: SEPTEMBER_SPEND_BY_CAMPAIGN,
        weeklyFollows: SEPTEMBER_WEEKLY_FOLLOWS,
        previousMonth: {
          kpiData: AUGUST_KPI_DATA,
          label: "August",
          dailyData: AUGUST_DAILY_DATA,
        },
        priorMonthsDaily: [APRIL_DAILY_DATA, MAY_DAILY_DATA, JUNE_DAILY_DATA, JULY_DAILY_DATA, AUGUST_DAILY_DATA] as DailyData[],
        audienceTest: null,
        testing: null as TestingContext | null,
        igDailyFollows: SEPTEMBER_IG_DAILY_FOLLOWS as IgDailyFollow[] | null,
        demographics: null as AudienceDemographics | null,
        overviewAnalysis: SEPTEMBER_OVERVIEW_ANALYSIS as OverviewAnalysis | null,
      }
    default:
      return {
        dailyData: APRIL_DAILY_DATA,
        adsData: APRIL_ADS_DATA,
        kpiData: APRIL_KPI_DATA,
        spendByCampaign: APRIL_SPEND_BY_CAMPAIGN,
        weeklyFollows: APRIL_WEEKLY_FOLLOWS,
        previousMonth: null,
        priorMonthsDaily: [] as DailyData[],
        audienceTest: null,
        testing: null as TestingContext | null,
        igDailyFollows: null as IgDailyFollow[] | null,
        demographics: null as AudienceDemographics | null,
        overviewAnalysis: null as OverviewAnalysis | null,
      }
  }
}

// Engagement CPM (cost per 1,000 impressions) for a month, from its ad-level aggregate.
function engagementCPM(ads: AdData[]): number | null {
  let spend = 0
  let impressions = 0
  for (const ad of ads) {
    if (ad.campaign === "Engagement") {
      spend += ad.spend
      impressions += ad.impressions
    }
  }
  return impressions > 0 ? (spend / impressions) * 1000 : null
}

// CPM inputs for the Progress tab's cumulative-CPM line. Only months that ship a daily
// engagement-impressions series get a running line; the prior-month and prior-months
// average CPM are computed from each month's ad-level aggregate for the comparisons.
export function getCpmDataForMonth(month: MonthKey): {
  engDailyImpressions: Record<string, number> | null
  prevEngagementCPM: number | null
  prevCpmLabel: string | null
  avgEngagementCPM: number | null
  avgCpmMonthCount: number
} {
  switch (month) {
    case "sep-2026": {
      const priorAds = [APRIL_ADS_DATA, MAY_ADS_DATA, JUNE_ADS_DATA, JULY_ADS_DATA, AUGUST_ADS_DATA]
      const priorCpms = priorAds.map(engagementCPM).filter((v): v is number => v != null)
      return {
        engDailyImpressions: SEPTEMBER_ENGAGEMENT_DAILY_IMPRESSIONS,
        prevEngagementCPM: engagementCPM(AUGUST_ADS_DATA),
        prevCpmLabel: "August",
        avgEngagementCPM: priorCpms.length ? priorCpms.reduce((a, b) => a + b, 0) / priorCpms.length : null,
        avgCpmMonthCount: priorCpms.length,
      }
    }
    default:
      return {
        engDailyImpressions: null,
        prevEngagementCPM: null,
        prevCpmLabel: null,
        avgEngagementCPM: null,
        avgCpmMonthCount: 0,
      }
  }
}

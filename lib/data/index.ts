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
import type { IgDailyFollow, AudienceDemographics, TestingContext } from "./types"
import type { DailyData } from "./progress"
export { Q1_BASELINE, CAMPAIGNS } from "./types"
export type { Campaign, KPIData, AdData, SpendByCampaign, WeeklyFollows, IgDailyFollow, AudienceDemographics, TestingContext } from "./types"

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
      }
  }
}

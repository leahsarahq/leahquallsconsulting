import type { MonthKey } from "../month-context"
import { APRIL_DAILY_DATA, APRIL_ADS_DATA, APRIL_KPI_DATA, APRIL_SPEND_BY_CAMPAIGN, APRIL_WEEKLY_FOLLOWS } from "./april-2026"
import { MAY_DAILY_DATA, MAY_ADS_DATA, MAY_KPI_DATA, MAY_SPEND_BY_CAMPAIGN, MAY_WEEKLY_FOLLOWS, MAY_AUDIENCE_TEST } from "./may-2026"
import { JUNE_DAILY_DATA, JUNE_ADS_DATA, JUNE_KPI_DATA, JUNE_SPEND_BY_CAMPAIGN, JUNE_WEEKLY_FOLLOWS } from "./june-2026"
export { Q1_BASELINE, CAMPAIGNS } from "./types"
export type { Campaign, KPIData, AdData, SpendByCampaign, WeeklyFollows } from "./types"

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
        audienceTest: null,
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
        audienceTest: MAY_AUDIENCE_TEST,
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
        audienceTest: null,
      }
    default:
      return {
        dailyData: APRIL_DAILY_DATA,
        adsData: APRIL_ADS_DATA,
        kpiData: APRIL_KPI_DATA,
        spendByCampaign: APRIL_SPEND_BY_CAMPAIGN,
        weeklyFollows: APRIL_WEEKLY_FOLLOWS,
        previousMonth: null,
        audienceTest: null,
      }
  }
}

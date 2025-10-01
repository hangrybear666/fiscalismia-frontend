import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ContentCardCosts from '../minor/ContentCard_Costs';
import Grid from '@mui/material/Unstable_Grid2';
import ContentLineChart from '../minor/ContentChart_Line';
import { resourceProperties as res } from '../../resources/resource_properties';
import {
  getFixedIncomeByEffectiveDate,
  getAllFixedIncome,
  getAllFixedCosts,
  getFixedCostsByEffectiveDate
} from '../../services/pgConnections';
import { Palette, Paper } from '@mui/material';
import {
  constructContentCardObject,
  getUniqueEffectiveDates,
  getCombinedUniqueEffectiveDates,
  constructContentLineChartObject
} from '../../utils/sharedFunctions';
import { ContentCardObject, ContentChartLineObject, RouteInfo } from '../../types/custom/customTypes';
import { locales } from '../../utils/localeConfiguration';
import Dropdown_NaviationArrows from '../minor/Dropdown_NaviationArrows';

/**
 * @param {*} allFixedIncome all fixed income data within db
 * @param {*} allFixedCosts all fixed income data within db
 * @param {*} palette theme palette for colors
 * @returns contentChartObj constructed via helper method constructContentLineChartObject
 */
function extractChartData(allFixedIncome: any, allFixedCosts: any, palette: Palette) {
  const colors = {
    pointColor1: palette.success.main,
    lineColor1: palette.success.dark,
    pointColor2: palette.error.light,
    lineColor2: palette.error.dark,
    selectionColor: 'rgba(255, 77, 77,0.8)'
  };
  // Filter Income
  const incomeFiltered = allFixedIncome.results.filter((e: any) => e.type.toLowerCase() === res.INCOME_NET_SALARY_KEY);
  // unique effective dates as string array
  const incomeDatesArr: string[] = getUniqueEffectiveDates(incomeFiltered);
  // only read date string from datetime
  const overviewDataset: { x: string; y: number }[] = [];
  // for each unique date create an xAxis array with summed up monthly_cost values
  incomeDatesArr.forEach((xAxisEntry) => {
    overviewDataset.push({
      x: xAxisEntry.substring(0, 10),
      y: incomeFiltered
        .filter((e: any) => e.effective_date === xAxisEntry)
        .map((row: any) => Math.floor(row.value / row.monthly_interval))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    });
  });

  // No Filtering of Costs
  const costsFiltered = allFixedCosts.results;
  // unique effective dates as string array
  const costsDatesArr: string[] = getUniqueEffectiveDates(costsFiltered);
  const costsDataset: { x: string; y: number }[] = [];
  // for each unique date create an xAxis array with summed up monthly_cost values
  costsDatesArr.forEach((xAxisEntry) => {
    costsDataset.push({
      x: xAxisEntry.substring(0, 10),
      y: costsFiltered
        .filter((e: any) => e.effective_date === xAxisEntry)
        .map((row: any) => row.monthly_cost)
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    });
  });

  const incomeDataSets = {
    dataSet1: overviewDataset,
    dataSet1Name: locales().INCOME_MONTHLY_NET_INCOME,
    dataSet1Order: 1, // Datasets with higher order are drawn first
    dataSet2: costsDataset,
    dataSet2Name: locales().INCOME_MONTHLY_FIXED_COSTS,
    dataSet2Order: 0
  };

  // 1 merge effective-date x-axis into single array
  // 2 create array from set to eliminate duplicates
  // 3 read date substring in the format yyyy-mm-dd
  const xAxisArray = Array.from(new Set(incomeDatesArr.concat(costsDatesArr)))
    .map((e) => e.substring(0, 10))
    .sort((a, b) => (a > b ? 1 : -1)); // ASC sorted so left side of x axis starts with prior date
  const overview = constructContentLineChartObject(
    locales().INCOME_MONTHLY_BUDGET_CHART_HEADER,
    xAxisArray,
    incomeDataSets,
    colors
  );

  return { overview };
}

/**
 *  Extracts information of specific fixed income valid at a given date
 *  to display in cards dependent on the selected effective date
 * @param {*} specificFixedIncome
 * @param specificFixedCosts
 * @returns
 */
function extractCardData(specificFixedIncome: any, specificFixedCosts: any) {
  const monthlyNetIncome = constructContentCardObject(
    locales().INCOME_NET_INCOME,
    null,
    '1.00',
    null,
    null,
    res.NO_IMG
  );
  const oneTimeYearlyBonus = constructContentCardObject(
    locales().INCOME_ONE_TIME_BONUS,
    null,
    '12.00',
    null,
    null,
    res.NO_IMG
  );
  const monthlyTotalCost = constructContentCardObject(
    locales().INCOME_FIXED_COST_CARD_HEADER,
    null,
    '1.00',
    null,
    null,
    res.NO_IMG
  );
  // Monhtly Net Income
  const monthlyNetIncomeFiltered = specificFixedIncome.results
    .filter((e: any) => e.type.toLowerCase() === res.INCOME_NET_SALARY_KEY)
    .filter((e: any) => !e.description.toLowerCase().includes('bonus'));
  monthlyNetIncome.amount = monthlyNetIncomeFiltered
    .map((row: any) => Math.floor(row.value / row.monthly_interval))
    .reduce((partialSum: number, add: number) => partialSum + add, 0);
  monthlyNetIncome.details = monthlyNetIncomeFiltered.map((row: any) => row.description.trim());
  // One Time Yearly Bonus
  const oneTimeYearlyBonusFiltered = specificFixedIncome.results
    .filter((e: any) => e.type.toLowerCase() === res.INCOME_NET_SALARY_KEY)
    .filter((e: any) => e.description.toLowerCase().includes('bonus'));
  oneTimeYearlyBonus.amount = oneTimeYearlyBonusFiltered
    .map((row: any) => row.value)
    .reduce((partialSum: number, add: number) => partialSum + add, 0);
  oneTimeYearlyBonus.details = oneTimeYearlyBonusFiltered.map((row: any) => row.description.trim());
  // Total Fixed Costs
  monthlyTotalCost.amount = specificFixedCosts.results
    .map((row: any) => row.monthly_cost)
    .reduce((partialSum: number, add: number) => partialSum + add, 0);
  monthlyTotalCost.details = [locales().MENU_LIVING_ESSENTIALS, locales().MENU_RECREATION_RELAXATION];
  return { monthlyNetIncome, oneTimeYearlyBonus, monthlyTotalCost };
}

interface Income_Monthly_BudgetProps {
  routeInfo: RouteInfo;
}
/**
 * Compares two datasets to eachother: Monhtly fixed costs and monthly income. The diff is visualized in a horizontal line chart containing one line per dataset.
 * @param {Income_Monthly_BudgetProps} _props
 * @returns
 */
export default function Income_Monthly_Budget(_props: Income_Monthly_BudgetProps) {
  const { palette } = useTheme();
  // Selected Specific Fixed Income
  const [monthlyTotalCostCard, setMonthlyTotalCostCard] = useState<ContentCardObject>();
  const [monthlyNetIncomeCard, setMonthlyNetIncomeCard] = useState<ContentCardObject>();
  const [oneTimeYearlyBonusCard, setOneTimeYearlyBonusCard] = useState<ContentCardObject>();
  // Monthly Net income Visualized in Barchart
  const [monthlyNetIncomeChart, setMonthlyNetIncomeChart] = useState<ContentChartLineObject>();
  // Effective Dates
  const [effectiveDateSelectItems, setEffectiveDateSelectItems] = useState<string[]>([]);
  const [selectedEffectiveDate, setSelectedEffectiveDate] = useState('');
  const handleSelect = (selected: string): void => {
    setSelectedEffectiveDate(selected);
  };

  useEffect(() => {
    const queryAllFixedIncomeData = async () => {
      // All income data in the DB
      const allFixedIncomeResponse = await getAllFixedIncome();
      const allFixedCostsResponse = await getAllFixedCosts();
      const effectiveDateSelectItems: string[] = getCombinedUniqueEffectiveDates(
        allFixedIncomeResponse.results,
        allFixedCostsResponse.results
      ) as string[];
      setSelectedEffectiveDate(effectiveDateSelectItems[0]);
      setEffectiveDateSelectItems(effectiveDateSelectItems);
      const allFixedIncomeChartData = extractChartData(allFixedIncomeResponse, allFixedCostsResponse, palette);
      setMonthlyNetIncomeChart(allFixedIncomeChartData.overview);
    };
    queryAllFixedIncomeData();
  }, []);

  useEffect(() => {
    const getSpecificFixedIncome = async () => {
      const specificFixedIncome = await getFixedIncomeByEffectiveDate(
        selectedEffectiveDate
          ? selectedEffectiveDate.substring(0, 10) // Specific Income via selected effective date
          : effectiveDateSelectItems
            ? effectiveDateSelectItems[0].substring(0, 10) // Specific Income via first entry in all effective dates
            : res.FALLBACK_DATE
      ); // Fallback to provided date
      const specificFixedCost = await getFixedCostsByEffectiveDate(
        selectedEffectiveDate
          ? selectedEffectiveDate.substring(0, 10) // Specific Income via selected effective date
          : effectiveDateSelectItems
            ? effectiveDateSelectItems[0].substring(0, 10) // Specific Income via first entry in all effective dates
            : res.FALLBACK_DATE
      ); // Fallback to provided date
      const extractedFixedIncome = extractCardData(specificFixedIncome, specificFixedCost);
      setMonthlyNetIncomeCard(extractedFixedIncome.monthlyNetIncome);
      setOneTimeYearlyBonusCard(extractedFixedIncome.oneTimeYearlyBonus);
      setMonthlyTotalCostCard(extractedFixedIncome.monthlyTotalCost);
    };
    // Prevents unnecessary initial Fallback query on pageload before queryAllFixedIncomeData has set the selectedEffectiveDate state
    if (selectedEffectiveDate) {
      getSpecificFixedIncome();
    }
  }, [selectedEffectiveDate]);

  return (
    <>
      <Grid container spacing={3} justifyContent="center">
        <Grid xs={0} xl={1.5}></Grid>
        <Grid xs={12} xl={9}>
          <Dropdown_NaviationArrows
            selectedValue={selectedEffectiveDate}
            handleSelect={handleSelect}
            selectItems={effectiveDateSelectItems}
          />
        </Grid>
        <Grid xs={0} xl={1.5}></Grid>
        <Grid xs={0} xl={1.5}></Grid>
        {monthlyNetIncomeCard ? (
          <Grid xs={12} md={6} xl={3}>
            <ContentCardCosts {...monthlyNetIncomeCard} />
          </Grid>
        ) : null}
        {oneTimeYearlyBonusCard ? (
          <Grid xs={12} md={6} xl={3}>
            <ContentCardCosts {...oneTimeYearlyBonusCard} />
          </Grid>
        ) : null}
        {monthlyTotalCostCard ? (
          <Grid xs={12} md={6} xl={3}>
            <ContentCardCosts {...monthlyTotalCostCard} />
          </Grid>
        ) : null}
        <Grid xs={0} xl={1.5}></Grid>
        <Grid xs={0} xl={1}></Grid>
        {monthlyNetIncomeChart ? (
          <Grid xs={12} xl={10} display="flex" alignItems="center" justifyContent="center">
            <Paper
              elevation={6}
              sx={{
                borderRadius: 0,
                border: `1px solid ${palette.border.dark}`,
                padding: 1,
                backgroundColor: palette.background.default,
                width: '90%',
                height: 500
              }}
            >
              <ContentLineChart {...monthlyNetIncomeChart} dataSetCount={2} selectedLabel={selectedEffectiveDate} />
            </Paper>
          </Grid>
        ) : null}
        <Grid xs={0} xl={1}></Grid>
      </Grid>
    </>
  );
}

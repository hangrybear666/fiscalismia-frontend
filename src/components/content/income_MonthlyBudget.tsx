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
import SelectDropdown from '../minor/SelectDropdown';
import { Palette, Paper } from '@mui/material';
import {
  constructContentCardObject,
  getUniqueEffectiveDates,
  getCombinedUniqueEffectiveDates,
  constructContentLineChartObject
} from '../../utils/sharedFunctions';
import { ContentCardObject, ContentChartLineObject } from '../../types/custom/customTypes';

/**
 * @param {*} allFixedIncome all fixed income data within db
 * @param {*} allFixedCosts all fixed income data within db
 * @param {*} palette theme palette for colors
 * @returns contentChartObj constructed via helper method constructContentChartObject
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
  const incomeDatesArr: string[] = getUniqueEffectiveDates(incomeFiltered) as string[];
  // only read date string from datetime
  let overviewDataset: { x: string; y: number }[] = [];
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
  const costsDatesArr: string[] = getUniqueEffectiveDates(costsFiltered) as string[];
  let costsDataset: { x: string; y: number }[] = [];
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
    dataSet1Name: res.INCOME_MONTHLY_NET_INCOME,
    dataSet1Order: 1, // Datasets with higher order are drawn first
    dataSet2: costsDataset,
    dataSet2Name: res.INCOME_MONTHLY_FIXED_COSTS,
    dataSet2Order: 0
  };

  // 1 merge effective-date x-axis into single array
  // 2 create array from set to eliminate duplicates
  // 3 read date substring in the format yyyy-mm-dd // TODO
  const xAxisArray = Array.from(new Set(incomeDatesArr.concat(costsDatesArr)))
    .map((e) => e.substring(0, 10))
    .sort((a, b) => (a > b ? 1 : -1)); // ASC sorted so left side of x axis starts with prior date
  let overview = constructContentLineChartObject(
    res.INCOME_MONTHLY_BUDGET_CHART_HEADER,
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
 * @returns
 */
function extractCardData(specificFixedIncome: any, specificFixedCosts: any) {
  let monthlyNetIncome = constructContentCardObject(res.INCOME_NET_INCOME, null, '1.00', null, null, res.NO_IMG);
  let oneTimeYearlyBonus = constructContentCardObject(res.INCOME_ONE_TIME_BONUS, null, '12.00', null, null, res.NO_IMG);
  let monthlyTotalCost = constructContentCardObject(
    res.INCOME_FIXED_COST_CARD_HEADER,
    null,
    '1.00',
    null,
    null,
    res.NO_IMG
  );
  // Monhtly Net Income
  let monthlyNetIncomeFiltered = specificFixedIncome.results
    .filter((e: any) => e.type.toLowerCase() === res.INCOME_NET_SALARY_KEY)
    .filter((e: any) => !e.description.toLowerCase().includes('bonus'));
  monthlyNetIncome.amount = Math.round(
    monthlyNetIncomeFiltered
      .map((row: any) => Math.floor(row.value / row.monthly_interval))
      .reduce((partialSum: number, add: number) => partialSum + add, 0)
  ).toFixed(2);
  monthlyNetIncome.details = monthlyNetIncomeFiltered.map((row: any) => row.description.trim());
  // One Time Yearly Bonus
  let oneTimeYearlyBonusFiltered = specificFixedIncome.results
    .filter((e: any) => e.type.toLowerCase() === res.INCOME_NET_SALARY_KEY)
    .filter((e: any) => e.description.toLowerCase().includes('bonus'));
  oneTimeYearlyBonus.amount = Math.round(
    oneTimeYearlyBonusFiltered
      .map((row: any) => row.value)
      .reduce((partialSum: number, add: number) => partialSum + add, 0)
  ).toFixed(2);
  oneTimeYearlyBonus.details = oneTimeYearlyBonusFiltered.map((row: any) => row.description.trim());
  // Total Fixed Costs
  monthlyTotalCost.amount = Math.round(
    specificFixedCosts.results
      .map((row: any) => row.monthly_cost)
      .reduce((partialSum: number, add: number) => partialSum + add, 0)
  ).toFixed(2);
  monthlyTotalCost.details = [res.LIVING_ESSENTIALS, res.RECREATION_RELAXATION];
  return { monthlyNetIncome, oneTimeYearlyBonus, monthlyTotalCost };
}

interface Income_Monthly_BudgetProps {}
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
      let allFixedIncomeResponse = await getAllFixedIncome();
      let allFixedCostsResponse = await getAllFixedCosts();
      let effectiveDateSelectItems: string[] = getCombinedUniqueEffectiveDates(
        allFixedIncomeResponse.results,
        allFixedCostsResponse.results
      ) as string[];
      setSelectedEffectiveDate(effectiveDateSelectItems[0]);
      setEffectiveDateSelectItems(effectiveDateSelectItems);
      let allFixedIncomeChartData = extractChartData(allFixedIncomeResponse, allFixedCostsResponse, palette);
      setMonthlyNetIncomeChart(allFixedIncomeChartData.overview);
    };
    queryAllFixedIncomeData();
  }, []);

  useEffect(() => {
    const getSpecificFixedIncome = async () => {
      let specificFixedIncome = await getFixedIncomeByEffectiveDate(
        selectedEffectiveDate
          ? selectedEffectiveDate.substring(0, 10) // Specific Income via selected effective date
          : effectiveDateSelectItems
            ? effectiveDateSelectItems[0].substring(0, 10) // Specific Income via first entry in all effective dates
            : res.FALLBACK_DATE
      ); // Fallback to provided date
      let specificFixedCost = await getFixedCostsByEffectiveDate(
        selectedEffectiveDate
          ? selectedEffectiveDate.substring(0, 10) // Specific Income via selected effective date
          : effectiveDateSelectItems
            ? effectiveDateSelectItems[0].substring(0, 10) // Specific Income via first entry in all effective dates
            : res.FALLBACK_DATE
      ); // Fallback to provided date
      let extractedFixedIncome = extractCardData(specificFixedIncome, specificFixedCost);
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
          <SelectDropdown
            selectLabel={res.DATE}
            selectItems={effectiveDateSelectItems}
            selectedValue={selectedEffectiveDate}
            handleSelect={handleSelect}
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

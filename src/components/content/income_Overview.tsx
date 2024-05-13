import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ContentCardCosts from '../minor/ContentCard_Costs';
import Grid from '@mui/material/Unstable_Grid2';
import ContentLineChart from '../minor/ContentChart_Line';
import { resourceProperties as res } from '../../resources/resource_properties';
import { getFixedIncomeByEffectiveDate, getAllFixedIncome } from '../../services/pgConnections';
import SelectDropdown from '../minor/SelectDropdown';
import { Paper } from '@mui/material';
import {
  constructContentCardObject,
  constructContentLineChartObject,
  getUniqueEffectiveDates
} from '../../utils/sharedFunctions';
import { ContentCardObject, ContentChartLineObject } from '../../types/custom/customTypes';

/**
 *
 * @param {*} allFixedIncome all fixed income data within db
 * @returns contentChartObj constructed via helper method constructContentLineChartObject
 */
function extractChartData(allFixedIncome: any) {
  const overviewColors = {
    pointColor1: 'rgba(220, 193, 111,0.6)',
    lineColor1: 'black',
    selectionColor: 'rgba(255, 77, 77,0.8)'
  };
  // No filtering of overall results required
  const overviewFiltered = allFixedIncome.results;
  // unique effective dates as string array
  const overviewDatesArr: string[] = getUniqueEffectiveDates(overviewFiltered) as string[];
  overviewDatesArr.sort();
  // only read date string from datetime
  const overviewXaxis = overviewDatesArr.map((e: string) => e.substring(0, 10));
  let overviewDataset: number[] = [];
  // for each unique date create an xAxis array with summed up monthly_cost values
  overviewDatesArr.forEach((xAxisEntry) => {
    overviewDataset.push(
      overviewFiltered
        .filter((e: any) => e.effective_date === xAxisEntry)
        .filter((e: any) => e.type.toLowerCase() === res.INCOME_GROSS_SALARY_KEY)
        .map((row: any) => Math.floor(row.value / row.monthly_interval) * 12)
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
  });

  const overviewDataSets = {
    dataSet1: overviewDataset,
    dataSet1Name: res.INCOME_YEARLY_GROSS_INCOME
  };
  let overview = constructContentLineChartObject(
    res.INCOME_YEARLY_GROSS_INCOME,
    overviewXaxis,
    overviewDataSets,
    overviewColors
  );

  return { overview };
}

/**
 *  Extracts information of specific fixed income valid at a given date
 *  to display in cards dependent on the selected effective date
 * @param {*} specificFixedIncome
 * @returns
 */
function extractCardData(specificFixedIncome: any) {
  let monthlyNetIncome = constructContentCardObject(res.INCOME_NET_INCOME, null, '1.00', null, null, res.NO_IMG);
  let monthlyGrossIncome = constructContentCardObject(res.INCOME_GROSS_INCOME, null, '1.00', null, null, res.NO_IMG);
  let yearlyGrossIncome = constructContentCardObject(res.INCOME_GROSS_INCOME, null, '12.00', null, null, res.NO_IMG);
  let oneTimeYearlyBonus = constructContentCardObject(res.INCOME_ONE_TIME_BONUS, null, '12.00', null, null, res.NO_IMG);
  // Monhtly Net Income
  let monthlyNetIncomeFiltered = specificFixedIncome.results
    .filter((e: any) => e.type.toLowerCase() === res.INCOME_NET_SALARY_KEY)
    .filter((e: any) => !e.description.toLowerCase().includes('bonus'));
  monthlyNetIncome.amount = Math.round(
    monthlyNetIncomeFiltered
      .map((row: any) => Math.floor(row.value / row.monthly_interval))
      .reduce((partialSum: number, a: number) => partialSum + a, 0)
  ).toFixed(2);
  monthlyNetIncome.details = monthlyNetIncomeFiltered.map((row: any) => row.description.trim());
  // Monthly Gross Income
  let monthlyGrossIncomeFiltered = specificFixedIncome.results
    .filter((e: any) => e.type.toLowerCase() === res.INCOME_GROSS_SALARY_KEY)
    .filter((e: any) => !e.description.toLowerCase().includes('bonus'));
  monthlyGrossIncome.amount = Math.round(
    monthlyGrossIncomeFiltered
      .map((row: any) => Math.floor(row.value / row.monthly_interval))
      .reduce((partialSum: number, add: number) => partialSum + add, 0)
  ).toFixed(2);
  monthlyGrossIncome.details = monthlyGrossIncomeFiltered.map((row: any) => row.description.trim());
  // Yearly Gross Income
  let yearlyGrossIncomeFiltered = specificFixedIncome.results.filter(
    (row: any) => row.type.toLowerCase() === res.INCOME_GROSS_SALARY_KEY
  );
  yearlyGrossIncome.amount = Math.round(
    yearlyGrossIncomeFiltered
      .map((row: any) => Math.floor(row.value / row.monthly_interval) * 12)
      .reduce((partialSum: number, add: number) => partialSum + add, 0)
  ).toFixed(2);
  yearlyGrossIncome.details = yearlyGrossIncomeFiltered.map((row: any) => row.description.trim());
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
  return { monthlyNetIncome, monthlyGrossIncome, yearlyGrossIncome, oneTimeYearlyBonus };
}
interface Income_OverviewProps {}
export default function Income_Overview(_props: Income_OverviewProps) {
  const { palette } = useTheme();
  // Selected Specific Fixed Income
  const [monthlyNetIncomeCard, setMonthlyNetIncomeCard] = useState<ContentCardObject>();
  const [monthlyGrossIncomeCard, setMonthlyGrossIncomeCard] = useState<ContentCardObject>();
  const [yearlyGrossIncomeCard, setYearlyGrossIncomeCard] = useState<ContentCardObject>();
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
      let effectiveDateSelectItems: string[] = getUniqueEffectiveDates(allFixedIncomeResponse.results) as string[];
      setSelectedEffectiveDate(effectiveDateSelectItems[0]);
      setEffectiveDateSelectItems(effectiveDateSelectItems);
      let allFixedIncomeChartData = extractChartData(allFixedIncomeResponse);
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
      let extractedFixedIncome = extractCardData(specificFixedIncome);
      setMonthlyNetIncomeCard(extractedFixedIncome.monthlyNetIncome);
      setMonthlyGrossIncomeCard(extractedFixedIncome.monthlyGrossIncome);
      setYearlyGrossIncomeCard(extractedFixedIncome.yearlyGrossIncome);
      setOneTimeYearlyBonusCard(extractedFixedIncome.oneTimeYearlyBonus);
    };
    // Prevents unnecessary initial Fallback query on pageload before queryAllFixedIncomeData has set the selectedEffectiveDate state
    if (selectedEffectiveDate) {
      getSpecificFixedIncome();
    }
  }, [selectedEffectiveDate]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <SelectDropdown
            selectLabel={res.DATE}
            selectItems={effectiveDateSelectItems}
            selectedValue={selectedEffectiveDate}
            handleSelect={handleSelect}
          />
        </Grid>
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
        {monthlyGrossIncomeCard ? (
          <Grid xs={12} md={6} xl={3}>
            <ContentCardCosts {...monthlyGrossIncomeCard} />
          </Grid>
        ) : null}
        {yearlyGrossIncomeCard ? (
          <Grid xs={12} md={6} xl={3}>
            <ContentCardCosts {...yearlyGrossIncomeCard} />
          </Grid>
        ) : null}
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
              <ContentLineChart {...monthlyNetIncomeChart} dataSetCount={1} selectedLabel={selectedEffectiveDate} />
            </Paper>
          </Grid>
        ) : null}
        <Grid xs={0} xl={1}></Grid>
      </Grid>
    </>
  );
}

import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ContentCardCosts from '../minor/ContentCard_Costs';
import Grid from '@mui/material/Unstable_Grid2';
import ContentLineChart from '../minor/ContentChart_Line';
import { resourceProperties as res } from '../../resources/resource_properties';
import { getFixedIncomeByEffectiveDate, getAllFixedIncome } from '../../services/pgConnections';
import SelectDropdown from '../minor/SelectDropdown';
import { Box, Palette, Paper } from '@mui/material';
import {
  constructContentCardObject,
  constructContentLineChartObject,
  getBreakPointWidth,
  getUniqueEffectiveDates
} from '../../utils/sharedFunctions';
import { ContentCardObject, ContentChartLineObject, RouteInfo } from '../../types/custom/customTypes';
import { locales } from '../../utils/localeConfiguration';

/**
 *
 * @param {*} allFixedIncome all fixed income data within db
 * @param palette
 * @returns contentChartObj constructed via helper method constructContentLineChartObject
 */
function extractChartData(allFixedIncome: any, palette: Palette) {
  const overviewColors = {
    pointColor1: palette.success.light,
    lineColor1: 'black',
    selectionColor: palette.error.main
  };
  // No filtering of overall results required
  const overviewFiltered = allFixedIncome.results;
  // unique effective dates as string array
  const overviewDatesArr: string[] = getUniqueEffectiveDates(overviewFiltered) as string[];
  overviewDatesArr.sort();
  // only read date string from datetime
  const overviewXaxis = overviewDatesArr.map((e: string) => e.substring(0, 10));
  const overviewDataset: number[] = [];
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
    dataSet1Name: locales().INCOME_YEARLY_GROSS_INCOME
  };
  const overview = constructContentLineChartObject(
    locales().INCOME_YEARLY_GROSS_INCOME,
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
  const monthlyNetIncome = constructContentCardObject(
    locales().INCOME_NET_INCOME,
    null,
    '1.00',
    null,
    null,
    res.NO_IMG
  );
  const monthlyGrossIncome = constructContentCardObject(
    locales().INCOME_GROSS_INCOME,
    null,
    '1.00',
    null,
    null,
    res.NO_IMG
  );
  const yearlyGrossIncome = constructContentCardObject(
    locales().INCOME_GROSS_INCOME,
    null,
    '12.00',
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
  // Monhtly Net Income
  const monthlyNetIncomeFiltered = specificFixedIncome.results
    .filter((e: any) => e.type.toLowerCase() === res.INCOME_NET_SALARY_KEY)
    .filter((e: any) => !e.description.toLowerCase().includes('bonus'));
  monthlyNetIncome.amount = monthlyNetIncomeFiltered
    .map((row: any) => Math.floor(row.value / row.monthly_interval))
    .reduce((partialSum: number, a: number) => partialSum + a, 0);
  monthlyNetIncome.details = monthlyNetIncomeFiltered.map((row: any) => row.description.trim());
  // Monthly Gross Income
  const monthlyGrossIncomeFiltered = specificFixedIncome.results
    .filter((e: any) => e.type.toLowerCase() === res.INCOME_GROSS_SALARY_KEY)
    .filter((e: any) => !e.description.toLowerCase().includes('bonus'));
  monthlyGrossIncome.amount = monthlyGrossIncomeFiltered
    .map((row: any) => Math.floor(row.value / row.monthly_interval))
    .reduce((partialSum: number, add: number) => partialSum + add, 0);
  monthlyGrossIncome.details = monthlyGrossIncomeFiltered.map((row: any) => row.description.trim());
  // Yearly Gross Income
  const yearlyGrossIncomeFiltered = specificFixedIncome.results.filter(
    (row: any) => row.type.toLowerCase() === res.INCOME_GROSS_SALARY_KEY
  );
  yearlyGrossIncome.amount = yearlyGrossIncomeFiltered
    .map((row: any) => Math.floor(row.value / row.monthly_interval) * 12)
    .reduce((partialSum: number, add: number) => partialSum + add, 0);
  yearlyGrossIncome.details = yearlyGrossIncomeFiltered.map((row: any) => row.description.trim());
  // One Time Yearly Bonus
  const oneTimeYearlyBonusFiltered = specificFixedIncome.results
    .filter((e: any) => e.type.toLowerCase() === res.INCOME_NET_SALARY_KEY)
    .filter((e: any) => e.description.toLowerCase().includes('bonus'));
  oneTimeYearlyBonus.amount = oneTimeYearlyBonusFiltered
    .map((row: any) => row.value)
    .reduce((partialSum: number, add: number) => partialSum + add, 0);
  oneTimeYearlyBonus.details = oneTimeYearlyBonusFiltered.map((row: any) => row.description.trim());
  return { monthlyNetIncome, monthlyGrossIncome, yearlyGrossIncome, oneTimeYearlyBonus };
}
interface Income_OverviewProps {
  routeInfo: RouteInfo;
}
/**
 * Monthly Income earned via having a Job (not including sales or investments!).
 * Contains several horizontal, responsive cards with detailed breakdown of payments.
 * Also contains a horizontal line chart showing income change over time.
 * @param {Income_OverviewProps} _props
 * @returns
 */
export default function Income_Overview(_props: Income_OverviewProps) {
  const { palette, breakpoints } = useTheme();
  // Selected Specific Fixed Income
  const [monthlyNetIncomeCard, setMonthlyNetIncomeCard] = useState<ContentCardObject>();
  const [monthlyGrossIncomeCard, setMonthlyGrossIncomeCard] = useState<ContentCardObject>();
  const [yearlyGrossIncomeCard, setYearlyGrossIncomeCard] = useState<ContentCardObject>();
  const [oneTimeYearlyBonusCard, setOneTimeYearlyBonusCard] = useState<ContentCardObject>();
  // Monthly Net income Visualized in Linechart
  const [monthlyNetIncomeChart, setMonthlyNetIncomeChart] = useState<ContentChartLineObject>();
  // Effective Dates
  const [effectiveDateSelectItems, setEffectiveDateSelectItems] = useState<string[]>([]);
  const [selectedEffectiveDate, setSelectedEffectiveDate] = useState('');

  // width for page content based on current window width extracted from supplied breakpoints.
  const breakpointWidth = getBreakPointWidth(breakpoints);

  const handleSelect = (selected: string): void => {
    setSelectedEffectiveDate(selected);
  };

  useEffect(() => {
    const queryAllFixedIncomeData = async () => {
      // All income data in the DB
      const allFixedIncomeResponse = await getAllFixedIncome();
      const effectiveDateSelectItems: string[] = getUniqueEffectiveDates(allFixedIncomeResponse.results) as string[];
      setSelectedEffectiveDate(effectiveDateSelectItems[0]);
      setEffectiveDateSelectItems(effectiveDateSelectItems);
      const allFixedIncomeChartData = extractChartData(allFixedIncomeResponse, palette);
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
      const extractedFixedIncome = extractCardData(specificFixedIncome);
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
      <Grid container>
        <Grid xs={0} xl={1}></Grid>
        <Grid xs={12} xl={10} display="flex" alignItems="center" justifyContent="center">
          {/* DETERMINES RESPONSIVE LAYOUT */}
          <Box
            sx={{
              width: breakpointWidth
            }}
          >
            <Grid container spacing={3}>
              <Grid xs={12}>
                <SelectDropdown
                  selectLabel={locales().GENERAL_DATE}
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
              {monthlyNetIncomeChart ? (
                <Grid xs={12} display="flex" alignItems="center" justifyContent="center">
                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: 0,
                      border: `1px solid ${palette.border.dark}`,
                      padding: 1,
                      backgroundColor: palette.background.default,
                      width: '100%',
                      height: 400
                    }}
                  >
                    <ContentLineChart
                      {...monthlyNetIncomeChart}
                      dataSetCount={1}
                      selectedLabel={selectedEffectiveDate}
                    />
                  </Paper>
                </Grid>
              ) : null}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

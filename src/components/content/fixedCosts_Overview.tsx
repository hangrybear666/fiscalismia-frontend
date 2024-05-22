import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ContentCardCosts from '../minor/ContentCard_Costs';
import Grid from '@mui/material/Unstable_Grid2';
import ContentLineChart from '../minor/ContentChart_Line';
import { resourceProperties as res, fixedCostCategories as categories } from '../../resources/resource_properties';
import { getFixedCostsByEffectiveDate, getAllFixedCosts } from '../../services/pgConnections';
import SelectDropdown from '../minor/SelectDropdown';
import { Box, Palette, Paper } from '@mui/material';
import {
  constructContentCardObject,
  constructContentLineChartObject,
  getBreakPointWidth,
  getUniqueEffectiveDates
} from '../../utils/sharedFunctions';
import { ContentCardObject, ContentChartLineObject, RouteInfo } from '../../types/custom/customTypes';

/**
 *
 * @param {*} allFixedCosts all fixed costs within db
 * @returns contentChartObj constructed via helper method constructContentLineChartObject
 */
function extractChartData(allFixedCosts: any, palette: Palette): { overview: ContentChartLineObject } {
  const overviewColors = {
    pointColor1: palette.secondary.light,
    lineColor1: 'black',
    selectionColor: palette.error.main
  };
  // No filtering of overall results required
  const overviewFiltered = allFixedCosts.results;
  // unique effective dates as string array
  const overviewDatesArr: string[] = getUniqueEffectiveDates(overviewFiltered) as string[];
  overviewDatesArr.sort();
  // only read date string from datetime
  const overviewXaxis = overviewDatesArr.map((e: any) => e.substring(0, 10));
  let overviewDataset: number[] = [];
  // for each unique date create an xAxis array with summed up monthly_cost values
  overviewDatesArr.forEach((xAxisEntry) => {
    overviewDataset.push(
      overviewFiltered
        .filter((e: any) => e.effective_date === xAxisEntry)
        .map((row: any) => parseFloat(row.monthly_cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
  });

  const overviewDataSets = {
    dataSet1: overviewDataset,
    dataSet1Name: res.FIXED_COSTS_MONHTLY_COST
  };
  let overview = constructContentLineChartObject(
    res.FIXED_COSTS_MONHTLY_COST,
    overviewXaxis,
    overviewDataSets,
    overviewColors
  );

  return { overview };
}

/**
 *  Extracts information of specific fixed costs valid at a given date
 *  to display in cards dependent on the selected effective date
 * @param {*} specificFixedCosts
 * @returns
 */
function extractCardData(specificFixedCosts: any) {
  let monthlyTotalCost = constructContentCardObject(res.FIXED_COSTS_MONHTLY_COST, null, '1.00', null, null, res.NO_IMG);
  let rentAndUtilities = constructContentCardObject(
    res.FIXED_COSTS_RENT_UTILITIES,
    null,
    '1.00',
    null,
    null,
    res.NO_IMG
  );
  let dslAndPhone = constructContentCardObject(res.FIXED_COSTS_DSL_PHONE, null, '1.00', null, null, res.NO_IMG);
  let sportsAndHealth = constructContentCardObject(res.FIXED_COSTS_SPORTS_HEALTH, null, '1.00', null, null, res.NO_IMG);
  let mediaAndEntertainment = constructContentCardObject(
    res.FIXED_COSTS_MEDIA_ENTERTAINMENT,
    null,
    '1.00',
    null,
    null,
    res.NO_IMG
  );
  let insurance = constructContentCardObject(res.FIXED_COSTS_INSURANCE, null, '1.00', null, null, res.NO_IMG);
  let studentLoans = constructContentCardObject(res.FIXED_COSTS_STUDENT_LOANS, null, '1.00', null, null, res.NO_IMG);
  // Monthly Total Amount
  monthlyTotalCost.amount = specificFixedCosts.results
    .map((row: any) => parseFloat(row.monthly_cost))
    .reduce((partialSum: number, add: number) => partialSum + add, 0);

  // Rent and Utilities
  let rentAndUtilitiesFiltered = specificFixedCosts.results.filter(
    (row: any) => row.category === categories.LIVING_ESSENTIALS_KEY
  );
  rentAndUtilities.amount = rentAndUtilitiesFiltered
    .map((row: any) => parseFloat(row.monthly_cost))
    .reduce((partialSum: number, add: number) => partialSum + add, 0);

  rentAndUtilities.details = rentAndUtilitiesFiltered.map((row: any) => row.description.trim());
  // DSL & Telephone
  let dslAndPhoneFiltered = specificFixedCosts.results.filter(
    (row: any) => row.category === categories.INTERNET_AND_PHONE_KEY
  );
  dslAndPhone.amount = dslAndPhoneFiltered
    .map((row: any) => parseFloat(row.monthly_cost))
    .reduce((partialSum: number, add: number) => partialSum + add, 0);

  dslAndPhone.details = dslAndPhoneFiltered.map((row: any) => row.description.trim());
  // Sports and Health
  let sportsAndHealthFiltered = specificFixedCosts.results.filter(
    (row: any) =>
      row.category === categories.SPORTS_FACILITIES_KEY ||
      row.category === categories.SUPPLEMENTS_HEALTH_KEY ||
      row.category === categories.SUPPLEMENTS_PERFORMANCE_KEY ||
      row.category === categories.PHYSIO_AND_HEALTH_COURSES_KEY
  );
  sportsAndHealth.amount = sportsAndHealthFiltered
    .map((row: any) => parseFloat(row.monthly_cost))
    .reduce((partialSum: number, add: number) => partialSum + add, 0);

  sportsAndHealth.details = sportsAndHealthFiltered.map((row: any) => row.description.trim());
  // Media and Entertainment
  let mediaAndEntertainmentFiltered = specificFixedCosts.results.filter(
    (row: any) =>
      row.category === categories.LEISURE_GAMING_KEY ||
      row.category === categories.LEISURE_MUSIC_PODCASTS_KEY ||
      row.category === categories.LEISURE_TV_CINEMA_KEY
  );
  mediaAndEntertainment.amount = mediaAndEntertainmentFiltered
    .map((row: any) => parseFloat(row.monthly_cost))
    .reduce((partialSum: number, add: number) => partialSum + add, 0);

  mediaAndEntertainment.details = mediaAndEntertainmentFiltered.map((row: any) => row.description.trim());
  // Insurance
  let insuranceFiltered = specificFixedCosts.results.filter((row: any) => row.category === categories.INSURANCE_KEY);
  insurance.amount = insuranceFiltered
    .map((row: any) => parseFloat(row.monthly_cost))
    .reduce((partialSum: number, add: number) => partialSum + add, 0);

  insurance.details = insuranceFiltered.map((row: any) => row.description.trim());
  // Student Loans
  let studentLoansFiltered = specificFixedCosts.results.filter(
    (row: any) => row.category === categories.STUDENT_LOANS_KEY
  );
  studentLoans.amount = studentLoansFiltered
    .map((row: any) => parseFloat(row.monthly_cost))
    .reduce((partialSum: number, add: number) => partialSum + add, 0);

  studentLoans.details = studentLoansFiltered.map((row: any) => row.description.trim());
  return {
    monthlyTotalCost,
    rentAndUtilities,
    dslAndPhone,
    sportsAndHealth,
    mediaAndEntertainment,
    insurance,
    studentLoans
  };
}

interface FixedCosts_OverviewProps {
  routeInfo: RouteInfo;
}

export default function FixedCosts_Overview(_props: FixedCosts_OverviewProps) {
  const { palette, breakpoints } = useTheme();
  // Selected Specific Fixed Costs
  const [monthlyTotalCostCard, setMonthlyTotalCostCard] = useState<ContentCardObject>();
  const [rentAndUtilitiesCard, setRentAndUtilitiesCard] = useState<ContentCardObject>();
  const [dslAndPhoneCard, setDslAndPhoneCard] = useState<ContentCardObject>();
  const [sportsAndHealthCard, setSportsAndHealthCard] = useState<ContentCardObject>();
  const [mediaAndEntertainmentCard, setMediaAndEntertainmentCard] = useState<ContentCardObject>();
  const [insuranceCard, setInsuranceCard] = useState<ContentCardObject>();
  const [studentLoansCard, setStudentLoansCard] = useState<ContentCardObject>();
  // All Fixed Costs Visualized in Barchart
  const [allFixedCostsChart, setAllFixedCostsChart] = useState<ContentChartLineObject>();
  // Effective Dates
  const [effectiveDateSelectItems, setEffectiveDateSelectItems] = useState<string[]>([]);
  const [selectedEffectiveDate, setSelectedEffectiveDate] = useState('');

  // width for page content based on current window width extracted from supplied breakpoints.
  const breakpointWidth = getBreakPointWidth(breakpoints);

  const handleSelect = (selected: string): void => {
    setSelectedEffectiveDate(selected);
  };

  useEffect(() => {
    const queryAllFixedCosts = async () => {
      // All fixed costs in the DB
      let allFixedCosts = await getAllFixedCosts();
      let effectiveDateSelectItems: string[] = getUniqueEffectiveDates(allFixedCosts.results) as string[];
      setSelectedEffectiveDate(effectiveDateSelectItems[0]);
      setEffectiveDateSelectItems(effectiveDateSelectItems);
      let allFixedCostsChartData = extractChartData(allFixedCosts, palette);
      setAllFixedCostsChart(allFixedCostsChartData.overview);
    };
    queryAllFixedCosts();
  }, []);

  useEffect(() => {
    const getSpecificFixedCosts = async () => {
      let specificFixedCosts = await getFixedCostsByEffectiveDate(
        selectedEffectiveDate
          ? selectedEffectiveDate.substring(0, 10) // Spezifische Kosten via ausgewähltem effective date
          : effectiveDateSelectItems
            ? effectiveDateSelectItems[0].substring(0, 10) // Spezifische Kosten via erstem Eintrag aus allen effective dates
            : res.FALLBACK_DATE
      ); // Fallback auf übergebenes Datum
      let extractedFixedCosts = extractCardData(specificFixedCosts);
      setMonthlyTotalCostCard(extractedFixedCosts.monthlyTotalCost);
      setRentAndUtilitiesCard(extractedFixedCosts.rentAndUtilities);
      setDslAndPhoneCard(extractedFixedCosts.dslAndPhone);
      setSportsAndHealthCard(extractedFixedCosts.sportsAndHealth);
      setMediaAndEntertainmentCard(extractedFixedCosts.mediaAndEntertainment);
      setInsuranceCard(extractedFixedCosts.insurance);
      setStudentLoansCard(extractedFixedCosts.studentLoans);
    };
    // Prevents unnecessary initial Fallback query on pageload before queryAllFixedCosts has set the selectedEffectiveDate state
    if (selectedEffectiveDate) {
      getSpecificFixedCosts();
    }
  }, [selectedEffectiveDate]);

  return (
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
                selectLabel={res.DATE}
                selectItems={effectiveDateSelectItems}
                selectedValue={selectedEffectiveDate}
                handleSelect={handleSelect}
              />
            </Grid>
            {monthlyTotalCostCard ? (
              <Grid xs={12}>
                <ContentCardCosts elevation={12} {...monthlyTotalCostCard} />
              </Grid>
            ) : null}
            {rentAndUtilitiesCard ? (
              <Grid xs={6} md={4} xl={2}>
                <ContentCardCosts {...rentAndUtilitiesCard} />
              </Grid>
            ) : null}

            {studentLoansCard ? (
              <Grid xs={6} md={4} xl={2}>
                <ContentCardCosts {...studentLoansCard} />
              </Grid>
            ) : null}
            {dslAndPhoneCard ? (
              <Grid xs={6} md={4} xl={2}>
                <ContentCardCosts {...dslAndPhoneCard} />
              </Grid>
            ) : null}
            {sportsAndHealthCard ? (
              <Grid xs={6} md={4} xl={2}>
                <ContentCardCosts {...sportsAndHealthCard} />
              </Grid>
            ) : null}
            {mediaAndEntertainmentCard ? (
              <Grid xs={6} md={4} xl={2}>
                <ContentCardCosts {...mediaAndEntertainmentCard} />
              </Grid>
            ) : null}
            {insuranceCard ? (
              <Grid xs={6} md={4} xl={2}>
                <ContentCardCosts {...insuranceCard} />
              </Grid>
            ) : null}
            {allFixedCostsChart ? (
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
                  <ContentLineChart {...allFixedCostsChart} dataSetCount={1} selectedLabel={selectedEffectiveDate} />
                </Paper>
              </Grid>
            ) : null}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

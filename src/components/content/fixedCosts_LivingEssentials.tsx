import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ContentCardCosts from '../minor/ContentCard_Costs';
import Grid from '@mui/material/Unstable_Grid2';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import CellWifiOutlinedIcon from '@mui/icons-material/CellWifiOutlined';
import MoneyOffOutlinedIcon from '@mui/icons-material/MoneyOffOutlined';
import WaterDamageOutlinedIcon from '@mui/icons-material/WaterDamageOutlined';
import SelectDropdown from '../minor/SelectDropdown';
import ContentVerticalBarChart from '../minor/ContentChart_VerticalBar';
import { resourceProperties as res, fixedCostCategories as categories } from '../../resources/resource_properties';
import { getFixedCostsByEffectiveDate, getAllFixedCosts } from '../../services/pgConnections';
import { Paper, Theme } from '@mui/material';
import { constructContentCardObject, getUniqueEffectiveDates } from '../../utils/sharedFunctions';
import { ContentCardObject, ContentChartVerticalBarObject, RouteInfo } from '../../types/custom/customTypes';

const iconProperties = {
  fontSize: 55,
  opacity: 0.5,
  boxShadow: 10,
  borderRadius: 1
};

function filterLivingEssentials(specificFixedCosts: any) {
  return specificFixedCosts.results.filter(
    (row: any) =>
      row.category === categories.LIVING_ESSENTIALS_KEY ||
      row.category === categories.STUDENT_LOANS_KEY ||
      row.category === categories.INTERNET_AND_PHONE_KEY ||
      row.category === categories.INSURANCE_KEY
  );
}

function constructContentChartObject(
  title: string,
  xAxis: string[],
  dataSets: {
    dataSet1: any;
    dataSet2: any;
    dataSet3: any;
    dataSet4: any;
    dataSet1Name: string;
    dataSet2Name: string;
    dataSet3Name: string;
    dataSet4Name: string;
  },
  colors: { color1: string; color2: string; color3: string; color4: string }
): ContentChartVerticalBarObject {
  const contentChartObj = {
    chartTitle: title,
    labels: xAxis,
    dataSet1: dataSets?.dataSet1,
    dataSet2: dataSets?.dataSet2,
    dataSet3: dataSets?.dataSet3,
    dataSet4: dataSets?.dataSet4,
    dataSet1Name: dataSets?.dataSet1Name,
    dataSet2Name: dataSets?.dataSet2Name,
    dataSet3Name: dataSets?.dataSet3Name,
    dataSet4Name: dataSets?.dataSet4Name,
    color1: colors?.color1,
    color2: colors?.color2,
    color3: colors?.color3,
    color4: colors?.color4
  };
  return contentChartObj;
}

/**
 *
 * @param {*} allFixedCosts all fixed costs within db
 * @returns contentChartObj constructed via helper method constructContentChartObject
 */
function extractChartData(allFixedCosts: any) {
  const livingEssentialsColors = {
    color1: '',
    color2: '',
    color3: '',
    color4: ''
  };
  const livingEssentialsFiltered = filterLivingEssentials(allFixedCosts);
  // unique effective dates as string array
  const livingEssentialsEffectiveDatesArr: string[] = getUniqueEffectiveDates(livingEssentialsFiltered) as string[];
  livingEssentialsEffectiveDatesArr.sort();
  // only read dates from datetime
  const livingEssentialsXaxis = livingEssentialsEffectiveDatesArr.map((e: string) => e.substring(0, 10));
  let livingEssentialsDs1: number[] = [];
  let livingEssentialsDs2: number[] = [];
  let livingEssentialsDs3: number[] = [];
  let livingEssentialsDs4: number[] = [];
  // for each unique date create an xAxis array with summed up monthly_cost values
  livingEssentialsEffectiveDatesArr.forEach((xAxisEntry) => {
    livingEssentialsDs1.push(
      livingEssentialsFiltered
        .filter((e: any) => e.category === categories.LIVING_ESSENTIALS_KEY)
        .filter((e: any) => e.effective_date === xAxisEntry)
        .map((row: any) => parseFloat(row.monthly_cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
    livingEssentialsDs2.push(
      livingEssentialsFiltered
        .filter((e: any) => e.category === categories.STUDENT_LOANS_KEY)
        .filter((e: any) => e.effective_date === xAxisEntry)
        .map((row: any) => parseFloat(row.monthly_cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
    livingEssentialsDs3.push(
      livingEssentialsFiltered
        .filter((e: any) => e.category === categories.INTERNET_AND_PHONE_KEY)
        .filter((e: any) => e.effective_date === xAxisEntry)
        .map((row: any) => parseFloat(row.monthly_cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
    livingEssentialsDs4.push(
      livingEssentialsFiltered
        .filter((e: any) => e.category === categories.INSURANCE_KEY)
        .filter((e: any) => e.effective_date === xAxisEntry)
        .map((row: any) => parseFloat(row.monthly_cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
  });

  const livingEssentialsDataSets = {
    dataSet1: livingEssentialsDs1,
    dataSet2: livingEssentialsDs2,
    dataSet3: livingEssentialsDs3,
    dataSet4: livingEssentialsDs4,
    dataSet1Name: categories.LIVING_ESSENTIALS_VALUE,
    dataSet2Name: categories.STUDENT_LOANS_VALUE,
    dataSet3Name: categories.INTERNET_AND_PHONE_VALUE,
    dataSet4Name: categories.INSURANCE_VALUE
  };
  let livingEssentials = constructContentChartObject(
    res.LIVING_ESSENTIALS,
    livingEssentialsXaxis,
    livingEssentialsDataSets,
    livingEssentialsColors
  );

  return { livingEssentials };
}

/**
 * Extracts information of specific fixed costs valid at a given date
 *  to display in cards dependent on the selected effective date
 * @param {*} specificFixedCosts
 * @returns
 */
function extractCardData(specificFixedCosts: any) {
  let rentAndUtilities = constructContentCardObject(
    res.FIXED_COSTS_RENT_UTILITIES,
    null,
    '1.00',
    null,
    <LocalAtmOutlinedIcon sx={iconProperties} />,
    res.NO_IMG
  );
  let dslAndPhone = constructContentCardObject(
    res.FIXED_COSTS_DSL_PHONE,
    null,
    '1.00',
    null,
    <CellWifiOutlinedIcon sx={iconProperties} />,
    res.NO_IMG
  );
  let insurance = constructContentCardObject(
    res.FIXED_COSTS_INSURANCE,
    null,
    '1.00',
    null,
    <WaterDamageOutlinedIcon sx={iconProperties} />,
    res.NO_IMG
  );
  let studentLoans = constructContentCardObject(
    res.FIXED_COSTS_STUDENT_LOANS,
    null,
    '1.00',
    null,
    <MoneyOffOutlinedIcon sx={iconProperties} />,
    res.NO_IMG
  );
  // Rent and Utilities
  let rentAndUtilitiesFiltered = specificFixedCosts.results.filter(
    (row: any) => row.category === categories.LIVING_ESSENTIALS_KEY
  );
  rentAndUtilities.amount = Math.round(
    rentAndUtilitiesFiltered
      .map((row: any) => parseFloat(row.monthly_cost))
      .reduce((partialSum: number, add: number) => partialSum + add, 0)
  ).toFixed(2);
  rentAndUtilities.details = rentAndUtilitiesFiltered.map((row: any) =>
    row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.CURRENCY_EURO)
  );
  // DSL & Telephone
  let dslAndPhoneFiltered = specificFixedCosts.results.filter(
    (row: any) => row.category === categories.INTERNET_AND_PHONE_KEY
  );
  dslAndPhone.amount = Math.round(
    dslAndPhoneFiltered
      .map((row: any) => parseFloat(row.monthly_cost))
      .reduce((partialSum: number, add: number) => partialSum + add, 0)
  ).toFixed(2);
  dslAndPhone.details = dslAndPhoneFiltered.map((row: any) =>
    row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.CURRENCY_EURO)
  );
  // Insurance
  let insuranceFiltered = specificFixedCosts.results.filter((row: any) => row.category === categories.INSURANCE_KEY);
  insurance.amount = Math.round(
    insuranceFiltered
      .map((row: any) => parseFloat(row.monthly_cost))
      .reduce((partialSum: number, add: number) => partialSum + add, 0)
  ).toFixed(2);
  insurance.details = insuranceFiltered.map((row: any) =>
    row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.CURRENCY_EURO)
  );
  // Student Loans
  let studentLoansFiltered = specificFixedCosts.results.filter(
    (row: any) => row.category === categories.STUDENT_LOANS_KEY
  );
  studentLoans.amount = Math.round(
    studentLoansFiltered
      .map((row: any) => parseFloat(row.monthly_cost))
      .reduce((partialSum: number, add: number) => partialSum + add, 0)
  ).toFixed(2);
  studentLoans.details = studentLoansFiltered.map((row: any) =>
    row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.CURRENCY_EURO)
  );
  return { rentAndUtilities, dslAndPhone, insurance, studentLoans };
}

interface FixedCosts_LivingEssentialsProps {
  routeInfo: RouteInfo;
}

export default function FixedCosts_LivingEssentials(_props: FixedCosts_LivingEssentialsProps) {
  const { palette, breakpoints } = useTheme();
  // Selected Specific Fixed Costs
  const [rentAndUtilitiesCard, setRentAndUtilitiesCard] = useState<ContentCardObject>();
  const [dslAndPhoneCard, setDslAndPhoneCard] = useState<ContentCardObject>();
  const [insuranceCard, setInsuranceCard] = useState<ContentCardObject>();
  const [studentLoansCard, setStudentLoansCard] = useState<ContentCardObject>();
  // All Fixed Costs Visualized in Barchart
  const [livingEssentialsChart, setLivingEssentialsChart] = useState<ContentChartVerticalBarObject>();
  // Effective Dates
  const [effectiveDateSelectItems, setEffectiveDateSelectItems] = useState<string[]>([]);
  const [selectedEffectiveDate, setSelectedEffectiveDate] = useState<string>('');
  // breakpoint
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.only('xs'));
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.only('sm'));
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.only('md'));
  const isLg = useMediaQuery((theme: Theme) => theme.breakpoints.only('lg'));
  const isXl = useMediaQuery((theme: Theme) => theme.breakpoints.only('xl'));
  const breakpointWidth = isXs
    ? '90%'
    : isSm
      ? breakpoints.values.sm - 256
      : isMd
        ? breakpoints.values.md - 256
        : isLg
          ? breakpoints.values.lg - 256
          : isXl
            ? breakpoints.values.xl - 256
            : 0;
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
      let allFixedCostsChartData = extractChartData(allFixedCosts);
      setLivingEssentialsChart(allFixedCostsChartData.livingEssentials);
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
      setRentAndUtilitiesCard(extractedFixedCosts.rentAndUtilities);
      setDslAndPhoneCard(extractedFixedCosts.dslAndPhone);
      setInsuranceCard(extractedFixedCosts.insurance);
      setStudentLoansCard(extractedFixedCosts.studentLoans);
    };
    // Prevents unnecessary initial Fallback query on pageload before queryAllFixedCosts has set the selectedEffectiveDate state
    if (selectedEffectiveDate) {
      getSpecificFixedCosts();
    }
  }, [selectedEffectiveDate]);

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <SelectDropdown
          selectLabel={res.DATE}
          selectItems={effectiveDateSelectItems}
          selectedValue={selectedEffectiveDate}
          handleSelect={handleSelect}
        />
      </Grid>
      {rentAndUtilitiesCard ? (
        <Grid xs={6} md={4} xl={3}>
          <ContentCardCosts {...rentAndUtilitiesCard} />
        </Grid>
      ) : null}
      {studentLoansCard ? (
        <Grid xs={6} md={4} xl={3}>
          <ContentCardCosts {...studentLoansCard} />
        </Grid>
      ) : null}

      {dslAndPhoneCard ? (
        <Grid xs={6} md={4} xl={3}>
          <ContentCardCosts {...dslAndPhoneCard} />
        </Grid>
      ) : null}

      {insuranceCard ? (
        <Grid xs={6} md={4} xl={3}>
          <ContentCardCosts {...insuranceCard} />
        </Grid>
      ) : null}
      {/* All Living Essentials Bar Chart */}
      <Grid xs={0} xl={1}></Grid>
      {livingEssentialsChart ? (
        <Grid xs={12} xl={10} display="flex" alignItems="center" justifyContent="center">
          <Paper
            elevation={6}
            sx={{
              borderRadius: 0,
              border: `1px solid ${palette.border.dark}`,
              padding: 1,
              backgroundColor: palette.background.default,
              width: breakpointWidth,
              height: 500
            }}
          >
            <ContentVerticalBarChart
              {...livingEssentialsChart}
              dataSetCount={4}
              selectedLabel={selectedEffectiveDate}
              legendPos={isXs || isSm ? 'top' : 'left'}
            />
          </Paper>
        </Grid>
      ) : null}

      <Grid xs={0} xl={1}></Grid>
    </Grid>
  );
}

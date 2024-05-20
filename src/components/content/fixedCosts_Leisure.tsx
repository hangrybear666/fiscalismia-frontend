import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ContentCardCosts from '../minor/ContentCard_Costs';
import Grid from '@mui/material/Unstable_Grid2';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import { resourceProperties as res, fixedCostCategories as categories } from '../../resources/resource_properties';
import { getFixedCostsByEffectiveDate, getAllFixedCosts } from '../../services/pgConnections';
import ContentVerticalBarChart from '../minor/ContentChart_VerticalBar';
import SelectDropdown from '../minor/SelectDropdown';
import { Paper, Theme } from '@mui/material';
import {
  constructContentBarChartObject,
  constructContentCardObject,
  getUniqueEffectiveDates
} from '../../utils/sharedFunctions';
import { ContentCardObject, ContentChartVerticalBarObject, RouteInfo } from '../../types/custom/customTypes';

const iconProperties = {
  fontSize: 55,
  opacity: 0.5,
  boxShadow: 10,
  borderRadius: 1
};

function filterSportsAndHealth(fixedCosts: any) {
  return fixedCosts.results.filter(
    (row: any) =>
      row.category === categories.SPORTS_FACILITIES_KEY ||
      row.category === categories.SUPPLEMENTS_HEALTH_KEY ||
      row.category === categories.SUPPLEMENTS_PERFORMANCE_KEY ||
      row.category === categories.PHYSIO_AND_HEALTH_COURSES_KEY
  );
}

function filterMediaAndEntertainment(fixedCosts: any) {
  return fixedCosts.results.filter(
    (row: any) =>
      row.category === categories.LEISURE_GAMING_KEY ||
      row.category === categories.LEISURE_MUSIC_PODCASTS_KEY ||
      row.category === categories.LEISURE_TV_CINEMA_KEY
  );
}

/**
 *
 * @param {*} allFixedCosts all fixed costs within db
 * @returns contentChartObj constructed via helper method constructContentBarChartObject
 */
function extractChartData(allFixedCosts: any) {
  // Sports and Health
  const sportsColors = {
    color1: '',
    color2: '',
    color3: '',
    color4: ''
  };
  const sportsAndHealthFiltered = filterSportsAndHealth(allFixedCosts);
  // unique effective dates as string array
  const sportsEffectiveDatesArr: string[] = getUniqueEffectiveDates(sportsAndHealthFiltered) as string[];
  sportsEffectiveDatesArr.sort();
  // only read dates from datetime
  const sportsXaxis = sportsEffectiveDatesArr.map((e: string) => e.substring(0, 10));
  let sportsDs1: number[] = [];
  let sportsDs2: number[] = [];
  let sportsDs3: number[] = [];
  let sportsDs4: number[] = [];
  // for each unique date create an xAxis array with summed up monthly_cost values
  sportsEffectiveDatesArr.forEach((xAxisEntry) => {
    sportsDs1.push(
      sportsAndHealthFiltered
        .filter((e: any) => e.category === categories.SPORTS_FACILITIES_KEY)
        .filter((e: any) => e.effective_date === xAxisEntry)
        .map((row: any) => parseFloat(row.monthly_cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
    sportsDs2.push(
      sportsAndHealthFiltered
        .filter((e: any) => e.category === categories.SUPPLEMENTS_HEALTH_KEY)
        .filter((e: any) => e.effective_date === xAxisEntry)
        .map((row: any) => parseFloat(row.monthly_cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
    sportsDs3.push(
      sportsAndHealthFiltered
        .filter((e: any) => e.category === categories.SUPPLEMENTS_PERFORMANCE_KEY)
        .filter((e: any) => e.effective_date === xAxisEntry)
        .map((row: any) => parseFloat(row.monthly_cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
    sportsDs4.push(
      sportsAndHealthFiltered
        .filter((e: any) => e.category === categories.PHYSIO_AND_HEALTH_COURSES_KEY)
        .filter((e: any) => e.effective_date === xAxisEntry)
        .map((row: any) => parseFloat(row.monthly_cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
  });

  const sportsDataSets = {
    dataSet1: sportsDs1,
    dataSet2: sportsDs2,
    dataSet3: sportsDs3,
    dataSet4: sportsDs4,
    dataSet1Name: categories.SPORTS_FACILITIES_VALUE,
    dataSet2Name: categories.SUPPLEMENTS_HEALTH_VALUE,
    dataSet3Name: categories.SUPPLEMENTS_PERFORMANCE_VALUE,
    dataSet4Name: categories.PHYSIO_AND_HEALTH_COURSES_VALUE
  };
  let sportsAndHealth = constructContentBarChartObject(
    res.FIXED_COSTS_SPORTS_HEALTH,
    sportsXaxis,
    sportsDataSets,
    sportsColors
  );

  // Media and Entertainment
  const mediaColors = {
    color1: '',
    color2: '',
    color3: ''
  };
  let mediaAndEntertainmentFiltered = filterMediaAndEntertainment(allFixedCosts);
  // unique effective dates as string array
  const mediaEffectiveDatesArr: string[] = getUniqueEffectiveDates(mediaAndEntertainmentFiltered) as string[];
  mediaEffectiveDatesArr.sort();
  // only read dates from datetime
  const mediaXaxis = mediaEffectiveDatesArr.map((e: string) => e.substring(0, 10));
  let mediaDs1: number[] = [];
  let mediaDs2: number[] = [];
  let mediaDs3: number[] = [];
  // for each unique date create an xAxis array with summed up monthly_cost values
  mediaEffectiveDatesArr.forEach((xAxisEntry) => {
    mediaDs1.push(
      mediaAndEntertainmentFiltered
        .filter((e: any) => e.category === categories.LEISURE_GAMING_KEY)
        .filter((e: any) => e.effective_date === xAxisEntry)
        .map((row: any) => parseFloat(row.monthly_cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
    mediaDs2.push(
      mediaAndEntertainmentFiltered
        .filter((e: any) => e.category === categories.LEISURE_TV_CINEMA_KEY)
        .filter((e: any) => e.effective_date === xAxisEntry)
        .map((row: any) => parseFloat(row.monthly_cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
    mediaDs3.push(
      mediaAndEntertainmentFiltered
        .filter((e: any) => e.category === categories.LEISURE_MUSIC_PODCASTS_KEY)
        .filter((e: any) => e.effective_date === xAxisEntry)
        .map((row: any) => parseFloat(row.monthly_cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
  });
  const mediaDataSets = {
    dataSet1: mediaDs1,
    dataSet2: mediaDs2,
    dataSet3: mediaDs3,
    dataSet1Name: categories.LEISURE_GAMING_VALUE,
    dataSet2Name: categories.LEISURE_TV_CINEMA_VALUE,
    dataSet3Name: categories.LEISURE_MUSIC_PODCASTS_VALUE
  };
  let mediaAndEntertainment = constructContentBarChartObject(
    res.FIXED_COSTS_MEDIA_ENTERTAINMENT,
    mediaXaxis,
    mediaDataSets,
    mediaColors
  );
  return { sportsAndHealth, mediaAndEntertainment };
}

/**
 *  Extracts information of specific fixed costs valid at a given date
 *  to display in cards dependent on the selected effective date
 * @param {*} specificFixedCosts
 * @returns
 */
function extractCardData(specificFixedCosts: any) {
  let sportsAndHealth = constructContentCardObject(
    res.FIXED_COSTS_SPORTS_HEALTH,
    null,
    '1.00',
    null,
    <FitnessCenterOutlinedIcon sx={iconProperties} />,
    'https://source.unsplash.com/random/?fitness'
  );
  let mediaAndEntertainment = constructContentCardObject(
    res.FIXED_COSTS_MEDIA_ENTERTAINMENT,
    null,
    '1.00',
    null,
    <SubscriptionsOutlinedIcon sx={iconProperties} />,
    'https://source.unsplash.com/random/?cinema'
  );

  // Sports and Health
  let sportsAndHealthFiltered = filterSportsAndHealth(specificFixedCosts);
  sportsAndHealth.amount = sportsAndHealthFiltered
    .map((row: any) => row.monthly_cost)
    .reduce((partialSum: string, add: string) => parseFloat(partialSum) + parseFloat(add), 0);
  sportsAndHealth.details = sportsAndHealthFiltered.map((row: any) =>
    row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.CURRENCY_EURO)
  );

  // Media and Entertainment
  let mediaAndEntertainmentFiltered = filterMediaAndEntertainment(specificFixedCosts);
  mediaAndEntertainment.amount = mediaAndEntertainmentFiltered
    .map((row: any) => row.monthly_cost)
    .reduce((partialSum: string, add: string) => parseFloat(partialSum) + parseFloat(add), 0);
  mediaAndEntertainment.details = mediaAndEntertainmentFiltered.map((row: any) =>
    row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.CURRENCY_EURO)
  );
  return { sportsAndHealth, mediaAndEntertainment };
}

interface FixedCosts_LeisureProps {
  routeInfo: RouteInfo;
}

export default function FixedCosts_Leisure(_props: FixedCosts_LeisureProps) {
  const { palette, breakpoints } = useTheme();
  // Selected Specific Fixed Costs
  const [sportsAndHealthCard, setSportsAndHealthCard] = useState<ContentCardObject>();
  const [mediaAndEntertainmentCard, setMediaAndEntertainmentCard] = useState<ContentCardObject>();
  // All Fixed Costs Visualized in Barchart
  const [sportsAndHealthChart, setSportsAndHealthChart] = useState<ContentChartVerticalBarObject>();
  const [mediaAndEntertainmentChart, setMediaAndEntertainmentChart] = useState<ContentChartVerticalBarObject>();
  // Effective Dates
  const [effectiveDateSelectItems, setEffectiveDateSelectItems] = useState<string[]>([]);
  const [selectedEffectiveDate, setSelectedEffectiveDate] = useState<string>('');
  // breakpoint
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const handleSelect = (selected: string): void => {
    setSelectedEffectiveDate(selected);
  };

  useEffect(() => {
    const queryAllFixedCosts = async () => {
      // All fixed costs in the DB
      let allFixedCosts = await getAllFixedCosts();
      let effectiveDateSelectItems = getUniqueEffectiveDates(allFixedCosts.results) as string[];
      setSelectedEffectiveDate(effectiveDateSelectItems?.length > 0 ? effectiveDateSelectItems[0] : '');
      setEffectiveDateSelectItems(effectiveDateSelectItems);
      let allFixedCostsChartData = extractChartData(allFixedCosts);
      setSportsAndHealthChart(allFixedCostsChartData.sportsAndHealth);
      setMediaAndEntertainmentChart(allFixedCostsChartData.mediaAndEntertainment);
    };
    queryAllFixedCosts();
  }, []);

  useEffect(() => {
    const getSpecificFixedCosts = async () => {
      let specificfixedCosts = await getFixedCostsByEffectiveDate(
        selectedEffectiveDate
          ? selectedEffectiveDate.substring(0, 10) // Spezifische Kosten via ausgewähltem effective date
          : effectiveDateSelectItems
            ? effectiveDateSelectItems[0].substring(0, 10) // Spezifische Kosten via erstem Eintrag aus allen effective dates
            : res.FALLBACK_DATE
      ); // Fallback auf übergebenes Datum
      let selectedFixedCosts = extractCardData(specificfixedCosts);
      setSportsAndHealthCard(selectedFixedCosts.sportsAndHealth);
      setMediaAndEntertainmentCard(selectedFixedCosts.mediaAndEntertainment);
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
      {sportsAndHealthCard ? (
        <Grid md={12} lg={4}>
          <ContentCardCosts {...sportsAndHealthCard} imgHeight={275} />
        </Grid>
      ) : null}
      {sportsAndHealthChart ? (
        <Grid md={12} lg={8} display="flex" alignItems="center" justifyContent="center">
          <Paper
            elevation={6}
            sx={{
              borderRadius: 0,
              border: `1px solid ${palette.border.dark}`,
              padding: 1,
              backgroundColor: palette.background.default,
              width: isSmallScreen ? breakpoints.values.sm - 100 : '100%',
              height: 500
            }}
          >
            <ContentVerticalBarChart
              {...sportsAndHealthChart}
              dataSetCount={4}
              chartTitle={res.FIXED_COSTS_SPORTS_HEALTH}
              selectedLabel={selectedEffectiveDate}
              legendPos={isSmallScreen ? 'top' : 'left'}
            />
          </Paper>
        </Grid>
      ) : null}
      {mediaAndEntertainmentCard ? (
        <Grid md={12} lg={4}>
          <ContentCardCosts {...mediaAndEntertainmentCard} imgHeight={275} />
        </Grid>
      ) : null}
      {mediaAndEntertainmentChart ? (
        <Grid md={12} lg={8} display="flex" alignItems="center" justifyContent="center">
          <Paper
            elevation={6}
            sx={{
              borderRadius: 0,
              border: `1px solid ${palette.border.dark}`,
              padding: 1,
              backgroundColor: palette.background.default,
              width: isSmallScreen ? breakpoints.values.sm - 100 : '100%',
              height: 500
            }}
          >
            <ContentVerticalBarChart
              {...mediaAndEntertainmentChart}
              dataSetCount={3}
              selectedLabel={selectedEffectiveDate}
              legendPos={isSmallScreen ? 'top' : 'left'}
            />
          </Paper>
        </Grid>
      ) : null}
    </Grid>
  );
}

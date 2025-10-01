import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ContentCardCosts from '../minor/ContentCard_Costs';
import Grid from '@mui/material/Unstable_Grid2';
import { resourceProperties as res, fixedCostCategories as categories } from '../../resources/resource_properties';
import { getFixedCostsByEffectiveDate, getAllFixedCosts } from '../../services/pgConnections';
import ContentVerticalBarChart from '../minor/ContentChart_VerticalBar';
import { Paper, Theme } from '@mui/material';
import {
  constructContentVerticalBarChartObject,
  constructContentCardObject,
  getUniqueEffectiveDates
} from '../../utils/sharedFunctions';
import { ContentCardObject, ContentChartVerticalBarObject, RouteInfo } from '../../types/custom/customTypes';
import { locales } from '../../utils/localeConfiguration';
import Dropdown_NaviationArrows from '../minor/Dropdown_NaviationArrows';

/**
 * @param fixedCosts
 * @returns filtered dataset containing applicable categories
 */
function filterSportsAndHealth(fixedCosts: any) {
  return fixedCosts.results.filter(
    (row: any) =>
      row.category === categories.SPORTS_FACILITIES_KEY ||
      row.category === categories.SUPPLEMENTS_HEALTH_KEY ||
      row.category === categories.SUPPLEMENTS_PERFORMANCE_KEY ||
      row.category === categories.PHYSIO_AND_HEALTH_COURSES_KEY
  );
}

/**
 *
 * @param fixedCosts
 * @returns filtered dataset containing applicable categories
 */
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
 * @returns contentChartObj constructed via helper method constructContentVerticalBarChartObject
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
  const sportsEffectiveDatesArr: string[] = getUniqueEffectiveDates(sportsAndHealthFiltered);
  sportsEffectiveDatesArr.sort();
  // only read dates from datetime
  const sportsXaxis = sportsEffectiveDatesArr.map((e: string) => e.substring(0, 10));
  const sportsDs1: number[] = [];
  const sportsDs2: number[] = [];
  const sportsDs3: number[] = [];
  const sportsDs4: number[] = [];
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
  const sportsAndHealth = constructContentVerticalBarChartObject(
    locales().FIXED_COSTS_SPORTS_HEALTH,
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
  const mediaAndEntertainmentFiltered = filterMediaAndEntertainment(allFixedCosts);
  // unique effective dates as string array
  const mediaEffectiveDatesArr: string[] = getUniqueEffectiveDates(mediaAndEntertainmentFiltered);
  mediaEffectiveDatesArr.sort();
  // only read dates from datetime
  const mediaXaxis = mediaEffectiveDatesArr.map((e: string) => e.substring(0, 10));
  const mediaDs1: number[] = [];
  const mediaDs2: number[] = [];
  const mediaDs3: number[] = [];
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
  const mediaAndEntertainment = constructContentVerticalBarChartObject(
    locales().FIXED_COSTS_MEDIA_ENTERTAINMENT,
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
  const sportsAndHealth = constructContentCardObject(
    locales().FIXED_COSTS_SPORTS_HEALTH,
    null,
    '1.00',
    null,
    null,
    '/imgs/fitness-tooLarge.jpg'
  );
  const mediaAndEntertainment = constructContentCardObject(
    locales().FIXED_COSTS_MEDIA_ENTERTAINMENT,
    null,
    '1.00',
    null,
    null,
    '/imgs/cinema-tempdel.jpg'
  );

  // Sports and Health
  const sportsAndHealthFiltered = filterSportsAndHealth(specificFixedCosts);
  sportsAndHealth.amount = sportsAndHealthFiltered
    .map((row: any) => row.monthly_cost)
    .reduce((partialSum: string, add: string) => parseFloat(partialSum) + parseFloat(add), 0);
  sportsAndHealth.details = sportsAndHealthFiltered.map((row: any) =>
    row.description.trim().concat(' | ').concat(row.monthly_cost).concat(res.CURRENCY_EURO)
  );

  // Media and Entertainment
  const mediaAndEntertainmentFiltered = filterMediaAndEntertainment(specificFixedCosts);
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

/**
 * Monthly Fixed Cost Content Cards and Vertical Chartjs Bar Chart visualizing Data from 2 categories: Sports & Health and Media & Entertainment.
 * Date Selection for switching between dataset effective dates.
 * @param {FixedCosts_LeisureProps} _props
 * @returns
 */
export default function FixedCosts_Leisure(_props: FixedCosts_LeisureProps): JSX.Element {
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
      const allFixedCosts = await getAllFixedCosts();
      const effectiveDateSelectItems: string[] = getUniqueEffectiveDates(allFixedCosts.results);
      setSelectedEffectiveDate(effectiveDateSelectItems?.length > 0 ? effectiveDateSelectItems[0] : '');
      setEffectiveDateSelectItems(effectiveDateSelectItems);
      const allFixedCostsChartData = extractChartData(allFixedCosts);
      setSportsAndHealthChart(allFixedCostsChartData.sportsAndHealth);
      setMediaAndEntertainmentChart(allFixedCostsChartData.mediaAndEntertainment);
    };
    queryAllFixedCosts();
  }, []);

  useEffect(() => {
    const getSpecificFixedCosts = async () => {
      const specificfixedCosts = await getFixedCostsByEffectiveDate(
        selectedEffectiveDate
          ? selectedEffectiveDate.substring(0, 10) // Spezifische Kosten via ausgewähltem effective date
          : effectiveDateSelectItems
            ? effectiveDateSelectItems[0].substring(0, 10) // Spezifische Kosten via erstem Eintrag aus allen effective dates
            : res.FALLBACK_DATE
      ); // Fallback auf übergebenes Datum
      const selectedFixedCosts = extractCardData(specificfixedCosts);
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
        <Dropdown_NaviationArrows
          selectedValue={selectedEffectiveDate}
          handleSelect={handleSelect}
          selectItems={effectiveDateSelectItems}
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
              chartTitle={locales().FIXED_COSTS_SPORTS_HEALTH}
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

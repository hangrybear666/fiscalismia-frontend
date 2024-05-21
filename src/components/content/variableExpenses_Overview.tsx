import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import InputVariableExpenseModal from '../minor/Modal_InputVariableExpense';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { resourceProperties as res, monthYearSelection } from '../../resources/resource_properties';
import {
  getAllVariableExpenses,
  getAllVariableExpenseStores,
  getAllVariableExpenseCategories,
  getAllVariableExpenseSensitivities
} from '../../services/pgConnections';
import {
  Box,
  Container,
  IconButton,
  Palette,
  Stack,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import {
  constructContentBarChartObject,
  constructContentCardObject,
  constructContentLineChartObject,
  getUniqueEffectiveMonthYears,
  getUniqueEffectiveYears,
  getUniquePurchasingDates
} from '../../utils/sharedFunctions';
import {
  ContentCardObject,
  ContentChartLineObject,
  ContentChartVerticalBarObject,
  RouteInfo
} from '../../types/custom/customTypes';
import ContentCardCosts from '../minor/ContentCard_Costs';
import SelectDropdown from '../minor/SelectDropdown';
import ContentLineChart from '../minor/ContentChart_Line';
import ContentVerticalBarChart from '../minor/ContentChart_VerticalBar';

function getUniqueEffectiveDateYears(allVariableExpenses: any) {
  const uniqueEffectiveDateArray = getUniquePurchasingDates(allVariableExpenses);
  return getUniqueEffectiveYears(uniqueEffectiveDateArray);
}

/**
 * Extracts vertical bars for each filtered category, especially Groceries, Leisure, Gift and the combined aggregate Category Health & Body
 * @param {*} allVariableExpenses all variable expenses within db
 * @returns contentChartObj constructed via helper method constructContentBarChartObject
 */
function extractBarChartData(allVariableExpenses: any) {
  const barChartColors = {
    color1: '',
    color2: '',
    color3: '',
    color4: ''
  };
  const allVariableExpensesFiltered = allVariableExpenses.filter((row: any) => row.category.toLowerCase() !== 'sale');
  // unique purchasing date substrings in the format yyyy-mm as string array
  const uniqueExpenseDates: string[] = getUniquePurchasingDates(allVariableExpensesFiltered) as string[];
  const varExpensesBarChartXaxis: string[] = getUniqueEffectiveMonthYears(uniqueExpenseDates) as string[];
  // only read dates from datetime
  let varExpensesBarChartDs1: number[] = [];
  let varExpensesBarChartDs2: number[] = [];
  let varExpensesBarChartDs3: number[] = [];
  let varExpensesBarChartDs4: number[] = [];
  // for each unique date create an xAxis array with summed up expense values per filtered category
  varExpensesBarChartXaxis.forEach((xAxisEntry) => {
    varExpensesBarChartDs1.push(
      allVariableExpensesFiltered
        .filter((row: any) => row.purchasing_date.substring(0, 7) === xAxisEntry)
        .filter(
          (row: any) => row.category.toLowerCase() === res.VARIABLE_EXPENSES_OVERVIEW_CATEGORY_GROCERIES.toLowerCase()
        )
        .map((row: any) => parseFloat(row.cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
    varExpensesBarChartDs2.push(
      allVariableExpensesFiltered
        .filter((row: any) => row.purchasing_date.substring(0, 7) === xAxisEntry)
        .filter(
          (row: any) => row.category.toLowerCase() === res.VARIABLE_EXPENSES_OVERVIEW_CATEGORY_LEISURE.toLowerCase()
        )
        .map((row: any) => parseFloat(row.cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
    varExpensesBarChartDs3.push(
      allVariableExpensesFiltered
        .filter((row: any) => row.purchasing_date.substring(0, 7) === xAxisEntry)
        .filter((row: any) => row.category.toLowerCase() === res.VARIABLE_EXPENSES_OVERVIEW_CATEGORY_GIFT.toLowerCase())
        .map((row: any) => parseFloat(row.cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
    varExpensesBarChartDs4.push(
      allVariableExpensesFiltered
        .filter((row: any) => row.purchasing_date.substring(0, 7) === xAxisEntry)
        .filter(
          (row: any) =>
            row.category.toLowerCase() === res.VARIABLE_EXPENSES_OVERVIEW_CATEGORY_HEALTH.toLowerCase() ||
            row.category.toLowerCase() === res.VARIABLE_EXPENSES_OVERVIEW_CATEGORY_SUPPLEMENTS.toLowerCase() ||
            row.category.toLowerCase() === res.VARIABLE_EXPENSES_OVERVIEW_CATEGORY_HYGIENE.toLowerCase() ||
            row.category.toLowerCase() === res.VARIABLE_EXPENSES_OVERVIEW_CATEGORY_MEDICAL_EXPENSES.toLowerCase()
        )
        .map((row: any) => parseFloat(row.cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
  });

  const livingEssentialsDataSets = {
    dataSet1: varExpensesBarChartDs1,
    dataSet2: varExpensesBarChartDs2,
    dataSet3: varExpensesBarChartDs3,
    dataSet4: varExpensesBarChartDs3,
    dataSet1Name: res.VARIABLE_EXPENSES_OVERVIEW_CATEGORY_GROCERIES,
    dataSet2Name: res.VARIABLE_EXPENSES_OVERVIEW_CATEGORY_LEISURE,
    dataSet3Name: res.VARIABLE_EXPENSES_OVERVIEW_CATEGORY_GIFT,
    dataSet4Name: res.VARIABLE_EXPENSES_OVERVIEW_CATEGORY_COMBINED_HEALTH_AND_BODY
  };
  let varExpensesBarChart = constructContentBarChartObject(
    res.LIVING_ESSENTIALS,
    varExpensesBarChartXaxis,
    livingEssentialsDataSets,
    barChartColors
  );

  return { varExpensesBarChart };
}

/**
 *
 * @param {*} allVariableExpenses all variable expenses within db
 * @returns contentChartObj constructed via helper method constructContentLineChartObject
 */
function extractLineChartData(allVariableExpenses: any, palette: Palette) {
  const overviewColors = {
    pointColor1: palette.tertiary.light,
    lineColor1: 'black',
    selectionColor: palette.error.main
  };
  // No filtering of overall results required
  const overviewFiltered = allVariableExpenses;
  // unique purchasing date substrings in the format yyyy-mm as string array
  const uniqueExpenseDates: string[] = getUniquePurchasingDates(overviewFiltered) as string[];
  const overviewXaxis: string[] = getUniqueEffectiveMonthYears(uniqueExpenseDates) as string[];
  // only read date string from datetime
  let overviewDataset: number[] = [];
  // for each unique date create an xAxis array with summed up monthly_cost values
  overviewXaxis.forEach((xAxisEntry) => {
    overviewDataset.push(
      overviewFiltered
        .filter((row: any) => row.purchasing_date.substring(0, 7) === xAxisEntry)
        .map((row: any) => parseFloat(row.cost))
        .reduce((partialSum: number, add: number) => partialSum + add, 0)
    );
  });

  const overviewDataSets = {
    dataSet1: overviewDataset,
    dataSet1Name: res.VARIABLE_EXPENSES_OVERVIEW_LINE_CHART_HEADER
  };
  let overview = constructContentLineChartObject(
    res.VARIABLE_EXPENSES_OVERVIEW_LINE_CHART_HEADER,
    overviewXaxis,
    overviewDataSets,
    overviewColors
  );

  return { overview };
}

/**
 * Transforms a list of Objects from the db into simple arrays
 * @returns
 * storeAutoCompleteItemArray: unique stores within variable expenses
 * categoryAutoCompleteItemArray: unique categories within variable expenses
 * indulgencesAutoCompleteItemArray: unique indulgences within variable expenses
 */
function getStoreDataStructuresForAutocomplete(allStores: any[], allCategories: any[], allSensitivities: any[]) {
  const storeArray: string[] = new Array();
  allStores.forEach((e, i: number) => {
    storeArray[i] = `${e.description}`;
  });
  const categoryArray: string[] = new Array();
  allCategories.forEach((e, i: number) => {
    categoryArray[i] = `${e.description}`;
  });
  const indulgenceArray: string[] = new Array();
  allSensitivities.forEach((e, i: number) => {
    indulgenceArray[i] = `${e.description}`;
  });
  const storeAutoCompleteItemArray = Array.from(new Set(storeArray)).sort();
  const categoryAutoCompleteItemArray = Array.from(new Set(categoryArray)).sort();
  const indulgencesAutoCompleteItemArray = Array.from(new Set(indulgenceArray)).sort();
  return { storeAutoCompleteItemArray, categoryAutoCompleteItemArray, indulgencesAutoCompleteItemArray };
}

/**
 * Extracts the total expenses per category and returns an array of the categories with the largest expenses for the entire provided dataset.
 * @param allVariableExpenses
 * @returns 2d array consisting of 1-6 elements containing ["category name", summed_cost]
 */
function aggregateCostsPerCategory(allVariableExpenses: any): (string | number)[][] {
  type CategoryCostObj = { category: string; cost: number };
  const categoryCostsArr: CategoryCostObj[] = allVariableExpenses
    .filter((row: any) => row.category.toLowerCase() !== 'sale')
    .map((e: any) => {
      return { category: e.category, cost: parseFloat(e.cost) };
    });

  // creates a Map with category as the key and the summed up cost as value
  const categorySumMap = categoryCostsArr.reduce((map, item) => {
    if (!map.has(item.category)) {
      map.set(item.category, 0);
    }
    map.set(item.category, map.get(item.category)! + item.cost);
    return map;
  }, new Map<string, number>());

  // Creates a <string,number> Array containing the 6 categories with the largest expense total
  return Array.from(categorySumMap.entries())
    .sort((a: [string, number], b: [string, number]) => (a[1] < b[1] ? 1 : -1))
    .slice(0, 6)
    .map((e: [string, number]) => {
      return Array.from([e[0], parseFloat(e[1].toFixed(2))]);
    });
}

// TODO create custom type for purchase info
function extractAggregatedPurchaseInformation(allVariableExpenses: any, isMonthly: boolean) {
  let yearlyTotalExpenseCard = constructContentCardObject(
    res.VARIABLE_EXPENSES_OVERVIEW_TOTAL_EXPENSES,
    null,
    isMonthly ? '1.00' : '12.00',
    null,
    null,
    res.NO_IMG
  );
  let categoryCards: ContentCardObject[] = [];

  const costsPerCategory: (string | number)[][] = aggregateCostsPerCategory(allVariableExpenses);
  costsPerCategory.forEach((e: (string | number)[]) => {
    categoryCards.push(
      constructContentCardObject(e[0].toString(), Number(e[1]), isMonthly ? '1.00' : '12.00', null, null, res.NO_IMG)
    );
  });

  yearlyTotalExpenseCard.amount = allVariableExpenses
    .filter((row: any) => row.category.toLowerCase() !== 'sale')
    .map((row: any) => parseFloat(row.cost))
    .reduce((partialSum: number, add: number) => partialSum + add, 0);
  const purchaseInfo = {
    totalCard: yearlyTotalExpenseCard,
    categoryCards: categoryCards
  };
  return purchaseInfo;
}

interface VariableExpenses_OverviewProps {
  routeInfo: RouteInfo;
}

export default function VariableExpenses_Overview(_props: VariableExpenses_OverviewProps) {
  const { palette, breakpoints } = useTheme();
  // Variable Expense Data for Display
  const [allVariableExpenses, setAllVariableExpenses] = useState<any>(null);
  const [selectedVariableExpenses, setSelectedVariableExpenses] = useState<any>();
  const [aggregatedPurchaseInformation, setAggregatedPurchaseInformation] = useState<any>();
  // Monthly/Yearly Expenses Visualized in Linechart
  const [expenseLineChartData, setExpenseLineChartData] = useState<ContentChartLineObject>();
  // Monthly/Yearly Expenses Visualized in Vertical Barchart
  const [expenseBarChartData, setExpenseBarChartData] = useState<ContentChartVerticalBarObject>();
  const [selectedChartLabel, setSelectedChartLabel] = useState<string>('');
  // year selection
  const [yearSelectionData, setYearSelectionData] = useState<string[][]>();
  const [selectedYear, setSelectedYear] = useState<string>();
  const [selectedMonth, setSelectedMonth] = useState<string>(monthYearSelection.ARRAY_MONTH_ALL[0][0] as string);
  // to refresh table based on added food item after DB insertion
  const [addedItemId, setAddedItemId] = useState<Number>();
  // Autocomplete Data for InputModal
  const [storeAutoCompleteItemArray, setStoreAutoCompleteItemArray] = useState<string[]>([]);
  const [categoryAutoCompleteItemArray, setCategoryAutoCompleteItemArray] = useState<string[]>([]);
  const [indulgencesAutoCompleteItemArray, setIndulgencesAutoCompleteItemArray] = useState<string[]>([]);

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
  const tableHeadStyling = {
    backgroundColor: palette.primary.dark,
    '> th': { color: palette.common.white, letterSpacing: 1, fontWeight: 500 }
  };
  const tableRowStyling = {
    '&:nth-of-type(odd)': { backgroundColor: 'rgba(128,128,128,0.7)' },
    '&:nth-of-type(even)': { backgroundColor: 'rgba(184,184,184,0.8)' },
    '&:last-child td, &:last-child th': { border: 0 }
  };
  useEffect(() => {
    const getAllPricesAndDiscounts = async () => {
      let allVariableExpenses = await getAllVariableExpenses();
      const uniqueYears = getUniqueEffectiveDateYears(allVariableExpenses.results);
      setYearSelectionData(new Array(uniqueYears)); // 2D Array for mapping ToggleButtonGroup as parent
      // Line Chart aggregating total expenses per month
      const varExpenseLineChartAggregate = extractLineChartData(allVariableExpenses.results, palette);
      setExpenseLineChartData(varExpenseLineChartAggregate.overview);
      const varExpenseBarChartAggregate = extractBarChartData(allVariableExpenses.results);
      setExpenseBarChartData(varExpenseBarChartAggregate.varExpensesBarChart);
      // setSelectedYear(uniqueYears[0]);
      // handleYearSelection(null, uniqueYears[0]);
      let allStores = await getAllVariableExpenseStores();
      let allCategories = await getAllVariableExpenseCategories();
      let allSensitivities = await getAllVariableExpenseSensitivities();
      setAllVariableExpenses(allVariableExpenses.results);
      const autoCompleteItemArrays = getStoreDataStructuresForAutocomplete(
        allStores.results,
        allCategories.results,
        allSensitivities.results
      );
      setStoreAutoCompleteItemArray(autoCompleteItemArrays.storeAutoCompleteItemArray);
      setCategoryAutoCompleteItemArray(autoCompleteItemArrays.categoryAutoCompleteItemArray);
      setIndulgencesAutoCompleteItemArray(autoCompleteItemArrays.indulgencesAutoCompleteItemArray);
    };
    getAllPricesAndDiscounts();
  }, [addedItemId, selectedYear]);

  const handleYearSelection = (_event: React.MouseEvent<HTMLElement> | null, newValue: string) => {
    setSelectedYear(newValue);
    const filteredYearVarExpenses = allVariableExpenses.filter(
      (e: any) => e.purchasing_date.substring(0, 4) === newValue
    );
    handleSelectMonth(res.ALL);
    setSelectedVariableExpenses(filteredYearVarExpenses);
    const aggregatePurchaseInfo = extractAggregatedPurchaseInformation(filteredYearVarExpenses, false);
    setAggregatedPurchaseInformation(aggregatePurchaseInfo);
    setSelectedChartLabel('');
  };

  const handleSelectMonth = (selected: string): void => {
    setSelectedMonth(selected);
    let filteredMonthVarExpenses;
    const selectedMonthArr: (string | RegExp)[] = monthYearSelection.ARRAY_MONTH_ALL.filter(
      (e) => e[0] === selected
    )[0];
    if (selectedMonthArr && selectedMonthArr[0] === res.ALL) {
      // filter all expenses by preselected year
      filteredMonthVarExpenses = allVariableExpenses.filter(
        (e: any) => e.purchasing_date.substring(0, 4) === selectedYear
      );
      const aggregatePurchaseInfo = extractAggregatedPurchaseInformation(filteredMonthVarExpenses, false);
      setAggregatedPurchaseInformation(aggregatePurchaseInfo);
    } else {
      // filter all expenses by preselected year and month substring
      filteredMonthVarExpenses = allVariableExpenses
        .filter((e: any) => e.purchasing_date.substring(0, 4) === selectedYear)
        .filter((e: any) => e.purchasing_date.substring(5, 7) === selectedMonthArr[1]);
      const aggregatePurchaseInfo = extractAggregatedPurchaseInformation(filteredMonthVarExpenses, true);
      setAggregatedPurchaseInformation(aggregatePurchaseInfo);
      setSelectedChartLabel(`${selectedYear}-${selectedMonthArr[1]}`);
    }
    setSelectedVariableExpenses(filteredMonthVarExpenses);
  };

  /**
   * changes selected month via click on left arrow or right arrow.
   * Does nothing if we are in first month, or last month.
   * @param direction left or right
   */
  const handleMonthDirectionChanged = (direction: 'left' | 'right') => {
    const isPriorMonth = direction === 'left' ? true : false;
    let selectedMonthIndex = -1;
    monthYearSelection.ARRAY_MONTH_ALL.forEach((e, i) => {
      if (e[0] === selectedMonth) {
        selectedMonthIndex = i;
      }
    });
    if (isPriorMonth && selectedMonthIndex > 0) {
      handleSelectMonth(monthYearSelection.ARRAY_MONTH_ALL[selectedMonthIndex - 1][0] as string);
    } else if (!isPriorMonth && selectedMonthIndex < 12) {
      handleSelectMonth(monthYearSelection.ARRAY_MONTH_ALL[selectedMonthIndex + 1][0] as string);
    }
  };
  return (
    <>
      <Box>
        <Grid container>
          <Grid xs={0} xl={1}></Grid>
          <Grid xs={12} xl={10} display="flex" alignItems="center" justifyContent="center">
            <Box
              sx={{
                width: breakpointWidth
              }}
            >
              <Grid container spacing={3}>
                {/* NEW EXPENSE INPUT MODAL */}
                <Grid xs={12} md={3.5} xl={2}>
                  <InputVariableExpenseModal
                    setAddedItemId={setAddedItemId}
                    storeAutoCompleteItemArray={storeAutoCompleteItemArray}
                    categoryAutoCompleteItemArray={categoryAutoCompleteItemArray}
                    indulgencesAutoCompleteItemArray={indulgencesAutoCompleteItemArray}
                  />
                </Grid>

                {/* MONTH SELECTION */}
                <Grid xs={12} md={3} xl={2}>
                  <Stack direction="row">
                    <Tooltip title={res.VARIABLE_EXPENSES_OVERVIEW_PRIOR_MONTH_BTN_TOOLTIP}>
                      <IconButton
                        color="inherit"
                        onClick={() => handleMonthDirectionChanged('left')}
                        sx={{ paddingX: 2, width: 1 / 9 }}
                      >
                        <AssignmentReturnIcon />
                      </IconButton>
                    </Tooltip>
                    <Container maxWidth={false} sx={{ width: 7 / 9 }}>
                      <SelectDropdown
                        selectLabel={res.DATE}
                        selectItems={monthYearSelection.ARRAY_MONTH_ALL.map((e) => e[0] as string)}
                        selectedValue={selectedMonth}
                        handleSelect={handleSelectMonth}
                      />
                    </Container>
                    <Tooltip title={res.VARIABLE_EXPENSES_OVERVIEW_NEXT_MONTH_BTN_TOOLTIP}>
                      <IconButton
                        color="inherit"
                        onClick={() => handleMonthDirectionChanged('right')}
                        sx={{ paddingX: 2, width: 1 / 9 }}
                      >
                        <AssignmentReturnIcon
                          sx={{
                            transform: 'scaleX(-1)'
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Grid>
                {/* YEAR SELECTION */}
                <Grid xs={12} md={5.5} xl={8}>
                  {yearSelectionData
                    ? yearSelectionData.map((parent, index) => {
                        return (
                          <ToggleButtonGroup key={index} exclusive value={selectedYear} onChange={handleYearSelection}>
                            {parent.map((child, index) => {
                              return (
                                <ToggleButton
                                  key={index}
                                  size="large"
                                  value={child}
                                  selected={child === selectedYear}
                                  sx={{
                                    borderRadius: 0,
                                    paddingX: 2.0,
                                    '&:hover': {
                                      bgcolor: palette.mode === 'light' ? palette.grey[600] : palette.grey[600],
                                      color: palette.common.white
                                    },
                                    '&.Mui-selected:hover': {
                                      bgcolor: palette.mode === 'light' ? palette.grey[800] : palette.grey[500]
                                    },
                                    '&.Mui-selected': {
                                      bgcolor: palette.mode === 'light' ? palette.grey[900] : palette.grey[400],
                                      color: palette.mode === 'light' ? palette.common.white : palette.common.black,
                                      boxShadow: palette.mode === 'light' ? `0px 0px 4px 2px ${palette.grey[700]}` : '',
                                      transition: 'box-shadow 0.2s linear 0s'
                                    },
                                    '&.Mui-disabled': {
                                      color: palette.text.disabled
                                    }
                                  }}
                                >
                                  {child}
                                </ToggleButton>
                              );
                            })}
                          </ToggleButtonGroup>
                        );
                      })
                    : null}
                </Grid>
                {/* CONTENT CARDS WITH AGGREGATE VALUES PER MONTH/YEAR */}
                {aggregatedPurchaseInformation ? (
                  <React.Fragment>
                    {/* <Grid xs={12}>
                <ContentCardCosts elevation={12} {...aggregatedPurchaseInformation.totalCard} />
              </Grid> */}
                    {aggregatedPurchaseInformation.categoryCards
                      ? aggregatedPurchaseInformation.categoryCards.map((e: ContentCardObject) => (
                          <Grid xs={6} md={4} xl={2} key={e.header + e.amount}>
                            <ContentCardCosts elevation={12} {...e} />
                          </Grid>
                        ))
                      : null}
                    {/* Add empty grids for any months with less than 6 expense categories to retain horizontal width */}
                    {aggregatedPurchaseInformation?.categoryCards &&
                    aggregatedPurchaseInformation.categoryCards.length < 6
                      ? [...new Array(6 - aggregatedPurchaseInformation.categoryCards.length)].map((e: any) => (
                          <Grid xs={6} md={4} xl={2} key={e}></Grid>
                        ))
                      : null}
                  </React.Fragment>
                ) : null}

                {expenseLineChartData ? (
                  <Grid xs={12}>
                    <Grid xs={0} xl={1}></Grid>
                    <Grid xs={12} xl={10} display="flex" alignItems="center" justifyContent="center">
                      <Paper
                        elevation={6}
                        sx={{
                          borderRadius: 0,
                          border: `1px solid ${palette.border.dark}`,
                          padding: 1,
                          backgroundColor: palette.background.default,
                          width: '100%',
                          height: 300
                        }}
                      >
                        <ContentLineChart
                          {...expenseLineChartData}
                          dataSetCount={1}
                          selectedLabel={selectedChartLabel}
                        />
                      </Paper>
                    </Grid>
                    <Grid xs={0} xl={1}></Grid>
                  </Grid>
                ) : null}
                {/* CATEGORY SUMS VERTICAL BAR CHART */}
                {expenseBarChartData ? (
                  <Grid xs={12}>
                    <Grid xs={0} xl={1}></Grid>
                    <Grid xs={12} xl={10} display="flex" alignItems="center" justifyContent="center">
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
                        <ContentVerticalBarChart
                          {...expenseBarChartData}
                          dataSetCount={4}
                          selectedLabel={selectedChartLabel}
                          legendPos={isXs || isSm ? 'top' : 'left'}
                        />
                      </Paper>
                    </Grid>
                    <Grid xs={0} xl={1}></Grid>
                  </Grid>
                ) : null}
              </Grid>
            </Box>
          </Grid>
          <Grid xs={0} xl={1}></Grid>
        </Grid>
      </Box>
      {/* <TableContainer component={Paper} sx={{ borderRadius: 0, mt: 2 }}>
        <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow sx={tableHeadStyling}>
              <TableCell>description</TableCell>
              <TableCell>category</TableCell>
              <TableCell>store</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>cost</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">
                purchasing_date
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">
                is_planned
              </TableCell>
              <TableCell align="right">contains_indulgence</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>sensitivities</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedVariableExpenses
              ? selectedVariableExpenses.map((row: any) => (
                  <TableRow key={row.id} sx={tableRowStyling}>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.store}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{row.cost}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">
                      {row.purchasing_date}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">
                      {row.is_planned ? 'Ja' : 'Nein'}
                    </TableCell>
                    <TableCell align="right">{row.contains_indulgence ? 'Ja' : 'Nein'}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{row.indulgences}</TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer> */}
    </>
  );
}

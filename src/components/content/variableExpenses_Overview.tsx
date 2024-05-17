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
import { resourceProperties as res } from '../../resources/resource_properties';
import {
  getAllVariableExpenses,
  getAllVariableExpenseStores,
  getAllVariableExpenseCategories,
  getAllVariableExpenseSensitivities
} from '../../services/pgConnections';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  constructContentCardObject,
  getUniqueEffectiveYears,
  getUniquePurchasingDates
} from '../../utils/sharedFunctions';
import { ContentCardObject, RouteInfo } from '../../types/custom/customTypes';
import ContentCardCosts from '../minor/ContentCard_Costs';

function getUniqueEffectiveDateYears(allVariableExpenses: any) {
  const uniqueEffectiveDateArray = getUniquePurchasingDates(allVariableExpenses);
  return getUniqueEffectiveYears(uniqueEffectiveDateArray);
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
 * Extracts the total expenses per category and returns an array of the categories with the largest expenses.
 * @param allVariableExpenses
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

  // Creates a <string,string> Array containing the 6 categories with the largest expense total
  return Array.from(categorySumMap.entries())
    .sort((a: [string, number], b: [string, number]) => (a[1] < b[1] ? 1 : -1))
    .slice(0, 6)
    .map((e: [string, number]) => {
      return Array.from([e[0], parseFloat(e[1].toFixed(2))]);
    });
}

// TODO create custom type for purchase info
function extractAggregatedPurchaseInformation(allVariableExpenses: any) {
  let yearlyTotalExpenseCard = constructContentCardObject(
    res.FIXED_COSTS_MONHTLY_COST,
    null,
    '12.00',
    null,
    null,
    res.NO_IMG
  );
  let categoryCards: ContentCardObject[] = [];

  const costsPerCategory: (string | number)[][] = aggregateCostsPerCategory(allVariableExpenses);
  costsPerCategory.forEach((e: (string | number)[]) => {
    categoryCards.push(constructContentCardObject(e[0].toString(), Number(e[1]), '12.00', null, null, res.NO_IMG));
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
  const { palette } = useTheme();
  // Variable Expense Data for Display
  const [allVariableExpenses, setAllVariableExpenses] = useState<any>(null);
  const [selectedVariableExpenses, setSelectedVariableExpenses] = useState<any>();
  const [aggregatedPurchaseInformation, setAggregatedPurchaseInformation] = useState<any>();
  // year selection
  const [yearSelectionData, setYearSelectionData] = useState<string[][]>();
  const [selectedYear, setSelectedYear] = useState<string>();
  // to refresh table based on added food item after DB insertion
  const [addedItemId, setAddedItemId] = useState<Number>();
  // Autocomplete Data for InputModal
  const [storeAutoCompleteItemArray, setStoreAutoCompleteItemArray] = useState<string[]>([]);
  const [categoryAutoCompleteItemArray, setCategoryAutoCompleteItemArray] = useState<string[]>([]);
  const [indulgencesAutoCompleteItemArray, setIndulgencesAutoCompleteItemArray] = useState<string[]>([]);

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
      // setSelectedYear(uniqueYears[0])
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

  const handleYearSelection = (_event: React.MouseEvent<HTMLElement>, newValue: string) => {
    setSelectedYear(newValue);
    const filteredYearVarExpenses = allVariableExpenses.filter(
      (e: any) => e.purchasing_date.substring(0, 4) === newValue
    );
    setSelectedVariableExpenses(filteredYearVarExpenses);
    const aggregatePurchaseInfo = extractAggregatedPurchaseInformation(filteredYearVarExpenses);
    setAggregatedPurchaseInformation(aggregatePurchaseInfo);
  };

  return (
    <>
      <InputVariableExpenseModal
        setAddedItemId={setAddedItemId}
        storeAutoCompleteItemArray={storeAutoCompleteItemArray}
        categoryAutoCompleteItemArray={categoryAutoCompleteItemArray}
        indulgencesAutoCompleteItemArray={indulgencesAutoCompleteItemArray}
      />
      <Box>
        {yearSelectionData
          ? yearSelectionData.map((parent, index) => {
              return (
                <ToggleButtonGroup
                  key={index}
                  exclusive
                  value={selectedYear}
                  onChange={handleYearSelection}
                  sx={{ mt: 0.5, mb: 1 }}
                >
                  {parent.map((child, index) => {
                    return (
                      <ToggleButton
                        key={index}
                        size="large"
                        value={child}
                        selected={child === selectedYear}
                        sx={{
                          borderRadius: 0,
                          paddingX: 3.25,
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
      </Box>
      {aggregatedPurchaseInformation ? (
        <Grid container spacing={3}>
          <React.Fragment>
            <Grid xs={12}>
              <ContentCardCosts elevation={12} {...aggregatedPurchaseInformation.totalCard} />
            </Grid>
            {aggregatedPurchaseInformation.categoryCards
              ? aggregatedPurchaseInformation.categoryCards.map((e: ContentCardObject) => (
                  <Grid xs={6} md={4} xl={2}>
                    <ContentCardCosts elevation={12} {...e} />
                  </Grid>
                ))
              : null}
          </React.Fragment>
        </Grid>
      ) : null}
      <TableContainer component={Paper} sx={{ borderRadius: 0, mt: 2 }}>
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
                      {res.KCAL}
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
      </TableContainer>
    </>
  );
}

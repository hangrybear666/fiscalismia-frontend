import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputVariableExpenseModal from '../minor/Modal_InputVariableExpense';
import { resourceProperties as res } from '../../resources/resource_properties';
import {
  getAllVariableExpenses,
  getAllVariableExpenseStores,
  getAllVariableExpenseCategories,
  getAllVariableExpenseSensitivities
} from '../../services/pgConnections';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { getUniquePurchasingDates } from '../../utils/sharedFunctions';
import { RouteInfo } from '../../types/custom/customTypes';

/**
 * extracts all unique years within unique date array into an array
 * @param {*} allVariableExpenses
 * @returns array of year strings in the format yyyy
 */
function getUniqueEffectiveDateYears(allVariableExpenses: any) {
  const uniqueEffectiveDateArray = getUniquePurchasingDates(allVariableExpenses);
  const uniqueYearSet = new Set(uniqueEffectiveDateArray.map((e: any) => e.substring(0, 4)));
  return [...uniqueYearSet].sort(); // return as Array
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

interface VariableExpenses_OverviewProps {
  routeInfo: RouteInfo;
}
export default function VariableExpenses_Overview(_props: VariableExpenses_OverviewProps) {
  const { palette } = useTheme();
  // Variable Expense Data for Display
  const [allVariableExpenses, setAllVariableExpenses] = useState<any>(null);
  const [selectedVariableExpenses, setSelectedVariableExpenses] = useState<any>();
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
    setSelectedVariableExpenses(allVariableExpenses.filter((e: any) => e.purchasing_date.substring(0, 4) === newValue));
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
      <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
        <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow sx={tableHeadStyling}>
              <TableCell>{res.DEALS_OVERVIEW_THEADER_FOODITEM}</TableCell>
              <TableCell>{res.DEALS_OVERVIEW_THEADER_BRAND}</TableCell>
              <TableCell>{res.DEALS_OVERVIEW_THEADER_STORE}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                {res.DEALS_OVERVIEW_THEADER_MAIN_MACRO}
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">
                {res.DEALS_OVERVIEW_THEADER_KCAL_AMT_TOP}
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">
                {res.DEALS_OVERVIEW_THEADER_WEIGHT_TOP}
              </TableCell>
              <TableCell align="right">{res.DEALS_OVERVIEW_THEADER_PRICE_TOP}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                {res.DEALS_OVERVIEW_THEADER_LAST_UPDATE_TOP}
              </TableCell>
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

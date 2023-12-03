import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputVariableExpenseModal from '../minor/InputVariableExpenseModal';
import { resourceProperties as res } from '../../resources/resource_properties';
import { getAllVariableExpenses, getAllVariableExpenseStores, getAllVariableExpenseCategories, getAllVariableExpenseSensitivities } from '../../services/pgConnections';


/**
 * Transforms a list of Objects from the db into simple arrays
 * @param {*} allVariableExpenses autoCompleteItemArray: Array with store name
 * @returns
 * storeAutoCompleteItemArray: unique stores within variable expenses
 * categoryAutoCompleteItemArray: unique categories within variable expenses
 * indulgencesAutoCompleteItemArray: unique indulgences within variable expenses
 */
function getStoreDataStructuresForAutocomplete(allStores, allCategories, allSensitivities) {
  const storeArray = new Array();
  allStores.forEach((e,i) => {
    storeArray[i] = `${e.description}`
  })
  const categoryArray = new Array();
  allCategories.forEach((e,i) => {
    categoryArray[i] = `${e.description}`
  })
  const indulgenceArray = new Array();
  allSensitivities.forEach((e,i) => {
    indulgenceArray[i] = `${e.description}`
  })
  const storeAutoCompleteItemArray = Array.from(new Set(storeArray)).sort()
  const categoryAutoCompleteItemArray = Array.from(new Set(categoryArray)).sort()
  const indulgencesAutoCompleteItemArray = Array.from(new Set(indulgenceArray)).sort()
  return { storeAutoCompleteItemArray, categoryAutoCompleteItemArray, indulgencesAutoCompleteItemArray }
}

export default function VariableExpenses_Overview( props ) {
  const { palette } = useTheme();
  const [allVariableExpenses, setAllVariableExpenses] = useState(null)
  // to refresh table based on added food item after DB insertion
  const [addedItemId, setAddedItemId] = useState('')
  const [storeAutoCompleteItemArray, setStoreAutoCompleteItemArray] = useState(null)
  const [categoryAutoCompleteItemArray, setCategoryAutoCompleteItemArray] = useState(null)
  const [indulgencesAutoCompleteItemArray, setIndulgencesAutoCompleteItemArray] = useState(null)

  const tableHeadStyling = {
    backgroundColor: palette.primary.dark,
    '> th' : {color: palette.common.white,
              letterSpacing: 1,
              fontWeight:500}
  }
  const tableRowStyling = {
    '&:nth-of-type(odd)': {backgroundColor: 'rgba(128,128,128,0.7)'},
    '&:nth-of-type(even)': {backgroundColor: 'rgba(184,184,184,0.8)'},
    '&:last-child td, &:last-child th': { border: 0 },
  }
  useEffect(() => {
    const getAllPricesAndDiscounts = async() => {
      let allVariableExpenses = await getAllVariableExpenses();
      let allStores = await getAllVariableExpenseStores();
      let allCategories = await getAllVariableExpenseCategories();
      let allSensitivities = await getAllVariableExpenseSensitivities();
      setAllVariableExpenses(allVariableExpenses.results)
      const autoCompleteItemArrays = getStoreDataStructuresForAutocomplete(allStores.results, allCategories.results, allSensitivities.results)
      setStoreAutoCompleteItemArray(autoCompleteItemArrays.storeAutoCompleteItemArray)
      setCategoryAutoCompleteItemArray(autoCompleteItemArrays.categoryAutoCompleteItemArray)
      setIndulgencesAutoCompleteItemArray(autoCompleteItemArrays.indulgencesAutoCompleteItemArray)
    }
    getAllPricesAndDiscounts();
  }, [addedItemId]
  )

  return (
    <>
      <InputVariableExpenseModal setAddedItemId={setAddedItemId} storeAutoCompleteItemArray={storeAutoCompleteItemArray} categoryAutoCompleteItemArray={categoryAutoCompleteItemArray} indulgencesAutoCompleteItemArray={indulgencesAutoCompleteItemArray}/>
      <TableContainer component={Paper} sx={{borderRadius:0}}>
        <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table" >
          <TableHead>
            <TableRow sx={tableHeadStyling}>
              <TableCell>{res.DEALS_OVERVIEW_THEADER_FOODITEM}</TableCell>
              <TableCell>{res.DEALS_OVERVIEW_THEADER_BRAND}</TableCell>
              <TableCell>{res.DEALS_OVERVIEW_THEADER_STORE}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{res.DEALS_OVERVIEW_THEADER_MAIN_MACRO}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">{res.DEALS_OVERVIEW_THEADER_KCAL_AMT_TOP}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">{res.DEALS_OVERVIEW_THEADER_WEIGHT_TOP}</TableCell>
              <TableCell align="right">{res.DEALS_OVERVIEW_THEADER_PRICE_TOP}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{res.DEALS_OVERVIEW_THEADER_LAST_UPDATE_TOP}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">{res.DEALS_OVERVIEW_THEADER_NORMALIZED_PRICE_TOP}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {allVariableExpenses ? allVariableExpenses.map((row) => (
              <TableRow
                key={row.id}
                sx={tableRowStyling}
              >
                <TableCell>{row.food_item}</TableCell>
                <TableCell>{row.brand}</TableCell>
                <TableCell>{row.store}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} >{row.main_macro}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">{row.kcal_amount}{res.KCAL}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">{row.weight}{res.GRAMS}</TableCell>
                <TableCell align="right">{row.price}{res.CURRENCY_EURO}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} >{row.last_update}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">{row.normalized_price}€</TableCell>
              </TableRow>
            )) : null} */}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
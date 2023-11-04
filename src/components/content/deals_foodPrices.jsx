import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { resourceProperties as res, fixedCostCategories as categories } from '../../resources/resource_properties';
import { getAllFoodPricesAndDiscounts } from '../../services/pgConnections';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}
const tableHeadStyling = {
  backgroundColor: '#081627',
  '> th' : {color: '#ffffff',
            letterSpacing: 1,
            fontWeight:500}
}
const tableRowStyling = {
  '&:nth-of-type(odd)': {backgroundColor: 'rgba(128,128,128,0.7)'},
  '&:nth-of-type(even)': {backgroundColor: 'rgba(184,184,184,0.8)'},
  '&:last-child td, &:last-child th': { border: 0 },
}

export default function Deals_FoodPrices( props ) {
  const [foodPricesAndDiscounts, setFoodPricesAndDiscounts] = useState(null)

  useEffect(() => {
    const getAllPricesAndDiscounts = async() => {
      let allFoodPricesAndDiscounts = await getAllFoodPricesAndDiscounts();
      allFoodPricesAndDiscounts.results.forEach(element => {
        console.log(element)
      });
      setFoodPricesAndDiscounts(allFoodPricesAndDiscounts.results)
    }
    getAllPricesAndDiscounts();
  }, []
  )

  return (
    <TableContainer component={Paper} sx={{borderRadius:0}}>
      <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table" >
        <TableHead>
          <TableRow sx={tableHeadStyling}>
            <TableCell>{res.DEALS_OVERVIEW_THEADER_FOODITEM}</TableCell>
            <TableCell>{res.DEALS_OVERVIEW_THEADER_BRAND}</TableCell>
            <TableCell>{res.DEALS_OVERVIEW_THEADER_STORE}</TableCell>
            <TableCell>{res.DEALS_OVERVIEW_THEADER_MAIN_MACRO}</TableCell>
            <TableCell align="right">{res.DEALS_OVERVIEW_THEADER_KCAL_AMT_TOP}</TableCell>
            <TableCell align="right">{res.DEALS_OVERVIEW_THEADER_WEIGHT_TOP}</TableCell>
            <TableCell align="right">{res.DEALS_OVERVIEW_THEADER_PRICE_TOP}</TableCell>
            <TableCell>{res.DEALS_OVERVIEW_THEADER_LAST_UPDATE_TOP}</TableCell>
            <TableCell align="right">{res.DEALS_OVERVIEW_THEADER_NORMALIZED_PRICE_TOP}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {foodPricesAndDiscounts ? foodPricesAndDiscounts.map((row) => (
            <TableRow
              key={row.id}
              sx={tableRowStyling}
            >
              <TableCell>{row.food_item}</TableCell>
              <TableCell>{row.brand}</TableCell>
              <TableCell>{row.store}</TableCell>
              <TableCell>{row.main_macro}</TableCell>
              <TableCell align="right">{row.kcal_amount}{res.KCAL}</TableCell>
              <TableCell align="right">{row.weight}{res.GRAMS}</TableCell>
              <TableCell align="right">{row.price}{res.CURRENCY_EURO}</TableCell>
              <TableCell>{row.last_update}</TableCell>
              <TableCell align="right">{row.weight_per_100_kcal}€</TableCell>
            </TableRow>
          )) : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
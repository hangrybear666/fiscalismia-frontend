import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { resourceProperties as res, fixedCostCategories as categories } from '../../resources/resource_properties';
import { getCurrentFoodDiscounts } from '../../services/pgConnections';

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

export default function Deals_GroceryDeals( props ) {
  const [foodPricesAndDiscounts, setFoodPricesAndDiscounts] = useState(null)

  useEffect(() => {
    const getAllPricesAndDiscounts = async() => {
      let allFoodDiscounts = await getCurrentFoodDiscounts();
      allFoodDiscounts.results.forEach(element => {
        console.log(element)
      });
      setFoodPricesAndDiscounts(allFoodDiscounts.results)
    }
    getAllPricesAndDiscounts();
  }, []
  )

  return (
    <TableContainer component={Paper} sx={{borderRadius:0}}>
      {/* <form action="http://localhost:3002/api/fiscalismia/upload/food_item_img" method="post" enctype="multipart/form-data">
        <input type="file" name="avatar" />
        <input type="submit" value="Get me the stats!" class="btn btn-default"/> 
      </form> */}
      <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table" >
        <TableHead>
          <TableRow sx={tableHeadStyling}>
            <TableCell>{res.DEALS_GROCERY_DEALS_THEADER_FOODITEM}</TableCell>
            <TableCell>{res.DEALS_GROCERY_DEALS_THEADER_BRAND}</TableCell>
            <TableCell>{res.DEALS_GROCERY_DEALS_THEADER_STORE}</TableCell>
            <TableCell align="right">{res.DEALS_GROCERY_DEALS_THEADER_ORIGINAL_PRICE}</TableCell>
            <TableCell align="right">{res.DEALS_GROCERY_DEALS_THEADER_DISCOUNT_AMOUNT}</TableCell>
            <TableCell align="right">{res.DEALS_GROCERY_DEALS_THEADER_DISCOUNT_PCT}</TableCell>
            <TableCell>{res.DEALS_GROCERY_DEALS_THEADER_DISCOUNT_START_DATE}</TableCell>
            <TableCell>{res.DEALS_GROCERY_DEALS_THEADER_DISCOUNT_END_DATE}</TableCell>
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
              <TableCell align="right">{row.price}{res.CURRENCY_EURO}</TableCell>
              <TableCell align="right">{row.reduced_by_amount}{res.CURRENCY_EURO}</TableCell>
              <TableCell align="right">{row.reduced_by_pct}{res.SYMBOL_PERCENT}</TableCell>
              <TableCell>{row.discount_start_date}</TableCell>
              <TableCell>{row.discount_end_date}</TableCell>
            </TableRow>
          )) : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
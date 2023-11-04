import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import ContentCardDiscounts from '../minor/ContentCardDiscounts';
import { resourceProperties as res, fixedCostCategories as categories, serverConfig } from '../../resources/resource_properties';
import { getCurrentFoodDiscounts } from '../../services/pgConnections';

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

function constructContentCardObject(foodItemId, header, originalPrice, discountPrice, discountPercentage, subtitle, startDate, endDate, daysLeft, details, store, img) { // TODO img
  const contentCardObj =
   {
    foodItemId: foodItemId,
    header: header ? header.trim() : null,
    originalPrice: originalPrice,
    discountPrice: discountPrice,
    discountPercentage: discountPercentage,
    subtitle: subtitle ? subtitle.trim() : null,
    startDate: startDate,
    endDate: endDate,
    daysLeft: daysLeft,
    details: details,
    img: img ? img : `https://source.unsplash.com/random/?groceries&${Math.floor(Math.random() * 100)}`,
    store: store
  }
  if (img === 'no-img') {
    contentCardObj.img = null
  }
  return contentCardObj
}

/**
 * extracts relevant fields from the db query result
 * in order to populate one card for each discounted item.
 * @param {*} allFoodDiscounts db query result
 */
function extractCardData(allFoodDiscounts) {
  let discountedFoodItemCards = new Array();
  allFoodDiscounts.forEach( e => {
    let card = constructContentCardObject(
      e.id,
      `${e.food_item} - ${e.brand}`,
      `${e.price}${res.CURRENCY_EURO}`,
      `${e.discount_price}${res.CURRENCY_EURO}`,
      `${Math.round(e.reduced_by_pct)}${res.SYMBOL_PERCENT}`,
      `Gewicht ${e.weight}g`,
      `gültig von ${e.discount_start_date}`,
      `gültig bis ${e.discount_end_date}`,
      `noch ${e.discount_days_left} Tage`,
      null, // details
      e.store,
      e.filepath ? serverConfig.API_BASE_URL.concat('/').concat(e.filepath) : 'no-img'
    );
      discountedFoodItemCards.push(card);
  })
  return discountedFoodItemCards

}

export default function Deals_GroceryDeals( props ) {
  const [foodPricesAndDiscounts, setFoodPricesAndDiscounts] = useState(null)
  const [discountedItemCards, setDiscountedItemCards] = useState(null)

  useEffect(() => {
    const getAllPricesAndDiscounts = async() => {
      let allFoodDiscounts = await getCurrentFoodDiscounts();
      setFoodPricesAndDiscounts(allFoodDiscounts.results)
      setDiscountedItemCards(extractCardData(allFoodDiscounts.results))
    }
    getAllPricesAndDiscounts();
  }, []
  )

  return (
    <React.Fragment>
      <TableContainer component={Paper} sx={{borderRadius:0}}>
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
      <Grid container spacing={3} sx={{marginTop:2}}>
        {discountedItemCards ?
        discountedItemCards.map((foodItem) => (
          <Grid key={foodItem.header} xs={4}>
            <ContentCardDiscounts elevation={3} {...foodItem} imgHeight={150} />
          </Grid>
        ))
        : null
        }
      </Grid>
    </React.Fragment>
  );
}
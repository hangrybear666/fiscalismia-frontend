import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ContentCard from '../minor/ContentCardCosts';
import { resourceProperties as res } from '../../resources/resource_properties';
import { getVariableExpenseByCategory } from '../../services/pgConnections';
import { Box, Stack } from '@mui/material';


function constructContentCardObject(header, amount, subtitle, detailHeader, details, icon, img) { // TODO img
  const contentCardObj =
   {
    header: header.trim(),
    amount: `${Math.round(amount)}${res.CURRENCY_EURO}`,
    subtitle: subtitle,
    detailHeader: detailHeader, // logic unique to this function
    details: details,
    img: img ? img : `https://source.unsplash.com/random/?money&${Math.floor(Math.random() * 100)}`,
    icon: icon
  }
  if (img === res.NO_IMG) {
    contentCardObj.img = null
  }
  return contentCardObj
}

/**
 *  Extracts information of sales (variable expenses with category ='Sale')
 *  to display in cards dependent on the selected year
 * @param {*} sales
 * @returns
 */
function extractCardData(sales, selectedYear = 2023) {
  // ensure that sales have positive cost value
  let salesTransformed = sales.results
    .map(e => {
      if (e.cost < 0) {
        e.cost = e.cost * -1
      }
      return e
    })
  // DISTINCT STORE SALE CARDS
  let storeBasedCards = [];
  const distinctSaleStores = Array.from(new Set(
    salesTransformed.map(e => e.store))
  );
  // loop through all stores of sale and construct summed cost cards for each
  distinctSaleStores.forEach( store => {
    const storeFilteredSales = salesTransformed
      .filter(e=> e.store === store)
    let distinctStoreCard = constructContentCardObject(store, null, `${res.INCOME_SALES_CARD_TOTAL_SALES_SUBTITLE} ${selectedYear}` ,res.INCOME_SALES_CARD_DISTINCT_STORE_SALES_DETAILS_HEADER , null, null, res.NO_IMG)
    distinctStoreCard.amount = Math.round(storeFilteredSales
      .map((row) => row.cost)
      .reduce((partialSum, add) => partialSum + parseFloat(add), 0))
    distinctStoreCard.details = storeFilteredSales
      .filter(row => row.cost > 100)
      .map((row) => row.description.trim())
    storeBasedCards.push(distinctStoreCard)
  })
  // TOTAL SALES
  let totalSales = constructContentCardObject(res.INCOME_SALES_CARD_TOTAL_SALES_HEADER, null, `${res.INCOME_SALES_CARD_TOTAL_SALES_SUBTITLE} ${selectedYear}` ,null, null, null, res.NO_IMG)
  totalSales.amount = Math.round(salesTransformed
    .map((row) => row.cost)
    .reduce((partialSum, add) => partialSum + parseFloat(add), 0));
  console.log(storeBasedCards)
  return { totalSales, storeBasedCards }
}

export default function Income_Sales( props ) {
  const { palette, breakpoints } = useTheme();
  const [allSales, setAllSales] = useState(null)
  const [salesCard, setSalesCard] = useState(null)
  const [distinctStoreSalesCard, setDistinctStoreSalesCard] = useState(null)

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
    const getAllSales = async() => {
      let allSales = await getVariableExpenseByCategory('Sale');
      setAllSales(allSales.results)
      let extractedSales = extractCardData(allSales)
      setSalesCard(extractedSales.totalSales)
      setDistinctStoreSalesCard(extractedSales.storeBasedCards)
    }
    getAllSales();
  }, []
  )

  return (
    <React.Fragment>
      <Grid container spacing={2} sx={{marginTop:2}} justifyContent="center">
        <Grid xs={12} lg={4} xl={3}>
          <Stack spacing={2} sx={{width:'100%'}}>
            <ContentCard {...salesCard}  />
            {distinctStoreSalesCard
            ? distinctStoreSalesCard.map(card=> (
              <ContentCard {...card}  />
            ))
            : null}
          </Stack>
        </Grid>
        <Grid xs={12} lg={7} xl={6}>
          <TableContainer component={Paper} sx={{
              borderRadius:0,
              minWidth: breakpoints.values.sm - 256,
            }} >
            <Table sx={{ minWidth: 500 }} size="small" >
              <TableHead>
                <TableRow sx={tableHeadStyling}>
                  <TableCell>{res.INCOME_SALES_THEADER_DESCRIPTION}</TableCell>
                  <TableCell align="right">{res.INCOME_SALES_THEADER_COST}</TableCell>
                  <TableCell>{res.INCOME_SALES_THEADER_STORE}</TableCell>
                  <TableCell>{res.INCOME_SALES_THEADER_DATE}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allSales ? allSales.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={tableRowStyling}
                  >
                    <TableCell>{row.description}</TableCell>
                    <TableCell align="right">{`${row.cost}${res.CURRENCY_EURO}`}</TableCell>
                    <TableCell>{row.store}</TableCell>
                    <TableCell>{row.purchasing_date}</TableCell>
                  </TableRow>
                )) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
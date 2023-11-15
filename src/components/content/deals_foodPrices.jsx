import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import ContentCardFoodPrices from '../minor/ContentCardFoodPrices';
import { resourceProperties as res, fixedCostCategories as categories, serverConfig } from '../../resources/resource_properties';
import { getAllFoodPricesAndDiscounts } from '../../services/pgConnections';
import FilterFoodPriceData from '../minor/FilterFoodPriceData';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Typography } from '@mui/material';

function constructContentCardObject(foodItemId, header, originalPrice, pricePerKg, kcalAmount, subtitle, lastUpdated, details, store, img) { // TODO img
  const contentCardObj =
   {
    foodItemId: foodItemId,
    header: header ? header.trim() : null,
    originalPrice: originalPrice,
    pricePerKg: pricePerKg,
    kcalAmount: kcalAmount,
    subtitle: subtitle ? subtitle.trim() : null,
    lastUpdated: lastUpdated,
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
      `${e.price_per_kg}${res.CURRENCY_EURO}/kg`,
      `${e.kcal_amount}kcal/100g`,
      `Gewicht ${e.weight}g`,
      `zuletzt geprüft ${e.last_update}`,
      null, // details
      e.store,
      e.filepath ? serverConfig.API_BASE_URL.concat('/').concat(e.filepath) : 'no-img'
    );
      discountedFoodItemCards.push(card);
  })
  return discountedFoodItemCards

}

export default function Deals_FoodPrices( props ) {
  // breakpoint
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("lg"));

  const [foodPrices, setFoodPrices] = useState(null)
  // id, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date, weight_per_100_kcal, price_per_kg, normalized_price, filepath
  const [filteredFoodPrices, setFilteredFoodPrices] = useState(null)
  const [foodItemCards, setFoodItemCards] = useState(null)
  const [hasBeenSortedBy, setHasBeenSortedBy] = useState(null)

  useEffect(() => {
    const getAllPricesAndDiscounts = async() => {
      let allFoodPrices = await getAllFoodPricesAndDiscounts();
      setFoodPrices(allFoodPrices.results)
      setFoodItemCards(extractCardData(allFoodPrices.results))
    }
    if (filteredFoodPrices) {
      setFoodItemCards(extractCardData(filteredFoodPrices))
      return;
    }
    getAllPricesAndDiscounts();
  }, [filteredFoodPrices, hasBeenSortedBy]
  )

  return (
    <React.Fragment>
      <Grid container spacing={1} sx={{marginTop:2}}>
        {/* Horizontal Data Filtering on top on small screens */}
        <Grid xs={12} >
          {foodPrices && isSmallScreen
          ? <FilterFoodPriceData
              displayHorizontally={true}
              foodPrices={foodPrices}
              filteredFoodPrices={filteredFoodPrices}
              setFilteredFoodPrices={setFilteredFoodPrices}
              hasBeenSortedBy={hasBeenSortedBy}
              setHasBeenSortedBy={setHasBeenSortedBy}/>
          : null }
        </Grid>
        {/* FOOD ITEM CARDS */}
        <Grid container xs={12} lg={8} xl={9} >
          {foodItemCards
            ? foodItemCards.map((foodItem) => (
              <Grid key={foodItem.foodItemId} xs={12} md={6} lg={4} xl={3} >
                <ContentCardFoodPrices elevation={6} {...foodItem} imgHeight={150} />
              </Grid>
          ))
            : null
          }
        </Grid>
        {/* Vertical Data Filtering on right side on large screens */}
        <Grid lg={4} xl={3}>
          <Box sx={{ marginLeft: { lg:2} }}>
            {foodPrices && !isSmallScreen
            ? <FilterFoodPriceData
                displayHorizontally={false}
                foodPrices={foodPrices}
                filteredFoodPrices={filteredFoodPrices}
                setFilteredFoodPrices={setFilteredFoodPrices}
                hasBeenSortedBy={hasBeenSortedBy}
                setHasBeenSortedBy={setHasBeenSortedBy}/>
            : null }
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
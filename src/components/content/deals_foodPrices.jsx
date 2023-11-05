import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import ContentCardFoodPrices from '../minor/ContentCardFoodPrices';
import { resourceProperties as res, fixedCostCategories as categories, serverConfig } from '../../resources/resource_properties';
import { getAllFoodPricesAndDiscounts } from '../../services/pgConnections';
import SelectDropdown from '../minor/SelectDropdown';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/CancelSharp';
import Chip from '@mui/material/Chip';

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

function macroNutrientFilter(foodPrices, selection) {
  return foodPrices.filter(e => e.main_macro == selection)
}

function getMacroNutrientCategories(allFoodPrices) {
  return Array.from(new Set(allFoodPrices.map(e => e.main_macro)))
}

export default function Deals_FoodPrices( props ) {
  const [foodPrices, setFoodPrices] = useState(null)
  const [foodItemCards, setFoodItemCards] = useState(null)

  const [macroNutrientSelectItems, setMacroNutrientSelectItems] = useState(null)
  const [selectedMacroNutrient, setSelectedMacroNutrient] = useState('')

  useEffect(() => {
    const getAllPricesAndDiscounts = async() => {
      let allFoodPrices = await getAllFoodPricesAndDiscounts();
      setFoodPrices(allFoodPrices.results)
      setMacroNutrientSelectItems(getMacroNutrientCategories(allFoodPrices.results))
      setFoodItemCards(extractCardData(allFoodPrices.results))
    }
    getAllPricesAndDiscounts();
  }, []
  )
  const handleSelect = (selection) => {
    setSelectedMacroNutrient(selection)
    const filteredFoodPrices = macroNutrientFilter(foodPrices, selection)
    setFoodItemCards(extractCardData(filteredFoodPrices))
  }
  const handleClearSelection = () => {
    setSelectedMacroNutrient(null)
    setFoodItemCards(extractCardData(foodPrices))
  }

  return (
    <React.Fragment>
      <Grid container spacing={2} sx={{marginTop:2}}>
        <Grid  sm={8} xl={10} >
          <SelectDropdown
            defaultValue={res.ALL}
            selectLabel={res.DEALS_FOOD_PRICES_SELECTITEMS_MACRO_LABEL}
            selectItems={macroNutrientSelectItems}
            selectedValue={selectedMacroNutrient}
            handleSelect={handleSelect}
          />
        </Grid>
        <Grid  sm={4} xl={2}>
          <IconButton
            onClick={handleClearSelection}
            variant="outlined"
            color="primary"
            sx={{
              borderRadius:0,
              paddingX: 1,
              width:'100%',
              paddingY: 2,
              border: '1px solid rgba(64,64,64,0.4)',
              fontSize:15,
              fontWeight:400,}}
          >
            <CancelIcon sx={{mr:1.5}}/>
              {res.DEALS_FOOD_PRICES_SELECTITEMS_DELETE_SELECTION}
          </IconButton>
          </Grid>
        {foodItemCards ?
        foodItemCards.map((foodItem) => (
          <Grid key={foodItem.header} xs={12} lg={6} xl={3}>
            <ContentCardFoodPrices elevation={6} {...foodItem} imgHeight={150} />
          </Grid>
        ))
        : null
      }
      </Grid>
    </React.Fragment>
  );
}
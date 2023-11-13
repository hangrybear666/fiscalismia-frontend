import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import CancelIcon from '@mui/icons-material/CancelSharp';
import aldi from '../../public/imgs/supermarkets/aldi1.png'
import metro from '../../public/imgs/supermarkets/metro1.png'
import kaufland from '../../public/imgs/supermarkets/kaufland1.png'
import lidl from '../../public/imgs/supermarkets/lidl1.png'
import netto from '../../public/imgs/supermarkets/netto1.png'
import rewe from '../../public/imgs/supermarkets/rewe1.png'
import amazon from '../../public/imgs/supermarkets/amazon1.png'
import edeka from '../../public/imgs/supermarkets/edeka1.png'
import butcher from '../../public/imgs/supermarkets/butcher1.png'
import online from '../../public/imgs/supermarkets/online1.png'
import online2 from '../../public/imgs/supermarkets/online2.png'
import all from '../../public/imgs/supermarkets/alle1.png'
import { resourceProperties as res, foodItemInputCategories as foodCategories } from '../../resources/resource_properties';
import { Paper, Box, Divider, Stack, IconButton, Typography, Button, ButtonGroup, FormControl, InputLabel, Input, Autocomplete, TextField, ToggleButtonGroup, ToggleButton } from '@mui/material';

const headerStyle = {
  letterSpacing:2,
  fontWeight:300,
  fontSize:13
}

function getMacroNutrientCategories(allFoodPrices) {
  return Array.from(new Set(allFoodPrices.map(e => e.main_macro)))
}

function getStoreItems(allFoodPrices) {
  return Array.from(new Set(allFoodPrices.map(e => e.store)))
}

/**
 * Transforms a list of Objects from the db into an array of autocomplete labels and additional information
 * @param {*} allFoodPrices autoCompleteItemArray: Array with label for input completion and any other desired information
 * @returns
 */
function getFoodItemSelectionDataStructures(allFoodPrices) {
  const autoCompleteItemArray = new Array();
  allFoodPrices.forEach((e,i) => {
    autoCompleteItemArray[i] = {
      label: `${e.food_item} - ${e.brand} | ${e.store}`,
      id: e.id}
  })
  return autoCompleteItemArray
}

export default function FilterFoodPriceData( props ) {
  if (props.doNotRender) {
    return (<></>)
  }
  const { displayVertically } = props
  // id, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date, weight_per_100_kcal, price_per_kg, normalized_price, filepath
  const { foodPrices, setFilteredFoodPrices } = props

  // FILTERING
  const [autoCompleteItemArray, setAutoCompleteItemArray] = useState([])
  const [macroNutrientItems, setMacroNutrientItems] = useState([])
  const [storeItems, setStoreItems] = useState([])
  const [selectedMacroNutrient, setSelectedMacroNutrient] = useState('')
  const [selectedStore, setSelectedStore] = useState('')
  const [selectedFoodItemIds, setSelectedFoodItemIds] = useState([])

  useEffect(() => {
    if (foodPrices) {
      setAutoCompleteItemArray(getFoodItemSelectionDataStructures(foodPrices))
      setMacroNutrientItems(getMacroNutrientCategories(foodPrices))
      setStoreItems(getStoreItems(foodPrices))
    }
  }, []
  )

  const handleClearSelection = () => {
    setSelectedMacroNutrient('')
    setSelectedStore('')
    setSelectedFoodItemIds([])
    setFilteredFoodPrices(null)
  }

  const getSupermarketLogo = (store) => {
    switch (store) {
      case foodCategories.JSON_STORES.aldi:
        return aldi;
      case foodCategories.JSON_STORES.lidl:
        return lidl;
      case foodCategories.JSON_STORES.kaufland:
        return kaufland;
      case foodCategories.JSON_STORES.rewe:
        return rewe;
      case foodCategories.JSON_STORES.metro:
        return metro;
      case foodCategories.JSON_STORES.amazon:
        return amazon;
      case foodCategories.JSON_STORES.netto:
        return netto;
      case foodCategories.JSON_STORES.edeka:
        return edeka;
      case foodCategories.JSON_STORES.butcher:
        return butcher;
      case foodCategories.JSON_STORES.online:
        return online;
      case foodCategories.JSON_STORES.all:
        return all;
      default:
        break;
    }
  }

  const handleAutoCompleteSelection = (event, newValue) => {
      if (newValue?.length == 1) {
        const foodItemArr = [newValue[0].id]
        setSelectedFoodItemIds(foodItemArr)
      } else if (newValue?.length > 1) {
        const foodItemArr = newValue.map(e=> e.id)
        console.log(foodItemArr)
        setSelectedFoodItemIds(foodItemArr)
      }
    // setSelectedFoodItemId(newValue?.id ? newValue.id : null)
  }

  const handleMacroSelect = (event, newValue) => {
    setSelectedMacroNutrient(newValue)
    // set parent's filtered food item list based on selection
    if (newValue) {
      setFilteredFoodPrices(foodPrices.filter(e => e.main_macro == newValue))
    } else {
      setFilteredFoodPrices(foodPrices)
    }
  }

  const handleStoreSelect = (event, newValue) => {
    console.log(newValue)
    setSelectedStore(newValue)
    // set parent's filtered food item list based on selection
    if (newValue) {
      setFilteredFoodPrices(foodPrices.filter(e => e.store == newValue))
    } else {
      setFilteredFoodPrices(foodPrices)
    }
  }

  return (
    <Paper elevation={6} sx={{ borderRadius:0,border: '1px solid rgba(64,64,64,0.5)' }}>
      <Box
        sx={{padding:1,   }}>
        <Grid
          container
          spacing={1}
          sx={{}}>
          {/* FILTER FOOD NAME */}
          <Grid  xs={12} >
            {autoCompleteItemArray ?
              <Autocomplete
                multiple
                filterSelectedOptions
                onChange={handleAutoCompleteSelection}
                options={autoCompleteItemArray}
                renderInput={(params) => <TextField {...params} label={res.MINOR_INPUT_FOOD_DISCOUNT_MODAL_SELECTDROPDOWN_LABEL} sx={{ borderRadius:0 }}/>}
                sx={{ width:'100%' }}
              />
            : null}
            <Divider/>
          </Grid>
          {/* SELECT MACRO */}
          <Grid  xs={12} >
            <Stack>
              <Typography sx={headerStyle}>
                {res.MINOR_FILTER_FOOD_PRICES_MACRO_HEADER}
              </Typography>
              <ToggleButtonGroup
                fullWidth
                color="primary"
                value={selectedMacroNutrient}
                exclusive
                onChange={handleMacroSelect}
              >
                {macroNutrientItems
                ? macroNutrientItems.map(e => (
                  <ToggleButton
                    key={e}
                    value={e}
                    size="medium"
                    sx={{
                      borderRadius:0,
                      '&:hover': {
                        bgcolor: 'rgba(128,128,128,0.4)',
                      },
                      '&.Mui-selected:hover': {
                        bgcolor: 'rgba(128,128,128,0.9)',},
                      '&.Mui-selected': {
                        bgcolor: "rgba(64,64,64, 0.8)",
                        color:'#ffffff',
                        boxShadow: '0px 0px 4px 2px rgba(64,64,64, 0.6)',
                        transition: 'transform 0.5s ease 0s, box-shadow 0.2s linear 0s'},
                    }}
                  >
                    {e}
                  </ToggleButton>))
                : null}
              </ToggleButtonGroup>
            </Stack>
            <Divider/>
          </Grid>
          {/* SELECT SUPERMARKET */}
          <Grid  xs={12} >
            <Stack>
              <Typography sx={headerStyle}>
                  {res.MINOR_FILTER_FOOD_PRICES_STORE_HEADER}
              </Typography>
              <Stack direction="row" spacing={1}  useFlexGap flexWrap="wrap">
              <ToggleButtonGroup
                value={selectedStore}
                color="primary"
                exclusive
                onChange={handleStoreSelect}
                sx={{flexWrap: "wrap"}}
              >
                {storeItems
                ? storeItems.map(e=> (
                  <ToggleButton
                    key={e}
                    value={e}
                    size="medium"
                    sx={{
                      borderRadius:0,
                      margin:0,
                      padding:'6px',
                      border:0,
                      '&:hover': {
                        bgcolor: 'rgba(128,128,128,0.3)',
                      },
                      '&.Mui-selected:hover': {
                        bgcolor: 'rgba(128,128,128,0.7)',},
                      '&.Mui-selected': {
                        bgcolor: "rgba(64,64,64, 0.8)",
                        transform: 'translate3d(0px, 5px, 0px)',
                        boxShadow: '0px 0px 6px 2px rgba(64,64,64, 0.4)',
                        transition: 'transform 0.5s ease 0s, box-shadow 0.5s linear 0s'},
                      }}
                  >
                  <Box
                    key={e}
                    component="img"
                    sx={{
                      height: 64,
                      width: 64,
                    }}
                    alt={e}
                    src={getSupermarketLogo(e)}
                  />
                  </ToggleButton>
                  ))
                : null}
              </ToggleButtonGroup>
              </Stack>
            </Stack>
          </Grid>
          <Grid xs={12}>
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
              {res.MINOR_FILTER_FOOD_PRICES_CLEAR_FILTER}
          </IconButton>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
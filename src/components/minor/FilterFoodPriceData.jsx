import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
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
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { resourceProperties as res, foodItemInputCategories as foodCategories } from '../../resources/resource_properties';
import { Paper, Box, Divider, Stack, IconButton, Typography, Autocomplete, TextField, ToggleButtonGroup, ToggleButton, Switch, Tooltip } from '@mui/material';

const SORT_BY_IDS = {
  pricePerKgDesc: 1,
  pricePerKgAsc: 2,
  kcalAmountDesc: 3,
  kcalAmountAsc: 4,
  priceDesc: 5,
  priceAsc: 6,
  normalizedPriceDesc: 7,
  normalizedPriceAsc: 8,
}
// HINWEIS: Tooltips aktuell nicht eingebaut weil selected styling der Buttons dann nicht funktioniert hat
let sortCriteria = new Array();
sortCriteria.push(
  [
    {
      id: SORT_BY_IDS.pricePerKgDesc,
      tooltip: res.MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_PRICE_PER_KG_DESC,
      icon: <KeyboardDoubleArrowDownIcon/>
    }
  ,
    {
      id: res.MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_BTN_VALUE_PRICE_PER_KG,
      tooltip: null,
      icon: null
    }
  ,
    {
      id: SORT_BY_IDS.pricePerKgAsc,
      tooltip: res.MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_PRICE_PER_KG_ASC,
      icon: <KeyboardDoubleArrowUpIcon/>
    }
  ]
);
sortCriteria.push(
  [
    {
      id: SORT_BY_IDS.kcalAmountDesc,
      tooltip: res.MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_KCAL_AMOUNT_DESC,
      icon: <KeyboardDoubleArrowDownIcon/>
    }
  ,
    {
      id: res.MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_BTN_VALUE_KCAL_AMOUNT,
      tooltip: null,
      icon: null
    }
  ,
    {
      id: SORT_BY_IDS.kcalAmountAsc,
      tooltip: res.MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_KCAL_AMOUNT_KG_ASC,
      icon: <KeyboardDoubleArrowUpIcon/>
    }
  ]
);
sortCriteria.push(
  [
    {
      id: SORT_BY_IDS.priceDesc,
      tooltip: res.MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_PRICE_DESC,
      icon: <KeyboardDoubleArrowDownIcon/>
    }
  ,
    {
      id: res.MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_BTN_VALUE_PRICE,
      tooltip: null,
      icon: null
    }
  ,
    {
      id: SORT_BY_IDS.priceAsc,
      tooltip: res.MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_PRICE_ASC,
      icon: <KeyboardDoubleArrowUpIcon/>
    }
  ]
);
sortCriteria.push(
  [
    {
      id: SORT_BY_IDS.normalizedPriceDesc,
      tooltip: res.MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_NORMALIZED_PRICE_DESC,
      icon: <KeyboardDoubleArrowDownIcon/>
    }
  ,
    {
      id: res.MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_BTN_VALUE_NORMALIZED_PRICE,
      tooltip: res.MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_BTN_VALUE_TOOLTIP_NORMALIZED_PRICE,
      icon: null
    }
  ,
    {
      id: SORT_BY_IDS.normalizedPriceAsc,
      tooltip: res.MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_NORMALIZED_PRICE_ASC,
      icon: <KeyboardDoubleArrowUpIcon/>
    }
  ]
);


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
  const { palette } = useTheme();
  const { displayHorizontally } = props
  // id, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date, weight_per_100_kcal, price_per_kg, normalized_price, filepath
  const { foodPrices, filteredFoodPrices, setFilteredFoodPrices, setHasBeenSortedBy, hasBeenSortedBy } = props

  // React re-renders components with their default value when their key changes
  const [resetAutocompleteHelper, setResetAutocompleteHelper] = useState(0)
  // FILTERING
  const [autoCompleteItemArray, setAutoCompleteItemArray] = useState([])
  const [macroNutrientItems, setMacroNutrientItems] = useState([])
  const [storeItems, setStoreItems] = useState([])
  const [selectedMacroNutrient, setSelectedMacroNutrient] = useState('')
  const [selectedStore, setSelectedStore] = useState('')
  // Render Images yes or no switch
  const [renderImages, setRenderImages] = React.useState(false);

  const headerStyle = {
    letterSpacing:2,
    fontWeight:300,
    fontSize:13,
    textDecoration: 'underline',
    mt:0.6,
    mb:0.4,
    display: displayHorizontally ? 'none' : 'block'
  }
  useEffect(() => {
    if (foodPrices) {
      setAutoCompleteItemArray(getFoodItemSelectionDataStructures(foodPrices))
      setMacroNutrientItems(getMacroNutrientCategories(foodPrices))
      setStoreItems(getStoreItems(foodPrices))
    }
  }, []
  )

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

  const handleRenderImagesSwitch = (event) => {
    setRenderImages(event.target.checked)
    if(!event.target.checked) {
      setFilteredFoodPrices(
        filteredFoodPrices
        ? filteredFoodPrices.map(e=> {
          e.img = res.NO_IMG
          return e
        })
        : foodPrices.map(e=> {
          e.img = res.NO_IMG
          return e
        })
      )
      // setHasBeenSortedBy(Math.random *10)
    } else {
      setFilteredFoodPrices(
        filteredFoodPrices
        ? filteredFoodPrices.map(e=> {
          e.img = null
          return e
        })
        : foodPrices.map(e=> {
          e.img = null
          return e
        })
      )
    }
  }

  const handleAutoCompleteSelection = (event, newValue) => {
    setHasBeenSortedBy(null)
      if (newValue?.length > 0) {
        setSelectedMacroNutrient('')
        setSelectedStore('')
        const foodItemArr = newValue.map(e=> e.id)
        setFilteredFoodPrices(foodPrices.filter(e => foodItemArr.includes(e.id)))
      } else {
        setFilteredFoodPrices(null)
      }
    // setSelectedFoodItemId(newValue?.id ? newValue.id : null)
  }

  const handleClearSelection = () => {
    setHasBeenSortedBy(null)
    setSelectedMacroNutrient('')
    setSelectedStore('')
    // React re-renders components with their default value when their key changes
    setResetAutocompleteHelper(Math.random() * 1000000)
    setFilteredFoodPrices(null)
  }

  const handleMacroSelect = (event, newValue) => {
    setHasBeenSortedBy(null)
    setSelectedMacroNutrient(newValue)
    setSelectedStore('')
    setResetAutocompleteHelper(Math.random() * 1000000)
    // set parent's filtered food item list based on selection
    if (newValue) {
      setFilteredFoodPrices(foodPrices.filter(e => e.main_macro == newValue))
    } else {
      setFilteredFoodPrices(foodPrices)
    }
  }


  const handleSortListener = (event, newValue) => {
    if (hasBeenSortedBy != newValue) {
      setHasBeenSortedBy(newValue)
      switch (newValue) {
        case SORT_BY_IDS.priceAsc:
          setFilteredFoodPrices(filteredFoodPrices
            ? filteredFoodPrices.sort((a,b) => a.price > b.price ? 1 : -1 )
            : foodPrices.sort((a,b) => a.price > b.price ? 1 : -1 ))
          break;
        case SORT_BY_IDS.priceDesc:
          setFilteredFoodPrices(filteredFoodPrices
            ? filteredFoodPrices.sort((a,b) => a.price < b.price ? 1 : -1 )
            : foodPrices.sort((a,b) => a.price < b.price ? 1 : -1 ))
          break;
        case SORT_BY_IDS.kcalAmountAsc:
          setFilteredFoodPrices(filteredFoodPrices
            ? filteredFoodPrices.sort((a,b) => a.kcal_amount > b.kcal_amount ? 1 : -1 )
            : foodPrices.sort((a,b) => a.kcal_amount > b.kcal_amount ? 1 : -1 ))
          break;
        case SORT_BY_IDS.kcalAmountDesc:
          setFilteredFoodPrices(filteredFoodPrices
            ? filteredFoodPrices.sort((a,b) => a.kcal_amount < b.kcal_amount ? 1 : -1 )
            : foodPrices.sort((a,b) => a.kcal_amount < b.kcal_amount ? 1 : -1 ))
          break;
        case SORT_BY_IDS.pricePerKgAsc:
          setFilteredFoodPrices(filteredFoodPrices
            ? filteredFoodPrices.sort((a,b) => a.price_per_kg > b.price_per_kg ? 1 : -1 )
            : foodPrices.sort((a,b) => a.price_per_kg > b.price_per_kg ? 1 : -1 ))
          break;
        case SORT_BY_IDS.pricePerKgDesc:
          setFilteredFoodPrices(filteredFoodPrices
            ? filteredFoodPrices.sort((a,b) => a.price_per_kg < b.price_per_kg ? 1 : -1 )
            : foodPrices.sort((a,b) => a.price_per_kg < b.price_per_kg ? 1 : -1 ))
          break;
        case SORT_BY_IDS.normalizedPriceAsc:
          setFilteredFoodPrices(filteredFoodPrices
            ? filteredFoodPrices.sort((a,b) => a.normalized_price > b.normalized_price ? 1 : -1 )
            : foodPrices.sort((a,b) => a.normalized_price > b.normalized_price ? 1 : -1 ))
          break;
        case SORT_BY_IDS.normalizedPriceDesc:
          setFilteredFoodPrices(filteredFoodPrices
            ? filteredFoodPrices.sort((a,b) => a.normalized_price < b.normalized_price ? 1 : -1 )
            : foodPrices.sort((a,b) => a.normalized_price < b.normalized_price ? 1 : -1 ))
          break;
        default:
          break;
        }

    } else {
      // DO NOTHING; has already been sorted by this criteria
    }
  }

  const handleStoreSelect = (event, newValue) => {
    setSelectedStore(newValue)
    setSelectedMacroNutrient('')
    setResetAutocompleteHelper(Math.random() * 1000000)
    // set parent's filtered food item list based on selection
    if (newValue) {
      setFilteredFoodPrices(foodPrices.filter(e => e.store == newValue))
    } else {
      setFilteredFoodPrices(foodPrices)
    }
  }

  return (
    <Grid container spacing={1}>
      <Grid xs={12}>
          <Paper elevation={4} sx={{ borderRadius:0,border: `1px solid ${palette.border.light}` }}>
            <Box
              sx={{padding:1.2}}>
              <Typography sx={headerStyle}>{res.MINOR_FILTER_FOOD_PRICES_RENDER_IMAGES_SWITCH_LABEL}</Typography>
              <Switch
                size="large"
                checked={renderImages}
                onChange={handleRenderImagesSwitch}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid xs={12}>
          <Paper elevation={4} sx={{ borderRadius:0,border: `1px solid ${palette.border.light}` }}>
            <Box
              sx={{padding:1.2}}>
              <Typography sx={headerStyle}>{res.SORT_BY}</Typography>
              {sortCriteria ?
              sortCriteria.map(parent=> (
                <ToggleButtonGroup
                  key={parent[1].id}
                  exclusive
                  value={hasBeenSortedBy}
                  onChange={handleSortListener}
                  sx={{m:0.5}}
                >
                  {parent.map(child => (
                    <ToggleButton
                      key={child.id}
                      value={child.id}
                      size="small"
                      disabled={child.icon ? false : true}
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
                          transition: 'box-shadow 0.2s linear 0s'},
                        '&.Mui-disabled' : {
                          color: palette.text.disabled
                        },
                      }}
                    >
                      {child.icon ? child.icon : child.id}
                    </ToggleButton>)
                  )}
                </ToggleButtonGroup>
                ))
              : null}
            </Box>
          </Paper>
        </Grid>
        <Grid xs={12}>
          <Paper elevation={4} sx={{ borderRadius:0,border: `1px solid ${palette.border.light}` }}>
            <Box
              sx={{padding:1.2}}>
              <Grid
                container
                spacing={1}
                sx={{}}>
                {/* FILTER FOOD NAME */}
                <Grid  xs={12} >
                  {autoCompleteItemArray ?
                    <Autocomplete
                      key={resetAutocompleteHelper}
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
                          size={displayHorizontally ? 'small' : 'medium'}
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
                              transition: 'box-shadow 0.2s linear 0s'},
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
                            padding: displayHorizontally ?'3px' : '6px',
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
                            height: displayHorizontally ? 48 : 64,
                            width: displayHorizontally ? 48 : 64,
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
                <Grid xs={12} sx={{display: displayHorizontally ? 'none' : 'block'}}>
                  <IconButton
                    onClick={handleClearSelection}
                    variant="outlined"
                    color="primary"
                    sx={{
                      borderRadius:0,
                      paddingX: 1,
                      '&:hover': {
                        bgcolor: 'rgba(245,81,81,0.4)',
                        border: `1px solid ${palette.border.dark}`,
                        boxShadow: '0px 0px 6px 2px rgba(64,64,64, 0.4)',
                        color:'rgba(0,0,0,0.7)',
                        transition: 'box-shadow 0.2s linear 0s'
                      },
                      width:'100%',
                      paddingY: 1,
                      border: `1px solid ${palette.border.light}`,
                      fontSize:14,
                      fontWeight:400,}}
                  >
                    <CancelIcon sx={{mr:1.5}}/>
                    {res.MINOR_FILTER_FOOD_PRICES_CLEAR_FILTER}
                </IconButton>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
  );
}
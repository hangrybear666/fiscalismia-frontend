import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import ContentCardFoodPrices, { ContentCardFoodPrice } from '../minor/ContentCard_FoodPrices';
import { resourceProperties as res, serverConfig } from '../../resources/resource_properties';
import { getAllFoodPricesAndDiscounts } from '../../services/pgConnections';
import FilterFoodPriceData from '../minor/FilterFoodPriceData';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Theme } from '@mui/material';
import { RouteInfo } from '../../types/custom/customTypes';

interface Deals_FoodPricesProps {
  routeInfo: RouteInfo;
}

/**
 * Displays supermarket Food Items and applicable data such as price, brand, calories and images that can be uploaded, deleted and replaced.
 * @param {Deals_FoodPricesProps} _props
 * @returns Collection of ContentCardFoodPrice Objects in a responsive Grid.
 */
export default function Deals_FoodPrices(_props: Deals_FoodPricesProps): JSX.Element {
  // breakpoint
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const [foodPrices, setFoodPrices] = useState(null);
  // id, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date, weight_per_100_kcal, price_per_kg, normalized_price, filepath
  const [filteredFoodPrices, setFilteredFoodPrices] = useState(null);
  const [foodItemCards, setFoodItemCards] = useState<ContentCardFoodPrice[]>([]);
  const [hasBeenSortedBy, setHasBeenSortedBy] = useState<number | null>(null);
  // Render Images yes or no switch
  const [renderImages, setRenderImages] = React.useState(true); // default value

  useEffect(() => {
    const getAllPricesAndDiscounts = async () => {
      const allFoodPrices = await getAllFoodPricesAndDiscounts();
      setFoodPrices(allFoodPrices.results);
      setFoodItemCards(extractCardData(allFoodPrices.results, false));
    };
    if (filteredFoodPrices) {
      setFoodItemCards(extractCardData(filteredFoodPrices, false));
      return;
    }
    getAllPricesAndDiscounts();
  }, [filteredFoodPrices, hasBeenSortedBy]);

  /**
   * Extracts relevant fields from the db query result in order to populate one card per discounted item.
   * @param {any} allFoodDiscounts db query result
   * @param {boolean} initializeWithoutImage overrides any image filepaths present with the 'no-img' placeholder to disable images by default
   * @returns Array of ContentCardFoodPrice Objects
   */
  function extractCardData(allFoodDiscounts: any, initializeWithoutImage: boolean): ContentCardFoodPrice[] {
    const discountedFoodItemCards: ContentCardFoodPrice[] = [];
    allFoodDiscounts.forEach((e: any) => {
      const foodPriceObj: ContentCardFoodPrice = {
        foodItemId: e.id,
        header: `${e.food_item} - ${e.brand}`,
        subtitle: `Gewicht ${e.weight}g`,
        originalPrice: `${e.price}${res.CURRENCY_EURO}`,
        store: e.store,
        pricePerKg: `${e.price_per_kg}${res.CURRENCY_EURO}/kg`,
        kcalAmount: `${e.kcal_amount}kcal/100g`,
        lastUpdated: `zuletzt geprüft ${e.last_update}`,
        details: null,
        img:
          e.img == res.NO_IMG || initializeWithoutImage || !renderImages
            ? res.NO_IMG
            : e.filepath
              ? serverConfig.API_BASE_URL.concat('/').concat(e.filepath)
              : null
      };
      discountedFoodItemCards.push(foodPriceObj);
    });
    return discountedFoodItemCards;
  }

  return (
    <React.Fragment>
      <Grid container spacing={1.5} sx={{ marginTop: 2 }}>
        {/* Horizontal Data Filtering on top on small screens */}
        <Grid xs={12}>
          {foodPrices && isSmallScreen ? (
            <FilterFoodPriceData
              displayHorizontally={true}
              foodPrices={foodPrices}
              filteredFoodPrices={filteredFoodPrices}
              setFilteredFoodPrices={setFilteredFoodPrices}
              hasBeenSortedBy={hasBeenSortedBy}
              setHasBeenSortedBy={setHasBeenSortedBy}
              renderImages={renderImages}
              setRenderImages={setRenderImages}
            />
          ) : null}
        </Grid>
        {/* FOOD ITEM CARDS */}
        <Grid container xs={12} lg={8} xl={9}>
          {foodItemCards
            ? foodItemCards.map((foodItem) => (
                <Grid key={foodItem.foodItemId} xs={12} md={6} lg={6} xl={3}>
                  <ContentCardFoodPrices elevation={6} {...foodItem} imgHeight={150} />
                </Grid>
              ))
            : null}
        </Grid>
        {/* Vertical Data Filtering on right side on large screens */}
        <Grid lg={4} xl={3}>
          <Box sx={{ marginLeft: { lg: 2 } }}>
            {foodPrices && !isSmallScreen ? (
              <FilterFoodPriceData
                displayHorizontally={false}
                foodPrices={foodPrices}
                filteredFoodPrices={filteredFoodPrices}
                setFilteredFoodPrices={setFilteredFoodPrices}
                hasBeenSortedBy={hasBeenSortedBy}
                setHasBeenSortedBy={setHasBeenSortedBy}
                renderImages={renderImages}
                setRenderImages={setRenderImages}
              />
            ) : null}
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
